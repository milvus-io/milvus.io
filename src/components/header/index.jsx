import classes from './index.module.less';
import clsx from 'clsx';
import DesktopHeader from './descktopHeader';
import MobileHeader from './mobileHeader';

const Header = ({ darkMode = false, t = v => v, className = '' }) => {
  return (
    <header
      className={clsx(classes.headerContainer, className, {
        [classes.stickyHeader]: !darkMode,
        [classes.fixedHeader]: darkMode,
      })}
    >
      <DesktopHeader darkMode={darkMode} />
      <MobileHeader />
    </header>
  );
};

export default Header;
