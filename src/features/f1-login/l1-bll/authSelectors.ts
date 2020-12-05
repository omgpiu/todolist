import {AppRootStateType} from '../../../app/a1-bll/store';

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
