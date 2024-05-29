import { useState, createContext } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
   const [isLoadFull, setIsLoadFull] = useState(false);
   const [prevPage, setPrevPage] = useState(false);

   const setLoadFull = (state) => {
      setIsLoadFull(state);
   };

   const loadPrevPage = (state) => {
      setPrevPage(state);
   };

   return (
      <GlobalContext.Provider value={{ setLoadFull, isLoadFull, loadPrevPage, prevPage }}>
         {children}
      </GlobalContext.Provider>
   );
};
