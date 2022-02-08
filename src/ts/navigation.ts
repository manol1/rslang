
function navigation() {
  const startBtn = document.querySelector('.promo-btn') as HTMLButtonElement;
  const promoSection = document.querySelector('.promo');
  const dictionarySection = document.querySelector('.dictionary');
  const mainPage = document.querySelector('.main-page');
  const logoName = document.querySelector('.header__logo_link');
  const dictionaryNavLink = document.querySelector('.header__nav_list-item');//need to make universal for all list-item

  startBtn.addEventListener('click', () => {

    promoSection?.classList.add('hidden');
    mainPage?.classList.add('dictionary-page');
    logoName?.classList.add('dictionary-page');

    dictionaryNavLink?.classList.add('current-page');

    dictionarySection?.classList.remove('hidden');
  });
}

export default navigation;


