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
                                <a href="#" :class = "{'text-light': isActive(user)}">{{ user.name }}</a>
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

export default {
    name: 'users',
    data() {
        return {
            users: [],
            userRef: firebase.database().ref('users'),
            connectedRef: firebase.database().ref('.info/connected'),
            presenceRef: firebase.database().ref('presence')
        }
    },
    computed: {
        ...mapGetters(['currentUser', 'currentChannel'])
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
                }
            })

            // presence user remove
            this.presenceRef.on('child_removed', (snapshot) => {
                if(this.currentUser.uid !== snapshot.key) {
                    // pass to user status
                    this.addStatusToUser(snapshot.key, false)
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
        detachListner() {
            this.userRef.off()
            this.presenceRef.off()
            this.connectedRef.off()
        },
        clickTochangeCh(user) {
            // change channel
            let channelId = this.getChannelId(user.uid)
            let channel = {id: channelId, name: user.name}

            this.$store.dispatch('setPrivate', true)
            this.$store.dispatch('setCurrentChannel', channel)
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
