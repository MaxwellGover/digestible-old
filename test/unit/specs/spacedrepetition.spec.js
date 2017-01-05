// Import Vue and the component being tested
import Vue from 'vue'
import moment from 'moment'
import 'vue/'
import SpacedRepetition from 'src/components/SpacedRepetition'
import {SPACED_REPETITION_DEFAULT, PERFORMANCE_CUTOFF, WORST, GOOD, BEST} from 'src/components/spacedrepetition-constants'

const TODAY = new Date().getTime(); // time in ms
const YESTERDAY = moment().subtract(1, 'days').valueOf()
const THREE_DAYS_AGO = moment().subtract(3, 'days').valueOf()
const GetDaysAgo = (days) => moment().subtract(days, 'days').valueOf();
const testDataDifficulty = [
  // correct intervals (3 tests)
  {
    input: {
      performaceRating: 'easy', //BEST, = 1
      difficulty: 0.2,
      daysBetweenReviews: 1, // percentOverdue = 2
      dateLastReviewed: TODAY,
    },
    result: { // next dueDay = TOMORROW, update = nextDateLastReviewed = TODAY
      nextDaysBetweenReviews: 1,
      nextDifficulty: 0.2, //0.2,   // 0,2 + 0,2 *1/17 (8-9*1) = 0,188 --> verify! Why 0.2
      nextDateLastReviewed: TODAY,
      nextDueDate: TODAY + moment.duration(1, 'days').valueOf()
    }
  },
  {
    input: {
      performaceRating: 'easy', //BEST,
      difficulty: 0.2,
      daysBetweenReviews: 100, // percentOverdue = 17/100 = 0.17
      dateLastReviewed: GetDaysAgo(17),
    },
    result: {  // next dueDay = TOMORROW, update = nextDateLastReviewed = TODAY
      nextDaysBetweenReviews: 1,
      nextDifficulty: 0.19,
      nextDateLastReviewed: TODAY,
      nextDueDate: TODAY + moment.duration(1, 'days').valueOf()
    }
  },
  {
    input: {
      performaceRating: 'easy', //BEST,
      difficulty: 0.2,
      daysBetweenReviews: 10,
      dateLastReviewed: GetDaysAgo(17),
    },
    result: {
      nextDaysBetweenReviews: 4,
      nextDifficulty: 0.1,
      nextDateLastReviewed: TODAY,
      nextDueDate: TODAY + moment.duration(4, 'days').valueOf()
    }
  },
  // incorrect intervals (1 test)
  {
    input: {
      performaceRating: 'soon', //BEST,
      difficulty: 0.2,
      daysBetweenReviews: 10,
      dateLastReviewed: GetDaysAgo(17),
    },
    result: {
      nextDaysBetweenReviews: 1,
      nextDifficulty: 1,
      nextDateLastReviewed: TODAY,
      nextDueDate: TODAY + moment.duration(1, 'days').valueOf()
    }
  }
];

const dataDefault = {
  difficulty: 0.3,
  daysBetweenReviews: 2,
  dateLastReviewed: YESTERDAY
};

const dataPercentOverdue = [
  {
    daysBetweenReviews: 1,
    dateLastReviewed: TODAY,
    percentOverdueExpected: 0
  },
  {
    daysBetweenReviews: 2,
    dateLastReviewed: YESTERDAY,
    percentOverdueExpected: 0.5
  },
  { // percentOverdue should never exceed 2
    daysBetweenReviews: 1,
    dateLastReviewed: THREE_DAYS_AGO,
    percentOverdueExpected: 2
  }
]

// helper function that mounts and returns the rendered text
function getComponentData (Component, propsData) {
  const Ctor = Vue.extend(Component);

  // same as above just with vm.$refs.component
  // const Ctor = Vue.extend({
  //   components: {
  //     spacedRepetition: Component
  //   },
  //   template: '<div><spaced-repetition ref="component"></spaced-repetition></div>'
  // });
  // console.log('props', propsData);
  const vm = new Ctor({ propsData }).$mount();
  return vm;
}

describe('SpacedRepetition.vue - render', () => {

  it('should render all buttons', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(SpacedRepetition)
    });

    // console.log(vm.$el.querySelectorAll('.button'));
    expect(vm.$el.querySelectorAll('.button').length)
      .toBe(3)
  });
})

describe('Data input', () => {
  const testMapping = {
    soon: WORST,
    good: GOOD,
    easy: BEST
  };

  Object.keys(testMapping).forEach((key) => {
    let value = testMapping[key];
    it(`should set performaceRating correctly ${key}: ${value}`, () => {
      
      const component = getComponentData(SpacedRepetition, testDataDifficulty[0].input);
      expect(component).toBeTruthy()

      component.spaced(key);
      expect(component.performanceRating).toBeCloseTo(value, 2);
    });
  });
})

describe('Calculation spaced values', () => {

  dataPercentOverdue.forEach((data) => {
    it(`should calculate percentOverdue ${data.percentOverdueExpected} correctly`, () => {
      const component = getComponentData(SpacedRepetition, data);
      expect(component.percentOverdue).toBeCloseTo(data.percentOverdueExpected, 5);
    });
  })

  testDataDifficulty.forEach((data, i) => {
    const component = getComponentData(SpacedRepetition, data.input);
    it(`should calculate data ${i} correctly`, (done) => {
      component.spaced(data.input.performaceRating);

      Vue.nextTick(() => {
        expect(component.newDifficulty).toBeCloseTo(data.result.nextDifficulty, 8); //, 'Difficulty Calculation Is Not Right');
        expect(component.newDaysBetweenReviews).toBe(data.result.nextDaysBetweenReviews); //, 'Interval Calculation Is Not Right');
        expect(Math.abs(component.newDueDate - data.result.nextDueDate)).toBeLessThan(1000); //, 'Update Calculation Is Not Right'); //+-1000ms --> typical 200ms delta
        expect(Math.abs(component.newDateLastReviewed - data.result.nextDateLastReviewed)).toBeLessThan(1000); //, 'Update Calculation Is Not Right'); //+-1000ms --> typical 300ms - 600ms delta
        done();
      });
    })
  });

})