import { StaticImageData } from 'next/image';

export interface AvatarProps {
  className?: string;
  url?: string | StaticImageData;
}
