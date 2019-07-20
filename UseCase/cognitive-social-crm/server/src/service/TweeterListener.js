// import Cloudant from '@cloudant/cloudant';
import { Promise } from 'es6-promise';
import moment from 'moment';
import Twit from 'twit';
import winston from 'winston';
import config from '../config';
import { CloudantDAO } from '../dao/CloudantDAO';
import { OutputFormatter } from '../util/OutputFormatter';

export class TweeterListener {
  static getInstance(options, enrichmentPipeline) {
    if (this.tweeterListener === undefined) {
      this.tweeterListener = new TweeterListener(options, enrichmentPipeline);
    }
    return this.tweeterListener;
  }

  static tweeterListener;

  status;
  options;
  twitterClient;
  outCount;
  stream;
  cloudantDAO;
  outputFormatter;
  enrichmentPipeline;

  LOGGER = winston.createLogger({
    level: config.log_level,
    transports: [
      new winston.transports.Console({ format: winston.format.simple() })
    ]
  });

  constructor(options, enrichmentPipeline) {
    this.options = options;
    this.options.listenFor = config.listenFor || '';
    this.options.listenTo = config.listenTo || '';
    this.options.filterContaining = config.filterContaining || '';
    this.options.filterFrom = config.filterFrom || '';
    this.options.processRetweets = config.processRetweets || false;

    // Initialize the Status object
    this.status = {
      listening: 'N/A',
      started_at: new Date(),
      received: 0,
      filtered: 0,
      saved: 0,
      errors: 0,
      last_received_at: undefined,
      last_error: undefined,
      state: 'initialized'
    };

    // If the max isn't specified in the options, then set it to unlimited for listen.  100 for search.
    if (!this.options.max) {
      this.options.max = -1;
    }
    this.outCount = 0;

    const cloudantOptions = {};
    cloudantOptions.maxBufferSize = 1;
    this.cloudantDAO = CloudantDAO.getInstance(options, enrichmentPipeline);

    this.outputFormatter = new OutputFormatter();
    this.enrichmentPipeline = enrichmentPipeline;

    const twitOptions = {};
    twitOptions.consumer_key = config.consumer_key || '';
    twitOptions.consumer_secret = config.consumer_secret || '';
    twitOptions.access_token = config.access_token;
    twitOptions.access_token_secret = config.access_token_secret;
    twitOptions.timeout_ms = 60 * 1000; // optional HTTP request timeout to apply to all requests.

    if (
      !twitOptions.consumer_key === '' ||
      twitOptions.consumer_secret === '' ||
      twitOptions.access_token === '' ||
      twitOptions.access_token_secret === ''
    ) {
      this.twitterClient = null;
      this.status.state = 'not initialized';
      this.LOGGER.info('Tweet listener is not initialized.');
    } else {
      this.twitterClient = new Twit(twitOptions);
      this.LOGGER.info('Tweet listener initialized.');
    }
  }

  /**
   * Initialzes user ids if `listen to` setting is used
   */
  init() {
    return new Promise((resolve, reject) => {
      if (this.twitterClient !== null) {
        try {
          if (this.options.listenTo) {
            this.lookupUsers(this.options.listenTo).then(
              userIds => {
                this.options.userIds = userIds;
                resolve();
              },
              err => {
                this.LOGGER.error(err);
                reject(err);
              }
            );
          } else {
            resolve();
          }
        } catch (err) {
          this.LOGGER.error(err);
          reject(err);
        }
      } else {
        resolve({
          status: 'Twitter Client cannot be initialized. Using Sample Data'
        });
      }
    });
  }

  /**
   * Lookup screen_names for user ids.
   * Required when you want to listen for tweets
   * from a specific Twitter user.
   * @param listenTo
   */
  lookupUsers(listenTo) {
    return new Promise((resolve, reject) => {
      try {
        const userIds = [];
        // Retrieve the User ID's from Twitter for the requested Screennames
        const twitParams = {};
        twitParams.screen_name = listenTo;
        this.twitterClient
          .get('users/lookup', twitParams)
          .catch(err => {
            this.LOGGER.error(err.stack);
            reject(err.stack);
          })
          .then(result => {
            const promiseRespnose = result;
            if (!(promiseRespnose.resp.statusCode === 200)) {
              return reject('Error while getting user ids');
            }
            const twitterResponses = promiseRespnose.data;
            for (const twitterResponse of twitterResponses) {
              userIds.push(twitterResponse.id_str);
            }
            resolve(userIds);
          });
      } catch (err) {
        this.LOGGER.error(err);
        reject(err);
      }
    });
  }

  startListener() {
    // Check that there isn't a listener already started.
    if (this.status.state === 'started') {
      this.LOGGER.error(
        'Twitter Listener requested to be started, but there is one already running.'
      );
      return;
    }
    if (this.status.state === 'not initialized') {
      return;
    }
    if (this.options.listenTo) {
      this.LOGGER.info('Twitter listening TO: ' + this.options.listenTo);
      this.status.listening = this.options.listenTo;
      const twitParams = {};
      twitParams.lang = 'en';
      twitParams.follow = this.options.userIds;
      this.status.listening = this.options.listenTo;
      this.stream = this.twitterClient.stream('statuses/filter', twitParams);
    } else {
      this.LOGGER.info('Twitter listening for: ' + this.options.listenFor);
      this.status.listening = this.options.listenFor;
      const twitParams = {};
      twitParams.lang = 'en';
      twitParams.track = this.options.listenFor;
      this.status.listening = this.options.listenFor;
      this.stream = this.twitterClient.stream('statuses/filter', twitParams);
    }
    // Update the status to started.
    this.status.state = 'started';
    this.status.started_at = new Date();
    delete this.status.paused_at;
    delete this.status.will_resume_at;

    this.stream.on('error', err => {
      this.LOGGER.error(err);
    });

    this.stream.on('tweet', tweet => {
      this.LOGGER.info('Tweet:: ' + JSON.stringify(tweet));
      this.receiveTweet(tweet);
    });
    this.LOGGER.info('Tweet Listener is started.');
  }

  receiveTweet(tweet) {
    try {
      this.LOGGER.silly('Tweet Received: ' + JSON.stringify(tweet));
      if (tweet.text.length < 10) {
        this.LOGGER.debug('Tweet Length to short to process.');
        return;
      }
      this.status.last_received_at = new Date();
      this.status.received++;
      // Filter the tweets.
      if (!this.options.processRetweets && tweet.retweeted_status) {
        this.status.filtered++;
        this.LOGGER.debug('Retweet filter applied');
        return;
      }
      if (this.options.filterFrom === tweet.user.screen_name) {
        this.status.filtered++;
        this.LOGGER.debug('Screen name filter applied');
        return;
      }
      if (tweet.extended_tweet && tweet.extended_tweet.full_text) {
        this.LOGGER.debug('Using the extended text.');
        tweet.text = tweet.extended_tweet.full_text;
      }
      const s = this.options.filterContaining.split(',');
      if (s && s.length > 0) {
        for (const m of s) {
          if (m.trim().length > 0 && tweet.text.toLowerCase().indexOf(m) > -1) {
            this.status.filtered++;
            this.LOGGER.debug('Keyword filter is applied.');
            return;
          }
        }
      }
      // Process the tweet if not filtered, but delay the processing 5 seconds if running locally
      setTimeout(
        () => {
          this.processTweet(tweet);
        },
        config.isLocal ? 0 : 5000
      );
    } catch (err) {
      this.LOGGER.error(err);
    }
  }

  processTweet(tweet) {
    this.LOGGER.debug('Processing Tweet.');
    this.cloudantDAO
      .duplicateCheck(tweet)
      .then(() => {
        // Convert the tweet into a format...
        this.outputFormatter.formatAsJson(tweet).then(data => {
          // Do some enrichment
          this.enrichmentPromise(data)
            .then(enrichedData => {
              // Then save it to something...
              this.cloudantDAO
                .saveToCloudant(enrichedData, false)
                .then(() => {
                  this.status.saved++;
                  this.outCount++;
                  // tslint:disable:max-line-length
                  this.LOGGER.debug(
                    this.outCount +
                      ' Tweets processed with a maximum of ' +
                      (this.options.max === -1 ? 'Unlimited' : this.options.max)
                  );
                  if (
                    this.options.max > 0 &&
                    this.outCount >= this.options.max
                  ) {
                    this.LOGGER.debug(
                      '>> Maximum saved count was reached, stop listening...'
                    );
                    this.stream.stop();
                  }
                })
                .catch(err => {
                  this.LOGGER.error('Error saving to cloudant ' + err);
                });
            })
            .catch(err => {
              this.status.lastError = err;
              this.status.errors++;
              // If it's not an unsupported text language error, then we pause the listener.
              // tslint:disable:max-line-length
              if (err.indexOf('unsupported text language') === -1) {
                this.LOGGER.debug(
                  'An Enrichment error occurred, the listener is being paused for 15 minutes to see if it resolved the problem.'
                );
                this.pauseListener(15);
              }
            });
        });
      })
      .catch(err => {
        if (err) {
          this.LOGGER.error('Error checking for duplicate: ' + err);
          return;
        }
        this.LOGGER.error('Tweet is a duplicate');
      });
  }

  getStatus() {
    if (this.status) {
      return this.status;
    } else {
      return { status: "Listner isn't started yet." };
    }
  }

  pauseListener(minutes) {
    this.LOGGER.info('Tweet Listener paused.');
    const now = moment();
    let pauseDuration = moment();
    if (minutes) {
      pauseDuration = moment().add(minutes, 'm');
    }
    if (this.stream) {
      this.status.state = 'paused';
      this.status.paused_at = new Date();
      this.status.will_resume_at = pauseDuration.toDate();
      this.stream.stop();
    }
    this.LOGGER.debug(
      'Listener will resume at ' +
        pauseDuration.format('dddd, MMMM Do YYYY, h:mm:ss a')
    );
    setTimeout(() => {
      this.startListener();
    }, pauseDuration.diff(now));
  }

  enrichmentPromise(data) {
    return new Promise((resolve, reject) => {
      this.enrichmentPipeline
        .enrich(data.text)
        .then(enrichments => {
          data.enrichments = enrichments;
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * This is an empty enrichment promise if
   * no other enrichment pipline is specified.
   * @param data
   */
  noEnrichment(data) {
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }
}
