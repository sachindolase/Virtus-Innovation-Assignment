import { configureStore } from "@reduxjs/toolkit";
import positionReducer from "../features/positionSlice"

const store = configureStore({
    reducer:{
       position: positionReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})


export {store}