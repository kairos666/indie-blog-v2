import '../styles/globals.scss';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import type { AppProps } from 'next/app';

/* APP generic Error handling */
function ErrorFallback({ error }:FallbackProps) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
        </div>
    )
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary FallbackComponent={ ErrorFallback }>
            <Component {...pageProps} />
        </ErrorBoundary>
    );
}

export default MyApp;
