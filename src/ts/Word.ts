import { TGetWords, WordDifficulty, TAggregatedWord }  from './type/types';
import {
  createUserWord,
  updateUserWord,
  getAggregatedWordById,
  deleteUserWord,
} from './requests';
import { renderDictionary } from './renderDictionary';
import isExploredPage from './exploredPage';
import { getWordStatisticsInGame } from './statistics/word-statistics';
import { store } from './store/store';

class Word {
  word: TGetWords | TAggregatedWord;

  isAuthorized: boolean;

  isComplicated: boolean;

  element = document.createElement('div') as HTMLDivElement;

  hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-levels button:last-child');

  wordStatisticsInGames = <HTMLDivElement>document.querySelector('.word-statistics-in-games');

  wordStatisticsHeaderWord = <HTMLParagraphElement>document.querySelector('.word-statistics-header p');

  audioCallRight = <HTMLElement>document.getElementById('audiocall-right');

  audioCallWrong = <HTMLElement>document.getElementById('audiocall-wrong');

  sprintRight = <HTMLElement>document.getElementById('sprint-right');

  sprintWrong = <HTMLElement>document.getElementById('sprint-wrong');

  audioArr: Array<HTMLAudioElement> = [];

  constructor(word: TGetWords | TAggregatedWord, isAutorized: boolean, isComplicated: boolean ) {
    this.word = word;
    this.isAuthorized = isAutorized;
    this.isComplicated = isComplicated;
    this.audioArr = [];
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
  };

  setCardDifficalty = async (event: Event) => {
    const currentBtn = event.target as HTMLOrSVGImageElement;
    const btnDifficalty = currentBtn.dataset.difficalty;

    const isAlreadyHard =  this.element.classList.contains('active-hard');
    const isAlreadyEasy =  this.element.classList.contains('active-easy');

    const hasUserWord = (await getAggregatedWordById(localStorage.getItem('userId') || '', this.word.id || this.word._id, localStorage.getItem('token') || ''))[0].userWord;


    if ( btnDifficalty === WordDifficulty.hard) {
      this.element.classList.toggle('active-hard');

      if (this.isComplicated) {
        await deleteUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, localStorage.getItem('token') || '');
        renderDictionary(this.isComplicated);
      } else {
        if (isAlreadyEasy) {
          this.element.classList.remove('active-easy');
        }

        if (!isAlreadyHard) {

          if (hasUserWord) {
            await updateUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, { difficulty: 'hard', optional: hasUserWord.optional }, localStorage.getItem('token') || '');
          } else {
            await createUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, { difficulty: 'hard', optional: store.optional }, localStorage.getItem('token') || '');
          }
        } else {
          if (hasUserWord) {
            await updateUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, { difficulty: WordDifficulty.empty, optional: hasUserWord.optional }, localStorage.getItem('token') || '');
          } else {
            await deleteUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, localStorage.getItem('token') || '');
          }
        }
        await isExploredPage();
      }
    }

    if (btnDifficalty === WordDifficulty.easy) {
      this.element.classList.toggle('active-easy');
      if (isAlreadyHard) {
        this.element.classList.remove('active-hard');
      }

      if (isAlreadyEasy) {
        if (hasUserWord) {
          await updateUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, { difficulty: WordDifficulty.empty, optional: hasUserWord.optional }, localStorage.getItem('token') || '');
        } else {
          await deleteUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, localStorage.getItem('token') || '');
        }
      } else {
        if (hasUserWord) {
          await updateUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, { difficulty: 'easy', optional: hasUserWord.optional }, localStorage.getItem('token') || '');
        } else {
          await createUserWord(localStorage.getItem('userId') || '', this.word.id || this.word._id, { difficulty: 'easy', optional: store.optional }, localStorage.getItem('token') || '');
        }
      }
      await isExploredPage();
    }

    if (btnDifficalty === WordDifficulty.statistics) {
      const info = await getWordStatisticsInGame(this.word.id || this.word._id);
      if (info) {
        this.audioCallRight.innerHTML = info.optional.games.audiocall.right.toString();
        this.audioCallWrong.innerHTML = info.optional.games.audiocall.wrong.toString();
        this.sprintRight.innerHTML = info.optional.games.sprint.right.toString();
        this.sprintWrong.innerHTML = info.optional.games.sprint.wrong.toString();
      }
      this.wordStatisticsHeaderWord.innerHTML = this.word.word;
      this.wordStatisticsInGames.classList.remove('hidden');
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

    let difficulty: string | undefined;
    const isDifficulty = async () => {
      difficulty = (await getAggregatedWordById(localStorage.getItem('userId') || '', this.word.id || this.word._id, localStorage.getItem('token') || ''))[0].userWord?.difficulty;
      if (difficulty && difficulty !== WordDifficulty.empty && difficulty !== ' ') {
        card.classList.add(`active-${difficulty}`);
      }
    };
    if (!this.hardWordsBtn.classList.contains('hidden')) {
      isDifficulty();
    }

    card.innerHTML = `
    <div class="dictionary-card_left">
      <img src="https://bukman-rs-lang.herokuapp.com/${this.word.image}" alt="word image">
    </div>
    <div class="dictionary-card_right">
      <div class="word-name">
        <p><strong>${this.word.word}</strong></p>
          <div class="word-contrals ${ !this.isAuthorized ? 'hidden' : ''}">
              <button class="word-contrals-item hard" data-difficalty="hard" title="Сложное слово">
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" data-difficalty="hard">
                <path d="M25.25 1.25C23.8625 0.8125 22.3375 0.625 20.875 0.625C18.4375 0.625 15.8125 1.125 14 2.5C12.1875 1.125 9.5625 0.625 7.125 0.625C4.6875 0.625 2.0625 1.125 0.25 2.5V20.8125C0.25 21.125 0.5625 21.4375 0.875 21.4375C1 21.4375 1.0625 21.375 1.1875 21.375C2.875 20.5625 5.3125 20 7.125 20C9.5625 20 12.1875 20.5 14 21.875C15.6875 20.8125 18.75 20 20.875 20C22.9375 20 25.0625 20.375 26.8125 21.3125C26.9375 21.375 27 21.375 27.125 21.375C27.4375 21.375 27.75 21.0625 27.75 20.75V2.5C27 1.9375 26.1875 1.5625 25.25 1.25ZM25.25 18.125C23.875 17.6875 22.375 17.5 20.875 17.5C18.75 17.5 15.6875 18.3125 14 19.375V5C15.6875 3.9375 18.75 3.125 20.875 3.125C22.375 3.125 23.875 3.3125 25.25 3.75V18.125Z" fill="white" data-difficalty="hard"/>
                </svg>
              </button>
              <button class="word-contrals-item easy ${ this.isComplicated ? 'hidden' : ''}" data-difficalty="easy" title="Изученное слово">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" data-difficalty="easy"
                 xmlns="http://www.w3.org/2000/svg">
                  <path data-difficalty="easy"
                  d="M20.7375 9.475L12.5 17.7125L8.0125 13.2375L6.25 15L12.5 21.25L22.5 11.25L20.7375 9.475ZM15
                  2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5
                    15 2.5ZM15 25C9.475 25 5 20.525 5 15C5 9.475 9.475 5 15 5C20.525 5 25 9.475 25 15C25 20.525 20.525
                    25 15 25Z" fill="white"/>
                </svg>
              </button>
              <button class="word-contrals-item" data-difficalty="statistics" title="Статистика в играх">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" data-difficalty="statistics" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 24H15V0H9V24ZM0 24H6V12H0V24ZM18 7.5V24H24V7.5H18Z" fill="white" data-difficalty="statistics"/>
              </svg>
            </button>
            </div>
      </div>
      <div class="word-translation">${this.word.wordTranslate}</div>
      <div class="word-transcription"> ${this.word.transcription} <span class="word-transcription-sound">
        <audio src="https://bukman-rs-lang.herokuapp.com/${this.word.audio}" ></audio>
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
