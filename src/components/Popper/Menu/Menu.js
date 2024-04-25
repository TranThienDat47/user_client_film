import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import { memo, useState, useRef } from 'react';

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
   getItems = () => {},
   ...props
}) {
   const [history, setHistory] = useState([{ data: items }]);
   const mapStepRef = useRef([]);
   const tippyRef = useRef();
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
                     mapStepRef.current = mapStepRef.current?.concat(index);
                  } else {
                     onChange(item);
                     mapStepRef.current.pop();
                     const tempItems = [{ data: getItems() }];
                     var tempHistory = tempItems;
                     mapStepRef.current.forEach((element, index) => {
                        tempHistory = [...tempHistory, tempHistory[element]];
                     });
                     setHistory(tempHistory);
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
                  title={current.title}
                  darkMode={darkMode}
                  onBack={() => {
                     setHistory((prev) => prev.slice(0, prev.length - 1));
                     mapStepRef.current = mapStepRef.current.slice(
                        0,
                        mapStepRef.current.length - history.length,
                     );
                  }}
               />
            )}
            <div className={cx('menu-body')}>{renderItem()}</div>
         </PopperWrapper>
      </div>
   );

   const handleResetMenu = (e) => {
      setHistory((prev) => prev.slice(0, 1));
      mapStepRef.current = [];
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
