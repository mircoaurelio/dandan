# Forgetful Fish Self-Play Experiment

This project now has two layers:

- The browser app in [dandan.ts](C:\Progetti\personal\forgetfullfish\dandan.ts), with `easy`, `medium`, and `hard` AI difficulty.
- A headless self-play lab in [scripts/train-self-play.mjs](C:\Progetti\personal\forgetfullfish\scripts\train-self-play.mjs) and [scripts/selfplay-worker.mjs](C:\Progetti\personal\forgetfullfish\scripts\selfplay-worker.mjs) for running many games in parallel.

## Why this matters

If we want an AlphaGo-style experiment, the core requirement is to separate:

- Fast simulation
- Policy selection
- Training and evaluation

The UI is still the play surface, but the headless scripts are the training surface.

## Difficulty model

- `easy`: slower, more mistakes, weaker control decisions
- `medium`: current heuristic baseline
- `hard`: faster and more score-driven

## Self-play commands

Run a short batch:

```bash
npm run selfplay
```

Run a larger batch:

```bash
npm run selfplay:fast
```

Reports are written to [training-output/selfplay-report.json](C:\Progetti\personal\forgetfullfish\training-output\selfplay-report.json).

## Roadmap toward AlphaGo-style training

1. Extract the full reducer and card logic into a pure shared engine module.
2. Feed the browser AI and headless self-play from the same engine and policy code.
3. Replace the current handcrafted challenger mutation with:
   - value targets from game outcomes
   - policy targets from stronger rollouts
   - periodic league evaluation
4. Add state/action datasets so we can train a neural policy outside the browser.

## Honest caveat

This is not AlphaGo yet. It is the first training architecture step:

- concurrent self-play
- policy mutation
- promotion by win rate
- difficulty tiers in the live app
