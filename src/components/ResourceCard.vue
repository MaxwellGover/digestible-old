<template>
  <div class="card">
    <h6 class="card-header">
      <img class="user-image" :src="resource.authorImage" alt=""/>
      <a href="#" class="user-name">{{resource.authorName}}</a>
    </h6>
    <div class="card-block">
      <h3 class="card-title">{{resource.title}}</h3>
      <p class="card-text">{{resource.description}}</p>
      <a href="#" class="card-btn btn btn-primary">Learn</a>
      <router-link class="card-btn btn btn-primary" :to="{name: 'quiz', params: { resourceId: resource['.key'] }}">quiz</router-link>
      <!--<router-link :to="{name: 'info', params: {key: resource['.key']}}" class="card-link" style="margin-top: 10px">Learn</router-link>-->
      <!--{{resource['.key']}}-->
    </div>
    <div class="footer card-block">
      <img class="icon" src="../assets/validate.png" alt=""/>
      {{resource.timesPassed}}
    </div>
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
  margin-right: 20px;
  margin-top: 40px;
}

.card-header {
  display: flex;
  padding: 15px;
  align-items: center;
  background-color: #fff;
  border-bottom: none;
}

.user-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: 20px
}
.card-btn {
  border-radius: 2px;
  background-color: #4e30f9;
}
.footer {
  display: flex;
  align-items: center;
}
.icon {
  height: 70px;
  width: 70px;
  margin-left: -20px;
}
.user-name {
  color: #4e30f9;
}
.user-name:hover {
  text-decoration: none;
}
</style>