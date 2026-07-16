export const springSnappy = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
};

export const springSoft = {
  type: "spring" as const,
  stiffness: 300,
  damping: 24,
};

export const easeOut = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: easeOut,
};
