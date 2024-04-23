import { createContext, useReducer, useEffect, useState } from 'react';

import { productReducer, initialState } from '~/reducers/productReducer';

import ProductServices from '~/services/ProductServices';

import {
   fetchNewProductsSuccess,
   fetchSuggestedProductsFailure,
   fetchSuggestedProductsRequest,
   fetchSuggestedProductsSuccess,
   fetchSearchResultProductsRequest,
   fetchSearchResultProductsSuccess,
   fetchSearchResultProductsFailure,
   setKeySearchProduct,
   setTeampSelectSearchResult,
   fetchRecommendProductsRequest,
   fetchRecommendProductsSuccess,
   fetchRecommendProductsFailure,
} from '../actionCreators/product';

const ProductContext = createContext();

export { ProductContext };

const LENGTH_PAGE_SUGGESTED = 14;
const LENGTH_PAGE_SEARCH = 9;
const LENGTH_PAGE_RECOMMEND = 7;

const ProductContextProvider = ({ children }) => {
   const [productState, dispatch] = useReducer(productReducer, initialState);

   const loadTempSelectSearchResult = async (tempSelectSearchResult) => {
      dispatch(setTeampSelectSearchResult({ tempSelectSearchResult }));
   };

   const loadKeySearch = async (keySearch) => {
      dispatch(setKeySearchProduct({ keySearch }));
   };

   const beforeLoadHomeSuggested = async () => {
      dispatch(fetchSuggestedProductsRequest());
   };

   const beforeLoadSearchResult = async () => {
      console.log('haha');
      dispatch(fetchSearchResultProductsRequest());
   };
   const beforeLoadReCommendProduct = async () => {
      dispatch(fetchRecommendProductsRequest());
   };

   const loadSearchResult = async (page) => {
      const response = await ProductServices.search({
         skip: page * LENGTH_PAGE_SEARCH,
         limit: LENGTH_PAGE_SEARCH,
         key: productState.keySearch,
      });

      if (response.success) {
         if (response.products.length >= LENGTH_PAGE_SEARCH) {
            dispatch(
               fetchSearchResultProductsSuccess({
                  searchResultProducts: response.products,
                  hasMore: true,
                  pageSearchResultProducts: page,
               }),
            );
         } else if (response.products.length > 0 && response.products.length < LENGTH_PAGE_SEARCH) {
            dispatch(
               fetchSearchResultProductsSuccess({
                  searchResultProducts: response.products,
                  hasMore: false,
                  pageSearchResultProducts: page,
               }),
            );
         } else if (response.products.length <= 0) {
            dispatch(
               fetchSearchResultProductsSuccess({
                  searchResultProducts: response.products,
                  hasMore: false,
                  pageSearchResultProducts: page - 1,
               }),
            );
         }
      } else {
         dispatch(fetchSearchResultProductsFailure({ error: null }));
      }
   };

   const loadHomeSuggested = async (page) => {
      const response = await ProductServices.search({
         skip: page * LENGTH_PAGE_SUGGESTED,
         limit: LENGTH_PAGE_SUGGESTED,
      });

      if (response.success) {
         if (response.products.length >= LENGTH_PAGE_SUGGESTED) {
            dispatch(
               fetchSuggestedProductsSuccess({
                  suggestedProducts: response.products,
                  hasMore: true,
                  pageSuggestedProducts: page,
               }),
            );
         } else if (
            response.products.length > 0 &&
            response.products.length < LENGTH_PAGE_SUGGESTED
         ) {
            dispatch(
               fetchSuggestedProductsSuccess({
                  suggestedProducts: response.products,
                  hasMore: false,
                  pageSuggestedProducts: page,
               }),
            );
         } else if (response.products.length <= 0) {
            dispatch(
               fetchSuggestedProductsSuccess({
                  suggestedProducts: response.products,
                  hasMore: false,
                  pageSuggestedProducts: page - 1,
               }),
            );
         }
      } else {
         dispatch(fetchSuggestedProductsFailure({ error: null }));
      }
   };

   const loadRecommendProduct = async (page) => {
      const response = await ProductServices.search({
         skip: page * LENGTH_PAGE_RECOMMEND,
         limit: LENGTH_PAGE_RECOMMEND,
      });

      if (response.success) {
         if (response.products.length >= LENGTH_PAGE_RECOMMEND) {
            dispatch(
               fetchRecommendProductsSuccess({
                  recommendProducts: response.products,
                  hasMore: true,
                  pageRecommendProducts: page,
               }),
            );
         } else if (
            response.products.length > 0 &&
            response.products.length < LENGTH_PAGE_RECOMMEND
         ) {
            dispatch(
               fetchRecommendProductsSuccess({
                  recommendProducts: response.products,
                  hasMore: false,
                  pageRecommendProducts: page,
               }),
            );
         } else if (response.products.length <= 0) {
            dispatch(
               fetchRecommendProductsSuccess({
                  recommendProducts: response.products,
                  hasMore: false,
                  pageRecommendProducts: page - 1,
               }),
            );
         }
      } else {
         dispatch(fetchRecommendProductsFailure({ error: null }));
      }
   };

   const loadNewHome = async () => {
      const response = await ProductServices.search({
         skip: 0,
         limit: LENGTH_PAGE_SUGGESTED,
         recently: true,
      });

      if (response.success) {
         dispatch(
            fetchNewProductsSuccess({
               newProducts: response.products,
            }),
         );
      }
   };

   const productContextData = {
      productState,
      loadNewHome,
      loadHomeSuggested,
      beforeLoadHomeSuggested,
      loadSearchResult,
      beforeLoadSearchResult,
      loadKeySearch,
      loadTempSelectSearchResult,
      loadRecommendProduct,
      beforeLoadReCommendProduct,
   };

   return <ProductContext.Provider value={productContextData}>{children}</ProductContext.Provider>;
};

export default ProductContextProvider;
