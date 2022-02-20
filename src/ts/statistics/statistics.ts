import { store } from '../store/store';
import { putUserStatistics, getUserStatistics } from '../requests';
import { TBodyUserStatistic } from '../type/types';

const statisticsBtn = <HTMLLIElement>document.getElementById('statistics-btn');

const todayWords = <HTMLSpanElement>document.getElementById('today-words');
const todayAccuracy = <HTMLDivElement>document.getElementById('today-accuracy');

const todayAudiocallWords = <HTMLParagraphElement>document.getElementById('today-audiocall-words');
const todayAudiocallAccuracy = <HTMLParagraphElement>document.getElementById('today-audiocall-accuracy');
const todayAudiocallInARow = <HTMLParagraphElement>document.getElementById('today-audiocall-in-a-row');

const todaySprintWords = <HTMLParagraphElement>document.getElementById('today-sprint-words');
const todaySprintAccuracy = <HTMLParagraphElement>document.getElementById('today-sprint-accuracy');
const todaySprintInARow = <HTMLParagraphElement>document.getElementById('today-sprint-in-a-row');

export async function getUserStatisticsFn() {
  if (store.isAuthorized) {
    const stat = await getUserStatistics(localStorage.getItem('userId') || '', localStorage.getItem('token') || '');
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
  }
}

export async function navigateStatistics() {
  statisticsBtn.addEventListener('click',  () => {
    getUserStatisticsFn();
  });
}

function getTodayDate() {
  const today = new Date();
  return JSON.stringify(today).slice(1, JSON.stringify(today).indexOf('T'));
}

function isToday(date: string) {
  if (getTodayDate() === date) {
    return true;
  } else {
    return false;
  }
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
      const newDayStat: TBodyUserStatistic = JSON.parse(JSON.stringify(store.statisticsNew));
      const newDate = getTodayDate();
      newDayStat.learnedWords = oldStatistics.learnedWords;
      newDayStat.optional.date = newDate;
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
