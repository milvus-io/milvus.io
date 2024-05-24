import React, { useState } from 'react';
import * as styles from './index.module.less';
import { TextField } from '@mui/material';
import { submitHubspotForm } from '@/http/submitEmail';

const InfoSubmitter = ({ submitCb = () => {}, source, href = '' }) => {
  const regx =
    /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/;
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    let [statusCode, unique_email_id] = [null, null];
    setLoading(true);
    try {
      const res = await submitHubspotForm({
        email: value,
      });
      statusCode = res.statusCode;
      unique_email_id = res.unique_email_id;
    } catch (error) {
      statusCode = 400;
      unique_email_id = true;
      console.log(error);
    } finally {
      setLoading(false);
      submitCb(statusCode, unique_email_id, href);
    }
  };
  return (
    <div className={styles.submitterContainer}>
      <p className={styles.alert}>
        Fill in your email address to receive a quick start guide for free!
      </p>

      <div>
        <TextField
          fullWidth
          variant="standard"
          label="EMAIL"
          value={value}
          onChange={handleChange}
        />
        <span className={styles.prompt}>
          *We will never share your email or spam you
        </span>
      </div>

      <div className={styles.btnWrapper}>
        <button
          className={styles.submitBtn}
          disabled={!regx.test(value) || loading}
          onClick={handleSubmit}
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default InfoSubmitter;
