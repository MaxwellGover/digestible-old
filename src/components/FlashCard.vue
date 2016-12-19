<template>
    <div class="card alert alert-info">
        <h2>Your results</h2>
        <p>{{scoreText}} - <strong>score {{score.amount / score.total * 100}}%</strong></p>
        <!--{{score}}-->
    </div>
</template>

<script>
    const scoreMessages = {
        0: 'Poor result. Please try again and check the resources for help',
        50: 'Not bad. But you can do better. Try again.',
        80: 'Very good result.',
        90: 'Perfect result'
    };

    export default {
        props: ['message', 'score'],

        computed: {
            scoreText: (state) => {
                console.log('flash', state);
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