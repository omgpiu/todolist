import {asyncActions as tasksAsyncActions, slice as taskSlice} from './tasks-reducer';
import {asyncActions as todoListsAsyncActions, slice as todolistSlice} from './todolists-reducer';
import {TodolistsList} from './TodolistsList';

const tasksReducer = taskSlice.reducer;
const todolistsReducer = todolistSlice.reducer;

const todoListsActions = {
    ...todoListsAsyncActions,
    ...todolistSlice.actions
};
const taskActions = {
    ...tasksAsyncActions,
    ...taskSlice.actions

};
export {
    taskActions,
    todoListsActions,
    TodolistsList, todolistsReducer, tasksReducer
};

