import { store } from './store/store';
import { MenuLinks, GameNames } from './type/types';
import { renderDictionary } from './renderDictionary';

function navigation() {
  const startBtn = document.querySelector('.promo-btn') as HTMLButtonElement;
  const promoSection = document.querySelector('.promo');
  const dictionarySection = document.querySelector('.dictionary');
  const mainPage = document.querySelector('.main-page');
  const logoName = <HTMLDivElement>document.querySelector('.header__logo_link');
  const menuNavLinks = document.querySelectorAll('.header__nav_list-item');
  const dictionaryGameFooter = document.querySelector('.dictionary-footer');
  const footerSection = document.querySelector('.footer');
  const statisticSection = document.querySelector('.statistics');
  const developerSection = document.querySelector('.developers');
  const dictionaryGameBtns = document.querySelectorAll('.game');

  const audiocallLink = document.querySelector('.audiocall');
  const sprintLink = document.querySelector('.sprint');



  function highlightOfCurrentPage(page: string) {
    if ( page === '') {
      menuNavLinks.forEach(link => link?.classList.remove('current-page'));
    } else {
      menuNavLinks.forEach(link => link?.classList.remove('current-page'));
      const currentLink = document.querySelector(`.header__nav_list-item[data-link=${page}]`);
      currentLink?.classList.add('current-page');
    }
  }

  function hideAllSections() {
    promoSection?.classList.add('hidden');
    statisticSection?.classList.add('hidden');
    developerSection?.classList.add('hidden');
    mainPage?.classList.add('dictionary-page');
    logoName?.classList.add('dictionary-page');
    audiocallLink?.classList.add('hidden');
    sprintLink?.classList.add('hidden');
    dictionarySection?.classList.add('hidden');
    dictionaryGameFooter?.classList.add('footer-hidden');
    footerSection?.classList.add('hidden');
  }

  const displayDictionary = () => {
    hideAllSections();
    highlightOfCurrentPage(MenuLinks.dictionary);

    const levelBtns = document.querySelectorAll('.words-level');
    levelBtns.forEach(el => el.classList.remove('active'));
    const firstLevel = <HTMLButtonElement>document.querySelector('.words-level:first-child');
    firstLevel.classList.add('active');

    store.currentLevel = '0';
    store.currentPage = '0';

    dictionarySection?.classList.remove('hidden');
    footerSection?.classList.remove('hidden');
    dictionaryGameFooter?.classList.remove('footer-hidden');
    renderDictionary();
  };

  const displayMainPage = () => {
    hideAllSections();
    highlightOfCurrentPage('');

    mainPage?.classList.remove('dictionary-page');
    logoName?.classList.remove('dictionary-page');
    promoSection?.classList.remove('hidden');
    footerSection?.classList.remove('hidden');
  };

  const displayAudiocall = () => {
    hideAllSections();
    highlightOfCurrentPage(MenuLinks.games);

    audiocallLink?.classList.remove('hidden');
  };

  const displaySprint = () => {
    hideAllSections();
    highlightOfCurrentPage(MenuLinks.games);

    sprintLink?.classList.remove('hidden');

  };

  const displayStatistics = () => {
    hideAllSections();
    highlightOfCurrentPage(MenuLinks.statistics);

    footerSection?.classList.remove('hidden');
    statisticSection?.classList.remove('hidden');
  };

  const displayDevelopers = () => {
    hideAllSections();
    highlightOfCurrentPage(MenuLinks.developers);

    footerSection?.classList.remove('hidden');
    developerSection?.classList.remove('hidden');
  };

  const handleMenuNavigation = (event: Event) => {
    const currentLinkName = (event.target as HTMLElement).dataset.link;
    if (currentLinkName === MenuLinks.dictionary) {
      displayDictionary();
    }

    if (currentLinkName === MenuLinks.audiocall) {
      displayAudiocall();
    }

    if (currentLinkName === MenuLinks.statistics) {
      displayStatistics();
    }

    if (currentLinkName === MenuLinks.sprint) {
      displaySprint();
    }

    if (currentLinkName === MenuLinks.developers) {
      displayDevelopers();
    }
  };

  const handleGameNavInDictionary = (event: Event) => {
    const currentGameLink = (event.target as HTMLElement).dataset.game;
    if (currentGameLink === GameNames.audiocall) {
      displayAudiocall();
    }

    if (currentGameLink === GameNames.sprint) {
      displaySprint();
    }
  };

  startBtn.addEventListener('click', displayDictionary);
  logoName?.addEventListener('click', displayMainPage);
  menuNavLinks.forEach(navLink => navLink.addEventListener('click', handleMenuNavigation));
  dictionaryGameBtns.forEach(gameLink => gameLink.addEventListener('click', handleGameNavInDictionary));

  // удалить потом :
  // displaySprint();
}

export default navigation;
