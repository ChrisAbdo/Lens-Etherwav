import React from 'react';

import { EditorTab } from './CreateContainer';
import decorateMarkdown from '../../lib/markdown/decorateMarkdown';
import { capitalize } from '../../lib/helper/format';

const tabs = [
  {
    name: 'write',
  },
  {
    name: 'preview',
  },
  {
    name: 'guide',
  },
];

const editorOptions = [
  {
    name: 'heading',
    // Take the editor and the setContent and call the decorateMarkdown function
    // with the editor and the setContent function
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'h1', setContent),
  },
  {
    name: 'bold',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'bold', setContent),
  },
  {
    name: 'italic',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'italic', setContent),
  },
  {
    name: 'quote',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'quote', setContent),
  },
  {
    name: 'inline code',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'inline code', setContent),
  },
  {
    name: 'code block',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'code block', setContent),
  },
  {
    name: 'unordered list',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'ul', setContent),
  },
  {
    name: 'ordered list',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'ol', setContent),
  },
  {
    name: 'link',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'link', setContent),
  },
  {
    name: 'image',
    onClick: (
      editor: HTMLTextAreaElement,
      setContent: (content: string) => void
    ) => decorateMarkdown(editor, 'image', setContent),
  },
];

type Props = {
  mdInputRef: React.RefObject<HTMLTextAreaElement>;
  setMdValue: (value: string) => void;
  activeTab: EditorTab;
  setActiveTab: (tab: EditorTab) => void;
};

export default function EditorToolbar({
  mdInputRef,
  setMdValue,
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <>
      {/* Left side of editor (Tabs) */}
      {/* Map over editor tabs */}
      {tabs.map((tab, i) => (
        <div key={i}>
          <button
            color={activeTab === tab.name ? 'primary' : 'inherit'}
            onClick={() => setActiveTab(tab.name as EditorTab)}
          >
            {capitalize(tab.name)}
          </button>
        </div>
      ))}

      {/* Right side of editor (Editor options) */}
      {editorOptions.map((option, i) => (
        <div key={i}>
          <button
            onClick={() => {
              if (!mdInputRef?.current) return;
              option.onClick?.(mdInputRef?.current, setMdValue);
            }}
          >
            option
          </button>
        </div>
      ))}

      <div>
        <h1>
          Currently, there is no draft-saving feature.{' '}
          <b>Your work will be lost if you leave this page</b>.
        </h1>
      </div>
    </>
  );
}
