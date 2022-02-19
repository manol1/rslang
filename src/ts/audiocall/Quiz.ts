import { TGetWords, TAggregatedWord } from '../type/types';
import { playSound, pagination } from './utils';
import Question from './Question';
import Result from './Result';

class Quiz {

  currentAnswer: string | null;

  answeredAmount: number;

  audiocallAnswerBtns:  NodeListOf<HTMLElement>;

  questions: Question[];

  totalAmount: number;

  totalWrongWords: Question[];

  totalCorrectWords: Question[];

  volume: boolean;

  quizElement = document.querySelector('.audiocall-question') as HTMLElement;

  quizChangableEl = document.querySelector('.audiocall-question__changable') as HTMLElement;

  nextBtn = document.querySelector('.audiocall-question__next-btn') as HTMLButtonElement;

  exitGame = document.querySelector('.audiocall-question__settings_exit') as HTMLElement;

  exitOnNavAudioLinks = document.querySelector('.game-menu_audiocall') as HTMLElement;

  constructor( questions:TGetWords[] | TAggregatedWord[] ) {
    this.totalAmount = questions.length;
    this.answeredAmount = 0;
    this.questions = this.setQuestions(questions);
    this.totalWrongWords = [];
    this.totalCorrectWords = [];
    this.currentAnswer = '';
    this.volume = true;
    this.audiocallAnswerBtns = document.querySelectorAll('.answer-item');
    this.nextBtn.addEventListener('click',
      this.nextQuestion.bind(this));

    this.renderQuestion();
    pagination(this.totalAmount);

    this.exitGame.addEventListener('click', this.closeQuiz.bind(this));
    this.exitOnNavAudioLinks.addEventListener('click', this.closeQuiz.bind(this));
  }

  closeQuiz() {
    const paginationContainer = document.querySelector('.audiocall-question__pagination') as HTMLElement;
    this.answeredAmount = 0;
    this.currentAnswer = '';
    this.questions = [];
    this.quizChangableEl.innerHTML = '';
    this.quizElement.classList.add('hidden');
    paginationContainer.innerHTML = '';
    this.navigateBackToDictionary();
  }

  navigateBackToDictionary() {
    const dictionarySection = document.querySelector('.dictionary');
    const footerSection = document.querySelector('.footer');
    const dictionaryGameFooter = document.querySelector('.dictionary-footer');
    const audiocallSection = document.querySelector('.audiocall');

    dictionarySection?.classList.remove('hidden');
    footerSection?.classList.remove('hidden');
    dictionaryGameFooter?.classList.remove('footer-hidden');
    audiocallSection?.classList.add('hidden');
  }

  getAnswerWord = (e: Event) => {
    this.currentAnswer = (e.target as HTMLButtonElement).textContent;
    if (this.currentAnswer) {
      this.showResult();
      this.answeredAmount++;
    }
  };

  styleAnswer = () => {
    const allAnswers = document.querySelectorAll('.answer-item');
    const answerInfo = document.querySelector('.audiocall-question__info');
    const paginationDots = document.querySelectorAll('.dot');

    (paginationDots[this.answeredAmount] as HTMLElement).classList.add('active');

    allAnswers.forEach(item => {
      const correctResult = this.questions[this.answeredAmount].correctAnswer === item.textContent;

      if (item.textContent === this.currentAnswer && correctResult) {
        item.classList.add('correct');
      } else if (item.textContent === this.currentAnswer && !correctResult) {
        item.classList.add('wrong');
      } else if (item.textContent === this.questions[this.answeredAmount].correctAnswer) {
        item.classList.add('correct');
      } else {
        item.classList.add('disable');
        item.setAttribute('disabled', 'true');
      }
    });

    answerInfo?.classList.remove('hidden');
  };

  bindListener() {
    this.audiocallAnswerBtns = document.querySelectorAll('.answer-item');
    this.audiocallAnswerBtns.forEach(answerBtn =>
      answerBtn.addEventListener('click', this.getAnswerWord),
    );

    const volumeBtn = document.querySelector('.audiocall-question__settings_volume') as HTMLElement;
    volumeBtn.addEventListener('click', () => {
      this.volume = !this.volume;
      volumeBtn.classList.toggle('mute');
    });
  }

  setQuestions = (questions: TGetWords[] | TAggregatedWord[]) => {
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
      this.currentAnswer = '';
      this.renderQuestion();
    } else {
      if (this.volume) {
        const audio = new Audio();
        audio.src = './assets/sounds/roundEnd.mp3';
        audio.play();
        this.endQuiz();
      }
    }
  }

  showResult = () => {
    if (this.currentAnswer) {
      const isCorrectAnswer =  this.questions[this.answeredAmount].answer(this.currentAnswer);
      if (isCorrectAnswer) {
        this.totalCorrectWords.push(this.questions[this.answeredAmount]);
        this.styleAnswer();
        if (this.volume) {
          playSound(true);
        }

      } else {
        this.totalWrongWords.push(this.questions[this.answeredAmount]);
        this.styleAnswer();
        if (this.volume) {
          playSound(false);
        }
      }
    }
  };

  endQuiz() {
    const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;
    const resultTable = new Result(this.totalWrongWords, this.totalCorrectWords);
    resultTable.mount(audiocallResult);
    resultTable.bindListener();

    this.answeredAmount = 0;
    this.currentAnswer = '';
    this.questions = [];
    this.quizChangableEl.innerHTML = '';
    this.volume = false;
    this.quizElement.classList.add('hidden');
    audiocallResult?.classList.remove('hidden');
  }

}

export default Quiz;
