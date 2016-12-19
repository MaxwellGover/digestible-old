<template>
    {{correctAnswerCount}}
    <div class="question">
        <h1>{{quiz.text}}</h1>
        <div class="form-group" v-for="(option, index) in quiz.options" :class="answers[quizIndex].answers[index].style = isCorrectAnswer(quizIndex, index)">
            <div class="checkbox">
                <label>
                    <!--<input type="checkbox" name="question" v-model="answers[option.text.replace(/\s+/g, '')][index]"/>{{option.text}}-->
                    <input type="checkbox" 
                        name="question"
                        :true-value="true"
                        :false-value="false" 
                        @click="select(quizIndex, index, answers[quizIndex].answers[index].selected)"/>{{option.text}}
                        <!--v-model="answers[quizIndex].answers[index].selected"-->
                    <!--<input type="checkbox" name="question"/>{{option.text}}-->
                    <!--{{answers[quizIndex].answers[index].selected}}-->
                </label>
                <i class="fa fa-check-circle-o fa-2x pull-right" v-if="submitted && answers[quizIndex].answers[index].style === 'correct'"></i>
                <i class="fa fa-exclamation-circle fa-2x pull-right" v-if="submitted && answers[quizIndex].answers[index].style === 'wrong-answer'"></i>
            </div>
            <!--{{selected[index].selectedAnswer}}-->
            <!--{{answers[quizIndex]}}-->
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        props: ['quiz', 'quizIndex', 'submitted', 'resource'],
        computed: {
            ...mapState({
			    answers: state => state.quiz.answeredQuestions,
                // submitted: state => state.quiz.submittedStatus
	    	})
        },
        data() {
            console.log('question', this.resource);
            this.$store.commit('prepareAnswerList', this.resource);

            return {

            };
        },
        methods: {
            isCorrectAnswer(quizIndex, index) {
                const styleClasses = {
                    0: 'wrong-answer',
                    1: 'correct'
                };

                if (this.submitted) {
                    // console.log('iscorrect?',quizIndex, index,  this.$store.state.quiz.answeredQuestions);
                    let answer = this.answers[quizIndex].answers[index]; // todo better naming!!

                    let correctAnswer = answer.selected && (answer.selected === answer.isAnswer);
                    let incorrecctAnswer = answer.selected && (answer.selected !== answer.isAnswer);
                    let answerObj = {quizIndex, index};
                    let style = '';

                    // console.log('stlye check', incorrecctAnswer, correctAnswer);

                    if (correctAnswer) {
                        this.$store.commit('addCorrectCount', answerObj);
                        // if ( this.$store.state.quiz.result.correctIds.indexOf(answerObj) === 0 ) {
                        //     this.$store.state.quiz.result.correctIds.push(answerObj); //<<<<<<<<<<<<<<<<<<<<< fix me - mutates state
                        // }
                        style = styleClasses[1];
                    }
                    else {
                        // if( this.correctAnswerCount > 0) {
                        //     let delIndex = this.$store.state.quiz.result.correctIds.indexOf(answerObj) ;
                        //     if (delIndex !== -1) {
                        //         this.$store.state.quiz.result.correctIds.splice(delIndex, 1); //<<<<<<<<<<<<<fix me - mutates state
                        //     }
                        this.$store.commit('removeCorrectCount', answerObj);
                        
                        if (incorrecctAnswer) {
                            style = styleClasses[0];
                        }
                        // }
                    }
                    // console.log('style selected', style);
                    return style;
                }

                return; // not submitted
            },
            select(questionIndex, index, value) {
                // console.log(questionIndex, index);
                value = !value; // toggle value
                this.$store.commit('markAnswer', {questionIndex, index, value});
            }
        }
    }
</script>

<style>
    .correct {
        border: 1px solid green !important;
    }

    .wrong-answer {
        border: 1px solid red !important;
    }

</style>