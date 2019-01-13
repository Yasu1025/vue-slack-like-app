<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 sidebar">
                    <h2 class="text-light">Slack(...like)</h2>
                    <hr style="border: 1px solid #ccc">
                    <button class="btn btn-outline-light" @click = "clickToLogout">Logout</button>
                </div>
                <div class="col-md-8 content">
                    content
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import auth from 'firebase/auth'

export default {
    name: 'chat',
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

