<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 sidebar">
                    <app-sidebar></app-sidebar>
                </div>
                <div class="col-md-8 content">
                    <app-messages></app-messages>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import auth from 'firebase/auth'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Messages from '@/components/messages/Messages.vue'

export default {
    name: 'chat',
    components: {
        "app-sidebar": Sidebar,
        'app-messages': Messages
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

<style scoped>
.sidebar {
    width: 33.5%;
    display: block;
    float: left;
    position: fixed;
    height: 100%;
    background-color: #333;
    padding-top: 2em;
    overflow: scroll;
}

.content {
    width: 66%;
    display: block;
    float: left;
    margin-left: 34%;
}
</style>

