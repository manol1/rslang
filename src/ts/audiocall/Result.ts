import { TGetWords } from '../type/types';
import Question from '../audiocall/Question';
import { renderDictionary } from '../renderDictionary';

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

  bindListener() {
    const playSoundBtn = this.element.querySelectorAll('.audiocall-result__sound-btn');
    const closeBtn = this.element.querySelector('.close-result');

    playSoundBtn.forEach( btn => btn.addEventListener('click', (event: Event) => {
      const currentWord = event?.target as HTMLElement;
      const audio = currentWord.querySelector('audio');
      audio?.play();
    }));

    closeBtn?.addEventListener('click', () => this.element.classList.add('hidden'));
    renderDictionary();
  }

  generate() {
    return `
    <div class="close-result">X</div>
      <h2 class="audiocall-result__title">Отличный результат,
        поздравляем!</h2>
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
    `;
  }

  mount(perent: HTMLElement) {
    perent.innerHTML = this.generate();
    this.element = perent;
  }
}
