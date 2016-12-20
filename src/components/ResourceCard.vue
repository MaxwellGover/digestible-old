<template>
  <div class="card is-fullwidth">
  
    <header class="card-header">
      <img class="user-image" :src="resource.authorImage" alt=""/>
      <p class="card-header-title">
        <a href="#" class="author-link">{{resource.authorName}}</a>
        <small>11:09 PM - 1 Jan 2016</small>
      </p>
    </header>
    
    <div class="card-content">
      <div class="content">
        <h1>{{resource.title}}</h1>
        <p>{{resource.description}}</p>
        <a class="button is-outlined">
          <span class="button-text" style="color: #f16233; color:hover: #f16233">
            Learn
          </span>
        </a>
      </div>
    </div>
    
    <footer class="card-footer">
       <img class="icon" src="../assets/passed-icon.png" title="Number of times this quiz has been passed" alt=""/>
      {{resource.timesPassed}}
  </footer>

  </div>
  <!--
  <div class="card">
    <h6 class="card-header">
      <img class="user-image" :src="resource.authorImage" alt=""/>
      <a href="#" class="user-name">{{resource.authorName}}</a>
    </h6>
    <div class="card-block">
      <h3 class="card-title">{{resource.title}}</h3>
      <p class="card-text">{{resource.description}}</p>
      <a href="#" class="card-btn btn btn-primary">Learn</a>
      <a class="button is-danger">Danger</a>
    </div>
    <div class="footer card-block">
      <img class="icon" src="../assets/validate.png" alt=""/>
      {{resource.timesPassed}}
    </div>
  </div>
  -->
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
  width: 800px;
}
.card-header {
  background-color: #fff;
  border-bottom: none
}
.card-header-title {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-bottom: none;
}
.user-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: 5px;
  align-self: center;
}
.button {
  border-color: #f16233;
  color: #f16233;
}
.button:hover {
  background-color: #f16233;
  border-color: #f16233;
}
.button-text:hover {
  color: #fff;
  text-decoration: none;
}
.card-footer {
  display: flex;
  align-items: center;
  background-color: #fafafa
}
.icon {
  height: 70px;
  width: 70px;
  margin-left: -20px;
  margin-right: -5px;
}
.author-link {
  color: #f16233;
  text-decoration: none
}
.user-name {
  color: #4e30f9;
}
.user-name:hover {
  text-decoration: none;
}
</style>