import { TGetWords } from '../type/types';
import { getWords } from '../requests';
import { store } from '../store/store';
import { shuffle } from './utils';

class Question {

  questionWordEl = document.querySelector('#question-word') as HTMLElement;

  questionImg = document.querySelector('.audiocall-question__img') as HTMLImageElement;

  correctAnswer: string;

  sound: string;

  isCorrect: boolean;

  answersArr: string[];

  words: TGetWords[];

  word: TGetWords;

  wordTranslate: string;

  audio: HTMLAudioElement;

  quizElement: HTMLDivElement;

  element = document.createElement('div');

  constructor(question: TGetWords, words: TGetWords[] ) {
    this.word = question;
    this.correctAnswer = question.wordTranslate;
    this.sound = question.audio;
    this.wordTranslate = question.wordTranslate;
    this.isCorrect = false;
    this.words = words;
    this.answersArr = this.getAnswersArr();
    this.audio = new Audio();
    this.quizElement = document.querySelector('.audiocall-question') as HTMLDivElement;
  }

  getAnswersArr = () => {
    this.answersArr = [this.correctAnswer];

    while (this.answersArr.length < 5) {
      const randomWord = this.words[Math.floor(Math.random() * this.words.length)].wordTranslate;
      if (!this.answersArr.includes(randomWord)) {
        this.answersArr.push(randomWord);
      }
    }
    return shuffle(this.answersArr);
  };

  bindListener = () => {
    const playBtn = this.element.querySelector('.audiocall-question__sound-btn');
    const audioEl = playBtn?.querySelector('audio');
    playBtn?.addEventListener('click', async () => {
      audioEl?.play();
    });
  };

  answer(choosedAnswer: string) {
    console.log('choosedAnswer', choosedAnswer);
    return this.isCorrect = (choosedAnswer === this.correctAnswer) || false;
  }

  generateAnwersArr = () => {
    let html = '';
    this.answersArr.forEach( (answer, index) => {
      html += `<div class="btn answer-item" id="answer-${index}">${answer}</div>`;
    });
    return html;
  };

  render(perent: HTMLElement) {
    const quastionBlock = document.createElement('div');
    quastionBlock.classList.add('audiocall-question__info');
    quastionBlock.classList.add('hidden');
    quastionBlock.setAttribute('data-sound', this.word.id);
    const htmlquastionBlock = `
      <img src="https://bukman-rs-lang.herokuapp.com/${this.word.image}" alt="answer image" class="audiocall-question__img info-item">
      <div class="info-item center">
        <div class="audiocall-question__sound-btn">
        <audio src="https://bukman-rs-lang.herokuapp.com/${this.word.audio}" ></audio>
        </div>
        <div class="audiocall-question__word" id="question-word">${this.correctAnswer}</div>
      </div>
      <div class="info-item"></div>
    `;
    quastionBlock.innerHTML = htmlquastionBlock;

    const answerBlock = document.createElement('div');
    answerBlock.classList.add('audiocall-question__answers');
    const htmlAnswerBlock = `
      ${this.generateAnwersArr()}
    `;
    answerBlock.innerHTML = htmlAnswerBlock;

    perent.appendChild(quastionBlock);
    perent.appendChild(answerBlock);

    this.element = quastionBlock;
  }
}

export default Question;


// render() {
//   this.questionWordEl.innerHTML = this.correctAnswer;
//   this.quizElement.setAttribute('data-sound', this.word.id);
//   this.questionImg.src = `https://bukman-rs-lang.herokuapp.com/${this.word.image}`;
//   this.audio.src = `https://bukman-rs-lang.herokuapp.com/${this.word.audio}`;

//   console.log('answerElements: ', this.answerElements, this.correctAnswer);
//   console.log('this.word.id: ', this.word.id);
//   this.answerElements.forEach( (el, index) => {
//     el.textContent = this.answersArr[index];
//   });
// }
