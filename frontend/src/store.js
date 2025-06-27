import {configureStore} from '@reduxjs/toolkit'

import authReducer from './slices/AuthSlice'
import userReducer  from './slices/UserSlice'



export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer
    },
})