import en from './en';
import ru from './ru';

export type UXCGQuestion = {
  title: string;
  pageTitle: string;
  description: string;
  keywords: string;
};

export type UXCGQuestions = {
  [key: string]: UXCGQuestion;
};
export default { en, ru } as { en: UXCGQuestions; ru: UXCGQuestions };
