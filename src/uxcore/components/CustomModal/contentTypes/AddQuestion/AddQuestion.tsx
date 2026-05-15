import { addQuestionRequest } from '@uxcore/api/addQuestion';
import Button from '@uxcore/components/Button';
import Input from '@uxcore/components/Input';
import Tag from '@uxcore/components/Tag';
import Textarea from '@uxcore/components/Textarea';
import addQuestionData from '@uxcore/data/addQuestion';
import useFormPopup from '@uxcore/hooks/useFormPopup';
import useSpinner from '@uxcore/hooks/useSpinner';
import { validateEmail } from '@uxcore/lib/helpers';
import type { TagType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';

import styles from './AddQuestion.module.scss';

type TAddQuestion = {
  closeModal?: () => void;
  tags: TagType[];
};

const AddQuestion: FC<TAddQuestion> = ({ closeModal, tags }) => {
  const { setIsVisible } = useSpinner()[0];
  const { togglePopupVisibiity } = useFormPopup()[0];
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isValid, setIsValid] = useState({
    question: true,
    email: true,
  });

  const router = useRouter();
  const { locale } = router as TRouter;

  const handleChange = useCallback(
    (v: string, type: 'question' | 'email' | 'name') => {
      switch (type) {
        case 'question':
          setQuestion(v);
          break;
        case 'email':
          setEmail(v);
          break;
        case 'name':
          setName(v);
          break;
        default:
          break;
      }
    },
    [],
  );

  const handleValidation = useCallback(
    (value: boolean, type: 'question' | 'email') => {
      setIsValid({
        ...isValid,
        [type]: value,
      });
    },
    [isValid],
  );

  const handleTagsClick = useCallback(
    (tagId: any) => {
      const newSelectedtags = [...selectedTags];
      const indexOfTag = newSelectedtags.indexOf(tagId);

      if (indexOfTag === -1) {
        newSelectedtags.push(tagId);
      } else {
        newSelectedtags.splice(indexOfTag, 1);
      }
      setSelectedTags(newSelectedtags);
    },
    [selectedTags],
  );

  const handleSubmit = useCallback(async () => {
    setIsVisible(true);
    try {
      await addQuestionRequest(selectedTags, question, name, email);
    } catch (err) {
      console.log('error');
    }
    togglePopupVisibiity();
    setIsVisible(false);
    closeModal();
  }, [
    question,
    name,
    email,
    selectedTags,
    setIsVisible,
    closeModal,
    addQuestionRequest,
  ]);

  const {
    info1,
    info2,
    info3,
    questionLabel,
    questionError,
    tagsLabel,
    nameLabel,
    namePlaceholder,
    nameHint,
    emailLabel,
    emailPlaceholder,
    emailError,
    cancelButtonLabel,
    submitButtonLabel,
  } = addQuestionData[locale];

  const isSubmitDisabled =
    Object.values(isValid).includes(false) || !question || !email;

  return (
    <div className={styles.AddQuestion}>
      <div className={styles.Content}>
        <span>{info1}</span>
        <br />
        <span>{info2}</span>
        <br />
        <span>{info3}</span>
      </div>
      <Textarea
        label={`${questionLabel}*`}
        showError={!isValid.question}
        errorMessage={questionError}
        validationFunction={v => !!v}
        isValidCallback={v => handleValidation(v, 'question')}
        onChange={v => handleChange(v, 'question')}
      />
      <div className={styles.Label}>{tagsLabel}</div>
      <div className={styles.TagsContainer}>
        {tags.map((tagData, index) => (
          <Tag
            {...tagData}
            type="button"
            key={index}
            isActive={selectedTags.includes(tagData.id)}
            onClick={() => handleTagsClick(tagData.id)}
            className={styles.Tag}
            tooltip={null}
          />
        ))}
      </div>
      <Input
        label={nameLabel}
        labelHint={nameHint}
        placeholder={namePlaceholder}
        onChange={v => handleChange(v, 'name')}
      />
      <Input
        label={`${emailLabel}*`}
        placeholder={emailPlaceholder}
        showMessage={!isValid.email}
        errorMessage={emailError}
        validationFunction={validateEmail}
        isValidCallback={v => handleValidation(v, 'email')}
        onChange={v => handleChange(v, 'email')}
      />
      <div className={styles.Footer}>
        <div className={styles.Buttons}>
          <Button label={cancelButtonLabel} onClick={closeModal} />
          <Button
            label={submitButtonLabel}
            type="primary"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
