import {setAppStatusAC} from '../../../app/a1-bll/app-reducer';
import {authAPI, FieldErrorType, LoginParamsType} from '../../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';


const login = createAsyncThunk<undefined, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('auth/login', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));               // Сделал деструктуризацию thunkAPI
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return;

        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
        }
    } catch (err) {
        const error: AxiosError = err;
        handleServerNetworkError(error, dispatch);
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined});
    }

});
const logout = createAsyncThunk('auth/logout', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));                                         // Сделал деструктуризацию thunkAPI
    const res = await authAPI.logout();
    try {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({});
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue({});
    }

});


export const asyncActions = {
    logout,
    login
}



export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn;
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state) => {
            state.isLoggedIn = true;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.isLoggedIn = false;
        });
    }
});


export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;


