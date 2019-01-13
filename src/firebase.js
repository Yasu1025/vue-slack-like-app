import firebase from 'firebase/app'

export const config = {
    apiKey: "AIzaSyDvwAqbN9MPNQUIpNH9aDUMCJanTc_i7Ik",
    authDomain: "vue-slack-app.firebaseapp.com",
    databaseURL: "https://vue-slack-app.firebaseio.com",
    projectId: "vue-slack-app",
    storageBucket: "vue-slack-app.appspot.com",
    messagingSenderId: "866611944518"
};
firebase.initializeApp(config);
window.firebase = firebase;