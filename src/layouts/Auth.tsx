import { FormEvent, ReactNode, useState } from 'react';
import { Box, Button, Container, TextField, Typography, Unstable_Grid2 as Grid, IconButton, InputAdornment, TextFieldProps } from '@mui/material'
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/layouts/Default';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormikContextType } from 'formik';
import routes from '@/lib/routes';
import { AuthFormProps } from '@/lib/types';
import HTMLHead from '@/components/HTMLHead';

interface AuthHeadInt { main: string, subtitle: ReactNode, center?: boolean }


export const AuthButton = ({ text }: { text: string }) => {
    return <>
        <Button className='secondary_bg border1' type="submit" fullWidth variant="contained" sx={{ py: 1, mt: 3, mb: 2 }}>
            {text}
        </Button>
    </>
}


export const AuthHead = ({ main, subtitle, center = false }: AuthHeadInt) => <>
    <Typography component="div">
        <Typography sx={{ textAlign: `${center && "center"}` }} variant={"h5"} component="h3" className='fw800'>{main}</Typography>
        <Typography sx={{ textAlign: `${center && "center"}` }} variant="subtitle1" component="p" className='fw400' fontSize={12}>{subtitle}</Typography>
    </Typography >
</>

export const AuthField = ({ autoComplete = "", name, placeholder = "", formik, fullWidth = true, required = true, sx, ...otherprops }: TextFieldProps & {
    formik?: FormikContextType<{ [key: string]: string }>
}) => {
    return <TextField
        margin="normal"
        variant="outlined"
        size="medium"
        {...{
            autoComplete: autoComplete || name,
            fullWidth, id: name, placeholder, required,
            value: name && formik?.values[name],
            onChange: formik?.handleChange,
            onBlur: formik?.handleBlur,
            error: name ? formik?.touched[name] && Boolean(formik.errors[name]) : undefined,
            helperText: name ? formik?.touched[name] && formik.errors[name] : undefined,
            sx: { my: 1, ...sx },
            ...otherprops,
        }}
    />
}

const Header = () => {
    return <>
        <Container component={'header'} maxWidth="xl" className={""} sx={{ backgroundColor: "background.white", }}>
            <Box component="nav" sx={{ py: 3, }}>
                <Link href={routes.home}>
                    <Image src="/logo.svg" alt="Afrikobo Logo" width={150} height={100} />
                </Link>
            </Box>
        </Container>
    </>
}

export const Password = ({ confirm = false, placeholder = "Enter Password", sx = {}, ...otherprops }: TextFieldProps & { confirm?: boolean }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return <>
        <AuthField
            sx={{ backgroundColor: "background.white", ...sx }}
            type={showPassword ? 'text' : 'password'}
            name={`password${confirm ? "_confirmation" : ""}`}
            autoComplete="password"
            InputProps={{
                endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ,
            }}
            {...{ placeholder, ...otherprops }}
        />
    </>
}


const AuthLayout = ({ formik, title, children }: AuthFormProps): JSX.Element => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        formik.handleSubmit(e)
    }


    return <>
        <HTMLHead title={title} />
        <Grid container component={'main'} sx={{ minHeight: "65vh", position: "relative", justifyContent: "center", alignItems: "center", width: "100vw", backgroundColor: "background.auth", pb: 5 }} >
            <Grid container {...{ xs: 12, lg: 6 }} component={'div'} maxWidth={'lg'} flexDirection={"column"} sx={{ justifyContent: "center", alignItems: "center", maxWidth: "90vw" }}>
                <Link href="/">
                    <Image src="/vercel.svg" alt="Vercel Logo" width={150} height={100} />
                </Link>
                <Grid container flexDirection={"column"} maxWidth={421} component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container component={'section'} sx={{ flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center" }} >
                        <Typography component="div">
                            {children}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </ Grid>
        <Footer />
    </>
}

export default AuthLayout
