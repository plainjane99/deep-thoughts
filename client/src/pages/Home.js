import React from 'react';

// importing the useQuery Hook from Apollo's React Hooks library
// This will allow us to make requests to GraphQL server we connected to
// and made available to the application using the <ApolloProvider> component in App.js
import { useQuery } from '@apollo/react-hooks';
// import queries we created
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';

// check the logged-in status of a user
// use the authentication service functionality we created to conditionally render how the page will look
import Auth from '../utils/auth';

// import components
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

const Home = () => {

  // When we load the Home component in the application, we'll execute the query for the thought data
  // use useQuery hook to make query request
  // Apollo's react-hooks library provides a loading property to indicate that the request isn't done just yet (asynchronous)
  // When it's finished and we have data returned from the server, that information is stored in the destructured data property
  // with the loading property, we'll be able to conditionally render data based on whether or not there is data to even display
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // retrieve the logged-in user's friend list to be printed
  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  // if the user is logged in and has a valid token, userData will hold all of the returned information from our query
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  // get the thought data out of the query's response
  // using optional chaining which negates the need to check if an object even exists before accessing its properties
  // In this case, no data will exist until the query to the server is finished
  // if data exists, store it in the thoughts constant we just created
  // if data is undefined, then save an empty array to the thoughts component
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        {/* conditional layout for this <div>. 
        If the user isn't logged in, span the full width of the row. 
        if the user is logged in, span eight columns */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* use a ternary operator to conditionally render the <ThoughtList> component */}
          {/* If the query hasn't completed and loading is still defined, we display a message to indicate just that */}
          {loading ? (
            <div>Loading...</div>
          ) : (
              // Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props
              <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
            )}
        </div>

        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}

      </div>
    </main>
  );
};

export default Home;
