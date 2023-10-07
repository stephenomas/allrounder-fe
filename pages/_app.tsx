import '../styles/globals.css'
import 'tailwindcss/tailwind.css';
import { QueryClient, QueryClientProvider,  } from '@tanstack/react-query';
import React from 'react'
import { Windmill } from '@roketid/windmill-react-ui'
import type { AppProps } from 'next/app'
import {Provider} from 'react-redux'
import store from '../store/index';

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!process.browser) React.useLayoutEffect = React.useEffect;
  const query = new QueryClient()
  return (
    <Provider store={store}>
      <QueryClientProvider client={query}>
        <Windmill usePreferences={true}>
          <Component {...pageProps} />
        </Windmill>
      </QueryClientProvider>
    </Provider>
  );
}
export default MyApp
