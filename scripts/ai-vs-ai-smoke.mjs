import {
  DANDAN_NAME,
  checkHasActions,
  controlsIsland,
  createGameReducer,
  getAvailableMana,
  getLivePolicyWeights,
  initialState,
  isCastable
} from '../.tmp-smoke/game/engine.js';

const effects = {
  initAudio() {},
  playDraw() {},
  playLand() {},
  playCast() {},
  playResolve() {},
  playPhase() {}
};

const randomChoice = (list) => list[Math.floor(Math.random() * list.length)];

const shouldMakeMistake = (difficulty, baseRate, policy) => {
  if (difficulty === 'easy') return Math.random() < Math.max(baseRate, policy.mistakeRate);
  if (difficulty === 'hard') return Math.random() < Math.min(baseRate * 0.5, policy.mistakeRate);
  return Math.random() < Math.max(baseRate * 0.8, policy.mistakeRate * 0.8);
};

const getSpellPriority = (card, policy) => {
  switch (card.name) {
    case DANDAN_NAME: return 8 + policy.aggression * 4;
    case 'Control Magic': return 6 + policy.control * 4;
    case 'Memory Lapse':
    case 'Unsubstantiate': return 5 + policy.counterBias * 3;
    case 'Capture of Jingzhou': return 5 + policy.control * 2;
    case 'Accumulated Knowledge':
    case 'Predict':
    case 'Telling Time':
    case 'Brainstorm':
    case 'Chart a Course':
    case 'Mental Note':
      return 2 + policy.drawBias * 3;
    default:
      return 1;
  }
};

const resolveAiPendingAction = (state, dispatch) => {
  if (!state.pendingAction) return;

  if (['BRAINSTORM', 'DISCARD', 'DISCARD_CLEANUP', 'MULLIGAN_BOTTOM'].includes(state.pendingAction.type)) {
    const count = state.pendingAction.count || 0;
    const selected = [...state.player.hand]
      .sort((a, b) => Number(a.isLand) - Number(b.isLand) || b.cost - a.cost)
      .slice(0, count)
      .map((card) => card.id);
    selected.forEach((cardId) => dispatch({ type: 'TOGGLE_PENDING_SELECT', cardId }));
    dispatch({ type: 'SUBMIT_PENDING_ACTION' });
    return;
  }

  if (state.pendingAction.type === 'PREDICT') {
    dispatch({ type: 'SUBMIT_PENDING_ACTION', guess: DANDAN_NAME });
    return;
  }

  if (state.pendingAction.type === 'TELLING_TIME') {
    const [handCard, topCard] = state.pendingAction.cards;
    if (handCard) dispatch({ type: 'UPDATE_TELLING_TIME', cardId: handCard.id, dest: 'hand' });
    if (topCard) dispatch({ type: 'UPDATE_TELLING_TIME', cardId: topCard.id, dest: 'top' });
    dispatch({ type: 'SUBMIT_PENDING_ACTION' });
    return;
  }

  if (state.pendingAction.type === 'HALIMAR_DEPTHS') {
    dispatch({ type: 'SUBMIT_PENDING_ACTION' });
    return;
  }

  if (state.pendingAction.type === 'MYSTIC_SANCTUARY') {
    dispatch({ type: 'SUBMIT_PENDING_ACTION', selectedCardId: state.pendingAction.validTargets?.[0] || null });
  }
};

const takeAiAction = (state, dispatch, actor) => {
  const opponent = actor === 'player' ? 'ai' : 'player';
  const difficulty = state.difficulty || 'medium';
  const policy = getLivePolicyWeights(difficulty);
  const canCast = (card) => Boolean(card) && isCastable(card, state, actor);

  if (state.stack.length > 0) {
    const topSpell = state.stack[state.stack.length - 1];
    if (topSpell.controller === opponent) {
      const lapse = state[actor].hand.find((c) => c.name === 'Memory Lapse');
      if (canCast(lapse) && topSpell.card.name === DANDAN_NAME) {
        if (policy.counterBias < 0.65 || shouldMakeMistake(difficulty, 0.08, policy)) {
          const action = { type: 'PASS_PRIORITY', player: actor };
          dispatch(action);
          return action;
        }
        const action = { type: 'CAST_SPELL', player: actor, cardId: lapse.id, target: topSpell };
        dispatch(action);
        return action;
      }

      const unsub = state[actor].hand.find((c) => c.name === 'Unsubstantiate');
      if (canCast(unsub) && topSpell.card.name === DANDAN_NAME) {
        if (policy.counterBias < 0.5 || shouldMakeMistake(difficulty, 0.12, policy)) {
          const action = { type: 'PASS_PRIORITY', player: actor };
          dispatch(action);
          return action;
        }
        const action = { type: 'CAST_SPELL', player: actor, cardId: unsub.id, target: topSpell };
        dispatch(action);
        return action;
      }
    }
    const action = { type: 'PASS_PRIORITY', player: actor };
    dispatch(action);
    return action;
  }

  if (state.turn === actor && state.phase === 'declare_attackers') {
    const defenderHasIsland = controlsIsland(state[opponent].board);
    const readyDandans = state[actor].board.filter((c) => c.name === DANDAN_NAME && !c.summoningSickness && !c.tapped && !c.attacking);
    const shouldAttack = readyDandans.length > 0
      && defenderHasIsland
      && (readyDandans.length * policy.attackBias >= Math.max(0.8, state[opponent].board.filter((c) => c.name === DANDAN_NAME).length * policy.blockBias));

    if (shouldAttack && !shouldMakeMistake(difficulty, 0.1, policy)) {
      const action = { type: 'TOGGLE_ATTACK', cardId: readyDandans[0].id, player: actor };
      dispatch(action);
      return action;
    }
    const action = { type: 'PASS_PRIORITY', player: actor };
    dispatch(action);
    return action;
  }

  if (state.turn === opponent && state.phase === 'declare_blockers') {
    const opponentAttacking = state[opponent].board.some((c) => c.attacking);
    if (opponentAttacking) {
      const hack = state[actor].hand.find((c) => ['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(c.name));
      if (!state[actor].board.some((c) => c.name === DANDAN_NAME && !c.tapped) && canCast(hack) && policy.control >= 0.4) {
        const target = state[opponent].board.find((c) => c.attacking);
        if (target) {
          const action = { type: 'CAST_SPELL', player: actor, cardId: hack.id, target };
          dispatch(action);
          return action;
        }
      }

      const blockers = state[actor].board.filter((c) => c.name === DANDAN_NAME && !c.tapped && !c.blocking);
      if (blockers.length > 0 && policy.blockBias >= 0.55 && !shouldMakeMistake(difficulty, 0.12, policy)) {
        const action = { type: 'TOGGLE_BLOCK', cardId: blockers[0].id, player: actor };
        dispatch(action);
        return action;
      }
    }
    const action = { type: 'PASS_PRIORITY', player: actor };
    dispatch(action);
    return action;
  }

  if (state.turn === actor && (state.phase === 'main1' || state.phase === 'main2' || state.phase === 'upkeep')) {
    const land = state[actor].hand.find((c) => c.isLand);
    if (state.phase !== 'upkeep' && land && state[actor].landsPlayed === 0 && state[actor].board.filter((c) => c.isLand).length < policy.landLimit) {
      const action = { type: 'PLAY_LAND', player: actor, cardId: land.id };
      dispatch(action);
      return action;
    }

    const dandan = state[actor].hand.find((c) => c.name === DANDAN_NAME);
    const opponentHasIsland = controlsIsland(state[opponent].board);
    if (state.phase !== 'upkeep' && canCast(dandan) && opponentHasIsland && !shouldMakeMistake(difficulty, 0.08, policy)) {
      const action = { type: 'CAST_SPELL', player: actor, cardId: dandan.id };
      dispatch(action);
      return action;
    }

    const hack = state[actor].hand.find((c) => ['Magical Hack', 'Crystal Spray', 'Metamorphose'].includes(c.name));
    if (state.phase !== 'upkeep' && canCast(hack) && state[opponent].board.some((c) => c.name === DANDAN_NAME) && policy.control >= 0.4) {
      const target = state[opponent].board.find((c) => c.name === DANDAN_NAME);
      const action = { type: 'CAST_SPELL', player: actor, cardId: hack.id, target };
      dispatch(action);
      return action;
    }

    const controlMagic = state[actor].hand.find((c) => c.name === 'Control Magic');
    if (state.phase !== 'upkeep' && canCast(controlMagic) && state[opponent].board.some((c) => c.name === DANDAN_NAME) && policy.stealBias >= 0.8) {
      const target = state[opponent].board.find((c) => c.name === DANDAN_NAME);
      const action = { type: 'CAST_SPELL', player: actor, cardId: controlMagic.id, target };
      dispatch(action);
      return action;
    }

    const castableSpells = state[actor].hand.filter((c) => !c.isLand
      && ![DANDAN_NAME, 'Memory Lapse', 'Unsubstantiate', 'Magical Hack', 'Crystal Spray', 'Control Magic', 'Metamorphose'].includes(c.name)
      && isCastable(c, state, actor));

    if (castableSpells.length > 0) {
      const spell = difficulty === 'hard'
        ? [...castableSpells].sort((a, b) => getSpellPriority(b, policy) - getSpellPriority(a, policy))[0]
        : difficulty === 'easy'
          ? randomChoice(castableSpells)
          : castableSpells[0];
      if (!shouldMakeMistake(difficulty, 0.08, policy)) {
        const action = { type: 'CAST_SPELL', player: actor, cardId: spell.id };
        dispatch(action);
        return action;
      }
    }
  }

  const action = { type: 'PASS_PRIORITY', player: actor };
  dispatch(action);
  return action;
};

const summarizeState = (state) => ({
  turn: state.turn,
  phase: state.phase,
  priority: state.priority,
  stackResolving: state.stackResolving,
  pendingTargetSelection: state.pendingTargetSelection,
  pendingAction: state.pendingAction && state.pendingAction.type,
  player: {
    life: state.player.life,
    hand: state.player.hand.map((c) => c.name),
    board: state.player.board.map((c) => c.name)
  },
  ai: {
    life: state.ai.life,
    hand: state.ai.hand.map((c) => c.name),
    board: state.ai.board.map((c) => c.name)
  },
  logTail: state.log.slice(-8)
});

const reducer = createGameReducer(effects);

const runGame = (gameIndex, difficulty = 'hard', maxSteps = 4000) => {
  let state = structuredClone(initialState);
  const dispatch = (action) => {
    state = reducer(state, action);
  };

  dispatch({ type: 'START_GAME', mode: 'ai_vs_ai', difficulty });
  let repeatedNoOpCount = 0;

  for (let step = 0; step < maxSteps; step++) {
    if (state.winner) {
      return { ok: true, winner: state.winner, steps: step, state };
    }

    if (state.pendingTargetSelection) {
      return {
        ok: false,
        reason: 'unexpected pending target selection',
        steps: step,
        gameIndex,
        state: summarizeState(state)
      };
    }

    if (state.stackResolving && !state.pendingAction) {
      dispatch({ type: 'RESOLVE_TOP_STACK' });
      continue;
    }

    if (state.pendingAction) {
      const before = JSON.stringify(summarizeState(state));
      resolveAiPendingAction(state, dispatch);
      const after = JSON.stringify(summarizeState(state));
      repeatedNoOpCount = before === after ? repeatedNoOpCount + 1 : 0;
      if (repeatedNoOpCount >= 20) {
        return {
          ok: false,
          reason: 'pending action no-op loop',
          steps: step,
          gameIndex,
          state: summarizeState(state)
        };
      }
      continue;
    }

    if (state.priority) {
      const before = JSON.stringify(summarizeState(state));
      const attemptedAction = takeAiAction(state, dispatch, state.priority);
      const after = JSON.stringify(summarizeState(state));
      repeatedNoOpCount = before === after ? repeatedNoOpCount + 1 : 0;
      if (repeatedNoOpCount >= 20) {
        return {
          ok: false,
          reason: 'ai action no-op loop',
          steps: step,
          gameIndex,
          attemptedAction,
          state: summarizeState(state)
        };
      }
      continue;
    }

    return {
      ok: false,
      reason: 'no priority and not resolving',
      steps: step,
      gameIndex,
      state: summarizeState(state)
    };
  }

  return {
    ok: false,
    reason: 'step limit reached',
    steps: maxSteps,
    gameIndex,
    state: summarizeState(state)
  };
};

const totalGames = Number(process.argv[2] || 200);
const failures = [];
const winners = { player: 0, ai: 0 };

for (let i = 0; i < totalGames; i++) {
  const result = runGame(i + 1);
  if (!result.ok) {
    failures.push(result);
    console.log(`failure in game ${result.gameIndex}: ${result.reason}`);
    if (result.attemptedAction) {
      console.log(`attempted action: ${JSON.stringify(result.attemptedAction)}`);
    }
    console.log(JSON.stringify(result.state, null, 2));
    break;
  }
  winners[result.winner] += 1;
}

console.log(JSON.stringify({
  totalGames,
  completed: winners.player + winners.ai,
  winners,
  failures: failures.length
}, null, 2));

if (failures.length > 0) {
  process.exit(1);
}
