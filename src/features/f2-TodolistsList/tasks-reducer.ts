import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {handleAsyncServerNetworkError, handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AppRootStateType, ThunkErrorType} from '../../app/a1-bll/store';
import {asyncActions as asyncTodoListsActions} from './todolists-reducer';
import {appActions} from '../f3-App';

const initialState: TasksStateType = {};


const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}));
    const res = await todolistsAPI.getTasks(todolistId);

    const tasks = res.data.items;
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
    return {tasks, todolistId};

});
const removeTask = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}));
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
    return {taskId: param.taskId, todolistId: param.todolistId};

});
const addTask = createAsyncThunk<TaskType, { title: string, todolistId: string }, {
    rejectValue: ThunkErrorType
}>('tasks/addTask', async (param,
                           {dispatch, rejectWithValue}
) => {
    dispatch(appActions.setAppStatusAC({status: 'loading'}));

    const res = await todolistsAPI.createTask(param.todolistId, param.title);
    try {
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
            return res.data.data.item;
        } else {
            handleServerAppError(res.data, dispatch, false);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
        }
    } catch (err) {
        return handleAsyncServerNetworkError(err, dispatch, rejectWithValue, false);
    }

});
const updateTask = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }, {
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
export const asyncActions = {
    fetchTasks,
    removeTask,
    addTask,
    updateTask
};

export const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(asyncTodoListsActions.removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(asyncTodoListsActions.fetchTodolists.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl: any) => {
                state[tl.id] = [];
            });
        });
        builder.addCase(asyncTodoListsActions.addTodolist.fulfilled, (state, action) => {

            state[action.payload.todolist.id] = [];
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks;
        });
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        });
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload);
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model};
            }
        });
    }
});
const tasksReducer = slice.reducer;
// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>


}
