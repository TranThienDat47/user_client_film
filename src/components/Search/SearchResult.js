import { memo, useCallback, useEffect, useRef, useState, useContext } from 'react';
import { ProductItemSmall } from '~/components/ProductItem';
import { ProductContext } from '~/contexts/product';

import imgs from '~/assets/img';

import classNames from 'classnames/bind';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function SearchResult({ result = [], ...passProp }) {
   const {
      productState: { tempSelectSearchResult, keySearch },
      loadTempSelectSearchResult,
      loadKeySearch,
   } = useContext(ProductContext);
   const [hover, setHover] = useState(-1);
   const [tempHoverState, setTempHoverState] = useState(-1);
   let resultRef = useRef();
   let tempRef = useRef('');
   let tempHoverRef = useRef(-1);
   let tempDataRef = useRef(-1);

   const checkNode = (parent, children) => {
      let node = children.parentNode;
      while (node !== null) {
         if (node === parent) return true;
         tempRef = node;
         node = node.parentNode;
      }
      return false;
   };

   const handleMouseOver = useCallback((e) => {
      if (resultRef.current) {
         if (checkNode(resultRef.current, e.target)) {
            if (tempHoverRef.current !== +tempRef.children[0].id) {
               setTempHoverState(+tempRef.children[0].id);
               tempHoverRef.current = +tempRef.children[0].id;
            }
         }
      }
      setHover(-1);
   }, []);

   const handleKey = useCallback(
      (e) => {
         if (resultRef.current) {
            if (e.key === 'ArrowDown') {
               e.preventDefault();

               new Promise((resole, reject) => {
                  setTempHoverState((prev) => {
                     if (prev + 1 > result.length - 1) {
                        // resultRef.current.parentNode.parentNode.parentNode.parentNode.children[0].children[0].value =
                        // document.getElementById(
                        //    0,
                        // ).children[1].children[0].children[0].textContent;

                        // loadKeySearch(
                        //    document.getElementById(0).children[1].children[0].children[0]
                        //       .textContent,
                        // );

                        tempDataRef.current = 0;

                        return 0;
                     } else {
                        // resultRef.current.parentNode.parentNode.parentNode.parentNode.children[0].children[0].value =
                        // document.getElementById(prev + 1).children[1].children[0].children[0]
                        //    .textContent;

                        // loadKeySearch(
                        //    document.getElementById(prev + 1).children[1].children[0].children[0]
                        //       .textContent,
                        // );

                        tempDataRef.current = prev + 1;
                        return prev + 1;
                     }
                  });

                  return resole();
               }).then(() => {
                  setHover(tempDataRef.current);
               });
            } else if (e.key === 'ArrowUp') {
               e.preventDefault();

               new Promise((resole, reject) => {
                  setTempHoverState((prev) => {
                     if (prev - 1 < 0) {
                        // resultRef.current.parentNode.parentNode.parentNode.parentNode.children[0].children[0].value =
                        // document.getElementById(
                        //    result.length - 1,
                        // ).children[1].children[0].children[0].textContent;

                        // loadKeySearch(
                        //    document.getElementById(result.length - 1).children[1].children[0]
                        //       .children[0].textContent,
                        // );

                        tempDataRef.current = result.length - 1;

                        return tempDataRef.current;
                     } else {
                        // resultRef.current.parentNode.parentNode.parentNode.parentNode.children[0].children[0].value =
                        // document.getElementById(
                        //    prev - 1,
                        // ).children[1].children[0].children[0].textContent;

                        // loadKeySearch(
                        //    document.getElementById(prev - 1).children[1].children[0].children[0]
                        //       .textContent,
                        // );

                        tempDataRef.current = prev - 1;

                        return tempDataRef.current;
                     }
                  });
                  return resole();
               }).then(() => {
                  setHover(tempDataRef.current);
               });
            }
         }
      },
      [result.length],
   );

   useEffect(() => {
      if (hover > -1) {
         loadTempSelectSearchResult(document.getElementById(hover).href.split('id=')[1]);
      } else {
         loadTempSelectSearchResult(null);
      }
   }, [hover]);

   useEffect(() => {
      window.onkeydown = handleKey;
   }, [handleKey]);

   return (
      <div
         ref={resultRef}
         style={{ display: 'flex', flexDirection: 'column' }}
         onMouseLeave={() => {
            setHover(-1);
            setTempHoverState(-1);
            tempHoverRef.current = -1;
         }}
         onMouseOver={handleMouseOver}
      >
         {result.map((res, index) => (
            <ProductItemSmall
               hover={tempHoverState === index ? true : false}
               data={res?.typeKeySearch ? res : { ...res, typeKeySearch: false }}
               small
               key={index}
               id={index}
               {...passProp}
            />
         ))}
      </div>
   );
}

export default memo(SearchResult);
