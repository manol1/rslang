const burgerEl = document.querySelector('.burger') as HTMLElement;
const nuvigationEl = document.querySelector('.header__nav') as HTMLElement;
const bodyEl = document.querySelector('body') as HTMLBodyElement;
const menuLinks = document.querySelectorAll('.header__nav_list-item');
const gameLinks = document.querySelectorAll('.game-nav li');
const logoLink = document.querySelector('.header__logo_img') as HTMLElement;

export default function handleBurger() {
  burgerEl.addEventListener('click', () => {
    burgerEl.classList.toggle('active');
    bodyEl.classList.toggle('lock');
    nuvigationEl.classList.toggle('active');
  });

  menuLinks.forEach(link => link.addEventListener('click', () => {
    if (nuvigationEl.classList.contains('active') && !link.classList.contains('game-nav') ) {
      nuvigationEl.classList.remove('active');
      bodyEl.classList.remove('lock');
      burgerEl.classList.remove('active');
    }
  }) );

  function hideBurgerMenu() {
    if (nuvigationEl.classList.contains('active')) {
      nuvigationEl.classList.remove('active');
      bodyEl.classList.remove('lock');
      burgerEl.classList.remove('active');
    }
  }


  gameLinks.forEach(link => link.addEventListener('click', hideBurgerMenu));
  logoLink.addEventListener('click', hideBurgerMenu);
}

