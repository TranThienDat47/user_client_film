import axios from 'axios';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';
import { memo, useEffect, useRef, useState, useContext } from 'react';

import { useDebounce } from '~/hook';
import styles from './Search.module.scss';
import SearchResult from './SearchResult';
import { apiUrl } from '~/config/constants';
import Headless from '~/components/Headless';
import { MdOutlineClear } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { ProductContext } from '~/contexts/product';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import imgs from '~/assets/img';

const cx = classNames.bind(styles);

function Search() {
   const {
      productState: { tempSelectSearchResult, keySearch },
      loadTempSelectSearchResult,
      loadKeySearch,
   } = useContext(ProductContext);

   const navigate = useNavigate();

   const [searchResult, setSearchResult] = useState([]);
   const [showResult, setShowResult] = useState(false);

   const searchValueDebound = useDebounce(keySearch, 169);

   const inputRef = useRef();
   const blurRef = useRef(false);
   const btnSearchRef = useRef();

   let mouseDownRef = useRef(false);
   let mouseLeaveRef = useRef(false);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query = params.get('search_query');

   const checkNode = (parent, children) => {
      let node = children.parentNode;
      while (node !== null) {
         if (node === parent) return true;
         node = node.parentNode;
      }
      return false;
   };

   const handleMouseDown = (e) => {
      if (e.button === 0) {
         if (inputRef.current.parentNode.parentNode.children[1]) {
            if (checkNode(inputRef.current.parentNode.parentNode.children[1], e.target)) {
               blurRef.current = true;
            }
            mouseDownRef.current = false;
         }
      } else {
         e.preventDefault();
      }
   };

   const handleMouseUp = (e) => {
      if (e.button === 0) {
         // if (!mouseLeaveRef.current) {
         const temp = setTimeout(() => {
            inputRef.current.blur();
            clearTimeout(temp);
         }, 0);
         // } else {
         // mouseLeaveRef.current = false;
         // }
      }
   };

   const handleLeave = () => {
      // if (mouseDownRef.current) {
      //    mouseLeaveRef.current = true;
      // } else {
      //    // blurRef.current = true;
      // }
   };

   const handleRender = () => {
      return (
         <div className={cx('search-result')} tabIndex="-1">
            <PopperWrapper className={cx('search-item')}>
               <h4 className={cx('search-title')}>Từ khóa tìm kiếm</h4>
               <SearchResult
                  result={searchResult}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleLeave}
               />
            </PopperWrapper>
         </div>
      );
   };

   const handleChange = (e) => {
      const searchValueTemp = e.target.value;
      if (!searchValueTemp.startsWith(' ')) {
         loadKeySearch(searchValueTemp);
      }
   };

   const handleClear = () => {
      inputRef.current.focus();
      setSearchResult([]);
      loadKeySearch('');
   };

   useEffect(() => {
      if (!searchValueDebound.trim()) {
         setSearchResult([]);
         return;
      } else {
         const loadUser = async () => {
            const response = await axios.get(
               `${apiUrl}/products/search?skip=0&limit=7&key=${searchValueDebound}&recently=true`,
            );

            var tempResult = response.data.products;

            tempResult.unshift({ typeKeySearch: true, _name: keySearch, img: imgs.iconSearch });

            setSearchResult(tempResult);
         };
         loadUser();
      }
   }, [searchValueDebound]);

   useEffect(() => {
      if (search_query && search_query.trim().length > 0) {
         loadKeySearch(search_query);
         setShowResult(false);
      }
   }, []);

   useEffect(() => {
      btnSearchRef.current.onclick = (event) => {
         if (keySearch.trim() !== '') {
            inputRef.current.blur();
            setShowResult(false);
            blurRef.current = false;
            navigate(`/search?search_query=${keySearch}`);
         }
      };

      inputRef.current.onkeydown = (event) => {
         if (event.key === 'Enter' && keySearch.trim() !== '') {
            if (!!!tempSelectSearchResult) {
               btnSearchRef.current.click();
               return;
            } else {
               setShowResult(false);
               loadTempSelectSearchResult('');
               inputRef.current.blur();
               blurRef.current = false;
               navigate(`/product?id=${tempSelectSearchResult}`);
            }
         }
      };
   }, [keySearch, tempSelectSearchResult, showResult, inputRef.current, blurRef.current]);

   return (
      <Headless
         visible={showResult && searchValueDebound.trim().length > 0 && searchResult.length > 0}
         className={cx('wrapper')}
         offset={[9, 0]}
         render={handleRender}
         onMouseLeave={() => {
            blurRef.current = false;
         }}
      >
         <div className={cx('search')}>
            <input
               ref={inputRef}
               placeholder="Search..."
               spellCheck={false}
               value={keySearch}
               onChange={handleChange}
               onFocus={() => {
                  setShowResult(true);
               }}
               onBlur={(e) => {
                  setShowResult(false);
                  if (!blurRef.current) {
                  } else {
                     blurRef.current = false;
                     inputRef.current.focus();
                  }
               }}
            />
            {!!keySearch && (
               <button className={cx('clear')} onClick={handleClear}>
                  <MdOutlineClear />
               </button>
            )}

            <button
               className={cx('search-btn', 'tooltip')}
               name-tooltip={'Search'}
               ref={btnSearchRef}
               onMouseDown={(e) => {
                  e.preventDefault();
                  inputRef.current.blur();
                  setShowResult(false);
               }}
            >
               <IoSearchOutline className={cx('search-color')} />
            </button>
         </div>
      </Headless>
   );
}

export default memo(Search);
