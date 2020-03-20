import { carousel } from './carousel';
import { nameDays, renderDays, progressBar } from './daysCounter';

const createFirebasePlaceholder = () => {
  //   const app = firebase.app();
  //   const db = firebase.firestore();
  //   db.collection('users').add({
  //     user1: nameDays()
  //   });
  //   const myPost = db.collection('users').doc('user');
  //   myPost.get().then(doc => {
  //     const data = doc.data();
  //     console.log(data.testowy);
  //   });
};

// const createHabbitStatus = () => {
//   const months = document.querySelectorAll('.month__days-list');
//   console.log(Array.from(months)[1]);
//   const dayArr = nameDays();
//   dayArr.forEach((month, indexMonth) => {
//     const currMonthDOM = months[indexMonth];
//     const currMonth = currMonthDOM.querySelectorAll('li');
//     console.log(currMonth);
//     month.forEach((day, indexDay) => {
//       day.push(0);
//       day.push(currMonth[indexDay]);
//     });
//   });
//   return dayArr;
// };

// console.log(createHabbitStatus());

const changeColor = (statusData, month, day, target) => {
  if (Number(statusData) === 0 || Number(statusData) === 2) {
    habbitDataBase[month][day][3] = 1;
    target.style.backgroundColor = '#1be009';
  } else if (Number(statusData) === 1) {
    habbitDataBase[month][day][3] = 2;
    target.style.backgroundColor = '#ff0000';
  }
};

const habbitDataBase = renderDays();
const checkTargetStatus = () => {
  const callendar = document.querySelector('.habbit-proggres__calendar');

  callendar.addEventListener('click', e => {
    const app = firebase.app();
    const db = firebase.firestore();
    const target = e.target;
    if (target.className != 'circle') {
      return;
    }

    const currDayID = target.closest('.month__days-list-item').id;
    const splitID = currDayID.split('_');
    const month = splitID[0];
    const day = splitID[1];
    let currStatus = () => habbitDataBase[month][day][3];
    console.log(currStatus);
    changeColor(currStatus(), month, day, target);

    currStatus();

    db.collection('users')
      .doc('user1')
      .update({
        [currDayID]: currStatus()
      });
  });
};

const getHabitStatus = () => {
  const app = firebase.app();
  const db = firebase.firestore();

  const currentUser = db.collection('users').doc('user1');

  currentUser.get().then(doc => {
    const data = doc.data();
    console.log(data);
    for (let [key, value] of Object.entries(data)) {
      console.log(key);
      let currStatus = (month, day) => habbitDataBase[month][day][3];
      const splitID = key.split('_');
      const month = splitID[0];
      const day = splitID[1];
      currStatus(month, day);
      const wholeList = document.querySelectorAll('.month__days-list-item');
      const [target] = [...wholeList].filter(status => status.id == key);

      console.log(currStatus(month, day));

      if (Number(currStatus(month, day)) == 1) {
        target.lastChild.style.backgroundColor = '#1be009';
      } else if (Number(currStatus(month, day)) == 2) {
        target.lastChild.style.backgroundColor = '#ff0000';
      }
    }
  });
};

getHabitStatus();

checkTargetStatus();
createFirebasePlaceholder();
progressBar();

carousel();
