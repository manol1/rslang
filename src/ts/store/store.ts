export const store = {
  currentPage: '0',
  currentLevel: '0',
  isAuthorized: false,
  audiocallCurrentLevel: '0',
  isComplicatedWordPage: false,
  optional: {
    games: {
      sprint: {
        right: 0,
        wrong: 0,
      },
      audiocall: {
        right: 0,
        wrong: 0,
      },
    },
  },
  statisticsNew: {
    learnedWords: 0,
    optional: {
      date: ' ',
      games: {
        audiocall: {
          bestSeries: 0,
          right: 0,
          newWords: 0,
        },
        sprint: {
          bestSeries: 0,
          right: 0,
          newWords: 0,
        },
      },
    },
  },
};
