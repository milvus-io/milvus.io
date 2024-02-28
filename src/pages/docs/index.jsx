import docUtils from '../../utils/docs.utils';

export default function DocHomePage() {
  return null;
}

export const getServerSideProps = async () => {
  const { newestVersion } = docUtils.getVersion();

  return {
    redirect: {
      destination: `/docs/${newestVersion}/home`,
      permanent: false,
    },
  };
};
