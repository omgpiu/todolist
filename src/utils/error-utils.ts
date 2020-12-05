import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../app/a1-bll/app-reducer';
import {ResponseType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {AxiosError} from 'axios';

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>, showError = true) => {

    if (showError) {
        dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}));
    }
    dispatch(setAppStatusAC({status: 'failed'}));
};
export const handleServerNetworkError = (error: AxiosError, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>, showError = true) => {
    if (showError) {
        dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}));
    }
    dispatch(setAppStatusAC({status: 'failed'}));

};
export const handleAsyncServerNetworkError = (error: AxiosError, dispatch: any,
                                              rejectWithValue: any, showError = true) => {
    if (showError) {
        dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}));
    }
    dispatch(setAppStatusAC({status: 'failed'}));
    return rejectWithValue({errors: [error.message], fieldsErrors: undefined});

};
export const handleAsyncServerAppError = <D>(data: ResponseType<D>, dispatch: any,
                                             rejectWithValue: any, showError = true) => {

    if (showError) {
        dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}));
    }
    dispatch(setAppStatusAC({status: 'failed'}));
    return rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors});
};
