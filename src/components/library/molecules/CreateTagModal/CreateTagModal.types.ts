import { ITag, ITagAttributes } from '@local-types/library/tag';

export interface CreateTagFormData {
  name: string;
  color: string;
  description?: string;
}
export interface CreateTagModalProps {
  isEdit?: boolean;
  activeTag?: ITagAttributes;
  tags?: ITag[];
  onClose: () => void;
  onSubmit?: (data: CreateTagFormData) => void;
  onDelete?: () => void;
  onTagSelect?: (tag: ITagAttributes | null) => void;
}
