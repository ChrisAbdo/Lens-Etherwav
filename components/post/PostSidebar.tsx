import { MediaRenderer } from '@thirdweb-dev/react';
import Link from 'next/link';
import React from 'react';
import { PublicationQuery } from '../../graphql/generated';
import { formatNum } from '../../lib/helper/format';

type Props = {
  publication: PublicationQuery;
};

export default function PostSidebar({ publication }: Props) {
  return (
    <div>
      <h1>About the author</h1>

      <div>
        <Link href={`/profile/${publication.publication?.profile.handle}`}>
          <MediaRenderer
            src={
              // @ts-ignore: Type does exist.
              publication?.publication?.profile?.picture?.original?.url
            }
            alt={
              publication?.publication?.profile?.name ||
              'Author profile picture'
            }
          />
        </Link>

        <div>
          <Link href={`/profile/${publication.publication?.profile.handle}`}>
            <h1>{publication?.publication?.profile?.name}</h1>
          </Link>

          <Link href={`/profile/${publication.publication?.profile.handle}`}>
            <h1>@{publication?.publication?.profile?.handle}</h1>
          </Link>

          <h1>
            <b>
              {formatNum(
                publication?.publication?.profile?.stats.totalFollowers
              )}{' '}
              Followers
            </b>
          </h1>
        </div>
      </div>
      <h1>{publication?.publication?.profile?.bio}</h1>
    </div>
  );
}
