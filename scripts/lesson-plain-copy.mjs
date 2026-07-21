/**
 * Super simple copy — written so a 6-year-old (or total beginner) can follow.
 * Each exhibit: what (1–2 sentences), steps (how to use the page), goal, quiz.
 */
export const PLAIN = {
  "the-neuron": {
    what: "A neuron is like a tiny brain cell. It adds up numbers and decides how loud to answer.",
    steps: [
      "Scroll to the toy below.",
      "Move the sliders that say Input, Weight, and Bias.",
      "Watch the big circle — green means it is shouting loud!",
    ],
    plainGoal: "Make the output number go above 0.85.",
    whyItMatters: "Big AI is made of lots of these tiny cells.",
    traps: { silent: "Too quiet! Move the Weight or Bias sliders up." },
    quiz: {
      predict: "If all Weight sliders are at zero, can the inputs still change the answer?",
      manipulate: "Move the sliders until the output is above 0.5.",
      explain: "What does the Bias slider do?",
    },
  },
  activations: {
    what: "After adding numbers, the neuron bends the answer with a curve. That bend is called an activation.",
    steps: [
      "Pick a curve: sigmoid, ReLU, or tanh.",
      "Move the z slider left and right.",
      "Watch how the curve changes the output number.",
    ],
    plainGoal: "Try all three curves at least once.",
    whyItMatters: "Without curves, stacking layers would not help.",
    traps: { dead: "ReLU went quiet — try a positive z value." },
    quiz: {
      predict: "Can straight lines alone learn tricky patterns?",
      manipulate: "Pick ReLU and make the output bigger than zero.",
      explain: "Why do we use curves instead of straight lines?",
    },
  },
  "layers-and-forward": {
    what: "Data walks through the network one room at a time. Each room changes the numbers a little.",
    steps: [
      "Press Play or drag the timeline slider.",
      "Watch the numbers change at each layer.",
      "Go from start to finish without skipping.",
    ],
    plainGoal: "Scrub through the whole animation once.",
    whyItMatters: "This is how AI answers a question — data walks forward.",
    quiz: {
      predict: "When the network is just answering (not learning), do weights change?",
      manipulate: "Play through until you see the final output.",
      explain: "What happens in each layer?",
    },
  },
  "loss-functions": {
    what: "Loss is a score for how wrong the guess was. Lower is better — like fewer points in mini golf.",
    steps: [
      "Move the prediction slider.",
      "Watch the loss number go up or down.",
      "Try to make the loss as small as you can.",
    ],
    plainGoal: "Get the loss below 0.05.",
    whyItMatters: "The network needs a score to know if it is getting better.",
    quiz: {
      predict: "If the guess is perfect, is the loss zero?",
      manipulate: "Make the MSE loss go below 0.1.",
      explain: "What does the loss number tell us?",
    },
  },
  "gradient-descent": {
    what: "Learning is like walking downhill in fog. Each step goes toward lower loss — a better answer.",
    steps: [
      "Pick a hill shape.",
      "Press Step to walk downhill.",
      "Watch the dot move toward the bottom.",
    ],
    plainGoal: "Take enough steps that the loss gets very small.",
    whyItMatters: "Every trained AI found its weights by walking downhill.",
    quiz: {
      predict: "Does the gradient point uphill or downhill?",
      manipulate: "Take at least 3 steps.",
      explain: "Which way do we step to improve?",
    },
  },
  backpropagation: {
    what: "When the answer is wrong, blame travels backward. Each connection learns how much it messed up.",
    steps: [
      "Scrub through the timeline.",
      "Watch red flow from the output back.",
      "See which connections get the most blame.",
    ],
    plainGoal: "Scrub through all the backprop steps.",
    whyItMatters: "This is how the network knows which knob to turn.",
    quiz: {
      predict: "When ChatGPT talks to you, does backprop run?",
      manipulate: "Complete all the backprop steps.",
      explain: "What is flowing backward?",
    },
  },
  "loss-and-training": {
    what: "Training is a loop: guess, score, blame, fix. Do it again and again and the network gets smarter.",
    steps: [
      "Press Train.",
      "Watch the accuracy number go up.",
      "Keep training until it hits 100%.",
    ],
    plainGoal: "Train until the network solves the puzzle.",
    whyItMatters: "This loop built ChatGPT and every other neural network.",
    quiz: {
      predict: "Can a super simple network solve the XOR puzzle alone?",
      manipulate: "Run at least 5 training steps.",
      explain: "Why do we need hidden layers?",
    },
  },
  optimization: {
    what: "Some walking strategies are smarter. Momentum and Adam reach the bottom faster than baby steps.",
    steps: [
      "Run SGD, then Momentum, then Adam.",
      "Compare the colored paths.",
      "See which one finds the bottom fastest.",
    ],
    plainGoal: "Try all three walkers.",
    whyItMatters: "Fast walkers train big AI in reasonable time.",
    quiz: {
      predict: "Does Adam use different step sizes for different weights?",
      manipulate: "Run all three optimizers.",
      explain: "Why does momentum help?",
    },
  },
  "learning-rate": {
    what: "Learning rate is step size. Too big = jumping past the answer. Too small = crawling forever.",
    steps: [
      "Try different learning rates.",
      "Watch the loss line on the chart.",
      "Find one where the line goes down smoothly.",
    ],
    plainGoal: "Find a rate where loss drops below 0.1.",
    whyItMatters: "Getting step size wrong breaks training.",
    quiz: {
      predict: "Is a huge learning rate always safe?",
      manipulate: "Find a rate where loss ends below 0.1.",
      explain: "What happens if the step size is too big?",
    },
  },
  overfitting: {
    what: "Sometimes the network memorizes homework but fails the real test. That is overfitting.",
    steps: [
      "Turn up model complexity.",
      "Watch training score vs validation score.",
      "See the gap get bigger — that is memorizing.",
    ],
    plainGoal: "Make the train and validation gap bigger than 0.15.",
    whyItMatters: "Memorizing is why AI fails on new examples.",
    quiz: {
      predict: "Does a bigger model always work better on new data?",
      manipulate: "Increase complexity until the gap is big.",
      explain: "What is overfitting?",
    },
  },
  regularization: {
    what: "Regularization is a gentle push to keep things simple so the network works on new data too.",
    steps: [
      "Move the λ (lambda) slider up.",
      "Watch the weights get smaller.",
      "See the penalty number appear.",
    ],
    plainGoal: "Set λ above 0.1.",
    whyItMatters: "Simple models often work better in the real world.",
    quiz: {
      predict: "Does regularization push weights toward zero?",
      manipulate: "Set λ above 0.1.",
      explain: "Why keep weights small?",
    },
  },
  dropout: {
    what: "Dropout randomly turns off neurons while training — like studying with random pages missing.",
    steps: [
      "Set a dropout rate.",
      "Press resample to turn off random neurons.",
      "Watch gray neurons appear and disappear.",
    ],
    plainGoal: "Set dropout above 0.3 and resample once.",
    whyItMatters: "It stops the network from leaning on one lucky path.",
    quiz: {
      predict: "Is dropout on when the app answers your question?",
      manipulate: "Set dropout above 0.3.",
      explain: "Why turn neurons off on purpose?",
    },
  },
  "batch-normalization": {
    what: "Batch norm keeps numbers in a nice range between layers — not too big, not too tiny.",
    steps: [
      "Mess up the distribution slider.",
      "Toggle batch norm ON.",
      "Watch the numbers snap back to normal.",
    ],
    plainGoal: "Turn batch norm ON.",
    whyItMatters: "Stable numbers make deep networks easier to train.",
    quiz: {
      predict: "Does batch norm usually help training?",
      manipulate: "Turn batch norm on.",
      explain: "What gets normalized?",
    },
  },
  "residual-connections": {
    what: "Skip connections are shortcuts. They let information jump over layers like an express lane.",
    steps: [
      "Turn skips ON and OFF.",
      "Increase depth.",
      "Compare how gradient flow changes.",
    ],
    plainGoal: "Try skips at depth 6 or more.",
    whyItMatters: "Shortcuts helped train very deep networks.",
    quiz: {
      predict: "Do shortcuts help signals reach early layers?",
      manipulate: "Set depth to 8 with skips on.",
      explain: "What does a skip connection do?",
    },
  },
  "convolutional-networks": {
    what: "CNNs slide a small stamp across a picture to find edges and shapes — same stamp everywhere.",
    steps: [
      "Try edge and blur filters.",
      "Switch to custom and change numbers.",
      "Watch the output picture change.",
    ],
    plainGoal: "Try the custom filter.",
    whyItMatters: "This is how AI sees photos and video.",
    quiz: {
      predict: "Is the same filter reused at every spot in the image?",
      manipulate: "Use the custom filter.",
      explain: "What are CNNs best at?",
    },
  },
  "recurrent-networks": {
    what: "RNNs read one piece at a time and remember what came before — like reading a sentence word by word.",
    steps: [
      "Scrub through time steps.",
      "Watch memory (hidden state) change.",
      "Go to the last step.",
    ],
    plainGoal: "Scrub to the final timestep.",
    whyItMatters: "Used for speech and old language models.",
    quiz: {
      predict: "Does an RNN reuse the same weights at each step?",
      manipulate: "Scrub to the final step.",
      explain: "What does memory carry?",
    },
  },
  embeddings: {
    what: "Words become dots on a map. Similar words sit close together.",
    steps: [
      "Drag words around the map.",
      "Watch similarity scores change.",
      "Find two words that score above 0.7.",
    ],
    plainGoal: "Find two words with similarity above 0.7.",
    whyItMatters: "ChatGPT turns words into numbers this way.",
    quiz: {
      predict: "Are word positions learned from data?",
      manipulate: "Find similarity above 0.7.",
      explain: "What do embeddings capture?",
    },
  },
  attention: {
    what: "Attention is picking which words to look at. Not every word matters equally.",
    steps: [
      "Click different query words.",
      "Watch the highlight bars change.",
      "Find one word that gets more than half the attention.",
    ],
    plainGoal: "Get more than 50% attention on one word.",
    whyItMatters: "Attention is the heart of ChatGPT-style models.",
    quiz: {
      predict: "Do attention bars always add up to 100%?",
      manipulate: "Get max attention above 0.5.",
      explain: "What is attention doing?",
    },
  },
  transformers: {
    what: "Transformers let every word look at every other word at once. That is how ChatGPT works.",
    steps: [
      "Scrub through the blocks.",
      "Watch data move layer by layer.",
      "Reach the last block.",
    ],
    plainGoal: "Scrub through all blocks once.",
    whyItMatters: "GPT, Claude, and Gemini are all transformers.",
    quiz: {
      predict: "Can transformers look at all words at the same time?",
      manipulate: "Scrub to the final block.",
      explain: "What does self-attention let each word do?",
    },
  },
  "modern-architectures": {
    what: "AI designs got better over time: simple layers, then vision nets, then language transformers.",
    steps: [
      "Click each architecture card.",
      "Read what problem it solved.",
      "View all five cards.",
    ],
    plainGoal: "Look at all five architecture cards.",
    whyItMatters: "Each jump unlocked harder problems.",
    quiz: {
      predict: "Does GPT read words one-by-one like an RNN?",
      manipulate: "View all five cards.",
      explain: "What kind of model is GPT?",
    },
  },
};

export const PLAIN_QUIZ_CHOICES = {
  "the-neuron": {
    explain: [
      { id: "a", text: "It gives a head start before counting inputs." },
      { id: "b", text: "It multiplies each input." },
      { id: "c", text: "It replaces the circle." },
    ],
  },
  activations: {
    explain: [
      { id: "a", text: "Curves let the network learn tricky patterns." },
      { id: "b", text: "Straight lines are always enough." },
      { id: "c", text: "Curves are just for decoration." },
    ],
  },
  "gradient-descent": {
    explain: [
      { id: "a", text: "We step opposite the uphill direction — downhill." },
      { id: "b", text: "We step toward the highest point." },
      { id: "c", text: "We jump randomly." },
    ],
  },
  "loss-functions": {
    explain: [
      { id: "a", text: "It says how wrong the guess was." },
      { id: "b", text: "It is the final answer." },
      { id: "c", text: "It counts how many layers we have." },
    ],
  },
};
