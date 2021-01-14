import React from 'react';

// importing the useQuery Hook from Apollo's React Hooks library
// This will allow us to make requests to GraphQL server we connected to
// and made available to the application using the <ApolloProvider> component in App.js
import { useQuery } from '@apollo/react-hooks';
// import queries we created
import { QUERY_THOUGHTS } from '../utils/queries';

// import components
import ThoughtList from '../components/ThoughtList';

const Home = () => {

  // When we load the Home component in the application, we'll execute the query for the thought data
  // use useQuery hook to make query request
  // Apollo's react-hooks library provides a loading property to indicate that the request isn't done just yet (asynchronous)
  // When it's finished and we have data returned from the server, that information is stored in the destructured data property
  // with the loading property, we'll be able to conditionally render data based on whether or not there is data to even display
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // get the thought data out of the query's response
  // using optional chaining which negates the need to check if an object even exists before accessing its properties
  // In this case, no data will exist until the query to the server is finished
  // if data exists, store it in the thoughts constant we just created
  // if data is undefined, then save an empty array to the thoughts component
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {/* use a ternary operator to conditionally render the <ThoughtList> component */}
          {/* If the query hasn't completed and loading is still defined, we display a message to indicate just that */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            // Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props
              <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
            )}
        </div>
      </div>
    </main>
  );
};

export default Home;
