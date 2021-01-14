import React from 'react';

// ThoughtList component will receive two props: a title and the thoughts array
// We destructure the argument data to avoid using props.title and props.thoughts
const ThoughtList = ({ thoughts, title }) => {

    // conditionally render JSX by checking to see if there's even any data in the thoughts array
    if (!thoughts.length) {
        return <h3>No Thoughts Yet</h3>;
    }

    // If there is data, then we return a list of thoughts using the .map() method
    // as a reminder, the key prop helps React internally track which data needs to be re-rendered if something changes
    return (
        <div>
            <h3>{title}</h3>
            {thoughts &&
                thoughts.map(thought => (
                    <div key={thought._id} className="card mb-3">
                        <p className="card-header">
                            {thought.username}
                            thought on {thought.createdAt}
                        </p>
                        <div className="card-body">
                            <p>{thought.thoughtText}</p>
                            {/* check to see the value of thought.reactionCount */}
                            {/* conditionally displaying a message to contextualize what the call to action should be */}
                            <p className="mb-0">
                                Reactions: {thought.reactionCount} || Click to{' '}
                                {thought.reactionCount ? 'see' : 'start'} the discussion!
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ThoughtList;