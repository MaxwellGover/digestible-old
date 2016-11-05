<template>
  <div id="app">
    <nav class="navbar navbar-light bg-faded">
      <ul class="nav navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="#"><h4>Digestible <span class="sr-only">(current)</span></h4></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" style="color: #ffcc00">Create a quiz</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Study</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Maxwell Gover
          </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
        </li>
      </ul>
    </nav>
    <quiz-builder></quiz-builder>
  </div>
</template>

<script>
import Home from './components/Home'
import ResourceInfo from './components/ResourceInfo'
import Profile from './components/Profile'
import QuizBuilder from './components/QuizBuilder'

export default {
  name: 'app',
  components: {
    Home,
    ResourceInfo,
    Profile,
    QuizBuilder
  }
}
</script>

<style>
#app {
  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.navbar {
  background-color: white;
}
</style>
