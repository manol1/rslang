import { MenuLinks } from './type/types';

function navigation() {
  const startBtn = document.querySelector('.promo-btn') as HTMLButtonElement;
  const promoSection = document.querySelector('.promo');
  const dictionarySection = document.querySelector('.dictionary');
  const mainPage = document.querySelector('.main-page');
  const logoName = document.querySelector('.header__logo_link')!;
  // const dictionaryNavLink = document.querySelector('.header__nav_list-item');//need to make universal for all list-item
  const menuNavLinks = document.querySelectorAll('.header__nav_list-item');
  const dictionaryGameFooter = document.querySelector('.dictionary-footer');
  const footerSection = document.querySelector('.footer');
  const audiocallLink = document.querySelector('.audiocall');

  function highlightOfCurrentPage(page: string) {
    menuNavLinks.forEach(link => link?.classList.remove('current-page'));
    const currentLink = document.querySelector(`.header__nav_list-item[data-link=${page}]`);
    currentLink?.classList.add('current-page');
  }

  const displayDictionary = () => {
    promoSection?.classList.add('hidden');
    mainPage?.classList.add('dictionary-page');
    logoName?.classList.add('dictionary-page');
    audiocallLink?.classList.add('hidden');

    highlightOfCurrentPage(MenuLinks.dictionary);

    dictionarySection?.classList.remove('hidden');
    dictionaryGameFooter?.classList.remove('footer-hidden');
  };

  const displayMainPage = () => {
    dictionarySection?.classList.add('hidden');
    audiocallLink?.classList.add('hidden');
    promoSection?.classList.remove('hidden');
    dictionaryGameFooter?.classList.add('footer-hidden');

    mainPage?.classList.remove('dictionary-page');
    logoName?.classList.remove('dictionary-page');
  };

  const displayAudiocall = () => {
    highlightOfCurrentPage(MenuLinks.games);

    promoSection?.classList.add('hidden');
    mainPage?.classList.add('dictionary-page');
    footerSection?.classList.add('hidden');
    dictionarySection?.classList.add('hidden');
    dictionaryGameFooter?.classList.add('footer-hidden');

    audiocallLink?.classList.remove('hidden');
  };

  const displayStatistics = () => {
    highlightOfCurrentPage(MenuLinks.statistics);
  };

  const displayDevelopers = () => {
    highlightOfCurrentPage(MenuLinks.developers);
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

    if (currentLinkName === MenuLinks.developers) {
      displayDevelopers();
    }
  };

  startBtn.addEventListener('click', displayDictionary);

  logoName.addEventListener('click', displayMainPage);

  menuNavLinks.forEach(navLink => navLink.addEventListener('click', handleMenuNavigation));
}

export default navigation;
