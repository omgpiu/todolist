import React from 'react';
import {Provider} from 'react-redux';
import {combineReducers} from 'redux';
import {v1} from 'uuid';
import {AppRootStateType} from '../../app/a1-bll/store';
import {TaskPriorities, TaskStatuses} from '../../api/todolists-api';
import {appReducer} from '../../app/a1-bll/app-reducer';
import thunkMiddleware from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';
import {HashRouter} from 'react-router-dom';
import {tasksReducer} from '../../features/f2-TodolistsList/tasks-reducer';
import {todolistsReducer} from '../../features/f2-TodolistsList/todolists-reducer';
import {authReducer} from '../../features/f1-login/l1-bll/auth-reducer';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
});

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', entityStatus: 'loading', addedDate: '', order: 0}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML&CSS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: v1(), title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            }
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'Milk', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ]
    },
    app: {
        error: null,
        status: 'succeeded',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});


export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>);

export const DecoraTor = (storyFn: any) => (
    <HashRouter>
        {storyFn()}
    </HashRouter>);


