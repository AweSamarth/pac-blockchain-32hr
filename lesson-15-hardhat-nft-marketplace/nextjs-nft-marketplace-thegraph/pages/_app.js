import '@/styles/globals.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'


const client = new ApolloClient({
  cache:new InMemoryCache(),
  uri:"https://api.studio.thegraph.com/query/43422/nft-marketplace/0.0.1",
  
})

export default function App({ Component, pageProps }) {
  return (
  <MoralisProvider initializeOnMount={false}>
  <ApolloProvider client={client}>
  <NotificationProvider>
  <Component {...pageProps} />
  </NotificationProvider>
  </ApolloProvider>
  </MoralisProvider>
  
  )


}
