<template>
    <div>
        <div class="msg-form">
            <form @submit.prevent = "clickToSend" >
                <div class="input-group mb-3">
                    <input type="text"
                           id="message"
                           class="form-control mt-3"
                           name="message"
                           placeholder="Write some message"
                           v-model.trim = "msg"
                           autofocus>
                    <div class="input-group-append">
                        <button class="btn btn-primary mt-3"
                                type="button"
                                @click = "clickToSend">Send</button>
                    </div>
                    <div class="input-group-append">
                        <button class="btn btn-warning mt-3" type="button">Upload</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'message-form',
    data() {
        return {
            msg: '',
            errors: []
        }
    },
    computed: {
        ...mapGetters(['currentChannel', 'currentUser'])
    },
    methods: {
        clickToSend() {
            // make message object
            let newMsg = {
                content: this.msg,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    id: this.currentUser.uid,
                    name: this.currentUser.displayName,
                    avatar: this.currentUser.photoURL
                }
            }
            // Validate
            if(this.currentChannel !== null) {
                if(this.msg.length > 0) {
                    // push() creates unique key
                    // push to existed channel
                    this.$parent.getMsgRef().child(this.currentChannel.id).push().set(newMsg)
                        .then(() => {
                            this.$nextTick(() => {
                                $("html, body").scrollTop($(document).height())
                            })
                        })
                        .catch((e) => {
                            this.errors.push(e.message)
                        })
                        this.msg = ''
                }
            }
        }
    }
}
</script>

<style scoped>
    .msg-form {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 67%;
        z-index: 100;
        color: white;
        text-align: center;
        margin-bottom: -16px;
        margin-left: 33.3%;
    }
    input, button {
        height: 50px;
    }
    button {
        width: 80px;
    }
</style>

