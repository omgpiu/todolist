import * as authSelectors from './selectors';
import {Login} from '../l1-ui/Login';
import {asyncActions, slice} from './auth-reducer';


const authActions = {
    ...asyncActions,
    ...slice.actions,

};

const authReducer = slice.reducer

export {
    authSelectors,
    Login,
    authActions,
    authReducer
};
