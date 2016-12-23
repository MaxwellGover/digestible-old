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
    </div>
    <pre>
    {{questions | json}}
{{$store.state.quiz | json}}
    </pre>
 	</div>
</template>


<script>

// TODO: Add functionality to alert

// import store from '../store'
import db from '../db'
import router from '../router'
import { mapState } from 'vuex'
import {state} from '../store'

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
	data () {
    return {
      // questions: [],
      // questions: [createNewQuestion()],
      showQuestions: false,
    }
  },
  computed: {
    ...mapState({
        quiz: state => state.quiz,
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
  firebase() {
    console.log(this.postKey);
    return {
      'quiz.questions': {
        // source: db.ref('/resources/' + this.$parent.$store.state.postKey + '/quiz'), //<<<<<<<<<<todo is there a better way to get the store here?! maybe we can use a computed property
        source: db.ref('/resources/' + this.postKey + '/quiz'), //<<<<<<<<<<todo is there a better way to get the store here?! maybe we can use a computed property --> not working
        bindAsObject: true
      }
    }
  },
  created() {
		console.log('created', this.$store.state.postKey);

		let quizRef = db.ref('/resources/' + this.$store.state.postKey + '/quiz'); // this.$firebaseRefs['questions'] 
    // this.$firebaseRefs['quiz.questions'] = quizRef;
    this.$bindAsArray('quiz.questions', quizRef);

    quizRef.on('value', (snapshot) => {
      let questions = snapshot.val();
      console.log(questions,  this.$store.state.postKey );
      if (!questions) {
        this.$store.dispatch('initQuestions', [createNewQuestion()]); // mutate store to init. questions array (dispatch because this is asynch.)
      } // else firebase binding will load the questions correctly.
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
      this.$firebaseRefs['quiz.questions'].set(this.questions);

      console.log('vuex fire will mutate state and save data...'); // not working. with-out code below - probably because manual binding


      console.log(this.$firebaseRefs);
      // this.$firebaseRefs.quiz.questions.set(this.questions);
      // console.log('update quiz', this.$store.state.postKey, this.questions);
      // updates['/resources/' + this.$store.state.postKey + '/quiz'] = this.questions;
      // // updates['/users/' + this.$store.state.userInfo.uid + '/createdResources/' + store.state.postKey + '/quiz/'] = this.questions; // no need to add it to users

      // console.log('saving quiz...', updates);
      // db.ref().update(updates);

      // store.state.postyKey = '' // How do I put his before the return statement without it erasing key?

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