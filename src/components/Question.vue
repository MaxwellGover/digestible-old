<template>
  <div class="question container">
    <h2>I am a question</h2>
  </div>
</template>

<script>

var db = firebase.database();
import store from '../store'
import Vue from 'vue'

export default {
  name: 'question',
  props: ['resource']
}
</script>

<style>

</style>