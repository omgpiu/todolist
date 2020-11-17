import {Dispatch} from 'redux';
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer';
import {authAPI, LoginParamsType} from '../../api/todolists-api';


//
//
// const initialState: InitialStateType = {}
//
// export const loginReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//
//         default:
//             return state
//     }
// }
//
// // // actions
// // export const LoginAC = (taskId: string, todolistId: string) =>
// //     ({type: 'REMOVE-TASK', taskId, todolistId} as const)
//
//
// // thunks
// export const loginTC = (data:LoginParamsType) => (dispatch: Dispatch<ActionsType | SetAppStatusActionType>) => {
//     dispatch(setAppStatusAC('loading'))
//     authAPI.login(data)
//         .then((res) => {
//
//             // dispatch(LoginAC(res.data.data))
//             dispatch(setAppStatusAC('succeeded'))
//         })
// }
//
// // types
//
// type InitialStateType = {}
// type ActionsType = any
//
// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
