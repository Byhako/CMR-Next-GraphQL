import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import fetch from 'node-fetch';

const HttpLink = createHttpLink({
  uri: 'http://localhost:4000',
  fetch
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : ''
    }
  }
});

const Client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(HttpLink)
});

export default Client;
