export type DietResultsProps = {
  id?: number;
  setSelectedHealthyOptionId?: (id: number) => void;
  scaleLevels?: {
    id: number;
    imagePath: string;
  }[];
};
