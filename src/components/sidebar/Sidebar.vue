<template>
    <div>
        <h2 class="text-light">Slack(...like)</h2>
        <hr style="border: 1px solid #ccc">
        <div>
            <img class="rounded-circle mt-2" height="30" :src = "currentUser.photoURL" alt="">
            <span class="text-light">{{ currentUser.displayName }}</span>
        </div>
        <hr style="border: 1px solid #ccc">
        <button class="btn btn-outline-light" @click = "clickToLogout">Logout</button>
        <hr style="border: 1px solid #ccc">
        <app-channels></app-channels>
        <hr style="border: 1px solid #ccc">
        <app-users></app-users>
    </div>
</template>

<script>
import database from 'firebase/database'
import { mapGetters } from 'vuex'
import Channels from './Channels.vue'
import Users from './Users.vue'

export default {
    name: 'sidebar',
    data() {
        return {
            presenceRef: firebase.database().ref('presence')
        }
    },
    components: {
        'app-channels': Channels,
        'app-users': Users
    },
    computed: {
      ...mapGetters (['currentUser']) 
    },
    methods: {
        clickToLogout() {
            this.presenceRef.child(this.currentUser.uid).remove()
            firebase.auth().signOut()
            this.$store.dispatch('setUser', null)
            this.$router.push('/login')
        }
    }
}
</script>

