<template>
  <div>
<pre>
correct: {{correct}}
difficulty: {{newDifficulty}}
difficultyWeight: {{difficultyWeight}}

percentOverdue: {{percentOverdue}}
daysBetweenReviews: {{newDaysBetweenReviews}}
dateLastReviewed: {{newDateLastReviewed}}
performaceRating: {{performanceRating}}
</pre>

  <a class="button" @click="reset()">reset</a> 

  <a class="button" @click="spaced('soon')">Soon</a>
  <a class="button" @click="spaced('good')">Good</a>
  <a class="button" @click="spaced('easy')">Easy</a>
  </div>
</template>

<script>
/*
SM2+ Algorithm from http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2

For each review-item, store the following data:
difficulty as float from 0.0 to 1.0 (defaults to 0.3) --> high = difficult (value will be 1 if soon clicked)

daysBetweenReviews as float - how many days should occur between review attemps for this item
dateLastReviewed as dateTime - the last time this item was reviewed

Review item length = 10 to 20 items ordered by desc. percentageOverdue
(ignoring items in the past 8 hours)

performaceRating picked by the user 0.0 to 1.0 with 1.0 being the best.
Set a cut-off point for the answer being "correct" (default is 0.6).

Then set 

if correct:
  percentOverdue = Min(2, days(dateNow-dateLastReviewed) / daysBetweenReviews)

if incorrect:
  percentOverdue = 1

difficulty += percentOverdue * 1/17(8-9 *performaceRating), clamp to [0, 1]

difficultyWeight = 3 * 1.7 * difficulty

if correct:
  daysBetweenReviews *= 1 + (difficultyWeight - 1) * percentOverdue

if incorrect:
  daysBetweenReviews *= 1/difficultyWeight^2 (min days = 1) 

- max new cards per day limit e.g. 20 --> not implemented
- max reviews per day e.g. 100 --> needs testing - review count not stored yet

*/

import moment from 'moment';

import {SPACED_REPETITION_DEFAULT, PERFORMANCE_CUTOFF, WORST, GOOD, BEST} from './spacedrepetition-constants'

export default {
  props: {
    difficulty: {
      type: Number,
      default: SPACED_REPETITION_DEFAULT.difficulty // 0.3
    },
    daysBetweenReviews: {
      type: Number,
      default: SPACED_REPETITION_DEFAULT.daysBetweenReviews // 1
    },
    dateLastReviewed: {
      type: String,
      default: SPACED_REPETITION_DEFAULT.dateLastReviewed 
      // function() {
      //   return moment();
      // }
    }
  },
  computed: {
    correct() { // in repo https://github.com/lo-tp/sm2-plus/blob/master/source/src/index.js it is compared to WORST = performaceRating = 0
      return (this.performanceRating > PERFORMANCE_CUTOFF); // correct if > 0.6
    },
    percentOverdue() {
      // calculate percentageOverdue = (today - word.lastReviewed) / word.timeBetween;
      let durationLastReviewed = moment.unix(this.newDateLastReviewed).days();

      console.log('percentOverdue', Math.min(2, moment().utc().subtract(durationLastReviewed, 'days').days() / this.newDaysBetweenReviews), durationLastReviewed, this.newDaysBetweenReviews);
      if (this.correct) {
        return Math.min(2, moment().utc().subtract(durationLastReviewed, 'days').days() / this.newDaysBetweenReviews);
      } 
      else {
        return 1;
      }
    },
    difficultyWeight() {
      return 3 * 1.7 * this.newDifficulty;
    }
  },
  methods: {
    reset() {
      // just for testing --> removed later
      Object.assign(this, { 
        performanceRating: 0,
        newDifficulty: this.difficulty,
        newDaysBetweenReviews: this.daysBetweenReviews,
        newDateLastReviewed: this.dateLastReviewed
      });
    },
    spaced(rating) {
      const mapping = { // just for different naming in template soon, good, easy
        soon: WORST,
        good: GOOD,
        easy: BEST
      };

      this.performaceRating = mapping[rating];

      console.log('rating', this.performaceRating);

      this.$nextTick(() => { // delay to next digest --> correct value calculated
        this.calcDifficulty();
        this.calcDaysBetweenReviews();
        let newDateLastReviewed = moment().utc().format('x');
        console.log('new date', newDateLastReviewed)
        console.log('spaced review date', this.newDateLastReviewed);
        this.$emit('selected', {
          daysBetweenReviews: this.newDaysBetweenReviews,
          //dueDate: newDateLastReviewed + this.newDaysBetweenReviews, //today + interval --> not needed percentOverdue should be enough
          difficulty: this.newDifficulty,
          dateLastReviewed: newDateLastReviewed,
          percentOverdue: this.percentOverdue
        });
      });
    },
    calcDaysBetweenReviews() {
      if(this.correct) {
        this.newDaysBetweenReviews *= 1 + (this.difficultyWeight - 1) * this.percentOverdue
      } else {
        this.newcalcDaysBetweenReviews *= 1/(this.difficultyWeight^2)  // (min days = 1) 
        if ( this.newCalcDaysBetweenReviews < 1 ) {
          this.newCalcDaysBetweenReviews = 1;
        }
      }
      console.log('calculated days between', this.newDaysBetweenReviews);
    },
    calcDifficulty() {
      //difficulty += percentOverdue * 1/17(8-9 *performaceRating), clamp to [0, 1]
      this.newDifficulty += this.percentOverdue * 1 / 17 * ( 8 - 9 * this.performanceRating);

      // limiting to [0,1]
      if (this.newDifficulty < 0) {
        this.newDifficulty = 0;
      }
      if (this.newDifficulty > 1) {
        this.newDifficulty = 1;
      }
    }
  },
  data() {
    return {
      performanceRating: 0,
      // new values are created later
      newDifficulty: this.difficulty,
      newDaysBetweenReviews: 1,
      newDateLastReviewed: 0
    };
  }
}
</script>