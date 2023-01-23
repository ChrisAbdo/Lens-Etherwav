import { MediaRenderer } from '@thirdweb-dev/react';
import React from 'react';
import { ProfileQuery } from '../../graphql/generated';
import styles from './profile.module.css';

type Props = {
  profile: ProfileQuery;
};

export default function ProfileHeader({ profile }: Props) {
  return (
    <div>
      <div></div>

      <div>
        <div></div>

        <h1>{profile.profile?.name}</h1>

        <div>
          <h2>@{profile.profile?.handle}</h2>

          {profile?.profile?.isFollowing && <h2>Following</h2>}
        </div>
        <h1>{profile.profile?.bio}</h1>

        <div>
          <h1>
            <b>{profile.profile?.stats.totalFollowers}</b> Followers
          </h1>
          <h1>
            <b>{profile.profile?.stats.totalFollowing}</b> Following
          </h1>
          <h1>
            <b>{profile.profile?.stats.totalPosts}</b> Posts
          </h1>
        </div>
      </div>
    </div>
  );
}
