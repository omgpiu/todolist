import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppRootStateType} from '../../app/a1-bll/store';
import {todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatusAC} from '../../app/a1-bll/app-reducer';
import {UpdateDomainTaskModelType} from './tasks-reducer';

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    const res = await todolistsAPI.getTasks(todolistId);

    const tasks = res.data.items;
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
    return {tasks, todolistId};

});
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
    return {taskId: param.taskId, todolistId: param.todolistId};

});
export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    const res = await todolistsAPI.createTask(param.todolistId, param.title);
    try {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return res.data.data.item;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }

});
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }, {
    dispatch,
    rejectWithValue,
    getState
}) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
    if (!task) {
        //throw new Error("task not found in the state");
        // console.warn('task not found in the state');
        return rejectWithValue('task not found in the state');
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...param.model
    };
    const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel);
    try {
        if (res.data.resultCode === 0) {

            return param;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
