<script>
  // copy from vue-input-tag (MIT licence)
  // --> added typeahead
  import _ from 'lodash'
  import VueTypeahead from 'vue-typeahead'
  import db from '../db'

  export default {
    name: 'InputTag',
    mixins: [
      VueTypeahead
    ],
    props: {
      tags: {
        type: Array,
        default: () => [],
      },
      placeholder: {
        type: String,
        default: '',
      },
      onChange: {
        type: Function,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      query() {
        return this.newTag;
      }
    },
    data() {
      return {
        newTag: '',
        // The source url
        // (required)
        // src: 'https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search',
        limit: 5,
        minChars: 3
      };
    },
    methods: {
      focusNewTag() {
        if (this.readOnly) { return; }
        this.$el.querySelector('.new-tag').focus();
      },
      addNew(tag) {
        if (tag && !this.tags.includes(tag)) { //&& !this.items.length) {
          this.tags.push(tag);
          this.tagChange();
          this.newTag = '';
        }
      },
      remove(index) {
        this.tags.splice(index, 1);
        this.tagChange();
      },
      removeLastTag() {
        // if (this.newTag) { return; }
        if (this.query) { return; }
        this.tagChange();
        this.tags.pop();
      },
      getPlaceholder() {
        if (!this.tags.length) {
          return this.placeholder;
        }
        return '';
      },
      tagChange() {
        if (this.onChange) {
          // avoid passing the observer
          this.onChange(JSON.parse(JSON.stringify(this.tags)));
        }
      },
      fetch () { // typeahead fetch
        // let items = [
        //   { name: 'abc' },
        //   { name: 'aabc' },
        //   { name: 'aaabc' },
        //   { name: 'aaaabc' }
        // ]
        // return Promise.resolve({
        //   data: items.filter((item) => {
        //     return item.name.startsWith(this.query)
        //   })
        // })
        let tagsRef = db.ref('tags');

        return new Promise((resolve, reject) => {
            // _.debounce(() => {
              console.log('firebase call');
              // return tagsRef.orderByChild('name').once('value').then((snapshot) => {
              return tagsRef.once('value').then((snapshot) => {
                // tags stored like this
                // tagName: {authorId}, tagName2: {authorId}, ...
                let data = snapshot.val() || [];
                console.log('firebase data', data);
                // let keys = Object.keys(data).filter((key) => data[key].name.startsWith(this.query));
                let tags = Object.keys(data).filter((key) => key.startsWith(this.query));
                // let tags = keys.map((key) => {
                //   return {
                //     '.key': key, ...data[key]
                //   };
                // });
                console.log(tags)
                resolve({
                  data: tags
                });
              });
            // }, 500);
        })
      },
      onHit(item) {
        console.log('typeahead', item);
        // this.addNew(item);
        if (!this.tags.includes(item)) {
          this.tags.push(item);
          this.tagChange();
        }
        this.newTag = '';
        this.reset(); // reset Typeahead
      },
    },
  };
</script>

<template>
  <div class="Typeahead">
      <i class="fa fa-spinner fa-spin" v-if="loading"></i>
      <template v-else>
        <i class="fa fa-search" v-show="isEmpty"></i>
        <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
      </template>

      <!--input here -->
      <div @click="focusNewTag()" v-bind:class="{'read-only': readOnly}" class="vue-input-tag-wrapper">
        <span v-for="(tag, index) in tags" class="input-tag">
          <span>{{ tag }}</span>
          <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
        </span>
        <input v-if="!readOnly" v-bind:placeholder="getPlaceholder()" type="text" v-model="newTag" v-on:keydown.delete.stop="removeLastTag()" 
            v-on:keydown.enter.prevent.stop="addNew(newTag)"
            class="new-tag Typeahead__input"
            autocomplete="off"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.enter="hit"
            @keydown.esc="reset"
            @blur="reset"
            @input="update"/>
      </div>
            <!--@change="onChange"-->
            <!--removed normal on enter -> fetch triggered by typeahead-->
            <!--v-on:keydown.enter.prevent.stop="addNew(newTag)" -->
      
      <ul v-show="hasItems">
        <li v-for="(item, $index) in items" :class="activeClass($index)" @mousedown="hit" @mousemove="setActive($index)">
          <span class="name" v-text="item"></span>
          <span class="screen-name" v-text="item.screen_name"></span>
        </li>
      </ul>
  </div>
</template>

<style scoped>

  .vue-input-tag-wrapper {
    background-color: #fff;
    border: 1px solid #ccc;
    overflow: hidden;
    padding-left: 4px;
    padding-top: 4px;
    cursor: text;
    text-align: left;
    -webkit-appearance: textfield;
  }

  .vue-input-tag-wrapper .input-tag {
    background-color: #cde69c;
    border-radius: 2px;
    border: 1px solid #a5d24a;
    color: #638421;
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 4px;
    margin-right: 4px;
    padding: 3px;
  }

  .vue-input-tag-wrapper .input-tag .remove {
    cursor: pointer;
    font-weight: bold;
    color: #638421;
  }

  .vue-input-tag-wrapper .input-tag .remove:hover {
    text-decoration: none;
  }

  .vue-input-tag-wrapper .input-tag .remove::before {
    content: " x";
  }

  .vue-input-tag-wrapper .new-tag {
    background: transparent;
    border: 0;
    color: #777;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 6px;
    margin-top: 1px;
    outline: none;
    padding: 4px;
    padding-left: 0;
    width: 80px;
  }

  .vue-input-tag-wrapper.read-only {
    cursor: default;
  }

  /* typeahead demo styles*/
/*.Typeahead {
  position: relative;
}
.Typeahead__input {
  width: 100%;
  /*font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  font-weight: 300;
  padding: 12px 26px;
  border: none;
  border-radius: 22px;
  letter-spacing: 1px;
  box-sizing: border-box;
}
.Typeahead__input:focus {
  border-color: #4fc08d;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px #4fc08d;
}*/
.fa-times {
  cursor: pointer;
}
i {
  float: right;
  position: relative;
  top: 30px;
  right: 29px;
  opacity: 0.4;
}
ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  z-index: 1000;
}
li {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}
span {
  display: block;
  color: #2c3e50;
}
.active {
  background-color: #3aa373;
}
.active span {
  color: white;
}
.name {
  font-weight: 700;
  font-size: 18px;
}
.screen-name {
  font-style: italic;
}

</style>
