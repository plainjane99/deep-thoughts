import React from 'react';

// import 'useParams' react hook
import { useParams } from 'react-router-dom';

// import useQuery hook 
import { useQuery } from '@apollo/react-hooks';
// import query
import { QUERY_THOUGHT } from '../utils/queries';

import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';

import Auth from '../utils/auth';

const SingleThought = props => {

  // deconstruct 'id' from react hook
  const { id: thoughtId } = useParams();
  console.log(thoughtId);

  // loading and data destructured from useQuery hook
  // loading variable is then used to briefly show a loading <div> element
  // data variable populates the 'thought' object
  // The useQuery Hook has a second argument in the form of an object. 
  // This is how you can pass variables to queries that need them. 
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // The id property on the variables object will become the $id parameter in the GraphQL query
    variables: { id: thoughtId }
  });
  
  const thought = data?.thought || {};
  console.log(thought);

  if (loading) {
    return <div>Loading...</div>;
  }

  // loading variable is then used to briefly show a loading <div> element
  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}

      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}

    </div>
  );
};

export default SingleThought;
