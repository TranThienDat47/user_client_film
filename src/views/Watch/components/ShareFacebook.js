import Button from '~/components/Button';
import { SiFacebook } from 'react-icons/si';
import { Helmet } from 'react-helmet';

import classNames from 'classnames/bind';
import styles from '../Watch.module.scss';

const cx = classNames.bind(styles);
function ShareFacebook({
   valueUrlState,
   videoInf = {
      videoTitle: '',
      videoDescription: '',
   },
}) {
   const handleShareFacebook = () => {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
         valueUrlState,
      )}`;
      window.open(facebookShareUrl, '_blank');
   };
   return (
      <>
         <Button
            onClick={handleShareFacebook}
            transparent
            hover
            name-tooltip="Facebook"
            className={cx('tooltip')}
         >
            <SiFacebook className={cx('share-item-facebook')}></SiFacebook>
         </Button>

         <Helmet>
            <meta property="og:title" content={videoInf.videoTitle} />
            <meta property="og:description" content={videoInf.videoDescription} />
            <meta property="og:image" content={videoInf.videoImage} />
            <meta property="og:url" content={valueUrlState} />
            <meta property="og:video" content={valueUrlState} />
            <meta property="og:video:secure_url" content={valueUrlState} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="960" />
            <meta property="og:video:height" content="480" />
         </Helmet>
      </>
   );
}

export default ShareFacebook;