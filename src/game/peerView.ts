import { CARDS, initialState } from './engine';

const PRIVATE_PENDING_ACTION_TYPES = new Set([
  'ACTIVATE_LAND',
  'BRAINSTORM',
  'DISCARD',
  'DISCARD_CLEANUP',
  'HALIMAR_DEPTHS',
  'HAND_LAND_ACTION',
  'LAND_TYPE_CHOICE',
  'METAMORPHOSE_CONTROL_MAGIC',
  'METAMORPHOSE_DEPLOY',
  'MULLIGAN_BOTTOM',
  'MYSTIC_SANCTUARY',
  'PREDICT',
  'TELLING_TIME'
]);

const swapSeat = (seat) => {
  if (seat === 'player') return 'ai';
  if (seat === 'ai') return 'player';
  return seat ?? null;
};

const swapSeatMap = (record) => ({
  player: record?.ai ?? null,
  ai: record?.player ?? null
});
const swapKnowledgeView = (view) => ({
  knownTop: structuredClone(view?.knownTop || []),
  knownHands: {
    player: structuredClone(view?.knownHands?.ai || []),
    ai: structuredClone(view?.knownHands?.player || [])
  }
});
const swapKnowledgeState = (knowledge) => ({
  player: swapKnowledgeView(knowledge?.ai),
  ai: swapKnowledgeView(knowledge?.player)
});
const swapLogEntry = (entry) => {
  if (typeof entry !== 'string') return entry;
  return entry
    .replace(/\bOpponent's\b/g, '__CODEx_OPP_POS__')
    .replace(/\bYour\b/g, '__CODEx_YOUR__')
    .replace(/\bOpponent\b/g, '__CODEx_OPP__')
    .replace(/\bYou\b/g, 'Opponent')
    .replace(/__CODEx_OPP__/g, 'You')
    .replace(/__CODEx_YOUR__/g, "Opponent's")
    .replace(/__CODEx_OPP_POS__/g, 'Your');
};

const createHiddenCard = (id) => ({
  id,
  name: 'Hidden Card',
  type: 'Hidden',
  cost: 0,
  manaCost: '',
  effect: '',
  stats: null,
  isInstant: false,
  isLand: false,
  image: CARDS.ISLAND_1.image,
  fullImage: CARDS.ISLAND_1.fullImage,
  hidden: true,
  tapped: false,
  summoningSickness: false,
  attacking: false,
  blocking: false,
  isSwamp: false,
  owner: null,
  landType: null,
  blueSources: 0,
  blueRequirement: 0,
  dandanLandType: 'Island',
  enchantedId: null,
  controlledByAuraId: null,
  attachmentOrder: null,
  temporaryTextChangeBaseState: null
});

const hideCards = (cards = [], prefix) => cards.map((_, index) => createHiddenCard(`${prefix}-${index + 1}`));
const createHiddenCardList = (count = 0, prefix) => Array.from({ length: Math.max(0, count) }, (_, index) => createHiddenCard(`${prefix}-${index + 1}`));

const swapPendingAction = (pendingAction) => {
  if (!pendingAction) return null;
  const next = structuredClone(pendingAction);
  if (next.player) next.player = swapSeat(next.player);
  return next;
};

const swapPendingTargetSelection = (pendingTargetSelection) => {
  if (!pendingTargetSelection) return null;
  const next = structuredClone(pendingTargetSelection);
  if (next.player) next.player = swapSeat(next.player);
  return next;
};

const sanitizePendingAction = (pendingAction) => {
  if (!pendingAction) return null;
  if (pendingAction.player && pendingAction.player !== 'player' && PRIVATE_PENDING_ACTION_TYPES.has(pendingAction.type)) {
    return null;
  }
  return pendingAction;
};

const sanitizePendingTargetSelection = (pendingTargetSelection) => {
  if (!pendingTargetSelection) return null;
  return pendingTargetSelection.player && pendingTargetSelection.player !== 'player'
    ? null
    : pendingTargetSelection;
};

const swapSpellTarget = (target) => {
  if (!target?.card) return target;
  return swapStackEntry(target);
};

const swapStackEntry = (entry) => ({
  ...entry,
  controller: swapSeat(entry?.controller),
  target: swapSpellTarget(entry?.target)
});

export const mapGuestActionToCanonical = (action) => {
  const next = structuredClone(action);
  if (next.player) next.player = swapSeat(next.player);
  return next;
};

export const buildPeerGuestViewState = (canonicalState) => {
  const state = structuredClone(canonicalState);
  const swappedPeerMulligan = state.peerMulligan
    ? {
        counts: swapSeatMap(state.peerMulligan.counts),
        kept: swapSeatMap(state.peerMulligan.kept)
      }
    : null;

  const guestViewState = {
    ...state,
    sharedDeckCount: state.deck?.length || 0,
    opponentHandCount: state.player?.hand?.length || 0,
    player: state.ai,
    ai: {
      ...state.player,
      hand: []
    },
    deck: [],
    stack: Array.isArray(state.stack) ? state.stack.map(swapStackEntry) : [],
    turn: swapSeat(state.turn),
    priority: swapSeat(state.priority),
    winner: swapSeat(state.winner),
    floatingMana: swapSeatMap(state.floatingMana),
    hasAttacked: swapSeatMap(state.hasAttacked),
    hasBlocked: swapSeatMap(state.hasBlocked),
    extraTurns: swapSeatMap(state.extraTurns),
    pendingAction: sanitizePendingAction(swapPendingAction(state.pendingAction)),
    pendingTargetSelection: sanitizePendingTargetSelection(swapPendingTargetSelection(state.pendingTargetSelection)),
    peerMulligan: swappedPeerMulligan,
    mulliganCount: swappedPeerMulligan?.counts?.player ?? state.mulliganCount ?? 0,
    knowledge: swapKnowledgeState(state.knowledge || initialState.knowledge),
    log: Array.isArray(state.log) ? state.log.map(swapLogEntry) : []
  };

  return guestViewState;
};

export const inflatePeerGuestViewState = (guestViewState) => {
  const state = structuredClone(guestViewState);
  const opponentHandCount = Number.isFinite(state.opponentHandCount)
    ? state.opponentHandCount
    : state.ai?.hand?.length || 0;
  const sharedDeckCount = Number.isFinite(state.sharedDeckCount)
    ? state.sharedDeckCount
    : state.deck?.length || 0;

  state.ai = {
    ...state.ai,
    hand: createHiddenCardList(opponentHandCount, 'opponent-hand')
  };
  state.deck = createHiddenCardList(sharedDeckCount, 'shared-deck');

  return state;
};
