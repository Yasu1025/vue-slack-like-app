<template>
    <div>
        <div class="msg-form">
            <!-- file upload progress bar -->
            <div class="progress" v-if = "uploadState !== null">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar">
                    {{ uploadLabel }}
                </div>
            </div>
            <form @submit.prevent = "clickToSend" >
                <div class="input-group mb-3">
                    <input type="text"
                           id="message"
                           class="form-control mt-3"
                           name="message"
                           placeholder="Write some message"
                           v-model.trim = "msg"
                           autofocus>
                    <div class="input-group-append">
                        <button class="btn btn-primary mt-3"
                                type="button"
                                @click = "clickToSend">Send</button>
                    </div>
                    <div class="input-group-append">
                        <button class="btn btn-warning mt-3"
                                type="button"
                                :disabled = "uploadState == 'Uploading'"
                                @click.prevent = "clickToOpenModal">Upload</button>
                    </div>
                </div>
            </form>
            <!-- File Modal -->
            <app-file-modal ref="file_modal"></app-file-modal>
        </div>
    </div>
</template>

<script>
import uuidV4 from 'uuid'
import { mapGetters } from 'vuex'
import FileModal from './FileModal.vue'
import storage from 'firebase/storage'

export default {
    name: 'message-form',
    components: {
        'app-file-modal': FileModal
    },
    data() {
        return {
            msg: '',
            errors: [],
            storageRef: firebase.storage().ref(),
            uploadTask: null,
            uploadState: null // for showing on progress bar
        }
    },
    computed: {
        ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
        uploadLabel() {
            switch(this.uploadState) {
                case 'Uploading': return 'uploading...'
                      break
                case 'Error': return 'Error occured...'
                      break
                case 'Done': return 'Completed!!!'
                      break
                default: return ''
            }
        }
    },
    methods: {
        clickToSend() {
            // make message object
            // let newMsg = {
            //     content: this.msg,
            //     timestamp: firebase.database.ServerValue.TIMESTAMP,
            //     user: {
            //         id: this.currentUser.uid,
            //         name: this.currentUser.displayName,
            //         avatar: this.currentUser.photoURL
            //     }
            // }
            // Validate
            if(this.currentChannel !== null) {
                if(this.msg.length > 0) {
                    // push() creates unique key
                    // push to existed channel
                    this.$parent.getMsgRef().child(this.currentChannel.id).push().set(this.createMessage())
                        .then(() => {
                            this.$nextTick(() => {
                                $("html, body").scrollTop($(document).height())
                            })
                        })
                        .catch((e) => {
                            this.errors.push(e.message)
                        })
                        this.msg = ''
                }
            }
        },

        createMessage(fileUrl = null) {
            // create msg obj
            let msg = {
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    id: this.currentUser.uid,
                    name: this.currentUser.displayName,
                    avatar: this.currentUser.photoURL
                }
            }

            if(fileUrl === null) {
                msg['content'] = this.msg
            } else {
                msg['image'] = fileUrl
            }

            return msg
        },
        uploadFile(file, metadata) {
            if(file === null) return false

            let pathToUpload = this.currentChannel.id
            let ref = this.$parent.getMsgRef()
            let filePath = this.getPath() + '/' + uuidV4() + '.jpg'

            this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
            this.uploadState = 'Uploading'

            // on upload state change
            this.uploadTask.on('state_changed', snapshot => {
                // in progress
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                $('.progress-bar').css('width', percent + '%')

            }, e => {
                // error
                this.errors.push(e.message)
                this.uploadState = 'Error'
                this.uploadTask = null
                // reset form
                this.$refs.file_modal.resetForm()

            }, () => {
                // upload finished
                this.uploadState = 'Done'
                // reset form
                this.$refs.file_modal.resetForm()
                // recover the url of file
                let fileUrl = this.uploadTask.snapshot.ref.getDownloadURL().then(fileurl => {
                    this.sendFileMsg(fileurl, ref, pathToUpload)
                })
            })
        },
        sendFileMsg(fileurl, ref, pathToUpload) {
            ref.child(pathToUpload).push().set(this.createMessage(fileurl))
                .then(() => {
                    this.$nextTick(() => {
                        $("html, body").scrollTop($(document).height())
                    })
                })
                .catch((e) => {
                    this.errors.push(e.message)
                })
        },
        getPath() {
            //folder dir to store files in firebase storage
            if(this.isPrivate) {
              return 'chat/private/'+this.currentChannel.id
            } else {
              return 'chat/public'
            }
        },
        clickToOpenModal() {
            $('#fileModal').appendTo('body').modal('show')
        }
    },
    beforeDestroy() {
        if(this.uploadTask !== null) {
            this.uploadTask.cancel()
            this.uploadTask = null
        }
    }
}
</script>

<style scoped>
    .msg-form {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 67%;
        z-index: 100;
        color: white;
        text-align: center;
        margin-bottom: -16px;
        margin-left: 33.3%;
    }
    input, button {
        height: 50px;
    }
    button {
        width: 80px;
    }
    .progress {
        margin-bottom: -16px;
    }
</style>

