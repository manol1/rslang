import { ResultGrade } from '../type/types';
import Question from '../audiocall/Question';
import { navigateToAudiocallStart,
  navigateBackToDictionary } from './utils';

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
      return 'Не отчаивайтесь, все обязательно получится!';
    }
  }

  bindListener() {
    const playSoundBtn = this.element.querySelectorAll('.audiocall-result__sound-btn');
    const playAgainBtn = this.element.querySelector('.audiocall-result_play-again');
    const backToDictionaryBtn = this.element.querySelector('.audiocall-result_back-dictionary');

    playSoundBtn.forEach( btn => btn.addEventListener('click', (event: Event) => {
      const currentWord = event?.target as HTMLElement;
      const audio = currentWord.querySelector('audio');
      audio?.play();
    }));

    playAgainBtn?.addEventListener('click', navigateToAudiocallStart);
    backToDictionaryBtn?.addEventListener('click', navigateBackToDictionary);
    // backToDictionaryBtn?.addEventListener('click', () => renderDictionary());
  }

  generate() {
    return `

      <h2 class="audiocall-result__title">${this.generateCongratulation(this.correctAnswers.length)}</h2>
      <div class="audiocall-result__wrong">
        <div class="audiocall-result__subheader">
          <h3 class="audiocall-result__subtitle">Не знаю</h3>
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

