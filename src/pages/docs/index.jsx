import React, { useEffect } from 'react';
import docUtils from '../../utils/docs.utils';
import { useRouter } from 'next/router';

export default function DocHomePage(props) {
  const { newestVersion } = props;

  const router = useRouter();

  useEffect(() => {
    router.replace(`/docs/${newestVersion}/home`);
  }, []);

  return (
    <p
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      Loading...
    </p>
  );
}

export const getStaticProps = () => {
  const { newestVersion } = docUtils.getVersion();

  return {
    props: {
      newestVersion,
    },
  };
};
