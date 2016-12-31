// import VuexFire from 'vuexfire'

const quiz = {
    state: {
        answeredQuestions: [],
        submittedStatus: null,
        selectedCount: 0, // number of selected answers
        result: {
            // correctCount: 0, // --> computed property of correctIds.length
            correctIds: [], // storage for correct count
            // example correctId elements:
            // [{
            //     quizIndex:0
            //     index: 0
            // }]
            selectedCount: 0 // store alle selected checkboxes
        },
        resource: {},
        questions: []
    },
    getters: {
    // submittedStatus: state => state.submittedStatus
      score (state) {
        console.log('getter', state);
        if ( state.resource.quiz === undefined ) return; 

        let isAnswer = (option) => option.isAnswer===true;
        let totalCorrectAnswers = 0;

        state.resource.quiz.forEach((question) => {
            totalCorrectAnswers += question.options.filter(isAnswer).length;
        });

        let selected = state.selectedCount;
        let incorrectCount = (selected > totalCorrectAnswers) ? selected - totalCorrectAnswers: 0; 
        let correctCount = state.result.correctIds.length;

        let amount = correctCount - incorrectCount;
        
        if (amount < 0) { 
          amount = 0;
        }

        return {
          amount,
          total: totalCorrectAnswers // total correct answer count - used to calculated messages
        };
      }
    },
    actions: {
        initQuestions({commit}, initData) {
            console.log('initQuestions', initData);
            commit('mutateQuestions', initData);
        },
        updateResource({commit}, resource) {
          commit('mutateResource', resource);
        },
        prepareAnswerList({commit}, resource) {
          commit('mutateAnswerList', resource);
        }
    },
    mutations: Object.assign({}, 
        // VuexFire.moduleMutations('quiz'),
        {
            /**
             * Prepare answer array
             * @input resource
             */
            mutateAnswerList(state, resource) {
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
            mutateResource(state, resource) {
              state.resource = resource;
            },
            mutateQuestions(state, questions) {
                state.questions = questions;
            },
            displayAnswers(state) {
                state.submittedStatus = true
            },
            resetForm(state) {
                state.submittedStatus = false;
                state.result = {
                    correctIds: [],
                    selectedCount: 0
                };
            },
            markAnswer(state, {questionIndex, index, value}) {
                // console.log('mark question', questionIndex, index, value);
                state.answeredQuestions[questionIndex].answers[index].selected = value;

                if (value) {
                    state.result.selectedCount++;
                } 
                else
                {
                    if ( state.result.selectedCount > 0 ) {
                        state.result.selectedCount--;
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
    )
}

export default quiz