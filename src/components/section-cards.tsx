import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Check, IndianRupee, XIcon } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"


export function SectionCards() {
  let [cardList, setCardList] = useState<{title:string,amount:number,trend:string,message:string, footerNote:string, change?:string, inStock?:number, outStock?:number}[]>([{
    title:"Total Revenue",
    amount:10_00_000,
    trend : "up",
    message:"Trending up this month",
    footerNote :"Total Revenue for the last 6 months",
    change:"+12.5"
  },{
    title:"Total Order",
    amount:1000,
    trend : "down",
    message:"low no of order on daily basis",
    footerNote :"Customer reach out requisite",
    change:"-20",
  },{
    title:"Total Customer",
    amount:40,
    trend : "up",
    message:"Strong user retention",
    footerNote :"focus on giving best service",
    change:"+10"
  },{
    title:"Total Items",
    amount:345,
    trend : "up",
    message:"Total number of items",
    footerNote :"Making sure we are circulating the items rapidly",
    inStock:345,
    outStock:0
  },])
  useEffect(function () {
    // using the recoil here for the current data - fetching from backend -- atom
  },[])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{cardList[0].title}</CardDescription>
          <CardTitle className="text-2xl items-center font-semibold flex tabular-nums @[250px]/card:text-3xl">
              <IndianRupee />
            {cardList[0].amount.toLocaleString("en-In")}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
               <Trend value={cardList[3].trend}></Trend>
              {cardList[0].change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {cardList[0].message}  <Trend value={cardList[3].trend}></Trend>
          </div>
          <div className="text-muted-foreground">
           {cardList[0].footerNote}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{cardList[1].title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {cardList[1].amount.toLocaleString("en-In")}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">

              <Trend value={cardList[1].trend}></Trend>
              {cardList[1].change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {cardList[1].message}  <Trend  value={cardList[1].trend}></Trend>
          </div>
          <div className="text-muted-foreground">
            {cardList[1].footerNote}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{cardList[2].title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {cardList[2].amount.toLocaleString("en-In")}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
               <Trend value={cardList[2].trend}></Trend>
              {cardList[2].change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {cardList[2].message}  <Trend value={cardList[2].trend}></Trend>
          </div>
          <div className="text-muted-foreground">{cardList[2].footerNote}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{cardList[3].title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cardList[3].amount.toLocaleString("en-In")}
          </CardTitle>
          <CardAction className="flex gap-2">
            <Badge variant="secondary" className="bg-green-600 text-white dark:bg-green-800" >
              <Check size={2}></Check>
              {cardList[3].inStock} 
              
            </Badge>
            <Badge variant="destructive">
              <XIcon size={2}></XIcon>
              {cardList[3].outStock} 

            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {cardList[3].message}
          </div>
          <div className="text-muted-foreground">{cardList[3].footerNote}</div>
        </CardFooter>
      </Card>
    </div>
  )
}

function Trend({value}:{value:string}) {
if(value == "up") {
  return <IconTrendingUp className="size-4" />
} else {
  return <IconTrendingDown className="size-4" /> 
}
}
