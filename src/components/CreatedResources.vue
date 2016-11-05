<template>
  <div class="created-resources container">
    <resource-card></resource-card>
  </div>
</template>

<script>
import ResourceCard from './ResourceCard'

export default {
  name: 'created-resources',
  components: { ResourceCard }
}
</script>

<style>
.created-resources {
  width: 700px
}
</style>