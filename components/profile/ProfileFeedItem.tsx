import { MediaRenderer } from '@thirdweb-dev/react';
import Link from 'next/link';
import React from 'react';
import { PublicationsQuery } from '../../graphql/generated';
import { getFormattedDate } from '../../lib/helper/dates';
import { formatNum, getPreviewText } from '../../lib/helper/format';

type Props = {
  post: PublicationsQuery['publications']['items'][0];
};

export default function ProfileFeedItem({ post }: Props) {
  return (
    <Link href={`/post/${post.id}`}>
      <h1>{post?.metadata?.name}</h1>

      <div>
        <h1>{getFormattedDate(post.createdAt) || 'Loading...'}</h1>
      </div>

      <h1>{getPreviewText(post?.metadata?.content)}</h1>
      <MediaRenderer
        src={
          post?.metadata?.image ||
          post?.metadata?.media?.[0]?.original?.url ||
          // @ts-ignore: Type does exist.
          post?.profile?.coverPicture?.original?.url ||
          // @ts-ignore: Type does exist.
          post?.profile?.picture?.original?.url ||
          ''
        }
        alt={post?.metadata?.name || 'Loading...'}
      />
      <div>
        <div>
          <h1>{formatNum(post?.stats?.totalAmountOfComments)}</h1>
        </div>
        <div>
          <h1>{formatNum(post?.stats?.totalAmountOfMirrors)}</h1>
        </div>
        <div>
          <h1>{formatNum(post?.stats?.totalAmountOfCollects)}</h1>
        </div>
      </div>
    </Link>
  );
}
