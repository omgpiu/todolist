import {ResponseType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {AxiosError} from 'axios';
import {appActions} from '../features/f3-App';
import {SetAppErrorActionType, SetAppStatusActionType} from '../features/f3-App/app-reducer';

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>, showError = true) => {

    if (showError) {
        dispatch(appActions.setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}));
    }
    dispatch(appActions.setAppStatusAC({status: 'failed'}));
};
export const handleServerNetworkError = (error: AxiosError, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>, showError = true) => {
    if (showError) {
        dispatch(appActions.setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}));
    }
    dispatch(appActions.setAppStatusAC({status: 'failed'}));

};
export const handleAsyncServerNetworkError = (error: AxiosError, dispatch: any,
                                              rejectWithValue: any, showError = true) => {
    if (showError) {
        dispatch(appActions.setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}));
    }
    dispatch(appActions.setAppStatusAC({status: 'failed'}));
    return rejectWithValue({errors: [error.message], fieldsErrors: undefined});

};
export const handleAsyncServerAppError = <D>(data: ResponseType<D>, dispatch: any,
                                             rejectWithValue: any, showError = true) => {

    if (showError) {
        dispatch(appActions.setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}));
    }
    dispatch(appActions.setAppStatusAC({status: 'failed'}));
    return rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors});
};
