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
  let [cardList, setCardList] = useState<{title:string,amount:number,message:string, footerNote:string, change?:string, inStock?:number, outStock?:number}[]>([{
   
    title:"Banner",
    amount:4,//assuming it will going to stay that way for every
    message:"Total number of banners",
    footerNote :"Using for marketing and launching new products",
  },{
   
    title:"Preorder list",
    amount:4, //assuming it will going to stay that way for every
    message:"Total number for default preorderlist",
    footerNote :"Each Preorder list contains premade list of items for each customer",
  }])
  useEffect(function () {
    // using the recoil here for the current data - fetching from backend -- atom
    //v2
  },[])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{cardList[0].title}</CardDescription>
          <CardTitle className="text-2xl items-center font-semibold flex tabular-nums @[250px]/card:text-3xl text-yellow-700">
            {cardList[0].amount.toLocaleString("en-In")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {cardList[0].message} 
          </div>
          <div className="text-muted-foreground">
           {cardList[0].footerNote}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{cardList[1].title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-500">
          {cardList[1].amount.toLocaleString("en-In")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {cardList[1].message}
          </div>
          <div className="text-muted-foreground">
            {cardList[1].footerNote}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
