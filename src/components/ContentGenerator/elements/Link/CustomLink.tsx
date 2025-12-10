import type { FC } from 'react';
import Link from '@components/NextLink';
import { useRouter } from 'next/router';

interface CustomLinkDataType {
  href: string;
  target?: '_blank';
  title: string;
  shallow?: boolean;
  src?: string;
  download?: boolean;
}

type CustomLinkProps = {
  styles: any;
  data: CustomLinkDataType;
};

const CustomLink: FC<CustomLinkProps> = ({ styles, data }) => {
  const { href, target, title, src, shallow, download } = data;
  const { locale } = useRouter();

  return (
    <Link
      href={href || ''}
      shallow={shallow}
      locale={download ? 'en' : locale}
      legacyBehavior
    >
      {src ? (
        <a className={styles.imageLink} href={href} target={target}>
          <img src={src} alt="" />
        </a>
      ) : (
        <a className={styles.a} target={target} download={!!download}>
          {title}
        </a>
      )}
    </Link>
  );
};

export default CustomLink;
