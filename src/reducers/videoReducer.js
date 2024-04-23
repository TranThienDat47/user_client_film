export const init = {
   volume: 2,
   play: 0,
   showControl: 0,
   showEffect: 0,
   screenVideo: 0,
};

export const videoReducer = (state, action) => {
   const {
      type,
      payload: { volume, play, showControl, showEffect, screenVideo },
   } = action;

   switch (type) {
      case 'SET_AUTH':
         return {
            ...state,
            volume,
            play,
            showControl,
            showEffect,
            screenVideo,
         };
      default:
         return state;
   }
};
