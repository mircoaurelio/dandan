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
export const FULL_DECKLIST = DECKLIST;
const CARD_TEMPLATES_BY_NAME = DECKLIST.reduce((map, card) => {
  if (!map[card.name]) map[card.name] = card;
  return map;
}, {});
const TOTAL_CARD_COUNTS = DECKLIST.reduce((counts, card) => {
  counts[card.name] = (counts[card.name] || 0) + 1;
  return counts;
}, {});

export const SHARED_DECK_SIZE = DECKLIST.length;

export const PREDICT_OPTIONS = Array.from(new Set(Object.values(CARDS).map(c => c.name))).sort();
export const DANDAN_NAME = CARDS.DANDAN.name;
export const INSTANT_OR_SORCERY_TYPES = ['Instant', 'Sorcery'];
const CHARACTER_CARD_BONUSES = {
  tortoise: {
    'The Surgical Bay': 2.2,
    'Halimar Depths': 1.8,
    'Lonely Sandbar': 1.4,
    'Remote Isle': 1.2,
    'Svyelunite Temple': 1.6,
    'Memory Lapse': 1.8,
    'Unsubstantiate': 1.4
  },
  shark: {
    [DANDAN_NAME]: 3.8,
    'Capture of Jingzhou': 1.8,
    'Chart a Course': 1.2,
    'Control Magic': 1.2
  },
  archivist: {
    Predict: 4.6,
    'Mental Note': 3.4,
    'Telling Time': 3.8,
    Brainstorm: 3.4,
    'Halimar Depths': 2.8,
    'Mystic Sanctuary': 3.2
  },
  eel: {
    Unsubstantiate: 3.4,
    Metamorphose: 3.2,
    'Crystal Spray': 2.4,
    'Magical Hack': 2.2,
    'Memory Lapse': 1.6
  },
  siren: {
    'Control Magic': 4.8,
    Unsubstantiate: 2.2,
    Metamorphose: 2.8,
    'Crystal Spray': 1.4
  },
  undertow: {
    'The Surgical Bay': 4.4,
    'Mental Note': 2.8,
    Predict: 2.8,
    'Memory Lapse': 1.8,
    Unsubstantiate: 1.4
  },
  cartographer: {
    Brainstorm: 4.0,
    Predict: 3.4,
    'Telling Time': 3.4,
    'Halimar Depths': 3.0,
    'Mystic Sanctuary': 3.4
  },
  piranha: {
    [DANDAN_NAME]: 4.2,
    'Capture of Jingzhou': 2.2,
    'Chart a Course': 1.6,
    'Control Magic': 1.2
  },
  hermit: {
    'Memory Lapse': 2.6,
    Unsubstantiate: 2.8,
    'Control Magic': 1.8,
    'Haunted Fengraf': 1.4,
    'The Surgical Bay': 1.4
  },
  leviathan: {
    [DANDAN_NAME]: 1.2,
    'Memory Lapse': 1.6,
    Unsubstantiate: 1.6,
    Predict: 1.4,
    Brainstorm: 1.4,
    'Telling Time': 1.4,
    'Control Magic': 1.4,
    Metamorphose: 1.4,
    'The Surgical Bay': 1.2,
    'Mystic Sanctuary': 1.2
  }
};
export const AI_DIFFICULTIES = ['easy', 'medium', 'hard'];
export const AI_DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
export const AI_SPEED = { easy: { think: 900, pass: 250, resolve: 700 }, medium: { think: 450, pass: 120, resolve: 250 }, hard: { think: 140, pass: 40, resolve: 70 } };
const DEFAULT_POLICY_WEIGHTS = {
  easy: { aggression: 0.92, control: 0.52, drawBias: 0.48, mistakeRate: 0.22, landLimit: 4.0, counterBias: 0.72, stealBias: 0.82, attackBias: 0.92, blockBias: 0.88 },
  medium: { aggression: 1.08, control: 0.72, drawBias: 0.7, mistakeRate: 0.05, landLimit: 4.25, counterBias: 1.02, stealBias: 1.06, attackBias: 1.03, blockBias: 1.02 }
};
export const DEFAULT_AI_CHARACTER_ID = 'shark';
export const AI_CHARACTERS = [
  {
    id: 'tortoise',
    name: 'Tortoise',
    title: 'Shoreline Miser',
    summary: 'Aggressively mulligans for blue non-Island lands, never plays Islands, and squeezes the game dry.',
    tags: ['denial', 'control'],
    style: {
      aggressionMultiplier: 0.8,
      controlMultiplier: 1.28,
      drawBiasMultiplier: 0.95,
      landLimitOffset: 0.35,
      counterBiasMultiplier: 1.18,
      stealBiasMultiplier: 0.82,
      attackBiasMultiplier: 0.82,
      blockBiasMultiplier: 1.22,
      searchDepthBonus: 1,
      rootBreadthBonus: 1,
      replyBreadthBonus: 1,
      survivalBreadthBonus: 2
    }
  },
  {
    id: 'shark',
    name: 'Shark',
    title: 'Tempo Predator',
    summary: 'Tempo killer. Slams Dandan when protected, punishes stumbles, and loves crackback lethals.',
    tags: ['tempo', 'pressure'],
    style: {
      aggressionMultiplier: 1.34,
      controlMultiplier: 1.08,
      drawBiasMultiplier: 0.92,
      counterBiasMultiplier: 1.04,
      attackBiasMultiplier: 1.36,
      blockBiasMultiplier: 0.9,
      searchDepthBonus: 1,
      rootBreadthBonus: 1,
      rolloutDecisionBonus: 1
    }
  },
  {
    id: 'archivist',
    name: 'Archivist',
    title: 'Keeper Of Topdecks',
    summary: 'Memory monster. Best at Predict, Mental Note, Halimar Depths, Telling Time, and Mystic Sanctuary.',
    tags: ['memory', 'library'],
    style: {
      aggressionMultiplier: 0.94,
      controlMultiplier: 1.2,
      drawBiasMultiplier: 1.42,
      counterBiasMultiplier: 1.12,
      stealBiasMultiplier: 0.96,
      attackBiasMultiplier: 0.94,
      blockBiasMultiplier: 1.06,
      searchDepthBonus: 1,
      rootBreadthBonus: 1,
      rolloutDecisionBonus: 2
    }
  },
  {
    id: 'eel',
    name: 'Eel',
    title: 'Slipstream Trickster',
    summary: 'Trickster. Passes often, wins on stack timing, bounce traps, and surprise rescues.',
    tags: ['tricks', 'stack'],
    style: {
      aggressionMultiplier: 0.96,
      controlMultiplier: 1.28,
      drawBiasMultiplier: 1.06,
      counterBiasMultiplier: 1.22,
      stealBiasMultiplier: 0.9,
      attackBiasMultiplier: 0.92,
      blockBiasMultiplier: 1.08,
      searchDepthBonus: 1,
      replyBreadthBonus: 2,
      rolloutDecisionBonus: 1,
      survivalBreadthBonus: 1
    }
  },
  {
    id: 'siren',
    name: 'Siren',
    title: 'Borrowed Tide',
    summary: 'Theft/control specialist. Prioritizes Control Magic, self-bounce to break theft, and long stack traps.',
    tags: ['theft', 'control'],
    style: {
      aggressionMultiplier: 0.92,
      controlMultiplier: 1.34,
      drawBiasMultiplier: 1.06,
      counterBiasMultiplier: 1.18,
      stealBiasMultiplier: 1.42,
      attackBiasMultiplier: 0.9,
      blockBiasMultiplier: 1.12,
      searchDepthBonus: 1,
      replyBreadthBonus: 2,
      rolloutDecisionBonus: 1,
      survivalBreadthBonus: 1
    }
  },
  {
    id: 'undertow',
    name: 'Undertow',
    title: 'Winner Of Draw Wars',
    summary: 'Draw-war expert. Loves Surgical Bay, instant-speed races, top-card denial, and response windows.',
    tags: ['stack', 'draw-wars'],
    style: {
      aggressionMultiplier: 0.98,
      controlMultiplier: 1.24,
      drawBiasMultiplier: 1.22,
      landLimitOffset: 0.24,
      counterBiasMultiplier: 1.22,
      blockBiasMultiplier: 1.1,
      searchDepthBonus: 1,
      rootBreadthBonus: 1,
      replyBreadthBonus: 1,
      rolloutDecisionBonus: 2
    }
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    title: 'Library Sculptor',
    summary: 'Library sculptor. Maximizes topdeck quality with Brainstorm, Sanctuary, Halimar, and Predict.',
    tags: ['library', 'setup'],
    style: {
      aggressionMultiplier: 0.94,
      controlMultiplier: 1.18,
      drawBiasMultiplier: 1.4,
      landLimitOffset: 0.18,
      counterBiasMultiplier: 1.08,
      attackBiasMultiplier: 0.9,
      blockBiasMultiplier: 1.02,
      searchDepthBonus: 1,
      rootBreadthBonus: 1,
      rolloutDecisionBonus: 2,
      autoStepBonus: 4
    }
  },
  {
    id: 'piranha',
    name: 'Piranha',
    title: 'Bloodwake Sprinter',
    summary: 'Hyper-aggressive. Converts tiny tempo edges into lethal pressure, blocks less, and attacks relentlessly.',
    tags: ['aggressive', 'tempo'],
    style: {
      aggressionMultiplier: 1.42,
      controlMultiplier: 0.96,
      drawBiasMultiplier: 0.86,
      counterBiasMultiplier: 0.94,
      attackBiasMultiplier: 1.44,
      blockBiasMultiplier: 0.82,
      searchDepthBonus: 1,
      rootBreadthBonus: 1,
      rolloutDecisionBonus: 1
    }
  },
  {
    id: 'hermit',
    name: 'Hermit Crab',
    title: 'Last Shell',
    summary: 'Survival specialist. Extremely hard to kill, holds interaction, and values not dying over greed.',
    tags: ['survival', 'control'],
    style: {
      aggressionMultiplier: 0.84,
      controlMultiplier: 1.38,
      drawBiasMultiplier: 1.08,
      landLimitOffset: 0.35,
      counterBiasMultiplier: 1.26,
      stealBiasMultiplier: 1.1,
      attackBiasMultiplier: 0.86,
      blockBiasMultiplier: 1.3,
      searchDepthBonus: 1,
      rootBreadthBonus: 1,
      replyBreadthBonus: 2,
      autoStepBonus: 4,
      survivalBreadthBonus: 2
    }
  },
  {
    id: 'leviathan',
    name: 'Leviathan',
    title: 'Honest Final Boss',
    summary: 'Fair final honest boss. Same public info only, but deepest search, best memory, and best motif coverage.',
    tags: ['boss', 'fair'],
    style: {
      aggressionMultiplier: 1.12,
      controlMultiplier: 1.38,
      drawBiasMultiplier: 1.22,
      landLimitOffset: 0.3,
      counterBiasMultiplier: 1.3,
      stealBiasMultiplier: 1.16,
      attackBiasMultiplier: 1.08,
      blockBiasMultiplier: 1.14,
      searchDepthBonus: 3,
      rootBreadthBonus: 2,
      replyBreadthBonus: 2,
      rolloutDecisionBonus: 3,
      autoStepBonus: 14,
      survivalBreadthBonus: 3
    }
  }
];
const AI_CHARACTER_MAP = Object.fromEntries(AI_CHARACTERS.map(character => [character.id, character]));
export const getAiCharacter = (characterId) => AI_CHARACTER_MAP[characterId] || null;
const readCharacterStyleNumber = (style, key, fallback = 0) => Number(style?.[key] ?? fallback);

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
  blockBias: policy.blockBias ?? policy.control ?? 0.5,
  perfectPlay: policy.perfectPlay ?? false,
  searchDepthBonus: Math.max(0, Math.round(policy.searchDepthBonus ?? 0)),
  rootBreadthBonus: Math.max(0, Math.round(policy.rootBreadthBonus ?? 0)),
  replyBreadthBonus: Math.max(0, Math.round(policy.replyBreadthBonus ?? 0)),
  rolloutDecisionBonus: Math.max(0, Math.round(policy.rolloutDecisionBonus ?? 0)),
  autoStepBonus: Math.max(0, Math.round(policy.autoStepBonus ?? 0)),
  survivalBreadthBonus: Math.max(0, Math.round(policy.survivalBreadthBonus ?? 0))
});
const applyCharacterStyle = (basePolicy, characterId = null) => {
  const character = getAiCharacter(characterId);
  if (!character?.style) return normalizePolicy(basePolicy);
  const style = character.style || {};
  return normalizePolicy({
    ...basePolicy,
    aggression: (basePolicy.aggression ?? 1) * readCharacterStyleNumber(style, 'aggressionMultiplier', 1) + readCharacterStyleNumber(style, 'aggressionBonus', 0),
    control: (basePolicy.control ?? 0.5) * readCharacterStyleNumber(style, 'controlMultiplier', 1) + readCharacterStyleNumber(style, 'controlBonus', 0),
    drawBias: (basePolicy.drawBias ?? 0.5) * readCharacterStyleNumber(style, 'drawBiasMultiplier', 1) + readCharacterStyleNumber(style, 'drawBiasBonus', 0),
    mistakeRate: Math.max(0, (basePolicy.mistakeRate ?? 0.1) * readCharacterStyleNumber(style, 'mistakeRateMultiplier', 1) + readCharacterStyleNumber(style, 'mistakeRateBonus', 0)),
    landLimit: (basePolicy.landLimit ?? 4) + readCharacterStyleNumber(style, 'landLimitOffset', 0),
    counterBias: (basePolicy.counterBias ?? basePolicy.control ?? 0.5) * readCharacterStyleNumber(style, 'counterBiasMultiplier', 1) + readCharacterStyleNumber(style, 'counterBiasBonus', 0),
    stealBias: (basePolicy.stealBias ?? basePolicy.control ?? 0.5) * readCharacterStyleNumber(style, 'stealBiasMultiplier', 1) + readCharacterStyleNumber(style, 'stealBiasBonus', 0),
    attackBias: (basePolicy.attackBias ?? basePolicy.aggression ?? 1) * readCharacterStyleNumber(style, 'attackBiasMultiplier', 1) + readCharacterStyleNumber(style, 'attackBiasBonus', 0),
    blockBias: (basePolicy.blockBias ?? basePolicy.control ?? 0.5) * readCharacterStyleNumber(style, 'blockBiasMultiplier', 1) + readCharacterStyleNumber(style, 'blockBiasBonus', 0),
    perfectPlay: basePolicy.perfectPlay ?? false,
    searchDepthBonus: (basePolicy.searchDepthBonus ?? 0) + readCharacterStyleNumber(style, 'searchDepthBonus', 0),
    rootBreadthBonus: (basePolicy.rootBreadthBonus ?? 0) + readCharacterStyleNumber(style, 'rootBreadthBonus', 0),
    replyBreadthBonus: (basePolicy.replyBreadthBonus ?? 0) + readCharacterStyleNumber(style, 'replyBreadthBonus', 0),
    rolloutDecisionBonus: (basePolicy.rolloutDecisionBonus ?? 0) + readCharacterStyleNumber(style, 'rolloutDecisionBonus', 0),
    autoStepBonus: (basePolicy.autoStepBonus ?? 0) + readCharacterStyleNumber(style, 'autoStepBonus', 0),
    survivalBreadthBonus: (basePolicy.survivalBreadthBonus ?? 0) + readCharacterStyleNumber(style, 'survivalBreadthBonus', 0)
  });
};
const getHardModePolicy = (policy = trainedPolicy.weights) => normalizePolicy({
  ...policy,
  aggression: Math.max(1.22, policy?.aggression ?? 1),
  control: Math.max(1.02, policy?.control ?? 0.5),
  mistakeRate: 0,
  counterBias: Math.max(1.18, policy?.counterBias ?? policy?.control ?? 0.5),
  stealBias: Math.max(1.14, policy?.stealBias ?? policy?.control ?? 0.5),
  attackBias: Math.max(1.18, policy?.attackBias ?? policy?.aggression ?? 1),
  blockBias: Math.max(1.04, policy?.blockBias ?? policy?.control ?? 0.5),
  perfectPlay: true
});
export const getLivePolicyWeights = (difficulty, characterId = null, basePolicy = null) => {
  const resolvedDifficulty = difficulty || 'medium';
  const fallbackPolicy = basePolicy || (resolvedDifficulty === 'hard' ? trainedPolicy.weights : DEFAULT_POLICY_WEIGHTS[resolvedDifficulty]);
  const normalizedBase = resolvedDifficulty === 'hard'
    ? getHardModePolicy(fallbackPolicy)
    : normalizePolicy(fallbackPolicy);
  return applyCharacterStyle(normalizedBase, characterId);
};
const getActorCharacterId = (state, actor = 'ai') => actor === 'player' ? state?.playerAiCharacterId : state?.aiCharacterId;
const getCharacterCardBonus = (state, actor, card) => CHARACTER_CARD_BONUSES[getActorCharacterId(state, actor)]?.[card?.name] ?? 0;
const getInteractionHoldThreshold = (state, actor) => {
  switch (getActorCharacterId(state, actor)) {
    case 'eel': return 13.5;
    case 'siren': return 12.8;
    case 'undertow': return 12.4;
    case 'hermit': return 14;
    case 'archivist': return 11.8;
    case 'leviathan': return 12;
    default: return 10;
  }
};
export const getAiPolicyForActor = (state, actor = 'ai', difficulty = state?.difficulty || 'medium') => {
  const characterId = getActorCharacterId(state, actor);
  return getLivePolicyWeights(difficulty, characterId);
};

const EMPTY_MANA_POOL = { total: 0, blue: 0 };

const getBlueSources = (card) => {
  if (!card.isLand) return 0;
  if (card.name === 'Haunted Fengraf') return 0;
  if (card.name === 'The Surgical Bay' || card.name === 'Svyelunite Temple' || card.name === 'Lonely Sandbar' || card.name === 'Remote Isle' || card.name === 'Halimar Depths') return 1;
  return card.type.includes('Island') ? 1 : 0;
};

const getBlueRequirement = (manaCost) => (manaCost.match(/\{U\}/g) || []).length;
const isCreatureTemplate = (card) => Boolean(card) && (card.type?.includes('Creature') || card.name === DANDAN_NAME);
const PRINTED_DANDAN_LAND_TYPE = 'Island';
export const LAND_TYPE_CHOICES = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
const isLandTypeChoice = (landType) => LAND_TYPE_CHOICES.includes(landType);
const isLandTypeChoiceSpell = (spellName) => ['Magical Hack', 'Crystal Spray'].includes(spellName);
const getPrintedLandType = (card) => card.type?.includes('Island') ? 'Island' : null;
const createTextChangeStateSnapshot = (card) => ({
  landType: card.landType ?? getPrintedLandType(card),
  isSwamp: Boolean(card.isSwamp),
  blueSources: card.blueSources ?? getBlueSources(card),
  dandanLandType: card.dandanLandType || PRINTED_DANDAN_LAND_TYPE
});
const applyTextChangeStateSnapshot = (card, snapshot) => ({
  ...card,
  landType: snapshot.landType,
  isSwamp: snapshot.isSwamp,
  blueSources: snapshot.blueSources,
  dandanLandType: snapshot.dandanLandType
});
const getLandTextChangeSnapshot = (landType) => ({
  landType,
  isSwamp: landType === 'Swamp',
  blueSources: landType === 'Island' ? 1 : 0
});
const getCardTextChangeSnapshotForLandType = (card, landType) => {
  if (!isLandTypeChoice(landType)) return null;
  if (card.name === DANDAN_NAME) {
    return {
      ...createTextChangeStateSnapshot(card),
      dandanLandType: landType
    };
  }
  if (card.isLand) {
    return {
      ...createTextChangeStateSnapshot(card),
      ...getLandTextChangeSnapshot(landType)
    };
  }
  return null;
};
const clearTemporaryTextChangeState = (card) => ({
  ...card,
  temporaryTextChangeBaseState: null
});
const getCardWithChosenLandType = (card, landType) => {
  const snapshot = getCardTextChangeSnapshotForLandType(card, landType);
  return snapshot ? applyTextChangeStateSnapshot(card, snapshot) : card;
};
const applyLandTypeChoiceToCard = (card, landType, duration = 'permanent') => {
  const snapshot = getCardTextChangeSnapshotForLandType(card, landType);
  if (!snapshot) return card;

  if (duration === 'endOfTurn') {
    const baseState = card.temporaryTextChangeBaseState || createTextChangeStateSnapshot(card);
    return {
      ...applyTextChangeStateSnapshot(card, snapshot),
      temporaryTextChangeBaseState: baseState
    };
  }

  const transformed = applyTextChangeStateSnapshot(card, snapshot);
  return clearTemporaryTextChangeState(transformed);
};
const expireTemporaryTextChange = (card) => {
  if (!card.temporaryTextChangeBaseState) return card;
  return clearTemporaryTextChangeState(applyTextChangeStateSnapshot(card, card.temporaryTextChangeBaseState));
};
const expireTemporaryTextChanges = (board) => board.map(expireTemporaryTextChange);

export const initializeDeck = () => {
  let deck = DECKLIST.map(card => ({
    ...card,
    id: generateId(),
    tapped: false,
    summoningSickness: isCreatureTemplate(card),
    attacking: false,
    blocking: false,
    isSwamp: false,
    owner: null,
    landType: getPrintedLandType(card),
    blueSources: getBlueSources(card),
    blueRequirement: getBlueRequirement(card.manaCost),
    dandanLandType: PRINTED_DANDAN_LAND_TYPE,
    enchantedId: null,
    controlledByAuraId: null,
    attachmentOrder: null,
    temporaryTextChangeBaseState: null
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const getLandType = (card) => card.landType ?? getPrintedLandType(card);
const getDandanLandType = (card) => card.dandanLandType || PRINTED_DANDAN_LAND_TYPE;
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
const resetZoneChangedTextState = (card) => ({
  ...card,
  isSwamp: false,
  landType: getPrintedLandType(card),
  blueSources: getBlueSources(card),
  dandanLandType: PRINTED_DANDAN_LAND_TYPE,
  temporaryTextChangeBaseState: null
});
const preparePermanentForZoneChange = (card, overrides = {}) => ({
  ...resetZoneChangedTextState(clearAttachmentState(card)),
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

const KNOWLEDGE_PLAYERS = ['player', 'ai'];
const cloneKnowledgeCard = (card) => card ? ({
  id: card.id,
  name: card.name,
  cost: card.cost,
  blueRequirement: card.blueRequirement || getBlueRequirement(card.manaCost || ''),
  isLand: Boolean(card.isLand),
  type: card.type,
  manaCost: card.manaCost
}) : null;
const createKnowledgeView = () => ({
  knownTop: [],
  knownHands: {
    player: [],
    ai: []
  }
});
const createKnowledgeState = () => ({
  player: createKnowledgeView(),
  ai: createKnowledgeView()
});
const ensureKnowledgeState = (state) => {
  if (!state.knowledge) state.knowledge = createKnowledgeState();
  KNOWLEDGE_PLAYERS.forEach(viewer => {
    if (!state.knowledge[viewer]) state.knowledge[viewer] = createKnowledgeView();
    if (!state.knowledge[viewer].knownTop) state.knowledge[viewer].knownTop = [];
    if (!state.knowledge[viewer].knownHands) {
      state.knowledge[viewer].knownHands = { player: [], ai: [] };
    }
    KNOWLEDGE_PLAYERS.forEach(owner => {
      if (!state.knowledge[viewer].knownHands[owner]) state.knowledge[viewer].knownHands[owner] = [];
    });
  });
  return state.knowledge;
};
const getKnowledgeView = (state, viewer) => ensureKnowledgeState(state)[viewer];
const setKnownTop = (state, viewer, cards) => {
  getKnowledgeView(state, viewer).knownTop = cards.map(cloneKnowledgeCard).filter(Boolean);
};
const clearKnownTop = (state, viewer) => {
  getKnowledgeView(state, viewer).knownTop = [];
};
const prependKnownTopCard = (state, viewers, card) => {
  const viewerList = viewers === 'all' ? KNOWLEDGE_PLAYERS : Array.isArray(viewers) ? viewers : [viewers];
  viewerList.forEach(viewer => {
    const view = getKnowledgeView(state, viewer);
    view.knownTop = [cloneKnowledgeCard(card), ...view.knownTop.filter(entry => entry.id !== card.id)];
  });
};
const addKnownHandCard = (state, viewer, owner, card) => {
  const knownHand = getKnowledgeView(state, viewer).knownHands[owner];
  if (!knownHand.some(entry => entry.id === card.id)) knownHand.push(cloneKnowledgeCard(card));
};
const removeKnownHandCard = (state, owner, cardId) => {
  ensureKnowledgeState(state);
  KNOWLEDGE_PLAYERS.forEach(viewer => {
    getKnowledgeView(state, viewer).knownHands[owner] = getKnowledgeView(state, viewer).knownHands[owner].filter(entry => entry.id !== cardId);
  });
};
const clearKnownHand = (state, viewer, owner) => {
  getKnowledgeView(state, viewer).knownHands[owner] = [];
};
const forgetPrivateHandInfoFromOpponent = (state, owner) => {
  clearKnownHand(state, getOpponent(owner), owner);
};
const consumeTopKnowledgeOnDraw = (state, drawer, card) => {
  ensureKnowledgeState(state);
  KNOWLEDGE_PLAYERS.forEach(viewer => {
    const view = getKnowledgeView(state, viewer);
    if (view.knownTop.length > 0) {
      if (view.knownTop[0].id === card.id) {
        view.knownTop.shift();
        if (viewer !== drawer) addKnownHandCard(state, viewer, drawer, card);
      } else {
        view.knownTop = [];
      }
    }
  });
};
const consumeTopKnowledgeCard = (state, card) => {
  ensureKnowledgeState(state);
  KNOWLEDGE_PLAYERS.forEach(viewer => {
    const view = getKnowledgeView(state, viewer);
    if (view.knownTop.length === 0) return;
    if (view.knownTop[0].id === card.id) {
      view.knownTop.shift();
      return;
    }
    view.knownTop = [];
  });
};
const resetHiddenKnowledge = (state) => {
  ensureKnowledgeState(state);
  KNOWLEDGE_PLAYERS.forEach(viewer => {
    clearKnownTop(state, viewer);
    KNOWLEDGE_PLAYERS.forEach(owner => clearKnownHand(state, viewer, owner));
  });
};
const createPeerMulliganState = () => ({
  counts: { player: 0, ai: 0 },
  kept: { player: false, ai: false }
});
const isPeerGame = (state) => state.gameMode === 'peer';
const isHumanControlledSeat = (state, seat) => state.gameMode === 'peer' || (seat === 'player' && state.gameMode !== 'ai_vs_ai');
const getSeatLabel = (seat) => seat === 'player' ? 'You' : 'Opponent';
const getPeerMulliganState = (state) => state.peerMulligan || createPeerMulliganState();
const getPeerMulliganCount = (state, seat) => getPeerMulliganState(state).counts?.[seat] || 0;
const markPeerSeatKept = (state, seat) => {
  state.peerMulligan = getPeerMulliganState(state);
  state.peerMulligan.kept[seat] = true;
};
const setPeerMulliganCount = (state, seat, count) => {
  state.peerMulligan = getPeerMulliganState(state);
  state.peerMulligan.counts[seat] = count;
};
const haveBothPeerSeatsKept = (state) => {
  const peerMulligan = getPeerMulliganState(state);
  return Boolean(peerMulligan.kept.player && peerMulligan.kept.ai);
};

// --- GAME STATE ENGINE ---
export const initialState = {
  started: false, deck: [], graveyard: [], exile: [], stack: [], knowledge: createKnowledgeState(), turn: 'player', phase: 'mulligan', priority: 'player',
  consecutivePasses: 0, actionCount: 0, pendingTargetSelection: null, pendingAction: null,
  mulliganCount: 0, isFirstTurn: true,
  peerMulligan: null,
  gameMode: 'player',
  difficulty: 'medium',
  playerAiCharacterId: null,
  aiCharacterId: null,
  player: { life: 20, hand: [], board: [], landsPlayed: 0 },
  ai: { life: 20, hand: [], board: [], landsPlayed: 0 },
  floatingMana: { player: { total: 0, blue: 0 }, ai: { total: 0, blue: 0 } },
  hasAttacked: { player: false, ai: false },
  hasBlocked: { player: false, ai: false },
  extraTurns: { player: 0, ai: 0 },
  winner: null, log: [], stackResolving: false
};
const restoreSavedGameState = (snapshot) => {
  if (!snapshot?.started || !Array.isArray(snapshot.deck) || !snapshot.player || !snapshot.ai) {
    return { ...initialState };
  }

  const restored = structuredClone(snapshot);

  return {
    ...initialState,
    ...restored,
    started: true,
    deck: Array.isArray(restored.deck) ? restored.deck : [],
    graveyard: Array.isArray(restored.graveyard) ? restored.graveyard : [],
    exile: Array.isArray(restored.exile) ? restored.exile : [],
    stack: Array.isArray(restored.stack) ? restored.stack : [],
    knowledge: restored.knowledge || createKnowledgeState(),
    player: {
      ...initialState.player,
      ...(restored.player || {}),
      hand: Array.isArray(restored.player?.hand) ? restored.player.hand : [],
      board: Array.isArray(restored.player?.board) ? restored.player.board : []
    },
    ai: {
      ...initialState.ai,
      ...(restored.ai || {}),
      hand: Array.isArray(restored.ai?.hand) ? restored.ai.hand : [],
      board: Array.isArray(restored.ai?.board) ? restored.ai.board : []
    },
    floatingMana: {
      player: {
        ...initialState.floatingMana.player,
        ...(restored.floatingMana?.player || {})
      },
      ai: {
        ...initialState.floatingMana.ai,
        ...(restored.floatingMana?.ai || {})
      }
    },
    hasAttacked: {
      ...initialState.hasAttacked,
      ...(restored.hasAttacked || {})
    },
    hasBlocked: {
      ...initialState.hasBlocked,
      ...(restored.hasBlocked || {})
    },
    extraTurns: {
      ...initialState.extraTurns,
      ...(restored.extraTurns || {})
    },
    pendingAction: restored.pendingAction || null,
    pendingTargetSelection: restored.pendingTargetSelection || null,
    peerMulligan: restored.peerMulligan || null,
    winner: restored.winner || null,
    log: Array.isArray(restored.log) ? restored.log : []
  };
};
const untapBoard = (board) => board.map(c => ({ ...c, tapped: false, summoningSickness: false, attacking: false, blocking: false }));

const drawCards = (s, player, count) => {
  for(let i=0; i<count; i++) {
     if(s.deck.length > 0) {
        const c = s.deck.pop();
        consumeTopKnowledgeOnDraw(s, player, c);
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
  if (cardName === 'The Surgical Bay') return { total: 1, blue: 1, effect: 'draw', usesStack: true };
  if (cardName === 'Svyelunite Temple') return { total: 0, blue: 0, effect: 'double_blue', usesStack: false };
  if (cardName === 'Haunted Fengraf') return { total: 3, blue: 0, effect: 'fengraf', usesStack: true };
  return null;
};
const isAbilityStackEntry = (entry) => entry?.kind === 'ability';
const isSpellStackEntry = (entry) => Boolean(entry) && !isAbilityStackEntry(entry);
const getStackEntryName = (entry) => isAbilityStackEntry(entry) ? `${entry.card.name} ability` : entry.card.name;
const getTopSpellOnStack = (stack) => [...stack].reverse().find(isSpellStackEntry) || null;

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
  const anySpellOnStack = state.stack.some(isSpellStackEntry);
  const opp = player === 'player' ? 'ai' : 'player';
  if (card.name === 'Memory Lapse' && !anySpellOnStack) return false;
  if (card.name === 'Unsubstantiate' && !anySpellOnStack && !anyDandan) return false;
  
  if (['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(card.name) && state.stack.length === 0 && state.player.board.length === 0 && state.ai.board.length === 0) return false;
  if (card.name === 'Control Magic' && ![...state.player.board, ...state.ai.board].some(isCreatureCard)) return false;

  return true;
};

export const isValidTarget = (card, zone, state) => {
  if (!state.pendingTargetSelection) return false;
  const spellName = state.pendingTargetSelection.spellName;
  
  if (spellName === 'Memory Lapse') return zone === 'stack' && isSpellStackEntry(card);
  if (spellName === 'Unsubstantiate') return (zone === 'stack' && isSpellStackEntry(card)) || (zone === 'board' && isCreatureCard(card));
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

const shouldMakeMistake = (rate, policy) => {
  if (policy?.perfectPlay) return false;
  return Math.random() < Math.max(rate, policy?.mistakeRate ?? 0);
};
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
const getOpponent = (actor) => actor === 'player' ? 'ai' : 'player';
const getKnownTopDeckCard = (state, viewer, offset = 0) => getKnowledgeView(state, viewer).knownTop[offset] || null;
const getKnownTopDeckCards = (state, viewer, count) => getKnowledgeView(state, viewer).knownTop.slice(0, Math.max(0, count));
const getKnownHandCards = (state, viewer, owner) => viewer === owner
  ? state[owner].hand.map(cloneKnowledgeCard).filter(Boolean)
  : getKnowledgeView(state, viewer).knownHands[owner];
const getUnknownHandSize = (state, viewer, owner) => Math.max(0, state[owner].hand.length - getKnownHandCards(state, viewer, owner).length);
const addCardCounts = (counts, cards = []) => {
  cards.filter(Boolean).forEach(card => {
    counts[card.name] = (counts[card.name] || 0) + 1;
  });
};
const getViewerVisibleCardCounts = (state, viewer) => {
  const counts = {};
  addCardCounts(counts, state.player.board);
  addCardCounts(counts, state.ai.board);
  addCardCounts(counts, state.graveyard);
  addCardCounts(counts, state.exile);
  addCardCounts(counts, state.stack.map(entry => entry.card));
  addCardCounts(counts, state[viewer].hand);
  addCardCounts(counts, getKnownHandCards(state, viewer, getOpponent(viewer)));
  addCardCounts(counts, getKnownTopDeckCards(state, viewer, state.deck.length));
  if (state.pendingAction?.player === viewer && Array.isArray(state.pendingAction.cards)) {
    addCardCounts(counts, state.pendingAction.cards);
  }
  return counts;
};
const getUnseenCardCounts = (state, viewer) => {
  const visibleCounts = getViewerVisibleCardCounts(state, viewer);
  return Object.fromEntries(Object.entries(TOTAL_CARD_COUNTS).map(([name, total]) => [name, Math.max(0, Number(total) - (visibleCounts[name] || 0))]));
};
const getUnknownPoolSize = (state, viewer) => Object.values(getUnseenCardCounts(state, viewer)).reduce((sum, count) => sum + Number(count), 0);
const getAverageUnknownCardValue = (state, viewer) => {
  const unseenCounts = getUnseenCardCounts(state, viewer);
  const total = Object.values(unseenCounts).reduce((sum, count) => sum + Number(count), 0);
  if (total <= 0) return 0;
  const weighted = Object.entries(unseenCounts).reduce((sum, [name, count]) => sum + getBaseCardValue(CARD_TEMPLATES_BY_NAME[name]) * Number(count), 0);
  return weighted / total;
};
const getUnknownCardLikelihoodByName = (state, viewer, name) => {
  const unseenCounts = getUnseenCardCounts(state, viewer);
  const total = Object.values(unseenCounts).reduce((sum, count) => sum + Number(count), 0);
  if (total <= 0) return 0;
  return (unseenCounts[name] || 0) / total;
};
const estimateUnknownHandCopies = (state, viewer, owner, names) => {
  const unknownSlots = getUnknownHandSize(state, viewer, owner);
  if (unknownSlots <= 0) return 0;
  const unseenCounts = getUnseenCardCounts(state, viewer);
  const unseenTotal = Object.values(unseenCounts).reduce((sum, count) => sum + Number(count), 0);
  if (unseenTotal <= 0) return 0;
  const targetCopies = names.reduce((sum, name) => sum + Number(unseenCounts[name] || 0), 0);
  if (targetCopies <= 0) return 0;
  return Math.min(unknownSlots, unknownSlots * (targetCopies / unseenTotal));
};
const getAccessibleHandCardPressure = (state, viewer, owner, names) => {
  const knownMatches = getKnownHandCards(state, viewer, owner).filter(card => names.includes(card.name)).length;
  if (viewer === owner) return knownMatches;
  return knownMatches + estimateUnknownHandCopies(state, viewer, owner, names);
};
const getAccessiblePlayableCardPressure = (state, viewer, owner, names) => {
  const knownMatches = getKnownHandCards(state, viewer, owner).filter(card => (
    names.includes(card.name) &&
    canLikelyCastNextTurn(state, owner, CARD_TEMPLATES_BY_NAME[card.name] || card)
  )).length;
  if (viewer === owner) return knownMatches;
  const playableNames = names.filter(name => canLikelyCastNextTurn(state, owner, CARD_TEMPLATES_BY_NAME[name]));
  return knownMatches + estimateUnknownHandCopies(state, viewer, owner, playableNames);
};
const getAccessibleHandQuality = (state, viewer, owner) => {
  const knownCards = getKnownHandCards(state, viewer, owner);
  const knownValue = knownCards.reduce((sum, card) => sum + getBaseCardValue(card), 0);
  if (viewer === owner) return knownValue;
  return knownValue + getUnknownHandSize(state, viewer, owner) * getAverageUnknownCardValue(state, viewer);
};
const getAccessibleTopCardValue = (state, viewer, offset = 0) => {
  const knownCard = getKnownTopDeckCard(state, viewer, offset);
  if (knownCard) return { known: true, value: getBaseCardValue(knownCard), card: knownCard };
  return { known: false, value: getAverageUnknownCardValue(state, viewer), card: null };
};
const getMostLikelyUnknownCardName = (state, viewer) => {
  const unseenCounts = getUnseenCardCounts(state, viewer);
  const ranked = Object.entries(unseenCounts)
    .filter(([_name, count]) => count > 0)
    .sort((left, right) => right[1] - left[1] || getBaseCardValue(CARD_TEMPLATES_BY_NAME[right[0]]) - getBaseCardValue(CARD_TEMPLATES_BY_NAME[left[0]]));
  return ranked[0]?.[0] || DANDAN_NAME;
};
const getUpcomingNaturalDrawPlayers = (state, count = 2) => {
  const draws = [];
  let turn = state.turn;
  let phase = state.phase;
  let firstTurn = phase === 'upkeep' ? state.isFirstTurn : false;
  const extraTurns = { ...(state.extraTurns || { player: 0, ai: 0 }) };

  for (let safety = 0; safety < 24 && draws.length < count; safety++) {
    if (phase === 'mulligan') {
      phase = 'upkeep';
      firstTurn = true;
      continue;
    }
    if (phase === 'upkeep') {
      if (!firstTurn) draws.push(turn);
      firstTurn = false;
      phase = 'main1';
      continue;
    }
    if (phase === 'main1') {
      phase = 'declare_attackers';
      continue;
    }
    if (phase === 'declare_attackers') {
      phase = 'declare_blockers';
      continue;
    }
    if (phase === 'declare_blockers') {
      phase = 'main2';
      continue;
    }
    if (phase === 'main2') {
      phase = 'cleanup';
      continue;
    }
    if (phase === 'cleanup') {
      if ((extraTurns[turn] || 0) > 0) {
        extraTurns[turn]--;
      } else {
        turn = getOpponent(turn);
      }
      phase = 'upkeep';
      continue;
    }
    phase = 'cleanup';
  }

  return draws;
};
const getTopdeckDenialScore = (state, actor, count = 1) => {
  const opponent = getOpponent(actor);
  const drawPlayers = getUpcomingNaturalDrawPlayers(state, count);
  const topCount = Math.max(0, Math.min(count, state.deck.length));

  return Array.from({ length: topCount }, (_unused, index) => {
    const estimate = getAccessibleTopCardValue(state, actor, index);
    const drawPlayer = drawPlayers[index];
    const weight = index === 0 ? 1 : 0.72;
    const value = estimate.value * weight * (estimate.known ? 1 : 0.65);
    if (drawPlayer === opponent) return value;
    if (drawPlayer === actor) return -value;
    return 0;
  }).reduce((sum, value) => sum + value, 0);
};
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

  const opponent = getOpponent(actor);
  const landsInPlay = state[actor].board.filter(permanent => permanent.isLand).length;
  const spareLands = state[actor].hand.filter(permanent => permanent.isLand).length;
  const actorHasIsland = controlsIsland(state[actor].board);
  const opponentHasIsland = controlsIsland(state[opponent].board);
  const actorCounters = getLiveInteractionCards(state, actor, ['Memory Lapse', 'Unsubstantiate']).length;
  const opponentCounters = getAccessiblePlayableCardPressure(state, actor, opponent, ['Memory Lapse', 'Unsubstantiate']);
  const supportedOpponentDandans = countDandans(state[opponent].board, permanent => isDandanSupported(permanent, state[opponent].board));
  const graveAkCount = state.graveyard.filter(permanent => permanent.name === 'Accumulated Knowledge').length;
  const topCards = getKnownTopDeckCards(state, actor, 3);
  const lowValueTopCards = topCards.filter(topCard => getBaseCardValue(topCard) <= 4).length;
  const topdeckDenial = getTopdeckDenialScore(state, actor, 2);
  let score = getBaseCardValue(card) + getCharacterCardBonus(state, actor, card);

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
      score -= getAccessiblePlayableCardPressure(state, actor, opponent, ['Control Magic']) > 0.45 ? 2 : 0;
      break;
    case 'Memory Lapse':
      score += getAccessiblePlayableCardPressure(state, actor, opponent, [...HIGH_IMPACT_SPELLS]) > 0.35 ? 4 : 1.5;
      break;
    case 'Unsubstantiate':
      score += getAccessiblePlayableCardPressure(state, actor, opponent, [...HIGH_IMPACT_SPELLS]) > 0.35 ? 3.5 : 1.2;
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
      score -= getAccessibleHandQuality(state, actor, actor) > getAccessibleHandQuality(state, actor, opponent) ? 2.5 : 0;
      break;
    case 'Accumulated Knowledge':
      score += graveAkCount * 2.2;
      break;
    case 'Predict':
      score += state.deck.length > 0 ? 4 : -8;
      score += wantsPredictSetup(state, actor) ? 1.2 : 0;
      score += getTopdeckDenialScore(state, actor, 1) * 0.55;
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
      score += topdeckDenial * 0.95;
      if (wantsPredictSetup(state, actor) && getKnownTopDeckCard(state, actor) && getBaseCardValue(getKnownTopDeckCard(state, actor)) >= 6) score -= 2.8;
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
const isIslandLandCard = (card) => Boolean(card?.isLand) && getLandType(card) === 'Island';
const isBlueNonIslandLandCard = (card) => Boolean(card?.isLand) && (card.blueSources || 0) > 0 && getLandType(card) !== 'Island';
const isTortoise = (state, actor) => getActorCharacterId(state, actor) === 'tortoise';
const getAiOpeningBottomScore = (state, actor, card, policy) => {
  let score = getAiCardValue(state, actor, card, policy);
  if (isTortoise(state, actor)) {
    if (isIslandLandCard(card)) score -= 20;
    if (isBlueNonIslandLandCard(card)) score += 10;
  }
  return score;
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
const getAiOpeningBottomCards = (state, actor, count, policy) => [...state[actor].hand]
  .sort((left, right) => getAiOpeningBottomScore(state, actor, left, policy) - getAiOpeningBottomScore(state, actor, right, policy) || left.cost - right.cost)
  .slice(0, count);
export const shouldAiMulliganOpeningHand = (state, actor, mulligansTaken = 0) => {
  if (!isTortoise(state, actor)) return false;
  if (mulligansTaken >= 3) return false;
  const hand = state[actor].hand;
  const nonIslandBlueLands = hand.filter(isBlueNonIslandLandCard).length;
  return nonIslandBlueLands < 2;
};
const runAiOpeningMulligans = (state, actor) => {
  const characterId = getActorCharacterId(state, actor);
  if (!characterId) return 0;

  let mulligansTaken = 0;
  while (shouldAiMulliganOpeningHand(state, actor, mulligansTaken)) {
    state.deck = [...state.deck, ...state[actor].hand];
    state[actor].hand = [];
    resetHiddenKnowledge(state);
    for (let i = state.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
    }
    drawCards(state, actor, 7);
    mulligansTaken++;
  }

  if (mulligansTaken > 0) {
    const policy = getAiPolicyForActor(state, actor);
    getAiOpeningBottomCards(state, actor, mulligansTaken, policy).forEach(card => {
      const idx = state[actor].hand.findIndex(entry => entry.id === card.id);
      if (idx > -1) {
        const [bottomed] = state[actor].hand.splice(idx, 1);
        state.deck.unshift(bottomed);
      }
    });
    resetHiddenKnowledge(state);
  }

  return mulligansTaken;
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
const getAiPredictGuess = (state, actor) => getKnownTopDeckCard(state, actor)?.name || getMostLikelyUnknownCardName(state, actor);
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
const getSpellContextScore = (state, actor, card, policy, difficulty = state.difficulty || 'medium', viewer = actor) => {
  const opponent = getOpponent(actor);
  let score = getSpellPriority(card, policy) + getAiCardValue(state, actor, card, policy) * 0.55;

  if (difficulty === 'hard' && !card.isLand && HIGH_IMPACT_SPELLS.has(card.name)) {
    const opponentCounters = getAccessiblePlayableCardPressure(state, viewer, opponent, ['Memory Lapse', 'Unsubstantiate']);
    const actorCounters = getAccessiblePlayableCardPressure(state, viewer, actor, ['Memory Lapse', 'Unsubstantiate']);
    if (opponentCounters > actorCounters) score -= 3.5;
  }

  if (card.name === 'Predict' && getKnownTopDeckCard(state, viewer)) score += 3;
  if (card.name === 'Predict') score += getTopdeckDenialScore(state, actor, 1) * 0.65;
  if (card.name === 'Mental Note') score += getKnownTopDeckCards(state, viewer, 2).filter(topCard => getBaseCardValue(topCard) <= 4).length * 1.2 + getTopdeckDenialScore(state, actor, 2) * 1.1;
  if (card.name === "Day's Undoing" && state[actor].hand.length >= 5 && getAccessibleHandQuality(state, viewer, actor) >= getAccessibleHandQuality(state, viewer, opponent)) score -= 6;

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
const getBoardAfterTransformingPermanent = (board, permanentId, landType = 'Swamp') => board.map(card => {
  if (card.id !== permanentId) return card;
  return getCardWithChosenLandType(card, landType);
});
const getBoardAfterRemovingPermanent = (board, permanentId) => board.filter(card => card.id !== permanentId);
const getCardVersionFromBoard = (board, card) => board.find(entry => entry.id === card.id) || null;
const isDandanSupportedOnBoard = (card, board) => {
  const boardCard = getCardVersionFromBoard(board, card) || card;
  return isDandanSupported(boardCard, board);
};
const countDandansLosingSupport = (currentBoard, nextBoard) => currentBoard.filter(card => (
  card.name === DANDAN_NAME &&
  isDandanSupported(card, currentBoard) &&
  !isDandanSupportedOnBoard(card, nextBoard)
)).length;
const countSupportedDandans = (board) => countDandans(board, card => isDandanSupported(card, board));
const countReadyAttackDandansAgainst = (attackerBoard, defenderBoard) => countDandans(attackerBoard, card => (
  !card.summoningSickness &&
  !card.tapped &&
  canDandanAttackDefender(card, defenderBoard)
));
const countAttackingDandansLosingSupport = (currentBoard, nextBoard) => currentBoard.filter(card => (
  card.name === DANDAN_NAME &&
  card.attacking &&
  isDandanSupported(card, currentBoard) &&
  !isDandanSupportedOnBoard(card, nextBoard)
)).length;
const getMissingLandType = (board, preferredOrder = LAND_TYPE_CHOICES) => (
  preferredOrder.find(landType => !boardHasLandType(board, landType)) || preferredOrder[0] || PRINTED_DANDAN_LAND_TYPE
);
const spellWouldSelfDestruct = (state, spell) => spell?.card?.name === DANDAN_NAME && !boardHasLandType(state[spell.controller].board, getDandanLandType(spell.card));
const getBattlefieldCard = (state, cardId) => state.player.board.find(card => card.id === cardId) || state.ai.board.find(card => card.id === cardId) || null;
const getBattlefieldController = (state, cardId) => {
  if (state.player.board.some(card => card.id === cardId)) return 'player';
  if (state.ai.board.some(card => card.id === cardId)) return 'ai';
  return null;
};
const getThreatenedFriendlyCreaturesFromSpell = (state, actor, stackSpell) => {
  const target = stackSpell?.target?.card || stackSpell?.target;
  if (!stackSpell?.card || !target?.id) return [];

  if (stackSpell.card.name === 'Control Magic') {
    const creature = getBattlefieldCard(state, target.id);
    if (creature && isCreatureCard(creature) && (creature.owner || getBattlefieldController(state, creature.id)) === actor) {
      return [creature];
    }
    return [];
  }

  if (!['Metamorphose', 'Magical Hack', 'Crystal Spray'].includes(stackSpell.card.name)) return [];
  const actorBoard = state[actor].board;
  if (!actorBoard.some(card => card.id === target.id)) return [];

  const nextBoard = stackSpell.card.name === 'Metamorphose'
    ? getBoardAfterRemovingPermanent(actorBoard, target.id)
    : getBoardAfterTransformingPermanent(actorBoard, target.id, stackSpell.landTypeChoice || 'Swamp');
  const threatened = actorBoard.filter(card => (
    card.name === DANDAN_NAME &&
    isDandanSupported(card, actorBoard) &&
    !isDandanSupportedOnBoard(card, nextBoard)
  ));

  if (target.name === DANDAN_NAME) {
    const targetCreature = actorBoard.find(card => card.id === target.id);
    if (targetCreature && !threatened.some(card => card.id === targetCreature.id)) threatened.push(targetCreature);
  }

  return threatened;
};
const getReactiveRescueCreatureCandidates = (state, actor, stackSpell, policy) => getThreatenedFriendlyCreaturesFromSpell(state, actor, stackSpell)
  .map(card => ({
    target: card,
    score: 12 + getAiCardValue(state, actor, card, policy) + (card.controlledByAuraId ? 4 : 0)
  }))
  .sort((left, right) => right.score - left.score);
const getImmediateTopCardSwing = (state, actor) => {
  const opponent = getOpponent(actor);
  if (state.deck.length === 0) return 0;

  const topValue = getAccessibleTopCardValue(state, actor).value;
  const topEntry = state.stack[state.stack.length - 1];
  const contested = topEntry && topEntry.controller === opponent ? 1.35 : 0.8;
  return topValue * contested;
};
const getStackCardRaceOptions = (state, actor, policy, difficulty = state.difficulty || 'medium') => {
  if (state.stack.length === 0) return [];

  const topCardSwing = getImmediateTopCardSwing(state, actor);
  const denialPressure = Math.max(0, getTopdeckDenialScore(state, actor, 2));
  const options = [];

  const surgicalBay = state[actor].board.find(card => card.name === 'The Surgical Bay' && isActivatable(card, state, actor));
  if (surgicalBay) {
    options.push({
      action: { type: 'ACTIVATE_LAND_NOW', player: actor, cardId: surgicalBay.id, cardName: surgicalBay.name },
      score: 6 + topCardSwing + denialPressure * 0.25
    });
  }

  state[actor].hand
    .filter(card => card.isInstant && AI_VALUE_INSTANTS.has(card.name) && isCastable(card, state, actor))
    .forEach(card => {
      let score = getSpellContextScore(state, actor, card, policy, difficulty);
      if (['Accumulated Knowledge', 'Brainstorm', 'Telling Time'].includes(card.name)) score += topCardSwing;
      if (card.name === 'Mental Note') score += topCardSwing * 0.45 + denialPressure * 1.1;
      if (card.name === 'Predict') score += topCardSwing * 0.35 + denialPressure * 0.9;
      options.push({
        action: { type: 'CAST_SPELL', player: actor, cardId: card.id },
        score
      });
    });

  return options.sort((left, right) => right.score - left.score);
};
const getStackThreatScore = (state, actor, stackSpell, policy, difficulty = state.difficulty || 'medium') => {
  if (!stackSpell?.card) return Number.NEGATIVE_INFINITY;
  if (isAbilityStackEntry(stackSpell)) {
    if (stackSpell.activation?.effect === 'draw') return 6 + getImmediateTopCardSwing(state, actor);
    if (stackSpell.activation?.effect === 'fengraf') return 6 + (state.graveyard.filter(isCreatureCard).length > 0 ? 3 : 0);
    return 0;
  }
  let score = getSpellContextScore(state, actor, stackSpell.card, policy, difficulty);
  const target = stackSpell.target?.card || stackSpell.target;
  const threatenedCreatures = getThreatenedFriendlyCreaturesFromSpell(state, actor, stackSpell);

  if (threatenedCreatures.length > 0) {
    score += threatenedCreatures.reduce((sum, card) => sum + 8 + getAiCardValue(state, actor, card, policy) * 0.5, 0);
  }
  if (stackSpell.card.name === 'Control Magic' && threatenedCreatures.length > 0) score += 8;
  if (target?.id && ['Metamorphose', 'Magical Hack', 'Crystal Spray'].includes(stackSpell.card.name)) {
    const controller = getBattlefieldController(state, target.id);
    if (controller === actor && target.isLand) score += 2.5;
  }

  return score;
};
const getLandPlayScore = (state, actor, card, lands = state[actor].hand.filter(permanent => permanent.isLand)) => {
  const board = state[actor].board;
  const islandCount = board.filter(card => getLandType(card) === 'Island').length;
  const availableBlue = getBlueSourcesInPlay(board);
  const graveyardSpells = state.graveyard.filter(card => INSTANT_OR_SORCERY_TYPES.some(type => card.type?.includes(type)));
  const wantsBlueSoon = state[actor].hand.some(card => !card.isLand && (card.blueRequirement || 0) > Math.max(0, availableBlue));

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
  score += getCharacterCardBonus(state, actor, card);

  return score;
};

const chooseLandToPlay = (state, actor) => {
  const lands = state[actor].hand.filter(card => card.isLand);
  if (lands.length === 0) return null;
  const eligibleLands = isTortoise(state, actor)
    ? lands.filter(card => !isIslandLandCard(card))
    : lands;
  if (eligibleLands.length === 0) return null;
  return [...eligibleLands].sort((left, right) => getLandPlayScore(state, actor, right, eligibleLands) - getLandPlayScore(state, actor, left, eligibleLands))[0];
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

const getTransformTargetChoiceCandidates = (state, actor, target) => {
  if (!target?.id) return [];

  const targetController = getBattlefieldController(state, target.id);
  if (!targetController) return [];

  const opponent = getOpponent(actor);
  const actorBoard = state[actor].board;
  const opponentBoard = state[opponent].board;
  const actorReadyAttackWeight = state.turn === actor && (state.phase === 'main1' || state.phase === 'declare_attackers') ? 4.5 : 0;
  const opponentReadyAttackWeight = state.turn === opponent && (state.phase === 'main1' || state.phase === 'declare_attackers') ? 5.5 : 0;

  return LAND_TYPE_CHOICES.map(landTypeChoice => {
    const nextActorBoard = targetController === actor
      ? getBoardAfterTransformingPermanent(actorBoard, target.id, landTypeChoice)
      : actorBoard;
    const nextOpponentBoard = targetController === opponent
      ? getBoardAfterTransformingPermanent(opponentBoard, target.id, landTypeChoice)
      : opponentBoard;
    const opposingDandansLosingSupport = targetController === opponent
      ? countDandansLosingSupport(opponentBoard, nextOpponentBoard)
      : 0;

    const actorSupportedDelta = countSupportedDandans(nextActorBoard) - countSupportedDandans(actorBoard);
    const opponentSupportedDelta = countSupportedDandans(nextOpponentBoard) - countSupportedDandans(opponentBoard);
    const actorBlueDelta = getBlueSourcesInPlay(nextActorBoard) - getBlueSourcesInPlay(actorBoard);
    const opponentBlueDelta = getBlueSourcesInPlay(nextOpponentBoard) - getBlueSourcesInPlay(opponentBoard);
    const actorReadyAttackDelta = actorReadyAttackWeight > 0
      ? countReadyAttackDandansAgainst(nextActorBoard, nextOpponentBoard) - countReadyAttackDandansAgainst(actorBoard, opponentBoard)
      : 0;
    const opponentReadyAttackDelta = opponentReadyAttackWeight > 0
      ? countReadyAttackDandansAgainst(nextOpponentBoard, nextActorBoard) - countReadyAttackDandansAgainst(opponentBoard, actorBoard)
      : 0;
    const actorAttackingLoss = countAttackingDandansLosingSupport(actorBoard, nextActorBoard);
    const opponentAttackingLoss = countAttackingDandansLosingSupport(opponentBoard, nextOpponentBoard);

    let score =
      actorSupportedDelta * 11
      - opponentSupportedDelta * 13
      + actorBlueDelta * 2.5
      - opponentBlueDelta * 3.5
      + actorReadyAttackDelta * actorReadyAttackWeight
      - opponentReadyAttackDelta * opponentReadyAttackWeight
      - actorAttackingLoss * 4
      + opponentAttackingLoss * 4.5;

    if (target.name === DANDAN_NAME) {
      score += targetController === opponent ? 1.5 : 0.75;
    }
    if (target.isLand && targetController === actor && landTypeChoice === 'Island' && getLandType(target) !== 'Island') {
      score += 0.4;
    }
    if (target.isLand && targetController === opponent && landTypeChoice !== 'Island' && getLandType(target) === 'Island') {
      score += 0.4;
    }

    return { target, targetController, landTypeChoice, score, opposingDandansLosingSupport };
  }).sort((left, right) => right.score - left.score);
};

const getTransformTargetCandidates = (state, actor) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const targets = [...state[opponent].board, ...state[actor].board]
    .filter(card => card.name === DANDAN_NAME || card.isLand);
  const candidates = targets.flatMap(target => getTransformTargetChoiceCandidates(state, actor, target));
  return candidates.filter(candidate => {
    if (candidate.score <= 2) return false;
    if (!candidate.target.isLand) return true;
    return candidate.targetController === opponent && candidate.opposingDandansLosingSupport > 1;
  }).sort((left, right) => right.score - left.score);
};
const pickTransformTarget = (state, actor) => getTransformTargetCandidates(state, actor)[0] || null;
const chooseLandTypeForTransformTarget = (state, actor, target) => {
  if (!target?.id) return getMissingLandType([], ['Plains', 'Mountain', 'Forest', 'Swamp', 'Island']);

  const bestCandidate = getTransformTargetChoiceCandidates(state, actor, target)[0];
  if (bestCandidate) return bestCandidate.landTypeChoice;
  const targetController = getBattlefieldController(state, target.id);
  const targetBoard = targetController ? state[targetController].board : [];
  if (target.name === DANDAN_NAME) {
    return getMissingLandType(targetBoard, ['Plains', 'Mountain', 'Forest', 'Swamp', 'Island']);
  }
  if (target.isLand) {
    if (targetController === actor) return 'Island';
    return getMissingLandType(targetBoard, ['Plains', 'Mountain', 'Forest', 'Swamp']);
  }
  return getMissingLandType(targetBoard, ['Plains', 'Mountain', 'Forest', 'Swamp', 'Island']);
};

const getBounceTargetCandidates = (state, actor) => {
  const opponent = getOpponent(actor);
  const board = state[opponent].board;
  const candidates = board.filter(card => card.name === DANDAN_NAME || card.isLand || card.name === 'Control Magic').map(card => {
    if (card.name === 'Control Magic') {
      const enchantedCreature = card.enchantedId ? getBattlefieldCard(state, card.enchantedId) : null;
      const stolenBack = enchantedCreature && (enchantedCreature.owner || opponent) === actor;
      return {
        target: card,
        score: stolenBack
          ? 18 + (enchantedCreature?.name === DANDAN_NAME ? 8 : 0) + (enchantedCreature?.attacking ? 2 : 0)
          : 0
      };
    }

    const nextBoard = getBoardAfterRemovingPermanent(board, card.id);
    const killedDandans = countDandansLosingSupport(board, nextBoard);
    const attackingKills = board.filter(permanent => (
      permanent.name === DANDAN_NAME &&
      permanent.attacking &&
      isDandanSupported(permanent, board) &&
      !isDandanSupportedOnBoard(permanent, nextBoard)
    )).length;
    const blueLoss = Math.max(0, getBlueSourcesInPlay(board) - getBlueSourcesInPlay(nextBoard));
    let score = killedDandans * 11 + attackingKills * 4 + blueLoss * 2.5;
    if (card.name === DANDAN_NAME && isDandanSupported(card, board)) score += card.attacking ? 12 : 9;
    if (card.name === DANDAN_NAME && (card.owner || opponent) === actor) score += 10;
    if (card.controlledByAuraId && (card.owner || opponent) === actor) score += 5;
    if (card.isLand) score += getLandType(card) === 'Island' ? 1.5 : 0.5;
    return { target: card, score };
  });

  return candidates.filter(candidate => candidate.score > 0).sort((left, right) => right.score - left.score);
};
const pickBounceTarget = (state, actor) => getBounceTargetCandidates(state, actor)[0] || null;

const getControlMagicTargetCandidates = (state, actor) => {
  const opponent = getOpponent(actor);
  const targets = state[opponent].board.filter(card => card.name === DANDAN_NAME && isDandanSupported(card, state[opponent].board) && boardHasLandType(state[actor].board, getDandanLandType(card)));
  return targets.map(target => ({
    target,
    score: 13 + (target.attacking ? 2 : 0) + (state[actor].life <= 8 ? 1.5 : 0)
  })).sort((left, right) => right.score - left.score);
};
const pickControlMagicTarget = (state, actor) => getControlMagicTargetCandidates(state, actor)[0] || null;

const getUnsubstantiateCreatureCandidates = (state, actor) => {
  const opponent = getOpponent(actor);
  const opposingCreatures = state[opponent].board
    .filter(isCreatureCard)
    .map(card => ({
      target: card,
      score: (card.attacking ? 15 : 9)
        + (isDandanSupported(card, state[opponent].board) ? 4 : 0)
        + ((card.owner || opponent) === actor ? 10 : 0)
        + (card.controlledByAuraId && (card.owner || opponent) === actor ? 5 : 0)
    }));
  const endangeredFriendlyCreatures = state[actor].board
    .filter(isCreatureCard)
    .map(card => {
      let score = 0;
      if (!isDandanSupported(card, state[actor].board)) score += 10;
      if (card.controlledByAuraId) score += 10;
      return { target: card, score };
    });

  return [...opposingCreatures, ...endangeredFriendlyCreatures]
    .filter(candidate => candidate.score > 0)
    .sort((left, right) => right.score - left.score);
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
      action: { type: 'CAST_SPELL', player: actor, cardId: spell.id, target: target.target, landTypeChoice: target.landTypeChoice }
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
    return [{ type: 'SUBMIT_PENDING_ACTION', guess: getAiPredictGuess(state, actor) }];
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

const chooseHeuristicAiAction = (
  state,
  actor,
  difficulty = 'medium',
  policy = getLivePolicyWeights(difficulty),
  decisionOptions = { skipSurvivalCheck: false }
) => {
  const opponent = getOpponent(actor);
  const canCast = (card) => Boolean(card) && isCastable(card, state, actor);
  const interactionPenalty = difficulty === 'hard'
    && getAccessiblePlayableCardPressure(state, actor, opponent, ['Memory Lapse', 'Unsubstantiate']) > getAccessiblePlayableCardPressure(state, actor, actor, ['Memory Lapse', 'Unsubstantiate'])
      ? 3.2
      : 0;

  if (state.turn !== actor && state.stack.length === 0 && (state.phase === 'main2' || state.phase === 'cleanup')) {
    const endStepInstants = state[actor].hand.filter(card => canCast(card) && card.isInstant && AI_VALUE_INSTANTS.has(card.name));
    if (endStepInstants.length > 0 && !shouldMakeMistake(0.04, policy)) {
      const spell = [...endStepInstants].sort((left, right) => getSpellContextScore(state, actor, right, policy, difficulty) - getSpellContextScore(state, actor, left, policy, difficulty))[0];
      return { type: 'CAST_SPELL', player: actor, cardId: spell.id };
    }
  }

  if (state.stack.length > 0) {
    const topSpell = state.stack[state.stack.length - 1];
    const targetableSpell = isSpellStackEntry(topSpell) ? topSpell : getTopSpellOnStack(state.stack);
    if (topSpell.controller === opponent) {
      const stackThreatScore = getStackThreatScore(state, actor, topSpell, policy, difficulty);
      if (spellWouldSelfDestruct(state, topSpell)) {
        return { type: 'PASS_PRIORITY', player: actor };
      }

      const lapse = state[actor].hand.find(c => c.name === 'Memory Lapse');
      const lapseValue = stackThreatScore + (state.turn === opponent ? 2.5 : 0);
      const shouldMemoryLapse =
        canCast(lapse) &&
        targetableSpell &&
        (
          targetableSpell.card.name === DANDAN_NAME ||
          targetableSpell.card.name === 'Control Magic' ||
          targetableSpell.card.name === 'Capture of Jingzhou' ||
          targetableSpell.card.name === "Day's Undoing" ||
          state.turn === opponent ||
          lapseValue >= 4
        );

      if (shouldMemoryLapse) {
        if (policy.counterBias < 0.45 || shouldMakeMistake(0.04, policy)) {
          return { type: 'PASS_PRIORITY', player: actor };
        }
        return { type: 'CAST_SPELL', player: actor, cardId: lapse.id, target: targetableSpell };
      }

      const unsub = state[actor].hand.find(c => c.name === 'Unsubstantiate');
      const shouldUnsub =
        canCast(unsub) &&
        targetableSpell &&
        (
          targetableSpell.card.name === DANDAN_NAME ||
          targetableSpell.card.name === 'Control Magic' ||
          targetableSpell.card.name === 'Capture of Jingzhou' ||
          targetableSpell.card.name === "Day's Undoing" ||
          stackThreatScore >= 7
        );

      if (shouldUnsub) {
        if (policy.counterBias < 0.5 || shouldMakeMistake(0.08, policy)) {
          return { type: 'PASS_PRIORITY', player: actor };
        }
        return { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: targetableSpell };
      }

      const rescueTarget = getReactiveRescueCreatureCandidates(state, actor, topSpell, policy)[0];
      if (rescueTarget && canCast(unsub) && !shouldMakeMistake(0.06, policy)) {
        return { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: rescueTarget.target };
      }

      const rescueMetamorphose = state[actor].hand.find(c => c.name === 'Metamorphose');
      if (rescueTarget && canCast(rescueMetamorphose) && !shouldMakeMistake(0.08, policy)) {
        return { type: 'CAST_SPELL', player: actor, cardId: rescueMetamorphose.id, target: rescueTarget.target };
      }
    }

    const stackRaceOption = getStackCardRaceOptions(state, actor, policy, difficulty)[0];
    if (stackRaceOption && stackRaceOption.score >= 11 && !shouldMakeMistake(0.05, policy)) {
      return stackRaceOption.action;
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
    if (!decisionOptions.skipSurvivalCheck) {
      const survivalAction = chooseImmediateSurvivalAction(state, actor, difficulty, policy);
      if (survivalAction) return survivalAction;
    }

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
        action: { type: 'CAST_SPELL', player: actor, cardId: spell.id, target: target.target, landTypeChoice: target.landTypeChoice }
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

    const castableSpells = state[actor].hand.filter(c => (
      !c.isLand &&
      ![DANDAN_NAME, 'Memory Lapse', 'Unsubstantiate', 'Magical Hack', 'Crystal Spray', 'Control Magic', 'Metamorphose'].includes(c.name) &&
      isCastable(c, state, actor) &&
      (
        !shouldHoldValueInstant(state, actor, c) ||
        getSpellContextScore(state, actor, c, policy, difficulty) >= 10
      )
    ));
    if (castableSpells.length > 0) {
      const rankedSpells = [...castableSpells].sort((a, b) => getSpellContextScore(state, actor, b, policy, difficulty) - getSpellContextScore(state, actor, a, policy, difficulty));
      const bestSpell = rankedSpells[0];
      const bestSpellScore = bestSpell ? getSpellContextScore(state, actor, bestSpell, policy, difficulty) : Number.NEGATIVE_INFINITY;
      const spell = difficulty === 'easy'
        ? (bestSpellScore >= 10 ? bestSpell : randomChoice(castableSpells))
        : bestSpell;
      const spellScore = getSpellContextScore(state, actor, spell, policy, difficulty);
      const shouldHoldInteraction =
        difficulty === 'hard' &&
        hasLiveInteraction(state, actor, ['Memory Lapse', 'Unsubstantiate']) &&
        getAccessiblePlayableCardPressure(state, actor, opponent, [...HIGH_IMPACT_SPELLS]) > 0.35 &&
        spellScore < getInteractionHoldThreshold(state, actor);
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
const getActionTargetId = (action) => action?.target?.card?.id || action?.target?.id || null;
const getActionKey = (action) => [
  action?.type || 'UNKNOWN',
  action?.player || 'none',
  action?.cardId || 'none',
  action?.cardName || 'none',
  getActionTargetId(action) || 'none',
  action?.guess || 'none'
].join(':');
const finalizeCandidateActions = (candidateMap, limit) => {
  const entries = [...candidateMap.values()].sort((left, right) => right.score - left.score);
  const chosen = [];
  const seen = new Set();

  entries.filter(entry => entry.force).forEach(entry => {
    const key = getActionKey(entry.action);
    if (seen.has(key)) return;
    chosen.push(entry);
    seen.add(key);
  });

  for (const entry of entries) {
    if (chosen.length >= limit) break;
    const key = getActionKey(entry.action);
    if (seen.has(key)) continue;
    chosen.push(entry);
    seen.add(key);
  }

  return chosen.map(entry => entry.action);
};
const shouldPreferMediumHeuristicAction = (tacticalAction, heuristicAction) => {
  if (!heuristicAction || heuristicAction.type === 'PASS_PRIORITY') return false;
  if (!tacticalAction || tacticalAction.type === 'PASS_PRIORITY') return true;

  if (heuristicAction.type === 'CAST_SPELL' && tacticalAction.type === 'CAST_SPELL' && heuristicAction.cardId === tacticalAction.cardId) {
    const heuristicTarget = heuristicAction.target?.card || heuristicAction.target;
    const tacticalTarget = tacticalAction.target?.card || tacticalAction.target;
    if (heuristicTarget?.name === DANDAN_NAME && tacticalTarget?.isLand) return true;
  }

  return false;
};
const TACTICAL_SEARCH = {
  medium: {
    playerGame: { tacticalDepth: 2, rolloutDecisions: 5, rootBreadth: 5, replyBreadth: 3, autoSteps: 26 },
    mirrorGame: { tacticalDepth: 2, rolloutDecisions: 4, rootBreadth: 4, replyBreadth: 3, autoSteps: 22 }
  },
  hard: {
    playerGame: { tacticalDepth: 4, rolloutDecisions: 9, rootBreadth: 8, replyBreadth: 5, autoSteps: 48 },
    mirrorGame: { tacticalDepth: 3, rolloutDecisions: 6, rootBreadth: 6, replyBreadth: 4, autoSteps: 34 }
  }
};
const getTacticalSearchConfig = (state, policy = null, difficulty = 'hard') => {
  const searchTier = TACTICAL_SEARCH[difficulty] || TACTICAL_SEARCH.hard;
  const baseConfig = state.gameMode === 'ai_vs_ai'
    ? searchTier.mirrorGame
    : searchTier.playerGame;
  if (!policy) return baseConfig;
  return {
    tacticalDepth: Math.max(1, baseConfig.tacticalDepth + (policy.searchDepthBonus || 0)),
    rolloutDecisions: Math.max(1, baseConfig.rolloutDecisions + (policy.rolloutDecisionBonus || 0)),
    rootBreadth: Math.max(2, baseConfig.rootBreadth + (policy.rootBreadthBonus || 0)),
    replyBreadth: Math.max(2, baseConfig.replyBreadth + (policy.replyBreadthBonus || 0)),
    autoSteps: Math.max(10, baseConfig.autoSteps + (policy.autoStepBonus || 0))
  };
};
let cachedSearchReducer = null;
const getSearchReducer = () => {
  if (!cachedSearchReducer) cachedSearchReducer = createGameReducer(defaultEffects);
  return cachedSearchReducer;
};
const cloneGameState = (state) => structuredClone(state);
const reduceSearchState = (state, action) => getSearchReducer()(state, action);
const applySearchAction = (state, action) => reduceSearchState(cloneGameState(state), action);
const getPendingActionActor = (state) => state.pendingAction?.player || 'player';
const settleSearchState = (state, policies, config) => {
  let current = state;
  for (let step = 0; step < config.autoSteps; step++) {
    if (!current || current.winner) return current;
    if (current.pendingTargetSelection) return current;

    if (current.stackResolving && !current.pendingAction) {
      current = reduceSearchState(current, { type: 'RESOLVE_TOP_STACK' });
      continue;
    }

    if (current.pendingAction) {
      const pendingActor = getPendingActionActor(current);
      const actions = getAiPendingActions(current, policies[pendingActor], pendingActor);
      if (actions.length === 0) return current;
      actions.forEach(action => {
        current = reduceSearchState(current, action);
      });
      continue;
    }

    if (!current.priority) return current;
    return current;
  }

  return current;
};
const getSupportedDandans = (state, actor, predicate = (_card) => true) => state[actor].board
  .filter(card => card.name === DANDAN_NAME && isDandanSupported(card, state[actor].board) && predicate(card));
const estimateCombatDamage = (state, attacker) => {
  const defender = attacker === 'player' ? 'ai' : 'player';
  const attackingNow = state.turn === attacker && ['declare_attackers', 'declare_blockers'].includes(state.phase);
  const attackCount = attackingNow
    ? countDandans(state[attacker].board, card => card.attacking)
    : getMandatoryDandanAttackers(state, attacker).length;
  const blockCount = state[defender].board.filter(card => card.name === DANDAN_NAME && !card.tapped).length;
  return Math.max(0, attackCount - blockCount) * 4;
};
const getLibraryLeverageScore = (state, actor) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  if (state.deck.length === 0) return 0;
  const topCardEstimate = getAccessibleTopCardValue(state, actor);
  const topValue = topCardEstimate.value * (topCardEstimate.known ? 1 : 0.65);

  let score = 0;
  if (state[actor].hand.some(card => card.name === 'Predict')) score += topValue >= 6 ? 4.5 : 2.5;
  if (getAccessibleHandCardPressure(state, actor, opponent, ['Predict']) > 0.35) score -= topValue >= 6 ? 4.5 : 2.5;
  if (state[actor].hand.some(card => card.name === 'Brainstorm')) score += state.deck.length >= 2 ? 1.5 : 0;
  if (state[actor].hand.some(card => card.name === 'Telling Time')) score += state.deck.length >= 3 ? 1.8 : 0;
  return score;
};
const evaluateStateForActor = (state, actor, policy) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  if (state.winner) return state.winner === actor ? 100000 : -100000;

  const actorLife = state[actor].life;
  const opponentLife = state[opponent].life;
  const actorSupported = getSupportedDandans(state, actor);
  const opponentSupported = getSupportedDandans(state, opponent);
  const actorReady = actorSupported.filter(card => !card.tapped && !card.summoningSickness).length;
  const opponentReady = opponentSupported.filter(card => !card.tapped && !card.summoningSickness).length;
  const actorMana = getManaStats(state[actor].board, getManaPool(state, actor));
  const opponentMana = getManaStats(state[opponent].board, getManaPool(state, opponent));
  const actorPressure = estimateCombatDamage(state, actor);
  const opponentPressure = estimateCombatDamage(state, opponent);
  const actorCounters = getAccessiblePlayableCardPressure(state, actor, actor, ['Memory Lapse', 'Unsubstantiate']);
  const opponentCounters = getAccessiblePlayableCardPressure(state, actor, opponent, ['Memory Lapse', 'Unsubstantiate']);
  const stackScore = state.stack.reduce((sum, entry, index) => {
    const weight = index === state.stack.length - 1 ? 1.8 : 1.15;
    const signedScore = isAbilityStackEntry(entry)
      ? (
        entry.activation?.effect === 'draw'
          ? 5 + getImmediateTopCardSwing(state, entry.controller)
          : entry.activation?.effect === 'fengraf'
            ? 6 + (state.graveyard.filter(isCreatureCard).length > 0 ? 3 : 0)
            : 0
      )
      : getSpellContextScore(state, entry.controller, entry.card, policy, 'hard', actor);
    return sum + weight * (entry.controller === actor ? signedScore : -signedScore);
  }, 0);
  const actorCrackbackLethal = actorPressure >= opponentLife ? 160 : 0;
  const opponentCrackbackLethal = opponentPressure >= actorLife ? 190 : 0;

  return (actorLife - opponentLife) * 14
    + (actorSupported.length - opponentSupported.length) * 22
    + (actorReady - opponentReady) * 7
    + (getAccessibleHandQuality(state, actor, actor) - getAccessibleHandQuality(state, actor, opponent)) * 1.7
    + (state[actor].hand.length - state[opponent].hand.length) * 3
    + (state[actor].board.filter(card => card.isLand).length - state[opponent].board.filter(card => card.isLand).length) * 2.2
    + (actorMana.blue - opponentMana.blue) * 1.6
    + (actorMana.total - opponentMana.total) * 1.1
    + (actorCounters - opponentCounters) * 8
    + (state.extraTurns[actor] - state.extraTurns[opponent]) * 24
    + (actorPressure - opponentPressure * 1.15) * 12
    + getLibraryLeverageScore(state, actor)
    + stackScore
    + actorCrackbackLethal
    - opponentCrackbackLethal;
};
const getRolloutPolicies = (rootPolicy) => ({
  player: getHardModePolicy(trainedPolicy.weights),
  ai: getHardModePolicy(trainedPolicy.weights),
  root: getHardModePolicy(rootPolicy)
});
const runHeuristicRollout = (state, rootActor, policies, config) => {
  let current = settleSearchState(cloneGameState(state), policies, config);

  for (let decision = 0; decision < config.rolloutDecisions; decision++) {
    if (!current || current.winner || !current.priority) break;
    const actingPlayer = current.priority;
    const action = chooseHeuristicAiAction(current, actingPlayer, 'hard', policies[actingPlayer], { skipSurvivalCheck: true });
    current = settleSearchState(applySearchAction(current, action), policies, config);
  }

  return evaluateStateForActor(current, rootActor, policies[rootActor]);
};
const getTacticalActionCandidates = (
  state,
  actor,
  difficulty,
  policy,
  breadth,
  options = { includeHeuristicSeed: true }
) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const candidateMap = new Map();
  const addCandidate = (action, score = 0, force = false) => {
    if (!action) return;
    const key = getActionKey(action);
    const previous = candidateMap.get(key);
    if (!previous || score > previous.score || (force && !previous.force)) {
      candidateMap.set(key, {
        action,
        score: previous ? Math.max(previous.score, score) : score,
        force: force || previous?.force || false
      });
    }
  };
  const canCast = (card) => Boolean(card) && isCastable(card, state, actor);
  if (options.includeHeuristicSeed !== false) {
    const heuristicAction = chooseHeuristicAiAction(state, actor, difficulty, policy, { skipSurvivalCheck: true });
    addCandidate(heuristicAction, 1000, true);
  }
  addCandidate({ type: 'PASS_PRIORITY', player: actor }, state.stack.length > 0 ? 1 : -1, true);

  if (state.stack.length > 0) {
    const enemyStack = state.stack.filter(entry => entry.controller !== actor);
    const lapse = state[actor].hand.find(card => card.name === 'Memory Lapse' && canCast(card));
    if (lapse) {
      enemyStack.forEach((entry, index) => {
        if (!isSpellStackEntry(entry)) return;
        const threatScore = getStackThreatScore(state, actor, entry, policy, difficulty);
        addCandidate(
          { type: 'CAST_SPELL', player: actor, cardId: lapse.id, target: entry },
          28 - index + threatScore
        );
      });
    }

    const unsub = state[actor].hand.find(card => card.name === 'Unsubstantiate' && canCast(card));
    if (unsub) {
      enemyStack.forEach((entry, index) => {
        if (isSpellStackEntry(entry)) {
          const threatScore = getStackThreatScore(state, actor, entry, policy, difficulty);
          addCandidate(
            { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: entry },
            24 - index + threatScore
          );
        }
        getReactiveRescueCreatureCandidates(state, actor, entry, policy).slice(0, 2).forEach(candidate => {
          addCandidate(
            { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: candidate.target },
            14 + candidate.score
          );
        });
      });
      getUnsubstantiateCreatureCandidates(state, actor).slice(0, 2).forEach(candidate => {
        addCandidate(
          { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: candidate.target },
          13 + candidate.score
        );
      });
    }

    const rescueMetamorphose = state[actor].hand.find(card => card.name === 'Metamorphose' && canCast(card));
    if (rescueMetamorphose) {
      enemyStack.forEach((entry) => {
        getReactiveRescueCreatureCandidates(state, actor, entry, policy).slice(0, 2).forEach(candidate => {
          addCandidate(
            { type: 'CAST_SPELL', player: actor, cardId: rescueMetamorphose.id, target: candidate.target },
            12 + candidate.score
          );
        });
      });
    }

    getStackCardRaceOptions(state, actor, policy, difficulty).slice(0, 3).forEach(option => {
      addCandidate(option.action, 10 + option.score);
    });

    return finalizeCandidateActions(candidateMap, breadth);
  }

  if (state.turn === actor && state.phase === 'declare_attackers') {
    getMandatoryDandanAttackers(state, actor)
      .filter(card => !card.attacking)
      .forEach((card, index) => addCandidate({ type: 'TOGGLE_ATTACK', player: actor, cardId: card.id }, 35 - index));
    return finalizeCandidateActions(candidateMap, breadth);
  }

  if (state.turn !== actor && state.phase === 'declare_blockers') {
    const emergencySpell = chooseEmergencyDefenseSpell(state, actor, policy);
    if (emergencySpell) addCandidate(emergencySpell, 40);
    state[actor].board
      .filter(card => card.name === DANDAN_NAME && !card.tapped && !card.blocking)
      .forEach((card, index) => addCandidate({ type: 'TOGGLE_BLOCK', player: actor, cardId: card.id }, 28 - index));
    return finalizeCandidateActions(candidateMap, breadth);
  }

  if (state.turn === actor && ['main1', 'main2'].includes(state.phase) && state[actor].landsPlayed === 0) {
    const lands = [...state[actor].hand.filter(card => card.isLand && (!isTortoise(state, actor) || !isIslandLandCard(card)))]
      .sort((left, right) => getLandPlayScore(state, actor, right) - getLandPlayScore(state, actor, left))
      .slice(0, 2);
    lands.forEach(land => addCandidate(
      { type: 'PLAY_LAND', player: actor, cardId: land.id },
      10 + getLandPlayScore(state, actor, land)
    ));
  }

  const activationAction = getAiLandActivationAction(state, actor, policy, difficulty);
  if (activationAction) addCandidate(activationAction, 15);

  state[actor].hand.filter(card => !card.isLand && canCast(card)).forEach(card => {
    if (card.name === 'Memory Lapse') return;

    if (card.name === 'Unsubstantiate') {
      getUnsubstantiateCreatureCandidates(state, actor).slice(0, 2).forEach(candidate => {
        addCandidate(
          { type: 'CAST_SPELL', player: actor, cardId: card.id, target: candidate.target },
          11 + candidate.score
        );
      });
      return;
    }

    if (card.name === 'Control Magic') {
      getControlMagicTargetCandidates(state, actor).slice(0, 2).forEach(candidate => {
        addCandidate(
          { type: 'CAST_SPELL', player: actor, cardId: card.id, target: candidate.target },
          candidate.score + getSpellContextScore(state, actor, card, policy, difficulty)
        );
      });
      return;
    }

    if (card.name === 'Metamorphose') {
      getBounceTargetCandidates(state, actor).slice(0, 2).forEach(candidate => {
        addCandidate(
          { type: 'CAST_SPELL', player: actor, cardId: card.id, target: candidate.target },
          candidate.score + 1.5 + getSpellContextScore(state, actor, card, policy, difficulty)
        );
      });
      return;
    }

    if (card.name === 'Magical Hack' || card.name === 'Crystal Spray') {
      getTransformTargetCandidates(state, actor).slice(0, 2).forEach(candidate => {
        addCandidate(
          { type: 'CAST_SPELL', player: actor, cardId: card.id, target: candidate.target, landTypeChoice: candidate.landTypeChoice },
          candidate.score + (card.name === 'Crystal Spray' ? 1.5 : 0) + getSpellContextScore(state, actor, card, policy, difficulty)
        );
      });
      return;
    }

    addCandidate(
      { type: 'CAST_SPELL', player: actor, cardId: card.id },
      getSpellContextScore(state, actor, card, policy, difficulty)
    );
  });

  const landsInPlay = state[actor].board.filter(card => card.isLand).length;
  const spareLandsInHand = state[actor].hand.filter(card => card.isLand).length;
  state[actor].hand
    .filter(card => isCyclable(card, state, actor))
    .forEach(card => addCandidate(
      { type: 'CYCLE_CARD', player: actor, cardId: card.id },
      4 + (landsInPlay >= policy.landLimit || spareLandsInHand > 2 ? 6 : 0)
    ));

  return finalizeCandidateActions(candidateMap, breadth);
};
const IMMEDIATE_SURVIVAL_CONFIG = {
  autoSteps: 60,
  maxDecisions: 24,
  rootBreadth: 5,
  replyBreadth: 4
};
const getImmediateSurvivalPolicies = (actor, policy) => {
  const hardBaseline = getHardModePolicy(trainedPolicy.weights);
  return {
    player: hardBaseline,
    ai: hardBaseline,
    [actor]: getHardModePolicy(policy)
  };
};
const getRoughNextTurnLethalThreat = (state, actor) => {
  const opponent = getOpponent(actor);
  let threat = estimateCombatDamage(state, opponent);

  if (getAccessiblePlayableCardPressure(state, actor, opponent, [DANDAN_NAME]) > 0.35) {
    threat += 4;
  }

  if (
    getAccessiblePlayableCardPressure(state, actor, opponent, ['Control Magic']) > 0.35 &&
    getSupportedDandans(state, actor, card => !card.tapped).length > 0
  ) {
    threat += 4;
  }

  if (getAccessiblePlayableCardPressure(state, actor, opponent, ['Capture of Jingzhou']) > 0.35) {
    threat += 3;
  }

  threat += state.stack.reduce((sum, entry) => {
    if (entry.controller !== opponent || !isSpellStackEntry(entry)) return sum;
    if (entry.card.name === DANDAN_NAME || entry.card.name === 'Control Magic') return sum + 4;
    if (entry.card.name === 'Capture of Jingzhou') return sum + 3;
    return sum;
  }, 0);

  return threat;
};
const shouldCheckImmediateSurvival = (state, actor) => {
  const roughThreat = getRoughNextTurnLethalThreat(state, actor);
  return state[actor].life <= 8 || roughThreat >= state[actor].life - 1;
};
const PHASE_PROGRESS_ORDER = ['upkeep', 'main1', 'declare_attackers', 'declare_blockers', 'main2', 'cleanup'];
const getPhaseProgressIndex = (phase) => {
  const index = PHASE_PROGRESS_ORDER.indexOf(phase);
  return index === -1 ? PHASE_PROGRESS_ORDER.length : index;
};
const crossedOpponentTurnBoundary = (previous, next, actor) => {
  if (!previous || !next) return false;
  if (previous.turn !== actor) return true;
  if (next.turn !== actor) return true;
  return getPhaseProgressIndex(next.phase) < getPhaseProgressIndex(previous.phase);
};
const isImmediateSurvivalBoundary = (state, actor, sawOpponentTurn) => (
  sawOpponentTurn &&
  state.turn === actor &&
  state.priority === actor &&
  !state.pendingAction &&
  !state.pendingTargetSelection &&
  !state.stackResolving &&
  (state.phase === 'upkeep' || state.phase === 'main1')
);
const chooseProjectedSurvivalAction = (state, actor, policies, config) => {
  const heuristicAction = chooseHeuristicAiAction(state, actor, 'hard', policies[actor], { skipSurvivalCheck: true });
  if (heuristicAction && heuristicAction.type !== 'PASS_PRIORITY') return heuristicAction;

  const candidateActions = getTacticalActionCandidates(
    state,
    actor,
    'hard',
    policies[actor],
    actor === state.turn ? config.rootBreadth : config.replyBreadth,
    { includeHeuristicSeed: false }
  );
  return candidateActions.find(action => action.type !== 'PASS_PRIORITY')
    || heuristicAction
    || { type: 'PASS_PRIORITY', player: actor };
};
const projectImmediateSurvivalLine = (state, actor, rootAction, policy) => {
  const opponent = getOpponent(actor);
  const policies = getImmediateSurvivalPolicies(actor, policy);
  let current = settleSearchState(cloneGameState(state), policies, IMMEDIATE_SURVIVAL_CONFIG);

  if (!current) {
    return {
      survives: true,
      sawOpponentTurn: false,
      score: 0,
      state
    };
  }

  const openingAction = rootAction || { type: 'PASS_PRIORITY', player: actor };
  let previous = current;
  current = settleSearchState(applySearchAction(current, openingAction), policies, IMMEDIATE_SURVIVAL_CONFIG);
  let sawOpponentTurn = current?.turn === opponent || crossedOpponentTurnBoundary(previous, current, actor);

  for (let decision = 0; decision < IMMEDIATE_SURVIVAL_CONFIG.maxDecisions; decision++) {
    previous = current;
    current = settleSearchState(current, policies, IMMEDIATE_SURVIVAL_CONFIG);
    sawOpponentTurn = sawOpponentTurn || current?.turn === opponent || crossedOpponentTurnBoundary(previous, current, actor);
    if (!current || current.winner) break;
    if (isImmediateSurvivalBoundary(current, actor, sawOpponentTurn)) break;
    if (!current.priority) break;

    const actingPlayer = current.priority;
    const action = chooseProjectedSurvivalAction(current, actingPlayer, policies, IMMEDIATE_SURVIVAL_CONFIG);
    previous = current;
    current = applySearchAction(current, action);
    sawOpponentTurn = sawOpponentTurn || current?.turn === opponent || crossedOpponentTurnBoundary(previous, current, actor);
  }

  current = settleSearchState(current, policies, IMMEDIATE_SURVIVAL_CONFIG);
  return {
    survives: Boolean(current) && current.winner !== opponent,
    sawOpponentTurn,
    score: current ? evaluateStateForActor(current, actor, policies[actor]) : -100000,
    state: current || state
  };
};
const chooseImmediateSurvivalAction = (state, actor, difficulty, policy) => {
  if (
    state.turn !== actor ||
    !state.priority ||
    state.priority !== actor ||
    state.pendingAction ||
    state.pendingTargetSelection ||
    state.stack.length > 0
  ) {
    return null;
  }

  if (!shouldCheckImmediateSurvival(state, actor)) return null;

  const heuristicAction = chooseHeuristicAiAction(state, actor, difficulty, policy, { skipSurvivalCheck: true });
  const heuristicProjection = projectImmediateSurvivalLine(state, actor, heuristicAction, policy);
  if (heuristicProjection.survives || !heuristicProjection.sawOpponentTurn) return null;

  const breadth = (difficulty === 'hard' ? 7 : difficulty === 'medium' ? 6 : 5) + (policy.survivalBreadthBonus || 0);
  const candidateActions = getTacticalActionCandidates(
    state,
    actor,
    difficulty,
    policy,
    breadth,
    { includeHeuristicSeed: false }
  );

  let bestSavingAction = null;
  let bestSavingScore = Number.NEGATIVE_INFINITY;
  let bestFallbackAction = null;
  let bestFallbackScore = heuristicProjection.score;

  candidateActions.forEach(action => {
    const projection = projectImmediateSurvivalLine(state, actor, action, policy);
    if (projection.survives) {
      if (projection.score > bestSavingScore) {
        bestSavingScore = projection.score;
        bestSavingAction = action;
      }
      return;
    }

    if (projection.score > bestFallbackScore) {
      bestFallbackScore = projection.score;
      bestFallbackAction = action;
    }
  });

  return bestSavingAction || bestFallbackAction;
};
const evaluateTacticalPosition = (state, rootActor, policies, config, depth, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) => {
  const settled = settleSearchState(cloneGameState(state), policies, config);
  if (!settled || settled.winner || depth <= 0 || !settled.priority) {
    return runHeuristicRollout(settled, rootActor, policies, config);
  }

  const actingPlayer = settled.priority;
  const candidateActions = getTacticalActionCandidates(
    settled,
    actingPlayer,
    'hard',
    policies[actingPlayer],
    actingPlayer === rootActor ? config.rootBreadth : config.replyBreadth
  );
  if (candidateActions.length === 0) return runHeuristicRollout(settled, rootActor, policies, config);

  if (actingPlayer === rootActor) {
    let best = Number.NEGATIVE_INFINITY;
    for (const action of candidateActions) {
      const next = settleSearchState(applySearchAction(settled, action), policies, config);
      best = Math.max(best, evaluateTacticalPosition(next, rootActor, policies, config, depth - 1, alpha, beta));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Number.POSITIVE_INFINITY;
  for (const action of candidateActions) {
    const next = settleSearchState(applySearchAction(settled, action), policies, config);
    best = Math.min(best, evaluateTacticalPosition(next, rootActor, policies, config, depth - 1, alpha, beta));
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
};
const chooseTacticalAiAction = (state, actor, policy, difficulty = 'hard') => {
  if (!state.priority || state.priority !== actor || state.pendingAction || state.pendingTargetSelection) return null;

  const config = getTacticalSearchConfig(state, policy, difficulty);
  const policies = {
    player: getHardModePolicy(trainedPolicy.weights),
    ai: getHardModePolicy(trainedPolicy.weights)
  };
  policies[actor] = getHardModePolicy(policy);

  const settled = settleSearchState(cloneGameState(state), policies, config);
  if (!settled || settled.priority !== actor || settled.winner) return null;

  const candidateActions = getTacticalActionCandidates(settled, actor, 'hard', policies[actor], config.rootBreadth);
  if (candidateActions.length === 0) return null;
  if (candidateActions.length === 1) return candidateActions[0];

  let bestAction = candidateActions[0];
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const action of candidateActions) {
    const next = settleSearchState(applySearchAction(settled, action), policies, config);
    const score = evaluateTacticalPosition(next, actor, policies, config, config.tacticalDepth - 1);
    if (score > bestScore) {
      bestScore = score;
      bestAction = action;
    }
  }

  return bestAction;
};
export const chooseAiAction = (state, actor, difficulty = 'medium', policy = getLivePolicyWeights(difficulty)) => {
  const normalizedPolicy = difficulty === 'hard' ? getHardModePolicy(policy) : normalizePolicy(policy);
  if (difficulty !== 'easy' && state.turn === actor && ['main1', 'main2', 'upkeep'].includes(state.phase)) {
    const survivalAction = chooseImmediateSurvivalAction(state, actor, difficulty, normalizedPolicy);
    if (survivalAction) return survivalAction;
  }
  if (difficulty === 'medium' || difficulty === 'hard') {
    const tacticalAction = chooseTacticalAiAction(state, actor, normalizedPolicy, difficulty);
    if (tacticalAction) {
      if (difficulty === 'medium') {
        const heuristicAction = chooseHeuristicAiAction(state, actor, difficulty, normalizedPolicy);
        if (shouldPreferMediumHeuristicAction(tacticalAction, heuristicAction)) return heuristicAction;
      }
      return tacticalAction;
    }
  }
  return chooseHeuristicAiAction(state, actor, difficulty, normalizedPolicy);
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

  if (!activation.usesStack) {
    addFloatingMana(nextState, player, 2, 2);
    nextState = checkStateBasedActions(nextState);
    nextState.stackResolving = false;
    nextState.priority = player;
    nextState.consecutivePasses = 0;
    return nextState;
  }

  nextState.stack.push({
    kind: 'ability',
    controller: player,
    card: sacrificedLand,
    activation
  });
  nextState = checkStateBasedActions(nextState);
  nextState.stackResolving = false;
  nextState.priority = getOpponent(player);
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

    case 'HYDRATE_PEER_STATE':
      return action.state ? structuredClone(action.state) : s;

    case 'LOAD_SAVED_GAME':
      return restoreSavedGameState(action.snapshot);

    case 'SURRENDER':
      return {
        ...s,
        winner: action.player === 'player' ? 'ai' : 'player',
        pendingAction: null,
        pendingTargetSelection: null,
        stackResolving: false,
        log: [`${action.player} surrendered.`, ...(s.log || [])].slice(0, 15)
      };

    case 'CLOCK_EXPIRE':
      return {
        ...s,
        winner: action.player === 'player' ? 'ai' : 'player',
        pendingAction: null,
        pendingTargetSelection: null,
        stackResolving: false,
        log: [`${getSeatLabel(action.player)} ran out of time.`, ...(s.log || [])].slice(0, 15)
      };

    case 'START_GAME':
      effects.initAudio();
      const gameMode = action.mode || 'player';
      const difficulty = action.difficulty || 'medium';
      const startingDeck = action.deck ? structuredClone(action.deck) : initializeDeck();
      const peerGame = gameMode === 'peer';
      s = { 
         ...initialState, 
         started: true, 
         gameMode,
         difficulty,
         playerAiCharacterId: action.playerAiCharacterId || null,
         aiCharacterId: action.aiCharacterId || null,
         deck: startingDeck,
         knowledge: createKnowledgeState(),
         graveyard: [], exile: [], stack: [], log: [], winner: null,
         phase: gameMode === 'ai_vs_ai' ? 'upkeep' : 'mulligan', turn: 'player', priority: 'player', mulliganCount: 0, peerMulligan: peerGame ? createPeerMulliganState() : null, isFirstTurn: true,
         player: { life: 20, hand: [], board: [], landsPlayed: 0 },
         ai: { life: 20, hand: [], board: [], landsPlayed: 0 },
         floatingMana: { player: { total: 0, blue: 0 }, ai: { total: 0, blue: 0 } },
         hasAttacked: { player: false, ai: false },
         hasBlocked: { player: false, ai: false },
         extraTurns: { player: 0, ai: 0 },
         pendingAction: null, pendingTargetSelection: null
      };
      drawAlternating(s, 'player', 7);
      const playerAiMulligans = gameMode === 'ai_vs_ai' ? runAiOpeningMulligans(s, 'player') : 0;
      const aiMulligans = peerGame ? 0 : runAiOpeningMulligans(s, 'ai');
      if (gameMode === 'ai_vs_ai' && playerAiMulligans > 0) logAction(`AI South mulliganed to ${7 - playerAiMulligans}.`);
      if (aiMulligans > 0) logAction(`${gameMode === 'ai_vs_ai' ? 'AI North' : 'Opponent'} mulliganed to ${7 - aiMulligans}.`);
      logAction(gameMode === 'ai_vs_ai' ? "AI mirror started." : peerGame ? "Friend match started. Both players choose to keep or mulligan." : "Game started. Mulligan phase.");
      return s;

    case 'MULLIGAN':
      {
        const mulliganPlayer = action.player || 'player';
        if (s.phase !== 'mulligan' || s.priority !== mulliganPlayer) return s;
        const mulliganCount = isPeerGame(s) ? getPeerMulliganCount(s, mulliganPlayer) : (s.mulliganCount || 0);
        if (mulliganCount >= 7) return s;
        s.deck = [...s.deck, ...s[mulliganPlayer].hand];
        s[mulliganPlayer].hand = [];
        resetHiddenKnowledge(s);
        for (let i = s.deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [s.deck[i], s.deck[j]] = [s.deck[j], s.deck[i]];
        }
        drawCards(s, mulliganPlayer, 7);
        if (isPeerGame(s)) {
          setPeerMulliganCount(s, mulliganPlayer, mulliganCount + 1);
          logAction(`${getSeatLabel(mulliganPlayer)} mulliganed to ${7 - getPeerMulliganCount(s, mulliganPlayer)}. Draw 7 and choose whether to keep.`);
        } else {
          s.mulliganCount = mulliganCount + 1;
          logAction(`You mulliganed to ${7 - s.mulliganCount}. Draw 7 and choose whether to keep.`);
        }
        s.pendingAction = null;
        return s;
      }

    case 'KEEP_HAND':
      {
        const keepPlayer = action.player || 'player';
        if (s.phase !== 'mulligan' || s.priority !== keepPlayer) return s;
        const mulliganCount = isPeerGame(s) ? getPeerMulliganCount(s, keepPlayer) : (s.mulliganCount || 0);
        if (mulliganCount > 0) {
           s.pendingAction = { type: 'MULLIGAN_BOTTOM', player: keepPlayer, count: mulliganCount, selected: [] };
           logAction(`${getSeatLabel(keepPlayer)} kept. Put ${mulliganCount} card(s) on the bottom.`);
           return s;
        }
        if (isPeerGame(s)) {
          markPeerSeatKept(s, keepPlayer);
          if (haveBothPeerSeatsKept(s)) {
            s.phase = 'upkeep';
            s.priority = 'player';
            logAction(`Both players kept. Beginning Turn 1 Upkeep.`);
          } else {
            s.priority = getOpponent(keepPlayer);
            logAction(`${getSeatLabel(keepPlayer)} kept. Waiting for the other player.`);
          }
          return s;
        }
        s.phase = 'upkeep';
        logAction(`You kept your hand. Beginning Turn 1 Upkeep.`);
        return s;
      }

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
        removeKnownHandCard(s, action.player, land.id);
        
        const entersTapped = ['Lonely Sandbar', 'Remote Isle', 'The Surgical Bay', 'Svyelunite Temple', 'Halimar Depths', 'Mystic Sanctuary'].includes(land.name);
        land.tapped = entersTapped;
        
        if (land.name === 'Halimar Depths') {
            const viewed = [];
            for (let i = 0; i < 3; i++) {
                if (s.deck.length) {
                  const seenCard = s.deck.pop();
                  consumeTopKnowledgeCard(s, seenCard);
                  viewed.push(seenCard);
                }
            }
            clearKnownTop(s, getOpponent(action.player));
            if (isHumanControlledSeat(s, action.player)) {
                setKnownTop(s, action.player, viewed);
                s.pendingAction = { type: 'HALIMAR_DEPTHS', player: action.player, cards: viewed };
            } else {
                const ordered = getAiLibraryOrder(s, action.player, viewed, getAiPolicyForActor(s, action.player));
                ordered.slice().reverse().forEach(card => s.deck.push(card));
                setKnownTop(s, action.player, ordered);
                logAction(`${action.player === 'player' ? 'Player' : 'AI'} reordered the top cards with Halimar Depths.`);
            }
        }
        if (land.name === 'Mystic Sanctuary') {
            const islands = s[action.player].board.filter(c => getLandType(c) === 'Island').length;
            if (islands >= 3) {
                land.tapped = false;
                const validSpells = s.graveyard.filter(c => INSTANT_OR_SORCERY_TYPES.some(type => c.type.includes(type)));
                if (validSpells.length > 0) {
                    if (isHumanControlledSeat(s, action.player)) {
                        s.pendingAction = { type: 'MYSTIC_SANCTUARY', player: action.player, validTargets: validSpells.map(c=>c.id) };
                    } else {
                        const spell = getAiSanctuaryTarget(s, action.player, validSpells, getAiPolicyForActor(s, action.player));
                        if (spell) {
                          s.graveyard = s.graveyard.filter(c => c.id !== spell.id);
                          s.deck.push(spell);
                          prependKnownTopCard(s, 'all', spell);
                          logAction(`${action.player === 'player' ? 'Player' : 'AI'} put ${spell.name} on top with Mystic Sanctuary.`);
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
      const promptPlayer = action.player || 'player';
      const handCard = s[promptPlayer].hand.find(c => c.id === action.cardId);
      if (!handCard || !handCard.isLand) return s;
      const cyclingCost = getCyclingCost(handCard.name);
      const canPlay = isCastable(handCard, s, promptPlayer);
      const canCycle = isCyclable(handCard, s, promptPlayer);
      if (!canPlay && !canCycle) return s;
      s.pendingAction = {
        type: 'HAND_LAND_ACTION',
        player: promptPlayer,
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
      removeKnownHandCard(s, p, cycledCard.id);
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
      const isHumanControlledPlayer = isHumanControlledSeat(s, p);
      const handIdx = s[p].hand.findIndex(c => c.id === action.cardId);
      if (handIdx === -1) return s;
      const card = s[p].hand[handIdx];
      
      const targetDependent = ['Memory Lapse', 'Unsubstantiate', 'Control Magic', 'Magical Hack', 'Crystal Spray', 'Metamorphose'];
      
      if (!action.target && isHumanControlledPlayer && targetDependent.includes(card.name)) {
         s.pendingTargetSelection = { cardId: action.cardId, spellName: card.name, player: p };
         return s;
      }
      
      let target = action.target || null;
      if (!target && card.name === 'Memory Lapse' && s.stack.length > 0) target = getTopSpellOnStack(s.stack); 
      else if (!target && card.name === 'Unsubstantiate') {
        if (s.stack.length > 0) target = getTopSpellOnStack(s.stack);
        else target = s[opp].board.find(c => c.name === 'DandÃ¢n') || s[p].board.find(c => c.name === 'DandÃ¢n');
      }
      else if (!target && card.name === 'Control Magic') {
        target = s[opp].board.find(isCreatureCard) || s[p].board.find(isCreatureCard); 
      }
      else if (!target && ['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(card.name)) {
        target = s[opp].board.find(c => c.name === 'DandÃ¢n') || s[opp].board.find(c => c.isLand) || s[p].board.find(c => c.isLand);
      }
      if (targetDependent.includes(card.name) && !target) return s;
      if (isHumanControlledPlayer && isLandTypeChoiceSpell(card.name) && !isLandTypeChoice(action.landTypeChoice)) {
        s.pendingAction = {
          type: 'LAND_TYPE_CHOICE',
          player: p,
          cardId: action.cardId,
          spellName: card.name,
          targetId: target.id,
          targetName: target.card ? target.card.name : target.name
        };
        return s;
      }

      if (!canPayCost(s[p].board, getManaPool(s, p), card.cost, card.blueRequirement || 0)) return s;
      const landTypeChoice = isLandTypeChoiceSpell(card.name)
        ? (isLandTypeChoice(action.landTypeChoice) ? action.landTypeChoice : chooseLandTypeForTransformTarget(s, p, target))
        : null;
      effects.playCast();
      const castPayment = spendMana(s[p].board, getManaPool(s, p), card.cost, card.blueRequirement || 0);
      s[p].board = castPayment.board;
      s.floatingMana[p] = castPayment.pool;
      s[p].hand.splice(handIdx, 1);
      removeKnownHandCard(s, p, card.id);
      s.stack.push({ card, controller: p, target, landTypeChoice });
      s.consecutivePasses = 0; s.priority = p === 'player' ? 'ai' : 'player'; 
      logAction(`${p} casts ${card.name}.`);
      return s;
    }

    case 'CAST_WITH_TARGET': {
      const p = s.pendingTargetSelection?.player || 'player';
      const cardId = s.pendingTargetSelection.cardId;
      const handIdx = s[p].hand.findIndex(c => c.id === cardId);
      if (handIdx === -1) return { ...s, pendingTargetSelection: null };
      
      const card = s[p].hand[handIdx];
      let targetObj = null;
      if (action.targetZone === 'stack') targetObj = s.stack.find(c => c.card.id === action.targetId);
      if (action.targetZone === 'board') targetObj = s.player.board.find(c => c.id === action.targetId) || s.ai.board.find(c => c.id === action.targetId);
      if (!targetObj) return { ...s, pendingTargetSelection: null };
      if (isLandTypeChoiceSpell(card.name)) {
        s.pendingTargetSelection = null;
        s.pendingAction = {
          type: 'LAND_TYPE_CHOICE',
          player: p,
          cardId,
          spellName: card.name,
          targetId: targetObj.id,
          targetName: targetObj.card ? targetObj.card.name : targetObj.name
        };
        return s;
      }

      if (!canPayCost(s[p].board, getManaPool(s, p), card.cost, card.blueRequirement || 0)) return { ...s, pendingTargetSelection: null };
      effects.playCast();
      const targetCastPayment = spendMana(s[p].board, getManaPool(s, p), card.cost, card.blueRequirement || 0);
      s[p].board = targetCastPayment.board;
      s.floatingMana[p] = targetCastPayment.pool;
      s[p].hand.splice(handIdx, 1);
      removeKnownHandCard(s, p, card.id);
      
      s.stack.push({ card, controller: p, target: targetObj, landTypeChoice: null });
      s.pendingTargetSelection = null;
      s.consecutivePasses = 0;
      s.priority = getOpponent(p);
      logAction(`${getSeatLabel(p)} cast ${card.name} targeting ${targetObj ? (targetObj.card ? targetObj.card.name : targetObj.name) : 'something'}.`);
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
      logAction(`Resolving ${getStackEntryName(spell)}...`);

      if (isAbilityStackEntry(spell)) {
        if (spell.activation?.effect === 'draw') {
          drawCards(s, spell.controller, 1);
        } else if (spell.activation?.effect === 'fengraf') {
          const creatures = s.graveyard.filter(isCreatureCard);
          if (creatures.length > 0) {
            const randIdx = Math.floor(Math.random() * creatures.length);
            const selectedCreature = creatures[randIdx];
            s.graveyard = s.graveyard.filter(card => card.id !== selectedCreature.id);
            selectedCreature.owner = spell.controller;
            s[spell.controller].hand.push(selectedCreature);
            KNOWLEDGE_PLAYERS.forEach(viewer => addKnownHandCard(s, viewer, spell.controller, selectedCreature));
          }
        }
      }

      else if (spell.card.name === 'DandÃ¢n') {
        spell.card.summoningSickness = true; 
        s[spell.controller].board.push(spell.card);
      } 
      else if (spell.card.name === 'Memory Lapse') {
        if (spell.target && isSpellStackEntry(spell.target) && s.stack.some(st => st.card.id === spell.target.card.id)) {
           const targetIdx = s.stack.findIndex(st => st.card.id === spell.target.card.id);
           if (targetIdx > -1) {
             const [countered] = s.stack.splice(targetIdx, 1);
             s.deck.push(countered.card);
             prependKnownTopCard(s, 'all', countered.card);
             logAction(`${countered.card.name} was Memory Lapsed to top of library!`);
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
                    prependKnownTopCard(s, 'all', bounced);
                    logAction(`Metamorphose put ${bounced.name} on top of the library!`);
                    found = true;
                }
            });
        }
        s.graveyard.push(spell.card);
      }
      else if (spell.card.name === 'Unsubstantiate') {
        if (spell.target) {
          const stackIdx = isSpellStackEntry(spell.target) ? s.stack.findIndex(st => st.card.id === spell.target.card?.id) : -1;
          if (stackIdx > -1) {
             const [bounced] = s.stack.splice(stackIdx, 1); 
             const owner = bounced.card.owner || bounced.controller;
             s[owner].hand.push(bounced.card);
             KNOWLEDGE_PLAYERS.forEach(viewer => addKnownHandCard(s, viewer, owner, bounced.card));
             logAction(`Unsubstantiate returned spell to owner's hand.`);
          } else {
            ['player', 'ai'].forEach(p2 => {
              const bIdx = s[p2].board.findIndex(c => c.id === spell.target.id);
              if (bIdx > -1) {
                const [bounced] = s[p2].board.splice(bIdx, 1);
                const owner = bounced.owner || p2;
                const returned = preparePermanentForZoneChange(bounced);
                s[owner].hand.push(returned);
                KNOWLEDGE_PLAYERS.forEach(viewer => addKnownHandCard(s, viewer, owner, returned));
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
                const landTypeChoice = isLandTypeChoice(spell.landTypeChoice)
                  ? spell.landTypeChoice
                  : chooseLandTypeForTransformTarget(s, spell.controller, targetObj);
                if (targetObj.name === DANDAN_NAME) {
                    logAction(`${spell.card.name} changes DandÃ¢n's land dependency to ${landTypeChoice}.`);
                    s[targetPlayer].board[targetIdx] = applyLandTypeChoiceToCard(
                      targetObj,
                      landTypeChoice,
                      spell.card.name === 'Crystal Spray' ? 'endOfTurn' : 'permanent'
                    );
                } else if (targetObj.isLand) {
                    logAction(`${spell.card.name} changes the land type to ${landTypeChoice}.`);
                    s[targetPlayer].board[targetIdx] = applyLandTypeChoiceToCard(
                      targetObj,
                      landTypeChoice,
                      spell.card.name === 'Crystal Spray' ? 'endOfTurn' : 'permanent'
                    );
                }
            }
        }
        if (spell.card.name === 'Crystal Spray') drawCards(s, spell.controller, 1);
        s.graveyard.push(spell.card);
      }
      else if (spell.card.name === 'Brainstorm') {
        s.graveyard.push(spell.card);
        drawCards(s, spell.controller, 3);
        clearKnownTop(s, getOpponent(spell.controller));
        forgetPrivateHandInfoFromOpponent(s, spell.controller);
        if (isHumanControlledSeat(s, spell.controller)) {
            clearKnownTop(s, spell.controller);
            s.pendingAction = { type: 'BRAINSTORM', player: spell.controller, count: 2, selected: [] };
            s.stackResolving = false;
            return s;
        } else {
            const putBackCards = getAiPutBackCards(s, spell.controller, 2, getAiPolicyForActor(s, spell.controller));
            putBackCards.forEach(card => {
              const idx = s[spell.controller].hand.findIndex(entry => entry.id === card.id);
              if (idx > -1) s.deck.push(s[spell.controller].hand.splice(idx, 1)[0]);
            });
            setKnownTop(s, spell.controller, [...putBackCards].reverse());
        }
      }
      else if (spell.card.name === 'Chart a Course') {
        s.graveyard.push(spell.card);
        drawCards(s, spell.controller, 2);
        if (!s.hasAttacked[spell.controller]) {
            if (isHumanControlledSeat(s, spell.controller)) {
                s.pendingAction = { type: 'DISCARD', player: spell.controller, count: 1, selected: [] };
                s.stackResolving = false;
                return s;
            } else {
                const discardId = pickAiPendingCards(s, spell.controller, 1, getAiPolicyForActor(s, spell.controller))[0];
                const discardIdx = s[spell.controller].hand.findIndex(card => card.id === discardId);
                if (discardIdx > -1) {
                  const [discarded] = s[spell.controller].hand.splice(discardIdx, 1);
                  removeKnownHandCard(s, spell.controller, discarded.id);
                  s.graveyard.push(discarded);
                }
            }
        }
      }
      else if (spell.card.name === 'Telling Time') {
        s.graveyard.push(spell.card);
        const viewed = [];
        for(let i=0; i<3; i++) {
          if (s.deck.length) {
            const viewedCard = s.deck.pop();
            consumeTopKnowledgeCard(s, viewedCard);
            viewed.push(viewedCard);
          }
        }
        clearKnownTop(s, getOpponent(spell.controller));
        if (isHumanControlledSeat(s, spell.controller)) {
            s.pendingAction = { type: 'TELLING_TIME', player: spell.controller, cards: viewed, hand: null, top: null };
            s.stackResolving = false;
            return s;
        } else {
            const { handCard, topCard, bottomCard } = getAiTellingTimePlan(s, spell.controller, viewed, getAiPolicyForActor(s, spell.controller));
            if (bottomCard) s.deck.unshift(bottomCard);
            if (topCard) s.deck.push(topCard);
            if (handCard) { handCard.owner = spell.controller; s[spell.controller].hand.push(handCard); }
            setKnownTop(s, spell.controller, topCard ? [topCard] : []);
        }
      }
      else if (spell.card.name === 'Predict') {
        s.graveyard.push(spell.card);
        if (isHumanControlledSeat(s, spell.controller)) {
            s.pendingAction = { type: 'PREDICT', player: spell.controller, guess: null };
            s.stackResolving = false;
            return s;
        } else {
            const guess = getAiPredictGuess(s, spell.controller);
            const milled = s.deck.length ? s.deck.pop() : null;
            if (milled) {
                consumeTopKnowledgeCard(s, milled);
                s.graveyard.push(milled);
                if(milled.name === guess) { drawCards(s, spell.controller, 2); } 
                else { drawCards(s, spell.controller, 1); }
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
        for(let i=0; i<2; i++) {
          if (s.deck.length) {
            const milled = s.deck.pop();
            consumeTopKnowledgeCard(s, milled);
            s.graveyard.push(milled);
          }
        }
        drawCards(s, spell.controller, 1);
      }
      else if (spell.card.name === "Day's Undoing") {
        const endsTurn = s.turn === spell.controller;
        const recycledCards = [...s.graveyard, ...s.player.hand, ...s.ai.hand];
        s.deck = [...s.deck, ...recycledCards];
        s.graveyard = []; s.player.hand = []; s.ai.hand = [];
        resetHiddenKnowledge(s);
        for (let i = s.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [s.deck[i], s.deck[j]] = [s.deck[j], s.deck[i]];
        }
        drawAlternating(s, s.turn, 7);
        if (endsTurn) {
            s.exile.push(spell.card);
            logAction(`Day's Undoing resets hands and graveyard, then is exiled.`);
            s[s.turn].board.forEach(c => { c.attacking = false; c.blocking = false; });
            s[s.turn === 'player' ? 'ai' : 'player'].board.forEach(c => { c.attacking = false; c.blocking = false; });
            s.phase = 'main2';
            s.priority = s.turn;
            s.stackResolving = false;
            s.consecutivePasses = 0;
            return reducer(s, { type: 'NEXT_PHASE' });
        }
        s.graveyard.push(spell.card);
        logAction(`Day's Undoing resets hands and graveyard!`);
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
       const pendingPlayer = s.pendingAction.player || 'player';
       if (s.pendingAction.type === 'LAND_TYPE_CHOICE') {
           const handIdx = s[pendingPlayer].hand.findIndex(c => c.id === s.pendingAction.cardId);
           const targetObj = s.player.board.find(c => c.id === s.pendingAction.targetId) || s.ai.board.find(c => c.id === s.pendingAction.targetId) || null;
           const chosenLandType = isLandTypeChoice(action.landTypeChoice) ? action.landTypeChoice : null;
           if (handIdx === -1 || !targetObj || !chosenLandType) {
             s.pendingAction = null;
             return s;
           }

           const card = s[pendingPlayer].hand[handIdx];
           if (!canPayCost(s[pendingPlayer].board, getManaPool(s, pendingPlayer), card.cost, card.blueRequirement || 0)) {
             s.pendingAction = null;
             return s;
           }

           effects.playCast();
           const castPayment = spendMana(s[pendingPlayer].board, getManaPool(s, pendingPlayer), card.cost, card.blueRequirement || 0);
           s[pendingPlayer].board = castPayment.board;
           s.floatingMana[pendingPlayer] = castPayment.pool;
           s[pendingPlayer].hand.splice(handIdx, 1);
           removeKnownHandCard(s, pendingPlayer, card.id);
           s.stack.push({ card, controller: pendingPlayer, target: targetObj, landTypeChoice: chosenLandType });
           s.pendingAction = null;
           s.consecutivePasses = 0;
           s.priority = getOpponent(pendingPlayer);
           logAction(`${getSeatLabel(pendingPlayer)} cast ${card.name} targeting ${targetObj.name}, choosing ${chosenLandType}.`);
           return s;
       } else if (s.pendingAction.type === 'BRAINSTORM') {
           const putBackCards = [];
           s.pendingAction.selected.forEach(cardId => {
               const idx = s[pendingPlayer].hand.findIndex(c => c.id === cardId);
               if(idx > -1) {
                 const [putBack] = s[pendingPlayer].hand.splice(idx, 1);
                 removeKnownHandCard(s, pendingPlayer, putBack.id);
                 s.deck.push(putBack);
                 putBackCards.push(putBack);
               }
           });
           clearKnownTop(s, getOpponent(pendingPlayer));
           forgetPrivateHandInfoFromOpponent(s, pendingPlayer);
           setKnownTop(s, pendingPlayer, [...putBackCards].reverse());
           logAction(`${getSeatLabel(pendingPlayer)} put cards on top.`);
       } else if (s.pendingAction.type === 'DISCARD') {
           s.pendingAction.selected.forEach(cardId => {
               const idx = s[pendingPlayer].hand.findIndex(c => c.id === cardId);
               if(idx > -1) {
                 const [discarded] = s[pendingPlayer].hand.splice(idx, 1);
                 removeKnownHandCard(s, pendingPlayer, discarded.id);
                 s.graveyard.push(discarded);
               }
           });
           logAction(`${getSeatLabel(pendingPlayer)} discarded a card.`);
       } else if (s.pendingAction.type === 'PREDICT') {
           if(s.deck.length) {
               const milled = s.deck.pop();
               consumeTopKnowledgeCard(s, milled);
               s.graveyard.push(milled);
               logAction(`Predict milled: ${milled.name}.`);
               if(milled.name === action.guess) { drawCards(s, pendingPlayer, 2); } 
               else { drawCards(s, pendingPlayer, 1); }
           }
       } else if (s.pendingAction.type === 'TELLING_TIME') {
           const handCard = s.pendingAction.cards.find(c => c.id === s.pendingAction.hand);
           const topCard = s.pendingAction.cards.find(c => c.id === s.pendingAction.top);
           const bottomCard = s.pendingAction.cards.find(c => c.id !== s.pendingAction.hand && c.id !== s.pendingAction.top);
           if(bottomCard) s.deck.unshift(bottomCard);
           if(topCard) s.deck.push(topCard);
           if(handCard) { handCard.owner = pendingPlayer; s[pendingPlayer].hand.push(handCard); }
           clearKnownTop(s, getOpponent(pendingPlayer));
           setKnownTop(s, pendingPlayer, topCard ? [topCard] : []);
           logAction(`${getSeatLabel(pendingPlayer)} resolved Telling Time.`);
       } else if (s.pendingAction.type === 'HALIMAR_DEPTHS') {
           const reversed = [...s.pendingAction.cards].reverse();
           reversed.forEach(c => s.deck.push(c));
           clearKnownTop(s, getOpponent(pendingPlayer));
           setKnownTop(s, pendingPlayer, s.pendingAction.cards);
           logAction(`${getSeatLabel(pendingPlayer)} reordered the top of the library.`);
       } else if (s.pendingAction.type === 'MULLIGAN_BOTTOM') {
           s.pendingAction.selected.forEach(cardId => {
               const idx = s[pendingPlayer].hand.findIndex(c => c.id === cardId);
               if(idx > -1) {
                 const [bottomed] = s[pendingPlayer].hand.splice(idx, 1);
                 removeKnownHandCard(s, pendingPlayer, bottomed.id);
                 s.deck.unshift(bottomed);
               }
           });
           logAction(`${getSeatLabel(pendingPlayer)} put ${s.pendingAction.count} card(s) on the bottom.`);
           if (isPeerGame(s)) {
             markPeerSeatKept(s, pendingPlayer);
             if (haveBothPeerSeatsKept(s)) {
               s.phase = 'upkeep';
               s.priority = 'player';
             } else {
               s.priority = getOpponent(pendingPlayer);
             }
           } else {
             s.phase = 'upkeep';
           }
         } else if (s.pendingAction.type === 'DISCARD_CLEANUP') {
            s.pendingAction.selected.forEach(cardId => {
                const idx = s[pendingPlayer].hand.findIndex(c => c.id === cardId);
                if(idx > -1) {
                  const [discarded] = s[pendingPlayer].hand.splice(idx, 1);
                  removeKnownHandCard(s, pendingPlayer, discarded.id);
                  s.graveyard.push(discarded);
                }
            });
            logAction(`${getSeatLabel(pendingPlayer)} discarded down to 7 cards.`);
            s.pendingAction = null;
            return reducer(s, { type: 'NEXT_TURN' });
         } else if (s.pendingAction.type === 'ACTIVATE_LAND') {
             const targetPlayer = s.pendingAction.player || 'player';
             s = resolveLandActivation(s, targetPlayer, s.pendingAction.cardId, s.pendingAction.cardName, s.pendingAction.activation || getActivationDetails(s.pendingAction.cardName));
             s.pendingAction = null;
             return s;
         } else if (s.pendingAction.type === 'HAND_LAND_ACTION') {
             s.pendingAction = null;
         } else if (s.pendingAction.type === 'MYSTIC_SANCTUARY') {
            if (action.selectedCardId) {
               const targetIdx = s.graveyard.findIndex(c => c.id === action.selectedCardId);
               if (targetIdx > -1) {
                   const [spell] = s.graveyard.splice(targetIdx, 1);
                   s.deck.push(spell);
                   prependKnownTopCard(s, 'all', spell);
                   logAction(`${getSeatLabel(pendingPlayer)} put ${spell.name} on top of the library with Mystic Sanctuary.`);
               }
           } else {
               logAction(`${getSeatLabel(pendingPlayer)} chose not to use Mystic Sanctuary's effect.`);
           }
       }
       s.pendingAction = null;
       if (s.phase === 'mulligan') {
         s.stackResolving = false;
         s.consecutivePasses = 0;
         return s;
       }
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
          s.graveyard.push(
            ...deadAttackers.map(card => preparePermanentForZoneChange(card)),
            ...deadBlockers.map(card => preparePermanentForZoneChange(card))
          );
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
              if (isHumanControlledSeat(s, s.turn)) {
                  s.pendingAction = { type: 'DISCARD_CLEANUP', player: s.turn, count: s[s.turn].hand.length - 7, selected: [] };
                  s.priority = s.turn;
                  if (!action.silentPhaseSound) effects.playPhase(s.phase);
                  return s;
              } else {
                  while(s[s.turn].hand.length > 7) s.graveyard.push(s[s.turn].hand.shift());
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
      s.player.board = expireTemporaryTextChanges(s.player.board);
      s.ai.board = expireTemporaryTextChanges(s.ai.board);
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



