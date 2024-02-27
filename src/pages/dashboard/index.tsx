
import type { NextPage } from 'next'
import Layout from '@/layouts/Dashboard'
import { Container, Unstable_Grid2 as Grid } from '@mui/material'
import { Button } from '@shopify/polaris'
import routes from '@/lib/routes'


const DashboardOverview: NextPage = () => {

    return (
        <Layout title="">
            <>
                <Container className="gradient1_bg" sx={{ pt: 12, display: "flex", justifyContent: "center" }} component={"section"} maxWidth={false}>
                    <Grid container sx={{ width: "100%", flexDirection: { xs: "column", smm: "row" }, justifyContent: { xs: "center", lg: "space-between" }, alignItems: "center", flexWrap: "nowrap" }} maxWidth={"lg"}>
                        <Grid sx={{ justifyContent: "center", alignItems: "center", display: "flex" }} marginBottom={6} {...{ md: 7, lg: 9 }}>
                            <Button
                                variant={"primary"}
                                size={"large"}
                                url={routes.dashboard.products}
                                external={false}
                            >
                                Simulate
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </>
        </Layout >
    )
}

export default DashboardOverview
