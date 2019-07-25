import React from 'react';
import './style.css';
import Tweets from '../Tweets';
import WordChart from '../WordChart';
import Chart from 'chart.js';


export default class Charts extends React.Component {

    getSentimentData() {
        return fetch('https://ibm.articlebox.net/sentiment_analysis')
            .then(resp => resp.json())
    }
    getSentimentDataTime() {
        return fetch('https://ibm.articlebox.net/sentiment/over-time')
            .then(resp => resp.json())
    }
    getEmotionDataTime() {
        return fetch('https://ibm.articlebox.net/emotion/over-time')
        .then(resp => resp.json());
    }
    getLabels(data) {
        // positive: value.label === "positive" ? 1 : 0,
        // negative: value.label === "negative" ? 1 : 0,
        // neutral: value.label === "neutral" ? 1 : 0,
        // time: value.time
        const startTime = new Date('Mon Jul 22 09:25:35 +0000 2019');
        return data.map((day, i) => {
            if(!day || !day.time) return '2019-07-23'
            const d = new Date(startTime.getTime() + (1000 * 60 * 60 * 24 * i));
            const isoString = d.toISOString();
            const tIndex = isoString.indexOf('T');
            return isoString.slice(0, tIndex);
        });
    }
    async componentDidMount() {
        const sentimentData = await this.getSentimentData();
        const sentimentSum = sentimentData.negative + sentimentData.positive + sentimentData.neutral;
        const dataSentimentPie = {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                    label: sentimentSum,
                    data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
                    backgroundColor: [
                        'teal',
                        '#317cc6',
                        '#cc1100',
                    ],
                    borderColor: [
                        '#000',
                        '#000',
                        '#000',
                    ],
                    borderWidth: 1
                }]
            }
        };
        const sentimentDataTime = await this.getSentimentDataTime();
        let labels = this.getLabels(sentimentDataTime);
        const dataSentimentTime = {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'positive',
                        data: sentimentDataTime.map(day => day && day.positive ? day.positive : 0),
                        backgroundColor: '#teal',
                        borderColor: 'teal',
                        fill: false,
                    },
                    {
                        label: 'neutral',
                        data: sentimentDataTime.map(day => day && day.neutral ? day.neutral : 0),
                        backgroundColor: '#317cc6',
                        borderColor: '#317cc6',
                        fill: false,
                    },
                
                    {
                        label: 'negative',
                        data: sentimentDataTime.map(day => day && day.negative ? day.negative : 0),
                        backgroundColor: '#cc1100',
                        borderColor: '#cc1100',
                        fill: false,
                    }]
            }
        };
        const emotionDataTime = await this.getEmotionDataTime();
        labels = this.getLabels(emotionDataTime);

        const dataEmotionTime = {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'anger',
                        data: emotionDataTime.map(day => day && day.anger ? Math.round(day.anger) : 0),
                        backgroundColor: '#cc1100',
                        borderColor: '#cc1100',
                        fill: false,
                    }, 
                    {
                        label: 'disgust',
                        data: emotionDataTime.map(day => day && day.disgust ? Math.round(day.disgust) : 0),
                        backgroundColor: '#8AC33E',
                        borderColor: '#8AC33E',
                        fill: false,
                    }, 
                    {
                        label: 'fear',
                        data: emotionDataTime.map(day => day && day.fear ? Math.round(day.fear) : 0),
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        fill: false,
                    },
                    {
                        label: 'joy',
                        data: emotionDataTime.map(day => day && day.joy ? Math.round(day.joy) : 0),
                        backgroundColor: '#CA2260',
                        borderColor: '#CA2260',
                        fill: false,
                    },
                
                    {
                        label: 'sadness',
                        data: emotionDataTime.map(day => day && day.sadness ? Math.round(day.sadness) : 0),
                        backgroundColor: '#DADB27',
                        borderColor: '#DADB27',
                        fill: false,
                    }]
            }
        };

        let ctx = document.getElementById('myChart');
        if (!ctx) return;
        new Chart(ctx, dataSentimentPie);
        let ctx2 = document.getElementById('myChart1');
        if (!ctx2) return;
        new Chart(ctx2, dataSentimentTime);
        let ctx3 = document.getElementById('myChart2');
        if (!ctx3) return;
        new Chart(ctx3, dataEmotionTime);
        ctx = document.getElementById('myChart3');
        if (!ctx) return;
        new Chart(ctx, dataSentimentPie);
        ctx2 = document.getElementById('myChart4');
        if (!ctx2) return;
        new Chart(ctx2, dataSentimentTime);
        ctx3 = document.getElementById('myChart5');
        if (!ctx3) return;
        new Chart(ctx3, dataEmotionTime);
    }

    render() {

        return (

            <section class="canvas pb-5 bg-light">
                <div className="tweetsContainer">
                    <h1 class=" H pt-5 py-2 ">Recent Feedbacks</h1>
                    <Tweets isSlider={true} />
                    <h1 class=" H pt-5 py-2 ">Keywords</h1>
                    <WordChart />
                </div>

                <h1 class=" H pt-5 py-2 "> Charts</h1>

                < div class="container my-5 ">

                    <div className="row">

                        <div className="col-md-12 text-center">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li key={Math.random().toString(32).replace('.', '')} className="nav-item col-sm-3 text-center">
                                    <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">ALL</a>
                                </li>
                                <li key={Math.random().toString(32).replace('.', '')} className="nav-item col-sm-3 text-center">
                                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">TOTAL NUM OF TWEETS</a>
                                </li>
                                <li key={Math.random().toString(32).replace('.', '')} className="nav-item col-sm-3 text-center">
                                    <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">SENTMENT OVER TIME</a>
                                </li>
                                <li key={Math.random().toString(32).replace('.', '')} className="nav-item col-sm-3 text-center">
                                    <a className="nav-link " id="pills-MENTORS-tab" data-toggle="pill" href="#pills-MENTORS" role="tab" aria-controls="pills-MENTORS" aria-selected="false">EMOTIONAL TONE OVER TIME</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">

                        <div class="container">

                            <div class="row">

                                <div class="col-md-4 mb-5">
                                    <canvas id="myChart" width="400" height="400"></canvas>
                                </div>
                                <div key={Math.random().toString(32).replace('.', '')} className="col-md-4 mb-5">
                                    <canvas id="myChart1" width="400" height="400"></canvas>
                                </div>
                                <div key={Math.random().toString(32).replace('.', '')} className="col-md-4 mb-5">
                                    <canvas id="myChart2" width="400" height="400"></canvas>
                                </div>
                            </div>
                        </ div>
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">

                        <div className="container">

                            <div className="row">

                                <div class=" ch text-center" style={{
                                    width: 'calc(100vh - 80px)'
                                }}>
                                    <div class=" col-sm-12 ">
                                        <canvas style={{ margin: '1em auto' }} id="myChart3" width="400" height="400"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">

                        <div className="container">

                            <div className="row">

                                <div class="ch text-center" style={{
                                    width: 'calc(100vh - 80px)'
                                }}>

                                    <div class="  col-sm-12 ">
                                        <canvas id="myChart4" width="400" height="400"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="pills-MENTORS" role="tabpanel" aria-labelledby="pills-MENTORS-tab">

                        <div className="container">

                            <div className="row">



                                <div class=" ch text-center" style={{
                                    width: 'calc(100vh - 80px)'
                                }}>
                                    <div class="  col-sm-12 ">
                                        <canvas id="myChart5" width="400" height="400"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        )

    }
}