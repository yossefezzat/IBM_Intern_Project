import React from 'react';
import './style.css';
export default class WordChart extends React.Component{
    state = {
        transforms: []
    }
    componentDidMount(){
        this.moveWords();
        this.interval = window.setInterval(this.moveWords, 4000)
    }
    moveWords = () => {
        const words = document.querySelectorAll('.word');
        let transforms = [];
        const computedWidth = window.innerWidth > 800 ? 800 : window.innerWidth;
        [].slice.call(words).forEach((word) => {
            const x = Math.random() * computedWidth;
            const y = Math.random() * 400;
            transforms.push(`translate(${x}px, ${y}px)`);
        });
        console.log(transforms);
        this.setState({
            transforms
        })
    }
    componentWillUnmount(){
        window.clearInterval(this.interval || null);
    }
    render(){
        const words = [
            {text: "RD", count: 50},
            {text: "IBM", count: 53},
            {text: "Regression", count: 30},
            {text: "Spider-Man", count: 23},
            {text: "Anarchy", count: 43},
            {text: "Capitalism is doomed!", count: 99},
        ];
        this.length = words.length;
        const maxCount = words.reduce((acc, curr) => curr.count > acc ? curr.count : acc, 0) 
        const base = 120;
        return (
            <div className="wordsContainer my-5 col-md-8 col-sm-12 text-left">
                {words.map((word, i) => {
                    return (
                        <span className="word" style={{
                            opacity: word.count / maxCount > 0.4 ? word.count / maxCount : 0.4,
                            fontSize: (word.count / maxCount) * base + "px",
                            transform: this.state.transforms[i] 
                        }}>{word.text}</span>
                    )
                })}
            </div>
        );
    }
}