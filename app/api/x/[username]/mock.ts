export const mockTwitterData = {
    user: {
      id: "1234567890123456789",
      name: "Pushpendra Singh",
      username: "iPushpendra",
      created_at: "2020-01-15T10:30:00Z",
      description: "Developer | Tech Enthusiast | Building ninexGo X Analytics | #Coding #AI",
      public_metrics: {
        followers_count: 1050,
        following_count: 500,
        tweet_count: 450,
        listed_count: 10
      },
      verified: false,
      location: "India",
      profile_image_url: "https://pbs.twimg.com/profile_images/1234567890123456789_normal.jpg",
      url: "https://ninexGo.com"
    },
    tweets: [
      {
        id: "9876543210987654321",
        text: "Excited to work on ninexGo X Analytics! #XAnalytics #DevLife https://t.co/example1",
        created_at: "2025-03-11T14:22:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 15,
          reply_count: 5,
          like_count: 50,
          quote_count: 2
        },
        entities: {
          hashtags: [
            { start: 34, end: 45, tag: "XAnalytics" },
            { start: 46, end: 54, tag: "DevLife" }
          ],
          urls: [
            { start: 55, end: 78, url: "https://t.co/example1", expanded_url: "https://ninexGo.com/blog" }
          ]
        },
        source: "Twitter Web App"
      },
      {
        id: "9876543210987654320",
        text: "Replying to @elonmusk: Great insights on AI! #TechTrends",
        created_at: "2025-03-10T09:15:00Z",
        author_id: "1234567890123456789",
        in_reply_to_user_id: "44196397",
        referenced_tweets: [
          {
            type: "replied_to",
            id: "9876543210987654319"
          }
        ],
        public_metrics: {
          retweet_count: 8,
          reply_count: 3,
          like_count: 20,
          quote_count: 1
        },
        entities: {
          hashtags: [{ start: 37, end: 47, tag: "TechTrends" }],
          mentions: [{ start: 11, end: 20, username: "elonmusk" }]
        },
        source: "Twitter for Android"
      },
      {
        id: "9876543210987654319",
        text: "RT @TechGuru: Amazing tutorial on APIs! Check it out https://t.co/example2",
        created_at: "2025-03-09T18:00:00Z",
        author_id: "1234567890123456789",
        referenced_tweets: [
          {
            type: "retweeted",
            id: "9876543210987654318"
          }
        ],
        public_metrics: {
          retweet_count: 25,
          reply_count: 0,
          like_count: 10,
          quote_count: 0
        },
        entities: {
          mentions: [{ start: 3, end: 12, username: "TechGuru" }],
          urls: [
            { start: 39, end: 62, url: "https://t.co/example2", expanded_url: "https://techguru.com/tutorial" }
          ]
        },
        source: "Twitter for iPhone"
      },
      {
        id: "9876543210987654318",
        text: "Working on a new feature for ninexGo. Stay tuned! #Coding",
        created_at: "2025-03-08T12:45:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 5,
          reply_count: 2,
          like_count: 15,
          quote_count: 0
        },
        entities: {
          hashtags: [{ start: 47, end: 53, tag: "Coding" }]
        },
        source: "Twitter Web App"
      },
      {
        id: "9876543210987654317",
        text: "Just finished a debugging session. Feels good! #DevLife",
        created_at: "2025-03-07T20:30:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 3,
          reply_count: 1,
          like_count: 12,
          quote_count: 0
        },
        entities: {
          hashtags: [{ start: 40, end: 48, tag: "DevLife" }]
        },
        source: "Twitter for Android"
      },
      {
        id: "9876543210987654316",
        text: "Learning about AI models today. #AI #MachineLearning",
        created_at: "2025-03-06T15:10:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 10,
          reply_count: 4,
          like_count: 25,
          quote_count: 1
        },
        entities: {
          hashtags: [
            { start: 28, end: 31, tag: "AI" },
            { start: 32, end: 47, tag: "MachineLearning" }
          ]
        },
        source: "Twitter for iPhone"
      },
      {
        id: "9876543210987654315",
        text: "Check out my latest project update: https://t.co/example3 #Tech",
        created_at: "2025-03-05T11:00:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 7,
          reply_count: 2,
          like_count: 18,
          quote_count: 0
        },
        entities: {
          hashtags: [{ start: 54, end: 58, tag: "Tech" }],
          urls: [
            { start: 26, end: 49, url: "https://t.co/example3", expanded_url: "https://ninexGo.com/update" }
          ]
        },
        source: "Twitter Web App"
      },
      {
        id: "9876543210987654314",
        text: "Thanks to @CodeMaster for the inspiration! #Gratitude",
        created_at: "2025-03-04T08:30:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 4,
          reply_count: 1,
          like_count: 10,
          quote_count: 0
        },
        entities: {
          hashtags: [{ start: 39, end: 48, tag: "Gratitude" }],
          mentions: [{ start: 11, end: 22, username: "CodeMaster" }]
        },
        source: "Twitter for Android"
      },
      {
        id: "9876543210987654313",
        text: "Exploring new APIs today. #Development",
        created_at: "2025-03-03T17:20:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 6,
          reply_count: 3,
          like_count: 14,
          quote_count: 0
        },
        entities: {
          hashtags: [{ start: 24, end: 35, tag: "Development" }]
        },
        source: "Twitter for iPhone"
      },
      {
        id: "9876543210987654312",
        text: "Happy coding everyone! #CodeLife",
        created_at: "2025-03-02T13:50:00Z",
        author_id: "1234567890123456789",
        public_metrics: {
          retweet_count: 5,
          reply_count: 2,
          like_count: 12,
          quote_count: 0
        },
        entities: {
          hashtags: [{ start: 22, end: 30, tag: "CodeLife" }]
        },
        source: "Twitter Web App"
      }
    ]
  };