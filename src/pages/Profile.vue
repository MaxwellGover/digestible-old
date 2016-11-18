<template v-if="this.userInfo">
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <img class="profile-pic" src="userInfo.profileURL" alt="User image">
          </div>
          <div class="col-md-10">
            <h1 class="display-5">{{userInfo.displayName}}</h1>
            <p class="lead"></p>
          </div>
        </div>
      </div>
    </div>
    <created-resources :userInfo="userInfo"></created-resources>
  </div>
</template>

<script>
var db = firebase.database();
import store from '../store'
import CreatedResources from '../components/CreatedResources'
import { mapState } from 'vuex'

export default {
  name: 'profile',
  computed: mapState({
      userInfo: state => state.userInfo
  }),
  components: { 
    CreatedResources
  }
}
</script>

<style>
.profile-pic {
  border-radius: 50%
}
.jumbotron {
  background-color: white;
  margin-bottom: 0px
}
</style>