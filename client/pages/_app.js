// Archivo principal
import { ApolloProvider } from '@apollo/client';
import Client from '../config/apollo';
import './index.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={Client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
