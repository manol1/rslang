import { TGetWords }  from './type/types';
class Word {
  word:TGetWords;

  constructor(word:TGetWords) {
    this.word = word;
  }

  render(perent: HTMLDivElement) {
    const card = document.createElement('div');
    card.classList.add('dictionary-card');
    card.innerHTML = `
    <div class="dictionary-card_left">
      <img src="https://react-rslang-team15.herokuapp.com/${this.word.image}" alt="word image">
    </div>
    <div class="dictionary-card_right">
      <div class="word-name">
        <p><strong>${this.word.word}</strong></p>
        <div class="word-contrals">
          <botton class="word-contrals-item hard">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 5.5V20C23 22.2 21.2 24 19 24H11.7C10.62 24 9.6 23.57 8.85 22.81L1 14.83C1 14.83
              2.26 13.6 2.3 13.58C2.52 13.39 2.79 13.29 3.09 13.29C3.31 13.29 3.51 13.35 3.69 13.45C3.73 13.46
               8 15.91 8 15.91V4C8 3.17 8.67 2.5 9.5 2.5C10.33 2.5 11 3.17 11 4V11H12V1.5C12 0.67 12.67 0 13.5
                0C14.33 0 15 0.67 15 1.5V11H16V2.5C16 1.67 16.67 1 17.5 1C18.33 1 19 1.67 19 2.5V11H20V5.5C20
                 4.67 20.67 4 21.5 4C22.33 4 23 4.67 23 5.5Z" fill="white"/>
            </svg>
          </botton>
          <botton class="word-contrals-item easy">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.7375 9.475L12.5 17.7125L8.0125 13.2375L6.25 15L12.5 21.25L22.5 11.25L20.7375 9.475ZM15
               2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5
                15 2.5ZM15 25C9.475 25 5 20.525 5 15C5 9.475 9.475 5 15 5C20.525 5 25 9.475 25 15C25 20.525 20.525
                 25 15 25Z" fill="white"/>
            </svg>
          </botton>
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
  }
}

export default Word;

// class Question {
//   constructor(question) {
//       this.questionElement = document.querySelector('#question');
//       this.answerElements = [
//           document.querySelector('#a1'),
//           document.querySelector('#a2'),
//           document.querySelector('#a3'),
//           document.querySelector('#a4'),
//       ];

//       this.correctAnswer = question.correct_answer;
//       this.question = question.question;
//       this.isCorrect = false;

//       this.answers = this.shuffleAnswers([
//           question.correct_answer,
//           ...question.incorrect_answers
//       ]);
//   }

//   shuffleAnswers(answers) {
//       for(let i = answers.lenght - 1; i > 0; i--) {
//           const j = Math.floor(Math.random()*i)
//           const temp = answers[i];
//           answers[i] = answers[j];
//           answers[j] = temp;

//       }
//       return answers;
//   }

//   answer(checkedElement) {
//       console.log('checkedElement[0].textContent', checkedElement[0].textContent)
//       this.isCorrect = (checkedElement[0].textContent === this.correctAnswer) ? true : false;

//   }

//   render() {
//       this.questionElement.innerHTML = this.question;
//       this.answerElements.forEach( (el, index) => {
//           el.innerHTML = `<input type="radio" name="radio"><span class="checkmark"></span>${this.answers[index]}`;
//       });

//   }
// }
