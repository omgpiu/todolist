import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton, PropTypes} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolists-api';
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import {useActions} from '../../../app/a1-bll/store';
import {taskActions, todoListsActions} from '../index';

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {
    const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todoListsActions);
    const {addTask, fetchTasks} = useActions(taskActions);


    useEffect(() => {
        if (demo) {
            return;
        }
        fetchTasks(props.todolist.id);
    }, []);

    const addTaskCallback = useCallback((title: string) => {
        addTask({title: title, todolistId: props.todolist.id});
    }, [props.todolist.id]);

    const removeTodolistCallback = () => {
        removeTodolist(props.todolist.id);
    };
    const changeTodolistTitleCallback = useCallback((title: string) => {
        changeTodolistTitle({id: props.todolist.id, title: title});
    }, [props.todolist.id]);

    const onClickHandler = useCallback((filter: FilterValuesType) => changeTodolistFilter({
        filter: filter,
        id: props.todolist.id
    }), [props.todolist.id]);


    let tasksForTodolist = props.tasks;

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }


    const renderFilterButton = (color: PropTypes.Color, buttonFilter: FilterValuesType, text: string) => {
        return <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                       onClick={() => onClickHandler(buttonFilter)}
                       color={color}
        >{text}
        </Button>;
    };


    return <div>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback}/>
            <IconButton onClick={removeTodolistCallback} disabled={props.todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}

                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            {renderFilterButton('default', 'all', 'ALL')}
            {renderFilterButton('primary', 'active', 'ACTIVE')}
            {renderFilterButton('secondary', 'completed', 'COMPLETED')}
        </div>
    </div>;
});

