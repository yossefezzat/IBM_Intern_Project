//Libs & Components
import React from 'react';
import { LazyLoadImage as Img } from 'react-lazy-load-image-component';

//Style
import './style.css';

//Emoji
import sadness from './assets/sadness.png';
import fear from './assets/fear.png';
import anger from './assets/anger.png';
import joy from './assets/joy.png';
import disgust from './assets/disgust.png';
const EMOJI = {
    sadness, fear, anger, joy, disgust
}
export default class Tweet extends React.Component {

    constructor(props) {
        super(props);

        this.emojiHeight = 30;
        this.emojiWidth = 30;
        this.tone = null;
    }

    componentDidMount() {
        console.log(this.props.data);
    }


    extractTone(emotions) {
        if (this.tone) {
            return this.tone;
        }
        let major = { NA: 0 }
        let KEY_PREV = 'NA';
        for (const emotion of emotions) {
            const KEY = (Object.keys(emotion) || []).pop();
            if (!KEY) continue;
            if (emotion[KEY] > major[KEY_PREV]) {
                major = emotion[KEY];
                KEY_PREV = KEY;
            }
        }
        return { label: KEY_PREV, value: major[KEY_PREV] };
    }


    getEmoji(emotions) {
        this.tone = this.extractTone(emotions);
        return EMOJI[this.tone.label];
    }

    render() {
        const { data } = this.props;
        return (
            // <div className="dataContainer">
                <div className="tweetContainer">
                    <div className="userContainer">
                        <div className="userImage" style={{
                            backgroundImage: `url(${data.user.imageURL})`
                        }}></div>
                        <div className="userNameInfo">
                            <h4 className="userDisplayName">{data.user.name}</h4>
                            <h5 className="userHandle">@{data.user.handle}</h5>
                        </div>
                    </div>
                    <div className="tweetContent">
                        {data.tweet.content}
                    </div>
                    <div className="info">
                        <p className="timestamp">{new Date(data.tweet.timestamp).toUTCString()}</p>
                        <Img className="emoji"
                            src={this.getEmoji(data.analysis.emotions)}
                            alt={this.tone.label}
                            height={this.emojiHeight}
                            width={this.emojiWidth} />
                    </div>
                </div>
            // </div>
        )
    }
}