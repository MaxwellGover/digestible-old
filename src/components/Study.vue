<template>
  <div>
    <!--<h2 class="title">spaced repetition testing</h2>
    difficulty (default 0.3) <input v-model="difficulty">
    daysBetweenReviews (default 1) <input v-model="daysBetweenReviews">
    dateLastReviewed: <input v-model="dateLastReviewed">
    <spaced-repetition :difficulty="difficulty" :days-between-rewiews="daysBetweenReviews" :date-last-reviewed="dateLastReviewed"></spaced-repetition>-->

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
      <pre>all {{answeredQuestions | json}}</pre>
      <pre>filtered {{answeredQuestionsFiltered | json}}</pre>
      <div class="container" v-if="loaded">
          <!--<pre>{{randomQuestion}}</pre>-->
        Testing: key: {{resourceKey}} - index: {{questionIndex}}
        {{allDone}} {{quizAvailable}}
        <pre>{{answeredQuestion|json}}</pre>
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
          <button @click="submitQuiz()" v-if="!submitted" class="button">Show answer</button>
          <!--<button @click="nextQuestion()" v-else class="button">Next</button>-->
          <spaced-repetition v-if="submitted" 
            :difficulty="answeredQuestion.difficulty" 
            :days-between-rewiews="answeredQuestion.daysBetweenReviews" 
            :date-last-reviewed="dateLastReviewed" 
            v-on:selected="nextQuestion"></spaced-repetition>
          <!--<pre>{{score | json}}</pre>-->
        </div>
        <article v-if="allDone && quizAvailable" class="message is-info">
            <div class="message-header">
              Congratulations!
            </div>
            <div class="message-body">
              You're ready for today. Come back tomorrow and study again.
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
      reload: false,
      loaded: false,
      // resource: {},
      answeredQuestionsFiltered: {},
      quiz: {},
      initRandom: undefined,
      resourceKey: '',
      questionIndex: 0,
      quizAvailable: false, // show info that quiz is required --> moved to state because setting this in asyncComputed wasn't working
      allDone: false // Congratulations! You're done for today.
      // spaced-repetition input variables --> later stored for each question
      // difficulty: 0.3,
      // daysBetweenReviews: 1,
      // dateLastReviewed: moment()
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
      // allDone: state => state.studyStatus.allDone,
      // quizAvailable: state => state.studyStatus.quizAvailable
    }),
    questionAnswers () {
      return this.randomQuestion.options.filter((option)=> option.isAnswer);
    },
    answeredQuestion () {
      console.log('answeredQuestion', this.questionIndex, this.answeredQuestions);
      if (!this.answeredQuestionsFiltered[this.resourceKey]) {
        // all cards done or no quiz done yet. --> create flag for both cases before and after filtering
        return {};
      }
      else {
        return this.answeredQuestionsFiltered[this.resourceKey][this.questionIndex]; // contains spaced-repetition data of user
      }
    },
    dateLastReviewed () {
      console.log('dateLastReviewed', this.answeredQuestion.dateLastReviewed);
      return parseInt(this.answeredQuestion.dateLastReviewed) === 0 ?  moment().utc().format('x') : this.answeredQuestion.dateLastReviewed; // if 0 --> get current date for first run
    }
  },
  asyncComputed: {
    // loaded() {
    //   return new Promise( (resolve, reject) => {
    //     if (this.randomQuestion) {
    //       resolve(true);
    //     } else {
    //       resolve(false);
    //     }
    //   })
    // },
    randomQuestion() {
      // we only need to get the key then we can query the questions --> modified answeredQuestions collection to an array of refs
      if (this.reload) {
        this.reload = false;
        this.initRandom = undefined; // re-create promise (if this method with reload = true)
      }
      
      this.initRandom = new Promise( (resolve, reject) => {
        let limit=0; // limit counter to 15 questions
        // filter based on percentOverdue (if > 1 --> study required)
        let quizAvailable = Object.keys(Object.assign({}, this.answeredQuestions)).length > 0; // copy answeredQuestions otherwise this would be falsy because ref. to same obj.
        this.answeredQuestionsFiltered = Object.assign({}, this.answeredQuestions);
        for(let key in this.answeredQuestionsFiltered) {
          this.answeredQuestionsFiltered[key] = this.answeredQuestionsFiltered[key].filter((spacedProps) => {
            // console.log('filtering', spacedProps.dateLastReviewed);
            // let lastReviewed8h = (parseInt(spacedProps.dateLastReviewed) === 0) || moment(spacedProps.dateLastReviewed).utc().add(8, 'hours').isBefore(moment().utc()); // older than 8h --> OK or 0 as start value
            // let reviewTimePassed = moment().utc().isAfter(spacedProps.dateLastReviewed + spacedProps.daysBetweenReviews); // not needed percentOverdue should be enough
            // limit++;
            // console.log('last review check', lastReviewed8h, spacedProps.dateLastReviewed, moment(spacedProps.dateLastReviewed).utc().add(8, 'hours').isBefore(moment().utc()));
            return ( parseInt(spacedProps.daysBetweenReviews) === 0 ) || // if sooner/worst click --> keep repeating 
              (spacedProps.percentOverdue >= PERCENT_OVERDUE_LIMIT); // e.g. <= 1.0 overdue and limit to 15 questions and discarding items reviewed in the past 8 or so hours.
          });

          if (this.answeredQuestionsFiltered[key].length === 0) {
            // no item --> remove key
            delete this.answeredQuestionsFiltered[key];
          }
        }

        let allDone = Object.keys(this.answeredQuestionsFiltered).length === 0;

        let updateStudyStatus = {
          allDone: Boolean(allDone), // copy!
          quizAvailable: Boolean(quizAvailable) // copy!
        };

        this.allDone = !!allDone;
        this.quizAvailable = !!quizAvailable;
        // console.log('studyStat', allDone, quizAvailable)
        // this.$store.dispatch('updateStudyStatus', updateStudyStatus); // still re-runs

        console.log('alldone', allDone, quizAvailable) 
        let keys = Object.keys(this.answeredQuestionsFiltered); // key: [question1, question2, ..], key2: [questionx, ...] --> getting key1,key2,...
        if (keys.length === 0) { // no quizes done yet or no open card for today.
          reject();
          return {};
        }
        
        console.log('keys', keys);
        let randomIndex = Math.floor(Math.random() * keys.length); // this is not the question index - just for randomKey generation
        let randomKey = keys[randomIndex];
        console.log('init', randomKey);
        resolve(randomKey);
      })

      // console.log('random', keys, randomIndex, randomKey, this.answeredQuestions[randomKey]);
      // // return Object.assign({}, this.answeredQuestions[randomKey]);

      return this.initRandom.then((randomKey) => {
        return db.ref('resources/'+ randomKey).once('value').then((snap) => {
          // this.quizIndex = ids.randomIndex;
          let resource = snap.val();
          console.log('resource loaded', resource);

          if (!resource) {
            this.reload = true;
            console.log('reloading...');
            // remove resource key from answeredQuestions --> resource removed from resourceCollection but it is still in answeredQuestions array
            this.$firebaseRefs.fbAnsweredQuestions.child(randomKey).remove();

            // update vuex store
            let updateAnsweredQuestions = Object.assign({}, this.answeredQuestions);
            delete updateAnsweredQuestions[randomKey];
            this.$store.dispatch('updateAnsweredQuestions', updateAnsweredQuestions);
            return {};
          }
          // this.resource = resource;
          this.$store.dispatch('updateResource', resource);
          console.log('randomkey', randomKey, resource);
          this.resourceKey = randomKey;
          // this.$store.dispatch('prepareAnswerList', resource);
          let questionRandomIndex = Math.floor(Math.random() * this.answeredQuestionsFiltered[randomKey].length); //resource.quiz.length); --> recource.quiz can contain more questions
          this.questionIndex = questionRandomIndex;
          console.log('questionIndex', questionRandomIndex);
          // this.quizIndex = questionRandomIndex;
          // this.question = resource.quiz[questionRandomIndex];
          // this.$store.dispatch('updateSingleQuestion', this.question);
          console.log('randquestion', resource.quiz[questionRandomIndex])
          this.loaded = true;
          return resource.quiz[questionRandomIndex];
        })
        // answeredQuestions structure:
        // resourceKey.quizText
        //   "-KZViqfOiOd1aC8SEWeh": {
        //   "quizText": [
        //     {
        //       "1": {
        //         "text": "Empire State building"
        //       },
        //       "questionText": "What is the higher building?",
        //       "summaryText": ""
        //     }
        //   ]
        // }
      }).catch((reason) => {
        this.reload = false; // no reloading
        this.loaded = true; // loading also done
        console.log('no items', reason);
      });
    }
  },
  created() {
    let answeredQuestionsRef = this.$firebaseRefs['fbAnsweredQuestions'] = db.ref('/users/' + this.$store.state.userInfo.uid + '/answeredQuestions');
    console.log('userid', this.$store.state.userInfo.uid );

    this.$bindAsArray('fbAnsweredQuestions', answeredQuestionsRef);

    answeredQuestionsRef.once('value', (snap) => {
      // todo add filtering here based on percentOverdue + limit to 10 or 20 questions
      console.log('answeredQuestions', snap.val());
      this.$store.dispatch('updateAnsweredQuestions', snap.val());
      // this.$nextTick(function () { // delay to next tick for store updating
      // this.randomQuiz(); // load first question
      this.$store.commit('resetForm');
      // });
      // clear answeredQuestions testwise
      // snap.ref.set({}); // if we want to reset the answeredQuestions in fb

      return snap.val();
    });

    // Promise.all(answeredQuestions, this.randomQuiz).then((data) => {
    //     console.log('all data resoloved', data);
    //     // this.loaded = true;
    // })
  },
  // beforeDestroy() {
  //   this.$store.commit('mutateSingleQuestion', undefined); // clear single question
  // },
  methods: {
    // loadResource(key) {
    //   let resourceRef = db.ref('resources/' + key);
    
    //   resourceRef.once('value', (snap) => {
    //     // update store
    //     console.log('resource', snap.val(), snap.key);
    //     let resource = snap.val();
    //     resource['.key'] = snap.key;

    //     this.$store.dispatch('updateResource', resource);
    //     this.loaded = true;
    //   });
    // },
    nextQuestion(spacedRepetitionProps) {
      this.$store.commit('resetForm');
      this.$nextTick(() => {
        console.log('next', spacedRepetitionProps);
        this.$firebaseRefs['fbAnsweredQuestions'].child(this.resourceKey).child(this.questionIndex).update(spacedRepetitionProps, (error)=> {
          console.log('error', error);
           this.$firebaseRefs['fbAnsweredQuestions'].child(this.resourceKey).child(this.questionIndex).once('value', (snap) => {
             console.log('writing reading - answeredQuestions', snap.val()); //<<<<<<<<<<<< just for testing --> saving is working
           })
        });
        this.$store.commit('updateAnsweredQuestion', {key: this.resourceKey, index: this.questionIndex, props: spacedRepetitionProps});
        this.reload = true;
      });
      // this.$nextTick(() => { // not working --> review in data
      //   setTimeout(() => {
      //     this.reload = true;
      //   }, 2000); // delay two seconds for reviewing data of spaced-repetition
      // });
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