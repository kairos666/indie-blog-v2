import { FC, ReactNode, useState, Children } from 'react';
import { useBreakpointMatcher } from '../../hooks/useBreakpointMatcher';

type AppFrameProps = {
    desktopBreakpoint: number,
    actionsChildren?: ReactNode
};

const AppFrame:FC<AppFrameProps> = ({ desktopBreakpoint, actionsChildren, children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isDesktop = useBreakpointMatcher(windowWidth => desktopBreakpoint <= windowWidth);

    return (
        <main>
            <p>isDrawerOpen: { isDrawerOpen ? 'oui' : 'non' }, isDesktop: { isDesktop ? 'oui' : 'non' }</p>
            { children }
            {(Children.count(actionsChildren) !== 0) ? <menu>{ actionsChildren }</menu> : null }
        </main>
    )
}

export default AppFrame;