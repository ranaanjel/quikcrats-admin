
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "@/config"
import { Skeleton } from "./ui/skeleton"


export function SectionCards() {
  let [cardList, setCardList] = useState<{title:string,amount:number,message:string, footerNote:string, change?:string, inStock?:number, outStock?:number}[]>([{
   
    title:"Total Pending Orders",
    amount:0,
    message:"Total number of orders",
    footerNote :"Includes the total number of pending orders to be delivered",
  },{
   
    title:"Total Orders in Last 15 days",
    amount:0,
    message:"Total number for orders in last fifteen days",
    footerNote :"Includes cancel, modified, delivered orders",
  }])
  let [fetched, setFetched] = useState(false)
  useEffect(function () {
    // using the recoil here for the current data - fetching from backend -- atom v2
    let url = BACKEND_URL!+"orderCard" 
    fetch(url).then(async (m) => {
      let {totalPending, totalOrder} = (await m.json()) as {totalPending:number, totalOrder:number};

      setCardList((prev) => {
        prev[0].amount = totalPending;
        prev[1].amount = totalOrder;
        return prev;
      })

      setFetched(true)

    }).catch(m=> console.error(m))



  },[])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{cardList[0].title}</CardDescription>
          <CardTitle className="text-2xl items-center font-semibold flex tabular-nums @[250px]/card:text-3xl text-yellow-700">

            { fetched ? cardList[0].amount.toLocaleString("en-In") : <Skeleton className="h-12 w-12 rounded-full" />}
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
          {fetched?cardList[1].amount.toLocaleString("en-In"):<Skeleton className="h-12 w-12 rounded-full" />}
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
