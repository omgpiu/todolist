import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {ErrorSnackbar} from '../../components/ErrorSnackbar/ErrorSnackbar';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../a1-bll/store';
import {initializeAppTC} from '../a1-bll/app-reducer';
import {Redirect, Route, Switch} from 'react-router-dom';
import {TodolistsList} from '../../features/f2-TodolistsList/TodolistsList';
import {Login} from '../../features/f1-login/l1-ui/Login';
import {logoutTC} from '../../features/f1-login/l1-bll/auth-reducer';
import {selectIsInitialized, selectStatus} from '../a1-bll/selectors';
import {selectIsLoggedIn} from '../../features/f1-login/l1-bll/authSelectors';




const App = ({demo = false}: PropsType) => {
    const status = useSelector(selectStatus);
    const isInitialized = useSelector(selectIsInitialized);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const dispatch = useDispatch();
    useEffect(() => {

        dispatch(initializeAppTC());
    }, []);
    const logOutHandler = useCallback(() => {
        dispatch(logoutTC());
    }, []);
    if (!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>;
    }


    return (

        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Switch>
                    <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route path={'/404'} render={() => <h1>404 ERROR</h1>}/>
                    <Redirect from={'*'} to={'/404'}/>

                </Switch>
            </Container>
        </div>
    );

};

type PropsType = {
    demo?: boolean
}
export default App;
