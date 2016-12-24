<template>
	<div class="quiz-builder container">
    <h4 class="quiz-header">Build your quiz!</h4>
    <div class="alert alert-info alert-dismissible fade in" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    <strong>Quick tip:</strong> Questions should cover the main points from your resource that you want the user to remember!
    </div>
    <div v-for="(question, index) in questions">
      <div class="input-group">
        <input type="text" class="form-control" v-model="question.text" placeholder="Enter a question">
         <span class="input-group-btn">
          <button class="btn btn-danger" type="button" @click="removeQuestion(index)">X</button>
        </span>
      </div>
      </br>
      <div class="input-group" v-for="(option, index) in question.options" style="margin-bottom: 20px">
        <span class="input-group-addon">
          <input type="checkbox" v-model="option.isAnswer">
        </span>
        <input type="text" class="form-control" v-model="option.text" placeholder="Enter an option">
        <span class="input-group-btn">
          <button class="btn btn-danger" type="button" @click="removeOption(question, option)">X</button>
        </span>
      </div>
      <p class="add-option" @click="addOption(question)">Add an option</p>
    </div></br>
    <div>
      <button class="add-question-btn btn btn-default" @click="addQuestion" :disabled="questions.length >= 5 ? true : false">
        Add another question
      </button>
      <button class="create-quiz-btn btn btn-primary" @click="saveToFirebase">
        Create quiz
      </button>
      <!--<button class="create-quiz-btn btn btn-primary" @click="testQuiz">
        Test quiz
      </button>-->
    </div>
    <pre>
    {{questions | json}}
{{$store.state.quiz | json}}
    </pre>

    <!--<modal ref="quizTestModal" title="Test your quiz" :options="quizTestOptions">
      <quiz :options="{testMode: true}"></quiz>
    </modal>-->
 	</div>
</template>


<script>

// TODO: Add functionality to alert

// import store from '../store'
import db from '../db'
import router from '../router'
import { mapState } from 'vuex'
import {state} from '../store'
// import modal from '../components/Modal'
// import quiz from './Quiz'

const createNewOption = () => { 
	return {
  	text: '',
  	isAnswer: false
  }
}

const createNewQuestion = () => {
  return {
  	text: '',
  	options: [createNewOption()]
  }
}

export default {
  name: "quiz-builder",
  // components: { // for feature quiz-test in modal
  //   modal,
  //   quiz
  // },
	data () {
    return {
      // questions: [],
      // questions: [createNewQuestion()],
      showQuestions: false,
    }
  },
  computed: {
    ...mapState({
        // quiz: state => state.quiz,
        questions: state => state.quiz.questions
    }),
    // postKey: state => state.postKey
    // questions: state => {
    //   console.log('questions', state);
    //   if (state.quiz.questions.length === 0) {
    //     state.commit('initQuestions', createNewQuestion); // mutate store to init. questions array
    //   }
    //   console.log('Questions', state.quiz);
    //   return state.quiz.questions;
    // }
  },
  firebase: { // vuefire only used for storing db.ref from created hook
    // we could add the reference here but I still don't know how to access $store.state here
  },
  created() {
    // this.quizTestOptions = {cancelOnly: true, cancelCaption: 'Close'};

		// console.log('created', this.$store.state.postKey);
		let quizRef = db.ref('/resources/' + this.$store.state.postKey + '/quiz');
    this.$firebaseRefs['questions'] = quizRef;
    this.$bindAsObject('questions', quizRef);

    quizRef.on('value', (snapshot) => {
      let questions = snapshot.val();

      // init questions 
      // vuefire would be only bound to local state --> dispatch so we have it on store
      this.$store.dispatch('initQuestions', questions || [createNewQuestion()]); // mutate store to init. questions array (dispatch because this is asynch.)
    });
  },
  // created() {
  //   console.log('firebase', this.$store.state);
  //   let quizRef = db.ref('/resources/' + this.$store.state.postKey + '/quiz');
  //   this.$firebaseRefs['quiz'] = quizRef;

  //   console.log(this.$store.state.postKey);
  //   // this.$bindAsArray('questions', quizRef);

  //   quizRef.once('value', (snapshot) => {
  //     let questions = snapshot.val();
  //     console.log(questions);
  //     if (!questions) {
  //       this.questions = [createNewQuestion()];
  //     } // else firebase binding will load the questions correctly.
  //   })

  // },
  methods: {
    testQuiz() {
      this.$store.commit('modalToggle', this.$refs.quizTestModal.$el); 
    },
    addQuestion () {
    	this.questions.push(createNewQuestion());
    },
    removeQuestion (index) {
      this.questions.splice(index, 1);
    },
    addOption (question) {
      let index = this.questions.indexOf(question);
      console.log('add opt', index, this.questions)
    	this.questions[index].options.push(createNewOption());
    },
    removeOption (question, option) {
      var index = question.options.indexOf(option);
        if (index > -1) {
          question.options.splice(index, 1);
        }
    },
    saveToFirebase (e) {
    	e.preventDefault();
      let updates = {};
      
      console.log('save', this.questions);
      this.$firebaseRefs['questions'].set(this.questions); //vuefire to update questions

      // Push to route {{ $route.params.resourceId }}
      router.push('/info/' + this.$store.state.postKey); // postKey saved in localstorage (so reloading will work)
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.quiz-builder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 60px;
  width: 800px;
}
.quiz-header {
  margin-bottom: 20px;
  text-align: center
}
.add-option {
  color: #4e30f9;
  text-decoration: none;
  cursor:pointer;
}
.add-question-btn {
  border-radius: 2px;
}
.create-quiz-btn {
  border-radius: 2px;
  background-color: #4e30f9;
}
.alert {
  margin-bottom: 40px
}
</style>