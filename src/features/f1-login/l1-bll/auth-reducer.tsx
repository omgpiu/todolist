import {authAPI, LoginParamsType} from '../../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {ThunkErrorType} from '../../../app/a1-bll/store';
import {appActions} from '../../f3-App';


const login = createAsyncThunk<undefined, LoginParamsType, {
    rejectValue: ThunkErrorType
}>('auth/login', async (param, {dispatch, rejectWithValue}) => {
    dispatch(appActions.setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
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
    dispatch(appActions.setAppStatusAC({status: 'loading'}));                                         // Сделал деструктуризацию thunkAPI
    const res = await authAPI.logout();
    try {
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
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
};


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


export const {setIsLoggedInAC} = slice.actions;


