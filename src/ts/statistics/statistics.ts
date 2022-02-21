import { store } from '../store/store';
import { putUserStatistics, getUserStatistics } from '../requests';
import { TBodyUserStatistic, TUserStatistic } from '../type/types';

const statisticsBtn = <HTMLLIElement>document.getElementById('statistics-btn');

const todayWords = <HTMLSpanElement>document.getElementById('today-words');
const todayAccuracy = <HTMLDivElement>document.getElementById('today-accuracy');

const todayAudiocallWords = <HTMLParagraphElement>document.getElementById('today-audiocall-words');
const todayAudiocallAccuracy = <HTMLParagraphElement>document.getElementById('today-audiocall-accuracy');
const todayAudiocallInARow = <HTMLParagraphElement>document.getElementById('today-audiocall-in-a-row');

const todaySprintWords = <HTMLParagraphElement>document.getElementById('today-sprint-words');
const todaySprintAccuracy = <HTMLParagraphElement>document.getElementById('today-sprint-accuracy');
const todaySprintInARow = <HTMLParagraphElement>document.getElementById('today-sprint-in-a-row');

let allStatistics: TUserStatistic[];

window.addEventListener('beforeunload', () => {
  localStorage.setItem('allStatistics', JSON.stringify(allStatistics));
});

if (typeof localStorage.getItem('allStatistics') === 'string') {
  allStatistics = JSON.parse(localStorage.getItem('allStatistics') || '');
} else {
  allStatistics = [];
}

function getTodayDate() {
  const today = new Date();
  const indexForDateString = today.toString().indexOf('202') + 4;
  return today.toString().slice(0, indexForDateString);
}

function isToday(date: string) {
  if (getTodayDate() === date) {
    return true;
  } else {
    return false;
  }
}

const oldStatisticsContainer = <HTMLDivElement>document.getElementById('old-statistics');

function showDate(str: string) {
  const newDate = new Date(str);
  const todayDate = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  const twoNumbers = (num) => (num >= 10) ? num : '0' + num;
  return `${twoNumbers(todayDate)} ${months[month]} ${year}`;
}

function generateOneDayStatistics(stat: TUserStatistic) {
  return `
  <h2>${showDate(stat.optional.date)}</h2>
  <div class="statistics-info">
    <div class="statistics-info__left">
      <div class="statistics-info__left-words">
        <span id="today-words">${stat.optional.games.audiocall.newWords + stat.optional.games.sprint.newWords}</span>
        <div>
          <p>слов</p>
          <p>было в играх</p>
        </div>
      </div>
      <div class="statistics-info__left-accuracy">
        <p>Правильных ответов</p>
        <div id="today-accuracy">${(stat.optional.games.audiocall.newWords + stat.optional.games.sprint.newWords) < 1 ? '0' : Math.round(((stat.optional.games.audiocall.right + stat.optional.games.sprint.right) / (stat.optional.games.audiocall.newWords + stat.optional.games.sprint.newWords)) * 100)}%</div>
      </div>
    </div>
    <div class="statistics-info__right">
      <div class="statistics-info__right-audiocall">
        <div>
          <div class="game-img"></div>
          <h3>Аудиовызов</h3>
        </div>
        <div class="today-game-stats">
          <div class="today-game-stats__row">
            <p id="today-audiocall-words">${stat.optional.games.audiocall.newWords}</p>
            <p>слов</p>
          </div>
          <div class="today-game-stats__row">
            <p id="today-audiocall-accuracy">${stat.optional.games.audiocall.newWords < 1 ? '0' : Math.round((stat.optional.games.audiocall.right / stat.optional.games.audiocall.newWords) * 100)}%</p>
            <p>правильных ответов</p>
          </div>
          <div class="today-game-stats__row">
            <p id="today-audiocall-in-a-row">${stat.optional.games.audiocall.bestSeries}</p>
            <p>лучшая серия</p>
          </div>
        </div>
      </div>
      <div class="statistics-info__right-sprint">
        <div>
          <div class="game-img"></div>
          <h3>Спринт</h3>
        </div>
        <div class="today-game-stats">
          <div class="today-game-stats__row">
            <p id="today-sprint-words">${stat.optional.games.sprint.newWords}</p>
            <p>слов</p>
          </div>
          <div class="today-game-stats__row">
            <p id="today-sprint-accuracy">${stat.optional.games.sprint.newWords < 1 ? '0' : Math.round((stat.optional.games.sprint.right / stat.optional.games.sprint.newWords) * 100)}%</p>
            <p>правильных ответов</p>
          </div>
          <div class="today-game-stats__row">
            <p id="today-sprint-in-a-row">${stat.optional.games.sprint.bestSeries}</p>
            <p>лучшая серия</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function showOldDayStatistics() {
  oldStatisticsContainer.innerHTML = '';
  for (const stat of allStatistics) {
    oldStatisticsContainer.innerHTML = generateOneDayStatistics(stat) + oldStatisticsContainer.innerHTML;
  }
}

export async function getUserStatisticsFn() {
  if (store.isAuthorized) {
    const stat = await getUserStatistics(localStorage.getItem('userId') || '', localStorage.getItem('token') || '');
    if (isToday(stat.optional?.date || '')) {
      if (stat.optional) {
        todayAudiocallWords.innerHTML = `${stat.optional.games.audiocall.newWords}`;

        if (stat.optional.games.audiocall.newWords < 1) {
          todayAudiocallAccuracy.innerHTML = '0';
        } else {
          todayAudiocallAccuracy.innerHTML = `${Math.round((stat.optional.games.audiocall.right / stat.optional.games.audiocall.newWords) * 100)}%`;
        }

        todayAudiocallInARow.innerHTML = `${stat.optional.games.audiocall.bestSeries}`;

        todaySprintWords.innerHTML = `${stat.optional.games.sprint.newWords}`;

        if (stat.optional.games.sprint.newWords < 1) {
          todaySprintAccuracy.innerHTML = '0';
        } else {
          todaySprintAccuracy.innerHTML = `${Math.round((stat.optional.games.sprint.right / stat.optional.games.sprint.newWords) * 100)}%`;
        }

        todaySprintInARow.innerHTML = `${stat.optional.games.sprint.bestSeries}`;

        todayWords.innerHTML = `${stat.optional.games.audiocall.newWords + stat.optional.games.sprint.newWords}`;

        if ((stat.optional.games.audiocall.newWords + stat.optional.games.sprint.newWords) < 1) {
          todayAccuracy.innerHTML = '0';
        } else {
          todayAccuracy.innerHTML = `${Math.round(((stat.optional.games.audiocall.right + stat.optional.games.sprint.right) / +todayWords.innerHTML) * 100)}%`;
        }
      }
    } else {
      allStatistics.push(stat);
      const newDayStat: TBodyUserStatistic = JSON.parse(JSON.stringify(store.statisticsNew));
      const newDate = getTodayDate();
      newDayStat.optional.date = newDate;
      await putUserStatistics(localStorage.getItem('userId') || '', newDayStat, localStorage.getItem('token') || '');
      getUserStatisticsFn();
    }
    if (allStatistics.length > 0) {
      showOldDayStatistics();
    }
  }
}

export async function navigateStatistics() {
  statisticsBtn.addEventListener('click',  () => {
    getUserStatisticsFn();
  });
}

export async function updateUserStatisticsFn(game: string, answer: boolean) {
  if (store.isAuthorized) {
    const oldStatistics = await getUserStatistics(localStorage.getItem('userId') || '', localStorage.getItem('token') || '');
    if (isToday(oldStatistics.optional?.date || '')) {
      oldStatistics.learnedWords++;
      if (oldStatistics.optional) {
        if (game === 'sprint' && answer === true) {
          oldStatistics.optional.games.sprint.right++;
          oldStatistics.optional.games.sprint.newWords++;
        } else if (game === 'sprint' && answer === false) {
          oldStatistics.optional.games.sprint.newWords++;
        } else if (game === 'audiocall' && answer === true) {
          oldStatistics.optional.games.audiocall.right++;
          oldStatistics.optional.games.audiocall.newWords++;
        } else if (game === 'audiocall' && answer === false) {
          oldStatistics.optional.games.audiocall.newWords++;
        }
        const newBody = {
          learnedWords: oldStatistics.learnedWords,
          optional: oldStatistics.optional,
        };
        putUserStatistics(localStorage.getItem('userId') || '', newBody, localStorage.getItem('token') || '');
      }
    } else {
      allStatistics.push(oldStatistics);
      const newDayStat: TBodyUserStatistic = JSON.parse(JSON.stringify(store.statisticsNew));
      const newDate = getTodayDate();
      newDayStat.learnedWords = oldStatistics.learnedWords + 1;
      newDayStat.optional.date = newDate;
      if (game === 'sprint' && answer === true) {
        newDayStat.optional.games.sprint.right++;
        newDayStat.optional.games.sprint.newWords++;
      } else if (game === 'sprint' && answer === false) {
        newDayStat.optional.games.sprint.newWords++;
      } else if (game === 'audiocall' && answer === true) {
        newDayStat.optional.games.audiocall.right++;
        newDayStat.optional.games.audiocall.newWords++;
      } else if (game === 'audiocall' && answer === false) {
        newDayStat.optional.games.audiocall.newWords++;
      }
      putUserStatistics(localStorage.getItem('userId') || '', newDayStat, localStorage.getItem('token') || '');
    }
  }
}

export async function updateBestSeriesFn(game: string, bestSeries: number) {
  if (store.isAuthorized) {
    const oldStatistics = await getUserStatistics(localStorage.getItem('userId') || '', localStorage.getItem('token') || '');
    if (oldStatistics.optional) {
      if (game === 'sprint') {
        if (bestSeries > oldStatistics.optional.games.sprint.bestSeries) {
          oldStatistics.optional.games.sprint.bestSeries = bestSeries;
        }
      } else if (game === 'audiocall') {
        if (bestSeries > oldStatistics.optional.games.audiocall.bestSeries) {
          oldStatistics.optional.games.audiocall.bestSeries = bestSeries;
        }
      }
      const newBody = {
        learnedWords: oldStatistics.learnedWords,
        optional: oldStatistics.optional,
      };
      putUserStatistics(localStorage.getItem('userId') || '', newBody, localStorage.getItem('token') || '');
    }
  }
}
