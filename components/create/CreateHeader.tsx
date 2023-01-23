import React, { useState } from 'react';
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
        {/* Before accesing post settings, need sign in and lens profile */}
        {!isSignedIn || (!lensProfile && <SignInButton />)}
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
