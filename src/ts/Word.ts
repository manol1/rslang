import { TGetWords, WordDifficulty }  from './type/types';

class Word {
  word:TGetWords;

  isAuthorized: boolean;

  element = document.createElement('div') as HTMLDivElement;

  audioArr: Array<HTMLAudioElement> = [];

  constructor(word:TGetWords, isAutorized: boolean ) {
    this.word = word;
    this.isAuthorized = isAutorized;
  }

  public  playSound = async () => {
    const soundUrls = [
      `https://bukman-rs-lang.herokuapp.com/${this.word.audio}`,
      `https://bukman-rs-lang.herokuapp.com/${this.word.audioMeaning}`,
      `https://bukman-rs-lang.herokuapp.com/${this.word.audioExample}`,
    ];

    if (this.audioArr.length === 0 || this.audioArr[0].src !== soundUrls[0]) {
      this.audioArr = soundUrls.map(src =>new Audio(src));
    } else {
      this.audioArr.forEach( audio => {
        audio.currentTime = 0;
        audio.pause();
      });
    }

    for (const audio of this.audioArr) {
      audio.play();
      try {
        await new Promise((reject, resolve): void => {
          audio.addEventListener('ended', () => {
            resolve();
          });
          audio.addEventListener('error', (err) => {
            reject(err);
          });
        });
      } catch (error) {
        console.log( error);
      }
    }
    // const audio = new WordSound(this.audioArr);
    // audio.play();
  };

  setCardDifficalty = (event: Event) => {
    const currentBtn = event.target as HTMLOrSVGImageElement;
    const btnDifficalty = currentBtn.dataset.difficalty;

    const isAlreadyHard =  this.element.classList.contains('active-hard');
    const isAlreadyEasy =  this.element.classList.contains('active-easy');

    if ( btnDifficalty === WordDifficulty.hard) {
      if (isAlreadyEasy) {
        this.element.classList.remove('active-easy');
      }
      this.element.classList.toggle('active-hard');
    }

    if (btnDifficalty === WordDifficulty.easy) {
      if (isAlreadyHard) {
        this.element.classList.remove('active-hard');
      }
      this.element.classList.toggle('active-easy');
    }
  };

  bindListener() {
    const playSoundBtn = this.element.querySelector('.word-transcription-sound') as HTMLElement;
    playSoundBtn.addEventListener('click', this.playSound);

    const cardAction = this.element.querySelectorAll('.word-contrals-item');
    cardAction.forEach(btn => btn.addEventListener('click', this.setCardDifficalty));
  }

  render(perent: HTMLDivElement) {
    const card = document.createElement('div');
    card.classList.add('dictionary-card');
    card.innerHTML = `
    <div class="dictionary-card_left">
      <img src="https://bukman-rs-lang.herokuapp.com/${this.word.image}" alt="word image">
    </div>
    <div class="dictionary-card_right">
      <div class="word-name">
        <p><strong>${this.word.word}</strong></p>
          <div class="word-contrals ${ !this.isAuthorized ? 'hidden' : ''}">
              <button class="word-contrals-item hard" data-difficalty="hard">
                <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" data-difficalty="hard"
                 xmlns="http://www.w3.org/2000/svg">
                  <path data-difficalty="hard"
                  d="M23 5.5V20C23 22.2 21.2 24 19 24H11.7C10.62 24 9.6 23.57 8.85 22.81L1 14.83C1 14.83
                  2.26 13.6 2.3 13.58C2.52 13.39 2.79 13.29 3.09 13.29C3.31 13.29 3.51 13.35 3.69 13.45C3.73 13.46
                  8 15.91 8 15.91V4C8 3.17 8.67 2.5 9.5 2.5C10.33 2.5 11 3.17 11 4V11H12V1.5C12 0.67 12.67 0 13.5
                    0C14.33 0 15 0.67 15 1.5V11H16V2.5C16 1.67 16.67 1 17.5 1C18.33 1 19 1.67 19 2.5V11H20V5.5C20
                    4.67 20.67 4 21.5 4C22.33 4 23 4.67 23 5.5Z" fill="white"/>
                </svg>
              </button>
              <button class="word-contrals-item easy" data-difficalty="easy">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" data-difficalty="easy"
                 xmlns="http://www.w3.org/2000/svg">
                  <path data-difficalty="easy"
                  d="M20.7375 9.475L12.5 17.7125L8.0125 13.2375L6.25 15L12.5 21.25L22.5 11.25L20.7375 9.475ZM15
                  2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5
                    15 2.5ZM15 25C9.475 25 5 20.525 5 15C5 9.475 9.475 5 15 5C20.525 5 25 9.475 25 15C25 20.525 20.525
                    25 15 25Z" fill="white"/>
                </svg>
              </button>
            </div>
      </div>
      <div class="word-translation">${this.word.wordTranslate}</div>
      <div class="word-transcription"> ${this.word.transcription} <span class="word-transcription-sound">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8.99998V15H7L12 20V3.99998L7 8.99998H3ZM16.5 12C16.5 10.23 15.48 8.70998 14 7.96998V16.02C15.48
           15.29 16.5 13.77 16.5 12ZM14 3.22998V5.28998C16.89 6.14998 19 8.82998 19 12C19 15.17 16.89 17.85 14
            18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.71998 18.01 4.13998 14 3.22998Z" fill="white"/>
        </svg>
      </span> </div>
      <div class="word-mining">${this.word.textMeaning}</div>
      <div class="word-mining-transcription">${this.word.textMeaningTranslate}</div>
      <hr>
      <div class="word-example">${this.word.textExample}</div>
      <div class="word-example-transcription">${this.word.textExampleTranslate}</div>
    </div>`;
    perent.appendChild(card);
    this.element = card;
  }
}

export default Word;

