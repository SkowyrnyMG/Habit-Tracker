const getCustomDate = (year, month) => new Date(year, month, 0).getDate();
const currYear = new Date().getFullYear();

const dayInMonth = () => {
  const FIRST_MONTH = 1;
  const ALL_MONTHS = 12;
  const monthsLength = [];

  for (let i = FIRST_MONTH; i <= ALL_MONTHS; i++) {
    monthsLength.push(getCustomDate(currYear, i));
  }
  return monthsLength;
};
const allMonthsArr = dayInMonth();

const nameDays = () => {
  const weekDays = new Map();
  weekDays.set(1, 'mon');
  weekDays.set(2, 'tue');
  weekDays.set(3, 'wed');
  weekDays.set(4, 'thu');
  weekDays.set(5, 'fr');
  weekDays.set(6, 'sat');
  weekDays.set(0, 'sn');

  const newObj = allMonthsArr.map((currMonthLength, index) => {
    const table = [];
    for (let i = 1; i <= currMonthLength; i++) {
      const thisDate = new Date(currYear, index, i);
      table.push([i, weekDays.get(thisDate.getDay())]);
    }
    return table;
  });
  return newObj;
};

const renderDays = () => {
  const allYearDays = nameDays();

  allYearDays.forEach((month, index) => {
    const getMonth = document.querySelector(`#month--${index + 1} .month__days-list`);

    month.forEach((day, dayIndex) => {
      //add id
      day.push(`${index}_${dayIndex}`);
      //add default status
      day.push('0');
      const newDayLink = document.createElement('li');
      newDayLink.className = 'month__days-list-item';
      newDayLink.setAttribute('id', `${index}_${dayIndex}`);
      newDayLink.innerHTML = `<span class="day-no">${
        day[0]
      }</span><span class="day-tag">${day[1].toLowerCase()}</span><span class="circle"></span>`;
      getMonth.innerHTML += newDayLink.outerHTML;
    });
  });
  return allYearDays;
};

const progressBar = () => {
  allMonthsArr.forEach((month, index) => {
    const getHeader = document.querySelector(`#month--${index + 1} .final-day`);
    getHeader.innerHTML = month;
  });
};

export { nameDays, renderDays, progressBar };
