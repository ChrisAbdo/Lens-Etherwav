import Link from 'next/link';
import React, { useState } from 'react';
import createStyles from './create.module.css';
import SignInButton from '../SignInButton';
import { useLensUserContext } from '../../context/LensUserContext';
import SettingsSidebar from './SettingsSidebar';

type Props = {
  postMetadata: Record<string, any>;
  setPostMetadata: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

export default function CreateHeader({ postMetadata, setPostMetadata }: Props) {
  const { isSignedIn, data: lensProfile } = useLensUserContext();
  const [openSettingsSidebar, setOpenSettingsSidebar] =
    useState<boolean>(false);

  return (
    <>
      <div>
        <div>
          <Link href="/feed">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="logo" height={56} />
          </Link>
        </div>

        {/* Before accesing post settings, need sign in and lens profile */}
        {!isSignedIn || !lensProfile ? (
          <SignInButton />
        ) : (
          <>
            <button
              onClick={() => setOpenSettingsSidebar(!openSettingsSidebar)}
            >
              settings
            </button>
          </>
        )}
      </div>

      <SettingsSidebar
        postMetadata={postMetadata}
        setPostMetadata={setPostMetadata}
        open={openSettingsSidebar}
        setOpen={setOpenSettingsSidebar}
      />
    </>
  );
}
