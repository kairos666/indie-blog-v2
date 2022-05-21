import NextImage from "next/image";

// opt-out of image optimization, no-op
const customLoader = ({ src }:{ src:string }) => src;

export default function Image(props:any) {
    return (
        <NextImage {...props} unoptimized={ true } loader={ customLoader }/>
    );
}