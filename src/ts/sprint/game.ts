import { getAggregatedWords, getWords } from '../requests';
import { ELinks, TAggregatedWord } from '../type/types';
import { store } from '../store/store';

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


let currentRightAnswer = '';
let currentWord: TAggregatedWord;
let sprintWordNumber: number;
let currentSprintLevel: string;
let wordsForGame: TAggregatedWord[];
let wrongAnswers: TAggregatedWord[];
let rightAnswers: TAggregatedWord[];

sprintWrongBtn.addEventListener('click', () => {
  resultAnswer('wrong');
  console.log('sprintWordWrong click')
});
sprintRightBtn.addEventListener('click', () => {
  resultAnswer('right');
  console.log('sprintWordRight click')
});

closeSprint.addEventListener('click', () => {
  sprintStart.classList.remove('hidden');
  sprintGame.classList.add('hidden');
  sprintResult.classList.add('hidden');
})

newSprint.addEventListener('click', () => {
  sprintGame.classList.remove('hidden');
  sprintResult.classList.add('hidden');
  getWordsForGame(currentSprintLevel);
})

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
    console.log(word.audio)
    const audio = new Audio(`${ELinks.link}/${word.audio}`);
    audio.play();
  })
}

function getResults() {
  console.log('getResults')
  console.log('wrongAnswers', wrongAnswers)
  console.log('rigthAnswers', rightAnswers)
  wrongAnswers.shift();
  rightAnswers.shift();
  sprintGame.classList.add('hidden');
  sprintResult.classList.remove('hidden');
  countSprintResultMistakes.innerHTML = wrongAnswers.length.toString();
  countSprintResultCorrect.innerHTML = rightAnswers.length.toString();
  wrongAnswers.forEach(el => generateResultWord(sprintResultMistakes, el));
  rightAnswers.forEach(el => generateResultWord(sprintResultCorrect, el));
}


function resultAnswer(btn: string) {
  sprintWrongBtn.disabled = true;
  sprintRightBtn.disabled = true;
  sprintWordResult.classList.remove('visibility');
  if (sprintWordTranslation.innerHTML === currentRightAnswer && btn === 'right' ||
  sprintWordTranslation.innerHTML !== currentRightAnswer && btn === 'wrong') {
    sprintWordResult.classList.add('right-answer');
    rightAnswers.push(currentWord);
    setTimeout(() => {
      sprintWordResult.classList.add('visibility');
      sprintWordResult.classList.remove('right-answer');
      nextQuestion();
    }, 600);
  } else {
    sprintWordResult.classList.add('wrong-answer');
    wrongAnswers.push(currentWord);
    setTimeout(() => {
      sprintWordResult.classList.add('visibility');
      sprintWordResult.classList.remove('wrong-answer');
      nextQuestion();
    }, 600);
  }


}

function nextQuestion() {
  if (sprintWordNumber < wordsForGame.length - 1) {
    sprintWordNumber++;
    generateQuestion();
  } else {
    getResults();
  }
  sprintWrongBtn.disabled = false;
  sprintRightBtn.disabled = false;
}


export function generateQuestion() {
  console.log('sprintWordNumber', sprintWordNumber)
  sprintWord.innerHTML = wordsForGame[sprintWordNumber].word;
  currentWord = wordsForGame[sprintWordNumber];
  const wrongAnswers = wordsForGame.slice();
  wrongAnswers.splice(sprintWordNumber, 1);
  const wrongAnswerIndex = Math.floor(Math.random() * (wrongAnswers.length));
  const wrongAnswer = wrongAnswers[wrongAnswerIndex].wordTranslate;
  currentRightAnswer = wordsForGame[sprintWordNumber].wordTranslate;
  const gameAnswers = [currentRightAnswer, wrongAnswer];
  sprintWordTranslation.innerHTML = gameAnswers[Math.round(Math.random())];
}

function startTimer() {
  let startTime = 10;
  sprintTimer.innerHTML = startTime.toString();
  const setIntervalID = setInterval(() => {
    console.log(startTime)
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
  }, 600)
}


export async function getWordsForGame(level: string) {
  sprintWordNumber = 0;
  currentSprintLevel = level;
  sprintResultCorrect.innerHTML = '';
  sprintResultMistakes.innerHTML = '';
  if (store.isAuthorized) {
    const linkStr = 'wordsPerPage=20&filter=%7B%22%24or%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%2C%7B%22userWord%22%3Anull%7D%5D%7D';
    const link = `${ELinks.users}/${localStorage.getItem('userId')}/aggregatedWords?group=${store.currentLevel}&page=${store.currentPage}&${linkStr}`;
    wordsForGame = (await getAggregatedWords(localStorage.getItem('token') || '', link))[0].paginatedResults;
  } else {
    const page = String(Math.floor(Math.random() * 30));
    wordsForGame = await getWords(level, page);
  }
  console.log(wordsForGame)
  wrongAnswers = [wordsForGame[0]];
  rightAnswers = [wordsForGame[0]];
  generateQuestion();
  startTimer();
}
