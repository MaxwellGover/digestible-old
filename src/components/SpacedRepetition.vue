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
      type: Number,
      default: SPACED_REPETITION_DEFAULT.dateLastReviewed 
      // function() {
      //   return moment();
      // }
    }
  },
  computed: { 
    percentOverdue() {
      // calculate percentageOverdue = (today - word.lastReviewed) / word.timeBetween;
      // let durationLastReviewed_ms = moment().valueOf() - parseInt(this.dateLastReviewed);
      // if (!this.rated) return; // not rated yet
      
      let durationLastReviewed = moment.duration(moment().valueOf()).subtract(parseInt(this.dateLastReviewed)).days();
      // if (this.correct) {
      // console.log('percentOverdue', Math.min(2, durationLastReviewed / this.daysBetweenReviews));
      return Math.min(2, durationLastReviewed / this.daysBetweenReviews);
      // } else {
      //   console.log('percentOverdue (incorrect)', 1);
      //   return 1;
      // }
      // below with-out moment (also working)
      // console.log('duration', durationLastReviewed_ms, durationLastReviewed_ms / (1000 * 3600 *24) / this.daysBetweenReviews);
      // return Math.min(2, durationLastReviewed_ms / (1000 * 3600 *24) / this.daysBetweenReviews); //result;
    },
    // moved most computed to methods --> we need to ensure the call order
    // correct() { // in repo https://github.com/lo-tp/sm2-plus/blob/master/source/src/index.js it is compared to WORST = performaceRating = 0
    //   return (this.performanceRating > PERFORMANCE_CUTOFF); // correct if > 0.6
    // },
    // percentOverdue() {
    //   // calculate percentageOverdue = (today - word.lastReviewed) / word.timeBetween;
    //   // let durationLastReviewed_ms = moment().valueOf() - parseInt(this.dateLastReviewed);
    //   // if (!this.rated) return; // not rated yet
      
    //   let durationLastReviewed = moment.duration(moment().valueOf()).subtract(parseInt(this.dateLastReviewed)).days();
    //   if (this.correct) {
    //     console.log('percentOverdue', Math.min(2, durationLastReviewed / this.daysBetweenReviews));
    //     return Math.min(2, durationLastReviewed / this.daysBetweenReviews);
    //   } else {
    //     console.log('percentOverdue (incorrect)', 1);
    //     return 1;
    //   }
    //   // below with-out moment (also working)
    //   // console.log('duration', durationLastReviewed_ms, durationLastReviewed_ms / (1000 * 3600 *24) / this.daysBetweenReviews);
    //   // return Math.min(2, durationLastReviewed_ms / (1000 * 3600 *24) / this.daysBetweenReviews); //result;
    // },
    // difficultyWeight() {
    //   return 3 * 1.7 * this.newDifficulty;
    // }
  },
  methods: {
    checkCorrect(performanceRating) { // in repo https://github.com/lo-tp/sm2-plus/blob/master/source/src/index.js it is compared to WORST = performaceRating = 0
      return (performanceRating > PERFORMANCE_CUTOFF); // correct if > 0.6
    },
    calcDifficultyWeight(difficulty) {
      return 3 - 1.7 * difficulty;
    },
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

      var performanceRating = this.performanceRating = mapping[rating];

      this.$nextTick(() => { // delay to next digest --> correct value calculated
        // console.log('input data', this.difficulty, this.daysBetweenReviews, this.dateLastReviewed);
        let correct = this.checkCorrect(performanceRating);

        let percentOverdue = this.percentOverdue;
        let difficulty = this.newDifficulty = this.calcDifficulty(this.difficulty, percentOverdue);
        let difficultyWeight = this.difficultyWeight = this.calcDifficultyWeight(difficulty);
        // console.log('difficultyWeight', difficultyWeight);
        this.newDaysBetweenReviews = this.calcDaysBetweenReviews(correct, difficultyWeight, percentOverdue);
        this.newDateLastReviewed = moment().valueOf();
        // this.calcDifficulty();
        // this.calcDaysBetweenReviews();
        // console.log('new date', newDateLastReviewed)
        // console.log('spaced review date', this.newDateLastReviewed);
        let result = {
          daysBetweenReviews: this.newDaysBetweenReviews,
          dueDate: this.newDateLastReviewed + this.newDaysBetweenReviews, //today + interval --> not needed percentOverdue should be enough for filtering (just as info)
          difficulty: this.newDifficulty,
          dateLastReviewed: this.newDateLastReviewed,
          percentOverdue: this.percentOverdue
        };

        // console.log('result', result);
        this.$emit('selected', result);
      });
    },
    calcDaysBetweenReviews(correct, difficultyWeight, percentOverdue) {
      // console.log('correct in daysBetweenReviews', correct);
      if(correct) {
        // console.log('correct days between reviews');
        return 1 + Math.round((difficultyWeight - 1) * percentOverdue)
      } else {
        return Math.round(1 / ( difficultyWeight^2)) || 1;
      }
    },
    calcDifficulty(difficulty, percentOverdue) {
      //difficulty += percentOverdue * 1/17(8-9 *performaceRating), clamp to [0, 1]
      // console.log('difficulty before', difficulty, percentOverdue, this.performanceRating);
      let newDifficulty = difficulty + ( 8 - 9 * this.performanceRating) * percentOverdue / 17;
      // console.log('difficulty calc', newDifficulty);
      // limiting to [0,1]
      if (newDifficulty < 0) {
        newDifficulty = 0;
      }
      if (newDifficulty > 1) {
        newDifficulty = 1;
      }

      return newDifficulty;
    }
  },
  data() {
    return {
      correct: false,
      difficultyWeight: 0,
      percentOverdue: 0,
      performanceRating: 0,
      // new values are created later
      newDifficulty: this.difficulty,
      newDaysBetweenReviews: 1,
      newDateLastReviewed: 0
    };
  }
}
</script>