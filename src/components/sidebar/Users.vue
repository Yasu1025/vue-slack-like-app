<template>
    <div>
        <div class="text-light">
            <h4>Users</h4>
            <ul class="nav flex-column">
                <li v-for = "user in users" :key = "user.uid" @click = "clickTochangeCh(user)">
                    <button 
                        class="list-group-item list-group-item-action"
                        :class = "{'active': isActive(user)}"
                        v-for = "user in users"
                        type="button"
                        :key = "user.uid"
                        @click = "clickTochangeCh(user)">
                        <span>
                            <span :class = "{'online': isOnline(user), 'offline': !isOnline(user)}" class="fa fa-circle">
                                {{ isOnline(user) ? 'ON' : 'OFF' }}
                            </span>
                            <img :src = "user.avatar" height="20" class="img rounded-circle">
                            <span>
                                <a href="#" :class = "{'text-light': isActive(user)}">
                                    {{ user.name }}
                                    <span class="float-right"
                                          v-if = "getNotifications(user) > 0">
                                          {{ getNotifications(user)}}
                                    </span>
                                </a>
                            </span>
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import database from 'firebase/database'
import { mapGetters } from 'vuex'

import mixin from '../../mixin'

export default {
    name: 'users',
    data() {
        return {
            users: [],
            userRef: firebase.database().ref('users'),
            connectedRef: firebase.database().ref('.info/connected'),
            presenceRef: firebase.database().ref('presence'),
            privateMessageRef: firebase.database().ref('privateMessages'),
            noticeCount: [],
            channel: null
        }
    },
    mixins: [mixin],
    computed: {
        ...mapGetters(['currentUser', 'currentChannel', 'isPrivate'])
    },
    watch: {
        isPrivate() {
            if(!this.isPrivate) {
                this.resetNotifications()
            }
        }
    },
    methods: {
        addStatusToUser(userId, connected = true) {
            // online / offline
            let index = this.users.findIndex(user => user.uid === userId)
            if(index !== -1) {
                connected === true ? this.users[index].status = 'online' :
                                     this.users[index].status = 'offline'
            }
        },
        isOnline(user) {
            // for bind class
            return user.status = 'online'
        },
        addListner() {
            this.userRef.on('child_added', (snapshot) => {
                // add users except for currentuser
                if(this.currentUser.uid !== snapshot.key) {
                    let user = snapshot.val()
                    user['uid'] = snapshot.key
                    user['status'] = 'offline'
                    this.users.push(user)
                }
            })

            // presence user add
            this.presenceRef.on('child_added', (snapshot) => {
                if(this.currentUser.uid !== snapshot.key) {
                    // pass to user status
                    this.addStatusToUser(snapshot.key)

                    let chId = this.getChannelId(snapshot.key)
                    this.privateMessageRef.child(chId).on('value', snapshot => {
                        
                        this.handleNoticeCount(chId, this.currentChannel.id, this.noticeCount, snapshot)
                    })
                    
                }
            })

            // presence user remove
            this.presenceRef.on('child_removed', (snapshot) => {
                if(this.currentUser.uid !== snapshot.key) {
                    // pass to user status
                    this.addStatusToUser(snapshot.key, false)

                    this.privateMessageRef.child(this.getChannelId(snapshot.key)).off()
                }
            })

            // return connected user to DB
            this.connectedRef.on('value', (snapshot) => {
                if(snapshot.val() === true) {
                    let ref = this.presenceRef.child(this.currentUser.uid)
                    ref.set(true)
                    ref.onDisconnect().remove()
                }
            })

        },
        getNotifications(user) {
            let chId = this.getChannelId(user.id)
            let notice = 0
            this.noticeCount.forEach(el => {
                if(el.id === chId) {
                    notice = el.notice
                }
            })
            return notice
        },
        resetNotifications(user = null) {
            let chId = null
            if(user !== null) {
                chId = this.getChannelId(user.id)
            } else {
                chId = this.channel.id
            }

            let index = this.noticeCount.findIndex(el => el.id === chId)
            if(index !== -1) {
                this.noticeCount[index].total = this.noticeCount[index].lastKnownTotal
                this.noticeCount[index].notice = 0
            }
        },
        detachListner() {
            this.userRef.off()
            this.presenceRef.off()
            this.connectedRef.off()
            this.users.forEach(el => {
                this.messageRef.child(el.id).off()
            })
        },
        clickTochangeCh(user) {

            if(this.channel === null) {
                this.resetNotifications(user)
            } else {
                this.resetNotifications()
            }

            // change channel
            let channelId = this.getChannelId(user.uid)
            let channel = {id: channelId, name: user.name}

            this.$store.dispatch('setPrivate', true)
            this.$store.dispatch('setCurrentChannel', channel)

            this.channel = channel
        },
        getChannelId(userId) {
            return userId < this.currentUser.uid ? userId + '/' + this.currentUser.uid :
                                                   this.currentUser.uid + '/' + userId
        },
        isActive(user) {
            let channelId = this.getChannelId(user.uid)
            return this.currentChannel.id === channelId
        }
    },
    mounted() {
        this.addListner()
    },
    beforeDestroy() {
        this.detachListner()
    }
}
</script>

<style scoped>
    .online {
        background-color: green;
        color: white;
    }
    .offline {
        background-color: orangered;
        color: white;
    }

</style>
