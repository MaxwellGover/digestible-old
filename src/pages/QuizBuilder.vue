<template>
	<div class="quiz-builder container">
  
    <div class="box" v-for="(question, index) in questions">
      <div style="width: 95%">
      <label class="label" style="margin-bottom: 10px">Question {{index++}}</label>
      <p class="control is-grouped">
        <textarea class="textarea" type="text" placeholder="Enter a question"  v-model="question.text"></textarea>
        <a class="button is-danger is-medium is-outlined" style="margin-left: 10px" @click="removeQuestion(index)">
          <span style="color: #ff3860">X</span>
        </a>
      </p>
      </div>
      </br>
      <div class="input-group" v-for="(option, index) in question.options" style="margin-bottom: 20px">
        <p class="control is-grouped">
          <input class="checkbox" type="checkbox" v-model="option.isAnswer">
          <input class="input is-medium is-expanded" type="text" placeholder="Enter an option" v-model="option.text">
          <a class="button is-danger is-medium is-outlined" style="margin-left: 10px" @click="removeOption(question, option)">
            <span class="remove" style="color: #ff3860">X</span>
          </a>
        </p>
      </div>
      <a class="add-option button is-white" @click="addOption(question)"><span class="remove" style="color: #f16233">Add an option</span></a>
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
  	options: [createNewOption()]
  }
}

export default {
  name: "quiz-builder",
	data () {
    return {
      questions: [createNewQuestion()],
      showQuestions: false,
      show: true
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  background-color: #f16233;
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
  border-color: #f16233;
}
.add-question-btn {
  border-color: #f16233;
  padding: 15px;
}
.add-question-text {
  color: #f16233;
}
.button-text {
  color: #fff
}
.remove:hover {
  color: #fff;
}
.input:focus {
  border-color: #f16233;
}
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px;
}
</style>