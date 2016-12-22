<template>
	<div class="side-bar-item">
	    <img class="side-bar-img" :src="user.profilePicture" alt=""/>
	    {{user.name}}
	</div>
</template>

<script>

export default {
	name: 'side-bar',
	props: ['user'],
	data () {
	  return {};  
	}
};
</script>

<style scoped>
  .side-bar-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
  }
  .side-bar-img {
    margin-right: 10px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
</style>