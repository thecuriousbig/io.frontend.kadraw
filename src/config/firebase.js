import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
const setting = { timestampsInSnapshots: true }

const config = {
	apiKey: 'AIzaSyDlU9-YTZE2YV8G0trlbMwDpie8Fg_eZ-Q',
	authDomain: 'io-frontend-kadraw-c5925.firebaseapp.com',
	databaseURL: 'https://io-frontend-kadraw-c5925.firebaseio.com',
	projectId: 'io-frontend-kadraw-c5925',
	storageBucket: 'io-frontend-kadraw-c5925.appspot.com',
	messagingSenderId: '839148286681'
}
firebase.initializeApp(config)
firebase.firestore().settings(setting)
firebase.storage()

export default firebase
