import { carousel } from './carousel';
import { nameDays, renderDays, progressBar } from './daysCounter';

const app = firebase.app();
const db = firebase.firestore();
const auth = firebase.auth();
const DEFAULT_DOC = '0000000';
const habbitListBtn = document.querySelector('.habbit-placeholder__button');
const habbitListHolder = document.querySelector('.habbit-placeholder__habbit-list');

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
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      console.log(user.uid);
      habbitController(user.uid);
      renderHabbitList(user.uid);
      logInWindow.classList.remove('login-box-active');
    } else {
      logInWindow.classList.remove('login-box-active');
      logInWindow.classList.add('login-box-active');
    }
  });
};

const collectionSize = (uid, habbit) => {
  db.collection(uid)
    .doc(DEFAULT_DOC)
    .get()
    .then(doc => {
      const data = doc.data();
      return data.lastHabbit;
    })
    .then(lastHabbit => {
      db.collection(uid)
        .get()
        .then(snap => {
          const data = lastHabbit ? lastHabbit : snap.docs[snap.docs.length - 1].id;
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
    });
};

const renderHabbitList = userID => {
  db.collection(userID)
    .get()
    .then(doc => {
      doc.docs.forEach(doc => {
        if (doc.id === DEFAULT_DOC) {
          return;
        } else {
          const habbitListItem = document.createElement('li');
          habbitListItem.className = 'habbit-placeholder__habbit-list__item';
          habbitListItem.value = `${doc.id}`;
          console.log(doc);
          habbitListItem.innerHTML = doc.id;
          habbitListHolder.appendChild(habbitListItem);
        }
      });
    });
};

const habbitController = uid => {
  const formHabbit = document.querySelector('.habbit-form');
  const inputHabbit = document.getElementById('input-habbit');

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
        habbitDisplay.innerHTML = inputHabbit.value;
        db.collection(uid)
          .doc(DEFAULT_DOC)
          .set({
            lastHabbit: inputHabbit.value
          })
          .then(() => {
            location.reload();
          });
      });
    });
};

const googleLoginAndGetData = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)

    .then(result => {
      const uid = result.user.uid;
      if (!db.collection(uid).doc(DEFAULT_DOC)) {
        db.collection(uid)
          .doc(DEFAULT_DOC)
          .set({});
      }
    })
    .catch(console.log);
};

habbitListBtn.addEventListener('click', () => {
  habbitListHolder.classList.toggle('habbit-list-active');
});

const logInWindow = document.querySelector('.login-box');
const googleLoginBtn = document.querySelector('.btn-login');

checkIfUserLogged();

googleLoginBtn.addEventListener('click', () => {
  googleLoginAndGetData();
});

progressBar();

carousel();
