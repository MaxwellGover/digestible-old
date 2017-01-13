<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Study your already answered questions
          </h1>
          <h2 class="subtitle">
            Notice, first do some quizes and come back here to have more questions to answer. Only your correctly answered questions will appear here.
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div v-if="debug">
        {{today}}
        <pre>all {{answeredQuestions | json}}</pre>
        <pre>filtered {{answeredQuestionsFiltered | json}}</pre>
      </div>

      <div class="container" v-if="loaded">
        <div v-if="debug">
          Testing: key: {{resourceKey}} - index: {{questionIndex}}
          {{allDone}} {{quizAvailable}}
          <pre>{{answeredQuestion|json}}</pre>
        </div>
        <div v-if="randomQuestion && !allDone">
          <!--<question :quiz="question" :quiz-index="quizIndex" :submitted="submitted" :resource="resource"></question>
          <flash-card :score="score" :visible="submitted" style="margin-top: 40px"></flash-card>-->
          <h1 class="title">{{resource.title}}</h1>
          <article class="message is-info">
            <div class="message-header">
              {{randomQuestion.text}}<router-link :to="'/quiz/'+ resourceKey" class="button is-pulled-right">goto quiz</router-link>
            </div>
            <div class="message-body" v-if="submitted">
              <ul>
                <li v-for="answer in questionAnswers">{{answer.text}}</li>
              </ul>
            </div>
          </article>
          <p>
          <span class="tag is-light">{{studyCount}}</span>questions to study.
          </p>
          <button @click="submitQuiz()" v-if="!submitted" class="button">Show answer</button>
          <!--<button @click="nextQuestion()" v-else class="button">Next</button>-->
          <spaced-repetition v-if="submitted" 
            :difficulty="answeredQuestion.difficulty" 
            :days-between-reviews="answeredQuestion.daysBetweenReviews" 
            :date-last-reviewed="dateLastReviewed" 
            v-on:selected="nextQuestion"></spaced-repetition>
          <!--<pre>{{score | json}}</pre>-->
        </div>
        <article v-if="allDone && quizAvailable" class="message is-info">
            <div class="message-header">
              Congratulations!
            </div>
            <div class="message-body">
              You're ready for today. Come back tomorrow and study again. Or do more quizes, so you're having more questions to study here.
            </div>
          </article>
         <article v-if="!quizAvailable" class="message is-info">
            <div class="message-header">
              Not available yet.
            </div>
            <div class="message-body">
              Please first answer some quizes. Then you can study them here again.
            </div>
          </article>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'
import moment from 'moment'

import SpacedRepetition from './SpacedRepetition'
import {PERCENT_OVERDUE_LIMIT} from './spacedrepetition-constants'

// var db = firebase.database();
import db from '../db'

export default {
  name: 'Study',
  data() {
    return {
      debug: false, // true = show spaced-repetition info in markup
      loaded: false,
      // resource: {},
      answeredQuestionsFiltered: {},
      quiz: {},
      randomQuestion: {},
      resourceKey: '',
      questionIndex: 0,
      quizAvailable: false, // show info that quiz is required --> moved to state because setting this in asyncComputed wasn't working
      allDone: false, // Congratulations! You're done for today.
      studyCount: 0
    }
  },
  firebase: {
		// return {
		// 	fbResource: {
		// 		source: db.ref('resources/' + this.$route.params.resourceId),
		// 		asObject: true
		// 	}
		// }
	},
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      answeredQuestions: state => state.answeredQuestions,
      selectedAnswers: state => state.quiz.result.selectedCount,
      submitted: state => state.quiz.submittedStatus,
      resource: state => state.quiz.resource
    }),
    questionAnswers () {
      return this.randomQuestion.options.filter((option)=> option.isAnswer);
    },
    answeredQuestion () {
      if (!this.answeredQuestionsFiltered[this.resourceKey]) {
        // all cards done or no quiz done yet. --> create flag for both cases before and after filtering
        return {};
      }
      else {
        return this.answeredQuestions[this.resourceKey][this.questionIndex]; // contains spaced-repetition data of user
      }
    },
    dateLastReviewed () {
      console.log('dateLastReviewed', this.answeredQuestion.dateLastReviewed);
      return parseInt(this.answeredQuestion.dateLastReviewed) === 0 ?  moment().valueOf() : this.answeredQuestion.dateLastReviewed; // if 0 --> get current date for first run
    },
    quizAvailable () {
      return this.answeredQuestions && Object.keys(this.answeredQuestions).length > 0;
    },
    allDone () {
      return this.answeredQuestionsFiltered && Object.keys(this.answeredQuestionsFiltered).length === 0;
    },
    today () {
      return moment().toString(); // just for testing
    }
  },
  watch: { // added additionally to created because $route is reactive in vue2.x, so route change will also refresh data
    '$route': 'loadData'
  },
  created() {
    this.loadData();
  },
  // beforeDestroy() {
  //   this.$store.commit('mutateSingleQuestion', undefined); // clear single question
  // },
  methods: {
    loadData() {
      let answeredQuestionsRef = this.$firebaseRefs['fbAnsweredQuestions'] = db.ref('/users/' + this.$store.state.userInfo.uid + '/answeredQuestions');
      this.$bindAsArray('fbAnsweredQuestions', answeredQuestionsRef);

      answeredQuestionsRef.once('value', (snap) => {
        this.$store.dispatch('updateAnsweredQuestions', snap.val());
        this.$store.commit('resetForm');
        this.answeredQuestionsFiltered = this.filterAnsweredQuestions();
        let randomKey = this.getRandomKey();
        // clear answeredQuestions testwise
        // snap.ref.set({}); // uncomment, if we want to delete the answeredQuestions in fb

        db.ref('resources/'+ randomKey).once('value').then((snap) => {
          // this.quizIndex = ids.randomIndex;
          let resource = snap.val();
          // console.log('resource loaded', resource);

          if (!resource) {
            if (randomKey) {
              this.reload = true;
              console.log('reloading...');
              // remove resource key from answeredQuestions --> resource removed from resourceCollection but it is still in answeredQuestions array
              this.$firebaseRefs.fbAnsweredQuestions.child(randomKey).remove();

              // update vuex store
              let updateAnsweredQuestions = Object.assign({}, this.answeredQuestions);
              delete updateAnsweredQuestions[randomKey];
              this.$store.dispatch('updateAnsweredQuestions', updateAnsweredQuestions);
            }
            else {
              this.loaded = true;
              return {};
            }
          }
          // this.resource = resource;
          this.$store.dispatch('updateResource', resource);
          this.resourceKey = randomKey;
          let questionRandomIndex = Math.floor(Math.random() * this.answeredQuestionsFiltered[randomKey].length); //resource.quiz.length); --> recource.quiz can contain more questions
          this.questionIndex = this.answeredQuestions[randomKey].indexOf(this.answeredQuestionsFiltered[randomKey][questionRandomIndex]); // get index from unfiltered array
          this.loaded = true;
          this.randomQuestion = resource.quiz[questionRandomIndex];
          // return resource.quiz[questionRandomIndex];
        });
      });
    },
    getRandomKey () {
      this.$nextTick(() => {
        if (!this.quizAvailable) {
          return;
        }
      });

      let keys = Object.keys(this.answeredQuestionsFiltered); // key: [question1, question2, ..], key2: [questionx, ...] --> getting key1,key2,...
      let randomIndex = Math.floor(Math.random() * keys.length); // this is not the question index - just for randomKey generation
      let randomKey = keys[randomIndex];
      return randomKey;
    },
    filterAnsweredQuestions () {
      let filteredQuestions = {};
      if (!this.quizAvailable) return {};

      this.studyCount = 0;
      // let limit=0; // limit counter to 15 questions
      // filter based on percentOverdue (if > 1 --> study required)
      let keysSorted = Object.keys(this.answeredQuestions); // sorting problematic because we're having a nested structure key: [opt1, opt2], key2: [optx, opty]
      //we should sort it by percentOverdue highest first --> easier limiting later
      for (let i=0; i < keysSorted.length; i++) { // limiting --> just change length to a fixed value
        let key = keysSorted[i];
        filteredQuestions[key] = this.answeredQuestions[key].filter((spacedProps) => {
          let duePassed = moment().isSameOrAfter(spacedProps.dueDate);
          // return ( parseInt(spacedProps.daysBetweenReviews) === 0 ) || // if first time review --> daysBetweenReviews = 0
          //   (spacedProps.percentOverdue > PERCENT_OVERDUE_LIMIT); // e.g. > 1.0 overdue and limit to 15 questions and discarding items reviewed in the past 8 or so hours.
          return ( parseInt(spacedProps.daysBetweenReviews) === 0 ) || duePassed;
        });

        if (filteredQuestions[key].length === 0) {
          // no item --> remove key
          delete filteredQuestions[key];
        } else {
          this.studyCount += filteredQuestions[key].length;
        }
      }

      return filteredQuestions;
    },
    nextQuestion(spacedRepetitionProps) {
      this.$store.commit('resetForm');
      this.$nextTick(() => {
        this.$firebaseRefs['fbAnsweredQuestions'].child(this.resourceKey).child(this.questionIndex).update(spacedRepetitionProps, (error)=> {
          if (error) {
            console.log('error', error);
          }
          this.$firebaseRefs['fbAnsweredQuestions'].child(this.resourceKey).child(this.questionIndex).once('value', (snap) => {
            // console.log('writing reading - answeredQuestions', snap.val()); //<<<<<<<<<<<< just for testing --> saving is working
          })
        });
        this.$store.commit('updateAnsweredQuestion', {key: this.resourceKey, index: this.questionIndex, props: spacedRepetitionProps});
        // this.reload = true;
        this.loaded = false;
        this.loadData();
      });
    },
    submitQuiz() {
      this.$store.commit('displayAnswers');
    }
  },
  components: {
    SpacedRepetition
  }
}
</script>

<style>
	
</style>