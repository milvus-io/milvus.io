import React, { useState } from 'react';
import { submitHubspotForm } from '@/http/submitEmail';
import classes from './index.module.less';
import CustomInput from '../customInput/customInput';
import CustomButton from '../customButton';
import { useTranslation } from 'react-i18next';

const UNIQUE_EMAIL_ID = 'UNIQUE_EMAIL_ID';
const REGEX =
  /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/;

enum SubscribeEnum {
  INIT,
  LOADING,
  SUCCESS,
  FAIL,
}

const SubscribeNewsletter = (props: {
  className?: string;
  showAddress?: boolean;
}) => {
  const { className: classNameProp = '', showAddress = false } = props;
  const { t } = useTranslation(['common', 'home']);
  const [value, setValue] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeEnum>(
    SubscribeEnum.INIT
  );
  const [errMsg, setErrMsg] = useState<string>('');

  const btnTextMap = {
    [SubscribeEnum.INIT]: t('common:status.subscribe'),
    [SubscribeEnum.LOADING]: t('common:status.wait'),
    [SubscribeEnum.SUCCESS]: t('common:status.success'),
    [SubscribeEnum.FAIL]: t('common:status.subscribe'),
  };

  const handleSubmitInfo = async () => {
    if (subscribeStatus === SubscribeEnum.SUCCESS) {
      return;
    }
    if (!REGEX.test(value)) {
      setErrMsg('Please enter a valid email');
      setSubscribeStatus(SubscribeEnum.FAIL);

      return;
    }
    setSubscribeStatus(SubscribeEnum.LOADING);
    try {
      await submitHubspotForm({
        email: value,
      });
    } finally {
      setSubscribeStatus(SubscribeEnum.SUCCESS);
    }
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSubscribeStatus(SubscribeEnum.INIT);
    setValue(e.target.value);
    setErrMsg('');
  };

  return (
    <div className={classes.subscribeContainer}>
      <div className={classes.descriptionSection}>
        <h3>{t('home:subscribeSection.subscribe.title')}</h3>
        <p>{t('home:subscribeSection.subscribe.desc')}</p>
      </div>
      <div className={classes.subscribeSection}>
        <div className={classes.inputWrapper}>
          <CustomInput
            onChange={handleValueChange}
            classes={{
              root: classes.customInputContainer,
              input: classes.customInput,
            }}
            placeholder="Email"
            fullWidth
          />
          <p className={classes.errorMessage}>{errMsg}</p>
        </div>
        <CustomButton
          onClick={handleSubmitInfo}
          classes={{
            root: classes.customScribeButton,
          }}
        >
          {btnTextMap[subscribeStatus]}
        </CustomButton>
      </div>
    </div>
  );
};

export default SubscribeNewsletter;
