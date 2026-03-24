import { trainedPolicy } from '../trainedPolicy';

// --- CARD DATABASE (SLD FORGETFUL FISH) ---
const buildCard = (id, name, type, cost, manaCost, effect, stats = null, isInstant = false, isLand = false) => ({
  name, type, cost, manaCost, effect, stats, isInstant, isLand,
  image: `https://api.scryfall.com/cards/sld/${id}?format=image&version=art_crop`,
  fullImage: `https://api.scryfall.com/cards/sld/${id}?format=image&version=normal`
});

export const CARDS = {
  DANDAN: buildCard(2138, 'DandÃ¢n', 'Creature â€” Fish', 2, '{U}{U}', "DandÃ¢n attacks each combat if able.\nDandÃ¢n can't attack unless defending player controls an Island.\nWhen you control no Islands, sacrifice DandÃ¢n.", '4/1', false, false),
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
  TEMPLE: buildCard(2164, 'Svyelunite Temple', 'Land', 0, '', "Enters tapped. {T}: Add {U}. {1}{U}, {T}, Sac: Draw a card.", null, false, true)
};

const DECKLIST = [
  ...Array(10).fill(CARDS.DANDAN), ...Array(4).fill(CARDS.ACCUMULATED_KNOWLEDGE), ...Array(2).fill(CARDS.MAGICAL_HACK), ...Array(8).fill(CARDS.MEMORY_LAPSE),
  ...Array(2).fill(CARDS.BRAINSTORM), ...Array(2).fill(CARDS.CRYSTAL_SPRAY), ...Array(2).fill(CARDS.MENTAL_NOTE), ...Array(2).fill(CARDS.METAMORPHOSE),
  ...Array(2).fill(CARDS.PREDICT), ...Array(2).fill(CARDS.TELLING_TIME), ...Array(2).fill(CARDS.UNSUBSTANTIATE), ...Array(5).fill(CARDS.ISLAND_1),
  ...Array(5).fill(CARDS.ISLAND_2), ...Array(5).fill(CARDS.ISLAND_3), ...Array(5).fill(CARDS.ISLAND_4), ...Array(2).fill(CARDS.MYSTIC_SANCTUARY),
  ...Array(2).fill(CARDS.HALIMAR), ...Array(2).fill(CARDS.FENGRAF), ...Array(2).fill(CARDS.SANDBAR), ...Array(2).fill(CARDS.REMOTE_ISLE),
  ...Array(2).fill(CARDS.SURGICAL_BAY), ...Array(2).fill(CARDS.TEMPLE), ...Array(2).fill(CARDS.CAPTURE), ...Array(2).fill(CARDS.CHART),
  ...Array(2).fill(CARDS.DAYS_UNDOING), ...Array(2).fill(CARDS.CONTROL_MAGIC)
];

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

const getBlueSources = (card) => {
  if (!card.isLand) return 0;
  if (card.name === 'Haunted Fengraf') return 0;
  if (card.name === 'The Surgical Bay' || card.name === 'Svyelunite Temple' || card.name === 'Lonely Sandbar' || card.name === 'Remote Isle') return 1;
  return card.type.includes('Island') ? 1 : 0;
};

const getBlueRequirement = (manaCost) => (manaCost.match(/\{U\}/g) || []).length;

const initializeDeck = () => {
  let deck = DECKLIST.map(card => ({
    ...card,
    id: generateId(),
    tapped: false,
    summoningSickness: true,
    attacking: false,
    blocking: false,
    isSwamp: false,
    owner: null,
    landType: card.type.includes('Island') ? 'Island' : null,
    blueSources: getBlueSources(card),
    blueRequirement: getBlueRequirement(card.manaCost),
    dandanLandType: 'Island',
    enchantedId: null,
    controlledByAuraId: null
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
export const getManaStats = (board) => ({
  total: board.filter(c => c.isLand && !c.tapped).length,
  blue: board.filter(c => c.isLand && !c.tapped && (c.blueSources || 0) > 0).length
});
const canPayCost = (board, totalCost, blueCost = 0) => {
  const mana = getManaStats(board);
  return mana.total >= totalCost && mana.blue >= blueCost;
};
const tapMana = (board, totalCost, blueCost = 0) => {
  let remainingTotal = totalCost;
  let remainingBlue = blueCost;
  const nextBoard = board.map(card => ({ ...card }));

  nextBoard.forEach(card => {
    if (remainingBlue > 0 && card.isLand && !card.tapped && (card.blueSources || 0) > 0) {
      card.tapped = true;
      remainingBlue--;
      remainingTotal--;
    }
  });

  nextBoard.forEach(card => {
    if (remainingTotal > 0 && card.isLand && !card.tapped) {
      card.tapped = true;
      remainingTotal--;
    }
  });

  return nextBoard;
};

// --- GAME STATE ENGINE ---
export const initialState = {
  started: false, deck: [], graveyard: [], stack: [], turn: 'player', phase: 'mulligan', priority: 'player', 
  consecutivePasses: 0, actionCount: 0, pendingTargetSelection: null, pendingAction: null,
  mulliganCount: 0, isFirstTurn: true,
  gameMode: 'player',
  difficulty: 'medium',
  player: { life: 20, hand: [], board: [], landsPlayed: 0 },
  ai: { life: 20, hand: [], board: [], landsPlayed: 0 },
  hasAttacked: { player: false, ai: false },
  hasBlocked: { player: false, ai: false },
  extraTurns: { player: 0, ai: 0 },
  winner: null, log: [], stackResolving: false
};

export const getAvailableMana = (board) => getManaStats(board).total;
export const getAvailableBlueMana = (board) => getManaStats(board).blue;
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
  const auraMap = {};
  ['player', 'ai'].forEach(controller => {
    state[controller].board.forEach(card => {
      if (card.name === 'Control Magic' && card.enchantedId) {
        auraMap[card.id] = { controller, enchantedId: card.enchantedId };
      }
    });
  });

  ['player', 'ai'].forEach(controller => {
    const nextBoard = [];
    state[controller].board.forEach(card => {
      if (card.name !== DANDAN_NAME || !card.controlledByAuraId) {
        nextBoard.push(card);
        return;
      }

      const aura = auraMap[card.controlledByAuraId];
      const owner = card.owner || controller;
      if (!aura) {
        const released = { ...card, controlledByAuraId: null };
        if (owner === controller) nextBoard.push(released);
        else state[owner].board.push(released);
        return;
      }

      if (aura.controller === controller) nextBoard.push(card);
      else state[aura.controller].board.push(card);
    });
    state[controller].board = nextBoard;
  });

  ['player', 'ai'].forEach(controller => {
    const nextBoard = [];
    state[controller].board.forEach(card => {
      if (card.name !== 'Control Magic') {
        nextBoard.push(card);
        return;
      }

      const enchantedStillExists = state.player.board.some(c => c.id === card.enchantedId) || state.ai.board.some(c => c.id === card.enchantedId);
      if (enchantedStillExists) nextBoard.push(card);
      else state.graveyard.push({ ...card, enchantedId: null });
    });
    state[controller].board = nextBoard;
  });

  return state;
};

const checkStateBasedActions = (state) => {
  let newState = { ...state };
  let changesMade = false;
  ['player', 'ai'].forEach(p => {
    const dandans = newState[p].board.filter(c => c.name === DANDAN_NAME);
    const deadDandans = dandans.filter(c => !boardHasLandType(newState[p].board, getDandanLandType(c)));
    if (deadDandans.length > 0) {
      newState[p].board = newState[p].board.filter(c => !deadDandans.includes(c));
      newState.graveyard = [...newState.graveyard, ...deadDandans];
      newState.log = [...newState.log, `${p === 'player' ? 'Your' : "AI's"} DandÃ¢ns died (no ${getDandanLandType(deadDandans[0])}s).`];
      changesMade = true;
    }
    if (newState[p].life <= 0 && !newState.winner) {
      newState.winner = p === 'player' ? 'ai' : 'player'; changesMade = true;
    }
  });
  return changesMade ? newState : state;
};

const getActivationCost = (cardName) => {
  if (cardName === 'The Surgical Bay') return 1;
  if (cardName === 'Svyelunite Temple') return 2;
  if (cardName === 'Haunted Fengraf') return 3;
  return null;
};

export const isActivatable = (card, state, player = 'player') => {
  if (state.priority !== player) return false;
  if (state.pendingTargetSelection || state.pendingAction) return false;
  if (card.tapped || !card.isLand) return false;
  
  const cost = getActivationCost(card.name);
  if (cost === null) return false;

  const blueCost = ['The Surgical Bay', 'Svyelunite Temple'].includes(card.name) ? 1 : 0;
  if (!canPayCost(state[player].board.filter(c => c.id !== card.id), cost, blueCost)) return false;
  
  if (card.name === 'Haunted Fengraf' && !state.graveyard.some(c => c.type.includes('Creature'))) return false;

  return true;
};

export const isCastable = (card, state, player = 'player') => {
  if (state.priority !== player) return false;
  if (state.pendingTargetSelection || state.pendingAction) return false;
  if (!canPayCost(state[player].board, card.cost, card.blueRequirement || 0)) return false;
  
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
  if (card.name === 'Control Magic' && !state[opp].board.some(b => b.name === 'DandÃ¢n')) return false;

  return true;
};

export const isValidTarget = (card, zone, state) => {
  if (!state.pendingTargetSelection) return false;
  const spellName = state.pendingTargetSelection.spellName;
  
  if (spellName === 'Memory Lapse') return zone === 'stack';
  if (spellName === 'Unsubstantiate') return zone === 'stack' || (zone === 'board' && card.name === 'DandÃ¢n');
  if (['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(spellName)) return zone === 'board';
  if (spellName === 'Control Magic') return zone === 'board' && card.name === 'DandÃ¢n' && state.ai.board.some(c => c.id === card.id);
  return false;
};

// SMART AUTO-PASS SYSTEM
export const checkHasActions = (s, p) => {
  if (s.phase === 'mulligan' || s.phase === 'cleanup') return true;
  if (s.pendingTargetSelection || s.pendingAction) return true;
  
  const opp = p === 'player' ? 'ai' : 'player';
  const oppHasIsland = controlsIsland(s[opp].board);
  const hasValidAttacker = s[p].board.some(c => c.name === 'DandÃ¢n' && !c.summoningSickness && !c.tapped);
  const hasValidBlocker = s[p].board.some(c => c.name === 'DandÃ¢n' && !c.tapped);

  if (s.turn === p && s.phase !== 'declare_attackers' && s.phase !== 'declare_blockers' && s.phase !== 'upkeep' && s[p].landsPlayed < 1 && s[p].hand.some(c => c.isLand)) return true;
  
  if (s.turn === p && s.phase === 'declare_attackers') {
     if (oppHasIsland && hasValidAttacker) return true;
  }
  if (s.turn !== p && s.phase === 'declare_blockers' && hasValidBlocker) return true;
  
  for (const c of s[p].hand) {
    if (isCastable(c, s, p)) {
        if (s.stack.length === 0) {
           if (s.phase === 'declare_attackers' && (!oppHasIsland || !hasValidAttacker) && s[s.turn].board.filter(x=>x.attacking).length === 0) continue;
           if (s.phase === 'declare_blockers' && s[s.turn === 'player' ? 'ai' : 'player'].board.filter(x=>x.attacking).length === 0) continue;
        }
        return true;
    }
  }
  for (const b of s[p].board) {
    if (isActivatable(b, s, p)) {
        if (s.stack.length === 0) {
           if (s.phase === 'declare_attackers' && (!oppHasIsland || !hasValidAttacker) && s[s.turn].board.filter(x=>x.attacking).length === 0) continue;
           if (s.phase === 'declare_blockers' && s[s.turn === 'player' ? 'ai' : 'player'].board.filter(x=>x.attacking).length === 0) continue;
        }
        return true;
    }
  }
  return false;
};

const shouldMakeMistake = (difficulty, rate, policy) => Math.random() < Math.max(rate, policy?.mistakeRate ?? 0);
const getSpellPriority = (card, policy) => {
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

const defaultEffects = {
  initAudio: () => {},
  playDraw: () => {},
  playLand: () => {},
  playCast: () => {},
  playResolve: () => {},
  playPhase: () => {}
};

export const createGameReducer = (effects = defaultEffects) => {
  const reducer = (state, action) => {
    let s = { ...state, actionCount: (state.actionCount || 0) + 1 };
    const logAction = (msg) => { s.log = [msg, ...s.log].slice(0, 15); };

  switch (action.type) {
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
         hasAttacked: { player: false, ai: false },
         hasBlocked: { player: false, ai: false },
         extraTurns: { player: 0, ai: 0 },
         pendingAction: null, pendingTargetSelection: null
      };
      drawAlternating(s, 'player', 7);
      logAction(gameMode === 'ai_vs_ai' ? "AI mirror started." : "Game started. Mulligan phase.");
      return s;

    case 'MULLIGAN':
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
                viewed.sort((a, b) => a.isLand ? 1 : -1);
                while(viewed.length) s.deck.push(viewed.pop());
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
                        const spell = validSpells[0];
                        s.graveyard = s.graveyard.filter(c => c.id !== spell.id);
                        s.deck.push(spell);
                        logAction(`AI put ${spell.name} on top with Mystic Sanctuary.`);
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
      const landCost = getActivationCost(action.cardName);
      const promptLand = s.player.board.find(c => c.id === action.cardId);
      if (!promptLand || !isActivatable(promptLand, s, 'player')) return s;
      s.pendingAction = { type: 'ACTIVATE_LAND', cardId: action.cardId, cardName: action.cardName, cost: landCost };
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
        target = s[opp].board.find(c => c.name === 'DandÃ¢n'); 
      }
      else if (!target && ['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(card.name)) {
        target = s[opp].board.find(c => c.name === 'DandÃ¢n') || s[opp].board.find(c => c.isLand) || s[p].board.find(c => c.isLand);
      }

      if (!canPayCost(s[p].board, card.cost, card.blueRequirement || 0)) return s;
      effects.playCast();
      s[p].board = tapMana(s[p].board, card.cost, card.blueRequirement || 0);
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

      if (!canPayCost(s.player.board, card.cost, card.blueRequirement || 0)) return { ...s, pendingTargetSelection: null };
      effects.playCast();
      s.player.board = tapMana(s.player.board, card.cost, card.blueRequirement || 0);
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
                    bounced.tapped = false; bounced.attacking = false; bounced.summoningSickness = true;
                    s.deck.push(bounced);
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
                bounced.tapped = false; bounced.attacking = false; bounced.summoningSickness = true;
                const owner = bounced.owner || p2;
                s[owner].hand.push(bounced);
                logAction(`Unsubstantiate returned DandÃ¢n to owner's hand.`);
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
            s.ai.hand.sort((a,b) => a.isLand === b.isLand ? 0 : a.isLand ? -1 : 1);
            if(s.ai.hand.length) s.deck.push(s.ai.hand.shift());
            if(s.ai.hand.length) s.deck.push(s.ai.hand.shift());
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
                if(s.ai.hand.length) s.graveyard.push(s.ai.hand.shift());
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
            viewed.sort((a, b) => a.isLand ? -1 : 1);
            if(viewed.length) s.deck.unshift(viewed.shift());
            if(viewed.length) s.deck.push(viewed.shift());
            if(viewed.length) { const c = viewed.shift(); c.owner = 'ai'; s.ai.hand.push(c); }
        }
      }
      else if (spell.card.name === 'Predict') {
        s.graveyard.push(spell.card);
        if (spell.controller === 'player') {
            s.pendingAction = { type: 'PREDICT', guess: null };
            s.stackResolving = false;
            return s;
        } else {
            const milled = s.deck.length ? s.deck.pop() : null;
            if (milled) {
                s.graveyard.push(milled);
                if(milled.name === 'DandÃ¢n') { drawCards(s, 'ai', 2); } 
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
            const opp = spell.controller === 'player' ? 'ai' : 'player';
            const targetIdx = s[opp].board.findIndex(c => c.id === spell.target.id);
            if (targetIdx > -1) {
                const [stolen] = s[opp].board.splice(targetIdx, 1);
                const aura = { ...spell.card, owner: spell.controller, enchantedId: stolen.id };
                stolen.controlledByAuraId = aura.id;
                s[spell.controller].board.push(stolen);
                s[spell.controller].board.push(aura);
                logAction(`${spell.controller} resolved Control Magic.`);
            } else {
                s.graveyard.push(spell.card);
            }
        } else {
            s.graveyard.push(spell.card);
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
            const landIdx = s.player.board.findIndex(c => c.id === s.pendingAction.cardId);
            if (landIdx > -1) {
                const landToActivate = s.player.board[landIdx];
                if (!isActivatable(landToActivate, s, 'player')) {
                    s.pendingAction = null;
                    return s;
                }

                const activationBlueCost = ['The Surgical Bay', 'Svyelunite Temple'].includes(s.pendingAction.cardName) ? 1 : 0;
                const boardWithoutLand = s.player.board.filter(c => c.id !== s.pendingAction.cardId);
                s.player.board = tapMana(boardWithoutLand, s.pendingAction.cost, activationBlueCost);

                const sacrificedLand = { ...landToActivate, tapped: true, attacking: false, blocking: false };
                s.graveyard.push(sacrificedLand);
                
                if (s.pendingAction.cardName === 'The Surgical Bay' || s.pendingAction.cardName === 'Svyelunite Temple') {
                    drawCards(s, 'player', 1);
                    logAction(`Sacrificed ${s.pendingAction.cardName} to draw a card.`);
               } else if (s.pendingAction.cardName === 'Haunted Fengraf') {
                   const creatures = s.graveyard.filter(c => c.type.includes('Creature'));
                   if (creatures.length > 0) {
                       const randIdx = Math.floor(Math.random() * creatures.length);
                       const selectedCreature = creatures[randIdx];
                       s.graveyard = s.graveyard.filter(c => c.id !== selectedCreature.id);
                       selectedCreature.owner = 'player';
                       s.player.hand.push(selectedCreature);
                       logAction(`Sacrificed Fengraf. Returned ${selectedCreature.name}.`);
                   }
               }
           }
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
         if (s[s.turn].hand.length > 7) {
              s.phase = 'cleanup';
              if (s.turn === 'player') {
                  s.pendingAction = { type: 'DISCARD_CLEANUP', count: s.player.hand.length - 7, selected: [] };
                  s.priority = 'player';
                  if (!action.silentPhaseSound) effects.playPhase(s.phase);
                  return s;
              } else {
                  while(s.ai.hand.length > 7) s.graveyard.push(s.ai.hand.shift());
                  return reducer(s, { type: 'NEXT_TURN', silentPhaseSound: true });
               }
          } else {
              return reducer(s, { type: 'NEXT_TURN', silentPhaseSound: true });
          }
      }
      s = checkStateBasedActions(s);
      if (!s.winner && !s.stackResolving && !s.pendingAction && !s.pendingTargetSelection && s.priority && !checkHasActions(s, s.priority)) {
        return reducer(s, { type: 'NEXT_PHASE', silentPhaseSound: true });
      }
      if (!action.silentPhaseSound) effects.playPhase(s.phase);
      return s;

    case 'NEXT_TURN':
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
        return reducer(s, { type: 'NEXT_PHASE', silentPhaseSound: true });
      }
      if (!action.silentPhaseSound) effects.playPhase(s.phase);
      return s;

    case 'TOGGLE_ATTACK':
      if (s.turn !== action.player || s.phase !== 'declare_attackers') return s;
      s[action.player].board = s[action.player].board.map(c => {
         if (c.id === action.cardId) { const isAttacking = !c.attacking; return { ...c, attacking: isAttacking, tapped: isAttacking }; }
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



