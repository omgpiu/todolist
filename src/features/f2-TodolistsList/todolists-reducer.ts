import {todolistsAPI, TodolistType} from '../../api/todolists-api';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    handleAsyncServerAppError,
    handleAsyncServerNetworkError,
    handleServerAppError,
    handleServerNetworkError
} from '../../utils/error-utils';
import {ThunkErrorType} from '../../app/a1-bll/store';
import {appActions} from '../f3-App';
import {RequestStatusType} from '../f3-App/app-reducer';


const fetchTodolists = createAsyncThunk('todolists/fetchTodoLists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(appActions.setAppStatusAC({status: 'loading'}));
    const res = await todolistsAPI.getTodolists();
    try {
        dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
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
    dispatch(appActions.setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    try {
        dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
        return {id: todolistId};
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
});


const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string,
        { rejectValue: ThunkErrorType }>
    ('todolists/addTodolist', async (title, {
            dispatch,
            rejectWithValue
        }) => {
            dispatch(appActions.setAppStatusAC({status: 'loading'}));

            try {
                const res = await todolistsAPI.createTodolist(title);
                if (res.data.resultCode === 0) {
                    dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
                    return {todolist: res.data.data.item};
                } else {
                    return handleAsyncServerAppError(res.data, dispatch,
                        rejectWithValue, true);
                }
            } catch (err) {
                return handleAsyncServerNetworkError(err, dispatch,
                    rejectWithValue, false);
            }
        }
    )
;
const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(appActions.setAppStatusAC({status: 'loading'}));
    try {
        const res = await todolistsAPI.updateTodolist(param.id, param.title);
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
            return {id: param.id, title: param.title};
        } else {
            handleServerAppError(res.data, dispatch, false);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
        }
    } catch (err) {
        return handleAsyncServerNetworkError(err, dispatch,
            rejectWithValue, false);
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


const {changeTodolistEntityStatus} = slice.actions;

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
