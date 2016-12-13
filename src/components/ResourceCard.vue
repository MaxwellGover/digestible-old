<template>
	<div class="card card-block">
    <div class="row">
      <div class="col-md-1">
        <img :src="resource.authorImage" style="width: 50px; height: 50px;">
      </div>
      <div class="col-md-11">
        <p>{{resource.authorName}}</p>
      </div>
    </div>
    <h4 class="card-title">{{resource.title}}</h4>
    <p class="card-text">{{resource.description}}</p>
    <h6><span class="tag tag-default" v-for="tag in resource.tags" style="margin: 2px; color: #525252; padding: 10px; background-color: #F0F0F0">{{tag.text}}</span></h6>
    <a href="#" class="card-link" style="margin-top: 10px">Learn</a>
    <!--<router-link :to="{name: 'info', params: {key: resource['.key']}}" class="card-link" style="margin-top: 10px">Learn</router-link>-->
    <h5 style="margin-top: 10px">{{resource.timesPassed}}</h5>
    <!--{{resource['.key']}}-->
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