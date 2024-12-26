import React, { useState } from 'react';
import { submitHubspotForm } from '@/http/submitEmail';
import classes from './index.module.less';
import CustomInput from '../customInput/customInput';
import CustomButton from '../customButton';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const UNIQUE_EMAIL_ID = 'UNIQUE_EMAIL_ID';
const REGEX =
  /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/;

enum SubscribeEnum {
  INIT,
  LOADING,
  SUCCESS,
  FAIL,
}

interface Props {
  className?: string;
  showAddress?: boolean;
  withoutTitle?: boolean;
  classes?: {
    input?: string;
    inputContainer?: string;
    button?: string;
    errorMessage?: string;
  };
}

const SubscribeNewsletter: React.FC<Props> = props => {
  const {
    className: classNameProp = '',
    showAddress = false,
    withoutTitle = false,
    classes: customClasses = {},
  } = props;
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

  const renderTitle = () => {
    if (withoutTitle) {
      return null;
    }

    return (
      <h3 className={classes.title}>
        {t('home:subscribeSection.subscribe.title')}
      </h3>
    );
  };

  return (
    <div className={classes.subscribeContainer}>
      {renderTitle()}
      <div className={classes.subscribeSection}>
        <div className={classes.inputWrapper}>
          <CustomInput
            onChange={handleValueChange}
            classes={{
              root: clsx(
                classes.customInputContainer,
                customClasses.inputContainer
              ),
              input: clsx(classes.customInput, customClasses.input),
            }}
            placeholder="Email"
            fullWidth
          />
          <p className={clsx(classes.errorMessage, customClasses.errorMessage)}>
            {errMsg}
          </p>
        </div>
        <CustomButton
          onClick={handleSubmitInfo}
          size="large"
          classes={{
            root: clsx(classes.customSubscribeButton, customClasses.button),
          }}
        >
          {btnTextMap[subscribeStatus]}
        </CustomButton>
      </div>
    </div>
  );
};

export default SubscribeNewsletter;
