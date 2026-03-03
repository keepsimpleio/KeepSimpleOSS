export type DietResultsProps = {
  id?: number;
  setIsIconClicked?: (isClicked: boolean) => void;
  whatToEatItemNamesAndIds: {
    name: string;
    id: number;
  }[];
  selectedHealthOption: {
    name: string;
    id: number;
  };
  setSelectedHealthyOptionId?: (id: number) => void;
  scaleLevels?: {
    id: number;
    imagePath: string;
  }[];
  dietTxt?: string;
  locale?: string;
};
