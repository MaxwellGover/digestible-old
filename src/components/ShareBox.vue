<template>
    <div class="share-box box">
    	<p class="share-box-header"><b>FIND DIGESTIBLE HELPFUL? SHARE US WITH YOUR FRIENDS!</b></p>
    	<social 
    		class="social-links"
    		url="http://www.digestible.io"
    		title="Digestible"
    		description="Digestible is an online learning platform that lets you discover online articles, videos, and podcasts then helps you retain their important information."
    		hashtags="digestible"
    		twitter-user="digestible"
    		inline-template>
    		<div class="icons">
    			<facebook class="icon">
    				<i class="fa fa-facebook"></i>
    			</facebook>
    			<twitter class="icon">
    				<i class="fa fa-twitter"></i>
      			</twitter>
      			<linkedin class="icon">
    				<i class="fa fa-linkedin"></i>
      			</linkedin>
    		</div>
    	</social>
    </div>
</template>

<script>
var social = require('vue-social-sharing');

    export default {
       name: 'ShareBox',
       components: {
           social
       }
   } 
</script>

<style scoped>
    .share-box {
		display: flex;
		flex-direction: column;
		align-content: center;
		padding: 20px;
		margin-bottom: 20px;
    }
    .share-box-header {
        margin-bottom: 20px;
    }
</style>