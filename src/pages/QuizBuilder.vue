<template>
	<div class="quiz-builder container">
  
    <div class="box" v-for="(question, index) in questions">
      <div style="width: 95%">
      <label class="label" style="margin-bottom: 10px">Question {{index++}}</label>
      <p class="control is-grouped">
        <textarea class="textarea is-medium" type="text" placeholder="Enter a question"  v-model="question.text"></textarea>
        <a class="button is-danger is-medium is-outlined" style="margin-left: 10px" @click="removeQuestion(index)">
          <span style="color: #ff3860"><i class="fa fa-trash-o 5x" aria-hidden="true"></i></span>
        </a>
      </p>
      </div>
      </br>
      <div class="input-group" v-for="(option, index) in question.options" style="margin-bottom: 20px">
        <p class="control is-grouped">
          <input class="checkbox" type="checkbox" v-model="option.isAnswer">
          <input class="input is-medium is-expanded" type="text" placeholder="Enter an option" v-model="option.text">
          <a class="button is-danger is-medium is-outlined" style="margin-left: 10px" @click="removeOption(question, option)">
            <span class="remove" style="color: #ff3860"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
          </a>
        </p>
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
 	</div>
</template>


<script>

// TODO: Add functionality to alert

import store from '../store'

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
	data () {
    return {
      questions: [createNewQuestion()],
      showQuestions: false,
    }
  },
  methods: {
    addQuestion () {
    	this.questions.push(createNewQuestion())
    },
    removeQuestion (index) {
      this.questions.splice(index, 1)
    },
    addOption (question) {
    	question.options.push(createNewOption())
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
      var updates = {};
      updates['/resources/' + store.state.postKey + '/quiz/'] = this.questions;
      updates['/users/' + store.state.userInfo.uid + '/createdResources/' + store.state.postKey + '/quiz/'] = this.questions;

      return firebase.database().ref().update(updates);

      // store.state.postyKey = '' // How do I put his before the return statement without it erasing key?

      // Push to route {{ $route.params.resourceId }}
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
  color: #fff;
}
.input:focus {
  border-color: #006ce4;
}
.textarea:focus {
  border-color: #006ce4;
}
</style>