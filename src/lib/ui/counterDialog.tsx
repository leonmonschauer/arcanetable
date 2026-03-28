import { createSignal, type Component } from 'solid-js';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { TextField, TextFieldInput, TextFieldLabel } from '~/components/ui/text-field';
import { colorHashLight, deckIndex, provider, sendEvent } from '../globals';
import { sha1 } from '../utils';

export const [isCounterDialogOpen, setIsCounterDialogOpen] = createSignal(false);
export const [counters, setCounters] = createSignal([]);

function createCounter(counter) {
  setCounters(counters => {
    if (counters.some(existing => existing.id === counter.id)) return counters;
    return [...counters, counter];
  });
  sendEvent({ type: 'createCounter', counter });
  const localState = provider?.awareness?.getLocalState?.() ?? {};
  provider?.awareness?.setLocalState?.({
    ...localState,
    counters: {
      ...(localState.counters ?? {}),
      [counter.id]: localState?.counters?.[counter.id] ?? 0,
    },
  });

  let decks = JSON.parse(localStorage.getItem('decks') || `{}`);
  decks.decks[deckIndex()].counters = decks.decks[deckIndex()].counters ?? [];
  if (!decks.decks[deckIndex()].counters.some(existing => existing.id === counter.id)) {
    decks.decks[deckIndex()].counters.push(counter);
  }
  localStorage.setItem('decks', JSON.stringify(decks));
}

const CounterDialog: Component = props => {
  return (
    <Dialog open={isCounterDialogOpen()} onOpenChange={setIsCounterDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A Counter</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            async function create() {
              const name = String(formData.get('name') ?? '').trim();
              if (!name) return;
              let id: string;
              try {
                id = await sha1(name);
              } catch (error) {
                // `crypto.subtle` can be unavailable on some non-secure origins.
                id = `counter-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
              }
              formData.set('name', name);
              formData.set('id', id);
              formData.set('color', colorHashLight.hex(name));

              const counter = Object.fromEntries(formData.entries());
              createCounter(counter);
            }
            create();
            e.currentTarget.reset();
            setIsCounterDialogOpen(false);
          }}>
          <TextField>
            <TextFieldLabel for='name'>Name</TextFieldLabel>
            <TextFieldInput type='text' id='name' name='name' />
          </TextField>
          <br />
          <DialogFooter>
            <Button type='submit'>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CounterDialog;
