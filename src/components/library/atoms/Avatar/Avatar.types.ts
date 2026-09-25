import { StaticImageData } from 'next/image';

export interface AvatarProps {
  className?: string;
  url?: string | StaticImageData;
  /**
   * Rendered box width per breakpoint, as a plain `sizes` string. It must be
   * larger than the CSS box: the image is cropped with `object-fit: cover`, so
   * a non-square source only contributes its short side and the browser, which
   * sizes its pick from this value alone, has no way to know that. Defaults to
   * the 100/208px boxes of the home-grid card with headroom for a 16:9 source.
   */
  sizes?: string;
}
