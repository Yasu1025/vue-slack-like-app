<template>
    <div>
        <h2>{{ channelName }}</h2>
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
            channel: null,
            listners: []
        }
    },
    computed: {
        ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
        channelName() {
            if(this.channel !== null) {
                return this.isPrivate ? '@ ' + this.channel.name : '# ' + this.channel.name 
            }
        }
    },
    watch: {
        currentChannel: function() {
            //this.messages = []
            this.detachListner()
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
            // pass arg to method
            this.addToListners(this.currentChannel.id, ref, 'child_added') 

        },
        getMsgRef() {
            if(this.isPrivate) {
                return this.privateMsgRef
            } else {
                return this.messagesRef
            }
        },
        addToListners(id, ref, event) {
            let index = this.listners.findIndex(el => {
                return el.id === id && el.ref === ref && el.event === event
            })

            if(index === -1) {
                this.listners.push({id: id, ref: ref, event: event})
            }
        },
        detachListner() {
            this.listners.forEach(listner => {
                listner.ref.child(listner.id).off(listner.event)
            })
            this.listners = []
            this.messages = []
            // if(this.channel !== null) {
            //     this.messagesRef.child(this.channel.id).off()
            // }
        }
    },
    beforeDestroy() {
        this.detachListner()
    },
    mounted() {
        $("html, body").scrollTop($(document).height())
    }
}
</script>