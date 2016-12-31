import moment from 'moment';

export const SPACED_REPETITION_DEFAULT = {
  difficulty: 0.3,
  daysBetweenReviews: 1,
  percentOverdue: 2.0,
  dateLastReviewed: 0 // 0 = not reviewed yet --> later unix time in ms
  // function() {
  //   return moment().utc().format('x'); // saved in ms as unix timestamp
  // }
};

export const WORST = 0
export const GOOD = 0.6
export const BEST = 1.0

export const PERFORMANCE_CUTOFF = 0.6;

export const PERCENT_OVERDUE_LIMIT = 1.5; // limited to 2.0