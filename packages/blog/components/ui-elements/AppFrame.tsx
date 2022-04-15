import { FC, ReactNode, Children } from 'react';
import { useBreakpointMatcher } from '../../hooks/useBreakpointMatcher';
import { useTransition, animated } from '@react-spring/web';
import coreStyle from './AppFrame.core.module.scss';
import themeStyle from './AppFrame.theme.module.scss';

// right side drawer animation
const desktopModalTransitionProperties = {
    keys: null,
    from: { opacity: 0, transform: 'translate3d(100%,0,0) scale(1, 1)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0) scale(1, 1)' },
    leave: { opacity: 0, transform: 'translate3d(100%,0,0) scale(1, 1)' },
    exitBeforeEnter: true
};

// mobile modal animation (zoom in and out of view)
const mobileModalTransitionProperties = {
    keys: null,
    from: { opacity: 0, transform: 'scale(0.75, 0.75) translate3d(0%,0,0)' },
    enter: { opacity: 1, transform: 'scale(1, 1) translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'scale(0.75, 0.75) translate3d(0%,0,0)' },
    exitBeforeEnter: true
};
// !!! to smoothly switch between both types of transition they must have complete transform overlap (scale & translate3d)

type AppFrameProps = {
    desktopBreakpoint: number,
    modal: ReactNode|null,
    actionsChildren?: ReactNode,
};

const AppFrame:FC<AppFrameProps> = ({ desktopBreakpoint, modal, actionsChildren, children }) => {
    const isDesktop = useBreakpointMatcher(windowWidth => desktopBreakpoint <= windowWidth);
    const hasActionMenu = Children.count(actionsChildren) !== 0;

    const modalTransition = useTransition(modal, isDesktop ? desktopModalTransitionProperties : mobileModalTransitionProperties);

    return (
        <main className={ `${ coreStyle['apf-AppFrame'] } ${ hasActionMenu ? coreStyle['apf-AppFrame--has-action-menu'] : coreStyle['apf-AppFrame--no-action-menu'] } ${ isDesktop ? coreStyle['apf-AppFrame--desktop'] : coreStyle['apf-AppFrame--mobile'] }` }>
            <div className={ coreStyle['apf-AppFrame_Content'] }>{ children }</div>
            { hasActionMenu ? <menu className={ `${ coreStyle['apf-AppFrame_ActionMenu'] } ${ themeStyle['apf-AppFrame_ActionMenu'] } ${ isDesktop ? themeStyle['apf-AppFrame_ActionMenu--desktop'] : themeStyle['apf-AppFrame_ActionMenu--mobile'] }` }>{ actionsChildren }</menu> : null }
            {modalTransition((style, modal) => 
                <animated.aside style={ style } className={ `${ coreStyle['apf-AppFrame_Modal'] } ${ isDesktop ? coreStyle['apf-AppFrame_Modal--desktop'] : coreStyle['apf-AppFrame_Modal--mobile'] } ${ themeStyle['apf-AppFrame_Modal'] } ${ isDesktop ? themeStyle['apf-AppFrame_Modal--desktop'] : themeStyle['apf-AppFrame_Modal--mobile'] }` }>
                    { modal }
                </animated.aside>
            )}
        </main>
    )
}

export default AppFrame;