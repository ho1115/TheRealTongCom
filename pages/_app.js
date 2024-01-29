import * as React from "react"
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Custskel from "./pageComps/customskeleton";
 
export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [loading, setLoad] = React.useState(false);

    useEffect(() => {
        const startTrans = (path) => {(path != router.asPath) && setLoad(true);}
        const finishTrans = (path) => {(path == router.asPath) && setLoad(false);}

        router.events.on('routeChangeStart', startTrans)
        router.events.on('routeChangeComplete', finishTrans)
        router.events.on('routeChangeError', finishTrans)

        return () => {
            router.events.off('routeChangeStart',startTrans)
            router.events.off('routeChangeComplete', finishTrans)
            router.events.off('routeChangeError', finishTrans)
        }
    })
    
    return loading ? <Custskel /> : <Component {...pageProps} />

}