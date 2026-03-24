import { trainedPolicy } from '../trainedPolicy';

// --- CARD DATABASE (SLD FORGETFUL FISH) ---
const buildCard = (id, name, type, cost, manaCost, effect, stats = null, isInstant = false, isLand = false) => ({
  name, type, cost, manaCost, effect, stats, isInstant, isLand,
  image: `https://api.scryfall.com/cards/sld/${id}?format=image&version=art_crop`,
  fullImage: `https://api.scryfall.com/cards/sld/${id}?format=image&version=normal`
});

export const CARDS = {
  DANDAN: buildCard(2138, 'DandÃ¢n', 'Creature â€” Fish', 2, '{U}{U}', "DandÃ¢n attacks each combat if able.\nDandÃ¢n can't attack unless defending player controls an Island.\nWhen you control no Islands, sacrifice DandÃ¢n.", '4/1', false, false),
  DANDAN_ALT: buildCard(2139, 'DandÃ¢n', 'Creature â€” Fish', 2, '{U}{U}', "DandÃ¢n attacks each combat if able.\nDandÃ¢n can't attack unless defending player controls an Island.\nWhen you control no Islands, sacrifice DandÃ¢n.", '4/1', false, false),
  ACCUMULATED_KNOWLEDGE: buildCard(2140, 'Accumulated Knowledge', 'Instant', 2, '{1}{U}', "Draw a card, then draw cards equal to the number of cards named Accumulated Knowledge in all graveyards.", null, true, false),
  MAGICAL_HACK: buildCard(2141, 'Magical Hack', 'Instant', 1, '{U}', "Change the text of target permanent by replacing all instances of one basic land type with another.", null, true, false),
  MEMORY_LAPSE: buildCard(2142, 'Memory Lapse', 'Instant', 2, '{1}{U}', "Counter target spell. If that spell is countered this way, put it on top of its owner's library instead of into that player's graveyard.", null, true, false),
  MYSTIC_SANCTUARY: buildCard(2143, 'Mystic Sanctuary', 'Land â€” Island', 0, '', "Enters tapped unless you control 3+ other Islands. When it enters untapped, you may put target inst/sorc from grave on top.", null, false, true),
  ISLAND_1: buildCard(2144, 'Island', 'Basic Land â€” Island', 0, '', "({T}: Add {U}.)", null, false, true),
  ISLAND_2: buildCard(2145, 'Island', 'Basic Land â€” Island', 0, '', "({T}: Add {U}.)", null, false, true),
  ISLAND_3: buildCard(2146, 'Island', 'Basic Land â€” Island', 0, '', "({T}: Add {U}.)", null, false, true),
  ISLAND_4: buildCard(2147, 'Island', 'Basic Land â€” Island', 0, '', "({T}: Add {U}.)", null, false, true),
  BRAINSTORM: buildCard(2148, 'Brainstorm', 'Instant', 1, '{U}', "Draw 3 cards, then put 2 cards from your hand on top of your library in any order.", null, true, false),
  CAPTURE: buildCard(2149, 'Capture of Jingzhou', 'Sorcery', 5, '{3}{U}{U}', "Take an extra turn after this one.", null, false, false),
  CHART: buildCard(2150, 'Chart a Course', 'Sorcery', 2, '{1}{U}', "Draw 2 cards. Then discard a card unless you attacked with a creature this turn.", null, false, false),
  CONTROL_MAGIC: buildCard(2151, 'Control Magic', 'Enchantment â€” Aura', 4, '{2}{U}{U}', "Enchant creature. You control enchanted creature.", null, false, false),
  CRYSTAL_SPRAY: buildCard(2152, 'Crystal Spray', 'Instant', 3, '{2}{U}', "Change the text of target permanent by replacing all instances of one color word or basic land type with another. Draw a card.", null, true, false),
  DAYS_UNDOING: buildCard(2153, "Day's Undoing", 'Sorcery', 3, '{2}{U}', "Each player shuffles hand and grave into library, draws 7. If it's your turn, end the turn.", null, false, false),
  MENTAL_NOTE: buildCard(2154, 'Mental Note', 'Instant', 1, '{U}', "Mill 2 cards, then draw a card.", null, true, false),
  METAMORPHOSE: buildCard(2155, 'Metamorphose', 'Instant', 2, '{1}{U}', "Put target permanent on top of its owner's library.", null, true, false),
  PREDICT: buildCard(2156, 'Predict', 'Instant', 2, '{1}{U}', "Name a card. Target player mills 1. If it's the named card, draw 2. Otherwise draw 1.", null, true, false),
  TELLING_TIME: buildCard(2157, 'Telling Time', 'Instant', 2, '{1}{U}', "Look at top 3. Put one in hand, one on top, one on bottom.", null, true, false),
  UNSUBSTANTIATE: buildCard(2158, 'Unsubstantiate', 'Instant', 2, '{1}{U}', "Return target spell or creature to its owner's hand.", null, true, false),
  HALIMAR: buildCard(2159, 'Halimar Depths', 'Land', 0, '', "Enters tapped. When it enters, look at top 3 cards of your library, put back in any order.", null, false, true),
  FENGRAF: buildCard(2160, 'Haunted Fengraf', 'Land', 0, '', "{T}: Add {C}. {3}, {T}, Sac: Return random creature from grave to hand.", null, false, true),
  SANDBAR: buildCard(2161, 'Lonely Sandbar', 'Land', 0, '', "Enters tapped. {T}: Add {U}. Cycling {U}.", null, false, true),
  REMOTE_ISLE: buildCard(2162, 'Remote Isle', 'Land', 0, '', "Enters tapped. {T}: Add {U}. Cycling {2}.", null, false, true),
  SURGICAL_BAY: buildCard(2163, 'The Surgical Bay', 'Land', 0, '', "Enters tapped. {T}: Add {U}. {U}, {T}, Sac: Draw a card.", null, false, true),
  TEMPLE: buildCard(2164, 'Svyelunite Temple', 'Land', 0, '', "Enters tapped. {T}: Add {U}. {T}, Sac: Add {U}{U}.", null, false, true)
};

const DECKLIST = [
  ...Array(5).fill(CARDS.DANDAN), ...Array(5).fill(CARDS.DANDAN_ALT), ...Array(4).fill(CARDS.ACCUMULATED_KNOWLEDGE), ...Array(2).fill(CARDS.MAGICAL_HACK), ...Array(8).fill(CARDS.MEMORY_LAPSE),
  ...Array(2).fill(CARDS.BRAINSTORM), ...Array(2).fill(CARDS.CRYSTAL_SPRAY), ...Array(2).fill(CARDS.MENTAL_NOTE), ...Array(2).fill(CARDS.METAMORPHOSE),
  ...Array(2).fill(CARDS.PREDICT), ...Array(2).fill(CARDS.TELLING_TIME), ...Array(2).fill(CARDS.UNSUBSTANTIATE), ...Array(5).fill(CARDS.ISLAND_1),
  ...Array(5).fill(CARDS.ISLAND_2), ...Array(5).fill(CARDS.ISLAND_3), ...Array(5).fill(CARDS.ISLAND_4), ...Array(2).fill(CARDS.MYSTIC_SANCTUARY),
  ...Array(2).fill(CARDS.HALIMAR), ...Array(2).fill(CARDS.FENGRAF), ...Array(2).fill(CARDS.SANDBAR), ...Array(2).fill(CARDS.REMOTE_ISLE),
  ...Array(2).fill(CARDS.SURGICAL_BAY), ...Array(2).fill(CARDS.TEMPLE), ...Array(2).fill(CARDS.CAPTURE), ...Array(2).fill(CARDS.CHART),
  ...Array(2).fill(CARDS.DAYS_UNDOING), ...Array(2).fill(CARDS.CONTROL_MAGIC)
];

export const SHARED_DECK_SIZE = DECKLIST.length;

export const PREDICT_OPTIONS = Array.from(new Set(Object.values(CARDS).map(c => c.name))).sort();
export const DANDAN_NAME = CARDS.DANDAN.name;
export const INSTANT_OR_SORCERY_TYPES = ['Instant', 'Sorcery'];
export const AI_DIFFICULTIES = ['easy', 'medium', 'hard'];
export const AI_DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
export const AI_SPEED = { easy: { think: 900, pass: 250, resolve: 700 }, medium: { think: 450, pass: 120, resolve: 250 }, hard: { think: 140, pass: 40, resolve: 70 } };
const DEFAULT_POLICY_WEIGHTS = {
  easy: { aggression: 0.75, control: 0.25, drawBias: 0.25, mistakeRate: 0.35, landLimit: 3.6, counterBias: 0.45, stealBias: 0.55, attackBias: 0.75, blockBias: 0.7 },
  medium: { aggression: 1.0, control: 0.55, drawBias: 0.5, mistakeRate: 0.12, landLimit: 4.2, counterBias: 0.9, stealBias: 0.95, attackBias: 0.95, blockBias: 0.95 }
};

const generateId = () => Math.random().toString(36).substr(2, 9);
const randomChoice = (list) => list[Math.floor(Math.random() * list.length)];
const normalizePolicy = (policy) => ({
  aggression: policy.aggression ?? 1,
  control: policy.control ?? 0.5,
  drawBias: policy.drawBias ?? 0.5,
  mistakeRate: policy.mistakeRate ?? 0.1,
  landLimit: policy.landLimit ?? 4,
  counterBias: policy.counterBias ?? policy.control ?? 0.5,
  stealBias: policy.stealBias ?? policy.control ?? 0.5,
  attackBias: policy.attackBias ?? policy.aggression ?? 1,
  blockBias: policy.blockBias ?? policy.control ?? 0.5
});
export const getLivePolicyWeights = (difficulty) => normalizePolicy(difficulty === 'hard' ? trainedPolicy.weights : DEFAULT_POLICY_WEIGHTS[difficulty]);

const EMPTY_MANA_POOL = { total: 0, blue: 0 };

const getBlueSources = (card) => {
  if (!card.isLand) return 0;
  if (card.name === 'Haunted Fengraf') return 0;
  if (card.name === 'The Surgical Bay' || card.name === 'Svyelunite Temple' || card.name === 'Lonely Sandbar' || card.name === 'Remote Isle' || card.name === 'Halimar Depths') return 1;
  return card.type.includes('Island') ? 1 : 0;
};

const getBlueRequirement = (manaCost) => (manaCost.match(/\{U\}/g) || []).length;
const isCreatureTemplate = (card) => Boolean(card) && (card.type?.includes('Creature') || card.name === DANDAN_NAME);

const initializeDeck = () => {
  let deck = DECKLIST.map(card => ({
    ...card,
    id: generateId(),
    tapped: false,
    summoningSickness: isCreatureTemplate(card),
    attacking: false,
    blocking: false,
    isSwamp: false,
    owner: null,
    landType: card.type.includes('Island') ? 'Island' : null,
    blueSources: getBlueSources(card),
    blueRequirement: getBlueRequirement(card.manaCost),
    dandanLandType: 'Island',
    enchantedId: null,
    controlledByAuraId: null,
    attachmentOrder: null
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const getLandType = (card) => card.landType || null;
const getDandanLandType = (card) => card.dandanLandType || 'Island';
const boardHasLandType = (board, landType) => board.some(c => c.isLand && getLandType(c) === landType);
export const controlsIsland = (board) => boardHasLandType(board, 'Island');
const isCreatureCard = (card) => isCreatureTemplate(card);
const normalizeManaPool = (pool = EMPTY_MANA_POOL) => ({
  total: pool?.total || 0,
  blue: pool?.blue || 0
});
const clearAttachmentState = (card) => ({
  ...card,
  enchantedId: null,
  controlledByAuraId: null,
  attachmentOrder: null
});
const preparePermanentForZoneChange = (card, overrides = {}) => ({
  ...clearAttachmentState(card),
  tapped: false,
  attacking: false,
  blocking: false,
  summoningSickness: isCreatureCard(card),
  ...overrides
});
export const getManaStats = (board, pool = EMPTY_MANA_POOL) => {
  const normalizedPool = normalizeManaPool(pool);
  return {
    total: board.filter(c => c.isLand && !c.tapped).length + normalizedPool.total,
    blue: board.filter(c => c.isLand && !c.tapped && (c.blueSources || 0) > 0).length + normalizedPool.blue
  };
};
const cloneBoard = (board) => board.map(card => ({ ...card }));
const spendMana = (board, pool = EMPTY_MANA_POOL, totalCost, blueCost = 0) => {
  let remainingTotal = totalCost;
  let remainingBlue = blueCost;
  const nextBoard = cloneBoard(board);
  const nextPool = normalizeManaPool(pool);

  const spendBluePool = Math.min(nextPool.blue, remainingBlue);
  nextPool.blue -= spendBluePool;
  nextPool.total -= spendBluePool;
  remainingBlue -= spendBluePool;
  remainingTotal -= spendBluePool;

  nextBoard.forEach(card => {
    if (remainingBlue > 0 && card.isLand && !card.tapped && (card.blueSources || 0) > 0) {
      card.tapped = true;
      remainingBlue--;
      remainingTotal--;
    }
  });

  const spendNonBluePool = Math.min(Math.max(0, nextPool.total - nextPool.blue), remainingTotal);
  nextPool.total -= spendNonBluePool;
  remainingTotal -= spendNonBluePool;

  nextBoard.forEach(card => {
    if (remainingTotal > 0 && card.isLand && !card.tapped && (card.blueSources || 0) === 0) {
      card.tapped = true;
      remainingTotal--;
    }
  });

  const spendBluePoolForGeneric = Math.min(nextPool.blue, remainingTotal);
  nextPool.blue -= spendBluePoolForGeneric;
  nextPool.total -= spendBluePoolForGeneric;
  remainingTotal -= spendBluePoolForGeneric;

  nextBoard.forEach(card => {
    if (remainingTotal > 0 && card.isLand && !card.tapped) {
      card.tapped = true;
      remainingTotal--;
    }
  });

  return { board: nextBoard, pool: nextPool };
};
const canPayCost = (board, pool, totalCost, blueCost = 0) => {
  const mana = getManaStats(board, pool);
  return mana.total >= totalCost && mana.blue >= blueCost;
};
const clearFloatingMana = (state) => {
  state.floatingMana = {
    player: { total: 0, blue: 0 },
    ai: { total: 0, blue: 0 }
  };
  return state;
};
const addFloatingMana = (state, player, total, blue = total) => {
  const current = normalizeManaPool(state.floatingMana?.[player]);
  state.floatingMana[player] = {
    total: current.total + total,
    blue: current.blue + blue
  };
};
export const getManaPool = (state, player = 'player') => normalizeManaPool(state.floatingMana?.[player]);
export const getAvailableMana = (board, state = null, player = 'player') => getManaStats(board, state ? getManaPool(state, player) : EMPTY_MANA_POOL).total;
export const getAvailableBlueMana = (board, state = null, player = 'player') => getManaStats(board, state ? getManaPool(state, player) : EMPTY_MANA_POOL).blue;

// --- GAME STATE ENGINE ---
export const initialState = {
  started: false, deck: [], graveyard: [], stack: [], turn: 'player', phase: 'mulligan', priority: 'player', 
  consecutivePasses: 0, actionCount: 0, pendingTargetSelection: null, pendingAction: null,
  mulliganCount: 0, isFirstTurn: true,
  gameMode: 'player',
  difficulty: 'medium',
  player: { life: 20, hand: [], board: [], landsPlayed: 0 },
  ai: { life: 20, hand: [], board: [], landsPlayed: 0 },
  floatingMana: { player: { total: 0, blue: 0 }, ai: { total: 0, blue: 0 } },
  hasAttacked: { player: false, ai: false },
  hasBlocked: { player: false, ai: false },
  extraTurns: { player: 0, ai: 0 },
  winner: null, log: [], stackResolving: false
};
const untapBoard = (board) => board.map(c => ({ ...c, tapped: false, summoningSickness: false, attacking: false, blocking: false }));

const drawCards = (s, player, count) => {
  for(let i=0; i<count; i++) {
     if(s.deck.length > 0) {
        const c = s.deck.pop();
        c.owner = player; // Track owner for Unsubstantiate/Metamorphose bounces!
        s[player].hand.push(c);
     }
  }
};

const drawAlternating = (s, firstPlayer, count) => {
  const secondPlayer = firstPlayer === 'player' ? 'ai' : 'player';
  for (let i = 0; i < count; i++) {
    drawCards(s, firstPlayer, 1);
    drawCards(s, secondPlayer, 1);
  }
};

const syncControlEffects = (state) => {
  let changed = false;
  const stripBoardMarker = ({ currentController, ...card }) => card;
  const allBoardCards = ['player', 'ai'].flatMap(controller =>
    state[controller].board.map(card => ({ ...card, currentController: controller }))
  );
  const allCreatures = allBoardCards.filter(card => isCreatureCard(card));
  const creatureIds = new Set(allCreatures.map(card => card.id));
  const aurasByCreatureId = {};
  const nextBoards = { player: [], ai: [] };

  allBoardCards.forEach(card => {
    if (card.name === 'Control Magic') return;
    if (isCreatureCard(card)) return;
    nextBoards[card.currentController].push(stripBoardMarker(card));
  });

  allBoardCards
    .filter(card => card.name === 'Control Magic')
    .forEach(card => {
      if (card.enchantedId && creatureIds.has(card.enchantedId)) {
        const normalizedAura = {
          ...card,
          owner: card.owner || card.currentController,
          attachmentOrder: card.attachmentOrder ?? 0
        };
        if (!aurasByCreatureId[card.enchantedId]) aurasByCreatureId[card.enchantedId] = [];
        aurasByCreatureId[card.enchantedId].push(normalizedAura);
        nextBoards[card.currentController].push(stripBoardMarker(normalizedAura));
        return;
      }

      state.graveyard.push({ ...clearAttachmentState(stripBoardMarker(card)), owner: card.owner || card.currentController });
      changed = true;
    });

  allCreatures.forEach(card => {
    const owner = card.owner || card.currentController;
    const attachedAuras = [...(aurasByCreatureId[card.id] || [])].sort((a, b) => (a.attachmentOrder || 0) - (b.attachmentOrder || 0));
    const winningAura = attachedAuras.length > 0 ? attachedAuras[attachedAuras.length - 1] : null;
    const targetController = winningAura ? winningAura.currentController : owner;
    const controllerChanged = targetController !== card.currentController;
    const nextControlledByAuraId = winningAura?.id || null;
    const nextCreature = {
      ...stripBoardMarker(card),
      controlledByAuraId: nextControlledByAuraId,
      summoningSickness: controllerChanged ? true : card.summoningSickness,
      attacking: controllerChanged ? false : card.attacking,
      blocking: controllerChanged ? false : card.blocking
    };

    if (controllerChanged || card.controlledByAuraId !== nextControlledByAuraId) {
      changed = true;
    }

    nextBoards[targetController].push(nextCreature);
  });

  state.player.board = nextBoards.player;
  state.ai.board = nextBoards.ai;

  return { state, changed };
};

const checkStateBasedActions = (state) => {
  let newState = {
    ...state,
    player: { ...state.player, board: [...state.player.board] },
    ai: { ...state.ai, board: [...state.ai.board] },
    graveyard: [...state.graveyard],
    log: [...state.log]
  };
  let changesMade = false;

  for (let pass = 0; pass < 4; pass++) {
    let changedThisPass = false;
    const syncResult = syncControlEffects(newState);
    newState = syncResult.state;
    changedThisPass = changedThisPass || syncResult.changed;

    ['player', 'ai'].forEach(p => {
      const dandans = newState[p].board.filter(c => c.name === DANDAN_NAME);
      const deadDandans = dandans.filter(c => !boardHasLandType(newState[p].board, getDandanLandType(c)));
      if (deadDandans.length > 0) {
        newState[p].board = newState[p].board.filter(c => !deadDandans.includes(c));
        newState.graveyard = [...newState.graveyard, ...deadDandans.map(card => preparePermanentForZoneChange(card))];
        newState.log = [...newState.log, `${p === 'player' ? 'Your' : "AI's"} DandÃ¢ns died (no ${getDandanLandType(deadDandans[0])}s).`];
        changedThisPass = true;
      }
      if (newState[p].life <= 0 && !newState.winner) {
        newState.winner = p === 'player' ? 'ai' : 'player';
        changedThisPass = true;
      }
    });

    changesMade = changesMade || changedThisPass;
    if (!changedThisPass) break;
  }

  return changesMade ? newState : state;
};

const getActivationDetails = (cardName) => {
  if (cardName === 'The Surgical Bay') return { total: 1, blue: 1, effect: 'draw' };
  if (cardName === 'Svyelunite Temple') return { total: 0, blue: 0, effect: 'double_blue' };
  if (cardName === 'Haunted Fengraf') return { total: 3, blue: 0, effect: 'fengraf' };
  return null;
};

const getCyclingCost = (cardName) => {
  if (cardName === 'Lonely Sandbar') return { total: 1, blue: 1 };
  if (cardName === 'Remote Isle') return { total: 2, blue: 0 };
  return null;
};

export const isActivatable = (card, state, player = 'player') => {
  if (state.priority !== player) return false;
  if (state.pendingTargetSelection || state.pendingAction) return false;
  if (card.tapped || !card.isLand) return false;
  
  const activation = getActivationDetails(card.name);
  if (!activation) return false;

  if (!canPayCost(state[player].board.filter(c => c.id !== card.id), getManaPool(state, player), activation.total, activation.blue)) return false;
  
  if (card.name === 'Haunted Fengraf' && !state.graveyard.some(isCreatureCard)) return false;

  return true;
};

export const isCyclable = (card, state, player = 'player') => {
  if (state.priority !== player) return false;
  if (state.pendingTargetSelection || state.pendingAction) return false;
  if (!state[player].hand.some(c => c.id === card.id)) return false;

  const cyclingCost = getCyclingCost(card.name);
  if (!cyclingCost) return false;

  return canPayCost(state[player].board, getManaPool(state, player), cyclingCost.total, cyclingCost.blue);
};

export const isCastable = (card, state, player = 'player') => {
  if (state.priority !== player) return false;
  if (state.pendingTargetSelection || state.pendingAction) return false;
  if (!canPayCost(state[player].board, getManaPool(state, player), card.cost, card.blueRequirement || 0)) return false;
  
  const isMainPhase = state.phase === 'main1' || state.phase === 'main2';
  if (card.isLand) {
     return state.turn === player && isMainPhase && state[player].landsPlayed < 1 && state.stack.length === 0;
  }
  
  if (!card.isInstant && (state.turn !== player || !isMainPhase || state.stack.length > 0)) return false;
  
  const anyDandan = state.player.board.some(b => b.name === 'DandÃ¢n') || state.ai.board.some(b => b.name === 'DandÃ¢n');
  const opp = player === 'player' ? 'ai' : 'player';
  if (card.name === 'Memory Lapse' && state.stack.length === 0) return false;
  if (card.name === 'Unsubstantiate' && state.stack.length === 0 && !anyDandan) return false;
  
  if (['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(card.name) && state.stack.length === 0 && state.player.board.length === 0 && state.ai.board.length === 0) return false;
  if (card.name === 'Control Magic' && ![...state.player.board, ...state.ai.board].some(isCreatureCard)) return false;

  return true;
};

export const isValidTarget = (card, zone, state) => {
  if (!state.pendingTargetSelection) return false;
  const spellName = state.pendingTargetSelection.spellName;
  
  if (spellName === 'Memory Lapse') return zone === 'stack';
  if (spellName === 'Unsubstantiate') return zone === 'stack' || (zone === 'board' && card.name === 'DandÃ¢n');
  if (['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(spellName)) return zone === 'board';
  if (spellName === 'Control Magic') return zone === 'board' && isCreatureCard(card);
  return false;
};

// SMART AUTO-PASS SYSTEM
export const checkHasActions = (s, p) => {
  if (s.phase === 'mulligan') return true;
  if (s.pendingTargetSelection || s.pendingAction) return true;
  
  const opp = p === 'player' ? 'ai' : 'player';
  const hasValidAttacker = s[p].board.some(c => c.name === 'DandÃ¢n' && !c.summoningSickness && !c.tapped && boardHasLandType(s[opp].board, getDandanLandType(c)));
  const hasValidBlocker = s[p].board.some(c => c.name === 'DandÃ¢n' && !c.tapped);

  if (s.turn === p && s.phase !== 'declare_attackers' && s.phase !== 'declare_blockers' && s.phase !== 'upkeep' && s[p].landsPlayed < 1 && s[p].hand.some(c => c.isLand)) return true;
  
  if (s.turn === p && s.phase === 'declare_attackers') {
     if (hasValidAttacker) return true;
  }
  if (s.turn !== p && s.phase === 'declare_blockers' && hasValidBlocker) return true;
  
  for (const c of s[p].hand) {
    if (isCyclable(c, s, p)) return true;
    if (isCastable(c, s, p)) {
        if (s.stack.length === 0) {
           if (s.phase === 'declare_attackers' && !hasValidAttacker && s[s.turn].board.filter(x=>x.attacking).length === 0) continue;
           if (s.phase === 'declare_blockers' && s[s.turn === 'player' ? 'ai' : 'player'].board.filter(x=>x.attacking).length === 0) continue;
        }
        return true;
    }
  }
  for (const b of s[p].board) {
    if (isActivatable(b, s, p)) {
        if (s.stack.length === 0) {
           if (s.phase === 'declare_attackers' && !hasValidAttacker && s[s.turn].board.filter(x=>x.attacking).length === 0) continue;
           if (s.phase === 'declare_blockers' && s[s.turn === 'player' ? 'ai' : 'player'].board.filter(x=>x.attacking).length === 0) continue;
        }
        return true;
    }
  }
  return false;
};

const shouldMakeMistake = (rate, policy) => Math.random() < Math.max(rate, policy?.mistakeRate ?? 0);
const HIGH_IMPACT_SPELLS = new Set([DANDAN_NAME, 'Control Magic', 'Capture of Jingzhou', "Day's Undoing"]);
const BASE_CARD_VALUES = {
  [DANDAN_NAME]: 11,
  'Accumulated Knowledge': 6,
  'Magical Hack': 4,
  'Memory Lapse': 8,
  'Mystic Sanctuary': 6,
  'Island': 5,
  'Brainstorm': 7,
  'Capture of Jingzhou': 9,
  'Chart a Course': 6,
  'Control Magic': 10,
  'Crystal Spray': 5,
  "Day's Undoing": 5,
  'Mental Note': 5,
  'Metamorphose': 7,
  'Predict': 8,
  'Telling Time': 7,
  'Unsubstantiate': 7,
  'Halimar Depths': 6,
  'Haunted Fengraf': 3,
  'Lonely Sandbar': 4,
  'Remote Isle': 3,
  'The Surgical Bay': 4,
  'Svyelunite Temple': 4
};
const getBaseCardValue = (card) => BASE_CARD_VALUES[card?.name] ?? (card?.isLand ? 4 : 2);
const getTopDeckCard = (state, offset = 0) => {
  const index = state.deck.length - 1 - offset;
  return index >= 0 ? state.deck[index] : null;
};
const getTopDeckCards = (state, count) => Array.from({ length: Math.max(0, Math.min(count, state.deck.length)) }, (_unused, index) => getTopDeckCard(state, index)).filter(Boolean);
const canPayCardNow = (state, actor, card, board = state[actor].board, pool = getManaPool(state, actor)) => Boolean(card) && canPayCost(board, pool, card.cost, card.blueRequirement || 0);
const canLikelyCastNextTurn = (state, actor, card) => {
  if (!card) return false;
  if (card.isLand || (!card.isInstant && state.turn !== actor)) {
    const total = state[actor].board.filter(permanent => permanent.isLand).length;
    const blue = state[actor].board.filter(permanent => permanent.isLand && (permanent.blueSources || 0) > 0).length;
    return total >= card.cost && blue >= (card.blueRequirement || 0);
  }
  return canPayCardNow(state, actor, card);
};
const getLiveInteractionCards = (state, actor, names) => state[actor].hand.filter(card => names.includes(card.name) && card.isInstant && canPayCardNow(state, actor, card));
const hasLiveInteraction = (state, actor, names) => getLiveInteractionCards(state, actor, names).length > 0;
const getHandQuality = (state, actor) => state[actor].hand.reduce((sum, card) => sum + getBaseCardValue(card), 0);
const wantsPredictSetup = (state, actor) => state[actor].hand.some(card => card.name === 'Predict') && state.deck.length > 0;
const getAiCardValue = (state, actor, card, policy) => {
  if (!card) return Number.NEGATIVE_INFINITY;

  const opponent = actor === 'player' ? 'ai' : 'player';
  const landsInPlay = state[actor].board.filter(permanent => permanent.isLand).length;
  const spareLands = state[actor].hand.filter(permanent => permanent.isLand).length;
  const actorHasIsland = controlsIsland(state[actor].board);
  const opponentHasIsland = controlsIsland(state[opponent].board);
  const actorCounters = getLiveInteractionCards(state, actor, ['Memory Lapse', 'Unsubstantiate']).length;
  const opponentCounters = getLiveInteractionCards(state, opponent, ['Memory Lapse', 'Unsubstantiate']).length;
  const supportedOpponentDandans = countDandans(state[opponent].board, permanent => isDandanSupported(permanent, state[opponent].board));
  const graveAkCount = state.graveyard.filter(permanent => permanent.name === 'Accumulated Knowledge').length;
  const topCards = getTopDeckCards(state, 3);
  const lowValueTopCards = topCards.filter(topCard => getBaseCardValue(topCard) <= 4).length;
  let score = getBaseCardValue(card);

  if (card.isLand) {
    score += landsInPlay < 3 ? 4.5 : landsInPlay < 5 ? 2.2 : 0.4;
    if (spareLands > 2) score -= 2.5;
    if (card.name === 'Mystic Sanctuary' && state.graveyard.some(permanent => INSTANT_OR_SORCERY_TYPES.some(type => permanent.type?.includes(type)))) score += 2;
    if (card.name === 'Halimar Depths') score += 1.2;
    if (card.name === 'The Surgical Bay' && state[actor].hand.length <= 3) score += 1.5;
    if (card.name === 'Haunted Fengraf' && !state.graveyard.some(isCreatureCard)) score -= 2.5;
    if ((card.blueSources || 0) === 0 && state[actor].hand.some(spell => !spell.isLand && (spell.blueRequirement || 0) > 1)) score -= 2;
    return score;
  }

  switch (card.name) {
    case DANDAN_NAME:
      score += actorHasIsland && opponentHasIsland ? 4.5 : actorHasIsland ? 1.5 : -4.5;
      score += state[opponent].life <= 8 ? 3.5 : 0;
      score += state[actor].hand.filter(permanent => permanent.name === DANDAN_NAME).length > 1 ? 1.2 : 0;
      score += actorCounters > 0 ? 1.5 : 0;
      score -= opponentCounters > actorCounters ? 3.5 : 0;
      score -= state[opponent].hand.some(permanent => permanent.name === 'Control Magic' && canLikelyCastNextTurn(state, opponent, permanent)) ? 2 : 0;
      break;
    case 'Memory Lapse':
      score += state[opponent].hand.some(permanent => HIGH_IMPACT_SPELLS.has(permanent.name) && canLikelyCastNextTurn(state, opponent, permanent)) ? 4 : 1.5;
      break;
    case 'Unsubstantiate':
      score += state[opponent].hand.some(permanent => HIGH_IMPACT_SPELLS.has(permanent.name) && canLikelyCastNextTurn(state, opponent, permanent)) ? 3.5 : 1.2;
      score += supportedOpponentDandans > 0 ? 2 : 0;
      break;
    case 'Control Magic':
      score += supportedOpponentDandans * 3.2;
      break;
    case 'Capture of Jingzhou':
      score += landsInPlay >= 5 ? 4 : 0;
      score += countDandans(state[actor].board, permanent => isDandanSupported(permanent, state[actor].board)) > 0 ? 2 : 0;
      score += state[opponent].life <= 8 ? 2.5 : 0;
      break;
    case "Day's Undoing":
      score += Math.max(0, state[opponent].hand.length - state[actor].hand.length) * 1.8;
      score += state[actor].hand.length <= 2 ? 3.5 : 0;
      score -= state[actor].hand.length >= 5 ? 4.5 : 0;
      score -= getHandQuality(state, actor) > getHandQuality(state, opponent) ? 2.5 : 0;
      break;
    case 'Accumulated Knowledge':
      score += graveAkCount * 2.2;
      break;
    case 'Predict':
      score += state.deck.length > 0 ? 4 : -8;
      score += wantsPredictSetup(state, actor) ? 1.2 : 0;
      break;
    case 'Brainstorm':
      score += state.deck.length >= 2 ? 2.2 : 0;
      score += wantsPredictSetup(state, actor) ? 2.4 : 0;
      break;
    case 'Telling Time':
      score += state.deck.length >= 3 ? 2.5 : state.deck.length;
      score += wantsPredictSetup(state, actor) ? 1.6 : 0;
      break;
    case 'Mental Note':
      score += lowValueTopCards * 1.8;
      score += graveAkCount * 0.8;
      break;
    case 'Chart a Course':
      score += state.hasAttacked[actor] ? 2.4 : -0.8;
      break;
    case 'Magical Hack':
    case 'Crystal Spray':
      score += (pickTransformTarget(state, actor)?.score || 0) * 0.55;
      break;
    case 'Metamorphose':
      score += (pickBounceTarget(state, actor)?.score || 0) * 0.5;
      break;
    default:
      break;
  }

  return score;
};
const getAiLibraryOrder = (state, actor, cards, policy) => {
  const scored = [...cards].map(card => ({ card, score: getAiCardValue(state, actor, card, policy) }));
  if (scored.length <= 1) return scored.map(entry => entry.card);
  if (wantsPredictSetup(state, actor)) {
    const ascending = [...scored].sort((left, right) => left.score - right.score || left.card.cost - right.card.cost);
    const [predictFood, ...rest] = ascending;
    return [predictFood.card, ...rest.sort((left, right) => right.score - left.score || right.card.cost - left.card.cost).map(entry => entry.card)];
  }
  return scored.sort((left, right) => right.score - left.score || left.card.cost - right.card.cost).map(entry => entry.card);
};
const getAiPutBackCards = (state, actor, count, policy) => {
  const chosen = [...state[actor].hand]
    .sort((left, right) => getAiCardValue(state, actor, left, policy) - getAiCardValue(state, actor, right, policy) || left.cost - right.cost)
    .slice(0, count);

  if (chosen.length <= 1) return chosen;
  if (wantsPredictSetup(state, actor)) {
    const ascending = [...chosen].sort((left, right) => getAiCardValue(state, actor, left, policy) - getAiCardValue(state, actor, right, policy) || left.cost - right.cost);
    return [...ascending.slice(1), ascending[0]];
  }

  return chosen;
};
const getAiTellingTimePlan = (state, actor, cards, policy) => {
  const ordered = [...cards].sort((left, right) => getAiCardValue(state, actor, right, policy) - getAiCardValue(state, actor, left, policy) || left.cost - right.cost);
  const handCard = ordered[0] || null;
  const remaining = ordered.slice(1);
  if (remaining.length === 0) return { handCard, topCard: null, bottomCard: null };
  if (wantsPredictSetup(state, actor)) {
    const ascending = [...remaining].sort((left, right) => getAiCardValue(state, actor, left, policy) - getAiCardValue(state, actor, right, policy) || left.cost - right.cost);
    return {
      handCard,
      topCard: ascending[0] || null,
      bottomCard: ascending[1] || null
    };
  }
  return {
    handCard,
    topCard: remaining[0] || null,
    bottomCard: remaining[1] || null
  };
};
const getAiSanctuaryTarget = (state, actor, validSpells, policy) => [...validSpells]
  .sort((left, right) => getAiCardValue(state, actor, right, policy) - getAiCardValue(state, actor, left, policy) || left.cost - right.cost)[0] || null;
const getAiPredictGuess = (state) => getTopDeckCard(state)?.name || DANDAN_NAME;
export const pickAiPendingCards = (state, actor, count, policy) => {
  const chosen = [...state[actor].hand]
    .sort((left, right) => getAiCardValue(state, actor, left, policy) - getAiCardValue(state, actor, right, policy) || left.cost - right.cost)
    .slice(0, count);
  return chosen.map(card => card.id);
};
export const getSpellPriority = (card, policy) => {
  switch (card.name) {
    case 'Control Magic': return 6 + policy.control * 4;
    case 'Capture of Jingzhou': return 4 + policy.control * 3 + policy.drawBias;
    case "Day's Undoing": return 3 + policy.drawBias * 4;
    case 'Accumulated Knowledge': return 3 + policy.drawBias * 3;
    case 'Chart a Course': return 2 + policy.drawBias * 2;
    case 'Brainstorm': return 2 + policy.drawBias * 2;
    case 'Telling Time': return 1 + policy.drawBias * 2;
    case 'Predict': return 1 + policy.drawBias * 1.8;
    case 'Mental Note': return 1 + policy.drawBias;
    default: return card.name === DANDAN_NAME ? 6 + policy.aggression * 4 : 2;
  }
};
const getSpellContextScore = (state, actor, card, policy, difficulty = state.difficulty || 'medium') => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  let score = getSpellPriority(card, policy) + getAiCardValue(state, actor, card, policy) * 0.55;

  if (difficulty === 'hard' && !card.isLand && HIGH_IMPACT_SPELLS.has(card.name)) {
    const opponentCounters = getLiveInteractionCards(state, opponent, ['Memory Lapse', 'Unsubstantiate']).length;
    const actorCounters = getLiveInteractionCards(state, actor, ['Memory Lapse', 'Unsubstantiate']).length;
    if (opponentCounters > actorCounters) score -= 3.5;
  }

  if (card.name === 'Predict' && getTopDeckCard(state)) score += 3;
  if (card.name === 'Mental Note') score += getTopDeckCards(state, 2).filter(topCard => getBaseCardValue(topCard) <= 4).length * 1.2;
  if (card.name === "Day's Undoing" && state[actor].hand.length >= 5 && getHandQuality(state, actor) >= getHandQuality(state, opponent)) score -= 6;

  return score;
};

const AI_ETB_TAPPED_LANDS = new Set(['Lonely Sandbar', 'Remote Isle', 'The Surgical Bay', 'Svyelunite Temple', 'Halimar Depths', 'Mystic Sanctuary']);
const AI_VALUE_INSTANTS = new Set(['Accumulated Knowledge', 'Brainstorm', 'Mental Note', 'Predict', 'Telling Time']);
const countDandans = (board, predicate = (_card) => true) => board.filter(card => card.name === DANDAN_NAME && predicate(card)).length;
const isDandanSupported = (card, board) => card?.name === DANDAN_NAME && boardHasLandType(board, getDandanLandType(card));
export const canDandanAttackDefender = (card, defenderBoard) => card?.name === DANDAN_NAME && boardHasLandType(defenderBoard, getDandanLandType(card));
const getMandatoryDandanAttackers = (state, actor) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  return state[actor].board.filter(card => (
    card.name === DANDAN_NAME &&
    !card.summoningSickness &&
    !card.tapped &&
    canDandanAttackDefender(card, state[opponent].board)
  ));
};
const enforceMandatoryDandanAttacks = (state, actor) => {
  const mandatoryIds = new Set(getMandatoryDandanAttackers(state, actor).map(card => card.id));
  if (mandatoryIds.size === 0) return state;

  let changed = false;
  state[actor].board = state[actor].board.map(card => {
    if (!mandatoryIds.has(card.id) || card.attacking) return card;
    changed = true;
    return { ...card, attacking: true };
  });

  return changed ? state : state;
};
const getBlueSourcesInPlay = (board) => board.filter(card => card.isLand && (card.blueSources || 0) > 0).length;
const getCombatThreat = (defendingBoard, dandanCount) => controlsIsland(defendingBoard) ? dandanCount * 4 : 0;
const getBoardAfterTransformingPermanent = (board, permanentId) => board.map(card => {
  if (card.id !== permanentId) return card;
  if (card.name === DANDAN_NAME) return { ...card, dandanLandType: 'Swamp' };
  if (card.isLand) return { ...card, landType: 'Swamp', isSwamp: true, blueSources: 0 };
  return card;
});
const getBoardAfterRemovingPermanent = (board, permanentId) => board.filter(card => card.id !== permanentId);
const countDandansLosingSupport = (currentBoard, nextBoard) => currentBoard.filter(card => card.name === DANDAN_NAME && isDandanSupported(card, currentBoard) && !isDandanSupported(card, nextBoard)).length;
const spellWouldSelfDestruct = (state, spell) => spell?.card?.name === DANDAN_NAME && !boardHasLandType(state[spell.controller].board, getDandanLandType(spell.card));
const chooseLandToPlay = (state, actor) => {
  const lands = state[actor].hand.filter(card => card.isLand);
  if (lands.length === 0) return null;

  const board = state[actor].board;
  const islandCount = board.filter(card => getLandType(card) === 'Island').length;
  const availableBlue = getBlueSourcesInPlay(board);
  const graveyardSpells = state.graveyard.filter(card => INSTANT_OR_SORCERY_TYPES.some(type => card.type?.includes(type)));
  const wantsBlueSoon = state[actor].hand.some(card => !card.isLand && (card.blueRequirement || 0) > Math.max(0, availableBlue));

  const scoreLand = (card) => {
    const sanctuaryUntapped = card.name === 'Mystic Sanctuary' && islandCount >= 3;
    const entersTapped = AI_ETB_TAPPED_LANDS.has(card.name) && !sanctuaryUntapped;
    let score = 0;

    score += (card.blueSources || 0) * 4;
    score += getLandType(card) === 'Island' ? 2.5 : 0;
    score += entersTapped ? -2.4 : 1.6;

    if (card.name === 'Mystic Sanctuary') score += sanctuaryUntapped && graveyardSpells.length > 0 ? 5 : -1.5;
    if (card.name === 'Halimar Depths') score += 1.4;
    if (card.name === 'Lonely Sandbar') score += lands.length > 1 ? 0.8 : 0.2;
    if (card.name === 'Remote Isle') score += lands.length > 1 ? 0.4 : -0.3;
    if (card.name === 'Svyelunite Temple') score += wantsBlueSoon ? 1.2 : 0.5;
    if (card.name === 'The Surgical Bay') score += state[actor].hand.length <= 3 ? 1.1 : 0.4;
    if (card.name === 'Haunted Fengraf') score += state.graveyard.some(isCreatureCard) ? -0.4 : -1.6;
    if (wantsBlueSoon) score += (card.blueSources || 0) > 0 ? 2.5 : -3.5;

    return score;
  };

  return [...lands].sort((left, right) => scoreLand(right) - scoreLand(left))[0];
};

const getDesiredAttackCount = (state, actor, policy) => {
  const readyAttackers = getMandatoryDandanAttackers(state, actor).filter(card => !card.attacking);
  if (readyAttackers.length === 0) return 0;
  return readyAttackers.length + state[actor].board.filter(card => card.name === DANDAN_NAME && card.attacking).length;
};

const getDesiredBlockCount = (state, actor, policy) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const attackers = countDandans(state[opponent].board, card => card.attacking);
  if (attackers === 0) return 0;

  const currentBlocks = countDandans(state[actor].board, card => !card.tapped && card.blocking);
  const totalAvailableBlocks = countDandans(state[actor].board, card => !card.tapped);
  const ourDandans = countDandans(state[actor].board);
  const opponentDandans = countDandans(state[opponent].board);
  const maxBlocks = Math.min(attackers, totalAvailableBlocks);

  const options = [];
  for (let blocks = 0; blocks <= maxBlocks; blocks++) {
    const actualBlocks = Math.min(blocks, attackers);
    const lifeAfter = state[actor].life - Math.max(0, attackers - actualBlocks) * 4;
    const ourDandansAfter = Math.max(0, ourDandans - actualBlocks);
    const opponentDandansAfter = Math.max(0, opponentDandans - actualBlocks);
    const crackbackThreat = getCombatThreat(state[opponent].board, ourDandansAfter);
    const opponentReturnThreat = getCombatThreat(state[actor].board, opponentDandansAfter);

    options.push({
      blocks: actualBlocks,
      lifeAfter,
      crackbackLethal: lifeAfter > 0 && crackbackThreat >= state[opponent].life,
      opponentReturnThreat,
      desperationScore: (lifeAfter - opponentReturnThreat) * (1.2 + policy.blockBias * 0.2)
        + crackbackThreat * 0.2
        - actualBlocks * Math.max(0.4, 1.5 - policy.blockBias * 0.4)
    });
  }

  const winningOption = options.find(option => option.crackbackLethal);
  if (winningOption) return Math.max(currentBlocks, winningOption.blocks);

  const safeOption = options.find(option => option.lifeAfter > 0 && option.lifeAfter > option.opponentReturnThreat);
  if (safeOption) return Math.max(currentBlocks, safeOption.blocks);

  const desperationOption = [...options]
    .filter(option => option.lifeAfter > 0)
    .sort((left, right) => right.desperationScore - left.desperationScore || left.blocks - right.blocks)[0];
  if (desperationOption) return Math.max(currentBlocks, desperationOption.blocks);

  return Math.max(currentBlocks, maxBlocks);
};

const pickTransformTarget = (state, actor) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const board = state[opponent].board;
  const candidates = board.filter(card => card.name === DANDAN_NAME || card.isLand).map(card => {
    const nextBoard = getBoardAfterTransformingPermanent(board, card.id);
    const killedDandans = countDandansLosingSupport(board, nextBoard);
    const attackingKills = board.filter(permanent => permanent.name === DANDAN_NAME && permanent.attacking && isDandanSupported(permanent, board) && !isDandanSupported(permanent, nextBoard)).length;
    const blueLoss = Math.max(0, getBlueSourcesInPlay(board) - getBlueSourcesInPlay(nextBoard));
    const score = killedDandans * 12 + attackingKills * 4 + blueLoss * 3 + (card.name === DANDAN_NAME ? 1.5 : 0);
    return { target: card, score };
  });

  return candidates.filter(candidate => candidate.score > 0).sort((left, right) => right.score - left.score)[0] || null;
};

const pickBounceTarget = (state, actor) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const board = state[opponent].board;
  const candidates = board.filter(card => card.name === DANDAN_NAME || card.isLand).map(card => {
    const nextBoard = getBoardAfterRemovingPermanent(board, card.id);
    const killedDandans = countDandansLosingSupport(board, nextBoard);
    const attackingKills = board.filter(permanent => permanent.name === DANDAN_NAME && permanent.attacking && isDandanSupported(permanent, board) && !isDandanSupported(permanent, nextBoard)).length;
    const blueLoss = Math.max(0, getBlueSourcesInPlay(board) - getBlueSourcesInPlay(nextBoard));
    let score = killedDandans * 11 + attackingKills * 4 + blueLoss * 2.5;
    if (card.name === DANDAN_NAME && isDandanSupported(card, board)) score += card.attacking ? 12 : 9;
    if (card.isLand) score += getLandType(card) === 'Island' ? 1.5 : 0.5;
    return { target: card, score };
  });

  return candidates.filter(candidate => candidate.score > 0).sort((left, right) => right.score - left.score)[0] || null;
};

const pickControlMagicTarget = (state, actor) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const targets = state[opponent].board.filter(card => card.name === DANDAN_NAME && isDandanSupported(card, state[opponent].board) && boardHasLandType(state[actor].board, getDandanLandType(card)));
  if (targets.length === 0) return null;
  return { target: targets[0], score: 13 + (state[actor].life <= 8 ? 1.5 : 0) };
};

const chooseEmergencyDefenseSpell = (state, actor, policy) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const attackers = state[opponent].board.filter(card => card.attacking);
  if (attackers.length === 0) return null;

  const spellOptions = [];
  const unsub = state[actor].hand.find(card => card.name === 'Unsubstantiate');
  if (unsub && isCastable(unsub, state, actor)) {
    spellOptions.push({
      score: 10.5,
      action: { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: attackers[0] }
    });
  }

  const metamorphose = state[actor].hand.find(card => card.name === 'Metamorphose');
  if (metamorphose && isCastable(metamorphose, state, actor)) {
    const target = pickBounceTarget(state, actor);
    if (target) {
      spellOptions.push({
        score: target.score + 2,
        action: { type: 'CAST_SPELL', player: actor, cardId: metamorphose.id, target: target.target }
      });
    }
  }

  ['Magical Hack', 'Crystal Spray'].forEach(name => {
    const spell = state[actor].hand.find(card => card.name === name);
    if (!spell || !isCastable(spell, state, actor)) return;
    const target = pickTransformTarget(state, actor);
    if (!target) return;
    spellOptions.push({
      score: target.score + (name === 'Crystal Spray' ? 1.5 : 0),
      action: { type: 'CAST_SPELL', player: actor, cardId: spell.id, target: target.target }
    });
  });

  const bestOption = spellOptions.sort((left, right) => right.score - left.score)[0];
  if (!bestOption || bestOption.score < 8 || policy.control < 0.45) return null;
  return bestOption.action;
};

const shouldHoldValueInstant = (state, actor, card) => {
  if (!card?.isInstant || !AI_VALUE_INSTANTS.has(card.name)) return false;
  if (state.stack.length > 0) return false;
  if (state.turn !== actor) return !(state.phase === 'main2' || state.phase === 'cleanup');
  return state[actor].hand.length <= 7;
};
const shouldCastDandanNow = (state, actor, policy, difficulty = state.difficulty || 'medium') => {
  const dandan = state[actor].hand.find(card => card.name === DANDAN_NAME);
  if (!dandan) return false;
  if (!controlsIsland(state[actor].board) || !controlsIsland(state[actor === 'player' ? 'ai' : 'player'].board)) return false;
  return getSpellContextScore(state, actor, dandan, policy, difficulty) >= (difficulty === 'hard' ? 11.5 : 9.5);
};
const getTempleActivationAction = (state, actor, policy, difficulty = state.difficulty || 'medium') => {
  const temple = state[actor].board.find(card => card.name === 'Svyelunite Temple' && isActivatable(card, state, actor));
  if (!temple || state.turn !== actor || !['main1', 'main2'].includes(state.phase)) return null;

  const boardWithoutTemple = state[actor].board.filter(card => card.id !== temple.id);
  const pool = getManaPool(state, actor);
  const futurePool = { total: pool.total + 2, blue: pool.blue + 2 };
  const enabledSpell = [...state[actor].hand]
    .filter(card => !card.isLand && !canPayCardNow(state, actor, card) && canPayCardNow(state, actor, card, boardWithoutTemple, futurePool))
    .sort((left, right) => getSpellContextScore(state, actor, right, policy, difficulty) - getSpellContextScore(state, actor, left, policy, difficulty))[0];

  if (!enabledSpell) return null;
  if (getSpellContextScore(state, actor, enabledSpell, policy, difficulty) < 10) return null;
  return { type: 'ACTIVATE_LAND_NOW', player: actor, cardId: temple.id, cardName: temple.name };
};
const getAiLandActivationAction = (state, actor, policy, difficulty = state.difficulty || 'medium') => {
  const templeActivation = getTempleActivationAction(state, actor, policy, difficulty);
  if (templeActivation) return templeActivation;

  const surgicalBay = state[actor].board.find(card => card.name === 'The Surgical Bay' && isActivatable(card, state, actor));
  if (surgicalBay && (
    (state.turn !== actor && (state.phase === 'main2' || state.phase === 'cleanup')) ||
    (state.turn === actor && state.phase === 'main2' && state[actor].hand.length <= 2)
  )) {
    return { type: 'ACTIVATE_LAND_NOW', player: actor, cardId: surgicalBay.id, cardName: surgicalBay.name };
  }

  const fengraf = state[actor].board.find(card => card.name === 'Haunted Fengraf' && isActivatable(card, state, actor));
  if (fengraf && !state[actor].hand.some(card => card.name === DANDAN_NAME) && (state[actor].hand.length === 0 || state[actor].life <= 8)) {
    return { type: 'ACTIVATE_LAND_NOW', player: actor, cardId: fengraf.id, cardName: fengraf.name };
  }

  return null;
};

export const getAiPendingActions = (state, policy, actor = 'player') => {
  if (!state.pendingAction) return [];

  if (['BRAINSTORM', 'DISCARD', 'DISCARD_CLEANUP', 'MULLIGAN_BOTTOM'].includes(state.pendingAction.type)) {
    const count = state.pendingAction.count || 0;
    const selected = state.pendingAction.type === 'BRAINSTORM'
      ? getAiPutBackCards(state, actor, count, policy).map(card => card.id)
      : pickAiPendingCards(state, actor, count, policy);
    return [
      ...selected.map(cardId => ({ type: 'TOGGLE_PENDING_SELECT', cardId })),
      { type: 'SUBMIT_PENDING_ACTION' }
    ];
  }

  if (state.pendingAction.type === 'PREDICT') {
    return [{ type: 'SUBMIT_PENDING_ACTION', guess: getAiPredictGuess(state) }];
  }

  if (state.pendingAction.type === 'TELLING_TIME') {
    const { handCard, topCard } = getAiTellingTimePlan(state, actor, state.pendingAction.cards, policy);
    const actions = [];
    if (handCard) actions.push({ type: 'UPDATE_TELLING_TIME', cardId: handCard.id, dest: 'hand' });
    if (topCard) actions.push({ type: 'UPDATE_TELLING_TIME', cardId: topCard.id, dest: 'top' });
    actions.push({ type: 'SUBMIT_PENDING_ACTION' });
    return actions;
  }

  if (state.pendingAction.type === 'HALIMAR_DEPTHS') {
    const desiredOrder = getAiLibraryOrder(state, actor, state.pendingAction.cards, policy);
    const actions = [];
    let working = [...state.pendingAction.cards];
    desiredOrder.forEach((card, targetIndex) => {
      const fromIndex = working.findIndex(entry => entry.id === card.id);
      if (fromIndex > -1 && fromIndex !== targetIndex) {
        actions.push({ type: 'REORDER_HALIMAR', from: fromIndex, to: targetIndex });
        const [moved] = working.splice(fromIndex, 1);
        working.splice(targetIndex, 0, moved);
      }
    });
    actions.push({ type: 'SUBMIT_PENDING_ACTION' });
    return actions;
  }

  if (state.pendingAction.type === 'MYSTIC_SANCTUARY') {
    const validSpells = state.graveyard.filter(card => state.pendingAction.validTargets?.includes(card.id));
    const spell = getAiSanctuaryTarget(state, actor, validSpells, policy);
    return [{ type: 'SUBMIT_PENDING_ACTION', selectedCardId: spell?.id || null }];
  }

  if (state.pendingAction.type === 'ACTIVATE_LAND') {
    return [{ type: 'SUBMIT_PENDING_ACTION' }];
  }

  return [];
};

export const chooseAiAction = (state, actor, difficulty = 'medium', policy = getLivePolicyWeights(difficulty)) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const canCast = (card) => Boolean(card) && isCastable(card, state, actor);
  const interactionPenalty = difficulty === 'hard' && hasLiveInteraction(state, opponent, ['Memory Lapse', 'Unsubstantiate']) && !hasLiveInteraction(state, actor, ['Memory Lapse', 'Unsubstantiate']) ? 3.2 : 0;

  if (state.turn !== actor && state.stack.length === 0 && (state.phase === 'main2' || state.phase === 'cleanup')) {
    const endStepInstants = state[actor].hand.filter(card => canCast(card) && card.isInstant && AI_VALUE_INSTANTS.has(card.name));
    if (endStepInstants.length > 0 && !shouldMakeMistake(0.04, policy)) {
      const spell = [...endStepInstants].sort((left, right) => getSpellContextScore(state, actor, right, policy, difficulty) - getSpellContextScore(state, actor, left, policy, difficulty))[0];
      return { type: 'CAST_SPELL', player: actor, cardId: spell.id };
    }
  }

  if (state.stack.length > 0) {
    const topSpell = state.stack[state.stack.length - 1];
    if (topSpell.controller === opponent) {
      if (spellWouldSelfDestruct(state, topSpell)) {
        return { type: 'PASS_PRIORITY', player: actor };
      }

      const lapse = state[actor].hand.find(c => c.name === 'Memory Lapse');
      const lapseValue = getSpellContextScore(state, actor, topSpell.card, policy, difficulty) + (state.turn === opponent ? 2.5 : 0);
      const shouldMemoryLapse =
        canCast(lapse) &&
        (
          topSpell.card.name === DANDAN_NAME ||
          topSpell.card.name === 'Control Magic' ||
          topSpell.card.name === 'Capture of Jingzhou' ||
          topSpell.card.name === "Day's Undoing" ||
          state.turn === opponent ||
          lapseValue >= 4
        );

      if (shouldMemoryLapse) {
        if (policy.counterBias < 0.45 || shouldMakeMistake(0.04, policy)) {
          return { type: 'PASS_PRIORITY', player: actor };
        }
        return { type: 'CAST_SPELL', player: actor, cardId: lapse.id, target: topSpell };
      }

      const unsub = state[actor].hand.find(c => c.name === 'Unsubstantiate');
      const shouldUnsub =
        canCast(unsub) &&
        (
          topSpell.card.name === DANDAN_NAME ||
          topSpell.card.name === 'Control Magic' ||
          topSpell.card.name === 'Capture of Jingzhou' ||
          topSpell.card.name === "Day's Undoing" ||
          getSpellContextScore(state, actor, topSpell.card, policy, difficulty) >= 7
        );

      if (shouldUnsub) {
        if (policy.counterBias < 0.5 || shouldMakeMistake(0.08, policy)) {
          return { type: 'PASS_PRIORITY', player: actor };
        }
        return { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: topSpell };
      }
    }
    return { type: 'PASS_PRIORITY', player: actor };
  }

  if (state.turn === actor && state.phase === 'declare_attackers') {
    const readyDandans = getMandatoryDandanAttackers(state, actor).filter(card => !card.attacking);
    const desiredAttackers = getDesiredAttackCount(state, actor, policy);
    const currentAttackers = state[actor].board.filter(c => c.name === DANDAN_NAME && c.attacking).length;
    if (readyDandans.length > 0 && currentAttackers < desiredAttackers) {
      return { type: 'TOGGLE_ATTACK', cardId: readyDandans[0].id, player: actor };
    }
    return { type: 'PASS_PRIORITY', player: actor };
  }

  if (state.turn === opponent && state.phase === 'declare_blockers') {
    const attackers = state[opponent].board.filter(c => c.attacking);
    if (attackers.length > 0) {
      const emergencySpell = chooseEmergencyDefenseSpell(state, actor, policy);
      if (!state[actor].board.some(c => c.name === DANDAN_NAME && !c.tapped) && emergencySpell) {
        return emergencySpell;
      }

      const currentBlocks = state[actor].board.filter(c => c.name === DANDAN_NAME && !c.tapped && c.blocking).length;
      const desiredBlocks = getDesiredBlockCount(state, actor, policy);
      const blockers = state[actor].board.filter(c => c.name === DANDAN_NAME && !c.tapped && !c.blocking);
      if (blockers.length > 0 && currentBlocks < desiredBlocks && !shouldMakeMistake(0.1, policy)) {
        return { type: 'TOGGLE_BLOCK', cardId: blockers[0].id, player: actor };
      }
    }
    return { type: 'PASS_PRIORITY', player: actor };
  }

  if (state.turn === actor && (state.phase === 'main1' || state.phase === 'main2' || state.phase === 'upkeep')) {
    const landsInPlay = state[actor].board.filter(c => c.isLand).length;
    const land = chooseLandToPlay(state, actor);
    if (state.phase !== 'upkeep' && land && state[actor].landsPlayed === 0 && landsInPlay < policy.landLimit) {
      return { type: 'PLAY_LAND', player: actor, cardId: land.id };
    }

    const dandan = state[actor].hand.find(c => c.name === DANDAN_NAME);
    const actorHasIsland = controlsIsland(state[actor].board);
    const opponentHasIsland = controlsIsland(state[opponent].board);
    const targetedOptions = [];

    const controlMagic = state[actor].hand.find(c => c.name === 'Control Magic');
    const controlMagicTarget = pickControlMagicTarget(state, actor);
    if (state.phase !== 'upkeep' && canCast(controlMagic) && controlMagicTarget && policy.stealBias >= 0.72) {
      targetedOptions.push({
        score: controlMagicTarget.score + getSpellContextScore(state, actor, controlMagic, policy, difficulty) - interactionPenalty,
        action: { type: 'CAST_SPELL', player: actor, cardId: controlMagic.id, target: controlMagicTarget.target }
      });
    }

    const metamorphose = state[actor].hand.find(c => c.name === 'Metamorphose');
    const bounceTarget = pickBounceTarget(state, actor);
    if (state.phase !== 'upkeep' && canCast(metamorphose) && bounceTarget && policy.control >= 0.42) {
      targetedOptions.push({
        score: bounceTarget.score + 1.5 + getSpellContextScore(state, actor, metamorphose, policy, difficulty) - interactionPenalty * 0.6,
        action: { type: 'CAST_SPELL', player: actor, cardId: metamorphose.id, target: bounceTarget.target }
      });
    }

    ['Magical Hack', 'Crystal Spray'].forEach(name => {
      const spell = state[actor].hand.find(c => c.name === name);
      const target = pickTransformTarget(state, actor);
      if (state.phase === 'upkeep' || !canCast(spell) || !target || policy.control < 0.42) return;
      targetedOptions.push({
        score: target.score + (name === 'Crystal Spray' ? 1.5 : 0) + getSpellContextScore(state, actor, spell, policy, difficulty) - interactionPenalty * 0.4,
        action: { type: 'CAST_SPELL', player: actor, cardId: spell.id, target: target.target }
      });
    });

    const bestTargetedSpell = targetedOptions.sort((left, right) => right.score - left.score)[0] || null;
    if (bestTargetedSpell && bestTargetedSpell.score >= 10 && !shouldMakeMistake(0.05, policy)) {
      return bestTargetedSpell.action;
    }

    if (state.phase !== 'upkeep' && canCast(dandan) && actorHasIsland && opponentHasIsland && shouldCastDandanNow(state, actor, policy, difficulty) && !shouldMakeMistake(0.06, policy)) {
      return { type: 'CAST_SPELL', player: actor, cardId: dandan.id };
    }

    if (bestTargetedSpell && bestTargetedSpell.score >= 6 && !shouldMakeMistake(0.05, policy)) {
      return bestTargetedSpell.action;
    }

    const castableSpells = state[actor].hand.filter(c => !c.isLand && ![DANDAN_NAME, 'Memory Lapse', 'Unsubstantiate', 'Magical Hack', 'Crystal Spray', 'Control Magic', 'Metamorphose'].includes(c.name) && isCastable(c, state, actor) && !shouldHoldValueInstant(state, actor, c));
    if (castableSpells.length > 0) {
      const spell = difficulty === 'hard'
        ? [...castableSpells].sort((a, b) => getSpellContextScore(state, actor, b, policy, difficulty) - getSpellContextScore(state, actor, a, policy, difficulty))[0]
        : difficulty === 'easy'
          ? randomChoice(castableSpells)
          : castableSpells[0];
      const spellScore = getSpellContextScore(state, actor, spell, policy, difficulty);
      const shouldHoldInteraction =
        difficulty === 'hard' &&
        hasLiveInteraction(state, actor, ['Memory Lapse', 'Unsubstantiate']) &&
        state[opponent].hand.some(card => HIGH_IMPACT_SPELLS.has(card.name) && canLikelyCastNextTurn(state, opponent, card)) &&
        spellScore < 10;
      if (!shouldHoldInteraction && !shouldMakeMistake(0.08, policy)) {
        return { type: 'CAST_SPELL', player: actor, cardId: spell.id };
      }
    }

    const activationAction = getAiLandActivationAction(state, actor, policy, difficulty);
    if (activationAction && !shouldMakeMistake(0.05, policy)) {
      return activationAction;
    }

    const cycler = state[actor].hand.find(c => isCyclable(c, state, actor));
    const spareLandsInHand = state[actor].hand.filter(c => c.isLand).length;
    if (cycler && (landsInPlay >= policy.landLimit || spareLandsInHand > 2)) {
      return { type: 'CYCLE_CARD', player: actor, cardId: cycler.id };
    }
  }

  return { type: 'PASS_PRIORITY', player: actor };
};
const resolveLandActivation = (state, player, cardId, cardName, activation = getActivationDetails(cardName)) => {
  const landIdx = state[player].board.findIndex(card => card.id === cardId);
  if (landIdx === -1) return state;

  const landToActivate = state[player].board[landIdx];
  const activationState = { ...state, pendingAction: null };
  if (!activation || !isActivatable(landToActivate, activationState, player)) return state;

  let nextState = state;
  const boardWithoutLand = nextState[player].board.filter(card => card.id !== cardId);
  const activationPayment = spendMana(boardWithoutLand, getManaPool(nextState, player), activation.total, activation.blue);
  nextState[player].board = activationPayment.board;
  nextState.floatingMana[player] = activationPayment.pool;

  const sacrificedLand = { ...landToActivate, tapped: true, attacking: false, blocking: false };
  nextState.graveyard.push(sacrificedLand);

  if (cardName === 'The Surgical Bay') {
    drawCards(nextState, player, 1);
  } else if (cardName === 'Svyelunite Temple') {
    addFloatingMana(nextState, player, 2, 2);
  } else if (cardName === 'Haunted Fengraf') {
    const creatures = nextState.graveyard.filter(isCreatureCard);
    if (creatures.length > 0) {
      const randIdx = Math.floor(Math.random() * creatures.length);
      const selectedCreature = creatures[randIdx];
      nextState.graveyard = nextState.graveyard.filter(card => card.id !== selectedCreature.id);
      selectedCreature.owner = player;
      nextState[player].hand.push(selectedCreature);
    }
  }

  nextState = checkStateBasedActions(nextState);
  nextState.stackResolving = false;
  nextState.priority = player;
  nextState.consecutivePasses = 0;
  return nextState;
};

const defaultEffects = {
  initAudio: () => {},
  playDraw: () => {},
  playLand: () => {},
  playCast: () => {},
  playResolve: () => {},
  playPhase: (_phase) => {}
};

export const createGameReducer = (effects = defaultEffects) => {
  const reducer = (state, action) => {
    let s = { ...state, actionCount: (state.actionCount || 0) + 1 };
    const logAction = (msg) => { s.log = [msg, ...s.log].slice(0, 15); };

  switch (action.type) {
    case 'RETURN_TO_MENU':
      return { ...initialState };

    case 'SURRENDER':
      return {
        ...s,
        winner: action.player === 'player' ? 'ai' : 'player',
        pendingAction: null,
        pendingTargetSelection: null,
        stackResolving: false,
        log: [`${action.player} surrendered.`, ...(s.log || [])].slice(0, 15)
      };

    case 'START_GAME':
      effects.initAudio();
      const gameMode = action.mode || 'player';
      const difficulty = action.difficulty || 'medium';
      s = { 
         ...initialState, 
         started: true, 
         gameMode,
         difficulty,
         deck: initializeDeck(),
         graveyard: [], stack: [], log: [], winner: null,
         phase: gameMode === 'ai_vs_ai' ? 'upkeep' : 'mulligan', turn: 'player', priority: 'player', mulliganCount: 0, isFirstTurn: true,
         player: { life: 20, hand: [], board: [], landsPlayed: 0 },
         ai: { life: 20, hand: [], board: [], landsPlayed: 0 },
         floatingMana: { player: { total: 0, blue: 0 }, ai: { total: 0, blue: 0 } },
         hasAttacked: { player: false, ai: false },
         hasBlocked: { player: false, ai: false },
         extraTurns: { player: 0, ai: 0 },
         pendingAction: null, pendingTargetSelection: null
      };
      drawAlternating(s, 'player', 7);
      logAction(gameMode === 'ai_vs_ai' ? "AI mirror started." : "Game started. Mulligan phase.");
      return s;

    case 'MULLIGAN':
      if ((s.mulliganCount || 0) >= 7) return s;
      s.deck = [...s.deck, ...s.player.hand];
      s.player.hand = [];
      for (let i = s.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [s.deck[i], s.deck[j]] = [s.deck[j], s.deck[i]];
      }
      drawCards(s, 'player', 7);
      s.mulliganCount = (s.mulliganCount || 0) + 1;
      s.pendingAction = null;
      logAction(`You mulliganed to ${7 - s.mulliganCount}. Draw 7 and choose whether to keep.`);
      return s;

    case 'KEEP_HAND':
      if ((s.mulliganCount || 0) > 0) {
         s.pendingAction = { type: 'MULLIGAN_BOTTOM', count: s.mulliganCount, selected: [] };
         logAction(`You kept. Put ${s.mulliganCount} card(s) on the bottom.`);
         return s;
      }
      s.phase = 'upkeep';
      logAction(`You kept your hand. Beginning Turn 1 Upkeep.`);
      return s;

    case 'DRAW':
      if (s.deck.length === 0) { s.winner = action.player === 'player' ? 'ai' : 'player'; return s; }
      drawCards(s, action.player, 1);
      if(action.player === 'player') effects.playDraw();
      logAction(`${action.player} drew a card for turn.`);
      return s;

    case 'PLAY_LAND':
      if (s.turn !== action.player || s.phase === 'declare_attackers' || s.phase === 'declare_blockers' || s.phase === 'upkeep' || s[action.player].landsPlayed >= 1) return s;
      if (s.pendingAction?.type === 'HAND_LAND_ACTION') s.pendingAction = null;
      const landIdx = s[action.player].hand.findIndex(c => c.id === action.cardId);
      if (landIdx > -1) {
        effects.playLand();
        const [land] = s[action.player].hand.splice(landIdx, 1);
        
        const entersTapped = ['Lonely Sandbar', 'Remote Isle', 'The Surgical Bay', 'Svyelunite Temple', 'Halimar Depths', 'Mystic Sanctuary'].includes(land.name);
        land.tapped = entersTapped;
        
        if (land.name === 'Halimar Depths') {
            const viewed = [];
            for (let i = 0; i < 3; i++) {
                if (s.deck.length) viewed.push(s.deck.pop());
            }
            if (action.player === 'player') {
                s.pendingAction = { type: 'HALIMAR_DEPTHS', cards: viewed };
            } else {
                getAiLibraryOrder(s, 'ai', viewed, getLivePolicyWeights(s.difficulty || 'medium')).slice().reverse().forEach(card => s.deck.push(card));
                logAction(`AI reordered the top cards with Halimar Depths.`);
            }
        }
        if (land.name === 'Mystic Sanctuary') {
            const islands = s[action.player].board.filter(c => getLandType(c) === 'Island').length;
            if (islands >= 3) {
                land.tapped = false;
                const validSpells = s.graveyard.filter(c => INSTANT_OR_SORCERY_TYPES.some(type => c.type.includes(type)));
                if (validSpells.length > 0) {
                    if (action.player === 'player') {
                        s.pendingAction = { type: 'MYSTIC_SANCTUARY', validTargets: validSpells.map(c=>c.id) };
                    } else {
                        const spell = getAiSanctuaryTarget(s, 'ai', validSpells, getLivePolicyWeights(s.difficulty || 'medium'));
                        if (spell) {
                          s.graveyard = s.graveyard.filter(c => c.id !== spell.id);
                          s.deck.push(spell);
                          logAction(`AI put ${spell.name} on top with Mystic Sanctuary.`);
                        }
                    }
                }
            }
        }
        s[action.player].board.push(land);
        s[action.player].landsPlayed++;
        s.consecutivePasses = 0; 
        logAction(`${action.player} played ${land.name}.`);
      }
      return checkStateBasedActions(s);

    case 'PROMPT_ACTIVATE_LAND':
      const activationPlayer = action.player || 'player';
      const landActivation = getActivationDetails(action.cardName);
      const promptLand = s[activationPlayer].board.find(c => c.id === action.cardId);
      if (!promptLand || !isActivatable(promptLand, s, activationPlayer)) return s;
      s.pendingAction = { type: 'ACTIVATE_LAND', player: activationPlayer, cardId: action.cardId, cardName: action.cardName, activation: landActivation };
      return s;

    case 'PROMPT_HAND_LAND_ACTION': {
      const handCard = s.player.hand.find(c => c.id === action.cardId);
      if (!handCard || !handCard.isLand) return s;
      const cyclingCost = getCyclingCost(handCard.name);
      const canPlay = isCastable(handCard, s, 'player');
      const canCycle = isCyclable(handCard, s, 'player');
      if (!canPlay && !canCycle) return s;
      s.pendingAction = {
        type: 'HAND_LAND_ACTION',
        cardId: handCard.id,
        cardName: handCard.name,
        canPlay,
        canCycle,
        cyclingCost: cyclingCost?.total ?? null
      };
      return s;
    }

    case 'CYCLE_CARD': {
      const p = action.player;
      const handIdx = s[p].hand.findIndex(c => c.id === action.cardId);
      if (handIdx === -1) return s;
      const card = s[p].hand[handIdx];
      const cyclingCost = getCyclingCost(card.name);
      const cycleValidationState = s.pendingAction?.type === 'HAND_LAND_ACTION' && s.pendingAction.cardId === action.cardId
        ? { ...s, pendingAction: null }
        : s;
      if (!cyclingCost || !isCyclable(card, cycleValidationState, p)) return s;

      s.pendingAction = null;
      const cyclePayment = spendMana(s[p].board, getManaPool(s, p), cyclingCost.total, cyclingCost.blue);
      s[p].board = cyclePayment.board;
      s.floatingMana[p] = cyclePayment.pool;
      const [cycledCard] = s[p].hand.splice(handIdx, 1);
      s.graveyard.push(cycledCard);
      drawCards(s, p, 1);
      s.consecutivePasses = 0;
      logAction(`${p} cycled ${cycledCard.name}.`);
      return checkStateBasedActions(s);
    }

    case 'ACTIVATE_LAND_NOW':
      s = resolveLandActivation(s, action.player, action.cardId, action.cardName, getActivationDetails(action.cardName));
      logAction(`${action.player} activated ${action.cardName}.`);
      return s;

    case 'CANCEL_TARGETING':
      s.pendingTargetSelection = null;
      return s;
      
    case 'CANCEL_PENDING_ACTION':
      s.pendingAction = null;
      return s;

    case 'CAST_SPELL': {
      const p = action.player;
      const opp = p === 'player' ? 'ai' : 'player';
      const handIdx = s[p].hand.findIndex(c => c.id === action.cardId);
      if (handIdx === -1) return s;
      const card = s[p].hand[handIdx];
      
      const targetDependent = ['Memory Lapse', 'Unsubstantiate', 'Control Magic', 'Magical Hack', 'Crystal Spray', 'Metamorphose'];
      
      if (!action.target && p === 'player' && targetDependent.includes(card.name)) {
         s.pendingTargetSelection = { cardId: action.cardId, spellName: card.name };
         return s;
      }
      
      let target = action.target || null;
      if (!target && card.name === 'Memory Lapse' && s.stack.length > 0) target = s.stack[s.stack.length - 1]; 
      else if (!target && card.name === 'Unsubstantiate') {
        if (s.stack.length > 0) target = s.stack[s.stack.length - 1];
        else target = s[opp].board.find(c => c.name === 'DandÃ¢n') || s[p].board.find(c => c.name === 'DandÃ¢n');
      }
      else if (!target && card.name === 'Control Magic') {
        target = s[opp].board.find(isCreatureCard) || s[p].board.find(isCreatureCard); 
      }
      else if (!target && ['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(card.name)) {
        target = s[opp].board.find(c => c.name === 'DandÃ¢n') || s[opp].board.find(c => c.isLand) || s[p].board.find(c => c.isLand);
      }

      if (!canPayCost(s[p].board, getManaPool(s, p), card.cost, card.blueRequirement || 0)) return s;
      effects.playCast();
      const castPayment = spendMana(s[p].board, getManaPool(s, p), card.cost, card.blueRequirement || 0);
      s[p].board = castPayment.board;
      s.floatingMana[p] = castPayment.pool;
      s[p].hand.splice(handIdx, 1);
      s.stack.push({ card, controller: p, target });
      s.consecutivePasses = 0; s.priority = p === 'player' ? 'ai' : 'player'; 
      logAction(`${p} casts ${card.name}.`);
      return s;
    }

    case 'CAST_WITH_TARGET': {
      const p = 'player';
      const cardId = s.pendingTargetSelection.cardId;
      const handIdx = s.player.hand.findIndex(c => c.id === cardId);
      if (handIdx === -1) return { ...s, pendingTargetSelection: null };
      
      const card = s.player.hand[handIdx];
      let targetObj = null;
      if (action.targetZone === 'stack') targetObj = s.stack.find(c => c.card.id === action.targetId);
      if (action.targetZone === 'board') targetObj = s.player.board.find(c => c.id === action.targetId) || s.ai.board.find(c => c.id === action.targetId);

      if (!canPayCost(s.player.board, getManaPool(s, 'player'), card.cost, card.blueRequirement || 0)) return { ...s, pendingTargetSelection: null };
      effects.playCast();
      const targetCastPayment = spendMana(s.player.board, getManaPool(s, 'player'), card.cost, card.blueRequirement || 0);
      s.player.board = targetCastPayment.board;
      s.floatingMana.player = targetCastPayment.pool;
      s.player.hand.splice(handIdx, 1);
      
      s.stack.push({ card, controller: 'player', target: targetObj });
      s.pendingTargetSelection = null;
      s.consecutivePasses = 0;
      s.priority = 'ai';
      logAction(`You cast ${card.name} targeting ${targetObj ? (targetObj.card ? targetObj.card.name : targetObj.name) : 'something'}.`);
      return s;
    }

    case 'PASS_PRIORITY':
      if (s.priority !== action.player) return s;
      s.consecutivePasses = (s.consecutivePasses || 0) + 1;
      if (s.consecutivePasses >= 2) {
         s.consecutivePasses = 0;
         if (s.stack.length > 0) { s.stackResolving = true; s.priority = null; return s; } 
         else { return reducer(s, { type: 'NEXT_PHASE' }); }
      } else {
         s.priority = s.priority === 'player' ? 'ai' : 'player';
      }
      return s;

    case 'RESOLVE_TOP_STACK':
      if (s.stack.length === 0) return { ...s, stackResolving: false, priority: s.turn, consecutivePasses: 0 };
      effects.playResolve();
      const spell = s.stack.pop();
      logAction(`Resolving ${spell.card.name}...`);

      if (spell.card.name === 'DandÃ¢n') {
        spell.card.summoningSickness = true; 
        s[spell.controller].board.push(spell.card);
      } 
      else if (spell.card.name === 'Memory Lapse') {
        if (spell.target && s.stack.some(st => st.card.id === spell.target.card.id)) {
           const targetIdx = s.stack.findIndex(st => st.card.id === spell.target.card.id);
           if (targetIdx > -1) {
             const [countered] = s.stack.splice(targetIdx, 1);
             s.deck.push(countered.card); logAction(`${countered.card.name} was Memory Lapsed to top of library!`);
           }
        }
        s.graveyard.push(spell.card);
      }
      else if (spell.card.name === 'Metamorphose') {
        if (spell.target) {
            let found = false;
            ['player', 'ai'].forEach(p2 => {
                const targetIdx = s[p2].board.findIndex(c => c.id === spell.target.id);
                if (targetIdx > -1) {
                    const [bounced] = s[p2].board.splice(targetIdx, 1);
                    s.deck.push(preparePermanentForZoneChange(bounced));
                    logAction(`Metamorphose put ${bounced.name} on top of the library!`);
                    found = true;
                }
            });
        }
        s.graveyard.push(spell.card);
      }
      else if (spell.card.name === 'Unsubstantiate') {
        if (spell.target) {
          const stackIdx = s.stack.findIndex(st => st.card.id === spell.target.card?.id);
          if (stackIdx > -1) {
             const [bounced] = s.stack.splice(stackIdx, 1); 
             const owner = bounced.card.owner || bounced.controller;
             s[owner].hand.push(bounced.card);
             logAction(`Unsubstantiate returned spell to owner's hand.`);
          } else {
            ['player', 'ai'].forEach(p2 => {
              const bIdx = s[p2].board.findIndex(c => c.id === spell.target.id);
              if (bIdx > -1) {
                const [bounced] = s[p2].board.splice(bIdx, 1);
                const owner = bounced.owner || p2;
                s[owner].hand.push(preparePermanentForZoneChange(bounced));
                logAction(`Unsubstantiate returned ${bounced.name} to owner's hand.`);
              }
            });
          }
        }
        s.graveyard.push(spell.card);
      }
      else if (['Magical Hack', 'Crystal Spray'].includes(spell.card.name)) {
        if (spell.target) {
            let targetPlayer = null;
            let targetIdx = s.player.board.findIndex(c => c.id === spell.target.id);
            if (targetIdx > -1) targetPlayer = 'player';
            else {
                targetIdx = s.ai.board.findIndex(c => c.id === spell.target.id);
                if (targetIdx > -1) targetPlayer = 'ai';
            }
            
            if (targetPlayer) {
                const targetObj = s[targetPlayer].board[targetIdx];
                if (targetObj.name === DANDAN_NAME) {
                    logAction(`${spell.card.name} changes DandÃ¢n's land dependency.`);
                    s[targetPlayer].board[targetIdx].dandanLandType = 'Swamp';
                } else if (targetObj.isLand) {
                    logAction(`${spell.card.name} changes the land type.`);
                    s[targetPlayer].board[targetIdx].landType = 'Swamp';
                    s[targetPlayer].board[targetIdx].isSwamp = true;
                    s[targetPlayer].board[targetIdx].blueSources = 0;
                }
            }
        }
        if (spell.card.name === 'Crystal Spray') drawCards(s, spell.controller, 1);
        s.graveyard.push(spell.card);
      }
      else if (spell.card.name === 'Brainstorm') {
        s.graveyard.push(spell.card);
        drawCards(s, spell.controller, 3);
        if (spell.controller === 'player') {
            s.pendingAction = { type: 'BRAINSTORM', count: 2, selected: [] };
            s.stackResolving = false;
            return s;
        } else {
            getAiPutBackCards(s, 'ai', 2, getLivePolicyWeights(s.difficulty || 'medium')).forEach(card => {
              const idx = s.ai.hand.findIndex(entry => entry.id === card.id);
              if (idx > -1) s.deck.push(s.ai.hand.splice(idx, 1)[0]);
            });
        }
      }
      else if (spell.card.name === 'Chart a Course') {
        s.graveyard.push(spell.card);
        drawCards(s, spell.controller, 2);
        if (!s.hasAttacked[spell.controller]) {
            if (spell.controller === 'player') {
                s.pendingAction = { type: 'DISCARD', count: 1, selected: [] };
                s.stackResolving = false;
                return s;
            } else {
                const discardId = pickAiPendingCards(s, 'ai', 1, getLivePolicyWeights(s.difficulty || 'medium'))[0];
                const discardIdx = s.ai.hand.findIndex(card => card.id === discardId);
                if (discardIdx > -1) s.graveyard.push(s.ai.hand.splice(discardIdx, 1)[0]);
            }
        }
      }
      else if (spell.card.name === 'Telling Time') {
        s.graveyard.push(spell.card);
        const viewed = [];
        for(let i=0; i<3; i++) if(s.deck.length) viewed.push(s.deck.pop());
        if (spell.controller === 'player') {
            s.pendingAction = { type: 'TELLING_TIME', cards: viewed, hand: null, top: null };
            s.stackResolving = false;
            return s;
        } else {
            const { handCard, topCard, bottomCard } = getAiTellingTimePlan(s, 'ai', viewed, getLivePolicyWeights(s.difficulty || 'medium'));
            if (bottomCard) s.deck.unshift(bottomCard);
            if (topCard) s.deck.push(topCard);
            if (handCard) { handCard.owner = 'ai'; s.ai.hand.push(handCard); }
        }
      }
      else if (spell.card.name === 'Predict') {
        s.graveyard.push(spell.card);
        if (spell.controller === 'player') {
            s.pendingAction = { type: 'PREDICT', guess: null };
            s.stackResolving = false;
            return s;
        } else {
            const guess = getAiPredictGuess(s);
            const milled = s.deck.length ? s.deck.pop() : null;
            if (milled) {
                s.graveyard.push(milled);
                if(milled.name === guess) { drawCards(s, 'ai', 2); } 
                else { drawCards(s, 'ai', 1); }
            }
        }
      }
      else if (spell.card.name === 'Accumulated Knowledge') {
        const akCount = s.graveyard.filter(c => c.name === 'Accumulated Knowledge').length;
        s.graveyard.push(spell.card);
        drawCards(s, spell.controller, 1 + akCount);
        logAction(`${spell.controller} drew ${1+akCount} cards from AK.`);
      }
      else if (spell.card.name === 'Mental Note') {
        s.graveyard.push(spell.card);
        for(let i=0; i<2; i++) if(s.deck.length) s.graveyard.push(s.deck.pop());
        drawCards(s, spell.controller, 1);
      }
      else if (spell.card.name === "Day's Undoing") {
        s.graveyard.push(spell.card);
        s.deck = [...s.deck, ...s.graveyard, ...s.player.hand, ...s.ai.hand];
        s.graveyard = []; s.player.hand = []; s.ai.hand = [];
        for (let i = s.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [s.deck[i], s.deck[j]] = [s.deck[j], s.deck[i]];
        }
        drawAlternating(s, s.turn, 7);
        logAction(`Day's Undoing resets hands and graveyard!`);
        if (s.turn === spell.controller) {
            s[s.turn].board.forEach(c => { c.attacking = false; c.blocking = false; });
            s[s.turn === 'player' ? 'ai' : 'player'].board.forEach(c => { c.attacking = false; c.blocking = false; });
            s.phase = 'main2';
            s.priority = s.turn;
            s.stackResolving = false;
            s.consecutivePasses = 0;
            return reducer(s, { type: 'NEXT_PHASE' });
        }
      }
      else if (spell.card.name === 'Capture of Jingzhou') {
        s.graveyard.push(spell.card);
        s.extraTurns[spell.controller] = (s.extraTurns[spell.controller] || 0) + 1;
        logAction(`${spell.controller} takes an extra turn!`);
      }
      else if (spell.card.name === 'Control Magic') {
        if (spell.target) {
            let targetController = null;
            let targetIdx = -1;
            ['player', 'ai'].forEach(p2 => {
              if (targetIdx > -1) return;
              const foundIdx = s[p2].board.findIndex(c => c.id === spell.target.id && isCreatureCard(c));
              if (foundIdx > -1) {
                targetController = p2;
                targetIdx = foundIdx;
              }
            });

            if (targetController && targetIdx > -1) {
                const [stolen] = s[targetController].board.splice(targetIdx, 1);
                const aura = {
                  ...clearAttachmentState(spell.card),
                  owner: spell.card.owner || spell.controller,
                  summoningSickness: false,
                  enchantedId: stolen.id,
                  attachmentOrder: s.actionCount || 0
                };
                const controllerChanged = targetController !== spell.controller;
                const enchantedCreature = {
                  ...stolen,
                  controlledByAuraId: aura.id,
                  summoningSickness: controllerChanged ? true : stolen.summoningSickness,
                  attacking: controllerChanged ? false : stolen.attacking,
                  blocking: controllerChanged ? false : stolen.blocking
                };
                s[spell.controller].board.push(enchantedCreature);
                s[spell.controller].board.push(aura);
                logAction(`${spell.controller} resolved Control Magic.`);
            } else {
                s.graveyard.push(clearAttachmentState(spell.card));
            }
        } else {
            s.graveyard.push(clearAttachmentState(spell.card));
        }
      }
      
      if (!s.pendingAction) {
          s = checkStateBasedActions(s); s.stackResolving = false; s.priority = s.turn; s.consecutivePasses = 0;
      }
      return s;

    case 'TOGGLE_PENDING_SELECT':
       if (['BRAINSTORM', 'DISCARD', 'MULLIGAN_BOTTOM', 'DISCARD_CLEANUP'].includes(s.pendingAction.type)) {
          const idx = s.pendingAction.selected.indexOf(action.cardId);
          if (idx > -1) s.pendingAction.selected.splice(idx, 1);
          else if (s.pendingAction.selected.length < s.pendingAction.count) s.pendingAction.selected.push(action.cardId);
       }
       return s;

    case 'UPDATE_TELLING_TIME':
       if (action.dest === 'hand') {
           if (s.pendingAction.top === action.cardId) s.pendingAction.top = null;
           s.pendingAction.hand = action.cardId;
       } else if (action.dest === 'top') {
           if (s.pendingAction.hand === action.cardId) s.pendingAction.hand = null;
           s.pendingAction.top = action.cardId;
       }
       return s;

    case 'SUBMIT_PENDING_ACTION':
       if (s.pendingAction.type === 'BRAINSTORM') {
           s.pendingAction.selected.forEach(cardId => {
               const idx = s.player.hand.findIndex(c => c.id === cardId);
               if(idx > -1) s.deck.push(s.player.hand.splice(idx, 1)[0]);
           });
           logAction(`You put cards on top.`);
       } else if (s.pendingAction.type === 'DISCARD') {
           s.pendingAction.selected.forEach(cardId => {
               const idx = s.player.hand.findIndex(c => c.id === cardId);
               if(idx > -1) s.graveyard.push(s.player.hand.splice(idx, 1)[0]);
           });
           logAction(`You discarded a card.`);
       } else if (s.pendingAction.type === 'PREDICT') {
           if(s.deck.length) {
               const milled = s.deck.pop();
               s.graveyard.push(milled);
               logAction(`Predict milled: ${milled.name}.`);
               if(milled.name === action.guess) { drawCards(s, 'player', 2); } 
               else { drawCards(s, 'player', 1); }
           }
       } else if (s.pendingAction.type === 'TELLING_TIME') {
           const handCard = s.pendingAction.cards.find(c => c.id === s.pendingAction.hand);
           const topCard = s.pendingAction.cards.find(c => c.id === s.pendingAction.top);
           const bottomCard = s.pendingAction.cards.find(c => c.id !== s.pendingAction.hand && c.id !== s.pendingAction.top);
           if(bottomCard) s.deck.unshift(bottomCard);
           if(topCard) s.deck.push(topCard);
           if(handCard) { handCard.owner = 'player'; s.player.hand.push(handCard); }
           logAction(`You resolved Telling Time.`);
       } else if (s.pendingAction.type === 'HALIMAR_DEPTHS') {
           const reversed = [...s.pendingAction.cards].reverse();
           reversed.forEach(c => s.deck.push(c));
           logAction(`You reordered the top of your library.`);
       } else if (s.pendingAction.type === 'MULLIGAN_BOTTOM') {
           s.pendingAction.selected.forEach(cardId => {
               const idx = s.player.hand.findIndex(c => c.id === cardId);
               if(idx > -1) s.deck.unshift(s.player.hand.splice(idx, 1)[0]);
           });
           logAction(`You put ${s.pendingAction.count} card(s) on the bottom.`);
           s.phase = 'upkeep';
         } else if (s.pendingAction.type === 'DISCARD_CLEANUP') {
            s.pendingAction.selected.forEach(cardId => {
                const idx = s.player.hand.findIndex(c => c.id === cardId);
                if(idx > -1) s.graveyard.push(s.player.hand.splice(idx, 1)[0]);
            });
            logAction(`You discarded down to 7 cards.`);
            s.pendingAction = null;
            return reducer(s, { type: 'NEXT_TURN' });
         } else if (s.pendingAction.type === 'ACTIVATE_LAND') {
             const targetPlayer = s.pendingAction.player || 'player';
             s = resolveLandActivation(s, targetPlayer, s.pendingAction.cardId, s.pendingAction.cardName, s.pendingAction.activation || getActivationDetails(s.pendingAction.cardName));
         } else if (s.pendingAction.type === 'HAND_LAND_ACTION') {
             s.pendingAction = null;
         } else if (s.pendingAction.type === 'MYSTIC_SANCTUARY') {
            if (action.selectedCardId) {
               const targetIdx = s.graveyard.findIndex(c => c.id === action.selectedCardId);
               if (targetIdx > -1) {
                   const [spell] = s.graveyard.splice(targetIdx, 1);
                   s.deck.push(spell);
                   logAction(`You put ${spell.name} on top of your library with Mystic Sanctuary.`);
               }
           } else {
               logAction(`You chose not to use Mystic Sanctuary's effect.`);
           }
       }
       s.pendingAction = null;
       s = checkStateBasedActions(s);
       s.stackResolving = false;
       s.priority = s.turn;
       s.consecutivePasses = 0;
       return s;

    case 'NEXT_PHASE':
      clearFloatingMana(s);
      s.consecutivePasses = 0;
      if (s.phase === 'upkeep') {
         if (s.isFirstTurn) {
             s.isFirstTurn = false; 
          } else {
               s = reducer(s, { type: 'DRAW', player: s.turn }); 
           }
          s.phase = 'main1'; s.priority = s.turn;
      } else if (s.phase === 'main1') {
        s.phase = 'declare_attackers';
        s.priority = s.turn;
      } else if (s.phase === 'declare_attackers') {
        s = enforceMandatoryDandanAttacks(s, s.turn);
        const attackers = s[s.turn].board.filter(c => c.attacking).length;
        if (attackers > 0) {
            s.phase = 'declare_blockers';
            s.priority = s.turn === 'player' ? 'ai' : 'player'; 
        } else {
            s.phase = 'main2';
            s.priority = s.turn;
        }
      } else if (s.phase === 'declare_blockers') {
        const attacker = s.turn; const defender = attacker === 'player' ? 'ai' : 'player';
        const attackingDandans = s[attacker].board.filter(c => c.attacking);
        const blockingDandans = s[defender].board.filter(c => c.blocking); 

        let unblocked = attackingDandans.length; let deadAttackers = []; let deadBlockers = [];
        for (let i = 0; i < attackingDandans.length; i++) {
          if (i < blockingDandans.length) {
            unblocked--; deadAttackers.push(attackingDandans[i]); deadBlockers.push(blockingDandans[i]);
          }
        }
        
        if (unblocked > 0) {
          s[defender].life -= unblocked * 4; 
          logAction(`${attacker} deals ${unblocked * 4} damage!`);
        }
        
        if (deadAttackers.length > 0) {
          s[attacker].board = s[attacker].board.filter(c => !deadAttackers.includes(c));
          s[defender].board = s[defender].board.filter(c => !deadBlockers.includes(c));
          s.graveyard.push(...deadAttackers, ...deadBlockers);
        }
        
        s[attacker].board.forEach(c => { 
            if (c.attacking) {
                c.attacking = false; 
                c.tapped = true; 
            }
        }); 
        s[defender].board.forEach(c => c.blocking = false);
         
         s.hasAttacked[attacker] = true;
         s.phase = 'main2'; s.priority = s.turn;
      } else if (s.phase === 'main2') {
         s.phase = 'cleanup';
         s.priority = s.turn;
      } else if (s.phase === 'cleanup') {
         if (s[s.turn].hand.length > 7) {
              if (s.turn === 'player') {
                  s.pendingAction = { type: 'DISCARD_CLEANUP', count: s.player.hand.length - 7, selected: [] };
                  s.priority = 'player';
                  if (!action.silentPhaseSound) effects.playPhase(s.phase);
                  return s;
              } else {
                  while(s.ai.hand.length > 7) s.graveyard.push(s.ai.hand.shift());
              }
          }
          return reducer(s, { type: 'NEXT_TURN', silentPhaseSound: true });
      }
      s = checkStateBasedActions(s);
      if (!s.winner && !s.stackResolving && !s.pendingAction && !s.pendingTargetSelection && s.priority && !checkHasActions(s, s.priority)) {
        const other = s.priority === 'player' ? 'ai' : 'player';
        const otherPriorityState = { ...s, priority: other };
        if (checkHasActions(otherPriorityState, other)) {
          return reducer(s, { type: 'PASS_PRIORITY', player: s.priority });
        }
        return reducer(s, { type: 'NEXT_PHASE', silentPhaseSound: true });
      }
      if (!action.silentPhaseSound) effects.playPhase(s.phase);
      return s;

    case 'NEXT_TURN':
      clearFloatingMana(s);
      if (s.extraTurns[s.turn] > 0) {
          s.extraTurns[s.turn]--;
          logAction(`-- ${s.turn}'s Extra Turn! --`);
      } else {
          s.turn = s.turn === 'player' ? 'ai' : 'player';
      }
      s.phase = 'upkeep';
      s[s.turn].landsPlayed = 0; 
      s.hasAttacked = { player: false, ai: false };
      s[s.turn].board = untapBoard(s[s.turn].board); 
      s.priority = s.turn;
      s = checkStateBasedActions(s);
      if (!s.winner && !s.stackResolving && !s.pendingAction && !s.pendingTargetSelection && s.priority && !checkHasActions(s, s.priority)) {
        const other = s.priority === 'player' ? 'ai' : 'player';
        const otherPriorityState = { ...s, priority: other };
        if (checkHasActions(otherPriorityState, other)) {
          return reducer(s, { type: 'PASS_PRIORITY', player: s.priority });
        }
        return reducer(s, { type: 'NEXT_PHASE', silentPhaseSound: true });
      }
      if (!action.silentPhaseSound) effects.playPhase(s.phase);
      return s;

    case 'TOGGLE_ATTACK':
      if (s.turn !== action.player || s.phase !== 'declare_attackers') return s;
      s[action.player].board = s[action.player].board.map(c => {
         if (c.id === action.cardId) {
            if (c.name === DANDAN_NAME && !canDandanAttackDefender(c, s[action.player === 'player' ? 'ai' : 'player'].board)) return c;
            const isAttacking = !c.attacking;
            return { ...c, attacking: isAttacking };
         }
         return c;
      });
      return s;

    case 'TOGGLE_BLOCK':
      const expectedDefender = s.turn === 'player' ? 'ai' : 'player';
      if (action.player !== expectedDefender || s.phase !== 'declare_blockers') return s;
      s[action.player].board = s[action.player].board.map(c => c.id === action.cardId ? { ...c, blocking: !c.blocking } : c);
      return s;
      
    case 'REORDER_HALIMAR':
      if (s.pendingAction && s.pendingAction.type === 'HALIMAR_DEPTHS') {
         const newCards = [...s.pendingAction.cards];
         const [moved] = newCards.splice(action.from, 1);
         newCards.splice(action.to, 0, moved);
         s.pendingAction.cards = newCards;
      }
      return s;

    case 'REORDER_HAND':
      const newHand = [...s.player.hand];
      const [moved] = newHand.splice(action.from, 1);
      newHand.splice(action.to, 0, moved);
      s.player.hand = newHand;
      return s;
      
    case 'SORT_HAND':
      s.player.hand = [...s.player.hand].sort((a, b) => {
         if (a.isLand !== b.isLand) return a.isLand ? 1 : -1;
         return a.cost - b.cost;
      });
      return s;

    default: return s;
  }
  };

  return reducer;
};



