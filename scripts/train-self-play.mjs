import fs from 'node:fs';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerPath = path.join(__dirname, 'selfplay-worker.mjs');
const outputDir = path.join(__dirname, '..', 'training-output');
const policyModulePath = path.join(__dirname, '..', 'src', 'trainedPolicy.ts');
const args = process.argv.slice(2);

const getArg = (name, fallback) => {
  const idx = args.indexOf(name);
  if (idx === -1 || idx === args.length - 1) return fallback;
  return args[idx + 1];
};

const totalGames = Number(getArg('--games', 200));
const concurrency = Number(getArg('--concurrency', 4));
const generations = Number(getArg('--generations', 10));
const population = Number(getArg('--population', 6));

const baseWeights = {
  aggression: 1.1,
  control: 0.9,
  drawBias: 0.7,
  mistakeRate: 0.04,
  landLimit: 4.6,
  counterBias: 1.0,
  stealBias: 1.0,
  attackBias: 1.0,
  blockBias: 1.0
};

const mutateWeights = (weights) => ({
  aggression: Math.max(0.2, weights.aggression + (Math.random() - 0.5) * 0.24),
  control: Math.max(0.1, weights.control + (Math.random() - 0.5) * 0.24),
  drawBias: Math.max(0.1, weights.drawBias + (Math.random() - 0.5) * 0.18),
  mistakeRate: Math.min(0.4, Math.max(0.0, weights.mistakeRate + (Math.random() - 0.5) * 0.03)),
  landLimit: Math.min(6, Math.max(2.5, weights.landLimit + (Math.random() - 0.5) * 0.5)),
  counterBias: Math.min(1.8, Math.max(0.2, weights.counterBias + (Math.random() - 0.5) * 0.22)),
  stealBias: Math.min(1.8, Math.max(0.2, weights.stealBias + (Math.random() - 0.5) * 0.22)),
  attackBias: Math.min(1.8, Math.max(0.2, weights.attackBias + (Math.random() - 0.5) * 0.22)),
  blockBias: Math.min(1.8, Math.max(0.2, weights.blockBias + (Math.random() - 0.5) * 0.22))
});

const runWorker = (games, playerDifficulty, aiDifficulty, playerWeights, aiWeights) =>
  new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, {
      workerData: { games, playerDifficulty, aiDifficulty, playerWeights, aiWeights }
    });
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker exited with ${code}`));
    });
  });

const runParallelMatch = async (games, playerDifficulty, aiDifficulty, playerWeights, aiWeights) => {
  const perWorker = Math.ceil(games / concurrency);
  const tasks = Array.from({ length: concurrency }, (_, index) => {
    const remaining = games - index * perWorker;
    return remaining > 0 ? runWorker(Math.min(perWorker, remaining), playerDifficulty, aiDifficulty, playerWeights, aiWeights) : null;
  }).filter(Boolean);

  const results = await Promise.all(tasks);
  return results.reduce((acc, result) => ({
    games: acc.games + result.games,
    playerWins: acc.playerWins + result.playerWins,
    aiWins: acc.aiWins + result.aiWins,
    totalMargin: acc.totalMargin + result.totalMargin
  }), { games: 0, playerWins: 0, aiWins: 0, totalMargin: 0 });
};

const scoreMatch = (result) => {
  const winRate = result.playerWins / Math.max(1, result.games);
  const avgMargin = result.totalMargin / Math.max(1, result.games);
  return winRate * 1000 + avgMargin;
};

const main = async () => {
  fs.mkdirSync(outputDir, { recursive: true });

  let champion = { ...baseWeights };
  if (fs.existsSync(policyModulePath)) {
    const existingPolicy = fs.readFileSync(policyModulePath, 'utf8');
    const jsonMatch = existingPolicy.match(/export const trainedPolicy = ([\s\S]*);/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      champion = { ...champion, ...(parsed.weights || {}) };
    }
  }

  const history = [];

  for (let generation = 1; generation <= generations; generation++) {
    const challengerPool = Array.from({ length: population }, () => mutateWeights(champion));
    const candidateResults = [];

    for (const challenger of challengerPool) {
      const result = await runParallelMatch(totalGames, 'hard', 'hard', challenger, champion);
      candidateResults.push({
        challenger,
        result,
        winRate: result.playerWins / Math.max(1, result.games)
      });
    }

    candidateResults.sort((a, b) => scoreMatch(b.result) - scoreMatch(a.result));
    const bestCandidate = candidateResults[0];
    const challenger = bestCandidate.challenger;
    const result = bestCandidate.result;
    const winRate = bestCandidate.winRate;

    if (winRate >= 0.53) {
      champion = challenger;
    }

    history.push({
      generation,
      result,
      winRate,
      tested: candidateResults.length,
      champion: { ...champion },
      challenger,
      topCandidates: candidateResults.slice(0, 3).map((item) => ({
        winRate: item.winRate,
        result: item.result,
        challenger: item.challenger
      }))
    });

    console.log(`generation ${generation}: best challenger win rate ${winRate.toFixed(3)} ${winRate >= 0.53 ? 'promoted' : 'rejected'}`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalGames,
    concurrency,
    champion,
    history
  };

  const reportPath = path.join(outputDir, 'selfplay-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(
    policyModulePath,
    `export const trainedPolicy = ${JSON.stringify({
      source: 'selfplay',
      generatedAt: report.generatedAt,
      games: totalGames,
      generations,
      weights: champion
    }, null, 2)};\n`
  );
  console.log(`saved self-play report to ${reportPath}`);
  console.log(`updated trained policy module at ${policyModulePath}`);
  console.log('champion weights:', champion);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
