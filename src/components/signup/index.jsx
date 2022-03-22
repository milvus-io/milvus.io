import React, { useRef, useState } from "react";
import { submitInfoForm } from "../../http/submitEmail";
import * as styles from "./index.module.less";
import { useSubscribeSrouce } from "../../hooks";

const UNIQUE_EMAIL_ID = "UNIQUE_EMAIL_ID";

const Signup = ({ callback, t }) => {
  const inputRef = useRef(null);
  const source = useSubscribeSrouce();
  const [disabled, setDisabled] = useState(false);

  const handleSubmitEmail = async () => {
    const regx =
      /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/;

    const value = inputRef.current.value;
    if (!regx.test(value)) {
      callback({
        type: "error",
        message: t("v3trans.signup.emailerror"),
      });
      return;
    }

    try {
      setDisabled(true);
      const { statusCode, unique_email_id } = await submitInfoForm({
        email: value,
        form: {
          SOURCE: source,
        },
      });
      if (statusCode === 200) {
        window.localStorage.setItem(UNIQUE_EMAIL_ID, unique_email_id);
        callback({
          type: "success",
          message: t("v3trans.signup.thankyou"),
        });
        //
      } else {
        callback({
          type: "warning",
          message: t("v3trans.signup.subscribed"),
        });
        window.localStorage.setItem(UNIQUE_EMAIL_ID, true);
      }
    } catch (error) {
      callback({
        type: "warning",
        message: t("v3trans.signup.subscribed"),
      });
      window.localStorage.setItem(UNIQUE_EMAIL_ID, true);
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <section className={styles.subscribe}>
      <div className={`${styles.inner} col-4 col-8 col-12`}>
        <div className={styles.section}>
          <h2>{t("v3trans.signup.signup")}</h2>
          <p>{t("v3trans.signup.montyly")}</p>
        </div>
        <div className={`${styles.section} ${styles.inputWrapper}`}>
          <input
            className={styles.input}
            type="text"
            placeholder={t("v3trans.signup.placeholder")}
            ref={inputRef}
          />
          <button
            className={`${styles.subscribeBtn}`}
            onClick={handleSubmitEmail}
            disabled={disabled}
          >
            {t("v3trans.signup.subscribe")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Signup;
