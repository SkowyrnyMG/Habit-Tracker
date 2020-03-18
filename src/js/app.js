import { carousel } from './carousel';
import { nameDays, renderDays, progressBar } from './daysCounter';

// const app = firebase.app();
// const db = firebase.firestore();

// const myPost = db.collection('test').doc('exe');

// myPost.get().then(doc => {
//   const data = doc.data();
//   console.log(data.testowy);
// });

nameDays();
renderDays();
progressBar();
carousel();
