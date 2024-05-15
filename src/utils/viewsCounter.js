export default (videoDuration, updateCallback) => {
   if (+videoDuration > 0) {
      try {
         const threshold = videoDuration * (9 / 16);

         let tempIntervalID = null;

         let countTime = 0;

         tempIntervalID = setInterval(async () => {
            if (countTime >= threshold) {
               await updateCallback();

               clearInterval(tempIntervalID);
            }

            countTime++;
         }, 1000);

         console.log('ok nha bo');
         return { success: true, message: 'Start counting time' };
      } catch (error) {
         return { success: false, error: error.message };
      }
   } else {
      return { success: false, message: 'duration < 0' };
   }
};
