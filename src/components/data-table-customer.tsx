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

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})
export const pendingOrderSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  deliveryDate: z.string(),
  deliveryTiming: z.string(),
  instruction: z.string(),
  customerName: z.string(),
  orderValue: z.number(),
  deliveryStatus: z.string(),
  orderStatus: z.string(),
  address: z.string(),
  zone: z.string() // pincode
})
export const itemRequiredSchema = z.object({
  id: z.number(),
  itemName: z.number(),
  category: z.string(),
  subCategory: z.string(),
  totalQuantity: z.string(),
  unit: z.string()
})

// Create a separate component for the drag handle


import { IconPlus } from "@tabler/icons-react"
import { BACKEND_URL } from "@/config"
import { Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

export function DataTable() {
  const [customerList, setCustomerList] = React.useState([{ id: "", contact: { name: "", email: "", phoneNo: "" }, restaurantName: "", preferences: "", active: false, categoryPricing: { categoryName: "" , _id:""} }]);

  // const clearTimeRef: React.RefObject<ReturnType<typeof setTimeout> | undefined> = React.useRef(undefined)

  let [filterCustomer, setFilterCustomer] = React.useState([{ id: "", contact: { name: "", email: "", phoneNo: "" }, restaurantName: "", preferences: "", active: false, categoryPricing: { categoryName: "" , _id:""} }])


  React.useEffect(function () {
    // getting all the items from the backend 
    fetch(BACKEND_URL + "customerData",{credentials:"include"}).then(async (m) => {
      let data = await m.json()

      setCustomerList(data.value);
      setFilterCustomer(data.value);
      
      // keeping this data in the react.useMemo for lifecycle of component.
    }).catch(err => console.log(err))
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
          <TabsTrigger value="1">Customers</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="1"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex gap-3 items-center">

          <div>
            Filter Customer
          </div>
          <Select onValueChange={function (value) {
            setFilterCustomer(() => {
              let filterData = customerList.filter(m => {

                let changingData = ""
                if(value == "active") {
                  changingData= "true";
                }else {
                  changingData = "false";
                }
                return m.active.toString() == changingData;
              })
              
              return filterData;
            })
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter based on Active/Inactive" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"active"}>active</SelectItem>
              <SelectItem value={"inactive"}>inactive</SelectItem>
            </SelectContent>
          </Select>

        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >Restaurant Name</TableHead>
                <TableHead >Customer Contact</TableHead>
                <TableHead >Preferences</TableHead>
                <TableHead >Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                filterCustomer.length > 0 ? filterCustomer.map((m, index) => {
                  let name = ("name" in m.contact ? m.contact.name : "") + ", " + ("phoneNo" in m.contact ? m.contact.phoneNo : "") + ", " + ("email" in m.contact ? m.contact.email : "");
                  return <TableRow className="" key={index}>
                    <TableCell className="w-64 capitalize">
                      <TableCellViewer item={customerList[index]} />
                    </TableCell>
                    <TableCell className="w-64">{name}</TableCell>
                    <TableCell className="w-64">{m.preferences}</TableCell>
                    <TableCell className="w-64"><Badge variant={m.active == true ? "default" : "destructive"}>{m.active.toString()}</Badge></TableCell>
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
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const classInputValue = "focus:outline-none focus:border underline"
  const editCheckRef = React.useRef<HTMLButtonElement>(null);
  const dataChange = React.useRef<Record<string, any>>({});
  const [categoryPricingList, setCategoryPricingList] = React.useState([{id:"", categoryName:""}]);

  React.useEffect(function() {

    fetch(BACKEND_URL + "categoryPricing",{credentials:"include"}).then(async (m) => {
      let data = await m.json()
      setCategoryPricingList(data.value);
      // keeping this data in the react.useMemo for lifecycle of component.
    }).catch(err => console.log(err)) 
  },[])

  return (
    <Drawer open={open} onClose={function () {
      dataChange.current = {};
      // not pushing the data 
    }} direction={isMobile ? "bottom" : "right"} >
      <DrawerTrigger asChild>
        <Button onClick={function () {
          setOpen(true)
        }} variant="link" className="capitalize text-foreground w-fit px-0 text-left">
          {item.restaurantName}
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
              <div className="text-md">Preferences</div>
              <input className={classInputValue} disabled={savedValue} onChange={function (e) {
                let data = e.target.value;
                dataChange.current["preferences"] = data;
              }} defaultValue={item?.["preferences"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-md">Category Pricing</div>
              <div>
                make sure the customer does not have a pending order
              </div>
               <Select disabled={savedValue} onValueChange={function (data) {
                dataChange.current["categoryPricingId"] = data;
              }} defaultValue={ "categoryPricing" in item ? item.categoryPricing._id : ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Is it a supersaver?" />
                </SelectTrigger>
                <SelectContent>
                  {categoryPricingList.length > 0 && categoryPricingList.map((m, index) => {
                      return <SelectItem key={index} value={m.id}>{m.categoryName}</SelectItem>
                  }) }
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DialogViewer type="submit" value="Submit to database" changes={dataChange.current} onclickValue={function () {
            console.log(dataChange.current)
            setOpen(false)
           }}></DialogViewer>
          <DrawerClose asChild>
            <Button onClick={()=>{
              setOpen(false)
            }} variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


function DialogViewer({ type, value, changes, onclickValue, setValue, disableTrue }: { type: "alert" | "confirm" | "offers" | "unit" | "submit" | "brand", value?: string, changes?: any, onclickValue?: () => void, setValue?: React.Dispatch<React.SetStateAction<any>>, disableTrue?: boolean }) {

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
  } else {
    return <Button>check edit to start making changes</Button>
  }
}