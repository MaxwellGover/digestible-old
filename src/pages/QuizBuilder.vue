<template>
	<div class="quiz-builder container">
  
    <div class="box" v-for="(question, index) in questions">
      <div style="width: 95%">
      <label class="label" style="margin-bottom: 10px">Question {{index++}}</label>
      <p class="control is-grouped">
        <textarea class="textarea is-medium" type="text" placeholder="Enter a question"  v-model="question.text"></textarea>
          <span style="color: #ff3860; margin-left: 15px" @click="removeQuestion(index)"><i class="fa fa-trash-o 5x" aria-hidden="true"></i></span>
      </p>
      </div>
      </br>
      <div class="input-group" v-for="(option, index) in question.options" style="margin-bottom: 20px">
        <p class="control is-grouped">
          <input class="checkbox" type="checkbox" v-model="option.isAnswer">
          <input class="input is-medium is-expanded" type="text" placeholder="Enter an option" v-model="option.text">
            <span class="remove" style="color: #ff3860; margin-left: 15px; margin-top: 10px" @click="removeOption(question, option)"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
        </p>
        <small style="font-size: 14px; margin-left: 25px">Mark the checkbox to the left is this is the right answer.</small>
      </div>
      <a class="add-option button is-white" @click="addOption(question)"><span class="remove" style="color: #006ce4">Add an option</span></a>
      <div>
      <label class="label">Summary</label>
      <p class="control">
        <textarea class="textarea" type="text" v-model="question.summaryText"></textarea>
      </p>
      <small style="font-size: 12px">This will be shown when a user quizzes themselves. Summaries can help the user improve their mental model and really understand the <em>WHY </em>behind the answer.</small>
      </div>
    </div></br>
    <div>
      <a class="add-question-btn button" @click="addQuestion" :disabled="questions.length >= 5 ? true : false">
        <span class="add-question-text">Add another question</span>
      </a>
      <a class="create-quiz-btn button" @click="saveToFirebase">
        <span class="button-text">Create quiz</span>
      </a>
    </div>
    <!--<pre>
    {{questions | json}}
{{$store.state.quiz | json}}
    </pre>-->

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
  	options: [createNewOption()],
  	summaryText: ''
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
  firebase: {

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
  created() {
		let quizRef = db.ref('/resources/' + this.$store.state.postKey + '/quiz');
    this.$firebaseRefs['fbQuestions'] = quizRef;
    this.$bindAsObject('fbQuestions', quizRef);

    quizRef.on('value', (snapshot) => {
      let questions = snapshot.val();
      console.log('init questions', questions);

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
    removeNotification () {
      this.show = false 
    },
    saveToFirebase (e) {
    	e.preventDefault();
      let updates = {};
      
      console.log('save', this.questions);
      this.$firebaseRefs['fbQuestions'].set(this.questions); //vuefire to update questions

      // Push to route {{ $route.params.resourceId }}
      router.push('/quiz/' + this.$store.state.postKey); // postKey saved in localstorage (so reloading will work)
    }
	}
}
</script>

<style scoped>
.quiz-builder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 60px;
  width: 80%;
}
.quiz-header {
  margin-bottom: 20px;
  text-align: center;
  font-size: 40px
}
.add-option {
  color: #4e30f9;
  text-decoration: none;
  cursor:pointer;
}
.create-quiz-btn {
  background-color: #006ce4;
  padding: 15px;
}
.alert {
  margin-bottom: 40px
}
.control {
  display: flex;
}
.checkbox {
  align-self: center;
  height: 15px;
  width: 15px;
  margin-right: 10px;
}
.add-option {
  margin-bottom: 30px;
  color: #f16233;
  border-color: #006ce4;
}
.add-question-btn {
  border-color: #006ce4;
  padding: 15px;
}
.add-question-text {
  color: #006ce4;
}
.button-text {
  color: #fff
}
.remove:hover {
  color: #fff;
}
.box {
  padding: 60px;
}
.fa:hover {
  cursor: pointer;
}
.input:focus {
  border-color: #006ce4;
}
.textarea:focus {
  border-color: #006ce4;
}
</style>