import { getAggregatedWords, getWords } from '../requests';
import { ELinks, TAggregatedWord, ResultGrade } from '../type/types';
import { store } from '../store/store';
import { updateGameStats } from '../statistics/word-statistics';
import { updateUserStatisticsFn, updateBestSeriesFn } from '../statistics/statistics';
import { isEasyWordInGameFn } from '../delete-easy-if-mistake';

const sprint = <HTMLDivElement>document.querySelector('.sprint');
const sprintWord = <HTMLParagraphElement>document.querySelector('.sprint-word');
const sprintWordTranslation = <HTMLParagraphElement>document.querySelector('.sprint-word-translation');
const sprintWrongBtn = <HTMLButtonElement>document.querySelector('.sprint-word-wrong');
const sprintRightBtn = <HTMLButtonElement>document.querySelector('.sprint-word-right');
const sprintWordResult = <HTMLDivElement>document.querySelector('.sprint-word-result');
const sprintTimer = <HTMLDivElement>document.querySelector('.sprint-timer');
const sprintStart = <HTMLDivElement>document.querySelector('.sprint-start');
const sprintGame = <HTMLDivElement>document.querySelector('.sprint-game');
const sprintResult = <HTMLDivElement>document.querySelector('.sprint-result');
const countSprintResultMistakes = <HTMLSpanElement>document.getElementById('count-sprint-result-mistakes');
const countSprintResultCorrect = <HTMLSpanElement>document.getElementById('count-sprint-result-correct');
const sprintResultMistakes = <HTMLDivElement>document.getElementById('sprint-result-mistakes');
const sprintResultCorrect = <HTMLDivElement>document.getElementById('sprint-result-correct');
const closeSprint = <HTMLButtonElement>document.getElementById('close-sprint');
const newSprint = <HTMLButtonElement>document.getElementById('new-sprint');
const dictionarySection = <HTMLDivElement>document.querySelector('.dictionary');
const footerSection = <HTMLElement>document.querySelector('.footer');
const dictionaryGameFooter = <HTMLDivElement>document.querySelector('.dictionary-footer');
const sprintResultVerdict = <HTMLHeadElement>document.querySelector('.sprint-result-verdict');

const sprintGameInfoLevel = <HTMLSpanElement>document.querySelector('.sprint-game-info__level');
const sprintGameInfoPage = <HTMLSpanElement>document.querySelector('.sprint-game-info__page');
const sprintGameInfoCountWords = <HTMLSpanElement>document.querySelector('.sprint-game-info__count-words');
const sprintGameInfoCurrentNumber = <HTMLSpanElement>document.querySelector('.sprint-game-info__current-number');

let currentRightAnswer = '';
let currentWord: TAggregatedWord;
let sprintWordNumber: number;
let wordsForGame: TAggregatedWord[];
let wrongAnswers: TAggregatedWord[];
let rightAnswers: TAggregatedWord[];
let setIntervalID: NodeJS.Timer;
let bestSeries: number;
let currentSeries: number;

export function closeResults() {
  sprintStart.classList.remove('hidden');
  sprintGame.classList.add('hidden');
  sprintResult.classList.add('hidden');
}

closeSprint.addEventListener('click', () => {
  sprint.classList.add('hidden');
  dictionarySection.classList.remove('hidden');
  footerSection.classList.remove('hidden');
  dictionaryGameFooter.classList.remove('footer-hidden');
  closeResults();
});

newSprint.addEventListener('click', () => {
  closeResults();
});

function generateResultWord(el: HTMLDivElement, word: TAggregatedWord) {
  const div = document.createElement('div');
  div.classList.add('result-word');
  div.innerHTML = `
<div></div>
<div>${word.word}</div>
<div>-</div>
<div>${word.wordTranslate}</div>
  `;
  if (el === sprintResultMistakes) {
    sprintResultMistakes.append(div);
  } else {
    sprintResultCorrect.append(div);
  }
  div.addEventListener('click', () => {
    const audio = new Audio(`${ELinks.link}/${word.audio}`);
    audio.play();
  });
}

function getSprintResultHeader() {
  const totalAnsweredQuestions = rightAnswers.length + wrongAnswers.length;
  const countRightAnswers = rightAnswers.length;
  const percentRightAnswer = Math.round((countRightAnswers / totalAnsweredQuestions) * 100);

  if (percentRightAnswer === ResultGrade.excellent) {
    return 'Превосходный результат, поздравляем!';
  } else if (percentRightAnswer < ResultGrade.excellent && percentRightAnswer > ResultGrade.good) {
    return 'Хороший результат, поздравляем!';
  } else if (percentRightAnswer < ResultGrade.good && percentRightAnswer > ResultGrade.bad) {
    return 'Неплохо, однако возможно лучше :)!';
  } else {
    return 'Не отчаивайтесь, все обязательно получится!';
  }
}

function getResults() {
  new Audio('./assets/sounds/roundEnd.mp3').play();
  sprintGame.classList.add('hidden');
  sprintResult.classList.remove('hidden');
  countSprintResultMistakes.innerHTML = wrongAnswers.length.toString();
  countSprintResultCorrect.innerHTML = rightAnswers.length.toString();
  wrongAnswers.forEach(el => generateResultWord(sprintResultMistakes, el));
  rightAnswers.forEach(el => generateResultWord(sprintResultCorrect, el));
  sprintResultVerdict.innerHTML = getSprintResultHeader();
  updateBestSeriesFn('sprint', bestSeries);
}

export function generateQuestion() {
  sprintWord.innerHTML = wordsForGame[sprintWordNumber].word;
  currentWord = wordsForGame[sprintWordNumber];
  const questionWrongAnswers = wordsForGame.slice();
  questionWrongAnswers.splice(sprintWordNumber, 1);
  const wrongAnswerIndex = Math.floor(Math.random() * (questionWrongAnswers.length));
  const wrongAnswer = questionWrongAnswers[wrongAnswerIndex].wordTranslate;
  currentRightAnswer = wordsForGame[sprintWordNumber].wordTranslate;
  const gameAnswers = [currentRightAnswer, wrongAnswer];
  sprintWordTranslation.innerHTML = gameAnswers[Math.round(Math.random())];
}

function nextQuestion() {
  if (sprintWordNumber < wordsForGame.length - 1) {
    sprintWordNumber++;
    sprintGameInfoCurrentNumber.innerHTML = `${+sprintWordNumber + 1}`;
    generateQuestion();
  } else {
    getResults();
  }
  sprintWrongBtn.disabled = false;
  sprintRightBtn.disabled = false;
}

function resultAnswer(btn: string) {
  sprintWrongBtn.disabled = true;
  sprintRightBtn.disabled = true;
  sprintWordResult.classList.remove('visibility');
  if (sprintWordTranslation.innerHTML === currentRightAnswer && btn === 'right' ||
  sprintWordTranslation.innerHTML !== currentRightAnswer && btn === 'wrong') {
    new Audio('./assets/sounds/correct.mp3').play();
    sprintWordResult.classList.add('right-answer');
    rightAnswers.push(currentWord);
    setTimeout(() => {
      sprintWordResult.classList.add('visibility');
      sprintWordResult.classList.remove('right-answer');
      nextQuestion();
    }, 600);
    if (store.isAuthorized) {
      updateGameStats('sprint', true, currentWord.id || currentWord._id);
      updateUserStatisticsFn('sprint', true);
      currentSeries++;
    }
  } else {
    new Audio('./assets/sounds/wrong1.wav').play();
    sprintWordResult.classList.add('wrong-answer');
    wrongAnswers.push(currentWord);
    setTimeout(() => {
      sprintWordResult.classList.add('visibility');
      sprintWordResult.classList.remove('wrong-answer');
      nextQuestion();
    }, 600);
    if (store.isAuthorized) {
      updateGameStats('sprint', false, currentWord.id || currentWord._id);
      updateUserStatisticsFn('sprint', false);
      isEasyWordInGameFn(currentWord.id || currentWord._id);
      if (currentSeries > bestSeries) {
        bestSeries = currentSeries;
      }
      currentSeries = 0;
    }
  }
}

sprintWrongBtn.addEventListener('click', () => {
  resultAnswer('wrong');
});
sprintRightBtn.addEventListener('click', () => {
  resultAnswer('right');
});

document.addEventListener('keyup', function (e) {
  if (sprintWrongBtn.disabled === false && !sprintGame.classList.contains('hidden')) {
    if (e.code === 'ArrowRight') {
      resultAnswer('right');
    } else if (e.code === 'ArrowLeft') {
      resultAnswer('wrong');
    }
  }
});

function startTimer() {
  let startTime = 60;
  sprintTimer.innerHTML = startTime.toString();
  setIntervalID = setInterval(() => {
    if (!sprintResult.classList.contains('hidden')) {
      clearInterval(setIntervalID);
    }
    if (startTime > 0) {
      startTime--;
      sprintTimer.innerHTML = startTime.toString();
    } else {
      clearInterval(setIntervalID);
      if (sprintResult.classList.contains('hidden')) {
        getResults();
      }
    }
    if (sprint.classList.contains('hidden')) {
      clearInterval(setIntervalID);
    }
  }, 600);
}

function getLevelName(lev: string) {
  switch (lev) {
    case '0':
      return 'A1.';
    case '1':
      return 'A2.';
    case '2':
      return 'B1.';
    case '3':
      return 'B2.';
    case '4':
      return 'C1.';
    case '5':
      return 'C2.';
    default:
      return '';
  }
}

export async function getWordsForGame(level: string, fromFooter: boolean) {
  sprintWordNumber = 0;
  clearInterval(setIntervalID);
  sprintWord.innerHTML = '';
  sprintWordTranslation.innerHTML = '';
  sprintResultCorrect.innerHTML = '';
  sprintResultMistakes.innerHTML = '';
  sprintTimer.innerHTML = '';
  sprintResultVerdict.innerHTML = '';
  sprintGameInfoLevel.innerHTML = '';
  sprintGameInfoPage.innerHTML = '';
  sprintGameInfoCountWords.innerHTML = '';
  sprintGameInfoCurrentNumber.innerHTML = '1';
  bestSeries = 0;
  currentSeries = 0;
  const page = String(Math.floor(Math.random() * 30));
  let link: string;

  if (store.isAuthorized) {
    if (!fromFooter) {
      wordsForGame = await getWords(level, page);
      sprintGameInfoLevel.innerHTML = getLevelName(level);
      sprintGameInfoPage.innerHTML = `${(+page + 1)}.`;
      sprintGameInfoCountWords.innerHTML = wordsForGame.length.toString() + '.';
    } else {
      if (store.isComplicatedWordPage) {
        const linkStr = 'aggregatedWords?wordsPerPage=3600&filter=%7B%22userWord.difficulty%22%3A%22hard%22%7D';
        link = `${ELinks.users}/${localStorage.getItem('userId')}/${linkStr}`;
        sprintGameInfoLevel.innerHTML = 'Cложные слова.';
        sprintGameInfoPage.innerHTML = 'Cложные слова.';
        wordsForGame = (await getAggregatedWords(localStorage.getItem('token') || '', link))[0].paginatedResults;
        sprintGameInfoCountWords.innerHTML = wordsForGame.length.toString() + '.';
      } else {
        const linkStr = `wordsPerPage=20&filter=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.difficulty%22%3A%22empty%22%7D%2C%20%7B%22userWord.difficulty%22%3A%22hard%22%7D%2C%20%7B%22userWord%22%3Anull%7D%5D%7D%2C%20%7B%22page%22%3A${store.currentPage}%7D%5D%7D`;
        link = `${ELinks.users}/${localStorage.getItem('userId')}/aggregatedWords?group=${store.currentLevel}&${linkStr}`;
        sprintGameInfoLevel.innerHTML = getLevelName(store.currentLevel);
        sprintGameInfoPage.innerHTML = `${(+store.currentPage + 1)}.`;
        wordsForGame = (await getAggregatedWords(localStorage.getItem('token') || '', link))[0].paginatedResults;
        sprintGameInfoCountWords.innerHTML = wordsForGame.length.toString() + '.';
      }
    }
  } else {
    if (!fromFooter) {
      sprintGameInfoLevel.innerHTML = getLevelName(level);
      sprintGameInfoPage.innerHTML = `${(+page + 1)}.`;
      wordsForGame = await getWords(level, page);
      sprintGameInfoCountWords.innerHTML = wordsForGame.length.toString() + '.';
    } else {
      sprintGameInfoLevel.innerHTML = getLevelName(store.currentLevel);
      sprintGameInfoPage.innerHTML = `${(+store.currentPage + 1)}.`;
      wordsForGame = await getWords(store.currentLevel, store.currentPage);
      sprintGameInfoCountWords.innerHTML = wordsForGame.length.toString() + '.';
    }
  }
  rightAnswers = [];
  wrongAnswers = [];
  if (wordsForGame.length > 1) {
    generateQuestion();
    startTimer();
  } else {
    alert('Недостаточно слов для игры');
    closeResults();
  }
}
