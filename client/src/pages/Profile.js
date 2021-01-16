import React from 'react';

// import hook
// Redirect will allow us to redirect the user to another route within the application
import { Redirect, useParams } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

// destructure the mutation function from ADD_FRIEND so we can use it in a click function
import { ADD_FRIEND } from '../utils/mutations';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = () => {

  const [addFriend] = useMutation(ADD_FRIEND);

  // useParams Hook retrieves the username from the URL, which is then passed to the useQuery Hook
  const { username: userParam } = useParams();

  // useParams() Hook we use will have a value if it's another user's profile and won't have a value if it's ours
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  // handle each type of response
  // when we run QUERY_ME, the response will return with our data in the me property; 
  // when we run QUERY_USER instead, the response will return with our data in the user property
  const user = data?.me || data?.user || {};

  // redirect to personal profile page if username is the logged-in user's
  // check if user is logged in and, if so, if the username stored in the JSON Web Token is the same as the userParam value. 
  // If they match, we return the <Redirect> component with the prop to set to the value /profile, which will redirect the user away from this URL and to the /profile route
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }
  
  // callback function that utilizes the addFriend() mutation function
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {/* conditionally render the button since you do not want to befriend yourself */}
        {/* userParam variable is only defined when the route includes a username  */}
        {userParam && (
          // include button for add friend with onClick attribute with handleClick call function
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>

      {/* use the userParam variable to make sure the form only displays on the user's own Profile page, not on other users' pages */}
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>

    </div>
  );
};

export default Profile;
