function navigateWordStatistics() {
  const wordStatisticsInGames = <HTMLDivElement>document.querySelector('.word-statistics-in-games');
  const closeWordStatisticsBtn = <HTMLSpanElement>document.querySelector('.word-statistics-container span');

  closeWordStatisticsBtn.addEventListener('click', () => {
    wordStatisticsInGames.classList.add('hidden');
  });

}

export default navigateWordStatistics;
