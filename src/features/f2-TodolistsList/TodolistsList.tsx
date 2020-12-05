import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType, useActions} from '../../app/a1-bll/store';
import {
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistDomainType
} from './todolists-reducer';
import {TasksStateType} from './tasks-reducer';
import {TaskStatuses} from '../../api/todolists-api';
import {Grid, Paper} from '@material-ui/core';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Redirect} from 'react-router-dom';
import {selectIsLoggedIn} from '../f1-login/l1-bll/selectors';
import {addTaskTC, removeTaskTC, updateTaskTC} from './tasks-actions';
import {tasksActions} from './index';
import {addTodolistTC, changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC} from './todolists-actions';

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const {addTaskTC, removeTaskTC, updateTaskTC} = useActions(tasksActions);


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        const thunk = fetchTodolistsTC();
        dispatch(thunk);
    }, []);

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        removeTaskTC({taskId, todolistId});
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskTC({title, todolistId});
    }, []);

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTaskTC({taskId, model: {status}, todolistId});
    }, []);

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        updateTaskTC({taskId, model: {title: newTitle}, todolistId});
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC({id: todolistId, filter: value});
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodolistTC(id);
        dispatch(thunk);
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleTC({id, title});
        dispatch(thunk);
    }, []);

    const addTodolist = useCallback((title: string) => {
        const thunk = addTodolistTC(title);
        dispatch(thunk);
    }, [dispatch]);

    if (!isLoggedIn) {
        debugger
        return <Redirect to={'/login'}/>;
    }


    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>;
                })
            }
        </Grid>
    </>;
};
