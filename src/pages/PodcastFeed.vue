<template>
	<div class="container">
		<resource-card v-for="(resource, index) in resources" v-if="resource.type === 'podcast'" :resource="resource" :showLearn="showLearn"></resource-card>
	</div>
</template>

<script>
import ResourceCard from '../components/ResourceCard'
import Vue from 'vue'
import VueFire from 'vuefire'
// var db = firebase.database();
import db from '../db'

Vue.use(VueFire)

export default {
	name: 'type-feed',
	components: {
		ResourceCard
	},
	firebase() {
    	return {
      		resources: db.ref().child('resources'),
    }
  },
  data () {
		return {
			showLearn: true
		}
	},
}
</script>

<style scoped>
	.none {
		font-size: 32px;
		margin-top: 40px;
		
	}
	.none-messasge {
		display: flex;
		flex-direction: column;
		align-items: center
	}
	.button {
		align-self: center;
		margin-top: 40px;
	}
</style>
