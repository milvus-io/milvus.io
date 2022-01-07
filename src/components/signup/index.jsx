import React, { useRef } from "react";
import { submitInfoForm } from "../../http/submitEmail";
import * as styles from "./index.module.less";

const UNIQUE_EMAIL_ID = "UNIQUE_EMAIL_ID";

const Signup = ({ isMobile, callback }) => {
  const inputRef = useRef(null);
  const handleSubmitEmail = async () => {
    const regx =
      /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/;

    const value = inputRef.current.value;
    if (!regx.test(value)) {
      callback({
        type: "error",
        message: "Email format error",
      });
      return;
    }
    const { search } = window.location;
    const source = ["utm_source", "utm_medium", "utm_campaign"].every(v =>
      search.includes(v)
    )
      ? "Ads：Reddit"
      : "Milvus：demo";

    try {
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
          message: "Thank you, you have been added to our mailing list!",
        });
        //
      } else {
        callback({
          type: "warning",
          message: "This email is already subscribed!",
        });
        window.localStorage.setItem(UNIQUE_EMAIL_ID, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.subscribe}>
      <div className={`${styles.inner} col-4 col-8 col-12`}>
        <div className={styles.section}>
          <h2>Sign up for our newsletter</h2>
          <p>
            Monthly hand-picked discoveries and stories of thriving technologies
            in a new world of data.
          </p>
        </div>
        <div className={`${styles.section} ${styles.inputWrapper}`}>
          <input
            className={styles.input}
            type="text"
            placeholder="What’s your email?"
            ref={inputRef}
          />
          <button
            className={`customButton containedBtn ${styles.subscribeBtn}`}
            onClick={handleSubmitEmail}
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Signup;
