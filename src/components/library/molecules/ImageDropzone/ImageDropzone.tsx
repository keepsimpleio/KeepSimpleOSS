'use client';

import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useDropzone, type FileRejection } from 'react-dropzone';

import { Text, TypographyVariant } from '@/components/atoms/Text';

import { CloseIcon, PlusIcon } from '@/assets/svg';

import type { ImageDropzoneProps } from './ImageDropzone.types';

import styles from './ImageDropzone.module.scss';

const DEFAULT_ACCEPT = ['image/jpeg', 'image/png'];
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function ImageDropzone(props: ImageDropzoneProps): JSX.Element {
  const {
    value,
    onChange,
    existingPreviewUrl,
    onClearExisting,
    accept = DEFAULT_ACCEPT,
    maxSize = DEFAULT_MAX_SIZE,
    disabled,
    className,
    ariaLabel = 'Upload image',
  } = props;

  const [error, setError] = useState<string | null>(null);
  const [fileObjectUrl, setFileObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setFileObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setFileObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const acceptMap = useMemo(() => {
    return accept.reduce<Record<string, string[]>>((acc, mime) => {
      acc[mime] = [];
      return acc;
    }, {});
  }, [accept]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        let message = 'This file could not be added.';
        switch (firstError?.code) {
          case 'file-too-large':
            message = `Image is too large. Maximum size is ${formatBytes(maxSize)}.`;
            break;
          case 'file-invalid-type':
            message = 'Image must be a JPEG or PNG file.';
            break;
          case 'too-many-files':
            message = 'Please drop only one image.';
            break;
        }
        setError(message);
        return;
      }
      const file = acceptedFiles[0];
      if (file) {
        setError(null);
        onChange?.(file);
      }
    },
    [onChange, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptMap,
    maxSize,
    multiple: false,
    disabled,
  });

  const showExisting = !value && !!existingPreviewUrl;
  const showFile = !!value && !!fileObjectUrl;
  const showPreview = showFile || showExisting;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    if (showFile) {
      onChange?.(null);
      return;
    }
    if (showExisting) {
      onClearExisting?.();
    }
  };

  return (
    <div className={classNames(className, styles.wrapper)}>
      <div
        {...getRootProps({
          className: classNames(styles.dropzone, {
            [styles.dragging]: isDragActive,
            [styles.hasFile]: showPreview,
            [styles.disabled]: disabled,
          }),
        })}
        role="button"
        aria-label={ariaLabel}
      >
        <input {...getInputProps()} />
        {showPreview ? (
          <div className={styles.preview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={showFile ? (fileObjectUrl as string) : (existingPreviewUrl as string)}
              alt={value?.name ?? 'Cover preview'}
              className={styles.previewImage}
            />
            <div className={styles.previewMeta}>
              <Text variant={TypographyVariant.TextSmall} className={styles.fileName}>
                {value?.name ?? 'Current cover'}
              </Text>
              {value && (
                <Text variant={TypographyVariant.TextTiny} className={styles.fileSize}>
                  {formatBytes(value.size)}
                </Text>
              )}
              {showExisting && (
                <Text variant={TypographyVariant.TextTiny} className={styles.fileSize}>
                  Drop a new image to replace
                </Text>
              )}
            </div>
            <button
              type="button"
              className={styles.removeButton}
              onClick={handleRemove}
              aria-label="Remove image"
              disabled={disabled}
            >
              <CloseIcon width={16} height={16} />
            </button>
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.plus}>
              <PlusIcon width={20} height={20} />
            </div>
            <Text variant={TypographyVariant.TextBase} className={styles.title}>
              {isDragActive ? 'Drop the image here' : 'Click or drag image to upload'}
            </Text>
            <Text variant={TypographyVariant.TextSmall} className={styles.hint}>
              PNG or JPEG, up to {formatBytes(maxSize)}
            </Text>
          </div>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
