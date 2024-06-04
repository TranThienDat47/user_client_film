import nProgress from 'nprogress';

nProgress.configure({
   showSpinner: false,
});

export const checkIsStart = () => {
   return !!nProgress.status ? true : false;
};

export const startLoading = () => {
   if (!checkIsStart()) nProgress.start();
};

export const endLoading = () => {
   if (checkIsStart()) nProgress.done();
};
