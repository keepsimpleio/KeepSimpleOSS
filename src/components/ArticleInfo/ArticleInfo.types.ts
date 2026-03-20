export type ArticleInfoProps = {
  title: string;
  description: string;
  bgImage: string;
  slug?: string;
  locale?: string;
  darkTheme: boolean;
  tags?: {
    title: string;
    id: number;
  }[];
};
