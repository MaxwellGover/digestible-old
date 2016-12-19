const state = {
    answeredQuestions: [],
    submittedStatus: null,
    selectedCount: 0, // number of selected answers
    result: {
        // correctCount: 0, // --> computed property of correctIds
        correctIds: [], // storage for correct count
        // [{
        //     quizIndex:0
        //     index: 0
        // }]
    }
}

const getters = {
    // submittedStatus: state => state.submittedStatus
}

const actions = {
    
}

const mutations = {
    /**
     * Prepare answer array
     * @input resource
     */
    prepareAnswerList(state, resource) {
        console.log('prepareAnswerList', resource);
        let answers = resource.quiz.map((question, index) => {
			console.log('question prepare', question);
			return {
					// question
					id: index,
					answers: question.options.map((option, idx) => {
							return {
								id: idx, // create id based on index in array --> would be better if we would hava a uuid
								selected: undefined, // undefined so we can checck if answer is selected
                                isAnswer: option.isAnswer
							};
					})
			};
		});

        state.answeredQuestions = answers;
    },
    displayAnswers(state) {
        state.submittedStatus = true
    },
    resetForm(state) {
        state.submittedStatus = false;
    },
    markAnswer(state, {questionIndex, index, value}) {
        // console.log('mark question', questionIndex, index, value);
        state.answeredQuestions[questionIndex].answers[index].selected = value;
        if (value) {
            state.selectedCount++;
        } 
        else
        {
            if ( state.selectedCount > 0 ) {
                state.selectedCount--;
            }
        }

        state.submittedStatus = false;
    },
    addCorrectCount(state, answer) {
        // let index =  state.result.correctIds.filter((answer) => answer).length;
        // console.log('addcorrect', index);
        let append = (newData, arr) => {
            //console.log('append', newData, arr);
            let exists = arr.filter((obj) => obj.index === newData.index && obj.quizIndex === newData.quizIndex).length;

            if (!exists) {
                //console.log('new data', arr.indexOf(newData) );
                arr.push(newData);
            }
            return arr;
        }

        append(answer, state.result.correctIds);
        // if (index === 0) {
        // state.result.correctIds.push(answer);
        // }
    },
    removeCorrectCount(state, answer) {
        let delIndex = state.result.correctIds.indexOf(answer);
        if (delIndex > -1) {
            state.result.correctIds.splice(delIndex, 1);
        }
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}