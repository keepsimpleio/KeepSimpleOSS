export type ContributorsSliderProps = {
  image?: string;
  name?: string;
  role?: string;
  socialLink?: string;
  contributors?: {
    data: Array<{
      attributes: {
        name: string;
        role: string;
        socialLink?: string;
        sliderImage?: {
          data: {
            attributes: {
              url: string;
            };
          };
        };
        sliderImageDark?: {
          data: {
            attributes: {
              url: string;
            };
          };
        };
      };
    }>;
  };
  isDarkTheme: boolean;
  socialLinkTxt?: string;
};
