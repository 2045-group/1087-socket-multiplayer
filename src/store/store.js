// src/app/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore, storage } from "./persist";
import authReducer from "../features/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);
