
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
   
    title:"Total Customer",
    amount:0,//assuming it will going to stay that way for every
    message:"Total number of customers",
    footerNote :"Includes the total number of customer",
  },{
   
    title:"Active Customer",
    amount:0, //assuming it will going to stay that way for every
    message:"Total number for active customers",
    footerNote :"Includes only those customers who has ordered/signed up in the past 15 days",
  }])
  let [fetched, setFetched] = useState(false)
  useEffect(function () {
    // using the recoil here for the current data - fetching from backend -- atom v2
    let url = BACKEND_URL!+"customerCard" 
    fetch(url,{credentials:"include"}).then(async (m) => {
      let {totalCustomer, totalActive} = (await m.json()) as {totalCustomer:number, totalActive:number};

      setCardList((prev) => {

        prev[0].amount = totalCustomer;
        prev[1].amount = totalActive;

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
