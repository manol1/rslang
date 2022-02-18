import { createUser, signIn } from './requests';
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

  function goLogIn() {
    signInSection.classList.remove('hidden');
  }

  function goLogOut() {
    logIn.classList.remove('signIn-logo');
    hardWordsBtn.classList.add('hidden');
    store.isAuthorized = false;
    renderDictionary();
    localStorage.clear();
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

  const regNameInput = <HTMLInputElement>document.getElementById('reg-name');
  const regEmailInput = <HTMLInputElement>document.getElementById('reg-email');
  const regPasswordInput = <HTMLInputElement>document.getElementById('reg-password');

  registrationForm.addEventListener('submit', async () => {
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
    } catch (err) {
      console.log(err);
    }
  });

  const signInEmailInput = <HTMLInputElement>document.getElementById('signIn-email');
  const signInPasswordInput = <HTMLInputElement>document.getElementById('signIn-password');

  signInForm.addEventListener('submit', async () => {
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
  });
}

export default authentification;
