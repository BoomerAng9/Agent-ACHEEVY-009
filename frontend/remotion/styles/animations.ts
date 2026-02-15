import type { SpringConfig } from "remotion";

export const springPresets: Record<string, SpringConfig> = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
  heavy: { damping: 15, stiffness: 80, mass: 2 },
  popIn: { damping: 12, stiffness: 250 },
  dramatic: { damping: 30, stiffness: 60, mass: 3 },
};
