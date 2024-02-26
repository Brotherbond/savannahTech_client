import type { NextPage } from 'next'
import Layout from '@/layouts/Dashboard'
import { Container, Typography, Unstable_Grid2 as Grid } from '@mui/material'


const Transactions: NextPage = () => {

    return (
        <Layout title="">
            <>
                <Container className="gradient1_bg" sx={{ pt: 12, display: "flex", justifyContent: "center" }} component={"section"} maxWidth={false}>
                    <Grid container sx={{ width: "100%", flexDirection: { xs: "column", smm: "row" }, justifyContent: { xs: "center", lg: "space-between" }, alignItems: "center", flexWrap: "nowrap" }} maxWidth={"lg"}>
                        <Grid marginBottom={6} {...{ md: 7, lg: 9 }}>
                        </Grid>
                    </Grid>
                </Container>
            </>
        </Layout >
    )
}

export default Transactions
