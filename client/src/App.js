import React from 'react';

// import apollo libraries
// @apollo/apollo-hooks is Apollo's library for using React Hooks functionality with Apollo queries and mutations. We have to include the @apollo/ prefix because apollo-hooks is never used on its own—only alongside other Apollo libraries
// ApolloProvider, is a special type of React component that we'll use to provide data to all of the other components
import { ApolloProvider } from '@apollo/react-hooks';
// apollo-boost serves as the means of making requests to the server like standard apollo but includes helper libraries
// ApolloClient gets the data provided by apolloprovider when we're ready to use it.
import ApolloClient from 'apollo-boost';
// import BrowserRouter and Route components from react-router library
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import page components
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// establish the connection to the back-end server's /graphql endpoint using apollo
const client = new ApolloClient({
  // /graphql is the endpoint
  // we set up the server path in package.json as "proxy"
  // the Create React App team set up the development server to prefix all HTTP requests using relative paths
  uri: '/graphql'
});

function App() {
  return (
    // we wrap the entire returning JSX code with <ApolloProvider>
    // Because we're passing the client variable in as the value for the client prop in the provider
    // everything between the JSX tags will eventually have access to the server's API data through the connection (i.e. client) we set up
    <ApolloProvider client={client}>
      {/* wrap the <div className="flex-column"> element in a Router component, which makes all of the child components on the page aware of the client-side routing that can take place now */}
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          {/* in this div, set up Route components where content will change according to the URL route */}
          <div className='container'>
            {/* set up a switch */}
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              {/* ? means the parameter is optional */}
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />
              {/* set a catch-all route if route doesn't match any of the above*/}
              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
