export interface SEOProps {
  title: string;
  description: string;
  url: string;
  image: string;
  type:
    | 'website'
    | 'article'
    | 'profile'
    | 'book'
    | 'music.song'
    | 'music.album'
    | 'video.movie'
    | 'video.episode';
  favicon?: string;
  ogTags?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
  };
  twitterTags?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
  canonical: string;
  noIndex?: boolean;
  noFollow?: boolean;
}
