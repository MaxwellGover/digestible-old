<template>
    <!--<div class="modal fade" tabindex="-1" role="dialog">-->
    <div ref="modal" tabindex="-1" role="dialog" class="modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" aria-label="Close" @click="cancelModal"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="okModal">Delete</button>
                    <button type="button" class="btn btn-default" @click="cancelModal">Cancel</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        title: {
            type: String,
            default: 'Modal title'
        },
        cancel: {
            type: Function,
            default: function() {
                
            }
        },
        open: {
            type: Function,
            default: function() {

            }
        },
        ok: {
            type: Function,
            default: function() {
                
            }
        }
    },
    computed: {
        ...mapState({
            show: state => state.modal.show,
            el: state => state.modal.el
        }),
        modalState: function() {
            // console.log('modalstate', this.el, this.$modal[0]);
            let $modal = this.$modal;
            if (this.el === $modal[0]) {
                var hideCallback = () => {
                    // console.log('modal hidden event', this);
                    this.mutateHide();
                };

                if (this.show) {
                    $modal.one('hidden.bs.modal', hideCallback);
                    this.setVisibility(true);
                    this.open();
                }
                else {
                    $modal.off('hidden.bs.modal');
                }

                return true;
            }
            else {
                return false;
            }
        }
    },
    mounted: function () { // ready replaced by mounted hook in vue 2.0
        this.$nextTick(function () {
            // code that assumes this.$el is in-document
            this.$modal = $(this.$refs.modal);
        });
    },
    methods: {
        mutateHide() {
            this.setVisibility(false);
            this.$store.commit('modalChange', {el: this.el, show: false});
        },
        setVisibility(val) {
            // console.log(this.$refs.modal);
            this.$modal.modal(val ? 'show': 'hide');
        },
        okModal() {
            console.log('ok click in modal');
            this.mutateHide();
            this.ok();
        },
        cancelModal() {
            console.log('cancel click in modal');
            this.mutateHide();
            this.cancel();
        },
    }
}

</script>