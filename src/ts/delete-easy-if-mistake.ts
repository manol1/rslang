import { getAggregatedWordById, updateUserWord } from './requests';
import { WordDifficulty } from './type/types';

export async function isEasyWordInGameFn(id: string) {
  const wordInfo = await getAggregatedWordById(localStorage.getItem('userId') || '', id, localStorage.getItem('token') || '');

  if (wordInfo[0].userWord?.difficulty === 'easy') {
    updateUserWord(localStorage.getItem('userId') || '', id, { difficulty: WordDifficulty.empty, optional: wordInfo[0].userWord.optional }, localStorage.getItem('token') || '');
  }
}
