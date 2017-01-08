<template>
  <div class="quiz-builder container">
    <form>
      <div class="box" v-for="(question, qindex) in questions">
        <div style="width: 95%">
        <label class="label" style="margin-bottom: 10px">Question {{qindex + 1}}</label>
        <p class="control is-grouped">
          <textarea :data-vv-name="'text' + qindex" v-focus="first" @blur="first=false" data-vv-as="question" class="textarea is-medium" :class="{'is-danger': errors.has('text' + qindex) }" type="text" placeholder="Enter a question" v-validate.initial="question.text" :data-vv-rules="requiredFieldValidator" v-model="question.text"></textarea>
            <span style="color: #ff3860; margin-left: 15px" @click="removeQuestion(qindex)"><i class="fa fa-trash-o 5x" aria-hidden="true"></i></span>
        </p>
        <span v-show="errors.has('text' + qindex)">{{ errors.first('text' + qindex) }}</span>
        </div>
        </br>
        <div class="input-group" v-for="(option, index) in question.options" style="margin-bottom: 20px">
          <p class="control is-grouped">
              <input class="checkbox" type="checkbox" v-model="option.isAnswer" :class="{'is-danger': errors.has('check'+ qindex) }"
                :data-vv-name="'check'+ qindex" data-vv-as="checkbox" v-validate.initial="option.isAnswer" :data-vv-rules="'oneChecked: '+ qindex + ',isAnswer'">
              <input class="input is-medium is-expanded" type="text" 
                v-focus="focussed[qindex][index]" @blur="focussed[qindex][index]=false" @focus="focussed[qindex][index]=true" :data-vv-name="'option'+ qindex + '-' + index" data-vv-as="option text" placeholder="Enter an option" v-model="option.text" 
                :class="{'is-danger': errors.has('option' + qindex + '-' + index)}"
                v-validate.initial="option.text" :data-vv-rules="requiredFieldValidator" 
                @keydown.enter.prevent="addOption(question, qindex)"
                @keydown.delete="backspaceDelete($event, question, option)"
                @keyup.ctrl.space.prevent="toggle(qindex, index)"
                >
                <span class="remove" style="color: #ff3860; margin-left: 15px; margin-top: 10px" @click="removeOption(question, option)"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
            </p>
            <small style="font-size: 14px; margin-left: 25px">Mark the checkbox to the left is this is the right answer. ctrl + space in input.</small>
            <p v-show="errors.has('check' + qindex)">{{ errors.first('check'+ qindex) }}</p>
            <p v-show="errors.has('option' + qindex + '-' + index)">{{ errors.first('option'+ qindex + '-' + index) }}</p>
        </div>
        <a class="add-option button is-white" @click="addOption(question, qindex)"><span class="remove" style="color: #006ce4">Add an option</span></a>
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
        <router-link class="btn button" :to="'/info/'+postKey">
          Back
        </router-link>
        <a class="create-quiz-btn button" @click="beforeSubmit($event)">
          <span class="button-text">Create quiz</span>
        </a>
      </div>
    </form>
    <!--<pre>{{fields|json}}</pre>-->
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
import Firebase from 'firebase'
import { Validator } from 'vee-validate';
import { mixin as focusMixin }  from 'vue-focus';

// import store from '../store'
import db from '../db'
import router from '../router'
import { mapState } from 'vuex'
import {state} from '../store'

function createNewOption() { 
	return {
  	text: '',
  	isAnswer: false
  }
}

function createNewQuestion() {
  return {
  	text: '',
  	options: [createNewOption()],
  	summaryText: ''
  }
}


export default {
  name: "quiz-builder",
  mixins: [focusMixin],
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    console.log(this.fields.dirty());
    if (!this.submitted && this.fields.dirty()) {
      let stay = confirm('Warning! If you navigate away from this route it is possible to lose data. Leave any way?');
      console.log(stay);
      next(stay);
    } else {
      next();
    }
  },
	data () {
    return {
      // questions: [createNewQuestion()],
      requiredFieldValidator: 'required|min:2', // used for every text field (yes, no is allowed --> length 2) // alpha_num removed --> to allow -?...
      showQuestions: false,
      submitted: false,
      first: true, // first focuse input of first question
      focussed: {
        0: {
          0: false
        }
      } // storing current focus option with key 'qIndex: { index : true/false }'
    }
  },
  firebase: {

  },
  computed: {
    ...mapState({
        // quiz: state => state.quiz,
        questions: state => state.quiz.questions,
        postKey: state => state.postKey
    })
  },
  created() {
    this.loadData();
  },
  // mounted() {
  //   // this.$watch('$route', this.loadData) //this.clearErrors)
  // },
  methods: {
    loadData() {
      console.log('loading data', this.$store.state.postKey )
      let quizRef = db.ref('/resources/' + this.$store.state.postKey + '/quiz');
      this.$firebaseRefs['fbQuestions'] = quizRef;
      this.$bindAsObject('fbQuestions', quizRef);

      quizRef.once('value').then((snapshot) => {
        // init questions
        // console.log('loading questions', this.questions);
        const questions = (snapshot.val() || [createNewQuestion()]);
        console.log('loaded questions', questions);
        // vuefire would be only bound to local state --> dispatch so we have it on store
        this.$store.dispatch('updateQuestions', questions); // mutate store to init. questions array (dispatch because this is asynch.)
        
        // clear errors if any
        this.clearErrors();

        this.submitted = false;

        // custom validator for checkboxes
        this.$validator.remove('oneChecked'); // remove validator to avoid error message

        this.$validator.extend('oneChecked', {
          getMessage: field => 'At least one ' + field + ' needs to be checked.',
          validate: (value, [index, testProp]) => {
            const options = this.questions[parseInt(index)].options;
            // console.log('questions', value, testProp, options.some((option) => option[testProp]));
            return value || options.some((option) => option[testProp]);
          }
        });
      });
    },
    backspaceDelete(evt, question, option) {
      // keyboard handler if option is empty and delete is pressed + more than one option available
      console.log('cleared char')
      if ( option.text.length === 0 && question.options.length > 1 ) {
        evt.preventDefault(); // avoid delete in next input field
        this.removeOption(question, option);
        let qindex = this.questions.indexOf(question);
        let last = this.questions[qindex].options.length - 1;
        this.focussed[qindex][last] = true; // move focus back.
      }
    },
    toggle(qindex, index) {
      // console.log(option);
      this.$store.commit('toggleQuestionOption', {qindex, index});
      // let option = this.questions[qindex].options[index];
      // option.isAnswer != option.isAnswer;
      // console.log(option);
    },
    clearErrors() {
      this.$nextTick(() => {
        this.fields.reset();
        this.errors.clear();
      })
    },
    beforeSubmit(e) {
      this.$validator.validateAll();

      this.questions.forEach((question, index) => {
        question.options.forEach((option) => {
          // console.log(`check${index}`, index, option.isAnswer);
          this.$validator.validate('check' + index, option.isAnswer, [index, 'isAnswer']);
        });
      });

      // console.log('validator', this.errors);
      if (!this.errors.any()) {
          this.saveToFirebase(e);
      } 
    },
    testQuiz() {
      this.$store.commit('modalToggle', this.$refs.quizTestModal.$el); 
    },
    addQuestion () {
    	this.questions.push(createNewQuestion());
    },
    removeQuestion (index) {
      this.questions.splice(index, 1);
    },
    addOption (question, qindex) { // remove question prop
      // let index = this.questions.indexOf(question);
      console.log('add opt', qindex, this.questions)
    	this.questions[qindex].options.push(createNewOption());
      let last = this.questions[qindex].options.length - 1;
      if (qindex >= 0) {
        this.focussed[qindex] = this.focussed[qindex] || {}; // default to empty obj.
        this.focussed[qindex][last] = true;
        console.log(this.focussed);
      }
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
      this.submitted = true;

      // console.log('save', this.questions);
      var fbQuestionRef = this.$firebaseRefs['fbQuestions'].set(this.questions); //vuefire to update questions

      // add createdAt date
      db.ref('/resources/' + this.$store.state.postKey).update({
        createdAt: Firebase.database.ServerValue.TIMESTAMP, // --> adds create date
      });
      
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