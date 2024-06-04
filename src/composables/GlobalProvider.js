import { useState, createContext, useEffect, useRef } from 'react';
import CategoriesService from '~/services/CategoriesService';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
   const [isLoadFull, setIsLoadFull] = useState(false);
   // const [isReadyPage, setIsReadyPage] = useState(false);
   let isReadyPage = useRef(true);
   const [prevPage, setPrevPage] = useState(null);

   const [categoriesData, setCategoriesData] = useState(null);

   useEffect(() => {
      CategoriesService.getAll().then((res) => {
         loadCategoriesData(res.categories);
      });
   }, []);

   const setLoadFull = (state) => {
      setIsLoadFull(state);
   };

   const loadPrevPage = (state) => {
      setPrevPage(state);
   };

   const loadReadyPage = (state) => {
      // setIsReadyPage(state);
      isReadyPage.current = state;
   };

   const loadCategoriesData = (state) => {
      setCategoriesData(state);
   };

   return (
      <GlobalContext.Provider
         value={{
            setLoadFull,
            isLoadFull,
            loadPrevPage,
            prevPage,
            loadReadyPage,
            isReadyPage: isReadyPage.current,
            loadCategoriesData,
            categoriesData,
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};
