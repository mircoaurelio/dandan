import { parentPort, workerData } from 'node:worker_threads';

const DANDAN = 'Dandan';

const difficulties = {
  easy: { aggression: 0.7, control: 0.2, drawBias: 0.25, mistakeRate: 0.35, landLimit: 3.6, counterBias: 0.45, stealBias: 0.55, attackBias: 0.75, blockBias: 0.7 },
  medium: { aggression: 1.0, control: 0.5, drawBias: 0.5, mistakeRate: 0.12, landLimit: 4.2, counterBias: 0.9, stealBias: 0.95, attackBias: 0.95, blockBias: 0.95 },
  hard: { aggression: 1.15, control: 0.85, drawBias: 0.65, mistakeRate: 0.03, landLimit: 4.8, counterBias: 1.1, stealBias: 1.1, attackBias: 1.05, blockBias: 1.05 }
};

const random = () => Math.random();
const pickDifficulty = (difficulty, weights = null) => {
  const base = difficulties[difficulty] || difficulties.medium;
  if (!weights) return base;
  return {
    aggression: weights.aggression ?? base.aggression,
    control: weights.control ?? base.control,
    drawBias: weights.drawBias ?? base.drawBias,
    mistakeRate: weights.mistakeRate ?? base.mistakeRate,
    landLimit: weights.landLimit ?? base.landLimit,
    counterBias: weights.counterBias ?? base.counterBias,
    stealBias: weights.stealBias ?? base.stealBias,
    attackBias: weights.attackBias ?? base.attackBias,
    blockBias: weights.blockBias ?? base.blockBias
  };
};

const simulateOneGame = ({ playerDifficulty, aiDifficulty, playerWeights, aiWeights }) => {
  const player = { life: 20, cards: 7, lands: 0, dandans: 0, tempo: 0, extraTurns: 0, counters: 0 };
  const ai = { life: 20, cards: 7, lands: 0, dandans: 0, tempo: 0, extraTurns: 0, counters: 0 };
  const playerPolicy = pickDifficulty(playerDifficulty, playerWeights);
  const aiPolicy = pickDifficulty(aiDifficulty, aiWeights);
  let turn = 'player';

  for (let step = 0; step < 120; step++) {
    const actor = turn === 'player' ? player : ai;
    const defender = turn === 'player' ? ai : player;
    const policy = turn === 'player' ? playerPolicy : aiPolicy;
    const defenderPolicy = turn === 'player' ? aiPolicy : playerPolicy;

    actor.cards += 1;
    if (actor.lands < Math.round(policy.landLimit + 1) && random() > policy.mistakeRate * 0.6) actor.lands += 1;

    const mana = actor.lands;
    if (mana >= 2 && actor.dandans < 2 && random() < 0.45 * policy.aggression) {
      actor.dandans += 1;
      actor.cards -= 1;
      actor.tempo += 2;
    }

    if (mana >= 2 && random() < 0.25 * policy.drawBias) {
      actor.cards += 1;
      actor.tempo += 1;
    }

    if (mana >= 4 && defender.dandans > 0 && random() < 0.18 * policy.control * policy.stealBias) {
      defender.dandans -= 1;
      actor.dandans += 1;
      actor.tempo += 3;
    }

    if (mana >= 2 && defender.dandans > 0 && random() < 0.22 * policy.control * policy.counterBias) {
      defender.dandans = Math.max(0, defender.dandans - 1);
      actor.tempo += 2;
    }

    const effectiveBlocks = random() < defender.mistakeRate ? 0 : Math.min(defender.dandans * defenderPolicy.blockBias, actor.dandans * policy.attackBias);
    const attacks = Math.max(0, actor.dandans * policy.attackBias - effectiveBlocks);
    if (attacks > 0) {
      defender.life -= Math.ceil(attacks) * 4;
      actor.tempo += Math.ceil(attacks) * 2;
    }

    if (mana >= 5 && random() < 0.08 * policy.control) {
      actor.extraTurns += 1;
      actor.tempo += 2;
    }

    if (defender.life <= 0 || actor.life <= 0) break;

    if (actor.extraTurns > 0) actor.extraTurns -= 1;
    else turn = turn === 'player' ? 'ai' : 'player';
  }

  const playerScore = (20 - ai.life) + player.cards * 0.7 + player.lands * 0.4 + player.dandans * 2.5 + player.tempo;
  const aiScore = (20 - player.life) + ai.cards * 0.7 + ai.lands * 0.4 + ai.dandans * 2.5 + ai.tempo;
  const winner = player.life === ai.life ? (playerScore >= aiScore ? 'player' : 'ai') : (player.life > ai.life ? 'player' : 'ai');

  return {
    winner,
    playerScore,
    aiScore,
    margin: Math.abs(playerScore - aiScore)
  };
};

const runBatch = () => {
  const { games, playerDifficulty, aiDifficulty, playerWeights, aiWeights } = workerData;
  const results = { games: 0, playerWins: 0, aiWins: 0, totalMargin: 0 };

  for (let i = 0; i < games; i++) {
    const result = simulateOneGame({ playerDifficulty, aiDifficulty, playerWeights, aiWeights });
    results.games += 1;
    results.totalMargin += result.margin;
    if (result.winner === 'player') results.playerWins += 1;
    else results.aiWins += 1;
  }

  parentPort.postMessage(results);
};

runBatch();
