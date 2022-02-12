import { store } from './store/store';

function navigation() {
  const startBtn = document.querySelector('.promo-btn') as HTMLButtonElement;
  const promoSection = document.querySelector('.promo');
  const dictionarySection = document.querySelector('.dictionary');
  const mainPage = document.querySelector('.main-page');
  const logoName = <HTMLDivElement>document.querySelector('.header__logo_link');
  const dictionaryNavLink = document.querySelector('.header__nav_list-item');//need to make universal for all list-item
  const dictionaryGame = document.querySelector('.dictionary-footer');

  startBtn.addEventListener('click', () => {

    promoSection?.classList.add('hidden');
    mainPage?.classList.add('dictionary-page');
    logoName?.classList.add('dictionary-page');

    dictionaryNavLink?.classList.add('current-page');

    dictionarySection?.classList.remove('hidden');
    dictionaryGame?.classList.remove('hidden');

    const levelBtns = document.querySelectorAll('.words-level');
    levelBtns.forEach(el => el.classList.remove('active'));
    const firstLevel = <HTMLButtonElement>document.querySelector('.words-level:first-child');
    firstLevel.classList.add('active');

    store.currentLevel = '0';
    store.currentPage = '0';
  });

  logoName.addEventListener('click', () => {

    dictionarySection?.classList.add('hidden');
    promoSection?.classList.remove('hidden');
    dictionaryGame?.classList.add('hidden');

    mainPage?.classList.remove('dictionary-page');
    logoName?.classList.remove('dictionary-page');
  });
}

export default navigation;
