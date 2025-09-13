import * as React from "react"

import { z } from "zod"
import html2pdf from "html2pdf.js"

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


import { IconPlus } from "@tabler/icons-react"
import { BACKEND_URL } from "@/config"
import { Check, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

//  deliveryStatus: { // by the admin
//       type: String,
//       enum: ["order received", "order in transit", "order delivered"],
//       default: "order received"
//   },
//   orderStatus: { // by the user
//       type: String,
//       enum: ["order modified", "order cancelled", "order placed", "order completed"]
//   },

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
  saving: number, itemList: { items: { itemId: string, quant: number, skip: boolean, price: number[] }[] }
}


export function DataTable() {
  const [orderList, setOrderList] = React.useState<DataReturn[]>([]);
  const [allList, setAllList] = React.useState<DataReturn[]>([])
  const [filterList, setFilterList] = React.useState<DataReturn[]>([]);
  const [zoneList, setZoneList] = React.useState<{ id: string, pincode: string, area: string }[]>([]);

  React.useEffect(function () {
    // getting all the items from the backend 
    fetch(BACKEND_URL + "orderData",{credentials:"include"}).then(async (m) => {
      let data = await m.json()
      let allData = (data.orderData);
      let pendingData = allData.filter((m: { orderStatus: string }) => {
        return m.orderStatus == orderStatusInterface.OrderModified || m.orderStatus == orderStatusInterface.OrderPlaced
      })

      setOrderList(allData);
      setFilterList(pendingData)
      setAllList(allData)
      // keeping this data in the react.useMemo for lifecycle of component.
    }).catch(err => console.log(err))

    fetch(BACKEND_URL + "allzone",{credentials:"include"}).then(async m => {

      let data = await m.json()
      setZoneList(data.delivery)
    })
  }, [])


  return (
    <Tabs
      defaultValue="1"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex-col sm:flex-row flex items-center justify-between px-4 lg:px-6 gap-2 ">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>

        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="1">Pending Order</TabsTrigger>
          <TabsTrigger value="2">Total Order in last 15 days</TabsTrigger>
          <TabsTrigger value="3">Delivery Available Zone</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="1"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
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
                filterList.length > 0 ? filterList.map((m, index) => {
                  let customerContact = m.userContact.name + " " + m.userContact.email + " " + m.userContact.phoneNo;
                  let restaurantName = m.restaurantName;
                  let preferences = m.preferences;
                  let instructions = m.userAddress.instruction.join(", ");
                  let address = m.userAddress.address;
                  let deliveryStatus = m.deliveryStatus;
                  let orderStatus = m.orderStatus


                  return <TableRow className="" key={index}>
                    <TableCell className="w-64 capitalize">
                      <TableCellViewer item={filterList[index]} />
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
      <TabsContent value="2" className="flex flex-col px-4 lg:px-6 gap-4">
        <div className="flex text-md gap-3 items-end">
          <div className="font-medium  text-gray-50/80">
            Filter Based on customer name, restaurant, pincode :
          </div>
          <Input onChange={function (e) {

            let value = e.target.value;

            if (value.trim() == "") {
              setOrderList(allList)
              return;
            }

            let pattern = new RegExp(value, "i");
            let newData = allList.filter(m => {
              let matchValue = m.restaurantName + " " + m.userAddress.pincode + " " + m.userContact.name
              return matchValue.match(pattern)
            })

            setOrderList(newData)

          }} className="w-1/2"></Input>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead>Order Id</TableHead>
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
                orderList.length > 0 ? orderList.map((m, index) => {
                  let orderId = m.orderId;
                  let customerContact = m.userContact.name + " " + m.userContact.email + " " + m.userContact.phoneNo;
                  let restaurantName = m.restaurantName;
                  let preferences = m.preferences;
                  let instructions = m.userAddress.instruction.join(", ");
                  let address = m.userAddress.address;
                  let deliveryStatus = m.deliveryStatus;
                  let orderStatus = m.orderStatus


                  return <TableRow className="" key={index}>
                    <TableCell className="w-64 capitalize">
                      <TableCellViewerAll item={orderList[index]} />
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
      <TabsContent value="3" className="flex flex-col px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >Pincode</TableHead>
                <TableHead >Area</TableHead>
                <TableHead >Category Pricing General</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                zoneList.length > 0 ? zoneList.map((m, index) => {

                  return <TableRow className="" key={index}>
                    <TableCell className="w-64 capitalize">
                      <TableCellViewerZone item={zoneList[index]} />
                    </TableCell>
                    <TableCell className="w-64">{m.area}</TableCell>
                    <TableCell className="w-64">N/A <Badge>v2</Badge></TableCell>
                  </TableRow>
                }) : null
              }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end px-4">
        </div>
      </TabsContent>
    </Tabs>
  )
}

function TableCellViewer({ item }: { item: Record<string, any> }) {
  const isMobile = useIsMobile();

  const [savedValue, setSaved] = React.useState(true);
  const [edit, setEdit] = React.useState(false);
  const editCheckRef = React.useRef<HTMLButtonElement>(null);
  const dataChange = React.useRef<Record<string, any>>({});

  const contactValue = item.userContact.name + " " + item.userContact.email + " " + item.userContact.phoneNo + " ";
  let address = item.userAddress.address;
  let pincode = item.userAddress.pincode;
  let instruction = item.userAddress.instruction.join(", ");
  let deliveryTiming = item.userAddress.deliveryTiming;
  let shopDetails = item.userAddress.shopDetails;
  let receiver = item.userAddress.receiver;
  let tag = item.userAddress.tag;
  let additionalNo = item.userAddress.addtionalNo;

  let orderCreated = item.createdAt;
  let orderDeliveryDate = item.deliveryDate;
  let totalValue = item.totalValue;
  let saving = item.saving;

  let itemList = item.itemList.items;


  let userInfo = {
    address,contactValue, pincode, restaurant: item.restaurantName, totalValue, saving, orderDeliveryDate, instruction, orderId: item.orderId
  }
  return (
    <Drawer onClose={function () {
      dataChange.current = {};
      // not pushing the data 
    }} direction={isMobile ? "bottom" : "right"} >
      <DrawerTrigger asChild>
        <Button variant="link" className="">
          #{item.orderId}
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader className="gap-1">
          <DrawerTitle className="capitalize flex justify-between">{item.restaurantName}
            <div className="flex gap-1 items-center">
              <Checkbox checked={!savedValue} ref={editCheckRef} onCheckedChange={function (value) {
                if (value) {
                  alert("entering the edit mode")
                  setEdit(true)
                  setSaved(false)
                } else if (value == false) {
                  alert("make you save first")
                  // setEnableEdit(false)
                }
              }}></Checkbox>
              <div className="text-sm lowercase">
                Edit
              </div>
              {
                edit && <Button onClick={function () {
                  setSaved(true)
                  setEdit(false)
                  // pushing to the database the data -- changes
                  //TODO
                  console.log(dataChange.current)
                  // clearing the current context for further value.
                  dataChange.current = {}
                }} className="mx-2" variant={"default"} size={"sm"}>
                  save
                </Button>
              }

            </div>
          </DrawerTitle>
          <DrawerDescription className="flex gap-2">
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order Id</div>
              <div>{"#" + item?.["orderId"]} </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Address and details</div>
              <div className="flex gap-2 ">
                <div>
                  User Contact :
                </div>
                <div>
                  {contactValue}
                </div>
              </div>
              <div className="">
                <div className="flex justify-between">
                  <span className="w-1/2">Address : </span> <span className="w-1/2">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span>pincode</span> <span className="w-1/2">{pincode}</span>
                </div>
                <div className="flex justify-between">
                </div>
                <div className="flex justify-between">
                  <span>deliveryTiming</span> <span className="w-1/2">{deliveryTiming}</span>
                </div>
                <div className="flex justify-between">
                  <span>shop details</span> <span className="w-1/2">{shopDetails}</span>
                </div>
                <div className="flex justify-between">
                  <span>receiver</span> <span className="w-1/2">{receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span>tag</span> <span className="w-1/2">{tag}</span>
                </div>
                <div className="flex justify-between">
                  <span>additional number</span> <span className="w-1/2">{additionalNo ? additionalNo : "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <div className="text-xl w-1/2">Instruction</div>
                <span className="w-1/2">{instruction}</span>
              </div>
              <div className="flex gap-3 items-start">
                <div className="text-xl w-1/2">Preferences</div>
                <span className="w-1/2">{item.preferences}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Delivery Status</div>
              <Select disabled={savedValue} onValueChange={function (value) {

              }}>
                <SelectTrigger>
                  <SelectValue placeholder="select the delivery status and submit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={deliveryStatusInterface.OrderDelivered}>{deliveryStatusInterface.OrderDelivered}</SelectItem>
                  <SelectItem value={deliveryStatusInterface.OrderInTransit}>{deliveryStatusInterface.OrderInTransit}</SelectItem>
                  <SelectItem value={deliveryStatusInterface.OrderReceived}>{deliveryStatusInterface.OrderReceived}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order Status</div>
              <Badge>{item.orderStatus}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order Created</div>
              <div>{orderCreated}</div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Delivery Date</div>
              <div>{orderDeliveryDate}</div>
            </div>
            <div className="flex items-center">
              <div className="text-xl w-1/2">Total Value</div>
              <div className="w-1/2">{totalValue.toString()}</div>
            </div>
            <div className="flex items-center">
              <div className="text-xl w-1/2">Saving</div>
              <div className="w-1/2">{saving.toString()}</div>
            </div>
            <div className="flex flex-col gap-3">
              <ItemList userInfo={userInfo} all={true} list={itemList}></ItemList>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DialogViewer type="submit" value="Submit to database" changes={dataChange.current} onclickValue={function () { }}></DialogViewer>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
function ItemList({ userInfo, list, all }: { userInfo: Record<string, any>, all: boolean, list: { itemId: string, quant: number, unit: string, price: number[] }[] }) {

  let [checkState, setCheckState] = React.useState<boolean[]>(Array(list.length).fill(false))
  let [filterList, setFilterList] = React.useState<{ itemId: string, quant: number, unit: string, price: number[] }[]>(list);
  let [print, setPrint] = React.useState(false);

  function printBill() {
    setFilterList(() => {
      let newData = list.filter((_, index) => {
        return checkState[index]
      })
      return newData
    })
    setPrint(true)
  }

  React.useEffect(function () {
    setCheckState(Array(list.length).fill(true))
  },[])

  return <><div className="flex justify-between items-center">
    <div className="text-xl">Item list</div>
    <Button onClick={function () {
      printBill()
    }}>Print bill</Button>
  </div>
    <Badge variant={"destructive"}>check items to get bill</Badge>
    <div>
      <div className="flex justify-between">
        <Check className="size-3 self-center"></Check>
        <span className="w-16">item name</span>
        <span className="w-16">quantity</span>
        <span className="w-10">mrp</span>
        <span className="w-10">discount</span>
        <span className="w-10">total</span>
      </div>
      {
        list.length > 0 && list.map((m, index) => {

          let itemName = m.itemId;
          let quant = m.quant;
          let price = m.price[0];
          let discount = m.price[1];
          let unit = m.unit || " unit";

          return <div key={index} className="flex justify-between h-12 border px-1 items-center">
            <Checkbox onClick={function () {
              console.log("click")
              setCheckState(prev => {

                prev[index] = !prev[index]
                let newData = [...prev]
                console.log(newData)
                return newData;
              })
            }} checked={checkState[index]} ></Checkbox>
            <span className="w-16">{itemName}</span>
            <span className="w-16">{quant}{unit}</span>
            <span className="w-10 line-through  ">{price}</span>
            <span className="w-10">{discount}</span>
            <span className="w-10">{quant * discount}</span>
          </div>
        })
      }
    </div>

    {
      all && <>              <div>
        in case of items not available, uncheck the items not present and press send below button
      </div>
        <Button variant={"destructive"}>Send N/A items</Button>
        <div>
          fixes above problem in v2 inventory management
        </div>



        </>
    }
      {print ? <Bill setPrint={setPrint} userInfo={userInfo} list={filterList} /> : <div>
        no print
      </div> }
  </>
}
function Bill({ userInfo, list , setPrint}: {setPrint:React.Dispatch<React.SetStateAction<boolean>>,userInfo: Record<string, any>, list: { itemId: string, quant: number, unit: string, price: number[] }[] }) {

  let printBillRef = React.useRef<HTMLDivElement>(null);


  function printing() {

    console.log(printBillRef.current)
     
    html2pdf().from(printBillRef.current as HTMLInputElement).set({
      margin: 10,
      filename: userInfo.restaurant + "_" + userInfo.orderDeliveryDate + ".pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' }
    }).save().then(m => {
    
      setPrint(false)
    });
  }

  return <div  className=" absolute p-1 text-black top-0 left-0 h-full overflow-scroll w-full bg-white ">
  
   <div ref={printBillRef} className="flex flex-col gap-4 p-4 text-sm">

     <div className="text-black">
      <div className="font-bold text-black">
        Quikcrats Services private ltd
      </div>
      <div>
        RZ E121 KH No - 83/20 Nihal Vihar Nangloi, near raj properties, 110041
      </div>
      <div>
        Contact : 8287470325
      </div>
      <div>
        Email : quikcrats@gmail.com
      </div>
      <div>
        State : 07-Delhi
      </div>
    </div>
    <div className="font-bold text-xl text-center text-black">
      Sales Invoice 
    </div>
   <div className="text-black">
     <div>
      Bill To : {userInfo.restaurant}
    </div>
    <div>
      Address : {userInfo.address}
    </div>
    <div>
      Contact : {userInfo.contactValue}
    </div>
    <div>
      Date : {userInfo.orderDeliveryDate}
    </div>
    <div>
      <span className="font-bold">Order Id</span> : {userInfo.orderId}
    </div>
   <div className="bg-[#1447e6] text-[#fff] flex gap-2 justify-between rounded p-2 py-4 mt-4">
    <span className="w-32">item name</span>
        <span className="flex-1 text-end">quantity</span>
        <span className="flex-1 text-end">mrp</span>
        <span className="flex-1 text-end">discount price</span>
        <span className="flex-1 text-end">total</span>
   </div>
  
   </div> 
   
   <div>
    {
    list.length > 0 && list.map((m,index) => {
        let itemName = m.itemId;
          let quant = m.quant;
          let price = m.price[0];
          let discount = m.price[1];
          let unit = m.unit;

      return <div key={index} className="flex justify-between border-b border-[#000]  p-2 py-4 text-sm h-12 items-start  text-black">
          <span className="w-32">{itemName}</span>
            <span className="flex-1 text-end">{quant}{unit}</span>
            <span className="flex-1 text-end text-[#6a7282]">{price}</span>
            <span className="flex-1 text-end">{discount}</span>
            <span className="flex-1 text-end">{quant * discount}</span>
   </div>
    })
   }
   </div>
   <div className="flex flex-col items-end text-black" >

   <div>
    Saving : {userInfo.saving}
   </div>
   <div>
    Total value : {userInfo.totalValue}
   </div>
   </div>

   <div className="text-center text-black">
        *Terms & Conditions Applicable 
   </div>
   </div>
     <div className="text-center bg-blue-500 text-white border-2 border-sky-700 px-4 py-2 rounded" onClick={function () {
      printing();
  }}>
    print the Bill</div>
  </div>

}

function TableCellViewerAll({ item }: { item: Record<string, any> }) {
  const isMobile = useIsMobile();

  const contactValue = item.userContact.name + " " + item.userContact.email + " " + item.userContact.phoneNo + " ";
  let address = item.userAddress.address;
  let pincode = item.userAddress.pincode;
  let instruction = item.userAddress.instruction.join(", ");
  let deliveryTiming = item.userAddress.deliveryTiming;
  let shopDetails = item.userAddress.shopDetails;
  let receiver = item.userAddress.receiver;
  let tag = item.userAddress.tag;
  let additionalNo = item.userAddress.addtionalNo;

  let orderCreated = item.createdAt;
  let orderDeliveryDate = item.deliveryDate;
  let totalValue = item.totalValue;
  let saving = item.saving;

  let itemList = item.itemList.items;

  let userInfo = {
    address,contactValue, pincode, restaurant: item.restaurantName, totalValue, saving, orderDeliveryDate, instruction, orderId: item.orderId
  }

  return (
    <Drawer onClose={function () {
      // not pushing the data 
    }} direction={isMobile ? "bottom" : "right"} >
      <DrawerTrigger asChild>
        <Button variant="link" className="capitalize text-foreground text-left">
          #{item.orderId}
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader className="gap-1">
          <DrawerTitle className="capitalize flex justify-between">{item.restaurantName}
          </DrawerTitle>
          <DrawerDescription className="flex gap-2">
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order Id</div>
              <div>{"#" + item?.["orderId"]} </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Address and details</div>
              <div className="flex gap-2 ">
                <div>
                  User Contact :
                </div>
                <div>
                  {contactValue}
                </div>
              </div>
              <div className="">
                <div className="flex justify-between">
                  <span className="w-1/2">Address : </span> <span className="w-1/2">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span>pincode</span> <span className="w-1/2">{pincode}</span>
                </div>
                <div className="flex justify-between">
                </div>
                <div className="flex justify-between">
                  <span>deliveryTiming</span> <span className="w-1/2">{deliveryTiming}</span>
                </div>
                <div className="flex justify-between">
                  <span>shop details</span> <span className="w-1/2">{shopDetails}</span>
                </div>
                <div className="flex justify-between">
                  <span>receiver</span> <span className="w-1/2">{receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span>tag</span> <span className="w-1/2">{tag}</span>
                </div>
                <div className="flex justify-between">
                  <span>additional number</span> <span className="w-1/2">{additionalNo ? additionalNo : "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <div className="text-xl w-1/2">Instruction</div>
                <span className="w-1/2">{instruction}</span>
              </div>
              <div className="flex gap-3 items-start">
                <div className="text-xl w-1/2">Preferences</div>
                <span className="w-1/2">{item.preferences}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Delivery Status</div>

              <Badge>{item.deliveryStatus}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order Status</div>
              <Badge>{item.orderStatus}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Order Created</div>
              <div>{orderCreated}</div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Delivery Date</div>
              <div>{orderDeliveryDate}</div>
            </div>
            <div className="flex items-center">
              <div className="text-xl w-1/2">Total Value</div>
              <div className="w-1/2">{totalValue.toString()}</div>
            </div>
            <div className="flex items-center">
              <div className="text-xl w-1/2">Saving</div>
              <div className="w-1/2">{saving.toString()}</div>
            </div>
            <div className="flex flex-col gap-3">
              <ItemList userInfo={userInfo} all={false} list={itemList}></ItemList>
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
function TableCellViewerZone({ item }: { item: Record<string, any> }) {
  const isMobile = useIsMobile();

  const [savedValue, setSaved] = React.useState(true);
  const [edit, setEdit] = React.useState(false);
  const classInputValue = "focus:outline-none focus:border underline"
  const editCheckRef = React.useRef<HTMLButtonElement>(null);
  const dataChange = React.useRef<Record<string, any>>({});

  return (
    <Drawer onClose={function () {
      dataChange.current = {};
      // not pushing the data 
    }} direction={isMobile ? "bottom" : "right"} >
      <DrawerTrigger asChild>
        <Button variant="link" className="capitalize text-foreground w-fit px-0 text-left">
          {item.pincode}
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader className="gap-1">
          <DrawerTitle className="capitalize flex justify-between">{item.pincode}
            <div className="flex gap-1 items-center">
              <Checkbox checked={!savedValue} ref={editCheckRef} onCheckedChange={function (value) {
                if (value) {
                  alert("entering the edit mode")
                  setEdit(true)
                  setSaved(false)
                } else if (value == false) {
                  alert("make you save first")
                  // setEnableEdit(false)
                }
              }}></Checkbox>
              <div className="text-sm lowercase">
                Edit
              </div>
              {
                edit && <Button onClick={function () {
                  setSaved(true)
                  setEdit(false)

                  // pushing to the database the data -- changes
                  //TODO
                  console.log(dataChange.current)

                  // clearing the current context for further value.
                  dataChange.current = {}
                }} className="mx-2" variant={"default"} size={"sm"}>
                  save
                </Button>

              }

            </div>
          </DrawerTitle>
          <DrawerDescription className="flex gap-2">
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-xl">Address</div>
              <input className={classInputValue} disabled={savedValue} defaultValue={item?.["area"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">General Category Pricing</div>
              <input className={classInputValue} disabled={true} defaultValue={"General Category pricing for this area. upcoming in v2"} />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DialogViewer type="zone" value="Create New Zone" changes={dataChange.current} onclickValue={function () { }}></DialogViewer>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DialogViewer({ type, value, changes, onclickValue, setValue, disableTrue }: { type: "alert" | "confirm" | "offers" | "unit" | "submit" | "brand" | "zone", value?: string, changes?: any, onclickValue?: () => void, setValue?: React.Dispatch<React.SetStateAction<any>>, disableTrue?: boolean }) {

  const [brandList, setBrandList] = React.useState<string[]>([]);
  const [unitList, setUnitList] = React.useState<string[]>([]);
  const [filterValue, setFilterValue] = React.useState<string[]>([]);
  const brandRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [offers, setOffers] = React.useState<{
    price: number, quantity: number, superSaver: boolean
  }>({
    price: 0,
    quantity: 0,
    superSaver: false
  });

  const pincodeRef = React.useRef<HTMLInputElement>(null);
  const areaRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(function () {
    if (type == "brand") {
      fetch(BACKEND_URL! + "brand",{credentials:"include"}).then(async (m) => {
        let data = await m.json()
        setBrandList(data.data)
        setFilterValue(data.data);
      }).catch(err => console.log(err))
    } else if (type == "unit") {

      fetch(BACKEND_URL! + "unit",{credentials:"include"}).then(async (m) => {
        let data = await m.json()
        setUnitList(data.data)
      }).catch(err => console.log(err))
    }
  }, [])

  const clearTime: React.RefObject<ReturnType<typeof setTimeout> | undefined> = React.useRef(undefined);


  if (type == "confirm" || type == "submit" && !disableTrue) {
    return <Dialog >
      <DialogTrigger asChild>
        <Button variant="default">{value?.split(" ")[0]}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Action</DialogTitle>
          <DialogDescription>
            {value}
          </DialogDescription>
        </DialogHeader>
        {/* {changes} */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onclickValue} type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  } else if (type == "alert" && !disableTrue) {
    return <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>create / select unit for the {value}</DialogTitle>
          <DialogDescription>
            {""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  } else if (type == "unit" && !disableTrue) {
    return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">change unit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{value}</DialogTitle>
          <DialogDescription>
            <div className="my-3">
              <Select onValueChange={function (value) {

                if (setValue) setValue(value);
                setOpen(false)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="select the unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitList.length > 0 && unitList.map((m, index) => {


                    return <SelectItem key={index} value={m}>{m}</SelectItem>
                  })}
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  } else if (type == "brand" && !disableTrue) {
    return <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">change brand</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{value}</DialogTitle>

          <div className="flex gap-2" aria-describedby="dialog description">

            <div className="w-1/2  flex flex-col gap-4">
              select the brand
              <Input onChange={function (e) {
                let value = e.target.value;

                clearTimeout(clearTime.current);
                clearTime.current = setTimeout(function () {
                  setFilterValue((prev) => {
                    prev = brandList.filter(m => m.includes(value));
                    return prev;
                  });
                  console.log(value)
                }, 800)

              }}></Input>
              <div className="overflow-scroll h-42 border rounded">
                {
                  filterValue.length > 0 && filterValue.map((m, index) => {
                    return <div key={index} className="border p-2 hover:bg-white hover:text-black" onClick={function () {
                      console.log(m)
                      if (setValue) setValue(m);
                      if (onclickValue) onclickValue();
                      setOpen(false)
                    }} >
                      {m}
                    </div>
                  })
                }
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-4">
              create the brand
              <Input ref={brandRef}></Input>
              <Button onClick={function () {
                if (setValue) setValue(brandRef.current?.value);
                setOpen(false)
              }}>create</Button>
            </div>

          </div>

        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  } else if (type == "offers" && !disableTrue) {
    return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><IconPlus />create / delete offers</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{value}</DialogTitle>
          <div aria-describedby="dialog description" className="flex flex-col gap-4">
            {changes.length > 0 && changes.map((m: any, index: number) => {
              return <div key={index} onClick={function () {
                console.log(m)
              }} className={"flex justify-between rounded items-center border p-2" + `${index == 0 ? " mt-4" : ""}`}>
                Offer #{index}<Button size={"sm"} variant={"destructive"}><Trash className="size-4"></Trash></Button>
              </div>
            })}

            <div className="flex flex-col gap-2">
              <Label>Create New Offers</Label>
              <Input placeholder="price" onChange={function (e) {
                let value = parseFloat(e.target.value);
                setOffers(prev => {
                  return { ...prev, price: value }
                })
              }}></Input>
              <Input placeholder="quantity" onChange={function (e) {
                let value = parseFloat(e.target.value);
                setOffers(prev => {
                  return { ...prev, quantity: value }
                })
              }}></Input>
              <Input placeholder="unit is primary" disabled={true} ></Input>
              <Select onValueChange={function (e) {
                let value = e == "true" ? true : false;
                setOffers(prev => {
                  return { ...prev, superSaver: value }
                })
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Is it a supersaver?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">true</SelectItem>
                  <SelectItem value="false">false</SelectItem>
                </SelectContent>
              </Select>
              <Input type={"submit"} onClick={function () {
                if (offers.quantity == 0 || offers.price == 0) {
                  alert("please make sure the values are correct");
                } else {
                  //TODO db call
                  setOpen(false)
                  console.log(offers)
                  setOffers(prev => {
                    return {
                      price: 0,
                      quantity: 0,
                      superSaver: false
                    }
                  })
                }
              }} value={"Submit to database"}></Input>
            </div>

          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  } else if (type == "zone") {

    return <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Create Zone</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{value}</DialogTitle>
          <div className="flex gap-2" aria-describedby="dialog description">
            <div className=" flex flex-col mt-6 gap-4">
              <div className="flex gap-2">
                <Input className="w-1/2" ref={pincodeRef} placeholder={"enter the pincode"}></Input>
                <Input className="w-1/2" ref={areaRef} placeholder={"enter area name"}></Input>
              </div>
              <Button onClick={function () {
                if (setValue) setValue(brandRef.current?.value);
                setOpen(false)
              }}>create</Button>
            </div>

          </div>

        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  } else {
    return <Button>check edit to start making changes</Button>
  }
}