export const SPACED_REPETITION_DEFAULT = {
  difficulty: 0.3,
  daysBetweenReviews: 1,
  percentOverdue: 2.0,
  dateLastReviewed: 0 // 0 = not reviewed yet --> later unix time in ms
};

export const WORST = 0
export const GOOD = 0.6
export const BEST = 1.0

export const PREDEFINED_REVIEW_TIMES = { // in minutes
  soon: 1,
  good: 10
};

export const PERFORMANCE_CUTOFF = 0.6;

export const PERCENT_OVERDUE_LIMIT = 1.0; // limited to 2.0
