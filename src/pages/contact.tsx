import Layout from '@/components/layout/commonLayout';
import pageClasses from '@/styles/responsive.module.less';
import Head from 'next/head';
import { Trans, useTranslation } from 'react-i18next';
import { useHubspotForm } from 'next-hubspot';
import { useMemo } from 'react';
import classes from '@/styles/responsive.module.less';
import { CLOUD_SIGNUP_LINK } from '@/consts';

export default function ContactUs() {
  const { t } = useTranslation('contact');

  const { loaded, error, formCreated } = useHubspotForm({
    portalId: '24054828',
    formId: '502c706c-5251-4d2f-8209-aad5da707115',
    target: '#hubspot-form',
  });

  const formContentHtml = useMemo(() => {
    if (error) {
      return <p className={classes.prompt}>{t('form.error')}</p>;
    }
    return formCreated ? null : (
      <p className="text-[16px] leading-[24px] text-center mt-[300px]">
        {t('form.loading')}
      </p>
    );
  }, [formCreated, error, t]);

  return (
    <Layout>
      <main>
        <Head>
          <title></title>
          <meta name="description" content="" />
          <meta name="keywords" content="" />
        </Head>
      </main>
      <section className="py-[80px]">
        <div className={pageClasses.homeContainer}>
          <h1 className="text-[42px] leading-[54px] font-[600] text-center mb-[12px]">
            {t('title')}
          </h1>
          <p className="text-[16px] leading-[24px] max-w-[880px] mx-[auto] text-center mb-[40px] font-mono text-black1">
            <Trans
              t={t}
              i18nKey="desc"
              components={[
                <a
                  key="cloud"
                  href={CLOUD_SIGNUP_LINK}
                  target="_blank"
                  className="underline text-black1"
                ></a>,
                <a
                  key="zilliz"
                  href="https://zilliz.com"
                  target="_blank"
                  className="underline text-black1"
                ></a>,
              ]}
            />
          </p>
          <div className="rounded-[16px] border border-solid border-[#ECECEE] bg-white p-[40px] max-w-[680px] min-h-[640px] mx-auto">
            <div id="hubspot-form">{formContentHtml}</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
