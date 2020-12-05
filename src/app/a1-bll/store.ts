import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {appReducer} from './app-reducer';
import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {tasksReducer} from '../../features/f2-TodolistsList/tasks-reducer';
import {todolistsReducer} from '../../features/f2-TodolistsList/todolists-reducer';
import {authReducer} from '../../features/f1-login/l1-bll/auth-reducer';


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
});
// непосредственно создаём store

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});

// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>();
