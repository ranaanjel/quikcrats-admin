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

const pendingOrderColumns = [{
  accessorKey: "order id",
  header: "Order Id",
  classValue: "w-32"
},
{
  accessorKey: "customer name",
  header: "Customer",
  classValue: "w-32"
},
{
  accessorKey: "order value",
  header: "Order value",
  classValue: "w-32"
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
  classValue: "w-16"
},
// {
//   accessorKey: "instruction",
//   header: "Instruction",
//   classValue:"w-32"

// }, 
{
  accessorKey: "delivery status",
  header: "D-Status",
  classValue: "w-16"
},
{
  accessorKey: "order status",
  header: "O-Status",
  classValue: "w-16"
},

]
const itemRequirementColumns = [

  {
    accessorKey: "item name",
    header: "Item name",
    classValue: "w-78"
  },
  {
    accessorKey: "category",
    header: "Category",
    classValue: "w-64"
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
    classValue: "w-64"
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    classValue: "w-64"
  },
  {
    accessorKey: "Unit",
    header: "Unit",
    classValue: "w-32"
  },
];
// Create a separate component for the drag handle
//TODO recoil currently doing only the checkup


const itemColumns = [{
  header: "Image url",
  edit: true,
},
{
  header: "Item name",
  edit: false
},
{
  header: "App url",
  edit: true,
},
{
  header: "Disclaimer",
  edit: true
}, {
  header: "Brand",
  edit: true
}, {
  header: "category",
  edit: false
}, {
  header: "subcategory",
  edit: false
}, {
  header: "productinfo",
  edit: true
}, {
  header: "quantity",
  edit: true
}, {
  header: "primary size",
  edit: true
}, {
  accessorKey: "primary unit",
  edit: true
}, {
  header: "secondary size",
  edit: true
}, {
  header: "secondary unit",
  edit: true
}, {
  header: "conversion",
  edit: true
}, {
  header: "price",
  edit: false
}, {
  header: "discount",
  edit: false
},
{
  header: "saving amount",
  edit: false
},
{
  header: "offer",
  edit: true
},
{
  header: "out of stock",
  edit: true
},
{
  header: "coming soon",
  edit: true
},
{
  header: "max order",
  edit: true
},
{
  header: "regex",
  edit: true
},
{
  header: "inventory in house",
  edit: true
}

]

import pendingOrderData from "@/pendingorder.json";

import { IconPlus } from "@tabler/icons-react"
import { BACKEND_URL } from "@/config"
import { Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { set } from "mongoose"



export function DataTable() {
  const [itemList, setItemList] = React.useState([{ name: "", image: "", category: "", subcategory: "" }]);
  const [pending, setPending] = React.useState(pendingOrderData)

  const pendingDataRef = React.useRef<HTMLButtonElement>(null)
  const itemRequirementRef = React.useRef<HTMLButtonElement>(null)

  let [totalItem, setTotalItem] = React.useState(itemList.length);
  let [pendingOrder, setPendingOrder] = React.useState(pending.length);
  let [gotData, setGotData] = React.useState<any[]>([]);

  let fetchData = React.useMemo(async function () {
    let data = await (await fetch(BACKEND_URL + "items")).json()
    setGotData(data.data)
    return data.data;
  }, [])

  React.useEffect(function () {
    // getting all the items from the backend 
    fetch(BACKEND_URL + "items").then(async (m) => {
      let data = await m.json()
      setItemList(prev => {
        let newData = data.data.map((m: any) => ({ name: m.name, image: m.imageURL, category: m.categoryId, subcategory: m.subCategoryId }));
        return newData;
      });
      setTotalItem(data.length);
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

        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30   **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger ref={itemRequirementRef} value="1"> View &amp; Edit</TabsTrigger>

          <TabsTrigger ref={pendingDataRef} value="2">
            Create Individually
          </TabsTrigger>
          <TabsTrigger ref={pendingDataRef} value="3">
            Create in Bulk
          </TabsTrigger>
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
                <TableHead >Image</TableHead>
                <TableHead >Item</TableHead>
                <TableHead >Category</TableHead>
                <TableHead >Subcategory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                itemList[0].name != "" ? itemList.map((m, index) => {
                  return <TableRow className="" key={index}>
                    <TableCell className="w-32"><img width={75} height={75} src={m.image} alt="item-image" /></TableCell>
                    <TableCell className="w-64 capitalize"><TableCellViewer item={gotData[index]} /></TableCell>
                    <TableCell className="w-64">{m.category}</TableCell>
                    <TableCell className="w-64">{m.subcategory}</TableCell>
                  </TableRow>
                }) : null
              }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end px-4">
        </div>

      </TabsContent>
      <TabsContent
        value="2"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {
                  pendingOrderColumns.map(m => {
                    return <TableHead className={m.classValue} key={m.accessorKey}>{m.header}</TableHead>
                  })
                }
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                pending.map(m => {
                  return <TableRow>
                    <TableCell className="w-78"></TableCell>
                    <TableCell className="w-64">{m["customer name"]}</TableCell>
                    <TableCell className="w-64">{m["order value"]}</TableCell>
                    <TableCell className="w-64">{m["zone"]}</TableCell>
                    <TableCell className="w-32">{m["delivery status"]}</TableCell>
                    <TableCell className="w-32">{m["order status"]}</TableCell>
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
        value="3"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {
                  pendingOrderColumns.map(m => {
                    return <TableHead className={m.classValue} key={m.accessorKey}>{m.header}</TableHead>
                  })
                }
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                pending.map(m => {
                  return <TableRow>
                    <TableCell className="w-78"></TableCell>
                    <TableCell className="w-64">{m["customer name"]}</TableCell>
                    <TableCell className="w-64">{m["order value"]}</TableCell>
                    <TableCell className="w-64">{m["zone"]}</TableCell>
                    <TableCell className="w-32">{m["delivery status"]}</TableCell>
                    <TableCell className="w-32">{m["order status"]}</TableCell>
                  </TableRow>
                })
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
  const classInputValue = "focus:outline-none focus:border underline"
  const editCheckRef = React.useRef<HTMLButtonElement>(null);
  const dataChange = React.useRef<Record<string,any>>({}) ;
  const [brandValue, setBrandValue ] = React.useState<string>(item.brandId);
  const [firstUnitValue, setFirstUnitValue ] = React.useState<string>(item.unitId);
  const [secondaryUnitValue, setSecondaryUnitValue ] = React.useState<string>(item.brandId);

  return (
    <Drawer onClose={function () {
      dataChange.current = {};
      // not pushing the data 
    }} direction={isMobile ? "bottom" : "right"} >
      <DrawerTrigger asChild>
        <Button variant="link" className="capitalize text-foreground w-fit px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader className="gap-1">
          <DrawerTitle className="capitalize flex justify-between">{item.name}
             <div className="flex gap-1 items-center">
                <Checkbox checked={!savedValue} ref={editCheckRef} onCheckedChange={function (value) {
                  if(value) {
                    alert("entering the edit mode") 
                  setEdit(true)
                  setSaved(false)
                  }else if(value == false ) {
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
            < Badge variant={"default"}>
              {item.categoryId}
            </Badge>
            <Badge variant={"default"}>
              {item.subCategoryId}
            </Badge>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-xl">Image URL</div>
              <input className={classInputValue} disabled={savedValue} defaultValue={item?.["imageURL"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Disclaimer</div>
              <input className={classInputValue} disabled={savedValue} defaultValue={item?.["disclaimer"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <div className="text-xl">Brand</div>
                <div>{brandValue}</div>
              </div>
              <DialogViewer disableTrue={savedValue} type="brand" value="Brand" setValue={setBrandValue}></DialogViewer>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Product info</div>
              <Label>
                Shell Life
                <input className={classInputValue} disabled={savedValue} defaultValue={item?.["productInfoId"]["shellLife"]} />
              </Label>
              <Label>
                Storage Temperature
                <input className={classInputValue} disabled={savedValue} defaultValue={item?.["productInfoId"]["storageTemperature"]} />
              </Label>
              <Label>
                Container
                <input className={classInputValue} disabled={savedValue} defaultValue={item?.["productInfoId"]["container"]} />
              </Label>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Primary Size / Quantity</div>
              <input className={classInputValue} disabled={savedValue} defaultValue={item?.["primarySize"]} />
            </div>
            <div className="flex flex-col gap-3 tems-center">
              <div className="flex gap-3 items-center">

              <div className="text-xl">Current Unit</div>
              <div>
                {firstUnitValue}
              </div>
              </div>
              <DialogViewer disableTrue={savedValue}type="unit" value={"Change the Primary unit"} setValue={setFirstUnitValue}></DialogViewer>

            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">

              <div className="text-xl">Secondary Unit</div>
              <div>
                {secondaryUnitValue}
              </div>
              </div>
              <DialogViewer disableTrue={savedValue}type="unit" value={"Change the Secondary unit"} setValue={setSecondaryUnitValue}></DialogViewer></div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Secondary Size</div>
              <input className={classInputValue} disabled={savedValue} placeholder={item?.["secondaryUnitId"] || "no value in db"} defaultValue={item?.["secondarySize"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Conversion</div>
              <input className={classInputValue} disabled={savedValue} placeholder={item?.["secondaryUnitId"] || "no value in db"} defaultValue={item?.["conversion"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">MRP <Badge>no changes here</Badge></div>
              {
                item.priceId.map((m: any, index: number) => {
                  return <Label className="" key={index}>
                    {m.categoryPricing}
                    <input disabled={true} className={classInputValue} defaultValue={m.price}></input>
                  </Label>
                })
              }
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Our Price <Badge>no changes here</Badge></div>
              {
                item.discountPriceId.map((m: any, index: number) => {
                  return <Label className="" key={index}>
                    {m.categoryPricing}
                    <input disabled={true} className={classInputValue} defaultValue={m["discountPrice"]}></input>
                  </Label>
                })
              }
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Offers </div>
              {//deletion of data only in case of offers none others.
                item.offersId.map((m: any, index: number) => {
                  return <div key={index} className="p-2">
                    <div className="text-md flex justify-between mb-1 items-center">Offer #{index + 1} </div>
                    <Label>
                      Price
                      <input disabled={savedValue} className={classInputValue} defaultValue={m["price"]}></input>
                    </Label>
                    <Label>
                      Quantity
                      <input disabled={savedValue} className={classInputValue} defaultValue={m["quantity"]}></input>
                    </Label>
                    <Label>
                      Unit
                      <input disabled={savedValue} className={classInputValue} defaultValue={m["unit"]}></input>
                    </Label>
                    <Label>
                      Name
                      <input disabled={true} className={classInputValue} defaultValue={m["itemName"]}></input>
                    </Label>
                  </div>
                })
              }
              <DialogViewer disableTrue={savedValue} type="offers" value="create new offers or delete existing one" changes={item.offersId}></DialogViewer>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Out Of Stock</div>

              <Select defaultValue={item.outOfStock ? "true" : "false"} disabled={savedValue}>
                <SelectTrigger id="comingsoon" className="w-full">
                  <SelectValue placeholder="Select a options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">true</SelectItem>
                  <SelectItem value="false">
                      False
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Coming soon</div>
              <Select defaultValue={item.comingSoon ? "true" : "false"} disabled={savedValue}>
                <SelectTrigger id="comingsoon" className="w-full">
                  <SelectValue placeholder="Select a options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">true</SelectItem>
                  <SelectItem value="false">
                      False
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Max Order Unit</div>
              <input type="number" className={classInputValue} disabled={savedValue} defaultValue={item?.["maxOrder"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Search Value</div>
              <input className={classInputValue} disabled={savedValue} defaultValue={item?.["regExp"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Inventory <Badge className="" variant={"destructive"}>WIP</Badge></div>
              <input className={classInputValue} disabled={true} defaultValue={item?.["unitInHouse"]} />
            </div>

          </div>
        </div>
        <DrawerFooter>
            <DialogViewer type="submit" value="Submit to database" changes={dataChange.current} onclickValue={function () {}}></DialogViewer>
            <DialogViewer type="submit" value="Delete item in database" changes={dataChange.current} onclickValue={function () {}}></DialogViewer>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DialogViewer({type, value, changes,onclickValue, setValue, disableTrue}:{type:"alert"|"confirm"|"offers"|"unit"|"submit"|"brand", value?:string, changes?:any, onclickValue?:()=>void, setValue?: React.Dispatch<React.SetStateAction<any>>, disableTrue?:boolean}) {

  const [brandList, setBrandList] = React.useState<string[]>([]);
  const [unitList, setUnitList] = React.useState<string[]>([]);
  const [filterValue, setFilterValue] = React.useState<string[]>([]);
  const brandRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [offers, setOffers] = React.useState<{
    price:number, quantity:number, superSaver:boolean
  }>({
    price:0,
    quantity:0,
    superSaver:false
  });


  React.useEffect(function () {
    if (type == "brand") {
      fetch(BACKEND_URL!+"brand").then(async (m) => {
        let data = await m.json()
        setBrandList(data.data)
        setFilterValue(data.data);
      }).catch(err => console.log(err))
    }else if (type == "unit") {

      fetch(BACKEND_URL!+"unit").then(async (m) => {
        let data = await m.json()
        setUnitList(data.data)
      }).catch(err => console.log(err))
    }
  },[])

  const clearTime:React.RefObject<ReturnType<typeof setTimeout> | undefined> = React.useRef(undefined);


  if(type == "confirm"|| type=="submit" && !disableTrue){
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
  
}else if (type == "alert"&& !disableTrue) {
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
}else if (type == "unit"&& !disableTrue) {
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
                      
                      if(setValue) setValue(value);
                      setOpen(false)
                    }}>
                <SelectTrigger>
                <SelectValue placeholder="select the unit"/>
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
}else if (type == "brand"&& !disableTrue) {
  return  <Dialog open={open} onOpenChange={setOpen} >
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
                          }) ;
                           console.log(value)
                      }, 800)
                      
                    }}></Input>
                    <div className="overflow-scroll h-42 border rounded">
                       {
                        filterValue.length > 0 && filterValue.map((m, index) => {
                          return <div key={index} className="border p-2 hover:bg-white hover:text-black"   onClick={function () {
                            console.log(m)
                           if(setValue) setValue(m);
                           if(onclickValue) onclickValue();
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
                      if(setValue) setValue(brandRef.current?.value);
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
}else if (type == "offers"&& !disableTrue) {
  return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline"><IconPlus/>create / delete offers</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{value}</DialogTitle>
            <div aria-describedby="dialog description" className="flex flex-col gap-4">
              {changes.length > 0 && changes.map((m:any,index:number) => {
                return <div key={index} onClick={function () {
                  console.log(m)
                }} className={"flex justify-between rounded items-center border p-2"+ `${index==0 ?" mt-4":""}`}>
                  Offer #{index}<Button size={"sm"}  variant={"destructive"}><Trash className="size-4"></Trash></Button>
                </div>
              })}

              <div className="flex flex-col gap-2">
                <Label>Create New Offers</Label>
                <Input placeholder="price" onChange={function (e) {
                  let value = parseFloat(e.target.value);
                  setOffers(prev => {
                    return {...prev, price:value}
                  })
                }}></Input>
                <Input placeholder="quantity" onChange={function (e) {
                  let value = parseFloat(e.target.value);
                  setOffers(prev => {
                    return {...prev, quantity:value}
                  })
                }}></Input>
                <Input placeholder="unit is primary" disabled={true} ></Input>
                <Select onValueChange={function (e) {
                  let value = e == "true"? true : false;
                  setOffers(prev => {
                    return {...prev, superSaver:value}
                  })
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Is it a supersaver?"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
                <Input type={"submit"} onClick={function (){
                  if(offers.quantity == 0 || offers.price == 0  ) {
                    alert("please make sure the values are correct");
                  }else {
                    //TODO db call
                    setOpen(false)
                    console.log(offers)
                    setOffers(prev => {
                      return {
                        price:0,
                        quantity:0,
                        superSaver:false
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
}else {
  return <Button>check edit to start making changes</Button>
}
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