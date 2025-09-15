import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Create a separate component for the drag handle

const itemRequirementColumns = [

   {
    accessorKey: "item name",
    header: "Item name",
    classValue:"w-78"
  },
  // {
  //   accessorKey: "category",
  //   header: "Category",
  //   classValue:"w-64"
  // }, 
  // {
  //   accessorKey: "subcategory",
  //   header: "Subcategory",
  //   classValue:"w-64"
  // },
  {
    accessorKey: "quantity",
    header: "Quantity",
    classValue:"w-64"
  },
  {
    accessorKey: "Unit",
    header: "Unit",
    classValue:"w-32"
  },
]

import { IconPlus } from "@tabler/icons-react"
import { toast, Toaster } from "sonner"
import { BACKEND_URL } from "@/config"

interface DataReturn {
  id: string, userContact: { name: string, phoneNo: string, email: string, },
  userAddress: {
    deliveryTiming: string, address: string, shopDetails: string, receiver: string, instruction: string[], pincode: string, tag: string, additionalNo: string, deliveryAvailable: boolean,
  }
  , deliveryStatus: string,
  orderStatus: string,
  restaurantName: string,
  preferences: string, orderId: string,
  createdAt: Date, deliveryDate: Date, totalValue: number,
  saving: number, 
  itemList: { items: { itemId: string, quant: number, skip: boolean, price: number[] }[] }
}


export function DataTable() {
  const [data, setData] = React.useState<{itemId:string, quant:number, unit:string}[]>([]);
  const [pending, setPending] = React.useState<DataReturn[]>([])
 
  

  let [totalItem, setTotalItem] = React.useState(data.length);
  let [pendingOrder, setPendingOrder] = React.useState(pending.length);


enum orderStatusInterface { // only checking in the admin side -- mostly done by the user - modified, place, cancelled -- completed on delivery completed
  OrderModified = "order modified",
  OrderCancelled = "order cancelled",
  OrderPlaced = "order placed",
  OrderCompleted = "order completed",
}

  React.useEffect(function(){
     fetch(BACKEND_URL + "orderData",{credentials:"include"}).then(async (m) => {
      let data = await m.json()
      let allData = (data.orderData);
      let pendingData = allData.filter((m: { orderStatus: string }) => {
        return m.orderStatus == orderStatusInterface.OrderModified || m.orderStatus == orderStatusInterface.OrderPlaced
      })
      
      setPending(pendingData);
      let itemList:Record<string,{itemId:string, quant:number, unit:string}> = {}

      pendingData.forEach((m:DataReturn) => {
        (m.itemList.items).forEach(m=> {
          let name = m.itemId;
          let quant = m.quant;
          let unit = "unit" in m ? String(m.unit) : "unit";

          if(name in itemList) {
              itemList[name].quant += quant;
          }else {
              itemList[name] = {
                itemId: name,
                quant,
                unit 
              }
          }
        });




      })

    let requirementItem = Object.values(itemList);
    setData(requirementItem)
    setTotalItem(requirementItem.length)
    setPendingOrder(pendingData.length)
    
      // keeping this data in the react.useMemo for lifecycle of component.
    }).catch(err => console.log(err))

  },[])

  return (
    <Tabs
      defaultValue="item requirement"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex-col sm:flex-row flex items-center justify-between px-4 lg:px-6 gap-2 ">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30   **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="item requirement">Item Requirement  <Badge
            className=" text-white dark:bg-blue-600 h-8 min-w-8  rounded-full  font-mono tabular-nums"
            variant="default"
          >
            {totalItem}
          </Badge></TabsTrigger>

          <TabsTrigger  value="pending order">
            Pending Order
            <Badge
              className="h-8 min-w-8 rounded-full  font-mono tabular-nums"
              variant="destructive"
            >
              {pendingOrder}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button onClick={function () {
            toast.info("This will be available in v2")
          }} variant={"secondary"} size={"sm"}>
            <IconPlus></IconPlus>
            Export
          </Button>

        </div>
      </div>
      <TabsContent
        value="item requirement"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
               {
                itemRequirementColumns.map(m=>{
                  return <TableHead className={m.classValue} key={m.accessorKey}>{m.header}</TableHead>
                })
               } 
              </TableRow>
            </TableHeader>
            <TableBody>
                {
                 data.length > 0 &&  data.map((m,index:number) => {

                    return <TableRow className="" key={index}>
                   
                    <TableCell className="w-64">{m.itemId}</TableCell>
                    <TableCell className="w-64">{m.quant}</TableCell>
                    <TableCell className="w-64 overflow-ellipsis whitespace-nowrap overflow-hidden ">{m.unit}</TableCell>
                  </TableRow>
                  })
                }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end px-4">
      </div>
         
      </TabsContent>
      <TabsContent
        value="pending order"
        className="flex flex-col px-4 lg:px-6"
      >
     
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >Order Id</TableHead>
                <TableHead >Customer Contact</TableHead>
                <TableHead >Restaurant Name</TableHead>
                <TableHead >Preferences</TableHead>
                <TableHead >Instruction</TableHead>
                <TableHead >Address</TableHead>
                <TableHead >Delivery Status</TableHead>
                <TableHead >Order Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                pending.length > 0 ? pending.map((m, index) => {
                  let customerContact = m.userContact.name + " " + m.userContact.email + " " + m.userContact.phoneNo;
                  let restaurantName = m.restaurantName;
                  let preferences = m.preferences;
                  let instructions = m.userAddress.instruction.join(", ");
                  let address = m.userAddress.address;
                  let deliveryStatus = m.deliveryStatus;
                  let orderStatus = m.orderStatus


                  return <TableRow className="" key={index}>
                    <TableCell className="w-64 capitalize">
                      {m.orderId}
                    </TableCell>
                    <TableCell className="w-64">{customerContact}</TableCell>
                    <TableCell className="w-64">{restaurantName}</TableCell>
                    <TableCell className="max-w-64 overflow-ellipsis whitespace-nowrap overflow-hidden ">{preferences}</TableCell>
                    <TableCell className="max-w-64 overflow-ellipsis whitespace-nowrap overflow-hidden ">{instructions}</TableCell>
                    <TableCell className="max-w-32 overflow-ellipsis whitespace-nowrap overflow-hidden ">{address}</TableCell>
                    <TableCell className="w-32"><Badge>{deliveryStatus}</Badge></TableCell>
                    <TableCell className="w-32"><Badge>{orderStatus}</Badge></TableCell>
                  </TableRow>
                }) : null
              }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end px-4">
        </div> 
      </TabsContent>
      <Toaster></Toaster>
    </Tabs>
  )
}

