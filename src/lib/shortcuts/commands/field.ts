import { Mesh } from 'three';
import { provider } from '~/lib/globals';
import { PlayArea } from '~/lib/playArea';

export function untapAll(playArea: PlayArea) {
  const localClientId = provider?.awareness?.clientID;
  let tappedCards = playArea.battlefieldZone.cards
    .map(card => card.mesh)
    .filter(
      mesh =>
        mesh.userData.isTapped &&
        (localClientId === undefined || mesh.userData.clientId === localClientId),
    ) as Mesh[];

  tappedCards.forEach(card => playArea.tap(card));
}

export function syncBattlefieldToOthers(playArea: PlayArea) {
  const localClientId = provider?.awareness?.clientID;
  const cards = playArea.battlefieldZone.cards
    .map(card => card.mesh)
    .filter(mesh => mesh.userData.clientId === localClientId)
    .map(mesh => ({
      id: mesh.userData.id,
      isTapped: !!mesh.userData.isTapped,
      isFlipped: !!mesh.userData.isFlipped,
      position: mesh.position.toArray(),
      rotation: mesh.rotation.toArray(),
    }));

  playArea.emitEvent({
    type: 'syncBattlefieldState',
    payload: { cards },
  });
}
