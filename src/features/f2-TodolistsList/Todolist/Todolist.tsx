import React, {useCallback, useEffect} from 'react';
import {AddItemForm, AddItemFormSubmitHelperType} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton, Paper, PropTypes} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolists-api';
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import {useActions, useAppDispatch} from '../../../app/a1-bll/store';
import {taskActions, todoListsActions} from '../index';

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {
        const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todoListsActions);
        const {fetchTasks} = useActions(taskActions);
        const dispatch = useAppDispatch();

        useEffect(() => {
            if (demo) {
                return;
            }
            fetchTasks(props.todolist.id);
        }, []);

        const addTaskCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {

            let thunk = taskActions.addTask({title: title, todolistId: props.todolist.id});
            const resultAction = await dispatch(thunk);
            if (taskActions.addTask.rejected.match(resultAction)) {
                if (resultAction.payload?.errors?.length) {
                    const errorMessage = resultAction.payload?.errors[0];
                    helper.setError(errorMessage);
                } else {
                    helper.setError('Some error occurred');
                }
            } else {
                helper.setTitle('');
            }
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


        return <Paper style={{padding: '10px', position: 'relative'}}>

            <IconButton onClick={removeTodolistCallback} disabled={props.todolist.entityStatus === 'loading'}
                        style={{position: 'absolute', right: '5px', top: '5px'}}
                        size={'small'}
            >
                <Delete fontSize={'small'}/>
            </IconButton>
            <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback}/>

            </h3>
            <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
            <div>
                {
                    tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}

                    />)
                }
                {!tasksForTodolist.length && <div style={{padding: '10px', color: 'gray'}}>Create your first task</div>}
            </div>
            <div style={{paddingTop: '10px'}}>
                {renderFilterButton('default', 'all', 'ALL')}
                {renderFilterButton('primary', 'active', 'ACTIVE')}
                {renderFilterButton('secondary', 'completed', 'COMPLETED')}
            </div>
        </Paper>;
    })
;

