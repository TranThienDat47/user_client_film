import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import { memo, useState, useRef, useEffect } from 'react';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function Menu({
   width = '224px',
   children,
   items = [],
   darkMode = false,
   hideOnClick = false,
   className,
   titleOnBack = false,
   offset = [12, 8],
   placement = ['bottom-end'],
   onChange = defaultFn,
   onHideRender = defaultFn,
   ...props
}) {
   const [history, setHistory] = useState([{ data: items }]);
   const currentRef = useRef(history[history.length - 1]);

   useEffect(() => {
      setHistory([{ data: items }]);

      currentRef.current = [{ data: items }][[{ data: items }].length - 1];
   }, [items]);

   const renderItem = () => {
      return currentRef.current.data.map((item, index) => {
         const isParent = !!item.children;
         return (
            <MenuItem
               darkMode={darkMode}
               key={index}
               data={item}
               onClick={() => {
                  if (isParent) {
                     setHistory((prev) => [...prev, item.children]);
                     currentRef.current = [...history, item.children][
                        [...history, item.children].length - 1
                     ];
                  } else {
                     console.log(item);
                     item?.onChange(item);

                     if (history.length > 1) {
                        setHistory((prev) => prev.slice(0, prev.length - 1));
                        currentRef.current = history.slice(0, history.length - 1)[
                           history.slice(0, history.length - 1).length - 1
                        ];
                     }
                  }
               }}
            />
         );
      });
   };

   const renderResult = (attrs) => (
      <div {...props} className={cx('menu-list')} style={{ width }} tabIndex="-1" {...attrs}>
         <PopperWrapper className={cx('menu-wrapper', `${darkMode ? 'darkMode' : ''}`, className)}>
            {history.length > 1 && (
               <Header
                  titleOnBack={titleOnBack}
                  title={currentRef.current.title}
                  darkMode={darkMode}
                  onBack={() => {
                     setHistory((prev) => prev.slice(0, prev.length - 1));

                     currentRef.current = history.slice(0, history.length - 1)[
                        history.slice(0, history.length - 1).length - 1
                     ];
                  }}
               />
            )}
            <div className={cx('menu-body')}>{renderItem()}</div>
         </PopperWrapper>
      </div>
   );

   const handleResetMenu = (e) => {
      setHistory((prev) => prev.slice(0, 1));
      currentRef.current = history.slice(0, 1)[history.slice(0, 1).length - 1];
      onHideRender(e);
   };

   return (
      <Tippy
         interactive
         hideOnClick={hideOnClick}
         offset={offset}
         placement={placement}
         allowHTML="false"
         render={renderResult}
         onShow={(e) => {
            // console.log(e);
            // setTimeout(() => {
            //    e.hide();
            // }, 1000);
         }}
         onHide={handleResetMenu}
         trigger="click"
         popperOptions={{ modifiers: [{ name: 'flip', enabled: false }] }}
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
