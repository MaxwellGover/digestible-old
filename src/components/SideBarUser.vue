<template>
	<div class="side-bar-item">
	    <img class="side-bar-img" :src="user.profilePicture" alt=""/>
	    <router-link class="user-link" :to="'/profile/' + user['.key']">{{user.name}}</router-link>
	</div>
</template>

<script>

export default {
	name: 'SideBarUser',
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
  .user-link {
    color: #8f8f8f;
    font-size: 14px;
    text-decoration: none
  }
  .user-link:hover {
    color: #000;
  }
</style>