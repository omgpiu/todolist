import {asyncActions as tasksAsyncActions} from './tasks-reducer';
import {asyncActions as todoListsAsyncActions, slice} from './todolists-reducer';
import {TodolistsList} from './TodolistsList';





const todoListsActions = {
    ...todoListsAsyncActions,
    ...slice.actions
};
const taskActions = {
    ...tasksAsyncActions,

};
export {
    taskActions,
    todoListsActions,
    TodolistsList
};

