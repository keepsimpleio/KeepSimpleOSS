export type ContributorsLayoutProps = {
  isDarkTheme?: boolean;
  contributorsData?: {
    title: string;
    description: string;
    contributors?: {
      data: Array<{
        attributes: {
          name: string;
          role: string;
          socialLink?: string;
          japaneseLetter: string;
          isActive?: boolean;
        };
      }>;
    };
  };
};
