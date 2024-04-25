import classNames from 'classnames/bind';
import styles from './ListProductSearch.module.scss';

import { ProductItem } from '~/components/ProductItem';

const cx = classNames.bind(styles);

function ListProductsSearch({ data = [], ...props }) {
   return (
      <div className={cx('wrapper')}>
         <ul className={cx('list')}>
            {data.map((res, index) => (
               <li key={index} className={cx('item')}>
                  <ProductItem modeSearchPage extraLarge={false} data={res} />
               </li>
            ))}
         </ul>
      </div>
   );
}

export default ListProductsSearch;
