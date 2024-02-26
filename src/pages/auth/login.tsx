import type { NextPage } from 'next'
import Layout, { AuthButton, AuthField, AuthHead, Password } from '@/layouts/Auth'
import { Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { useFormik } from 'formik';
import { loginForm } from '@/lib/forms';
import { signIn } from 'next-auth/react';
import { isEmptyObject } from '@/lib';
import Swal from 'sweetalert2'
import useSWRMutation from 'swr/mutation';
import { sendRequest } from '@/lib/api';
import Link from 'next/link';
import routes from '@/lib/routes';
import { useSearchParams } from 'next/navigation';


const Login: NextPage = () => {
    const { trigger } = useSWRMutation(routes.api.auth.login, sendRequest)
    const callbackUrl = useSearchParams().get("callbackUrl") || routes.dashboard.overview;

    const handleSubmit = async () => {
        if (isEmptyObject(formik.errors)) {
            Swal.fire('Please check your inputs')
        }
        else {
            try {
                trigger({ ...formik.values }).then((res: any) => {
                    if (res?.data?.token) signIn('credentials', { ...res?.data.user, token: res?.data.token, callbackUrl })
                })
            } catch (error) {
                Swal.fire('Authentication failed. Please check your credentials.')
            }
        }
    }

    const formik = useFormik<{ [key: string]: string }>({
        initialValues: loginForm.initialValues,
        validationSchema: loginForm.validationSchema,
        onSubmit: handleSubmit
    });

    return <Layout  {...{ formik, title: "Login" }}>
        <AuthHead center main="Sign In" subtitle={<>Not registered? <Link href={routes.auth.signup} >Sign up</Link></>} />
        <Typography component="div" marginBottom={1} marginTop={5}>
            <Grid component="label" >
                <Typography>Email</Typography>
                <AuthField
                    {...{
                        name: 'email',
                        type: 'email',
                        placeholder: 'Email',
                        formik
                    }}
                />
            </Grid>
            <Grid component="label">
                <Typography>Password</Typography>
                <Password
                    {...{
                        placeholder: 'Enter Password',
                        formik
                    }}
                />
            </Grid>
            <AuthButton text="Login" />
        </Typography>
    </Layout>
}

export default Login
