<template>
	<div class="card">
    <div class="card-block">
      <div class="row">
        <div class="col-md-1">
          <img class="author-image" src="../assets/profile.png" alt="User image">
        </div>
        <div class="col-md-11">
          <h4 class="card-title">Teaching React Without Using React.</h4>
          <h6 class="card-subtitle text-muted">Eric Clemmons</h6>
        </div>
      </div>
    </div>
    <img class="card-image img-fluid" src="../assets/code.jpg" alt="Resource image">
    <div class="card-block">
      <p class="card-text"></p>
      <a href="#" class="card-link">Learn</a>
    </div>
 	</div>
</template>

<script>

export default {
  name: 'resource-card',
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
.card-image {
  width: 100%;
  height: 350px;
}
.author-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}
</style>