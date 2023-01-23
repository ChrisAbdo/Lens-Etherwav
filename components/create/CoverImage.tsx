import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import styles from './create.module.css';

type Props = {
  coverImage: File | null;
  setCoverImage: (coverImage: File | null) => void;
};

/**
 * Allow users to upload a cover image for their post
 */
export default function CoverImage({ coverImage, setCoverImage }: Props) {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (coverImage) {
      setCoverImageUrl(URL.createObjectURL(coverImage));
    } else {
      setCoverImageUrl(null);
    }
  }, [coverImage]);

  if (!coverImage) {
    return (
      <>
        {/* <div
          className={styles.dragAndDropZone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              setCoverImage(file);
            }
          }}
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          <h1>Drag and drop your cover image here</h1>
        </div> */}

        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCoverImage(file);
            }
          }}
        />

        {/* Hidden input field */}
        {/* <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCoverImage(file);
            }
          }}
          style={{ display: 'none' }}
        /> */}
      </>
    );
  }

  //   Show the image with a remove button
  return (
    <div className="flex flex-col justify-center items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image
        src={coverImageUrl || ''}
        alt="Cover image"
        width={500}
        height={500}
      />
      <button
        className="btn btn-outline mt-4"
        onClick={() => setCoverImage(null)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        &nbsp;Remove cover image
      </button>
    </div>
  );
}
