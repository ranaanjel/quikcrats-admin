"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
 type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import dataChart from "@/dashboard.json";
import axios from "axios"
import { BACKEND_URL } from "@/config"

export const description = "An interactive area chart"

const chartData =  dataChart

const chartConfig = {
  "views": {
    label: "amount",
    color: "var(--chart-0)",
  },
  "sales": {
    label: "Sales",
    color: "var(--chart-1)",
  },
  "orders": {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

enum chartDataType {
  sales="sales",
  orders="orders"
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d") //current range - 90 30 7 
  const [currentData, setCurrentData] = React.useState<{date: string, sales?:number, orders?:number}[]>(chartData) // fetching the using the recoil 
  const [activeChart, setActiveChart] = React.useState("sales" as keyof typeof chartConfig)


  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
    let url = BACKEND_URL+ "dashboardChart";
    console.log(url)

    axios.get(url, {withCredentials:true}).then(
      res => {
        let data = res.data.value;
        setCurrentData(data)
      }
    ).catch(error=> console.log(error))

  }, [isMobile])

  const filteredData = currentData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date() // in case my date the reference date is current date -- this is referring to fix date due to fixed nature of data.
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })// when the data is ready for that //TODO

    const total = React.useMemo(
    () => ({
      sales: currentData.reduce((acc, curr) => acc + curr.sales!, 0),
      orders: currentData.reduce((acc, curr) => acc + curr.orders!, 0),
    }),
    [currentData]
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="sm:text-4xl self-center text-2xl">Total {activeChart == chartDataType.sales ? "Sales" : "Orders"}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last  {timeRange.replace("d"," days")}
          </span>
          <span className="@[540px]/card:hidden">Last {timeRange}</span>
        </CardDescription>
        <CardAction>
           <div className="flex">
           {["sales","orders"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 px-3 py-2 text-left  w-full sm:border rounded sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {chart == "sales" ? "₹" :""}{total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
  
          </AreaChart>
        </ChartContainer> */}
            <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}