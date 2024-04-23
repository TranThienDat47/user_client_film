const validateTime = (time) => {
   const now = new Date();
   const target = new Date(time);

   const diff = Math.abs(now.getTime() - target.getTime());

   let unit = 'vừa xong';
   let value = 0;

   let realValue = 0;

   if (diff < 60000) {
      unit = 'vài giây trước';
      realValue = (Math.ceil(diff / 60000) - diff / 60000) * 60000;
   } else if (diff < 3600000) {
      unit = 'phút';
      value = Math.floor(diff / 60000);
      realValue = (Math.ceil(diff / 60000) - diff / 60000) * 60000;
   } else if (diff < 86400000) {
      unit = 'giờ';
      value = Math.floor(diff / 3600000);
      realValue = (Math.ceil(diff / 3600000) - diff / 3600000) * 3600000;
   } else if (diff < 604800000) {
      unit = 'ngày';
      value = Math.floor(diff / 86400000);
      realValue = (Math.ceil(diff / 86400000) - diff / 86400000) * 86400000;
   } else if (diff < 2592000000) {
      unit = 'tuần';
      value = Math.floor(diff / 604800000);
      realValue = (Math.ceil(diff / 604800000) - diff / 604800000) * 604800000;
   } else if (diff < 31536000000) {
      unit = 'tháng';
      value = Math.floor(diff / 2592000000);
      realValue = (Math.ceil(diff / 2592000000) - diff / 2592000000) * 2592000000;
   } else {
      unit = 'năm';
      value = Math.floor(diff / 31536000000);
      realValue = (Math.ceil(diff / 31536000000) - diff / 31536000000) * 31536000000;
   }

   return {
      unit,
      value,
      realValue,
   };
};

const converterDate = (dateString) => {
   const date = new Date(dateString);

   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const year = date.getFullYear().toString();

   const formattedDate = `${day}-${month}-${year}`;

   return formattedDate;
};

const sortedEpisodes = (data = []) => {
   data = data.sort((a, b) => {
      const episodeA = parseInt(a.episode);
      const episodeB = parseInt(b.episode);

      if (isNaN(episodeA) && isNaN(episodeB)) {
         return 0;
      }
      if (isNaN(episodeA)) {
         return -1;
      }
      if (isNaN(episodeB)) {
         return 0;
      }

      return episodeB - episodeA;
   });

   const maxEpisodes = Math.max(
      ...data.map((element) => parseInt(element.episode)).filter((element) => !isNaN(element)),
   );

   const lengthMax = String(maxEpisodes).length;

   data = data.map((element) => {
      if (!isNaN(parseInt(element.episode)))
         if (String(element.episode).length < lengthMax) {
            element.episode = element.episode.padStart(lengthMax, '0');
         }

      return element;
   });

   return data;
};

const converterDateTitle = (dateString) => {
   const date = new Date(dateString);

   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const year = date.getFullYear().toString();

   const formattedDate = `${day} thg ${month}, ${year}`;

   return formattedDate;
};

export { validateTime, converterDate, sortedEpisodes, converterDateTitle };
