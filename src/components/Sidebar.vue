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
    </div>
</template>

<script>
//import auth from 'firebase/auth'
import { mapGetters } from 'vuex'
import Channels from './Channels'

export default {
    name: 'sidebar',
    components: {
        'app-channels': Channels
    },
    computed: {
      ...mapGetters (['currentUser']) 
    },
    methods: {
        clickToLogout() {
            firebase.auth().signOut()
            this.$store.dispatch('setUser', null)
            this.$router.push('/login')
        }
    }
}
</script>

