import React, { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {

    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    // this is our useMutation Hook
    // declare our addThought function to run the mutation
    // error variable will initially be undefined but can change depending on if the mutation failed
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        // In the update() function, addThought represents the new thought that is created
        // Using the cache object, we can read what's currently saved in the QUERY_THOUGHTS cache and then update it with writeQuery() to include the new thought object
        update(cache, { data: { addThought } }) {

            try {
                // could potentially not exist yet, so wrap in a try...catch
                // read what's currently in the cache
                const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

                // prepend the newest thought to the front of the array
                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: { thoughts: [addThought, ...thoughts] }
                });
            } catch (e) {
                console.error(e);
            }

            // update me object's cache, appending new thought to the end of the array
            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
            });
        }
    });

    // function for handling number of characters input into field
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    // function for handling submission of text
    // adds the thought and clears the text field and resets character count
    const handleFormSubmit = async event => {

        event.preventDefault();

        try {
            // add thought to database
            await addThought({
                variables: { thoughtText }
            });

            // clear form value
            setText('');
            setCharacterCount(0);

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>

                Character Count: {characterCount}/280

                {/* conditionally render an error if there is one (ex. hitting submit without any test) */}
                {error && <span className="ml-2">Something went wrong...</span>}

            </p>
            <form
                className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ThoughtForm;