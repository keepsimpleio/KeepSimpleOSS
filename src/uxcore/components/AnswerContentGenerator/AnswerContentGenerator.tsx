import AnswerBiasLink from '@uxcore/components/AnswerBiasLink';
import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import { FC, Fragment } from 'react';

interface AnswerContentGeneratorProps {
  text: string;
  linkClassName: string;
  biases: StrapiBiasType[];
  containerClassName: string;
}

const AnswerContentGenerator: FC<AnswerContentGeneratorProps> = ({
  text,
  linkClassName,
  biases,
  containerClassName,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  let copyOfString = text;
  const regEx = /\{\{[0-9]{1,3}\}\}/g;
  const matches = copyOfString.match(regEx);
  let res: any = [copyOfString];

  if (matches) {
    res = [];

    matches.forEach((match, index) => {
      const indexOfMatch = copyOfString.indexOf(match);
      const parsedMatch = match.slice(2, -2);

      // removing text
      if (indexOfMatch !== 0) {
        const cuttedString = copyOfString.substring(0, indexOfMatch);
        copyOfString = copyOfString.substring(indexOfMatch);
        res.push(cuttedString);
      }

      // remove bias placeholder
      copyOfString = copyOfString.substring(parsedMatch.length + 4);
      // adding bias link
      const bias = biases?.find(
        bias => bias.attributes.number === Number(parsedMatch),
      );

      if (bias) {
        res.push(
          <AnswerBiasLink
            key={bias.attributes.number}
            linkClassName={linkClassName}
            locale={locale}
            biasData={bias.attributes}
            containerClassName={containerClassName}
          />,
        );
      }

      // adding rest of the text
      if (index === matches.length - 1 && copyOfString) {
        res.push(copyOfString);
      }
    });
  }

  return (
    <>
      {res.map((chank: any, index: number) => (
        <Fragment key={index}>{chank}</Fragment>
      ))}
    </>
  );
};

export default AnswerContentGenerator;
