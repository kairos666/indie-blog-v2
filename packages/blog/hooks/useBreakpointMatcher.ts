import { useWindowSize } from "./useWindowSize";

type WindowSizeMatcher = (windowWidth:number, windowHeight:number) => boolean

export const useBreakpointMatcher = (matcher:WindowSizeMatcher) => {
    // default value is only available before first effect run or on the server
    const [windowWidth, windowHeight] = useWindowSize(1000, 1000);

    // feed matcher
    return matcher(windowWidth, windowHeight);
}