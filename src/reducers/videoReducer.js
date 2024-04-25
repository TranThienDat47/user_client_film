export const init = {
   volume: 2,
   play: 0,
   showControl: 0,
   showEffect: 0,
   screenVideo: 0,
};

const cases = [
   {
      type: 'SET_AUTH',
      returnData: (state, { volume, play, showControl, showEffect, screenVideo }) => ({
         ...state,
         volume,
         play,
         showControl,
         showEffect,
         screenVideo,
      }),
   },
];

export const videoReducer = (state, action) => {
   const selectedCase = cases.find((item) => item.type === action.type);

   if (selectedCase) {
      return selectedCase.returnData(state, action.payload);
   } else {
      return state;
   }
};
