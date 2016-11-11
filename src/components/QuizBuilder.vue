<template>
	<div class="quiz-builder container">
    <h4 class="quiz-header">Build your quiz!</h4>
    <div class="alert alert-info alert-dismissible fade in" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    <strong>Quick tip:</strong> Questions should cover the main points from your resource that you want the user to remember!
    </div>
    <div v-for="question in questions">
      <div class="input-group">
        <input type="text" class="form-control" v-model="question.text" placeholder="Enter a question">
        <span class="input-group-btn">
          <button class="btn btn-secondary" type="button" @click="addOption(question)">Add an option</button>
        </span>
      </div>
      </br>
      <div class="input-group" v-for="option in question.options" style="margin-bottom: 20px">
        <span class="input-group-addon">
          <input type="checkbox" v-model="option.isAnswer">
        </span>
        <input type="text" class="form-control" v-model="option.text" placeholder="Enter an option">
        <span class="input-group-btn">
          <button class="btn btn-danger" type="button">X</button>
        </span>
      </div></br>
    </div>
    <button class="btn btn-default" @click="addQuestion" :disabled="questions.length >= 5 ? true : false">
      Add another question
    </button>
    <button class="btn btn-primary" @click="saveToFirebase" style="background-color: #ffcc00; border: #ffcc00">
      Create quiz
    </button>
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
    }
  },
  methods: {
    addQuestion () {
    	this.questions.push(createNewQuestion())
    },
    addOption (question) {
    	question.options.push(createNewOption())
    },
    saveToFirebase (e) {
    	e.preventDefault();
      var updates = {};
      updates['/resources/' + store.state.postKey + '/quiz/'] = this.questions;
      updates['/users/' + store.state.userInfo.uid + '/createdResources/' + store.state.postKey + '/quiz/'] = this.questions;

      return firebase.database().ref().update(updates);

      store.state.postyKey = ''
      
      console.log('Saving quiz data...')	
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.quiz-builder {
  margin-top: 60px;
  width: 800px;
}
.quiz-header {
  margin-bottom: 20px;
  text-align: center
}
.alert {
  margin-bottom: 40px
}
</style>