export default {
    // computed: {
    //     loading: state => state.loading
    // },
    data() {
        return {
            loading: true
        }
    },
    created() {
        this.loading = true;
        // console.log('Created', this, this.$firebaseRefs);
        let fbRefs = Object.assign({}, this.$parent.$firebaseRefs, this.$firebaseRefs); // parent firebase refs included to
        console.log('created', fbRefs);

        if (!fbRefs) {
            this.loading = false; // no firebase ref defined
            return;
        }

        let keys = Object.keys(fbRefs);

        if (keys.length > 0) {
            var promises = keys.map((key) => {
                return fbRefs[key].once('value', () => { });
            });

            // console.log(promises);
            Promise.all(promises).then((snapshots) => {
                // console.log('loaded', snapshots, this);
                this.loading = false;
            });
        }
        else {
            this.loading = false; // no firebase refs
        }
    }
}