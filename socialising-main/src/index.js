import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./state";
import { configureStore} from '@reduxjs/toolkit';
import {Provider} from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {PersistGate} from "redux-persist/integration/react";



const persistConfig={key:"root",// The key for the persisted data in storage
                     storage, // The storage mechanism to be used (e.g., localStorage, AsyncStorage)
                     version:1};// Version number for potential migrations in the future


const persistedReducer=persistReducer(persistConfig,authReducer);
// Creating a persisted version of the original reducer using Redux Persist

const store=configureStore({
  reducer:persistedReducer,// Using the persisted reducer in the Redux store
  middleware:(getDefaultMiddleware)=>
  getDefaultMiddleware({
    serializableCheck:{
      ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
     // Ignoring specific actions from being checked for serializability
    }
  })
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistStore(store)}>
    <App />
     </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

