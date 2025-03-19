"use client"

import { useState, useCallback } from "react"
import { BarChart, LineChart, PieChart, XAxis } from "recharts"
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronDown,
  Filter,
  LineChartIcon,
  PieChartIcon,
  RefreshCw,
  Share2,
  Sparkles,
  Users,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Tweet {
  id: string
  text: string
  created_at: string
  public_metrics: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
  }
}

interface User {
  id: string
  name: string
  username: string
  description: string
  public_metrics: {
    followers_count: number
    following_count: number
    tweet_count: number
  }
  profile_image_url?: string
  url?: string
}

interface Data {
  user: User
  tweets: Tweet[]
}

export default function Dashboard() {
  const [username, setUsername] = useState("")
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("7d")
  const [chartType, setChartType] = useState("engagement")

  const fetchAnalytics = useCallback(async () => {
    if (!username) return

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/x/${username.replace("@", "")}`)
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
      const result = await res.json()
      setData(result)
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [username])

  // Calculate engagement rate
  const calculateEngagementRate = useCallback(() => {
    if (!data) return 0

    const totalEngagements = data.tweets.reduce((sum, tweet) => {
      return (
        sum +
        tweet.public_metrics.like_count +
        tweet.public_metrics.reply_count +
        tweet.public_metrics.retweet_count +
        tweet.public_metrics.quote_count
      )
    }, 0)

    const totalImpressions = data.user.public_metrics.followers_count * data.tweets.length
    return totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0
  }, [data])

  // Prepare chart data
  const prepareChartData = useCallback(() => {
    if (!data) return []

    // Sort tweets by date
    const sortedTweets = [...data.tweets].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

    return sortedTweets.map((tweet) => {
      const date = new Date(tweet.created_at)
      return {
        date: date.toISOString().split("T")[0],
        likes: tweet.public_metrics.like_count,
        retweets: tweet.public_metrics.retweet_count,
        replies: tweet.public_metrics.reply_count,
        quotes: tweet.public_metrics.quote_count,
        total:
          tweet.public_metrics.like_count +
          tweet.public_metrics.retweet_count +
          tweet.public_metrics.reply_count +
          tweet.public_metrics.quote_count,
        text: tweet.text.length > 50 ? tweet.text.substring(0, 50) + "..." : tweet.text,
      }
    })
  }, [data])

  // Prepare distribution data for pie chart
  const prepareDistributionData = useCallback(() => {
    if (!data) return []

    const totalLikes = data.tweets.reduce((sum, t) => sum + t.public_metrics.like_count, 0)
    const totalRetweets = data.tweets.reduce((sum, t) => sum + t.public_metrics.retweet_count, 0)
    const totalReplies = data.tweets.reduce((sum, t) => sum + t.public_metrics.reply_count, 0)
    const totalQuotes = data.tweets.reduce((sum, t) => sum + t.public_metrics.quote_count, 0)

    return [
      { name: "Likes", value: totalLikes, fill: "#1DA1F2" },
      { name: "Retweets", value: totalRetweets, fill: "#17BF63" },
      { name: "Replies", value: totalReplies, fill: "#F45D22" },
      { name: "Quotes", value: totalQuotes, fill: "#794BC4" },
    ]
  }, [data])

  // Get best performing tweet
  const getBestTweet = useCallback(() => {
    if (!data || data.tweets.length === 0) return null

    return data.tweets.reduce((best, current) => {
      const bestEngagement =
        best.public_metrics.like_count +
        best.public_metrics.retweet_count +
        best.public_metrics.reply_count +
        best.public_metrics.quote_count

      const currentEngagement =
        current.public_metrics.like_count +
        current.public_metrics.retweet_count +
        current.public_metrics.reply_count +
        current.public_metrics.quote_count

      return currentEngagement > bestEngagement ? current : best
    }, data.tweets[0])
  }, [data])

  // Chart configurations
  const chartConfig = {
    likes: {
      label: "Likes",
      color: "hsl(var(--chart-1))",
    },
    retweets: {
      label: "Retweets",
      color: "hsl(var(--chart-2))",
    },
    replies: {
      label: "Replies",
      color: "hsl(var(--chart-3))",
    },
    quotes: {
      label: "Quotes",
      color: "hsl(var(--chart-4))",
    },
  }

  const bestTweet = getBestTweet()
  const chartData = prepareChartData()
  const distributionData = prepareDistributionData()
  const engagementRate = calculateEngagementRate().toFixed(2)
  
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">ninexGo Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analytics for X users</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Non-Premium
          </Badge>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Card className="border-2 border-primary/10 pt-0">
        <CardHeader className="bg-primary/5 py-3">
          <CardTitle className="text-lg">Search User</CardTitle>
          <CardDescription>Enter an X username to analyze their profile and tweets</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter X username (e.g., @_iPushpendra)"
                className="h-10"
              />
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnalytics} disabled={loading} className="h-10">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full md:col-span-2" />
          <Skeleton className="h-[300px] w-full md:col-span-2" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="w-20 h-20 mb-2">
                    <AvatarImage src={data.user.profile_image_url} alt={data.user.name} />
                    <AvatarFallback>{data.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{data.user.name}</h2>
                  <p className="text-muted-foreground">@{data.user.username}</p>
                  <p className="text-sm mt-2 text-center">{data.user.description}</p>

                  {data.user.url && (
                    <a
                      href={data.user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center mt-2 text-sm"
                    >
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      Website
                    </a>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-2xl font-bold">{data.user.public_metrics.followers_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{data.user.public_metrics.following_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{data.user.public_metrics.tweet_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Tweets</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-3xl font-bold text-primary">{engagementRate}%</p>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics Card */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Engagement Overview</CardTitle>
                  <CardDescription>Performance metrics for the selected time period</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Highest engagement</DropdownMenuItem>
                    <DropdownMenuItem>Most recent</DropdownMenuItem>
                    <DropdownMenuItem>Most likes</DropdownMenuItem>
                    <DropdownMenuItem>Most retweets</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {data.tweets.reduce((sum, t) => sum + t.public_metrics.like_count, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Likes</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {data.tweets.reduce((sum, t) => sum + t.public_metrics.retweet_count, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">Retweets</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 dark:bg-orange-950 border-orange-100 dark:border-orange-900">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {data.tweets.reduce((sum, t) => sum + t.public_metrics.reply_count, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">Replies</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 dark:bg-purple-950 border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {data.tweets.reduce((sum, t) => sum + t.public_metrics.quote_count, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Quotes</p>
                    </CardContent>
                  </Card>
                </div>

                {bestTweet && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Best Performing Tweet</h3>
                    <Card className="bg-primary/5">
                      <CardContent className="p-4">
                        <p className="text-sm">{bestTweet.text}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(bestTweet.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {(
                              bestTweet.public_metrics.like_count +
                              bestTweet.public_metrics.retweet_count +
                              bestTweet.public_metrics.reply_count +
                              bestTweet.public_metrics.quote_count
                            ).toLocaleString()}{" "}
                            engagements
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle className="text-lg">Performance Analytics</CardTitle>
                  <CardDescription>Visualize your tweet performance over time</CardDescription>
                </div>
                <div className="flex mt-2 sm:mt-0">
                  <Button
                    variant={chartType === "engagement" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("engagement")}
                    className="rounded-r-none"
                  >
                    <LineChartIcon className="w-4 h-4 mr-2" />
                    Engagement
                  </Button>
                  <Button
                    variant={chartType === "distribution" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("distribution")}
                    className="rounded-l-none"
                  >
                    <PieChartIcon className="w-4 h-4 mr-2" />
                    Distribution
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="line" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="line">
                    <LineChartIcon className="w-4 h-4 mr-2" />
                    Line
                  </TabsTrigger>
                  <TabsTrigger value="bar">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Bar
                  </TabsTrigger>
                  <TabsTrigger value="pie">
                    <PieChartIcon className="w-4 h-4 mr-2" />
                    Pie
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="line" className="h-[400px]">
                  {chartType === "engagement" ? (
                    <ChartContainer config={chartConfig} className="h-[400px]">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                        <LineChart dataKey="likes" stroke="var(--color-likes)" />
                        <LineChart dataKey="retweets" stroke="var(--color-retweets)" />
                        <LineChart dataKey="replies" stroke="var(--color-replies)" />
                        <LineChart dataKey="quotes" stroke="var(--color-quotes)" />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <PieChart
                        data={distributionData}
                        width={400}
                        height={400}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                      >
                        <PieChart
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        />
                        <ChartTooltip />
                      </PieChart>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="bar" className="h-[400px]">
                  {chartType === "engagement" ? (
                    <ChartContainer config={chartConfig} className="h-[400px]">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                        <BarChart dataKey="likes" fill="var(--color-likes)" />
                        <BarChart dataKey="retweets" fill="var(--color-retweets)" />
                        <BarChart dataKey="replies" fill="var(--color-replies)" />
                        <BarChart dataKey="quotes" fill="var(--color-quotes)" />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BarChart
                        data={distributionData}
                        width={500}
                        height={300}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <ChartTooltip />
                        <BarChart dataKey="value" fill="#1DA1F2" />
                      </BarChart>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pie" className="h-[400px]">
                  <div className="flex items-center justify-center h-full">
                    <PieChart
                      data={distributionData}
                      width={400}
                      height={400}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <PieChart
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      />
                      <ChartTooltip />
                    </PieChart>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Tweets Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Tweets</CardTitle>
              <CardDescription>Your latest tweets and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.tweets.slice(0, 5).map((tweet) => (
                  <Card key={tweet.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <p className="text-sm mb-2">{tweet.text}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>{new Date(tweet.created_at).toLocaleDateString()}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 mr-1"
                            >
                              {tweet.public_metrics.like_count}
                            </Badge>
                            Likes
                          </span>
                          <span className="flex items-center">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 mr-1"
                            >
                              {tweet.public_metrics.retweet_count}
                            </Badge>
                            Retweets
                          </span>
                          <span className="flex items-center">
                            <Badge
                              variant="outline"
                              className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 mr-1"
                            >
                              {tweet.public_metrics.reply_count}
                            </Badge>
                            Replies
                          </span>
                          <span className="flex items-center">
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 mr-1"
                            >
                              {tweet.public_metrics.quote_count}
                            </Badge>
                            Quotes
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm">
                View All Tweets
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

