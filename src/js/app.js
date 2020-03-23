import { carousel } from './carousel';
import { nameDays, renderDays, progressBar } from './daysCounter';

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

const checkTargetStatus = (user, curHabbit) => {
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
    // console.log(currStatus);
    changeColor(currStatus(), month, day, target);

    currStatus();

    db.collection(user)
      .doc(curHabbit)
      .update({
        [currDayID]: currStatus()
      });
  });
};

const getHabitStatus = (user, curHabbit) => {
  const app = firebase.app();
  const db = firebase.firestore();
  const currentHabbit = db.collection(user).doc(curHabbit);

  const habbitDisplay = document.querySelector('.current-habbit');
  habbitDisplay.innerHTML = currentHabbit.id;
  console.log(currentHabbit.id);

  currentHabbit.get().then(doc => {
    const data = doc.data();
    // console.log(data);
    for (let [key, value] of Object.entries(data)) {
      // console.log(key);
      let currStatus = (month, day) => (habbitDataBase[month][day][3] = value);
      const splitID = key.split('_');
      const month = splitID[0];
      const day = splitID[1];
      currStatus(month, day);
      const wholeList = document.querySelectorAll('.month__days-list-item');
      const [target] = [...wholeList].filter(status => status.id == key);

      // console.log(currStatus(month, day));

      if (Number(currStatus(month, day)) == 1) {
        target.lastChild.style.backgroundColor = '#1be009';
      } else if (Number(currStatus(month, day)) == 2) {
        target.lastChild.style.backgroundColor = '#ff0000';
      }
    }
  });
};

const checkIfUserLogged = () => {
  const user = firebase.auth().currentUser;
  if (user) {
    logInWindow.classList.add('login-box-hide');
  }
};

const logInWindow = document.querySelector('.login-box');
const googleLoginBtn = document.querySelector('.btn-login');

checkIfUserLogged();

googleLoginBtn.addEventListener('click', () => {
  googleLoginAndGetData();
});

const googleLoginAndGetData = () => {
  const formHabbit = document.querySelector('.habbit-form');
  const inputHabbit = document.getElementById('input-habbit');

  const app = firebase.app();
  const db = firebase.firestore();
  const provider = new firebase.auth.GoogleAuthProvider();
  let user_ID;

  firebase
    .auth()
    .signInWithPopup(provider)

    .then(result => {
      const user = result.user;
      const uid = result.user.uid;
      user_ID = uid;
      console.log(user);
      db.collection(uid)
        .doc('0000000')
        .set({
          lastHabbit: ''
        });
      return uid;
    })

    .then(uid => {
      const collectionSize = (uid, habbit) => {
        // db.collection(uid)
        //   .doc('0000000')
        //   .get()
        //   .then(doc => {
        //     const data = doc.data();
        //     return data.lastHabbit;
        //   }).then(lastHabbit => {})

        db.collection(uid)
          .get()
          .then(snap => {
            const data = snap.docs[snap.docs.length - 1].id;
            return [snap.size, data];
          })
          .then(([size, data]) => {
            if (size > 1) {
              console.log('it has a doc');

              getHabitStatus(uid, data);
              checkTargetStatus(uid, data);
            } else {
              console.log('it does not have a doc');

              db.collection(uid)
                .doc(`${habbit}`)
                .set({});
            }
          });
      };

      db.collection(uid)
        .get()
        .then(snap => {
          return snap.size;
        })
        .then(size => {
          const callendar = document.querySelector('.habbit-proggres');
          const errorInputArrow = document.querySelector('.error-arrow');
          const errorInputInfo = document.querySelector('.error-info');
          const habbitDisplay = document.querySelector('.current-habbit');

          if (size > 1) {
            collectionSize(uid);
          } else {
            callendar.classList.add('callendar-unactive');
            errorInputArrow.classList.add('active');
            errorInputInfo.classList.add('active');
          }
          formHabbit.addEventListener('submit', e => {
            e.preventDefault();
            callendar.classList.remove('callendar-unactive');
            errorInputArrow.classList.remove('active');
            errorInputInfo.classList.remove('active');
            db.collection(uid)
              .doc(`${inputHabbit.value}`)
              .set({});
            collectionSize(uid, inputHabbit.value);
            checkTargetStatus(uid, inputHabbit.value);
            habbitDisplay.innerHTML = inputHabbit.value;
            db.collection(uid)
              .doc('0000000')
              .set({
                lastHabbit: inputHabbit.value
              });
          });
        });

      checkIfUserLogged();
    })
    .catch(console.log);
};

progressBar();

carousel();
