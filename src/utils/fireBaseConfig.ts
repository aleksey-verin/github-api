import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDcsWYa7KK2YxwAP9S8fZTXVQZUuiX72g8',
  authDomain: 'github-api-a184f-36ea3.firebaseapp.com',
  projectId: 'github-api-a184f',
  storageBucket: 'github-api-a184f.appspot.com',
  messagingSenderId: '1036474239759',
  appId: '1:1036474239759:web:741f8b9829ad5638528c7a',
  measurementId: 'G-CQ7BJ19N1H'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
