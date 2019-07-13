import React from 'react';
import Tweet from '../Tweet';

export default class Tweets extends React.Component {

    state = {
        tweets: [
            {
                user: {
                    handle: '__atwa',
                    name: 'Mahmoud',
                    id: 'ffas1166s6f',
                    imageURL: 'http://simpleicon.com/wp-content/uploads/user1.png'
                },
                tweet: {
                    content: 'This is dobe. @IBM',
                    timestamp: 13334465,
                    retweets: 5,
                    loved: 20,
                    id: 1111111111119774,
                    entities: [
                        {TwitterHandle: '@IBM'},
                    ]
                },
                analysis: {
                    emotions: [
                        {sadness: 0.1793},
                        {joy: 0.55},
                        {fear: 0.001},
                        {anger:  0.0035}
                    ],
                    sentiment: {
                        label: 'negative',
                        value: -0.319 
                    }
                }
            }
        ]
    }

    render(){
        return <Tweet data={this.state.tweets[0]} />
    }
}