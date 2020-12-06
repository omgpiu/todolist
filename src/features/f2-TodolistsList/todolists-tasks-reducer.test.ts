import {TodolistDomainType} from './todolists-reducer';
import {TasksStateType} from './tasks-reducer';
import {TodolistType} from '../../api/todolists-api';
import {tasksReducer, todoListsActions, todolistsReducer} from './index';
import {useActions} from '../../utils/redux-utils';

const {
    addTodolist,
} = useActions(todoListsActions);
test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let todolist: TodolistType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    };

    const action = addTodolist.fulfilled({todolist: todolist}, 'requstId', todolist.title);

    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState = todolistsReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
