import classes from './index.module.less';
import clsx from 'clsx';
import DesktopHeader from './DescktopHeader';
import MobileHeader from './mobileHeader';

const Header: React.FC<{
  darkMode?: Boolean;
  className?: string;
}> = ({ darkMode = false, className = '' }) => {
  return (
    <header
      className={clsx(classes.headerContainer, {
        [classes.stickyHeader]: !darkMode,
        [classes.fixedHeader]: darkMode,
      })}
    >
      <DesktopHeader className={className} />
      <MobileHeader className={className} />
    </header>
  );
};

export default Header;
