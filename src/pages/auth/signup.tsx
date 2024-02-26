import type { NextPage } from 'next'
import Layout, { AuthButton, AuthField, AuthHead, Password } from '@/layouts/Auth'
import routes from '@/lib/routes'
import Link from 'next/link'
import { Checkbox, FormControlLabel, Typography, Unstable_Grid2 as Grid, RadioGroup, Radio } from '@mui/material'
import { useFormik } from 'formik'
import { gender, signupForm } from '@/lib/forms'
import Swal from 'sweetalert2'
import useSWRMutation from 'swr/mutation'
import { sendRequest } from '@/lib/api'
import { isEmptyObject } from '@/lib'
import { useRouter } from 'next/router'


const Signup: NextPage = () => {
    const { trigger } = useSWRMutation(routes.api.auth.signup, sendRequest)
    const router = useRouter()

    const handleSubmit = async () => {
        if (isEmptyObject(formik.errors)) {
            Swal.fire('Please check your inputs')
        }
        else {
            try {
                trigger({ ...formik.values }).then((res: any) => {
                    if (res?.data) router.push(routes.auth.login)
                })
            } catch (error) {
                Swal.fire('Something went wrong. Please try again later.')
            }
        }
    }
    const formik = useFormik<{ [key: string]: string }>({
        initialValues: signupForm.initialValues,
        validationSchema: signupForm.validationSchema,
        onSubmit: handleSubmit
    });

    return <Layout  {...{ formik, title: "Sign up" }}>
        <AuthHead center main="Create an account" subtitle={<>Already registered? <Link href={routes.auth.login} >Login</Link></>} />
        <Typography component="div" marginBottom={1} marginTop={5}>
            <Grid component="label">
                <Typography >Full name</Typography>
                <AuthField
                    {...{
                        name: 'name',
                        placeholder: 'Enter full name',
                        autoFocus: true,
                        formik
                    }}
                />
            </Grid>
            <Grid component="label"  >
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
            <Grid component="label">
                <Typography>Password</Typography>
                <Password
                    confirm
                    {...{
                        placeholder: 'Confirm Password',
                        formik
                    }}
                />
            </Grid>
            <Grid container component="label" sx={{ justifyContent: "space-between", flexDirection: "column" }} position="relative">
                <Typography>Gender </Typography>
                <RadioGroup
                    row
                    aria-labelledby="gender"
                    {...{
                        value: formik?.values['gender'],
                        name: "gender"
                    }}
                    sx={{ "&> *": { my: 0 }, display: "flex" }}
                >
                    <FormControlLabel value={gender[0]} control={<Radio />} label={<>
                        <Typography>Male</Typography>
                    </>} />
                    <FormControlLabel value={gender[1]} control={<Radio />} label={<>
                        <Typography>Female</Typography>
                    </>} />
                </RadioGroup>
            </Grid>
            <Grid component="label" marginBottom={1} position="relative">
                <Typography>Location</Typography>
                <AuthField
                    {...{
                        name: 'location',
                        placeholder: 'Enter location',
                        formik
                    }}
                />
            </Grid>
            <FormControlLabel
                sx={{ my: 2, alignItems: 'flex-start' }}
                control={<Checkbox value="remember" color="primary" sx={{ py: 0 }} />}
                label={<Typography>I’ve read and understand the users’ Terms of Service. I agree that my data will be processed according to vercel’s Privacy Statement.
                    <Link href={routes.home} className="secondary"> Read more</Link>
                </Typography>}
            />
            <AuthButton text="Submit" />
        </Typography>
    </Layout>
}

export default Signup
