import type { NextPage } from 'next'
import Default from '@/layouts/Default'
import { Container, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import routes from '@/lib/routes'
import { Button } from '@shopify/polaris';


const Home: NextPage = () => {

    return (
        <Default title="Home page">
            <>
                <Container className="gradient1_bg" sx={{ pt: 12, display: "flex", justifyContent: "center" }} component={"section"} maxWidth={false}>
                    <Grid container sx={{ width: "100%", flexDirection: { xs: "column", smm: "row" }, justifyContent: { xs: "center", lg: "space-between" }, alignItems: "center", flexWrap: "nowrap" }} maxWidth={"lg"}>
                        <Grid marginBottom={6} {...{ md: 7, lg: 9 }}>
                            <Typography component={"div"} className='d-flex' sx={{ display: "flex", flexDirection: "column", width: "100%", fontSize: 28, justifyContent: "center", alignItems: "center", gap: 4 }}>
                                E-commerce, login to use calculator
                                <div>
                                    <Button
                                        variant={"primary"}
                                        size={"large"}
                                        url={routes.auth.login}
                                    >
                                        Login
                                    </Button>
                                </div>
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </>
        </Default >
    )
}

export default Home
