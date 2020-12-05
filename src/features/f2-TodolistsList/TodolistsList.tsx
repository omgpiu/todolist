import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {AppRootStateType, useActions} from '../../app/a1-bll/store';
import {TodolistDomainType} from './todolists-reducer';
import {TasksStateType} from './tasks-reducer';
import {Grid, Paper} from '@material-ui/core';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Redirect} from 'react-router-dom';
import {selectIsLoggedIn} from '../f1-login/l1-bll/selectors';
import {todoListsActions} from './index';

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const {
        addTodolist,
        fetchTodolists,
    } = useActions(todoListsActions);


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists();

    }, []);


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
                                demo={demo}
                            />
                        </Paper>
                    </Grid>;
                })
            }
        </Grid>
    </>;
};
