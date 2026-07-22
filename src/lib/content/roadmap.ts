/** Curriculum roadmap — one year of classical ML → neural nets. */

export type RoadmapPhase = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
};

export type RoadmapTopic = {
  id: string;
  phaseId: string;
  title: string;
  kind: "concept" | "model";
  tagline: string;
  body: string;
  /** Short memorable equation or rule — keep it human, not textbook. */
  formula?: string;
  /** What this model is good for, and why — models only. */
  goodFor?: string;
  takeaways: string[];
};

export type VocabEntry = {
  term: string;
  definition: string;
  related?: string;
};

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "foundations",
    index: "01",
    title: "Foundations",
    kicker: "How learning works",
    summary:
      "Core ideas first: labels, mistakes, splitting data, and why training score isn’t everything.",
  },
  {
    id: "models",
    index: "02",
    title: "Classical models",
    kicker: "The toolbox",
    summary:
      "The models you learned in order — lines, probabilities, neighbors, clusters, trees, then neural nets.",
  },
  {
    id: "vocabulary",
    index: "03",
    title: "Vocabulary",
    kicker: "Words that stuck",
    summary:
      "Key terms from the year — weights, vectors, loss, and the rest.",
  },
];

export const ROADMAP_TOPICS: RoadmapTopic[] = [
  // ── Foundations ──
  {
    id: "supervised",
    phaseId: "foundations",
    title: "Supervised learning",
    kind: "concept",
    tagline: "Learn from examples that already have answers.",
    body: "You give the model inputs and the correct labels. It learns the pattern, then guesses labels for new inputs. Predicting a number is regression. Picking a category is classification. The label is the teacher — after each guess, you know how wrong it was.",
    takeaways: [
      "Needs labeled data.",
      "Judge success on new examples, not just training ones.",
      "Bad labels teach the model the wrong thing.",
    ],
  },
  {
    id: "unsupervised",
    phaseId: "foundations",
    title: "Unsupervised learning",
    kind: "concept",
    tagline: "No labels — find structure in the data.",
    body: "You only have inputs. The algorithm looks for groups or patterns on its own — like sorting people into segments. There’s no single “correct” answer while training. You check if the groups make sense or help a later job.",
    takeaways: [
      "Used for clustering and finding patterns.",
      "Success is often “is this useful?” not one accuracy number.",
      "Good for exploring data before supervised learning.",
    ],
  },
  {
    id: "bias-variance",
    phaseId: "foundations",
    title: "Bias–variance tradeoff",
    kind: "concept",
    tagline: "Too simple misses the pattern. Too flexible fits noise.",
    body: "High bias means the model is too stiff — like forcing a straight line on a curve. High variance means it changes a lot when the training data changes a little — it memorizes quirks. You want the middle: flexible enough to learn the real pattern, stable enough to ignore noise.",
    formula: "error ≈ (too simple) + (too wiggly) + (noise)",
    takeaways: [
      "Simple models → more bias, less variance.",
      "Complex models → less bias, more variance.",
      "Validation data shows which side you’re on.",
    ],
  },
  {
    id: "overfit-underfit",
    phaseId: "foundations",
    title: "Overfitting & underfitting",
    kind: "concept",
    tagline: "Memorizing homework vs missing the lesson.",
    body: "Underfitting: bad on train and bad on new data — the model never learned enough. Overfitting: great on train, weak on new data — it memorized quirks. Fix underfit with a stronger model or more training. Fix overfit with more data, simpler models, early stopping, or regularization.",
    takeaways: [
      "Compare train score vs validation score.",
      "Train great + validation poor = overfitting.",
      "Both poor = underfitting.",
    ],
  },
  {
    id: "train-test",
    phaseId: "foundations",
    title: "Train / validation / test",
    kind: "concept",
    tagline: "Practice, tune, then take the final exam.",
    body: "Don’t grade yourself on the same problems you studied. A common split is 80% train and 20% held out. Train is where the model learns. Validation is where you try settings like depth or learning rate. Test is sealed — open it once to report real performance. Looking at test early is cheating.",
    formula: "80% train · 20% test",
    takeaways: [
      "Never train on the test set.",
      "Keep the same split for every experiment.",
      "For time data, split by time — don’t mix future into past.",
    ],
  },
  {
    id: "features-loss",
    phaseId: "foundations",
    title: "Features, loss & optimization",
    kind: "concept",
    tagline: "Inputs in. Mistake score. Then improve.",
    body: "Features are the numbers the model sees. Loss is one score for “how wrong was that?” Optimization nudges the model’s knobs (weights) so loss goes down. Most ML is this loop: pick features → pick a loss → search for better weights.",
    formula: "new weights ← old weights − step × fix direction",
    takeaways: [
      "Scale features when distance or gradients matter.",
      "Different losses care about different mistakes.",
      "Learning rate = how big each update is.",
    ],
  },

  // ── Models ──
  {
    id: "linear-regression",
    phaseId: "models",
    title: "Linear regression",
    kind: "model",
    tagline: "Fit a straight line to predict a number.",
    body: "You predict a number with a line. One feature: y = mx + b. Slope m says how y changes with x. Bias b is the starting offset. With more features, each one gets a weight, then you add them up plus bias. Training finds the line that misses real answers the least.",
    formula: "y = mx + b",
    goodFor:
      "Predicting continuous values when the trend is roughly linear — house prices, sales, temperature. Why: it’s fast, easy to explain, and each weight tells you how a feature pushes the answer up or down.",
    takeaways: [
      "Best when relationships look roughly straight.",
      "Outliers can pull the line off course.",
      "Great baseline before trying harder models.",
    ],
  },
  {
    id: "logistic-regression",
    phaseId: "models",
    title: "Logistic regression",
    kind: "model",
    tagline: "Same linear score — turned into a probability.",
    body: "This is for yes/no (or multi-class) problems, not continuous numbers. Compute a weighted sum of features plus bias, then squash it with a sigmoid so the output is between 0 and 1. Training pushes that probability toward the right class. The cut between classes is still a straight line in feature space.",
    formula: "score = w · x + b  →  probability = sigmoid(score)",
    goodFor:
      "Binary classification with a probability — spam vs not, click vs no click, pass vs fail. Why: you get a clear score between 0 and 1, it’s fast to train, and it’s a strong simple baseline before trees or neural nets.",
    takeaways: [
      "Use when you need P(yes), not just a hard label.",
      "Works best when classes can be split with a line.",
      "Easy to ship and interpret.",
    ],
  },
  {
    id: "svm",
    phaseId: "models",
    title: "Support vector machines",
    kind: "model",
    tagline: "Draw the widest gap between classes.",
    body: "SVM finds a boundary with the biggest empty margin between classes. Only the closest points (support vectors) really matter. If a straight cut isn’t enough, kernels let the model bend the boundary. Soft margins allow a few mistakes so one noisy point doesn’t ruin everything.",
    formula: "maximize the margin · allow a few mistakes",
    goodFor:
      "Classification when classes have a clear gap — especially with many features and medium-sized data (text, images with hand features). Why: maximizing the margin makes the boundary more stable, and kernels handle curved separations without you hand-building fancy features.",
    takeaways: [
      "Strong when feature count is high and data is scaled.",
      "Kernels help when a straight cut isn’t enough.",
      "Can get slow on very large datasets.",
    ],
  },
  {
    id: "knn",
    phaseId: "models",
    title: "k-nearest neighbors",
    kind: "model",
    tagline: "Ask the k closest examples.",
    body: "KNN stores the data instead of learning a big formula. For a new point, find the k nearest training examples and let them vote (or average). Small k = local and wiggly. Large k = smoother. Distance only works well if features are on similar scales.",
    formula: "k nearest neighbors → vote (or average)",
    goodFor:
      "Simple classification or regression when similar examples should have similar answers — recommendations, basic image labels, local patterns. Why: no heavy training step, and the rule is obvious: nearby points decide. Needs good features and scaling.",
    takeaways: [
      "Great when “near” really means “alike.”",
      "Scale features or distance lies to you.",
      "Prediction can be slow on huge datasets.",
    ],
  },
  {
    id: "kmeans",
    phaseId: "models",
    title: "k-means clustering",
    kind: "model",
    tagline: "Make k groups around k centers.",
    body: "No labels. You pick k. Put k centers in the space. Assign each point to the nearest center. Move each center to the average of its points. Repeat until it settles. Best when clusters are roughly round. Weird shapes or outliers can confuse it.",
    formula: "assign → update centers → repeat",
    goodFor:
      "Finding groups without labels — customer segments, topic buckets, image color groups. Why: it’s fast and clear when natural blobs exist. Not for odd ring-shaped clusters or when you already have labels to predict.",
    takeaways: [
      "Use for exploration and segmentation.",
      "Scale features — distance is everything.",
      "Choosing k takes judgment (and plots).",
    ],
  },
  {
    id: "decision-trees",
    phaseId: "models",
    title: "Decision trees",
    kind: "model",
    tagline: "A flowchart of if / else questions.",
    body: "The tree asks questions like “is age > 30?” and splits data until each leaf is mostly one answer. You can read it as rules. That’s the strength. The weakness: a deep tree overfits easily. Limit depth or prune so it doesn’t memorize.",
    formula: "if feature > threshold → left, else → right",
    goodFor:
      "Problems where you need human-readable rules — medical triage logic, loan checks, business policies. Why: you can follow every decision. Also handles mixed feature types with little prep. Limit depth so it doesn’t memorize.",
    takeaways: [
      "Best when explainability matters.",
      "Little feature prep needed.",
      "One tree alone is often too unstable.",
    ],
  },
  {
    id: "random-forest",
    phaseId: "models",
    title: "Random forest",
    kind: "model",
    tagline: "Many trees vote. Mistakes cancel out.",
    body: "Grow many trees on different random samples of the data. Each split only sees a random subset of features. Then average or majority-vote. One tree overfits. A crowd of different trees usually doesn’t.",
    formula: "many trees → average / majority vote",
    goodFor:
      "Tabular prediction when you want strong accuracy without much tuning — churn, fraud flags, house prices with many columns. Why: averaging many different trees cuts variance, so it overfits less than one tree and works out of the box.",
    takeaways: [
      "Default pick for many spreadsheet-style problems.",
      "More reliable than a single tree.",
      "Harder to read, but feature importance still helps.",
    ],
  },
  {
    id: "gradient-boosting",
    phaseId: "models",
    title: "Gradient boosting",
    kind: "model",
    tagline: "Each new tree fixes leftover mistakes.",
    body: "Trees are added one by one. The next tree focuses on what the current model still gets wrong. Small steps keep it from overreacting. Tools like XGBoost and LightGBM made this a top pick for spreadsheet-style data.",
    formula: "prediction ← prediction + small_step × next_tree",
    goodFor:
      "Winning accuracy on structured/tabular data — rankings, prices, competition-style tables. Why: each tree fixes leftovers, so the model keeps improving on hard examples. Needs more careful tuning than a forest.",
    takeaways: [
      "Often beats random forests on tables.",
      "Worth the tuning when accuracy matters most.",
      "Watch for data leakage in features.",
    ],
  },
  {
    id: "naive-bayes",
    phaseId: "models",
    title: "Naive Bayes",
    kind: "model",
    tagline: "Use probabilities. Pretend features are independent.",
    body: "Ask: given these features, which class is most likely? Bayes’ rule gives the math. The “naive” part: assume features don’t depend on each other given the class. That’s often false — and still works well for text like spam filters. Fast and simple.",
    formula: "P(class | features) ∝ P(class) × P(each feature | class)",
    goodFor:
      "Text classification and other high-dimensional sparse data — spam filters, topic tags, quick baselines. Why: it’s extremely fast, needs little data prep, and the independence assumption is “wrong but useful” for bag-of-words features.",
    takeaways: [
      "Reach for it first on text problems.",
      "Train and predict in a flash.",
      "Trust ranking more than the exact probability %.",
    ],
  },
  {
    id: "neural-networks",
    phaseId: "models",
    title: "Neural networks",
    kind: "model",
    tagline: "Layers of weights that learn patterns.",
    body: "A neuron takes an input vector, multiplies by weights, adds a bias, then applies an activation (like ReLU). Stack neurons into layers and you get a network. Training measures loss, sends the error backward (backprop), and nudges every weight. Same idea behind MLPs, CNNs, and transformers — only the layout changes.",
    formula: "output = activation(weight · input + bias)",
    goodFor:
      "Complex patterns with lots of data — images, speech, language, and hard nonlinear tabular problems. Why: layers learn useful features automatically (edges → shapes → objects), and nonlinear activations let the model fit curves plain lines can’t. Needs more data and compute than classical models.",
    takeaways: [
      "Use when the pattern is too rich for a line or shallow tree.",
      "Weight = importance. Bias = baseline. Activation = nonlinearity.",
      "Scale well with data, compute, and regularization.",
    ],
  },
];


export const ROADMAP_VOCAB: VocabEntry[] = [
  {
    term: "Weight",
    definition:
      "How strongly an input affects the output. Bigger weight = louder voice.",
    related: "Bias",
  },
  {
    term: "Bias (parameter)",
    definition:
      "An offset added after the weighted sum — the starting baseline. Not the same as biased data.",
    related: "Weight",
  },
  {
    term: "Vector",
    definition:
      "A list of numbers in order — a row of features, or values inside a layer.",
  },
  {
    term: "Gradient descent",
    definition:
      "Nudge weights opposite the direction that increases loss. Walk downhill on the error.",
    related: "Learning rate",
  },
  {
    term: "Learning rate",
    definition:
      "How big each nudge is. Too big overshoots. Too small crawls.",
  },
  {
    term: "Loss",
    definition:
      "One number for “how wrong was this?” Training means making it smaller.",
  },
  {
    term: "Regularization",
    definition:
      "Stops memorizing — smaller weights, dropout, early stopping, more data.",
    related: "Overfitting",
  },
  {
    term: "Cross-validation",
    definition:
      "Rotate which slice is validation so one lucky split doesn’t fool you.",
  },
  {
    term: "Confusion matrix",
    definition:
      "Table of predicted vs true labels — shows which classes get mixed up.",
  },
  {
    term: "Precision / recall",
    definition:
      "Precision: when it says yes, how often is it right? Recall: of all real yes cases, how many did it catch?",
  },
  {
    term: "ROC / AUC",
    definition:
      "How well scores rank positives vs negatives as you move the threshold. Higher AUC is better.",
  },
  {
    term: "One-hot encoding",
    definition:
      "Turn a category (red / green / blue) into 0/1 columns the model can use.",
  },
  {
    term: "Feature scaling",
    definition:
      "Put features on similar ranges so one column doesn’t dominate.",
  },
  {
    term: "Hyperparameter",
    definition:
      "A setting you choose before training — tree depth, k, learning rate — not a learned weight.",
  },
  {
    term: "Embedding",
    definition:
      "A learned vector for a word or item so similar things sit near each other.",
  },
  {
    term: "Backpropagation",
    definition:
      "Send the error backward through the net so every weight knows how to improve.",
  },
  {
    term: "Activation function",
    definition:
      "The nonlinearity after weight · input + bias (ReLU, sigmoid…). Without it, deep nets act like one linear model.",
  },
  {
    term: "Epoch / batch",
    definition:
      "Epoch = one full pass over training data. Batch = the chunk used for one update.",
  },
  {
    term: "Kernel",
    definition:
      "A similarity trick that lets models like SVMs draw curved boundaries.",
  },
  {
    term: "Ensemble",
    definition:
      "Combine several models (vote or average) so mistakes cancel out.",
  },
  {
    term: "Overfitting",
    definition:
      "Memorized training quirks. Strong on train, weak on new data.",
  },
  {
    term: "Underfitting",
    definition:
      "Too weak or under-trained. Bad on train and on new data.",
  },
];

export function topicsForPhase(phaseId: string): RoadmapTopic[] {
  return ROADMAP_TOPICS.filter((t) => t.phaseId === phaseId);
}
