// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBYj1xjOpXwYPwz6mtcYBhW4XtIt3O59lA',
  authDomain: 'unklabstudentprofile.firebaseapp.com',
  projectId: 'unklabstudentprofile',
  storageBucket: 'unklabstudentprofile.firebasestorage.app',
  messagingSenderId: '378517535273',
  appId: '1:378517535273:web:e2c25468f46b8137333a38',
  databaseURL: 'https://unklabstudentprofile-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const App = initializeApp(firebaseConfig);
initializeAuth(App, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default App;
