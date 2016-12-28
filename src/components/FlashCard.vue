<template>
    <div class="notification" v-if="visible" transition="expand">
        <h2 class="message">{{message}}</h2>
        <p class="result">{{scoreText}} <strong> {{score.amount / score.total * 100}}%</strong></p>
        <hr>
        <p>Once you have answered all questions in a quiz correctly the resource will be added to your profile so other users can see what you've been learning! Correctly answered questions are also saved so you can study them later.</p>
    </div>
</template>

<script>
    const scoreMessages = {
        0: '',
        50: '',
        80: '',
        90: ''
    };

    export default {
        props: {
            score: { type: Object }, 
            visible: { type: Boolean, default: true },
            message: { type: String, default: 'Your results' }
        },
        computed: {
            scoreText: (state) => {
                // console.log('flash', state);
                let score = state.score;
                let rel = score.amount / score.total * 100;
                let text = '';

                if (rel < 50) {
                    text = scoreMessages[0];
                }
                else if (rel < 80) {
                    text = scoreMessages[50];
                }
                else if (rel < 90) {
                    text = scoreMessages[80];
                }
                else {
                    text = scoreMessages[90];
                }
                
                return text;
            }
        }
    }
</script>

<style>
    .message {
        font-size: 18px;
    }

    .result {
        font-size: 18px;
    }

    .note {
        margin-top: 20px
    }
</style>