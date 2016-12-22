<template v-if="this.userInfo">
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <img class="profile-pic" :src="userInfo.profileURL" alt="User image">
          </div>
          <div class="col-md-10">
            <h1 class="display-name">{{userInfo.displayName}}</h1>
            <p class="lead"></p>
            <badge :users="users"></badge>
          </div>
        </div>
      </div>
    </div>
    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-center">
          <a class="nav-item is-tab is-active" style="color: #f16233">Passed resources</a>
          <a class="nav-item is-tab" style="color: #f16233">Created resources</a>
        </div>
      </div>
    </nav>
    <created-resources :userInfo="userInfo"></created-resources>
  </div>
</template>

<script>
var db = firebase.database();
import store from '../store'
import CreatedResources from '../components/CreatedResources'
import Badge from '../components/Badge'
import { mapState } from 'vuex'

export default {
  name: 'profile',
  // Insead of using info from state use info from Firebase!!!!!!!
  computed: mapState({
      userInfo: state => state.userInfo
  }),
  components: { 
    CreatedResources,
    Badge
  },
   firebase: {
    users: db.ref().child('users' + store.state.userInfo.uid)
  } 
}
</script>

<style scoped>
.profile-pic {
  border-radius: 50%
}
.jumbotron {
  background-color: white;
  margin-bottom: 0px
}
.nav-item:hover {
  color: #f16233
}
.display-name {
  font-size: 28px
}
</style>