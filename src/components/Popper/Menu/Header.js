import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

import { AiOutlineArrowLeft } from 'react-icons/ai';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Header({ title, onBack, darkMode, titleOnBack = false }) {
   return (
      <header className={cx('header')}>
         <Button
            transparent
            className={cx('back-btn')}
            style={{ color: `${darkMode ? 'var(--white)' : ''}` }}
            onClick={onBack}
         >
            <AiOutlineArrowLeft />
         </Button>
         <h4
            onClick={(e) => {
               if (titleOnBack) onBack(e);
            }}
            className={cx('header-title')}
            style={{ cursor: `${titleOnBack ? 'pointer' : ''}` }}
         >
            {title}
         </h4>
      </header>
   );
}

Header.propTypes = {
   title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
   onBack: PropTypes.func.isRequired,
};

export default Header;
