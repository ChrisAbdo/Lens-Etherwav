import React, { useRef, useState } from 'react';
import CoverImage from './CoverImage';
import CreateHeader from './CreateHeader';
import MarkdownEditor from './MarkdownEditor';

type Props = {};

export type EditorTab = 'write' | 'preview' | 'guide';

export default function CreateContainer({}: Props) {
  const mdInputRef = useRef<HTMLTextAreaElement>(null);

  const [mdInput, setMdInput] = useState<string>('');

  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [title, setTitle] = useState<string>('');

  const [metadata, setMetadata] = useState<Record<string, any>>({});

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Page content here --> */}

          <>
            <div className="p-6">
              <div className="card w-full bg-base-100 shadow-xl border border-[#2a2a2a] rounded-3xl">
                <figure>
                  <h1 className="text-2xl font-bold underline mt-4">
                    Upload to Lens🌿
                  </h1>
                </figure>
                <div className="card-body">
                  <CoverImage
                    coverImage={coverImage}
                    setCoverImage={setCoverImage}
                  />
                  <input
                    placeholder="Song Title..."
                    className="input input-bordered w-full rounded-xl"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <MarkdownEditor
                    mdInputRef={mdInputRef}
                    mdValue={mdInput}
                    setMdValue={setMdInput}
                  />
                  <label
                    htmlFor="my-drawer-2"
                    className="btn btn-primary drawer-button lg:hidden rounded-xl"
                  >
                    Upload to Lens🌿
                  </label>
                </div>
              </div>
            </div>
          </>
        </div>
        <div className="drawer-side border-r border-[#2a2a2a]">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            {/* <!-- Sidebar content here --> */}
            <h1 className="text-2xl font-bold underline mb-2">Post Preview</h1>
            <CreateHeader
              postMetadata={{
                ...metadata,
                title,
                coverImage,
                content: mdInput,
              }}
              setPostMetadata={setMetadata}
            />
          </ul>
        </div>
      </div>
    </>
  );
}
