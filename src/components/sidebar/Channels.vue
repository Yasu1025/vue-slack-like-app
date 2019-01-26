<template>
    <div>
        <button class="btn btn-outline-primary" @click = "openModal">Add New</button>
        <div class="mt-4">
            <button 
                class="list-group-item list-group-item-action"
                :class = "{'active': setActiveChannel(channel)}"
                v-for = "channel in channels" :key = "channel.id"
                type="button"
                @click = "clickToChangeCh(channel)">
                {{ channel.name }}
                <span v-if = "getNotification(channel.id) > 0 && channel.id !== currentChannel.id" class="float-right">{{ getNotification(chennel.id) }}</span>
            </button>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="channelModal">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-dark">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <input id="new_channel" class="form-control"
                                    type="text"
                                    name="new_channel"
                                    placeholder="Channel Name"
                                    v-model = "newChannel">
                            </div>
                            <!-- ERROR -->
                            <ul class="list-group" v-if = "hasError">
                                <li class="list-group-item text-danger" v-for = "(e, i) in errors" :key = "i">{{ e }}</li>
                            </ul>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click = "clickAddChannel">Add Channel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import database from 'firebase/database'
import { mapGetters } from 'vuex'
import mixin from '../../mixin'

export default {
    name: 'channels',
    data() {
        return {
            newChannel: '',
            errors: [],
            channelRef: firebase.database().ref('channels'),
            messageRef: firebase.database().ref('messages'),
            noticeCount: [],
            channels: [],
            channel: null        }
    },
    computed: {
        ...mapGetters(['currentChannel', 'isPrivate']),
        hasError() {
            return this.errors.length > 0
        }
    },
    mixins: [mixin],
    watch: {
        isPrivate() {
            if(this.isPrivate) {
                this.resetNotifications()
            }
        }
    },
    methods: {
        openModal() {
            $('#channelModal').appendTo('body').modal('show')
        },
        clickAddChannel() {
            // get new key to new channel
            let key = this.channelRef.push().key
            let newChannel = {
                id: key,
                name: this.newChannel
            }
            this.channelRef.child(key).update(newChannel)
                .then(() => {
                    this.$store.dispatch("setCurrentChannel", newChannel)
                    this.newChannel = ''
                    $('#channelModal').modal('hide')
                })
                .catch((e) => {
                    this.errors.push(e.message)
                })
        },
        addListner() {
            this.errors = []
            // get all channels from DB
            // on is listening
            this.channelRef.on('child_added', snapshot => {
                this.channels.push(snapshot.val())

                // set current
                if(this.channels.length > 0) {
                    this.channel = this.channels[0]
                    // dispatch
                    this.$store.dispatch('setCurrentChannel', this.channel)
                }
                this.addCountListner(snapshot.key)
            })
            

        },
        addCountListner(chId) {
            this.messageRef.child(chId).on('value', snapshot => {
                this.handleNoticeCount(chId, this.currentChannel.id, this.noticeCount, snapshot)
            })
        },
        getNotification(chId) {
            let notice = 0
            this.noticeCount.forEach(el => {
                if(el.id === chId) {
                    notice = el.notice
                }
            })
            return notice
        },
        setActiveChannel(channel) {
            return channel.id === this.currentChannel.id
        },
        detachListner() {
            // off stop listening
            this.channelRef.off()
            this.channels.forEach(el => {
                this.messageRef.child(el.id).off()
            })
        },
        clickToChangeCh(channel) {
            // reset notifications
            this.resetNotifications()
            this.$store.dispatch('setPrivate', false)
            this.$store.dispatch('setCurrentChannel', channel)
            // set ch
            this.channel = channel
        },
        resetNotifications() {
            let index = this.noticeCount.findIndex(el => el.id === this.channel.id)
            
            if(index !== -1) {
                this.noticeCount[index].total = this.noticeCount[index].lastKnownTotal
                this.noticeCount[index].notice = 0
            }

        }
    },
    mounted() {
        this.addListner()
    },
    destroyed() {
        this.detachListner()
    }
}
</script>
