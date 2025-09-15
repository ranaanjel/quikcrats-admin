import * as React from "react"

import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
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

const pendingOrderColumns = [  {
    accessorKey: "order id",
    header: "Order Id",
    classValue:"w-32"
  },
  {
    accessorKey: "customer name",
    header: "Customer",
    classValue:"w-32"
  },
  {
    accessorKey: "order value",
    header: "Order value",
    classValue:"w-32"
  },
  // {
  //   accessorKey: "delivery date",
  //   header: "Delivery date",
  //   classValue:"w-32"
  // },
  // {
  //   accessorKey: "delivery timing",
  //   header: "Delivery timing",
  //   classValue:"w-16"
  // },
  // {
  //   accessorKey: "address",
  //   header: "Address",
  //   classValue:"w-32"
  // },
  {
    accessorKey: "zone",
    header: "Zone",
    classValue:"w-16"
  },
  // {
  //   accessorKey: "instruction",
  //   header: "Instruction",
  //   classValue:"w-32"

  // }, 
  {
    accessorKey: "delivery status",
    header: "D-Status",
    classValue:"w-16"
  },
  {
    accessorKey: "order status",
    header: "O-Status",
    classValue:"w-16"
  },

]
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

import pendingOrderData from "@/pendingorder.json";

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

enum deliveryStatusInterface {
  OrderReceived = "order received",
  OrderInTransit = "order in transit",
  OrderDelivered = "order delivered",
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




function TableCellViewer({ item }: { item: string }) {
  const isMobile = useIsMobile();

  const [customerData, setCustomerData] = React.useState(pendingOrderData.find(m =>m["order id"] == item));

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item}</DrawerTitle>
          <DrawerDescription>
            {customerData?.["customer name"]}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order</div>
              <span>{customerData?.["order value"]}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Delivery Date</div>
              <span>{customerData?.["delivery date"]}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Delivery Timing</div>
              <span>{customerData?.["delivery timing"]}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Address</div>
              <span>{customerData?.["address"]}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Zone</div>
              <span>{customerData?.["zone"]}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Instruction</div>
              <span>{customerData?.["instruction"].join(", ")}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Delivery Status</div>
              <span>{customerData?.["delivery status"]}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order Status</div>
              <span>{customerData?.["order status"]}</span>
            </div>
           
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

//  <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="type">Type</Label>
//                 <Select defaultValue={item}>
//                   <SelectTrigger id="type" className="w-full">
//                     <SelectValue placeholder="Select a type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Table of Contents">
//                       Table of Contents
//                     </SelectItem>
//                     <SelectItem value="Executive Summary">
//                       Executive Summary
//                     </SelectItem>
//                     <SelectItem value="Technical Approach">
//                       Technical Approach
//                     </SelectItem>
//                     <SelectItem value="Design">Design</SelectItem>
//                     <SelectItem value="Capabilities">Capabilities</SelectItem>
//                     <SelectItem value="Focus Documents">
//                       Focus Documents
//                     </SelectItem>
//                     <SelectItem value="Narrative">Narrative</SelectItem>
//                     <SelectItem value="Cover Page">Cover Page</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="status">Status</Label>
//                 <Select defaultValue={item}>
//                   <SelectTrigger id="status" className="w-full">
//                     <SelectValue placeholder="Select a status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Done">Done</SelectItem>
//                     <SelectItem value="In Progress">In Progress</SelectItem>
//                     <SelectItem value="Not Started">Not Started</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="target">Target</Label>
//                 <Input id="target" defaultValue={item} />
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="limit">Limit</Label>
//                 <Input id="limit" defaultValue={item} />
//               </div>
//             </div>
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="reviewer">Reviewer</Label>
//               <Select defaultValue={item}>
//                 <SelectTrigger id="reviewer" className="w-full">
//                   <SelectValue placeholder="Select a reviewer" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//                   <SelectItem value="Jamik Tashpulatov">
//                     Jamik Tashpulatov
//                   </SelectItem>
//                   <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>