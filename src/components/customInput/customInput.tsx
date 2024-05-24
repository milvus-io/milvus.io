import { FC } from 'react';
import clsx from 'clsx';
import classes from './customInput.module.less';
import { InputProps } from './Types';

const CustomInput: FC<InputProps> = ({
  containerClass = '',
  className: customInputClass = '',
  fullWidth = false,
  ...props
}) => {
  return (
    <div className={clsx(classes.container, containerClass)}>
      <input
        className={clsx(
          classes.input,
          { [classes.fullWidth]: fullWidth },
          customInputClass
        )}
        {...props}
      />
    </div>
  );
};

export default CustomInput;
