import React from 'react';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    TextField
} from '@material-ui/core';
import {useSelector} from 'react-redux';
import {FormikHelpers, useFormik} from 'formik';

import {useAppDispatch} from '../../../app/a1-bll/store';
import {Redirect} from 'react-router-dom';
import {loginTC} from '../l1-bll/auth-reducer';
import {selectIsLoggedIn} from '../l1-bll/authSelectors';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}
type FormikValuesType = {
    email: string
    password: string
    rememberMe: boolean
}


export const Login = () => {

    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);


    const formik = useFormik({

        initialValues: {
            email: '',
            password: '',
            rememberMe: false

        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 2) {
                errors.password = 'Must be more than 2 characters';
            }
            return errors;
        },

        onSubmit: async (values, formikHelpers: FormikHelpers<FormikValuesType>) => {
            const action = await dispatch(loginTC(values));
            if (loginTC.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }

            }

        },
    });


    if (isLoggedIn) {

        return <Redirect to={'/'}/>;
    }
    return <form onSubmit={formik.handleSubmit}>
        <Grid container justify="center">
            <Grid item xs={4}>

                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}>here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox  {...formik.getFieldProps('rememberMe')}/>}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>

            </Grid>
        </Grid>;
    </form>;
};
