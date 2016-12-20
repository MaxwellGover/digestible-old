export default {
    data() {
        return {
            loading: false
        }
    },
    created() {
        this.loading = true;
        // console.log('Created', this.$firebaseRefs);
        let fbRefs = this.$firebaseRefs;
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