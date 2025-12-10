import { FC, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider, { LazyLoadTypes } from 'react-slick';
import cn from 'classnames';

import type { ContributorsSliderProps } from './ContributorsSlider.types';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './ContributorsSlider.module.scss';
import ArrowButton from '@components/contributors/ArrowButton/ArrowButton';

const ContributorsSlider: FC<ContributorsSliderProps> = ({
  contributors,
  isDarkTheme,
  socialLinkTxt,
}) => {
  const slider = useRef(null);

  const nextArrow = isDarkTheme
    ? '/keepsimple_/assets/contributors/arrow-next-dark.png'
    : '/keepsimple_/assets/contributors/arrow-next.png';
  const prevArrow = isDarkTheme
    ? '/keepsimple_/assets/contributors/arrow-prev-dark.png'
    : '/keepsimple_/assets/contributors/arrow-prev.png';

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <ArrowButton
        width={31}
        height={44}
        src={nextArrow}
        alt="Previous"
        className="contributors-next-arrow"
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <ArrowButton
        src={prevArrow}
        width={31}
        height={44}
        alt={'Next'}
        className="contributors-prev-arrow"
        onClick={onClick}
      />
    );
  }
  const settings = {
    cssEase: 'linear',
    accessibility: true,
    lazyLoad: 'ondemand' as LazyLoadTypes,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  return (
    <Slider
      {...settings}
      ref={slider}
      className={cn(styles.slider, {
        [styles.dark]: isDarkTheme,
      })}
    >
      {contributors?.data?.map((contributor, index) => (
        <div className={styles.slide} key={index}>
          {contributor.attributes?.sliderImage?.data?.attributes?.url ? (
            <Image
              src={
                !isDarkTheme
                  ? `${process.env.NEXT_PUBLIC_STRAPI}${contributor.attributes?.sliderImage?.data?.attributes?.url}`
                  : `${process.env.NEXT_PUBLIC_STRAPI}${contributor?.attributes?.sliderImageDark?.data?.attributes?.url}`
              }
              width={1140}
              height={267}
              alt={'Cover image'}
              className={styles.coverImage}
            />
          ) : null}
          <div className={cn(styles.content, {})}>
            <h2 className={styles.name}>{contributor.attributes.name} </h2>
            <div className={styles.imgAndRole}>
              <Image
                src={'/keepsimple_/assets/contributors/specialization.svg'}
                alt={'specialization, role'}
                width={20}
                height={20}
              />
              <span className={styles.role}>{contributor.attributes.role}</span>
            </div>
            {contributor.attributes.socialLink && (
              <div className={styles.imgAndSocial}>
                <Image
                  src={'/keepsimple_/assets/contributors/social-link.svg'}
                  alt={'social link'}
                  width={20}
                  height={20}
                />
                <Link
                  href={contributor.attributes.socialLink}
                  target={'_blank'}
                  className={styles.socialLink}
                >
                  {socialLinkTxt}
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default ContributorsSlider;
