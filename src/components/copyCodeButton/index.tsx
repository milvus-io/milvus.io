import { CopyIcon, CheckIcon } from '../icons';
import { useState } from 'react';
import classes from './index.module.less';
import clsx from 'clsx';

const REST_DURATION = 3000;

type CopyCodeButtonProps = {
  text: string;
  classes?: {
    root?: string;
  };
};

export default function CopyCodeButton(props: CopyCodeButtonProps) {
  const { text, classes: customClasses = {} } = props;
  const { root = '' } = customClasses;

  const [copyState, setCopyState] = useState(false);

  const handleCopyCode = () => {
    if (copyState) {
      return;
    }
    navigator.clipboard.writeText(text);
    setCopyState(true);

    setTimeout(() => {
      setCopyState(false);
    }, REST_DURATION);
  };

  return (
    <div className={clsx(classes.copyButtonContainer, root)}>
      <p className={classes.installPy}>{text}</p>
      <button className={classes.copyButton} onClick={handleCopyCode}>
        {copyState ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}
