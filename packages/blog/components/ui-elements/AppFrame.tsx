import { FC, ReactNode, Children } from 'react';
import { useBreakpointMatcher } from '../../hooks/useBreakpointMatcher';
import coreStyle from '../../styles/AppFrame.core.module.scss';
import themeStyle from '../../styles/AppFrame.theme.module.scss';

type AppFrameProps = {
    desktopBreakpoint: number,
    modal: ReactNode|null,
    actionsChildren?: ReactNode,
};

const AppFrame:FC<AppFrameProps> = ({ desktopBreakpoint, modal, actionsChildren, children }) => {
    const isDesktop = useBreakpointMatcher(windowWidth => desktopBreakpoint <= windowWidth);
    const hasActionMenu = Children.count(actionsChildren) !== 0;

    return (
        <main className={ `${ coreStyle['apf-AppFrame'] } ${ hasActionMenu ? coreStyle['apf-AppFrame--has-action-menu'] : coreStyle['apf-AppFrame--no-action-menu'] } ${ isDesktop ? coreStyle['apf-AppFrame--desktop'] : coreStyle['apf-AppFrame--mobile'] }` }>
            <div className={ coreStyle['apf-AppFrame_Content'] }>{ children }</div>
            { hasActionMenu ? <menu className={ `${ coreStyle['apf-AppFrame_ActionMenu'] } ${ themeStyle['apf-AppFrame_ActionMenu'] } ${ isDesktop ? themeStyle['apf-AppFrame_ActionMenu--desktop'] : themeStyle['apf-AppFrame_ActionMenu--mobile'] }` }>{ actionsChildren }</menu> : null }
            { (modal) ? <aside className={ `${ coreStyle['apf-AppFrame_Modal'] } ${ isDesktop ? coreStyle['apf-AppFrame_Modal--desktop'] : coreStyle['apf-AppFrame_Modal--mobile'] } ${ themeStyle['apf-AppFrame_Modal'] } ${ isDesktop ? themeStyle['apf-AppFrame_Modal--desktop'] : themeStyle['apf-AppFrame_Modal--mobile'] }` }>{ modal }</aside> : null }
        </main>
    )
}

export default AppFrame;