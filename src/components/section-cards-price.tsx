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
  let [cardList, setCardList] = useState<{ title: string, amount: number, trend: string, message: string, footerNote: string, change?: string, inStock?: number, outStock?: number }[]>([{
    title: "Total Items",
    amount: 345,
    trend: "up",
    message: "Total number of items",
    footerNote: "Making sure we are circulating the items rapidly",
    inStock: 345,
    outStock: 0
  }])
  useEffect(function () {
    // using the recoil here for the current data - fetching from backend -- atom
  }, [])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
          <CardHeader>
          <CardDescription>{cardList[0].title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cardList[0].amount.toLocaleString("en-In")}
          </CardTitle>
          <CardAction className="flex gap-2">
            <Badge variant="secondary" className="bg-green-600 text-white dark:bg-green-800" >
              <Check size={2}></Check>
              {cardList[0].inStock} 
              
            </Badge>
            <Badge variant="destructive">
              <XIcon size={2}></XIcon>
              {cardList[0].outStock} 

            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {cardList[0].message}
          </div>
          <div className="text-muted-foreground">{cardList[0].footerNote}</div>
        </CardFooter>
      </Card>
    </div>
  )
}

function Trend({ value }: { value: string }) {
  if (value == "up") {
    return <IconTrendingUp className="size-4" />
  } else {
    return <IconTrendingDown className="size-4" />
  }
}
