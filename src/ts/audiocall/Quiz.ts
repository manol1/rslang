// import Final from './final.js';
import { TGetWords } from '../type/types';
import { playSound, shuffle } from './utils';
import Question from './Question';

class Quiz {

  currentAnswer: string | null;

  answeredAmount: number;

  audiocallAnswerBtns:  NodeListOf<HTMLElement>;

  questions: Question[];

  totalAmount: number;

  totalWrongWords: string[];

  totalCorrectWords: string[];

  quizElement = document.querySelector('.audiocall-question') as HTMLDListElement;

  quizChangableEl = document.querySelector('.audiocall-question__changable') as HTMLDListElement;

  nextBtn = document.querySelector('.audiocall-question__next-btn') as HTMLButtonElement;

  constructor( questions:TGetWords[]) {
    // this.finalElement = document.querySelector('.final');
    this.totalAmount = questions.length;
    this.answeredAmount = 0;
    this.questions = this.setQuestions(questions);
    this.totalWrongWords = [];
    this.totalCorrectWords = [];
    this.currentAnswer = '';
    this.audiocallAnswerBtns = document.querySelectorAll('.answer-item');
    this.nextBtn.addEventListener('click',
      this.nextQuestion.bind(this));

    this.renderQuestion();
  }

  getAnswerWord = (e: Event) => {
    this.currentAnswer = (e.target as HTMLButtonElement).textContent;
    console.log('this.currentAnswer from getAnswerWord: ', this.currentAnswer);

    if (this.currentAnswer) {
      this.showResult();
      this.answeredAmount++;
    } else {
      console.log('this.currentAnswer is empty', this.currentAnswer);
    }
  };

  styleAnswer = () => {
    const allAnswers = document.querySelectorAll('.answer-item');
    const answerInfo = document.querySelector('.audiocall-question__info');

    allAnswers.forEach(item => {
      const correctResult = this.questions[this.answeredAmount].correctAnswer === item.textContent;

      if (item.textContent === this.currentAnswer && correctResult) {
        item.classList.add('correct');
      }

      if (item.textContent === this.currentAnswer && !correctResult) {
        item.classList.add('wrong');
      } else if (item.textContent === this.questions[this.answeredAmount].correctAnswer) {
        item.classList.add('correct');
      }
    });

    answerInfo?.classList.remove('hidden');
  };

  bindListener() {
    this.audiocallAnswerBtns = document.querySelectorAll('.answer-item');
    this.audiocallAnswerBtns.forEach(answerBtn =>
      answerBtn.addEventListener('click', this.getAnswerWord));
  }

  setQuestions = (questions: TGetWords[]) => {
    return questions.map(question => new Question(question, questions));
  };

  renderQuestion = () => {
    this.quizChangableEl.innerHTML = '';
    this.questions[this.answeredAmount].render(this.quizChangableEl);
    this.questions[this.answeredAmount].bindListener();
    this.bindListener();
  };

  nextQuestion() {
    const answerInfo = document.querySelector('.audiocall-question__info');
    answerInfo?.classList.add('hidden');

    if (this.answeredAmount < this.totalAmount) {
      this.renderQuestion();
    } else {
      this.endQuiz();
    }
    // (this.answeredAmount < this.totalAmount) ? this.renderQuestion() : this.endQuiz();
  }

  showResult = () => {
    if (this.currentAnswer) {
      const isCorrectAnswer =  this.questions[this.answeredAmount].answer(this.currentAnswer);
      if (isCorrectAnswer) {
        this.totalCorrectWords.push(this.questions[this.answeredAmount].correctAnswer);
        this.styleAnswer();
        playSound(true);

      } else {
        this.totalWrongWords.push(this.questions[this.answeredAmount].correctAnswer);
        this.styleAnswer();
        playSound(false);
      }
    }
  };

  endQuiz() {
    const audiocallResult = document.querySelector('.audiocall-result');
    const closeResult = document.querySelector('.close-result');
    // this.finalElement.style.visibility = 'visible';
    // const correctAnswersTotal = this.calculateCorrectAnswers();
    // this.final = new Final(correctAnswersTotal, this.totalAmount);
    console.log('Quiz is ended', this.totalAmount, this.totalWrongWords.length  );
    this.quizElement.classList.add('hidden');
    audiocallResult?.classList.remove('hidden');
    closeResult?.addEventListener('click', () => {
      console.log(closeResult);
      audiocallResult?.classList.add('hidden');
    });
  }

  calculateCorrectAnswers() {
    let count = 0;
    this.questions.forEach( el => {
      if (el.isCorrect) {
        count++;
      }
    });
    return count;
  }

}

export default Quiz;
