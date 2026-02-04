import Layout from '@/components/layout/commonLayout';
import pageClasses from '@/styles/responsive.module.less';
import Head from 'next/head';
import { Trans, useTranslation } from 'react-i18next';
import { useHubspotForm } from 'next-hubspot';
import { useMemo } from 'react';
import classes from '@/styles/responsive.module.less';
import { CLOUD_SIGNUP_LINK } from '@/consts';
import { LanguageEnum } from '@/types/localization';

type Props = {
  locale: LanguageEnum;
};

export function Contact(props: Props) {
  const { locale = LanguageEnum.ENGLISH } = props;
  const { t } = useTranslation('contact', { lng: locale });

  const { isFormCreated, isError, error } = useHubspotForm({
    portalId: '24054828',
    formId: '502c706c-5251-4d2f-8209-aad5da707115',
    target: '#hubspot-form',
  });

  const formContentHtml = useMemo(() => {
    if (error) {
      return <p className={classes.prompt}>{t('form.error')}</p>;
    }
    return isFormCreated ? null : (
      <p className="text-[16px] leading-[24px] text-center mt-[150px]">
        {t('form.loading')}
      </p>
    );
  }, [isFormCreated, error, t]);

  return (
    <Layout>
      <main>
        <Head>
          <title>
            Contact Us - Get help with Milvus Deployment & Managed Milvus
          </title>
          <meta
            name="description"
            content="Need help deploying Milvus or have questions about Zilliz Cloud? Reach out to the Zilliz team today through our contact form. Whether you're ready to scale or just starting out, our experts are here to assist you with all your vector database needs."
          />
          <meta
            name="keywords"
            content="Milvus support, managed Milvus, Zilliz Cloud, Contact Zilliz, Vector database help, Milvus deployment support, Zilliz Cloud support, Managed vector database, Milvus database contact, Zilliz team contact, Get help with Milvus."
          />
        </Head>
      </main>
      <section className="py-[80px] bg-[url('/images/contact/contact-bg.png')] bg-no-repeat bg-cover bg-center">
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
                  href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_contact_us&utm_content=contact`}
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
          <div className="rounded-[16px] border border-solid border-[#ECECEE] bg-white p-[40px] max-w-[680px] min-h-[340px] mx-auto">
            <div id="hubspot-form">{formContentHtml}</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
