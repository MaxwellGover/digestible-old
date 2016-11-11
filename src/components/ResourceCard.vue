<template>
	<div class="card card-block">
    <h4 class="card-title">{{resource.title}}</h4>
    <p class="card-text">{{resource.description}}</p>
    <a href="#" class="card-link">Learn</a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'resource-card',
  props: ['resource'],
  computed: mapState({
    userInfo: state => state.userInfo
  })
}
</script>

<style scoped>
.card {
  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* text-align: left; */
  margin-top: 60px;
}
.author-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}
.fa {
  color: #42f477
}
</style>