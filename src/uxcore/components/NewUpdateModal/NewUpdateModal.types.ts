export interface NewUpdateData {
  title: string;
  description: string;
  image?: {
    data?: {
      attributes?: {
        url: string;
      };
    };
  };
  'Social media link'?: string;
  'Close button text'?: string;
  'Frontend modal visibility'?: boolean;
  'Appears after x seconds'?: number;
  updatedAt?: string;
}

export interface NewUpdateModalProps {
  data: NewUpdateData;
  onClose: () => void;
}
