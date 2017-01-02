// Import Vue and the component being tested
import Vue from 'vue'
import SpacedRepetitionComponent from 'src/components/SpacedRepetition.vue'

describe('SpacedRepetition.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(Hello)
    })
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})