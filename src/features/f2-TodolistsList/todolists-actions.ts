import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/a1-bll/app-reducer';
import {todolistsAPI} from '../../api/todolists-api';
import {handleServerNetworkError} from '../../utils/error-utils';
import {changeTodolistEntityStatusAC} from './todolists-reducer';

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodoLists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    const res = await todolistsAPI.getTodolists();
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {todolists: res.data};
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {id: todolistId};
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    const res = await todolistsAPI.createTodolist(title);
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {todolist: res.data.data.item};
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    await todolistsAPI.updateTodolist(param.id, param.title);
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {id: param.id, title: param.title};
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
