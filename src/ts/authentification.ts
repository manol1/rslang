import { createUser, signIn, putUserStatistics } from './requests';
import { store } from './store/store';
import { renderDictionary } from './renderDictionary';

function authentification() {
  const logIn = <HTMLLIElement>document.getElementById('log-in');
  const signInSection = <HTMLElement>document.getElementById('signIn-section');
  const registrationSection = <HTMLElement>document.querySelector('#registration-section');
  const closeSignInForm = <HTMLSpanElement>document.querySelector('#signIn-section span');
  const closeRegForm = <HTMLSpanElement>document.querySelector('#registration-section span');
  const registrationLink = <HTMLParagraphElement>document.getElementById('registration-link');
  const signInForm = <HTMLFormElement>document.querySelector('.form-signIn');
  const registrationForm = <HTMLFormElement>document.querySelector('.form-reg');
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-levels button:last-child');
  const oldStatisticsEl = document.querySelector('#old-statistics') as HTMLElement;
  const todayWords = <HTMLSpanElement>document.getElementById('today-words');
  const todayAccuracy = <HTMLDivElement>document.getElementById('today-accuracy');
  const todayAudiocallWords = <HTMLParagraphElement>document.getElementById('today-audiocall-words');
  const todayAudiocallAccuracy = <HTMLParagraphElement>document.getElementById('today-audiocall-accuracy');
  const todayAudiocallInARow = <HTMLParagraphElement>document.getElementById('today-audiocall-in-a-row');
  const todaySprintWords = <HTMLParagraphElement>document.getElementById('today-sprint-words');
  const todaySprintAccuracy = <HTMLParagraphElement>document.getElementById('today-sprint-accuracy');
  const todaySprintInARow = <HTMLParagraphElement>document.getElementById('today-sprint-in-a-row');

  function goLogIn() {
    signInSection.classList.remove('hidden');
  }

  function setDefaultValue() {
    todayWords.innerHTML = '0';
    todayAccuracy.innerHTML = '0';
    todayAudiocallWords.innerHTML = '0';
    todayAudiocallAccuracy.innerHTML = '0';
    todayAudiocallInARow.innerHTML = '0';
    todaySprintWords.innerHTML = '0';
    todaySprintAccuracy.innerHTML = '0';
    todaySprintInARow.innerHTML = '0';

  }

  function goLogOut() {
    logIn.classList.remove('signIn-logo');
    hardWordsBtn.classList.add('hidden');
    store.isAuthorized = false;
    renderDictionary();
    oldStatisticsEl.classList.add('hidden');
    oldStatisticsEl.innerHTML = '';
    setDefaultValue();
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    logIn.removeEventListener('click', goLogOut);
    logIn.addEventListener('click', goLogIn);
  }

  logIn.addEventListener('click', goLogIn);

  function goCloseSignInForm() {
    signInSection.classList.add('hidden');
    signInForm.reset();
  }
  function goCloseRegForm() {
    registrationSection.classList.add('hidden');
    signInForm.reset();
    registrationForm.reset();
  }

  registrationLink.addEventListener('click', () => {
    signInSection.classList.add('hidden');
    registrationSection.classList.remove('hidden');
  });

  closeSignInForm.addEventListener('click', goCloseSignInForm);
  closeRegForm.addEventListener('click', goCloseRegForm);

  function afterSubmitForm() {
    logIn.removeEventListener('click', goLogIn);
    logIn.addEventListener('click', goLogOut);
    logIn.classList.add('signIn-logo');
    hardWordsBtn.classList.remove('hidden');
    store.isAuthorized = true;
  }

  window.addEventListener('load', () => {
    if (localStorage.getItem('token')) {
      afterSubmitForm();
    }
  });

  const regNameInput = <HTMLInputElement>document.getElementById('reg-name');
  const regEmailInput = <HTMLInputElement>document.getElementById('reg-email');
  const regPasswordInput = <HTMLInputElement>document.getElementById('reg-password');

  async function registrationFn() {
    try {
      const password = regPasswordInput.value;
      const newUser = await createUser({ name: regNameInput.value, email: regEmailInput.value, password: password });
      const newSignIn = await signIn({ email: newUser.email, password: password });
      afterSubmitForm();
      renderDictionary();
      localStorage.setItem('userId', newSignIn.userId);
      localStorage.setItem('token', newSignIn.token);
      localStorage.setItem('refreshToken', newSignIn.refreshToken);
      goCloseRegForm();
      putUserStatistics(localStorage.getItem('userId') || '', store.statisticsNew, localStorage.getItem('token') || '');
      localStorage.removeItem('allStatistics');
    } catch (err) {
      console.log(err);
    }
  }

  registrationForm.addEventListener('submit', registrationFn);

  const signInEmailInput = <HTMLInputElement>document.getElementById('signIn-email');
  const signInPasswordInput = <HTMLInputElement>document.getElementById('signIn-password');

  async function signInFn() {
    try {
      const newSignIn = await signIn({ email: signInEmailInput.value, password: signInPasswordInput.value });
      afterSubmitForm();
      renderDictionary();
      localStorage.setItem('userId', newSignIn.userId);
      localStorage.setItem('token', newSignIn.token);
      localStorage.setItem('refreshToken', newSignIn.refreshToken);
      goCloseSignInForm();
    } catch (err) {
      console.log(err);
    }
  }

  signInForm.addEventListener('submit', signInFn);
}

export default authentification;
