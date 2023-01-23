import { Container, Divider, useMediaQuery } from '@mui/material';
import React from 'react';
import { PublicationQuery } from '../../graphql/generated';
import PostHeader from './PostHeader';
import theme from '../../lib/mui/theme';
import PostSidebar from './PostSidebar';
import CommentSection from './CommentSection';

type Props = {
  publication: PublicationQuery;
};

export default function PostView({ publication }: Props) {
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  console.log(matches);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: matches ? 'column' : 'row',
      }}
    >
      <Container maxWidth="md" className={styles.postView}>
        <PostHeader publication={publication} />
        <Divider className={styles.divider} />
        <div className={styles.postContent}></div>

        <CommentSection publicationId={publication?.publication?.id ?? ''} />

        {matches && <PostSidebar publication={publication} />}
      </Container>

      {!matches && <PostSidebar publication={publication} />}
    </div>
  );
}
