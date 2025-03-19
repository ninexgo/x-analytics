import { NextResponse } from "next/server"
import { TwitterApi } from "twitter-api-v2"
import NodeCache from "node-cache"
import path from "path"
import fs from "fs"
import os from "os"

// Mock data for development and testing
const mockTwitterData = {
  user: {
    id: "12345678",
    name: "Demo User",
    username: "demouser",
    description: "This is a demo account for testing the X Analytics dashboard",
    profile_image_url: "https://github.com/shadcn.png",
    url: "https://example.com",
    public_metrics: {
      followers_count: 5432,
      following_count: 1234,
      tweet_count: 789,
      listed_count: 42,
    },
  },
  tweets: Array(20)
    .fill(null)
    .map((_, i) => ({
      id: `tweet${i}`,
      text: `This is a sample tweet #${i} with some example content for testing the dashboard visualization.`,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      public_metrics: {
        retweet_count: Math.floor(Math.random() * 50),
        reply_count: Math.floor(Math.random() * 30),
        like_count: Math.floor(Math.random() * 100),
        quote_count: Math.floor(Math.random() * 20),
      },
    })),
}

const CACHE_DURATION = 3600 // 1 hour
const apiCache = new NodeCache({ stdTTL: CACHE_DURATION })

// Create a temp directory for caching if we're in a writable environment
const CACHE_DIR = path.join(os.tmpdir(), "x-analytics-cache")
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
} catch (error) {
  console.warn("Unable to create cache directory:", error)
}

// Initialize Twitter API client if credentials are available
let client: TwitterApi | null = null
if (
  process.env.TWITTER_API_KEY &&
  process.env.TWITTER_API_SECRET &&
  process.env.TWITTER_ACCESS_TOKEN &&
  process.env.TWITTER_ACCESS_SECRET
) {
  client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  })
}

export async function GET(request: Request, context: { params: { username: string } }) {
  const { username } = context.params
  const cleanUsername = username.replace("@", "")

  // Check memory cache first
  if (apiCache.has(cleanUsername)) {
    console.log(`Serving cached response for @${cleanUsername}`)
    return NextResponse.json(apiCache.get(cleanUsername))
  }

  // Use local file cache if available
  try {
    const cacheFile = path.join(CACHE_DIR, `cache_${cleanUsername}.json`)
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile)
      const fileAge = (Date.now() - stats.mtimeMs) / 1000 // Age in seconds

      if (fileAge < CACHE_DURATION) {
        console.log(`Using file cache for @${cleanUsername}`)
        const cachedData = JSON.parse(fs.readFileSync(cacheFile, "utf-8"))
        apiCache.set(cleanUsername, cachedData) // Store in memory cache
        return NextResponse.json(cachedData)
      }
    }
  } catch (error) {
    console.warn("Cache file access error:", error)
    // Continue execution if cache fails
  }

  // Use mock data if specified or if no API client is available
  if (process.env.USE_MOCK_API === "true" || !client) {
    console.log(`Using mock data for @${cleanUsername}`)
    const mockData = { ...mockTwitterData }
    mockData.user.username = cleanUsername
    mockData.user.name = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1)

    // Cache the mock data
    apiCache.set(cleanUsername, mockData)
    try {
      const cacheFile = path.join(CACHE_DIR, `cache_${cleanUsername}.json`)
      fs.writeFileSync(cacheFile, JSON.stringify(mockData, null, 2))
    } catch (error) {
      console.warn("Failed to write mock data to cache:", error)
    }

    return NextResponse.json(mockData)
  }

  try {
    // Fetch user data from Twitter with expanded fields
    const user = await client.v2.userByUsername(cleanUsername, {
      "user.fields": "description,profile_image_url,public_metrics,url,entities",
    })

    if (!user.data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch more tweets (20 instead of 10) for better analytics
    const tweets = await client.v2.userTimeline(user.data.id, {
      max_results: 20,
      "tweet.fields": "public_metrics,created_at,text",
      exclude: "retweets,replies",
    })

    // Format the data to match our dashboard requirements
    const data = {
      user: {
        ...user.data,
        public_metrics: {
          followers_count: user.data.public_metrics?.followers_count || 0,
          following_count: user.data.public_metrics?.following_count || 0,
          tweet_count: user.data.public_metrics?.tweet_count || 0,
          listed_count: user.data.public_metrics?.listed_count || 0,
        },
      },
      tweets: tweets.data.data || [],
    }

    // Cache results in memory
    apiCache.set(cleanUsername, data)

    // Try to cache to file system if possible
    try {
      const cacheFile = path.join(CACHE_DIR, `cache_${cleanUsername}.json`)
      fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2))
    } catch (error) {
      console.warn("Failed to write to cache file:", error)
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
      },
    })
  } catch (error: any) {
    console.error(`API Error for @${cleanUsername}:`, error)

    if (error.code === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        },
      )
    }

    if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") {
      return NextResponse.json({ error: "Network error. Please check your connection." }, { status: 503 })
    }

    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}

