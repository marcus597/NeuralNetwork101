# Wonder · Neural Network Museum

An interactive science museum for neural networks — 20 exhibits, zero lectures.

## The Pulse (signature experience)

**The one thing no other site has:** a single living cycle where cyan **signal** races forward, crimson **blame** rushes backward on the *same wires*, and the network **breathes** as weights update — all on one scrubbable timeline.

Open `/` or `/pulse` and hit **Pulse →**.

## What you can do

Touch everything. Train XOR on the homepage. Scrub through every weight update. Watch gradients flow backward. Compare optimizers. Break a model with overfitting, then fix it with dropout. Slide a conv filter across digits. Unroll an RNN through time. Drag word embeddings. Pulse data through a transformer.

## Five wings

| Wing | Exhibits |
|------|----------|
| **Foundations** | Neuron, activations, forward propagation |
| **Learning** | Loss, gradient descent, backprop, training, optimizers, learning rate |
| **Generalization** | Overfitting, regularization, dropout, batch norm |
| **Architecture** | Residual connections, CNNs, RNNs |
| **Language** | Embeddings, attention, transformers, modern architectures |

## Stack

- Next.js 16, TypeScript, Tailwind v4, Motion
- Custom React simulations + SVG network canvas
- Zustand progress, Zod content validation

## Quick start

```bash
npm install
npm run generate:lessons   # regenerate 20 exhibit JSON files
npm run dev
```

## Verify

```bash
npm run check:full
```

## Architecture

```
content/lessons/          20 exhibit JSON files
scripts/generate-nn-course.mjs
src/components/neural/    20 interactive labs
src/components/experience/ NetworkCanvas, FrameScrubber
src/lib/nn/               Math, loss, surfaces, conv, sequence
```
