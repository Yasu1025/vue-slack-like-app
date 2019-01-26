<template>
    <div>
        <div class="mt-3 mb-10">
            <div v-for = "message in messages" :key="message.id">
                <div class="media">
                    <img class="align-self-start mr-3"
                         :src = "message.user.avatar"
                         :alt = "`${message.user.name}'s Avator'`"
                         height="50"
                         >
                         <div class="media-body">
                             <h6 class="mt-0">
                                <a href="#">{{ message.user.name }}</a> - {{ message.timestamp | fromNow}}
                             </h6>
                             <p v-if = "!isFile(message)"
                                :class = "{'self-message': selfMessage(message.user)}">
                                {{ message.content }}
                             </p>
                             <img v-else 
                                  class="img img-responsive"
                                  height="200"
                                  :src="message.image"
                                  alt="image">
                         </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
    name: 'single-message',
    props: ['messages'],
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        selfMessage(user) {
            return user.id === this.currentUser.uid
        },
        isFile(msg) {
            return msg.content == null && msg.image != null
        }
    },
    filters: {
        fromNow(value) {
            return moment(value).fromNow()
        }
    },
}
</script>

<style scoped>
    .self-message {
        border-left: 2px solid skyblue;
        padding-left: 10px;
    }
</style>
