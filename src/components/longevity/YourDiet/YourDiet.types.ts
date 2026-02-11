export type YourDietProps = {
  id: number;
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
};
