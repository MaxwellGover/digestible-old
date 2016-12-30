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
      <div class="container" v-if="loaded">
        <div v-if="randomQuiz">
          <question :quiz="question" :quiz-index="quizIndex" :submitted="submitted" :resource="resource"></question>
          <flash-card :score="score" :visible="submitted" style="margin-top: 40px"></flash-card>
          <button @click="submitQuiz()" v-if="!submitted" :disabled="selectedAnswers == 0">Submit</button>
          <button @click="nextQuestion()" v-if="submitted">Next</button>
          <!--<pre>{{score | json}}</pre>-->
        </div>
         <article v-if="loaded && !randomQuiz" class="message is-info">
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
import { mapState, mapGetters } from 'vuex'
import Question from './Question'
import FlashCard from './FlashCard'

// var db = firebase.database();
import db from '../db'

export default {
  name: 'Study',
  data() {
    return {
      reload: false,
      // resource: {},
      quiz: {},
      question: {},
      score: {},
      initRandom: undefined
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
    score() {
      // console.log(this.$store.getters);
      return this.$store.getters.score;
    }
    // ...mapGetters(['score'])
  },
  asyncComputed: {
    loaded() {
      return new Promise( (resolve, reject) => {
        if (this.randomQuiz) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    },
    randomQuiz() {
      // we only need to get the key then we can query the questions --> modified answeredQuestions collection to an array of refs
      if (this.reload) {
        this.reload = false;
        this.initRandom = undefined; // re-create promise (if this method with reload = true)
      }
      
      this.initRandom = new Promise( (resolve, reject) => {
        let keys = Object.keys(this.answeredQuestions);
        if (keys.length === 0) { // todo --> check why this is needed? later only needed if there are no answeredQuestions
          reject();
        }

        console.log('keys', keys);
        let randomIndex = Math.floor(Math.random() * keys.length); // this is not the question index - just for randomKey generation
        let randomKey = keys[randomIndex];
        console.log('init', randomKey);
        resolve(randomKey);
      });

      // console.log('random', keys, randomIndex, randomKey, this.answeredQuestions[randomKey]);
      // // return Object.assign({}, this.answeredQuestions[randomKey]);

      return this.initRandom.then((randomKey) => {
        return db.ref('resources/'+ randomKey).once('value').then((snap) => {
          // this.quizIndex = ids.randomIndex;
          let resource = snap.val();
          // this.resource = resource;
          this.$store.dispatch('updateResource', resource);
          console.log('randomkey', randomKey, resource);
          this.$store.dispatch('prepareAnswerList', resource);
          let questionRandomIndex = this.getRandomQuestion(resource.quiz);
          this.quizIndex = questionRandomIndex;
          this.question = resource.quiz[questionRandomIndex];
          this.$store.dispatch('updateSingleQuestion', this.question);
          return resource.quiz;
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
      });
    }
  },
  created() {
    let answeredQuestionsRef = db.ref('/users/' + this.$store.state.userInfo.uid + '/answeredQuestions');
    console.log('userid', this.$store.state.userInfo.uid );
    // let answeredQuestionsRes = this.$firebaseRefs['answeredQuestions'] = db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/answeredQuestions');

		// this.$bindAsArray('passedResources', passedRes);
		// this.$bindAsArray('answeredQuestions', answeredQuestionsRes);
    this.$bindAsArray('answeredQuestions', answeredQuestionsRef);

    answeredQuestionsRef.once('value', (snap) => {
      this.$store.dispatch('updateAnsweredQuestions', snap.val());
      // this.$nextTick(function () { // delay to next tick for store updating
      // this.randomQuiz(); // load first question
      this.$store.commit('resetForm');
      // });
      return snap.val();
    });

    // Promise.all(answeredQuestions, this.randomQuiz).then((data) => {
    //     console.log('all data resoloved', data);
    //     // this.loaded = true;
    // })
  },
  beforeDestroy() {
    this.$store.commit('mutateSingleQuestion', undefined); // clear single question
  },
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
    nextQuestion() {
      this.$store.commit('resetForm');
      this.reload = true;
    },
    getRandomQuestion(quiz) {
      return Math.floor(Math.random() * quiz.length)
    },
    submitQuiz() {
      this.$store.commit('displayAnswers');
    }
  },
  components: {
    Question,
    FlashCard
  }
}
</script>

<style>
	
</style>