import React from 'react';
import { PublicationsQuery } from '../../graphql/generated';
import ProfileFeedItem from './ProfileFeedItem';

type Props = {
  posts: PublicationsQuery;
};

export default function ProfileFeed({ posts }: Props) {
  return (
    <div>
      {posts?.publications?.items?.map((post) => (
        <ProfileFeedItem post={post} key={post.id} />
      ))}
    </div>
  );
}
