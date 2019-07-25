import React from 'react';
import Tweet from '../Tweet';
import './style.css';

import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';


/**
 * @description Component responsiple for rendering and controlling any list of tweets.
 * @description Renders tweets as a slider or as a paginated full screen list.
 * @extends {React.Component}
 */
export default class Tweets extends React.Component {
    /**
    * @constructor
    * @description initializes the component state with tweets list.
    * @todo When API is ready, fetch it from server. 
    * @description Binds `this` to the component in event handlers.
    * @param {Object} props 
    */
    constructor(props) {
        super(props);
        this.state = {
            tweets: [
                {
                    user: {
                    },
                    tweet: {
                        content: 'Loading...',
                    },
                    analysis: {
                        emotions: [
                            { anger: 1 }
                        ],
                        sentiment: {
                            label: null,
                            value: null
                        }
                    }
                }
            ]

        }
        this.numCalls = 0;
        this.handleScroll = this.handleScroll.bind(this);
        this.handleAspectRatio = this.handleAspectRatio.bind(this);
    }

    /**
     * @description Checks if the component will be used as a slider as in `Charts` page.
     * @description If so, it calls `this.handleAspectRatio` and binds it to `window.onresize` event.
     * @returns {null}
     */
    componentDidMount() {
        const { isSlider } = this.props;
        if (isSlider) {
            this.handleAspectRatio();
            window.onresize = this.handleAspectRatio;
        }else{
            this.handleScroll();
        }
        this.getTweets(0)
        .then(tweets => {
            this.setState({
                tweets
            });
        })
    }
    getTweets(skipCount){
        this.numCalls++;
        return fetch('https://ibm.articlebox.net/tweets?skipCount='+skipCount)
        .then(resp => resp.json())
        .then(tweets => {
            const { rows } = tweets;
            const _tweets = rows.map(row => {
                row = row.value;
                let tweet = {};
                tweet.user = {
                    handle: row.username,
                    name: row.displayName,
                    id: row.userID,
                    imageURL: row.userImageURL
                };
                tweet.tweet = {
                    content: row.tweetText,
                    timestamp: row.timestamp,
                    retweets: 5,
                    loved: 20,
                    id: row.tweetID,
                    entities: row.entities,
                }
                tweet.keywords = row.nlu.keywords;
                tweet.entities = [];
                row.entities.hashtags.map(hashtag => {
                    tweet.entities.push({
                        type: 'hashtag',
                        value: hashtag.text
                    });
                });
                row.entities.urls.map(url => {
                    tweet.entities.push({
                        type: 'url',
                        value: url.url
                    });
                });
                row.entities.user_mentions.map(user => {
                    tweet.entities.push({
                        type: 'user',
                        value: user.name,
                        handle: user.screen_name
                    });
                });
                tweet.analysis = {
                    emotions: row.tone.tones.map(tone => {
                        return {
                            [tone.tone_id]: tone.score
                        }
                    }),
                    sentiment: {
                        label: row.nlu.sentiment.document.label,
                        value: row.nlu.sentiment.document.score
                    }
                }
                return tweet;
            });
            return _tweets
        });
    }
    /**
     * @description Modify's the aspect ratio of the slider to prevent glitching and/or unwanted behaviour.
     * @description Updates the component state with the new aspect ratio. 
     * @returns {null}
     */
    handleAspectRatio() {
        const tweets = document.querySelectorAll('.tweetContainer')
        let maxHeight = 0;
        for (const tweet of tweets) {
            const rect = tweet.getBoundingClientRect();
            if (rect.height > maxHeight) maxHeight = rect.height;
        }
        const width = window.innerWidth * 0.95;
        this.setState({
            width,
            height: maxHeight + 55
        });
    }
    handleScroll() {
        window.onscroll = (e) => {
            if(document.scrollingElement.scrollHeight - document.scrollingElement.scrollTop === window.innerHeight){
                this.getTweets(this.numCalls * 15)
                .then(tweets => {
                    this.setState({
                        tweets: [...this.state.tweets, ...tweets]
                    })
                })
            }
        }
    }
    /**
     * @description Responsible for rendering the component, hides & shows the dialogue based on `state.dialogShown`
     * @returns {JSX}
     */
    render() {
        const { isSlider } = this.props;
        const numTweets = (this.state.tweets || []).length;
        if (isSlider) {
            return (
                <CarouselProvider isPlaying={true}
                    interval={3000}
                    naturalSlideWidth={this.state.width || 800}
                    naturalSlideHeight={this.state.height || 203}
                    totalSlides={numTweets >= 5 ? 5 : numTweets}
                    className="slider"
                >
                    <Slider>
                        {this.state.tweets.slice(0, 5).map((tweet, i) => {
                            return (
                                <Slide key={Math.random().toString(32).replace('.', '')} index={i}>
                                    <Tweet isSlider={true} data={tweet} />
                                </Slide>
                            )
                        })}
                    </Slider>

                    <ButtonBack className="controlBtn backBtn">
                        <svg viewBox="0 0 24 24">
                            <path fill="#ffffff" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                        </svg>
                    </ButtonBack>
                    <ButtonNext className="controlBtn nextBtn">
                        <svg viewBox="0 0 24 24">
                            <path fill="#ffffff" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                        </svg>
                    </ButtonNext>
                </CarouselProvider>
            )
        } else {
            return (
                <div className="tweetsList">
                    {this.state.tweets.map(tweet => <Tweet key={Math.random().toString(32).replace('.', '')} data={tweet} />)}
                </div>
            )
        }

    }
}