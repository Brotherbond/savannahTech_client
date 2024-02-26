import { Container, Unstable_Grid2 as Grid, Link as MLink, Typography } from '@mui/material'
import Link from "next/link";
import Image from "next/image";
import { DefaultProps } from '@/lib/types';


export const Footer = (): JSX.Element =>
    <>
        <Container className={`white black2_bg`} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} component={"footer"} maxWidth={false}>
        </Container>
    </>

const Header = (): JSX.Element => {
    return (
        <>
        </>
    )
}
const Default = ({ title, children }: DefaultProps): JSX.Element => {
    return <>
        <Header />
        <Container sx={{ px: { xs: 0 }, minHeight: "65vh" }} component={'main'} maxWidth="xl">
            {children}
        </Container>
        <Footer />
    </>
}

export default Default
