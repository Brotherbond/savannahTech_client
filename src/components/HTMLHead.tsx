import Head from "next/head"

const HTMLHead = ({ title }: { title: string }): JSX.Element =>
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Afrikobo,  " />
    <meta name="msapplication-TileColor" content="#F8931D"></meta>
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Afrikobo" />
    <meta property="og:title" content="" />
    <meta property="og:url" content="https://afrikobo.com" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="https://afrikobo.com/favicon.svg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <link rel="icon" href="/favicon.svg" />
    <link rel="icon" type="image/svg" sizes="32x32" href="/favicon-32x32.svg" />
    <link rel="icon" type="image/svg" sizes="16x16" href="/favicon-16x16.svg" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <link rel="apple-touch-icon" type="image/svg" href="/favicon.svg" />
    <link rel="apple-touch-icon" type="image/svg" href="/favicon.svg" sizes="120x120" />
    <link rel="apple-touch-icon" type="image/svg" href="/favicon.svg" sizes="152x152" />
    <link rel="apple-touch-icon" type="image/svg" href="/favicon.svg" sizes="167x167" />
    <link rel="apple-touch-icon" type="image/svg" href="/favicon.svg" sizes="180x180" />
    <link rel="shortcut icon" href="/favicon.svg" />
    <link rel="shortcut icon" type="image/svg" href="/favicon.svg" sizes="196x196" />
    <link rel="shortcut icon" type="image/svg" href="/favicon.svg" sizes="192x192" />
    <link rel="shortcut icon" type="image/svg" href="/favicon.svg" sizes="128x128" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"></link>
    <title>{title}</title>
  </Head>

export default HTMLHead 