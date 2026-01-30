import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";

export const store = configureStore({
  reducer: {
    // Додаємо reducer від нашого API
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // Додаємо middleware для кешування та життєвого циклу запитів
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
