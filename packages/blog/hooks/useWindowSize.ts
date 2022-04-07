import { useEffect, useState } from "react";

export const useWindowSize = (defaultWidth:number, defaultHeight:number) => {
    // default value is only available before first effect run or on the server
    const [windowSize, setWindowSize] = useState([defaultWidth, defaultHeight]);

    // leave early on the server
    if(typeof window === "undefined") return windowSize;

    // extract window size handler
    const windowSizeOnResize = () => { setWindowSize([window.innerWidth, window.innerHeight]); }

    useEffect(() => {
        // adjust current window size
        setWindowSize([window.innerWidth, window.innerHeight]);

        // setup handler for resize
        window.addEventListener('resize', windowSizeOnResize);

        // unsubscribe
        return () => { window.removeEventListener('resize', windowSizeOnResize); }
    }, []);

    return windowSize;
}