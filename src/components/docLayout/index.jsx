import Layout from '../layout';
import { useTranslation } from 'react-i18next';
import classes from './index.module.less';
import Head from 'next/head';

export default function DocLayout(props) {
  const { t } = useTranslation('common');
  const { left, center, title, desc } = props;

  return (
    <Layout darkMode={false} t={t} showFooter={false} headerClassName="">
      <main>
        <title>{title}</title>
        <meta type="description" content={desc}></meta>
      </main>
    </Layout>
  );
}
