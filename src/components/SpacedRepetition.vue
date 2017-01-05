<template>
  <div>
    <div class="columns has-text-centered">
      <div class="column is-4">
        {{estimated.soon}} m<br/>
        <a class="button" @click="spaced('soon')">Soon</a>
      </div>
      <div class="column is-4">
        {{estimated.good}} m<br/>
        <a class="button" @click="spaced('good')">Good</a>
      </div>
      <div class="column is-4">
        {{estimated.easy}} days<br/>
        <a class="button" @click="spaced('easy')">Easy</a>
      </div>

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
- percentOverdue not used for filtering --> dueDate is easier to work with.

*/

import moment from 'moment';

import {SPACED_REPETITION_DEFAULT, PERFORMANCE_CUTOFF, WORST, GOOD, BEST, PREDEFINED_REVIEW_TIMES} from './spacedrepetition-constants'

const mapping = { // just for different naming in template soon, good, easy
  soon: WORST,
  good: GOOD,
  easy: BEST
};

export default {
  props: {
    difficulty: {
      type: Number,
      default: SPACED_REPETITION_DEFAULT.difficulty // 0.3
    },
    daysBetweenReviews: { // daysBetweenReviews
      type: Number,
      // default: SPACED_REPETITION_DEFAULT.daysBetweenReviews // 1
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
      let durationLastReviewed = moment.duration(moment().valueOf()).subtract(parseInt(this.dateLastReviewed)).days();
      // let durationLastReviewed = moment.duration(moment().valueOf()).subtract(parseInt(this.dateLastReviewed)).valueOf();
      // if (this.correct) {
      // console.log('percentOverdue', durationLastReviewed / this.newDaysBetweenReviews);
      const calculated = durationLastReviewed / this.daysBetweenReviews;
      return calculated > 2 ? 2 : calculated;
      // } else {
      //   console.log('percentOverdue (incorrect)', 1);
      //   return 1;
      // }
      // below with-out moment (also working)
      // console.log('duration', durationLastReviewed_ms, durationLastReviewed_ms / (1000 * 3600 *24) / this.daysBetweenReviews);
      // return Math.min(2, durationLastReviewed_ms / (1000 * 3600 *24) / this.daysBetweenReviews); //result;
    },
    estimated() {
      // steps in minutes are pre-defined, only easy is calculated
      // times from Anki for a new card <1min, <10min, 4d
      // 1Min & 10Min are fixed timings for new cards if soon or good clicked --> not implemented in filtering yet.
      // 1min tested for green --> 9:32 with 9 cards (9:33 2 cards remain)
      // 10min tested for red, car --> 9:32 --> 9:34 (red & car)
      return {
        ...PREDEFINED_REVIEW_TIMES,
        easy: this.daysBetweenReviews // 4d
      };;
    }
  },
  methods: {
    checkCorrect(performanceRating) { // in repo https://github.com/lo-tp/sm2-plus/blob/master/source/src/index.js it is compared to WORST = performaceRating = 0
      return (performanceRating > PERFORMANCE_CUTOFF); // correct if > 0.6
    },
    calcDifficultyWeight(difficulty) {
      return 3 - 1.7 * difficulty;
    },    
    spaced(rating) {
      let performanceRating = this.performanceRating = mapping[rating];
      let correct = this.checkCorrect(performanceRating);
      let newDateLastReviewed = moment().valueOf();
      this.newDateLastReviewed = newDateLastReviewed;
      this.$nextTick(() => { // delay to next digest --> correct value calculated
        let percentOverdue = this.percentOverdue;
        let difficulty = this.newDifficulty = this.calcDifficulty(this.difficulty, percentOverdue);
        let difficultyWeight = this.difficultyWeight = this.calcDifficultyWeight(difficulty);
        this.newDaysBetweenReviews = this.calcDaysBetweenReviews(correct, difficultyWeight, percentOverdue);
        this.newDueDate = this.newDateLastReviewed + moment.duration(this.newDaysBetweenReviews, 'days').valueOf();
        // this.newDueDate = this.newDateLastReviewed + this.newDaysBetweenReviews;
        console.log('new interval', this.newDaysBetweenReviews);

        let result = {
          daysBetweenReviews: this.newDaysBetweenReviews,
          dueDate: this.newDueDate, //today + interval --> not needed percentOverdue should be enough for filtering (just as info)
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
      // const day_in_ms = 24 * 3600 * 1000;
      // const min = 60 * 1000//1min = 60 000ms

      if(correct) {
        // console.log('correct days between reviews');
        return 1 + Math.round((difficultyWeight - 1) * percentOverdue) // > 1 day reviews
        // return min + Math.round(day_in_ms * (difficultyWeight - 1) * percentOverdue) // > 1 day reviews
      } else {
        return Math.round(1 / difficultyWeight / difficultyWeight) || 1;
        // return Math.round(day_in_ms / difficultyWeight / difficultyWeight) || min;
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
      newDateLastReviewed: 0,
      newDueDate: 0
    };
  }
}
</script>