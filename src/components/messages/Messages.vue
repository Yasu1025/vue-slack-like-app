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
            messages: [],
            channel: ''
        }
    },
    computed: {
        ...mapGetters(['currentChannel'])
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
            // listen to event to add msg on current channel
            this.messagesRef.child(this.currentChannel.id).on('child_added', (snapshot) => {
                this.messages.push(snapshot.val())
            })
        },
        detachListner() {
            if(this.channel !== null) {
                this.messagesRef.child(this.channel.id).off()
            }
        }
    },
    beforeDestroy() {
        this.detachListner()
    }
}
</script>