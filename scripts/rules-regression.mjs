import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');
const runtimeDir = path.join(repoRoot, '.tmp-rules-runtime');

const compileRuntime = () => {
  fs.rmSync(runtimeDir, { recursive: true, force: true });
  fs.mkdirSync(runtimeDir, { recursive: true });

  const tscArgs = [
    'src/game/engine.ts',
    'src/trainedPolicy.ts',
    '--outDir', runtimeDir,
    '--module', 'ESNext',
    '--target', 'ES2020',
    '--moduleResolution', 'Node',
    '--skipLibCheck'
  ];

  if (process.platform === 'win32') {
    const tscCmd = path.join(repoRoot, 'node_modules', '.bin', 'tsc.cmd');
    execFileSync('cmd.exe', ['/c', tscCmd, ...tscArgs], { cwd: repoRoot, stdio: 'inherit' });
  } else {
    const tscCmd = path.join(repoRoot, 'node_modules', '.bin', 'tsc');
    execFileSync(tscCmd, tscArgs, { cwd: repoRoot, stdio: 'inherit' });
  }

  fs.writeFileSync(path.join(runtimeDir, 'trainedPolicy'), "export * from './trainedPolicy.js';\n");
};

compileRuntime();

const engine = await import(new URL(`file:///${path.join(runtimeDir, 'game', 'engine.js').replace(/\\/g, '/')}`));
const {
  CARDS,
  DANDAN_NAME,
  checkHasActions,
  chooseAiAction,
  createGameReducer,
  initialState,
  isActivatable
} = engine;

const effects = {
  initAudio() {},
  playDraw() {},
  playLand() {},
  playCast() {},
  playResolve() {},
  playPhase() {}
};

const reducer = createGameReducer(effects);

const getBlueSources = (card) => {
  if (!card.isLand) return 0;
  if (card.name === 'Haunted Fengraf') return 0;
  if (['The Surgical Bay', 'Svyelunite Temple', 'Lonely Sandbar', 'Remote Isle', 'Halimar Depths'].includes(card.name)) return 1;
  return card.type.includes('Island') ? 1 : 0;
};

const getBlueRequirement = (manaCost) => (manaCost.match(/\{U\}/g) || []).length;
const isCreatureCard = (card) => Boolean(card) && (card.type?.includes('Creature') || card.name === DANDAN_NAME);

const makeCard = (template, overrides = {}) => ({
  ...template,
  id: overrides.id || `${template.name}-${Math.random().toString(36).slice(2, 10)}`,
  tapped: false,
  summoningSickness: isCreatureCard(template),
  attacking: false,
  blocking: false,
  isSwamp: false,
  owner: null,
  landType: template.type.includes('Island') ? 'Island' : null,
  blueSources: getBlueSources(template),
  blueRequirement: getBlueRequirement(template.manaCost),
  dandanLandType: 'Island',
  enchantedId: null,
  controlledByAuraId: null,
  attachmentOrder: null,
  ...overrides
});

const makeState = (overrides = {}) => ({
  ...structuredClone(initialState),
  started: true,
  phase: 'main1',
  turn: 'player',
  priority: 'player',
  stack: [],
  graveyard: [],
  log: [],
  deck: [],
  pendingAction: null,
  pendingTargetSelection: null,
  stackResolving: false,
  player: { life: 20, hand: [], board: [], landsPlayed: 0 },
  ai: { life: 20, hand: [], board: [], landsPlayed: 0 },
  ...overrides
});

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test('mulligan stops at seven', () => {
  let state = reducer(initialState, { type: 'START_GAME', mode: 'player', difficulty: 'medium' });
  for (let i = 0; i < 8; i++) state = reducer(state, { type: 'MULLIGAN' });
  expect(state.mulliganCount === 7, `expected mulliganCount 7, got ${state.mulliganCount}`);
  const handSnapshot = state.player.hand.map((card) => card.id).join(',');
  const afterExtra = reducer(state, { type: 'MULLIGAN' });
  expect(afterExtra.mulliganCount === 7, 'mulligan count advanced past seven');
  expect(afterExtra.player.hand.map((card) => card.id).join(',') === handSnapshot, 'extra mulligan changed hand after the cap');
});

test('Haunted Fengraf sacrifices itself and can return Dandan', () => {
  const fengraf = makeCard(CARDS.FENGRAF, { id: 'fengraf-1' });
  const islandA = makeCard(CARDS.ISLAND_1, { id: 'island-a' });
  const islandB = makeCard(CARDS.ISLAND_2, { id: 'island-b' });
  const islandC = makeCard(CARDS.ISLAND_3, { id: 'island-c' });
  const graveDandan = makeCard(CARDS.DANDAN, { id: 'grave-dandan', owner: 'player' });

  let state = makeState({
    player: {
      life: 20,
      hand: [],
      board: [fengraf, islandA, islandB, islandC],
      landsPlayed: 0
    },
    graveyard: [graveDandan]
  });

  expect(isActivatable(fengraf, state, 'player'), 'Fengraf should be activatable with Dandan in the graveyard');
  state = reducer(state, { type: 'PROMPT_ACTIVATE_LAND', cardId: fengraf.id, cardName: fengraf.name });
  expect(state.pendingAction?.type === 'ACTIVATE_LAND', 'Fengraf activation prompt did not open');
  state = reducer(state, { type: 'SUBMIT_PENDING_ACTION' });

  expect(!state.player.board.some((card) => card.id === fengraf.id), 'Fengraf stayed on the battlefield');
  expect(state.graveyard.some((card) => card.id === fengraf.id), 'Fengraf was not sacrificed to the graveyard');
  expect(state.player.hand.some((card) => card.id === graveDandan.id), 'Dandan was not returned to hand');
  expect(!state.graveyard.some((card) => card.id === graveDandan.id), 'Returned Dandan stayed in the graveyard');
});

test('Halimar Depths reorder persists chosen top-to-bottom order', () => {
  const halimar = makeCard(CARDS.HALIMAR, { id: 'halimar-1' });
  const topA = makeCard(CARDS.BRAINSTORM, { id: 'top-a' });
  const topB = makeCard(CARDS.PREDICT, { id: 'top-b' });
  const topC = makeCard(CARDS.DAYS_UNDOING, { id: 'top-c' });

  let state = makeState({
    deck: [topA, topB, topC],
    player: {
      life: 20,
      hand: [halimar],
      board: [],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'PLAY_LAND', player: 'player', cardId: halimar.id });
  expect(state.pendingAction?.type === 'HALIMAR_DEPTHS', 'Halimar Depths did not open reorder action');
  expect(state.pendingAction.cards.map((card) => card.id).join(',') === 'top-c,top-b,top-a', 'Unexpected initial Halimar reveal order');

  state = reducer(state, { type: 'REORDER_HALIMAR', from: 0, to: 2 });
  state = reducer(state, { type: 'SUBMIT_PENDING_ACTION' });

  const topThree = state.deck.slice(-3).map((card) => card.id).reverse();
  expect(topThree.join(',') === 'top-b,top-a,top-c', `Unexpected Halimar top order: ${topThree.join(',')}`);
});

test('Halimar Depths taps for blue mana', () => {
  const halimar = makeCard(CARDS.HALIMAR, { id: 'halimar-mana', tapped: false });
  const brainstorm = makeCard(CARDS.BRAINSTORM, { id: 'halimar-brainstorm', owner: 'player' });

  let state = makeState({
    player: {
      life: 20,
      hand: [brainstorm],
      board: [halimar],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'CAST_SPELL', player: 'player', cardId: brainstorm.id });

  expect(state.stack.some((entry) => entry.card.id === brainstorm.id), 'Halimar Depths could not pay for a blue spell');
  expect(state.player.board.some((card) => card.id === halimar.id && card.tapped), 'Halimar Depths was not tapped to pay for blue mana');
});

test('cycling lands prompt for play or cycle when both are legal', () => {
  const sandbar = makeCard(CARDS.SANDBAR, { id: 'sandbar-1' });
  const island = makeCard(CARDS.ISLAND_1, { id: 'cycle-island' });

  const state = makeState({
    player: {
      life: 20,
      hand: [sandbar],
      board: [island],
      landsPlayed: 0
    }
  });

  const next = reducer(state, { type: 'PROMPT_HAND_LAND_ACTION', cardId: sandbar.id });
  expect(next.pendingAction?.type === 'HAND_LAND_ACTION', 'Cycling land prompt did not open');
  expect(next.pendingAction.canPlay === true, 'Cycling land prompt lost the play option');
  expect(next.pendingAction.canCycle === true, 'Cycling land prompt lost the cycle option');
});

test('cycling from the prompt actually resolves, taps mana, and draws', () => {
  const sandbar = makeCard(CARDS.SANDBAR, { id: 'sandbar-cycle' });
  const island = makeCard(CARDS.ISLAND_1, { id: 'cycle-fuel' });
  const drawCard = makeCard(CARDS.BRAINSTORM, { id: 'draw-after-cycle', owner: 'player' });

  let state = makeState({
    deck: [drawCard],
    player: {
      life: 20,
      hand: [sandbar],
      board: [island],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'PROMPT_HAND_LAND_ACTION', cardId: sandbar.id });
  expect(state.pendingAction?.type === 'HAND_LAND_ACTION', 'Cycle prompt did not open before cycling');
  state = reducer(state, { type: 'CYCLE_CARD', player: 'player', cardId: sandbar.id });

  expect(state.pendingAction === null, 'Cycle prompt stayed open after cycling');
  expect(state.player.board.some((card) => card.id === island.id && card.tapped), 'Cycling did not tap the mana source');
  expect(state.graveyard.some((card) => card.id === sandbar.id), 'Cycled land did not go to the graveyard');
  expect(!state.player.hand.some((card) => card.id === sandbar.id), 'Cycled land stayed in hand');
  expect(state.player.hand.some((card) => card.id === drawCard.id), 'Cycling did not draw a replacement card');
});

test('AI Predict uses the actual top card instead of blind-guessing Dandan', () => {
  const predict = makeCard(CARDS.PREDICT, { id: 'ai-predict', owner: 'ai' });
  const topCard = makeCard(CARDS.BRAINSTORM, { id: 'predict-top' });
  const drawOne = makeCard(CARDS.ISLAND_1, { id: 'predict-draw-one', owner: 'ai' });
  const drawTwo = makeCard(CARDS.ACCUMULATED_KNOWLEDGE, { id: 'predict-draw-two', owner: 'ai' });

  let state = makeState({
    turn: 'ai',
    priority: null,
    stackResolving: true,
    deck: [drawOne, drawTwo, topCard],
    stack: [{ card: predict, controller: 'ai', target: null }],
    ai: {
      life: 20,
      hand: [],
      board: [],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'RESOLVE_TOP_STACK' });

  expect(state.ai.hand.length === 2, `AI Predict should have drawn 2 cards on a known hit, got ${state.ai.hand.length}`);
  expect(state.graveyard.some((card) => card.id === topCard.id), 'Predict did not mill the known top card');
});

test('direct land activation works for AI-only actions', () => {
  const surgicalBay = makeCard(CARDS.SURGICAL_BAY, { id: 'ai-bay' });
  const island = makeCard(CARDS.ISLAND_1, { id: 'ai-bay-fuel' });
  const drawCard = makeCard(CARDS.TELLING_TIME, { id: 'ai-bay-draw', owner: 'ai' });

  let state = makeState({
    turn: 'ai',
    priority: 'ai',
    deck: [drawCard],
    ai: {
      life: 20,
      hand: [],
      board: [surgicalBay, island],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'ACTIVATE_LAND_NOW', player: 'ai', cardId: surgicalBay.id, cardName: surgicalBay.name });

  expect(state.ai.hand.some((card) => card.id === drawCard.id), 'AI land activation did not draw a card');
  expect(state.graveyard.some((card) => card.id === surgicalBay.id), 'Activated Surgical Bay did not go to the graveyard');
  expect(state.priority === 'ai', `AI should keep priority after direct land activation, got ${state.priority}`);
});

test('Svyelunite Temple sacrifices for {U}{U} and that mana can be spent this phase', () => {
  const temple = makeCard(CARDS.TEMPLE, { id: 'temple-1' });
  const chart = makeCard(CARDS.CHART, { id: 'chart-1', owner: 'player' });

  let state = makeState({
    player: {
      life: 20,
      hand: [chart],
      board: [temple],
      landsPlayed: 0
    }
  });

  expect(isActivatable(temple, state, 'player'), 'Temple should be activatable while untapped');
  state = reducer(state, { type: 'PROMPT_ACTIVATE_LAND', cardId: temple.id, cardName: temple.name });
  expect(state.pendingAction?.type === 'ACTIVATE_LAND', 'Temple activation prompt did not open');
  state = reducer(state, { type: 'SUBMIT_PENDING_ACTION' });

  expect(!state.player.board.some((card) => card.id === temple.id), 'Temple stayed on the battlefield after activation');
  expect(state.graveyard.some((card) => card.id === temple.id), 'Temple was not sacrificed');
  expect(state.floatingMana.player.total === 2 && state.floatingMana.player.blue === 2, 'Temple did not create {U}{U} floating mana');

  state = reducer(state, { type: 'CAST_SPELL', player: 'player', cardId: chart.id });

  expect(state.stack.some((entry) => entry.card.id === chart.id), 'Floating Temple mana could not cast Chart a Course');
  expect(state.floatingMana.player.total === 0 && state.floatingMana.player.blue === 0, 'Floating Temple mana was not spent by the cast');
});

test('Control Magic leaves with the enchanted Dandan when state-based actions kill it', () => {
  const aura = makeCard(CARDS.CONTROL_MAGIC, { id: 'aura-1', owner: 'player', enchantedId: 'stolen-dandan' });
  const stolenDandan = makeCard(CARDS.DANDAN, {
    id: 'stolen-dandan',
    owner: 'ai',
    summoningSickness: false,
    controlledByAuraId: aura.id
  });

  const state = makeState({
    player: {
      life: 20,
      hand: [],
      board: [stolenDandan, aura],
      landsPlayed: 0
    },
    ai: { life: 20, hand: [], board: [], landsPlayed: 0 }
  });

  const next = reducer(state, { type: 'NEXT_PHASE', silentPhaseSound: true });
  expect(!next.player.board.some((card) => card.id === stolenDandan.id), 'State-based actions did not remove the stolen Dandan');
  expect(!next.player.board.some((card) => card.id === aura.id), 'Control Magic stayed on the battlefield after its Dandan died');
  expect(next.graveyard.some((card) => card.id === stolenDandan.id), 'Dead Dandan did not reach the graveyard');
  expect(next.graveyard.some((card) => card.id === aura.id), 'Control Magic did not reach the graveyard');
});

test('declared attackers can be toggled off before combat is confirmed', () => {
  const dandan = makeCard(CARDS.DANDAN, {
    id: 'attack-toggle-dandan',
    owner: 'player',
    summoningSickness: false
  });
  const opponentIsland = makeCard(CARDS.ISLAND_1, { id: 'attack-toggle-island' });

  let state = makeState({
    turn: 'player',
    phase: 'declare_attackers',
    priority: 'player',
    player: {
      life: 20,
      hand: [],
      board: [dandan],
      landsPlayed: 0
    },
    ai: {
      life: 20,
      hand: [],
      board: [opponentIsland],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'TOGGLE_ATTACK', player: 'player', cardId: dandan.id });
  const selected = state.player.board.find((card) => card.id === dandan.id);
  expect(selected.attacking === true, 'Dandan did not become an attacker');
  expect(selected.tapped === false, 'Dandan should not tap until combat is locked in');

  state = reducer(state, { type: 'TOGGLE_ATTACK', player: 'player', cardId: dandan.id });
  const deselected = state.player.board.find((card) => card.id === dandan.id);
  expect(deselected.attacking === false, 'Dandan could not be deselected as an attacker');
  expect(deselected.tapped === false, 'Deselected Dandan should remain untapped');
});

test('AI always declares a legal Dandan attack when combat is open', () => {
  const aiDandan = makeCard(CARDS.DANDAN, {
    id: 'ai-attacker',
    owner: 'ai',
    summoningSickness: false
  });
  const aiIsland = makeCard(CARDS.ISLAND_1, { id: 'ai-attack-island' });
  const playerIsland = makeCard(CARDS.ISLAND_2, { id: 'player-attack-island' });

  const state = makeState({
    turn: 'ai',
    phase: 'declare_attackers',
    priority: 'ai',
    ai: {
      life: 20,
      hand: [],
      board: [aiDandan, aiIsland],
      landsPlayed: 0
    },
    player: {
      life: 20,
      hand: [],
      board: [playerIsland],
      landsPlayed: 0
    }
  });

  const action = chooseAiAction(state, 'ai');
  expect(action.type === 'TOGGLE_ATTACK', `AI should declare attack, got ${action.type}`);
  expect(action.cardId === aiDandan.id, 'AI did not choose its legal Dandan attacker');
});

test('declare attackers step auto-enforces mandatory Dandan attacks', () => {
  const dandan = makeCard(CARDS.DANDAN, {
    id: 'forced-attacker',
    owner: 'player',
    summoningSickness: false
  });
  const playerIsland = makeCard(CARDS.ISLAND_1, { id: 'forced-player-island' });
  const opponentIsland = makeCard(CARDS.ISLAND_2, { id: 'forced-opponent-island' });
  const blockerWindowSpell = makeCard(CARDS.BRAINSTORM, { id: 'forced-blocker-window', owner: 'ai' });

  let state = makeState({
    turn: 'player',
    phase: 'declare_attackers',
    priority: 'player',
    player: {
      life: 20,
      hand: [],
      board: [dandan, playerIsland],
      landsPlayed: 0
    },
    ai: {
      life: 20,
      hand: [blockerWindowSpell],
      board: [opponentIsland],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'NEXT_PHASE' });

  const attackingDandan = state.player.board.find((card) => card.id === dandan.id);
  expect(state.ai.life === 16, `Forced Dandan attack should have connected for 4 damage, got AI life ${state.ai.life}`);
  expect(attackingDandan?.tapped === true, 'Forced attacker should be tapped after combat resolves');
  expect(state.hasAttacked.player === true, 'Forced combat should count as an attack for the turn');
});

test('Control Magic steals a Dandan without gaining creature summoning sickness itself', () => {
  const islands = [
    makeCard(CARDS.ISLAND_1, { id: 'cm-island-1' }),
    makeCard(CARDS.ISLAND_1, { id: 'cm-island-2' }),
    makeCard(CARDS.ISLAND_2, { id: 'cm-island-3' }),
    makeCard(CARDS.ISLAND_2, { id: 'cm-island-4' })
  ];
  const controlMagic = makeCard(CARDS.CONTROL_MAGIC, { id: 'cm-spell', owner: 'player' });
  const enemyDandan = makeCard(CARDS.DANDAN, {
    id: 'cm-target',
    owner: 'ai',
    summoningSickness: false
  });

  let state = makeState({
    player: {
      life: 20,
      hand: [controlMagic],
      board: islands,
      landsPlayed: 0
    },
    ai: {
      life: 20,
      hand: [],
      board: [enemyDandan],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'CAST_SPELL', player: 'player', cardId: controlMagic.id, target: enemyDandan });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'ai' });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'player' });
  expect(state.stackResolving === true, 'Control Magic did not move to stack resolution');
  state = reducer(state, { type: 'RESOLVE_TOP_STACK' });

  const auraOnBoard = state.player.board.find((card) => card.name === 'Control Magic');
  const stolenOnBoard = state.player.board.find((card) => card.id === enemyDandan.id);
  expect(Boolean(auraOnBoard), 'Control Magic did not stay on the battlefield');
  expect(Boolean(stolenOnBoard), 'Stolen Dandan did not move under the new controller');
  expect(auraOnBoard.summoningSickness === false, 'Control Magic incorrectly gained summoning sickness');
  expect(stolenOnBoard.summoningSickness === true, 'Stolen Dandan should gain summoning sickness under the new controller');
  expect(stolenOnBoard.controlledByAuraId === auraOnBoard.id, 'Stolen Dandan is not linked to the Control Magic aura');
});

test('Metamorphose on Control Magic returns the Dandan to its owner', () => {
  const playerIslands = [
    makeCard(CARDS.ISLAND_1, { id: 'meta-island-1' }),
    makeCard(CARDS.ISLAND_1, { id: 'meta-island-2' })
  ];
  const aura = makeCard(CARDS.CONTROL_MAGIC, {
    id: 'meta-aura',
    owner: 'player',
    enchantedId: 'meta-dandan',
    attachmentOrder: 1
  });
  const stolenDandan = makeCard(CARDS.DANDAN, {
    id: 'meta-dandan',
    owner: 'ai',
    summoningSickness: false,
    controlledByAuraId: aura.id
  });
  const metamorphose = makeCard(CARDS.METAMORPHOSE, { id: 'meta-spell', owner: 'ai' });
  const aiIslands = [
    makeCard(CARDS.ISLAND_2, { id: 'meta-ai-island-1' }),
    makeCard(CARDS.ISLAND_2, { id: 'meta-ai-island-2' })
  ];

  let state = makeState({
    turn: 'ai',
    priority: 'ai',
    player: {
      life: 20,
      hand: [],
      board: [stolenDandan, aura, ...playerIslands],
      landsPlayed: 0
    },
    ai: {
      life: 20,
      hand: [metamorphose],
      board: aiIslands,
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'CAST_SPELL', player: 'ai', cardId: metamorphose.id, target: aura });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'player' });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'ai' });
  expect(state.stackResolving === true, 'Metamorphose did not move to stack resolution');
  state = reducer(state, { type: 'RESOLVE_TOP_STACK' });

  expect(!state.player.board.some((card) => card.id === aura.id), 'Control Magic stayed on the battlefield after Metamorphose');
  expect(state.deck[state.deck.length - 1]?.id === aura.id, 'Control Magic did not go on top of the library');
  expect(state.deck[state.deck.length - 1]?.enchantedId === null, 'Control Magic kept a stale attachment after leaving the battlefield');
  expect(state.ai.board.some((card) => card.id === stolenDandan.id), 'Dandan did not return to its owner after Control Magic left');
  const returnedDandan = state.ai.board.find((card) => card.id === stolenDandan.id);
  expect(returnedDandan.controlledByAuraId === null, 'Returned Dandan kept a stale aura link');
  expect(returnedDandan.summoningSickness === true, 'Returned Dandan should have summoning sickness after control changes back');
});

test('older Control Magic resumes control when the newer aura leaves', () => {
  const firstAura = makeCard(CARDS.CONTROL_MAGIC, {
    id: 'older-aura',
    owner: 'player',
    enchantedId: 'stacked-dandan',
    attachmentOrder: 1
  });
  const secondAura = makeCard(CARDS.CONTROL_MAGIC, {
    id: 'newer-aura',
    owner: 'ai',
    enchantedId: 'stacked-dandan',
    attachmentOrder: 2
  });
  const stackedDandan = makeCard(CARDS.DANDAN, {
    id: 'stacked-dandan',
    owner: 'ai',
    summoningSickness: false,
    controlledByAuraId: secondAura.id
  });
  const metamorphose = makeCard(CARDS.METAMORPHOSE, { id: 'stacked-meta', owner: 'player' });
  const playerIslands = [
    makeCard(CARDS.ISLAND_1, { id: 'stacked-island-1' }),
    makeCard(CARDS.ISLAND_1, { id: 'stacked-island-2' })
  ];

  let state = makeState({
    player: {
      life: 20,
      hand: [metamorphose],
      board: [firstAura, ...playerIslands],
      landsPlayed: 0
    },
    ai: {
      life: 20,
      hand: [],
      board: [stackedDandan, secondAura],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'CAST_SPELL', player: 'player', cardId: metamorphose.id, target: secondAura });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'ai' });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'player' });
  expect(state.stackResolving === true, 'Metamorphose did not reach resolution for stacked Control Magics');
  state = reducer(state, { type: 'RESOLVE_TOP_STACK' });

  expect(state.player.board.some((card) => card.id === stackedDandan.id), 'Older Control Magic did not resume control of the Dandan');
  const resumedDandan = state.player.board.find((card) => card.id === stackedDandan.id);
  expect(resumedDandan.controlledByAuraId === firstAura.id, 'Resumed Dandan is not linked to the older Control Magic');
  expect(state.ai.board.every((card) => card.id !== stackedDandan.id), 'Dandan stayed with the newer controller after that aura left');
});

test('Capture of Jingzhou adds an extra turn without skipping the current main phase', () => {
  const islands = [
    makeCard(CARDS.ISLAND_1, { id: 'i1' }),
    makeCard(CARDS.ISLAND_1, { id: 'i2' }),
    makeCard(CARDS.ISLAND_1, { id: 'i3' }),
    makeCard(CARDS.ISLAND_1, { id: 'i4' }),
    makeCard(CARDS.ISLAND_2, { id: 'i5' })
  ];
  const dandan = makeCard(CARDS.DANDAN, { id: 'dandan-1', summoningSickness: false });
  const capture = makeCard(CARDS.CAPTURE, { id: 'capture-1', owner: 'player' });
  const brainstorm = makeCard(CARDS.BRAINSTORM, { id: 'brainstorm-1', owner: 'player' });
  const enemyIsland = makeCard(CARDS.ISLAND_3, { id: 'enemy-island' });

  let state = makeState({
    player: {
      life: 20,
      hand: [capture, brainstorm],
      board: [...islands, dandan],
      landsPlayed: 0
    },
    ai: {
      life: 20,
      hand: [],
      board: [enemyIsland],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'CAST_SPELL', player: 'player', cardId: capture.id });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'ai' });
  state = reducer(state, { type: 'PASS_PRIORITY', player: 'player' });
  expect(state.stackResolving === true, 'Capture did not move to stack resolution');
  state = reducer(state, { type: 'RESOLVE_TOP_STACK' });

  expect(state.turn === 'player', 'Current turn changed when Capture resolved');
  expect(state.phase === 'main1', `Capture should leave the player in main1, got ${state.phase}`);
  expect(state.extraTurns.player === 1, `Capture did not add an extra turn, got ${state.extraTurns.player}`);
  expect(state.priority === 'player', 'Player did not regain priority after Capture resolved');
  expect(state.player.hand.some((card) => card.id === brainstorm.id), 'Post-Capture follow-up spell disappeared');
});

test('opponent skipped attack still gives the player an end-step instant window', () => {
  const island = makeCard(CARDS.ISLAND_1, { id: 'eot-island' });
  const brainstorm = makeCard(CARDS.BRAINSTORM, { id: 'eot-brainstorm', owner: 'player' });

  let state = makeState({
    turn: 'ai',
    phase: 'main2',
    priority: 'ai',
    player: {
      life: 20,
      hand: [brainstorm],
      board: [island],
      landsPlayed: 0
    },
    ai: {
      life: 20,
      hand: [],
      board: [],
      landsPlayed: 0
    }
  });

  state = reducer(state, { type: 'NEXT_PHASE' });

  expect(state.phase === 'cleanup', `Expected cleanup/end-step window, got ${state.phase}`);
  expect(state.turn === 'ai', 'Turn changed before the opponent end-step window');
  expect(state.priority === 'player', 'Priority did not pass to the player at opponent end step');
  expect(checkHasActions(state, 'player'), 'Player should have actions at opponent end step');

  state = reducer(state, { type: 'CAST_SPELL', player: 'player', cardId: brainstorm.id });

  expect(state.stack.some((entry) => entry.card.id === brainstorm.id), 'Player could not cast an instant at opponent end step');
  expect(state.turn === 'ai' && state.phase === 'cleanup', 'Casting an end-step instant changed the turn or phase incorrectly');
});

let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error instanceof Error ? error.message : String(error));
  }
}

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log(`All ${tests.length} regression checks passed.`);
}
