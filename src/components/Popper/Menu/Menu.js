import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import { memo, useState } from 'react';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function Menu({
   children,
   items = [],
   darkMode = false,
   hideOnClick = false,
   className,
   titleOnBack = false,
   offset = [12, 8],
   onChange = defaultFn,
   onHideRender = defaultFn,
   ...props
}) {
   const [history, setHistory] = useState([{ data: items }]);
   const current = history[history.length - 1];

   const renderItem = () => {
      return current.data.map((item, index) => {
         const isParent = !!item.children;
         return (
            <MenuItem
               darkMode={darkMode}
               key={index}
               data={item}
               onClick={() => {
                  if (isParent) {
                     setHistory((prev) => [...prev, item.children]);
                  } else {
                     onChange(item);
                  }
               }}
            />
         );
      });
   };

   const renderResult = (attrs) => (
      <div {...props} className={cx('menu-list')} tabIndex="-1" {...attrs}>
         <PopperWrapper className={cx('menu-wrapper', `${darkMode ? 'darkMode' : ''}`, className)}>
            {history.length > 1 && (
               <Header
                  titleOnBack={titleOnBack}
                  title={current.title}
                  darkMode={darkMode}
                  onBack={() => {
                     setHistory((prev) => prev.slice(0, prev.length - 1));
                  }}
               />
            )}
            <div className={cx('menu-body')}>{renderItem()}</div>
         </PopperWrapper>
      </div>
   );

   const handleResetMenu = (e) => {
      setHistory((prev) => prev.slice(0, 1));
      onHideRender(e);
   };

   return (
      <Tippy
         interactive
         hideOnClick={hideOnClick}
         offset={offset}
         placement="bottom-end"
         render={renderResult}
         onHide={handleResetMenu}
         trigger="click"
      >
         {children}
      </Tippy>
   );
}

Menu.propTypes = {
   children: PropTypes.node.isRequired,
   onChange: PropTypes.func,
   hideOnClick: PropTypes.bool,
   items: PropTypes.array,
   className: PropTypes.string,
};

export default memo(Menu);
