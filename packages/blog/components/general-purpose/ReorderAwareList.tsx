import { FC } from 'react';
import { useTransition, animated } from '@react-spring/web';
// example https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/list-reordering?file=/src/data.ts
// alternative example https://codesandbox.io/s/react-spring-list-reorder-example-forked-9cr59c?file=/src/components/ReorderAwareList.js:614-667
// doc https://react-spring.io/hooks/use-transition#usetransition

type ReorderAwareListProps = {
    keyProp: string,
    data: any[]
};

const ReorderAwareList:FC<ReorderAwareListProps> = ({ keyProp, data }) => {
    let height = 0;
    let itemHeight = 100;
    const transitions = useTransition(
        data.map(item => ({ data: item, height: itemHeight, y: (height += itemHeight) - itemHeight })),
        {
            key: (item:any) => item[keyProp],
            from: { height:0, opacity:0 },
            leave: { height:0, opacity:0 },
            enter: ({ y, height }) => ({ y, height, opacity: 1 }),
            update: ({ y, height }) => ({ y, height }),
        }
    );
    
    return (
        <ol style={ { height, position: 'relative' } }>
            {transitions((style, item, t, index) => (
                <animated.li style={{ position: 'absolute', willChange: 'transform, height, opacity', width: '100%', zIndex: data.length - index, ...style }}>
                    <div>
                        <h2>{ item.data?.meta?.name }<span>{ item.data.currentRank }<span>elo</span></span></h2>
                    </div>
                </animated.li>
            ))}
        </ol>
    )
}

export default ReorderAwareList;