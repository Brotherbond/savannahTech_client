import '@/styles/globals.scss'
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { ThemeProvider } from '@mui/material'
import useTheme from '@/layouts/themes';
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth';
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";



export function reportWebVitals(metric: NextWebVitalsMetric) {
    console.log(metric)
}


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
    const theme = useTheme()
    return <>
        <SessionProvider session={session}>
            <AppProvider i18n={en}>
                <ThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme >
                        <Component {...pageProps} />
                    </CssBaseline>
                </ThemeProvider>
            </AppProvider>
        </SessionProvider >
    </>
}
