<template>
    <div>
        <app-single-msg :messages = "messages"></app-single-msg>
        <app-msg-form></app-msg-form>
    </div>
</template>

<script>
import Form from './Form.vue'
import SingleMessage from './SingleMessage.vue'
import database from 'firebase/database'
import { mapGetters } from 'vuex'

export default {
    name: 'messages',
    components: {
        'app-msg-form': Form,
        'app-single-msg': SingleMessage
    },
    data() {
        return {
            messagesRef: firebase.database().ref('messages'),
            privateMsgRef: firebase.database().ref('privateMessages'),
            messages: [],
            channel: ''
        }
    },
    computed: {
        ...mapGetters(['currentChannel', 'currentUser', 'isPrivate'])
    },
    watch: {
        currentChannel: function() {
            this.messages = []
            this.addListner()
            this.channel = this.currentChannel
        }
    },
    methods: {
        addListner() {
            let ref = this.getMsgRef()
            // listen to event to add msg on current channel
            ref.child(this.currentChannel.id).on('child_added', (snapshot) => {
                let msg = snapshot.val()
                msg['id'] = snapshot.key
                this.messages.push(msg)
                this.$nextTick(() => {
                                $("html, body").scrollTop($(document).height())
                            })
            })
        },
        detachListner() {
            if(this.channel !== null) {
                this.messagesRef.child(this.channel.id).off()
            }
        },
        getMsgRef() {
            if(this.isPrivate) {
                return this.privateMsgRef
            } else {
                return this.messagesRef
            }
        }
    },
    beforeDestroy() {
        this.detachListner()
    }
}
</script>