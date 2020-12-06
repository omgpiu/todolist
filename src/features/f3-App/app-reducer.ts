import {authAPI} from '../../api/todolists-api';
import {handleServerAppError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setIsLoggedInAC} from '../../features/f1-login/l1-bll/auth-reducer';

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
};

const initializeApp = createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({isLoggedIn: true}));
    } else {
        handleServerAppError(res.data, dispatch);
    }
    //возвращает в любом случае undefined return можно не писать
});
export const asyncActions = {
    initializeApp
};

export const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true;
        });
    }
});
const {setAppErrorAC, setAppStatusAC} = slice.actions;


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null,
    isInitialized: boolean
}


export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
