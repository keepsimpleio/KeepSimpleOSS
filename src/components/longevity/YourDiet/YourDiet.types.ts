export type YourDietProps = {
  id: number;
  isIconClicked?: boolean;
  selectedHealthOptionName: string | null;
  scaleLevels: {
    backgroundUrl: string;
    backgroundUrlMobile?: string;
    biologicalAge: string;
    skinAge: string;
    jointAge: string;
    metabolicAge: string;
    id: number;
    imagePath: string;
  }[];
  locale?: string;
};
