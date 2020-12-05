import {todolistsAPI, TodolistType} from '../../api/todolists-api';
import {RequestStatusType, setAppStatusAC} from '../../app/a1-bll/app-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {handleServerNetworkError} from '../../utils/error-utils';


const fetchTodolists = createAsyncThunk('todolists/fetchTodoLists', async (param, {
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
const removeTodolist = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {id: todolistId};
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});
const addTodolist = createAsyncThunk('todolists/addTodolist', async (title: string, {
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
const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle', async (param: { id: string, title: string }, {
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

export const asyncActions = {
    fetchTodolists,
    removeTodolist,
    addTodolist,
    changeTodolistTitle

};

export const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        });
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
            }
        });
        builder.addCase(addTodolist.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        });
        builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].title = action.payload.title;
        });
    },
});



export const todolistsReducer = slice.reducer;
export const {changeTodolistFilter, changeTodolistEntityStatus} = slice.actions;

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
