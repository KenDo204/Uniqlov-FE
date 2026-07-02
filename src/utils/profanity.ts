import BadWordsNext from 'bad-words-next';
import en from 'bad-words-next/lib/en';

const badwords = new BadWordsNext({ data: en });

export function hasBadWords(text: string): boolean {
  return badwords.check(text);
}
