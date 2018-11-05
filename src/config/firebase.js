import firebase from 'firebase'

const config = {
	apiKey: 'AIzaSyDlU9-YTZE2YV8G0trlbMwDpie8Fg_eZ-Q',
	authDomain: 'io-frontend-kadraw-c5925.firebaseapp.com',
	databaseURL: 'https://io-frontend-kadraw-c5925.firebaseio.com',
	projectId: 'io-frontend-kadraw-c5925',
	storageBucket: '',
	messagingSenderId: '839148286681'
}
firebase.initializeApp(config)

export default firebase
