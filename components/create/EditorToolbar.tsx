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
  return <></>;
}
