<template>
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <img class="profile-pic" src="../assets/profile.png" alt="User image">
          </div>
          <div class="col-md-10">
            <h1 class="display-5">Eric Clemmons</h1>
            <p class="lead">Creator of React Resolver, Genesis/Evolution for WordPress. Purveyor of a better Developer Experience.</p>
          </div>
        </div>
      </div>
    </div>
    <profile-nav></profile-nav>
    <created-resources></created-resources>
  </div>
</template>

<script>
import ProfileNav from './ProfileNav'
import CreatedResources from './CreatedResources'

export default {
  name: 'profile',
  components: { 
    ProfileNav,
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