import ReactHlsPlayer from 'react-hls-player';
import axios from 'axios';
import { apiUrl } from '~/config/constants';

import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import { BsFillPlayFill } from 'react-icons/bs';
import { AiOutlinePause, AiFillSetting } from 'react-icons/ai';
import { MdReplay } from 'react-icons/md';
import { RiVolumeDownFill, RiVolumeUpFill } from 'react-icons/ri';
import { BiSkipPrevious, BiSkipNext, BiExitFullscreen, BiFullscreen } from 'react-icons/bi';
import { IoMdOptions } from 'react-icons/io';
import { IoMdSpeedometer } from 'react-icons/io';
import { FaAngleRight } from 'react-icons/fa';
import { IoMdCheckmark } from 'react-icons/io';

import Menu from '../Popper/Menu';
import Button from '../Button';

const cx = classNames.bind(styles);

const Video = ({
   videoInfo = {
      videoID: '',
      listVideoSrc: [{ videoSrc: '', quality: '' }],
   },
   width,
   height,
}) => {
   const currentStateOfVideoRef = useRef({ width: 0, height: 0, isPlay: 0 });
   const [currentVideoState, setCurrentVideoState] = useState(videoInfo.listVideoSrc[0]);
   const [autoPlayState, setAutoPlayState] = useState(false);

   useEffect(() => {
      if (videoInfo.listVideoSrc.length > 0) {
         setCurrentVideoState(videoInfo.listVideoSrc[0]);

         dataInitQualityRef.current = videoInfo.listVideoSrc.map((element, index) => ({
            title: element.quality,
            left_icon: (
               <div
                  className={cx(
                     'menu-setting_icon-quality',
                     index === 0 && 'menu-setting_icon-quality-active',
                  )}
               >
                  <IoMdCheckmark></IoMdCheckmark>
               </div>
            ),
            onChange: (dataItem) => {
               handleOnChangeQuality({ index: index, quality: element.quality });
            },
         }));

         setDataInitSettingState((prev) =>
            prev.map((element, index) => {
               if (index === 1) {
                  return {
                     ...element,
                     children: {
                        title: (
                           <div style={{ fontSize: '1.5rem' }} className={cx('menu-setting_title')}>
                              Chất lượng
                           </div>
                        ),
                        data: dataInitQualityRef.current,
                     },
                  };
               } else {
                  return element;
               }
            }),
         );

         dataInitSettingRef.current = dataInitSettingState.map((element, index) => {
            if (index === 1) {
               return {
                  ...element,
                  children: {
                     title: (
                        <div style={{ fontSize: '1.5rem' }} className={cx('menu-setting_title')}>
                           Chất lượng
                        </div>
                     ),
                     data: dataInitQualityRef.current,
                  },
               };
            } else {
               return element;
            }
         });
      }
   }, [videoInfo]);

   const currentQualityRef = useRef({
      index: 0,
      quality: `480p`,
   });

   const currentSpeedRef = useRef({
      index: 3,
      speed: 1,
   });

   const handleOnChangeSpeed = ({ index = 3, speed = 1 }) => {
      currentSpeedRef.current = {
         index,
         speed,
      };

      if (videoRef.current) {
         videoRef.current.playbackRate = speed;
      }
      dataInitSettingRef.current = dataInitSettingRef.current.map((element, index) => {
         if (index === 1) {
            return element;
         } else {
            return {
               title: <div className={cx('menu-setting_title')}>Tốc độ phát</div>,
               left_icon: <IoMdSpeedometer className={cx('menu-setting_icon')} />,
               right_icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     {currentSpeedRef.current.speed === 1 ? 'Chuẩn' : currentSpeedRef.current.speed}
                     <FaAngleRight
                        style={{ marginLeft: '6px' }}
                        className={cx('menu-setting_icon')}
                     />
                  </div>
               ),
               children: {
                  title: (
                     <div style={{ fontSize: '1.5rem' }} className={cx('menu-setting_title')}>
                        Tốc độ phát
                     </div>
                  ),
                  data: dataInitSpeedRef.current.map((element, index) => {
                     if (index === currentSpeedRef.current.index) {
                        return {
                           ...element,
                           left_icon: (
                              <div
                                 className={cx(
                                    'menu-setting_icon-time_speed',
                                    'menu-setting_icon-time_speed-active',
                                 )}
                              >
                                 <IoMdCheckmark></IoMdCheckmark>
                              </div>
                           ),
                        };
                     } else {
                        return {
                           ...element,
                           left_icon: (
                              <div className={cx('menu-setting_icon-time_speed')}>
                                 <IoMdCheckmark></IoMdCheckmark>
                              </div>
                           ),
                        };
                     }
                  }),
               },
            };
         }
      });

      setDataInitSettingState(dataInitSettingRef.current);
   };

   const handleOnChangeQuality = ({ index = 3, quality = 'Tự động' }) => {
      if (index !== currentQualityRef.current.index) {
         currentQualityRef.current = {
            index,
            quality,
         };

         setAutoPlayState(false);

         if (screenStateRef.current === 0) {
            currentStateOfVideoRef.current = {
               width: '100%',
               height: videoRef.current.getBoundingClientRect().height,
               isPlay: videoRef.current.paused ? 0 : 1,
            };
         } else {
            currentStateOfVideoRef.current = {
               width: '100%',
               height: 'auto',
               isPlay: videoRef.current.paused ? 0 : 1,
            };
         }

         setCurrentVideoState(
            videoInfo.listVideoSrc.find(
               (element, index) => element.quality === currentQualityRef.current.quality,
            ),
         );

         dataInitSettingRef.current = dataInitSettingRef.current.map((element, index) => {
            if (index === 0) {
               return element;
            } else {
               return {
                  title: <div className={cx('menu-setting_title')}>Chất lượng</div>,
                  left_icon: <IoMdOptions className={cx('menu-setting_icon')} />,
                  right_icon: (
                     <div style={{ display: 'flex', alignItems: 'center' }}>
                        {currentQualityRef.current.quality}
                        <FaAngleRight
                           style={{ marginLeft: '6px' }}
                           className={cx('menu-setting_icon')}
                        />
                     </div>
                  ),
                  children: {
                     title: (
                        <div style={{ fontSize: '1.5rem' }} className={cx('menu-setting_title')}>
                           Chất lượng
                        </div>
                     ),
                     data: dataInitQualityRef.current.map((element, index) => {
                        if (index === currentQualityRef.current.index) {
                           return {
                              ...element,
                              left_icon: (
                                 <div
                                    className={cx(
                                       'menu-setting_icon-quality',
                                       'menu-setting_icon-quality-active',
                                    )}
                                 >
                                    <IoMdCheckmark></IoMdCheckmark>
                                 </div>
                              ),
                           };
                        } else {
                           return {
                              ...element,
                              left_icon: (
                                 <div className={cx('menu-setting_icon-quality')}>
                                    <IoMdCheckmark></IoMdCheckmark>
                                 </div>
                              ),
                           };
                        }
                     }),
                  },
               };
            }
         });
         setDataInitSettingState(dataInitSettingRef.current);
      }
   };

   const dataInitSpeedRef = useRef([
      {
         title: <div className={cx('menu-setting_title')}>0.25</div>,
         left_icon: (
            <div className={cx('menu-setting_icon-time_speed')}>
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 0,
               speed: 0.25,
            });
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>0.5</div>,
         left_icon: (
            <div className={cx('menu-setting_icon-time_speed')}>
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 1,
               speed: 0.5,
            });
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>0.75</div>,
         left_icon: (
            <div className={cx('menu-setting_icon-time_speed')}>
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 2,
               speed: 0.75,
            });
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>Chuẩn</div>,
         left_icon: (
            <div
               className={cx('menu-setting_icon-time_speed', 'menu-setting_icon-time_speed-active')}
            >
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 3,
               speed: 1,
            });
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>1.25</div>,
         left_icon: (
            <div className={cx('menu-setting_icon-time_speed')}>
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 4,
               speed: 1.25,
            });
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>1.5</div>,
         left_icon: (
            <div className={cx('menu-setting_icon-time_speed')}>
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 5,
               speed: 1.5,
            });
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>1.75</div>,
         left_icon: (
            <div className={cx('menu-setting_icon-time_speed')}>
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 6,
               speed: 1.75,
            });
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>2</div>,
         left_icon: (
            <div className={cx('menu-setting_icon-time_speed')}>
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeSpeed({
               index: 7,
               speed: 2,
            });
         },
      },
   ]);

   const dataInitQualityRef = useRef(
      videoInfo.listVideoSrc.map((element, index) => ({
         title: element.quality,
         left_icon: (
            <div
               className={cx(
                  'menu-setting_icon-quality',
                  index === 0 && 'menu-setting_icon-quality-active',
               )}
            >
               <IoMdCheckmark></IoMdCheckmark>
            </div>
         ),
         onChange: (dataItem) => {
            handleOnChangeQuality({ index: index, quality: element.quality });
         },
      })),
      // .concat([
      //    {
      //       title: `Tự động`,
      //       left_icon: (
      //          <div
      //             className={cx('menu-setting_icon-quality', 'menu-setting_icon-quality-active')}
      //          >
      //             <IoMdCheckmark></IoMdCheckmark>
      //          </div>
      //       ),
      //       onChange: (dataItem) => {
      //          handleOnChangeQuality({
      //             index: videoInfo.listVideoSrc.length + 1,
      //             quality: 'Tự động',
      //          });
      //       },
      //    },
      // ]),
   );

   const [dataInitSettingState, setDataInitSettingState] = useState([
      {
         title: <div className={cx('menu-setting_title')}>Tốc độ phát</div>,
         left_icon: <IoMdSpeedometer className={cx('menu-setting_icon')} />,
         right_icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
               Chuẩn
               <FaAngleRight style={{ marginLeft: '6px' }} className={cx('menu-setting_icon')} />
            </div>
         ),
         children: {
            title: (
               <div style={{ fontSize: '1.5rem' }} className={cx('menu-setting_title')}>
                  Tốc độ phát
               </div>
            ),
            data: dataInitSpeedRef.current,
         },
      },
      {
         title: <div className={cx('menu-setting_title')}>Chất lượng</div>,
         left_icon: <IoMdOptions className={cx('menu-setting_icon')} />,
         right_icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
               Tự động
               <FaAngleRight style={{ marginLeft: '6px' }} className={cx('menu-setting_icon')} />
            </div>
         ),
         children: {
            title: (
               <div style={{ fontSize: '1.5rem' }} className={cx('menu-setting_title')}>
                  Chất lượng
               </div>
            ),
            data: dataInitQualityRef.current,
         },
      },
   ]);

   useEffect(() => {
      if (!dragVideoRef.current) {
         if (videoRef.current) videoRef.current.currentTime = tempCurrentTimeRef.current;

         // if (currentStateOfVideoRef.current.height > 0) {
         // videoRef.current.style.height = currentStateOfVideoRef.current.height + 'px';
         // }

         if (currentStateOfVideoRef.current.isPlay === 1) {
            videoRef.current.play();
         }
      }

      return () => {
         clearInterval(curIntervalRef.current);
      };
   }, [currentVideoState, autoPlayState]);

   const dataInitSettingRef = useRef(dataInitSettingState);

   const prevStateShowControlVideo = useRef(0);

   const modalVideoRef = useRef();
   const watchRef = useRef();
   const wrapperVideoRef = useRef();
   const videoRef = useRef();
   const watchControlRef = useRef();
   const modalControlRef = useRef();

   const timeDurationRef = useRef();
   const timeCurrentRef = useRef();

   const tempCurrentTimeRef = useRef(0.0);

   const isEndedRef = useRef(false);

   const previewListRef = useRef([]);
   const modalPreviewRef = useRef();
   const videoPreviewRef = useRef(0);

   const focusVideoRef = useRef(false);
   const hoverProgress = useRef(false);

   const cur_play_pause_Ref = useRef(false);
   const play_pause_Ref = useRef();

   const curImgWrapperRef = useRef();
   const curImgRef = useRef();
   const curTimeImgRef = useRef();

   const effectPlayRef = useRef();

   const volumeCurRef = useRef(1);
   const volumeRef = useRef();
   const volumeClrearRef = useRef();
   const prevVolumeRef = useRef({
      step: 2,
      move: 1,
   });
   const ballVolumeRef = useRef();

   const tempBufferedRef = useRef(0);

   const dragVideoRef = useRef(false);
   const dragVolumeRef = useRef(false);

   const progressRefRef = useRef();
   const progressBuffered = useRef();
   const progressCurrent = useRef();
   const progressBall = useRef();
   const mainProgressfRef = useRef();
   const progressBallMain = useRef();

   const volumeProgressRef = useRef();
   const volumeProgressMainRef = useRef();
   const volumeProgressBallRef = useRef();
   const volumeProgressCurrentRef = useRef();

   const curIntervalRef = useRef();

   const screenStateRef = useRef(0);
   const screenRef = useRef();

   const [canPlayState, setCanPlayState] = useState(false);

   const [volume, setVolume] = useState(2);
   const [screenVideo, setScreenVideo] = useState(0);
   const [showEffectRef, setShowEffectRef] = useState(0);
   const [showControl, setShowControl] = useState(2); // 0 hide, 1 time, 2 full show
   const [play, setPlay] = useState(0); // 1 is play; 2 is ended; 0 is pause

   const [showSetting, setShowSetting] = useState(false);

   const convertTime = (time) => {
      if (!isNaN(+time)) {
         const date = new Date(null);

         date.setSeconds(time);

         var result;

         if (+time > 3600) result = date.toISOString().slice(11, 19);
         else result = date.toISOString().slice(14, 19);

         if (result[0] === '0') result = result.slice(1, result.length);

         return result;
      } else {
         return 0;
      }
   };

   const handlePlayAndPaus = (e) => {
      e.preventDefault();
      if (videoRef.current && videoRef.current.paused) {
         setShowEffectRef(1);
      } else {
         setShowEffectRef(2);
      }

      if (play === 1) {
         setPlay(0);
      } else {
         setPlay(1);
      }
   };

   const handleAutoProgress = () => {
      if (videoRef.current) {
         const widthProgress = progressRefRef.current.getBoundingClientRect().width;

         setTimeout(() => {
            curIntervalRef.current = setInterval(() => {
               let moveProgress = videoRef.current.currentTime / videoRef.current.duration;
               console.log(moveProgress);

               if (moveProgress > 1) {
                  moveProgress = 1;
               } else if (moveProgress < 0) {
                  moveProgress = 0;
               }

               tempCurrentTimeRef.current = videoRef.current.currentTime;

               progressCurrent.current.style.transform = `scaleX(${moveProgress})`;
               progressBall.current.style.transform = `translateX(calc(${
                  moveProgress * 100
               }% - var(--size-ball-progress) / 2))`;
            }, (videoRef.current.duration * 650) / widthProgress);
         });
      }
   };

   const handleMoveProgress = useCallback((e) => {
      const leftProgress = progressRefRef.current.getBoundingClientRect().left;
      const widthProgress = progressRefRef.current.getBoundingClientRect().width;

      let moveProgress = (e.clientX - leftProgress) / widthProgress;

      if (moveProgress > 1) {
         moveProgress = 1;

         tempCurrentTimeRef.current = moveProgress * (videoRef.current.duration - 0.001);

         timeCurrentRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;
         curTimeImgRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;

         progressCurrent.current.style.transform = `scaleX(${moveProgress})`;
         progressBall.current.style.transform = `translateX(calc(${
            moveProgress * 100
         }% - var(--size-ball-progress) / 2))`;

         return;
      } else if (moveProgress < 0) {
         moveProgress = 0;
      }

      tempCurrentTimeRef.current = moveProgress * videoRef.current.duration;
      timeCurrentRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;
      curTimeImgRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;

      progressCurrent.current.style.transform = `scaleX(${moveProgress})`;
      progressBall.current.style.transform = `translateX(calc(${
         moveProgress * 100
      }% - var(--size-ball-progress) / 2))`;
   }, []);

   const handlePreviewVideo = useCallback((e) => {
      curImgWrapperRef.current.style.display = 'block';

      const leftProgress = progressRefRef.current.getBoundingClientRect().left;
      const widthProgress = progressRefRef.current.getBoundingClientRect().width;

      let moveProgress = (e.clientX - leftProgress) / widthProgress;

      videoPreviewRef.current = moveProgress * videoRef.current.duration;

      curImgWrapperRef.current.style.transform = `translateX(calc(${moveProgress * 100}% - ${
         144 / 2
      }px))`;

      if (
         curImgRef.current.getBoundingClientRect().left <=
         progressRefRef.current.getBoundingClientRect().left
      ) {
         curImgWrapperRef.current.style.transform = `translateX(0)`;
      } else if (
         curImgRef.current.getBoundingClientRect().right >=
         progressRefRef.current.getBoundingClientRect().right
      ) {
         curImgWrapperRef.current.style.transform = `translateX(calc(${100}% - 144px))`;
      }

      if (videoPreviewRef.current <= 0) {
         videoPreviewRef.current = 0;
      } else if (videoPreviewRef.current >= videoRef.current.duration) {
         videoPreviewRef.current = videoRef.current.duration;
      }

      previewListRef.current.find((element) => {
         if (element.timemark >= videoPreviewRef.current) {
            curImgRef.current.style.backgroundImage = `url('data:image/jpeg;base64,${element.image}')`;
            if (dragVideoRef.current) {
               modalPreviewRef.current.style.visibility = 'visible';
               modalPreviewRef.current.style.backgroundImage = `url('data:image/jpeg;base64,${element.image}')`;
            }
            return true;
         }
         return false;
      });

      curTimeImgRef.current.innerHTML = `${convertTime(videoPreviewRef.current)}`;
   }, []);

   const handleMousUpProgress = () => {
      if (dragVideoRef.current) {
         curImgWrapperRef.current.style.display = 'none';

         if (cur_play_pause_Ref.current || isEndedRef.current) {
            setPlay(1);
            videoRef.current.play();
         }

         modalPreviewRef.current.style.visibility = 'hidden';

         videoRef.current.currentTime = tempCurrentTimeRef.current;

         // if (
         //    videoRef.current.buffered.end(tempBufferedRef.current) < videoRef.current.currentTime ||
         //    videoRef.current.buffered.start(tempBufferedRef.current) > videoRef.current.currentTime
         // ) {
         if (videoRef.current.buffered && videoRef.current.buffered.length > 0) {
            for (let i = 0; i < videoRef.current.buffered.length; i++) {
               if (
                  videoRef.current.buffered.start(i) <= videoRef.current.currentTime &&
                  videoRef.current.buffered.end(i) >= videoRef.current.currentTime
               ) {
                  tempBufferedRef.current = i;
                  progressBuffered.current.style.transform = `scaleX(${
                     videoRef.current.buffered.end(i) / videoRef.current.duration
                  })`;
                  break;
               }
            }
         }
         // }

         if (!hoverProgress.current) {
            mainProgressfRef.current.style.transform = 'scaleY(0.5)';
            progressBall.current.style.visibility = 'hidden';
            progressBallMain.current.style.height = '2px';
            progressBallMain.current.style.width = '2px';

            progressCurrent.current.style.transition = `transform 0.1s cubic-bezier(0, 0, 0.2, 1),
      -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1)`;
            progressBall.current.style.transition = `transform 0.1s cubic-bezier(0, 0, 0.2, 1),
      -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1)`;
         }

         dragVideoRef.current = false;
      }
   };

   const handleMouseMoveProgress = useCallback(
      (e) => {
         if (dragVideoRef.current) {
            handleMoveProgress(e);
            handlePreviewVideo(e);
         }
      },
      [handleMoveProgress, handlePreviewVideo],
   );

   const handleVolumeChange = useCallback(() => {
      if (volume === 0) {
         volumeProgressCurrentRef.current.style.transform = `scaleX(${prevVolumeRef.current.move})`;
         volumeProgressBallRef.current.style.transform = `translateX(calc(${
            prevVolumeRef.current.move * 100
         }% + var(--size-ball-progress) / -2))`;
         volumeClrearRef.current.children[0].style.height = '0%';

         setVolume(prevVolumeRef.current.step);
      } else {
         volumeProgressCurrentRef.current.style.transform = `scaleX(0)`;
         volumeProgressBallRef.current.style.transform = `translateX(calc(var(--size-ball-progress) / -2))`;
         volumeClrearRef.current.children[0].style.height = '100%';
         if (prevVolumeRef.current.step === 0) {
            prevVolumeRef.current.step = 2;
         }
         setVolume(0);
      }
   }, [volume]);

   const handleMouseUpVolume = () => {
      if (dragVolumeRef.current) {
         dragVolumeRef.current = false;
      }
   };

   const handleMouseMoveVolume = (e) => {
      if (dragVolumeRef.current) {
         const leftVolume = volumeProgressRef.current.getBoundingClientRect().left;
         const widthVolumeBall = ballVolumeRef.current.getBoundingClientRect().width;
         const widthVolume =
            volumeProgressRef.current.getBoundingClientRect().width - widthVolumeBall;

         let moveVolume = (e.clientX - leftVolume - widthVolumeBall / 2) / widthVolume;

         if (moveVolume < 0) {
            moveVolume = 0;
            setVolume(0);
            prevVolumeRef.current.step = 0;
         } else if (moveVolume < 0.5 && moveVolume > 0) {
            setVolume(1);
            prevVolumeRef.current.step = 1;
         } else if (moveVolume > 0.5) {
            setVolume(2);
            prevVolumeRef.current.step = 2;
         }

         if (moveVolume > 1) {
            moveVolume = 1;
         }

         prevVolumeRef.current.move = moveVolume;

         volumeCurRef.current = moveVolume;
         videoRef.current.volume = moveVolume;

         volumeProgressCurrentRef.current.style.transform = `scaleX(${moveVolume})`;
         volumeProgressBallRef.current.style.transform = `translateX(calc(${
            moveVolume * 100
         }% + var(--size-ball-progress) / -2))`;
      }
   };

   const handleKeyMoveProgress = (e) => {
      if (e.keyCode === 39) {
         tempCurrentTimeRef.current = tempCurrentTimeRef.current + 5;
         let moveProgress = tempCurrentTimeRef.current / videoRef.current.duration;

         if (moveProgress >= 1) {
            moveProgress = 1;

            tempCurrentTimeRef.current = videoRef.current.duration;

            timeCurrentRef.current.innerHTML = `${convertTime(videoRef.current.duration)}`;
            curTimeImgRef.current.innerHTML = `${convertTime(videoRef.current.duration)}`;

            progressCurrent.current.style.transform = `scaleX(${moveProgress})`;
            progressBall.current.style.transform = `translateX(calc(${
               moveProgress * 100
            }% - var(--size-ball-progress) / 2))`;

            videoRef.current.currentTime = videoRef.current.duration;

            return;
         } else if (moveProgress < 0) {
            moveProgress = 0;
            tempCurrentTimeRef.current = 0;
         }

         timeCurrentRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;
         curTimeImgRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;

         progressCurrent.current.style.transform = `scaleX(${moveProgress})`;
         progressBall.current.style.transform = `translateX(calc(${
            moveProgress * 100
         }% - var(--size-ball-progress) / 2))`;

         videoRef.current.currentTime = tempCurrentTimeRef.current;
      }

      if (e.keyCode === 37) {
         tempCurrentTimeRef.current -= 5;
         let moveProgress = tempCurrentTimeRef.current / videoRef.current.duration;

         if (moveProgress >= 1) {
            moveProgress = 1;

            tempCurrentTimeRef.current = videoRef.current.duration;

            timeCurrentRef.current.innerHTML = `${convertTime(videoRef.current.duration)}`;
            curTimeImgRef.current.innerHTML = `${convertTime(videoRef.current.duration)}`;

            progressCurrent.current.style.transform = `scaleX(${moveProgress})`;
            progressBall.current.style.transform = `translateX(calc(${
               moveProgress * 100
            }% - var(--size-ball-progress) / 2))`;

            videoRef.current.currentTime = videoRef.current.duration;

            return;
         } else if (moveProgress < 0) {
            moveProgress = 0;
            tempCurrentTimeRef.current = 0;
         }

         timeCurrentRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;
         curTimeImgRef.current.innerHTML = `${convertTime(tempCurrentTimeRef.current)}`;

         progressCurrent.current.style.transform = `scaleX(${moveProgress})`;
         progressBall.current.style.transform = `translateX(calc(${
            moveProgress * 100
         }% - var(--size-ball-progress) / 2))`;

         videoRef.current.currentTime = tempCurrentTimeRef.current;

         if (isEndedRef.current) {
            setPlay(1);
         }
      }
   };

   const handleKeyVolume = (e) => {
      if (focusVideoRef.current || screenStateRef.current === 1) {
         if (e.keyCode === 38) {
            e.preventDefault();

            volumeCurRef.current += 0.05;

            if (volumeCurRef.current >= 1) {
               volumeCurRef.current = 1;
            }

            if (volumeCurRef.current < 0.5 && volumeCurRef.current > 0) {
               setVolume(1);
            } else if (volumeCurRef.current > 0.5) {
               setVolume(2);
            }

            videoRef.current.volume = volumeCurRef.current;

            volumeProgressCurrentRef.current.style.transform = `scaleX(${volumeCurRef.current})`;
            volumeProgressBallRef.current.style.transform = `translateX(calc(${
               volumeCurRef.current * 100
            }% + var(--size-ball-progress) / -2))`;
         }

         if (e.keyCode === 40) {
            e.preventDefault();

            volumeCurRef.current -= 0.05;

            if (volumeCurRef.current < 0) {
               volumeCurRef.current = 0;
               setVolume(0);
            } else if (volumeCurRef.current < 0.5 && volumeCurRef.current > 0) {
               setVolume(1);
            } else if (volumeCurRef.current > 0.5) {
               setVolume(2);
            }

            videoRef.current.volume = volumeCurRef.current;

            volumeProgressCurrentRef.current.style.transform = `scaleX(${volumeCurRef.current})`;
            volumeProgressBallRef.current.style.transform = `translateX(calc(${
               volumeCurRef.current * 100
            }% + var(--size-ball-progress) / -2))`;
         }
      }
   };

   useEffect(() => {
      if (volume === 0) {
         videoRef.current.volume = 0;
         volumeClrearRef.current.children[0].style.height = '100%';

         volumeProgressCurrentRef.current.style.transform = `scaleX(0)`;
         volumeProgressBallRef.current.style.transform = `translateX(calc(0% + var(--size-ball-progress) / -2))`;
      } else {
         videoRef.current.volume = volumeCurRef.current;
         volumeClrearRef.current.children[0].style.height = '0%';

         volumeProgressCurrentRef.current.style.transform = `scaleX(${volumeCurRef.current})`;
         volumeProgressBallRef.current.style.transform = `translateX(calc(${
            volumeCurRef.current * 100
         }% + var(--size-ball-progress) / -2))`;
      }

      volumeRef.current.onclick = handleVolumeChange;

      volumeRef.current.onkeyup = (e) => {
         e.preventDefault();
      };

      volumeRef.current.onmouseenter = () => {
         volumeProgressRef.current.style.width = 'calc(54px + var(--size-ball-progress))';
      };

      volumeProgressRef.current.onmouseenter = () => {
         volumeProgressRef.current.style.width = 'calc(54px + var(--size-ball-progress))';
      };

      volumeRef.current.onmouseleave = () => {
         if (!dragVolumeRef.current) volumeProgressRef.current.style.width = '0';
      };

      volumeProgressRef.current.onmouseleave = () => {
         if (!dragVolumeRef.current) volumeProgressRef.current.style.width = '0';
      };
   }, [volume, handleVolumeChange]);

   useEffect(() => {
      if (currentVideoState.videoSrc) {
         videoRef.current.ontimeupdate = () => {
            if (videoRef.current && videoRef.current.currentTime)
               timeCurrentRef.current.innerHTML = `${convertTime(videoRef.current.currentTime)}`;

            if (videoRef.current && !videoRef.current.paused) setPlay(1);
         };

         const loadThumbnail = async () => {
            const response = await axios.get(`${apiUrl}/video/thumbnail/${videoInfo.videoID}`);

            response.data.thumbnails.forEach((element) => {
               previewListRef.current = previewListRef.current.concat(element);
            });

            previewListRef.current = previewListRef.current.sort((a, b) => a.timemark - b.timemark);
         };
         loadThumbnail();
      }
   }, [currentVideoState]);

   const handleScreen = (e) => {
      if (screenStateRef.current === 0) {
         setScreenVideo(1);
      } else if (screenStateRef.current === 1) {
         setScreenVideo(0);
      }
   };

   useEffect(() => {
      if (screenVideo === 1) {
         screenStateRef.current = 1;

         // videoRef.current.style.height = 'auto';

         if (wrapperVideoRef.current.requestFullscreen) {
            wrapperVideoRef.current.requestFullscreen();
         } else if (wrapperVideoRef.current.webkitRequestFullscreen) {
            /* Safari */
            wrapperVideoRef.current.webkitRequestFullscreen();
         } else if (wrapperVideoRef.current.msRequestFullscreen) {
            /* IE11 */
            wrapperVideoRef.current.msRequestFullscreen();
         }
      } else {
         screenStateRef.current = 0;

         if (document.fullscreenElement) {
            if (document.exitFullscreen) {
               document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
               document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
               document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
               window.top.document.msExitFullscreen();
            }
         }
      }
   }, [screenVideo]);

   useEffect(() => {
      screenRef.current.onclick = (e) => handleScreen(e);
   }, []);

   useEffect(() => {
      let uniqueTime;

      if (showControl === 0) {
         modalControlRef.current.style.opacity = '0';
         watchControlRef.current.style.opacity = '0';
      } else if (showControl === 1) {
         modalControlRef.current.style.opacity = '1';
         watchControlRef.current.style.opacity = '1';

         uniqueTime = setTimeout(() => {
            setShowControl(0);
         }, 3169);
      } else {
         modalControlRef.current.style.opacity = '1';
         watchControlRef.current.style.opacity = '1';
      }

      watchRef.current.onmousemove = () => {
         if (
            !videoRef.current.paused &&
            !dragVideoRef.current &&
            !dragVolumeRef.current &&
            !hoverProgress.current &&
            !showSetting
         ) {
            setShowControl(1);
         } else setShowControl(2);
      };

      watchRef.current.onclick = () => {
         if (!videoRef.current.paused && showSetting) {
            setShowControl(1);
         } else setShowControl(2);
      };

      return () => {
         clearTimeout(uniqueTime);
      };
   }, [showControl, play]);

   useEffect(() => {
      videoRef.current.oncanplay = () => {
         setAutoPlayState(true);
      };

      videoRef.current.onloadeddata = () => {
         videoRef.current.play();
      };

      videoRef.current.onplay = () => {
         setPlay(1);
         handleAutoProgress();
         isEndedRef.current = false;
      };
   }, [canPlayState]);

   useEffect(() => {
      play_pause_Ref.current.onclick = (e) => {
         handlePlayAndPaus(e);
      };

      videoRef.current.onclick = (e) => {
         handlePlayAndPaus(e);
      };

      videoRef.current.ondblclick = (e) => {
         handleScreen(e);
      };

      modalControlRef.current.onclick = (e) => {
         handlePlayAndPaus(e);
      };

      modalControlRef.current.ondblclick = (e) => {
         handleScreen(e);
      };

      if (effectPlayRef.current) {
         effectPlayRef.current.onclick = (e) => {
            handlePlayAndPaus(e);
         };

         effectPlayRef.current.ondblclick = (e) => {
            handleScreen(e);
         };
      }

      videoRef.current.oncanplay = (e) => {
         timeDurationRef.current.innerHTML = `${convertTime(videoRef.current.duration)}`;

         progressBuffered.current.style.transform = `scaleX(${
            videoRef.current.buffered.end(tempBufferedRef.current) / videoRef.current.duration
         })`;
      };

      videoRef.current.onpause = (e) => {
         isEndedRef.current = false;
      };

      videoRef.current.onended = (e) => {
         setPlay(2);

         isEndedRef.current = true;

         setShowControl(2);
      };

      if (play === 1) {
         videoRef.current.play();
      } else if (play === 0) {
         videoRef.current.pause();
         clearInterval(curIntervalRef.current);
      }

      return () => {
         clearInterval(curIntervalRef.current);
      };

      // eslint-disable-next-line
   }, [play]);

   useEffect(() => {
      videoRef.current.onkeydown = (e) => {
         handleKeyVolume(e);
      };

      window.onkeydown = (e) => {
         if (e.keyCode === 32) {
            handlePlayAndPaus(e);
            if (videoRef.current.paused && showSetting) {
               setShowControl(1);
            } else setShowControl(2);
         }

         if (e.keyCode === 70) {
            handleScreen();
         }

         if (e.keyCode === 77) {
            if (volume !== 0) {
               setVolume(0);
            } else {
               if (prevVolumeRef.current.step === 0 || prevVolumeRef.current.move === 0) {
                  prevVolumeRef.current.step = 2;
                  prevVolumeRef.current.move = 1;
               }
               volumeCurRef.current = prevVolumeRef.current.move;
               setVolume(prevVolumeRef.current.step);
            }
         }
         handleKeyMoveProgress(e);
      };
   }, [volume, play]);

   useEffect(() => {
      progressRefRef.current.onmousemove = (e) => {
         handlePreviewVideo(e);
      };

      progressRefRef.current.onmouseover = (e) => {
         mainProgressfRef.current.style.transform = 'scaleY(1)';
         progressBall.current.style.visibility = 'visible';
         progressBallMain.current.style.height = '14px';
         progressBallMain.current.style.width = '14px';

         if (!curImgWrapperRef.current.contains(e.target))
            curImgWrapperRef.current.style.display = 'block';
         else if (!dragVideoRef.current) curImgWrapperRef.current.style.display = 'none';

         hoverProgress.current = true;
      };

      progressRefRef.current.onmouseleave = (e) => {
         if (!dragVideoRef.current) {
            mainProgressfRef.current.style.transform = 'scaleY(0.5)';
            progressBall.current.style.visibility = 'hidden';
            progressBallMain.current.style.height = '2px';
            progressBallMain.current.style.width = '2px';
         }

         curImgWrapperRef.current.style.display = 'none';

         hoverProgress.current = false;
      };

      volumeProgressRef.current.onmousedown = (e) => {
         dragVolumeRef.current = true;
         handleMouseMoveVolume(e);
      };

      progressRefRef.current.onmousedown = (e) => {
         dragVideoRef.current = true;

         clearTimeout(curIntervalRef.current);

         progressCurrent.current.style.transition = `none`;
         progressBall.current.style.transition = `none`;

         if (!videoRef.current.paused) cur_play_pause_Ref.current = true;
         else cur_play_pause_Ref.current = false;

         videoRef.current.pause();

         handleMoveProgress(e);
         handlePreviewVideo(e);
      };

      document.onmousemove = (e) => {
         handleMouseMoveProgress(e);
         handleMouseMoveVolume(e);
      };

      videoRef.current.onprogress = () => {
         if (videoRef.current.buffered.length > tempBufferedRef.current) {
            // if (
            //    videoRef.current.buffered.end(tempBufferedRef.current) <
            //       videoRef.current.currentTime ||
            //    videoRef.current.buffered.start(tempBufferedRef.current) >
            //       videoRef.current.currentTime
            // ) {
            if (videoRef.current.buffered && videoRef.current.buffered.length > 0) {
               for (let i = 0; i < videoRef.current.buffered.length; i++) {
                  if (
                     videoRef.current.buffered.start(i) <= videoRef.current.currentTime &&
                     videoRef.current.buffered.end(i) >= videoRef.current.currentTime
                  ) {
                     tempBufferedRef.current = i;
                     progressBuffered.current.style.transform = `scaleX(${
                        videoRef.current.buffered.end(i) / videoRef.current.duration
                     })`;
                     break;
                  }
               }
            }

            // }
         }
      };

      document.onmouseup = (e) => {
         if (dragVideoRef.current || dragVolumeRef.current) {
            setTimeout(() => {
               if (!watchRef.current.contains(e.target) && !showSetting) {
                  if (!videoRef.current.paused) setShowControl(0);
               } else setShowControl(1);
            }, 0);
         }

         handleMouseUpVolume();
         handleMousUpProgress();

         if (watchRef.current && watchRef.current.contains(e.target)) {
            focusVideoRef.current = true;
         } else focusVideoRef.current = false;
      };
   }, [handleMouseMoveProgress, handleMoveProgress, handlePreviewVideo]);

   useEffect(() => {
      watchRef.current.onmouseleave = () => {
         if (
            !videoRef.current.paused &&
            !dragVideoRef.current &&
            !dragVolumeRef.current &&
            !hoverProgress.current &&
            !showSetting
         ) {
            setShowControl(0);
         } else setShowControl(2);
      };

      if (showSetting) {
         prevStateShowControlVideo.current = showControl;
         setShowControl(2);
         modalVideoRef.current.style.zIndex = 0;
      } else {
         if (prevStateShowControlVideo.current === 1) prevStateShowControlVideo.current = 0;
         setShowControl(prevStateShowControlVideo.current);
         modalVideoRef.current.style.zIndex = -1;
      }
   }, [showSetting]);

   return (
      <div style={{ position: 'relative' }}>
         <div ref={watchRef} className={cx('wrapper')}>
            <div ref={wrapperVideoRef} className={cx('watch')}>
               <div className={cx('wrapper-video')}>
                  <ReactHlsPlayer
                     src={`http://localhost:5000/api/video/stream/${currentVideoState.videoSrc}?mode=m3u8`}
                     autoPlay={autoPlayState}
                     controls={false}
                     width="100%"
                     height="auto"
                     playerRef={videoRef}
                     tabIndex="0"
                  />
               </div>
               <div ref={modalPreviewRef} className={cx('modal-previews')}></div>
               <div
                  ref={modalVideoRef}
                  className={cx('modal-video')}
                  onClick={(e) => {
                     e.preventDefault();
                     e.target.style.zIndex = -1;
                  }}
               ></div>
               <div ref={watchControlRef} className={cx('watch-controls')}>
                  <div ref={progressRefRef} className={cx('progress')}>
                     <div ref={mainProgressfRef} className={cx('progress-main')}>
                        <div ref={progressBuffered} className={cx('progress-buffered')}></div>
                        <div ref={progressCurrent} className={cx('progress-current')}></div>
                     </div>
                     <div ref={progressBall} className={cx('progress-ball__wrapper')}>
                        <div ref={progressBallMain} className={cx('progress-ball')}></div>
                     </div>
                     <div ref={curImgWrapperRef} className={cx('wrapper__progress-img')}>
                        <div ref={curImgRef} className={cx('progress-img')}>
                           <span ref={curTimeImgRef} className={cx('progress-time_img')}>
                              0:00
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className={cx('icon')}>
                     <div className={cx('inner-icon', 'left')}>
                        <button type="button" className={cx('btn-prev')}>
                           <BiSkipPrevious />
                        </button>
                        <button ref={play_pause_Ref} type="button" className={cx('btn-player')}>
                           {play === 0 ? (
                              <BsFillPlayFill />
                           ) : play === 1 ? (
                              <AiOutlinePause />
                           ) : (
                              <MdReplay />
                           )}
                        </button>
                        <button type="button" className={cx('btn-next')}>
                           <BiSkipNext />
                        </button>
                        <button ref={volumeRef} type="button" className={cx('btn-volume')}>
                           {volume === 0 ? (
                              <div className={cx('none-volume')}>
                                 <RiVolumeUpFill />
                              </div>
                           ) : volume === 1 ? (
                              <RiVolumeDownFill style={{ transform: 'translateX(-3.5px)' }} />
                           ) : (
                              <RiVolumeUpFill />
                           )}
                           <div ref={volumeClrearRef} className={cx('none-volume-clear')}>
                              <div></div>
                           </div>
                        </button>

                        <div ref={volumeProgressRef} className={cx('volume-progress')}>
                           <div>
                              <div
                                 ref={volumeProgressMainRef}
                                 className={cx('volume-progress__main')}
                              >
                                 <div
                                    ref={volumeProgressCurrentRef}
                                    className={cx('volume-progress__current')}
                                 ></div>
                              </div>
                              <div
                                 ref={volumeProgressBallRef}
                                 className={cx('volume-progress__ball-wrapper')}
                              >
                                 <div
                                    ref={ballVolumeRef}
                                    className={cx('volume-progress__ball')}
                                 ></div>
                              </div>
                           </div>
                        </div>

                        <div className={cx('timeStamp')}>
                           <span ref={timeCurrentRef} className={cx('timeCurrent')}>
                              0:00
                           </span>
                           <span className={cx('timeSeparator')}> / </span>
                           <span ref={timeDurationRef} className={cx('timeDuration')}>
                              0:00
                           </span>
                        </div>
                     </div>
                     <div className={cx('inner-icon', 'right')}>
                        <div
                           onClick={(e) => {
                              if (!showSetting) {
                                 setShowSetting(true);
                              }
                           }}
                        >
                           <Menu
                              width="269px"
                              placement={'top-end'}
                              items={dataInitSettingState}
                              key={dataInitSettingState}
                              hideOnClick={true}
                              titleOnBack
                              onHideRender={(e) => {
                                 if (showSetting) {
                                    setShowSetting(false);
                                 }
                              }}
                              className={cx('wrapper-setting')}
                              darkMode
                              offset={[66, 23]}
                              onChange={(e) => {
                                 if (e.onChange) e.onChange();
                              }}
                           >
                              <Button
                                 key="setting1"
                                 className={cx('btn_setting', 'tooltip')}
                                 transparent
                                 name-tooltip="Cài đặt"
                              >
                                 <AiFillSetting className={cx('icon_setting')} />
                              </Button>
                           </Menu>
                        </div>

                        <button ref={screenRef} className={cx('btn_full-screen')}>
                           {screenVideo === 0 ? <BiFullscreen /> : <BiExitFullscreen />}
                        </button>
                     </div>
                  </div>
               </div>
               <div ref={modalControlRef} className={cx('modal-control')}></div>
               <div ref={effectPlayRef}>
                  {showEffectRef === 2 ? (
                     <div className={cx('effect', 'effect-play')}>
                        <BsFillPlayFill />
                     </div>
                  ) : showEffectRef === 1 ? (
                     <div className={cx('effect', 'effect-pause')}>
                        <AiOutlinePause />
                     </div>
                  ) : (
                     <></>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Video;
