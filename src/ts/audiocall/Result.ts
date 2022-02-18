import { TGetWords, ResultGrade } from '../type/types';
import Question from '../audiocall/Question';
import { renderDictionary } from '../renderDictionary';
import startAudioCallGame from './startAudioCallGame';

export default class Result {

  element = document.createElement('div') as HTMLElement;

  constructor(
    public wrongAnswers: Question[],
    public correctAnswers: Question[],
  ) {
  }

  generateWordArr(array: Question[]) {
    let html = '';
    array.forEach(word => {
      html += `
      <li class="result-item">
          <div class="audiocall-result__sound-btn">
            <audio src="https://bukman-rs-lang.herokuapp.com/${word.word.audio}" ></audio>
          </div>
          <div class="audiocall-result__word">${word.word.word}</div>
          <div class="audiocall-result__word_translation"> <span> — </span>${word.wordTranslate}</div>
        </li>
      `;
    });
    return html;
  }

  navigateToAudiocallStart() {
    const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;
    const audiocallWelcome = document.querySelector('.audiocall-welcome');
    audiocallResult.classList.add('hidden');
    audiocallWelcome?.classList.remove('hidden');
  }

  navigateBackToDictionary() {
    const dictionarySection = document.querySelector('.dictionary');
    const footerSection = document.querySelector('.footer');
    const dictionaryGameFooter = document.querySelector('.dictionary-footer');
    const audiocallSection = document.querySelector('.audiocall');
    const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;

    dictionarySection?.classList.remove('hidden');
    footerSection?.classList.remove('hidden');
    dictionaryGameFooter?.classList.remove('footer-hidden');
    audiocallSection?.classList.add('hidden');
    audiocallResult.classList.add('hidden');
  }

  generateCongratulation(correctAnswersAmount: number) {
    const totalQuestions = this.wrongAnswers.length + this.correctAnswers.length;
    const percentOfComplete = Math.round((correctAnswersAmount / totalQuestions) * 100 );
    const isExcellent = percentOfComplete === ResultGrade.excellent;
    const isVeryGood = percentOfComplete < ResultGrade.excellent && percentOfComplete > ResultGrade.good;
    const isBad = percentOfComplete < ResultGrade.good && percentOfComplete > ResultGrade.bad;

    if (isExcellent) {
      return 'Превосходный результат, поздравляем!';
    } else if (isVeryGood) {
      return 'Хороший результат, поздравляем!';
    } else if (isBad) {
      return 'Неплохо, однако возможно лучше :)!';
    } else {
      return 'Не отчайвайтесь, все обязательно получиться!';
    }
  }

  closeResult() {
    const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;
    audiocallResult.classList.add('hidden');
  }

  bindListener() {
    const playSoundBtn = this.element.querySelectorAll('.audiocall-result__sound-btn');
    const closeBtn = this.element.querySelector('.close-result');
    const playAgainBtn = this.element.querySelector('.audiocall-result_play-again');
    const backToDictionaryBtn = this.element.querySelector('.audiocall-result_back-dictionary');

    playSoundBtn.forEach( btn => btn.addEventListener('click', (event: Event) => {
      const currentWord = event?.target as HTMLElement;
      const audio = currentWord.querySelector('audio');
      audio?.play();
    }));

    closeBtn?.addEventListener('click', this.closeResult);
    closeBtn?.addEventListener('click', this.navigateBackToDictionary);

    playAgainBtn?.addEventListener('click', this.navigateToAudiocallStart);
    backToDictionaryBtn?.addEventListener('click', this.navigateBackToDictionary);
  }

  generate() {
    return `
    <div class="close-result">X</div>
      <h2 class="audiocall-result__title">${this.generateCongratulation(this.correctAnswers.length)}</h2>
      <div class="audiocall-result__wrong">
        <div class="audiocall-result__subheader">
          <h3 class="audiocall-result__subtitle">Не заню</h3>
          <div class="answer-amount wrong-amount">${this.wrongAnswers.length}</div>
        </div>
        ${this.generateWordArr(this.wrongAnswers)}
      </div>
      <div class="audiocall-result__correct">
        <div class="audiocall-result__subheader">
          <h3 class="audiocall-result__subtitle">Знаю</h3>
          <div class="answer-amount correct-amount">${this.correctAnswers.length}</div>
        </div>
        ${this.generateWordArr(this.correctAnswers)}
      </div>
      <div class="audiocall-result__navigation">
          <button class="btn audiocall-result_play-again btn-result-nav">Сыграть еще раз</button>
          <button class="btn audiocall-result_back-dictionary btn-result-nav">Вернуться в учебник</button>
      </div>
    `;
  }

  mount(perent: HTMLElement) {
    perent.innerHTML = this.generate();
    this.element = perent;
  }
}
