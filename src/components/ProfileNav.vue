<template>
  <div class="profile-nav">
    <nav class="nav nav-inline container">
      <a class="nav-link active" href="#">Created Resources</a>
      <a class="nav-link" href="#">Passed Resources</a>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'profile-nav',
}
</script>

<style>
.nav {
  text-align: center;
}
.nav-link {
  color: #ffcc00
}
.profile-nav {
  background-color: white;
  padding-bottom: 20px
}
</style>