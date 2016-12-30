<template>
	<div class="badge">
	  I'm a badge
	</div>
</template>

<script>

export default {
	name: 'badge',
	props: ['users'],
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