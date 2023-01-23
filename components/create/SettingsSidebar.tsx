import * as React from 'react';
import styles from './create.module.css';
import { Web3Button } from '@thirdweb-dev/react';
import { LENS_CONTRACT_ADDRESS } from '../../const/blockchain';
import { LENS_ABI } from '../../const/abis';
import { useCreatePost } from '../../lib/lens/createPost';

type Props = {
  postMetadata: Record<string, any>;
  setPostMetadata: (metadata: Record<string, any>) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function TemporaryDrawer({
  postMetadata,
  setPostMetadata,
  open,
  setOpen,
}: Props) {
  const { mutateAsync: createPost } = useCreatePost();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(open);
    };

  const list = () => (
    <div>
      {postMetadata.coverImage ? (
        <>
          <h1>Cover Image</h1>
          <img
            src={URL.createObjectURL(postMetadata.coverImage)}
            className={styles.sidebarImagePreview}
          />
        </>
      ) : (
        <h1>No cover image selected.</h1>
      )}

      <input
        disabled
        value={postMetadata.title || ''}
        placeholder="Your title will go here..."
      />

      <Web3Button
        className="btn mt-2"
        contractAddress={LENS_CONTRACT_ADDRESS}
        contractAbi={LENS_ABI}
        action={async () => await createPost({ ...postMetadata })}
      >
        <h1>Publish Post 🌿</h1>
      </Web3Button>
    </div>
  );

  return <div>{list()}</div>;
}
