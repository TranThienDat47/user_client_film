export default (countFollow) => {
   if (countFollow > 0) {
      if (countFollow < 1000) {
         return countFollow;
      } else if (+countFollow >= 1000 && +countFollow < 1000000) {
         return parseFloat(+countFollow / 1000).toFixed(1) + ' N';
      } else if (+countFollow >= 1000000) {
         return parseFloat(+countFollow / 1000000).toFixed(1) + ' Tr';
      }
   } else {
      return 0;
   }
};
