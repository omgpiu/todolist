import {Dispatch} from 'redux';
import {authAPI} from '../api/todolists-api';
import {handleServerAppError} from '../utils/error-utils';
import {setIsLoggedInAC} from '../features/Login/auth-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
};


const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized;
        }
    }
});
export const appReducer = slice.reducer;
export const {setAppErrorAC, setAppStatusAC, setIsInitializedAC} = slice.actions;


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setIsInitializedAC({isInitialized: true}));

        });


};

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null,
    isInitialized: boolean
}


export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type setAppInitializedActionType = ReturnType<typeof setIsInitializedAC>
// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status};
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error};
//         case 'APP/SET-IS-INIT':
//             return {...state, isInitialized: true};
//         default:
//             return {...state};
//     }
// };
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const);
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const);
// export const setIsInitializedAC = () => ({type: 'APP/SET-IS-INIT'} as const);

// type ActionsType =
//     | SetAppErrorActionType
//     | SetAppStatusActionType
//     | setAppInitializedActionType
