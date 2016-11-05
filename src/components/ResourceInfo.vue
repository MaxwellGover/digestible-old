<template>
  <div class="resource-info container">
    <form id="resource-info">
      <div class="form-group">
        <label for="type">This quiz is for (required)</label>
        <select id="type" class="form-control">
          <option value="article">An online article</option>
          <option value="book">A chapter in a book</option>
          <option value="video">A video</option>
          <option value="podcast">A podcast</option>
        </select>
      </div>
      <div class="form-group">
        <label for="title">Resource title (required)</label>
        <input type="text" class="form-control" id="title">
        <small id="title-help" class="form-text text-muted">Enter the title of your resource.</small>
      </div>
      <div class="form-group">
        <label for="url">Resource link (required)</label>
        <input type="url" class="form-control" id="url">
        <small id="url-help" class="form-text text-muted">Copy and paste the url to your resource.</small>
      </div>
      <div class="form-group">
        <label for="desc">Resource description (optional)</label>
        <textarea class="form-control" id="desc"></textarea>
        <small id="desc-help" class="form-text text-muted">Enter a short description of your resource.</small>
      </div>
      <div class="form-group">
        <label for="categories">Resource categories</label>
        <input type="text" class="form-control" id="categories">
        <small id="category-help" class="form-text text-muted">Help users find your resource by adding some categories.</small>
      </div>
      <button type="submit" class="btn btn-primary" id="next-button" style="float: right; background-color: #ffcc00; border: none">Next</button>
    </form>
  </div>
</template>

<script>

export default {
  name: 'resource-info'
}
</script>

<style>
.resource-info {
  margin-top: 40px;
  width: 700px
}
</style>