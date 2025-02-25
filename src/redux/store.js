import { configureStore } from "@reduxjs/toolkit";
import templateReducer from "./templateSlice";

export const store = configureStore({
  reducer: {
    template: templateReducer,
  },
});
