import React, { useRef, useState } from 'react';
import guideText from '../../const/guideText';
import CoverImage from './CoverImage';
import CreateHeader from './CreateHeader';
import EditorToolbar from './EditorToolbar';
import MarkdownEditor from './MarkdownEditor';

type Props = {};

export type EditorTab = 'write' | 'preview' | 'guide';

export default function CreateContainer({}: Props) {
  // State to keep track of which tab is active
  const [activeTab, setActiveTab] = useState<EditorTab>('write');

  // Reference to the editor input element
  const mdInputRef = useRef<HTMLTextAreaElement>(null);

  // Store the contents of the editor as the user types
  const [mdInput, setMdInput] = useState<string>('');

  // State to keep track of the cover image
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // State to keep track of the title
  const [title, setTitle] = useState<string>('');

  // Configurable metadata state
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  return (
    <>
      <CreateHeader
        postMetadata={{
          ...metadata,
          title,
          coverImage,
          content: mdInput,
        }}
        setPostMetadata={setMetadata}
      />
      <CoverImage coverImage={coverImage} setCoverImage={setCoverImage} />

      <EditorToolbar
        mdInputRef={mdInputRef}
        setMdValue={setMdInput}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Preview Tab */}

      {/* Guide tab */}

      {/* Write tab */}
      {activeTab === 'write' && (
        <>
          <input
            placeholder="Enter a title..."
            // InputProps={{
            //   className: styles.titleInput,
            // }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <MarkdownEditor
            mdInputRef={mdInputRef}
            mdValue={mdInput}
            setMdValue={setMdInput}
          />
        </>
      )}
    </>
  );
}
