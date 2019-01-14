<template>
    <div>
        <div class="jumbotron bg-primary text-white text-center">
            <h2 class="lead display-3">SLACK(like..)</h2>
            <p>Realtime comunication App</p>
        </div>

        <!-- Loading -->
        <div class="alert alert-info" v-if = "isLoading">
            <p>Processing....</p>
        </div>

        <!-- Error -->
        <div class="alert alert-danger" v-if = "hasError">
           <div v-for = "(error, index) in errors" :key = "index">
               {{ error }}
           </div>
        </div>

        <div class="container-fluid">
            <div class="row mt-5">
                <div class="col text-center">
                    <button class="btn btn-outline-danger btn-lg"
                            @click = "loginWithGoogle">
                        Login with Google
                    </button>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col text-center">
                    <button class="btn btn-outline-info btn-lg">
                        Login with Twitter
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import auth from 'firebase/auth'
import database from 'firebase/database'
export default {
    name: 'login',
    data() {
        return {
            errors: [],
            isLoading: false,
            usersRef: firebase.database().ref('users')
        }
    },

    computed: {
        hasError() {
            return this.errors.length > 0
        }
    },

    methods: {
        loginWithGoogle() {
            this.isLoading = true
            this.errors = []
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then(res => {
                    // save in DB
                    this.saveUserToUsersRef(res.user)
                    // dispatch login action
                    this.$store.dispatch('setUser', res.user)
                    this.$router.push('/')
                    this.isLoading = false
                })
                .catch(e => {
                    this.errors.push(e.message)
                    this.isLoading = false
                })
        },
        saveUserToUsersRef(user) {
            const data = {
                name: user.displayName,
                avatar: user.photoURL
            }
            return this.usersRef.child(user.uid).set(data)
        }
    }
}
</script>

<style scoped>
    .btn, .jumbotron {
        border-radius: 0;
    }
</style>
