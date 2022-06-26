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
    desktopBreakpoint: number
};

const AppFrame:FC<AppFrameProps> = ({ desktopBreakpoint, children }) => {
    const isDesktop = useBreakpointMatcher(windowWidth => desktopBreakpoint <= windowWidth);

    // each time children change, rerender with separating children accordingly
    let actionMenu:ReactNode[] = [];
    let detailModal:ReactNode[] = [];
    let regularChildren:ReactNode[] = [];
    Children.forEach(children, (child:ReactNode) => {
        switch(true) {
            // group all ActionMenu together
            case ((child as any)?.type?.displayName === 'ActionMenu'): actionMenu.push(child); break;
            // group all Detail together
            case ((child as any)?.type?.displayName === 'Detail'): detailModal.push(child); break;
            // group all other children together
            default:
                regularChildren.push(child);
        }
    });

    // detect wrong usage (0-1 ActionMenu, 0-1 Detail)
    if(actionMenu.length > 1) throw new Error('AppFrame support only one <ActionMenu> component');
    if(detailModal.length > 1) throw new Error('AppFrame support only one <Detail> component');

    // detect which use case for this cycle
    const hasActionMenu = (actionMenu.length > 0);

    /** start - CSS classes aggegators **/
    const mainClasses = [
        coreStyle['apf-AppFrame'], 
        hasActionMenu ? coreStyle['apf-AppFrame--has-action-menu'] : coreStyle['apf-AppFrame--no-action-menu'], 
        isDesktop ? coreStyle['apf-AppFrame--desktop'] : coreStyle['apf-AppFrame--mobile']
    ].join(' ');

    const actionMenuClasses = [
        coreStyle['apf-AppFrame_ActionMenu'],
        themeStyle['apf-AppFrame_ActionMenu'],
        isDesktop ? themeStyle['apf-AppFrame_ActionMenu--desktop'] : themeStyle['apf-AppFrame_ActionMenu--mobile']
    ].join(' ');

    const detailClasses = [
        coreStyle['apf-AppFrame_Modal'],
        isDesktop ? coreStyle['apf-AppFrame_Modal--desktop'] : coreStyle['apf-AppFrame_Modal--mobile'],
        themeStyle['apf-AppFrame_Modal'],
        isDesktop ? themeStyle['apf-AppFrame_Modal--desktop'] : themeStyle['apf-AppFrame_Modal--mobile']
    ].join(' ');
    /** end - CSS classes aggegators **/

    // apply correct transition
    const modalTransition = useTransition(detailModal, isDesktop ? desktopModalTransitionProperties : mobileModalTransitionProperties);

    return (
        <main className={ mainClasses }>
            <div className={ coreStyle['apf-AppFrame_Content'] }>{ regularChildren }</div>
            { hasActionMenu ? <menu className={ actionMenuClasses }>{ actionMenu }</menu> : null }
            {modalTransition((style, detailModal) => 
                <animated.aside style={ style } className={ detailClasses }>
                    { detailModal }
                </animated.aside>
            )}
        </main>
    )
}

export default AppFrame;

/**
 * ACTION MENU
 * acts has header on desktop
 * act has tab menu on mobile bottom of screen
 */
type ActionMenuProps = {}
const ActionMenuFC:FC<ActionMenuProps> = ({ children }) => <>{ children }</>
ActionMenuFC.displayName = 'ActionMenu'; // force uglifier to keep full cmpnt name in prod build
export const ActionMenu = ActionMenuFC;

/**
 * DETAIL
 * display details in MASTER/DETAIL UI behavior
 * acts as side drawer on dektop
 * acts as modal window on mobile
 */
 type DetailProps = {}
 const DetailFC:FC<DetailProps> = ({ children }) => <>{ children }</>
 DetailFC.displayName = 'Detail'; // force uglifier to keep full cmpnt name in prod build
 export const Detail = DetailFC;