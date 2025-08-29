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


const itemPricingColumns = [

   {
    accessorKey: "item name",
    header: "Item name",
    classValue:"w-78",
    edit:false
  },
  {
    accessorKey: "category",
    header: "Category",
    classValue:"w-64",
    edit:false,
  }, 
  {
    accessorKey: "mrp",
    header: "Mrp",
    classValue:"w-64",
    edit:true,
  },
  {
    accessorKey: "discountPrice",
    header: "Our Price",
    classValue:"w-64",
    edit:true
  },
]


import itemPricingOrder from "@/itemPricing.json";


import { Input } from "./ui/input"
import { Trash2Icon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"



export function DataTable() {
  const [category, setCategory] = React.useState([{name:"low",value:10, default:false},{name:"medium", default:true, value:50}, {default:false,name:"high", value:12}]);
  const allData = itemPricingOrder;
  const [defaultCategory, setDefaultCategory]  = React.useState("medium");
  const dataChange = React.useRef<Record<string,{
    item: string,
    category: string,
    mrp: string,
    discountPrice: string
  }>>({})
  const pendingDataRef = React.useRef<HTMLButtonElement>(null)
  const itemRequirementRef = React.useRef<HTMLButtonElement >(null)

  const [itemData, setItemData] = React.useState(allData);
  const [enableEdit, setEnableEdit] = React.useState(false)
  const [saveValue, setSaveValue] = React.useState(true);
  const editCheckRef = React.useRef<HTMLButtonElement>(null)
  const allInputRef = React.useRef<HTMLInputElement[]>([])

  function filterValue(value:string) {
    if(value == "all") {
      setItemData(allData)
    }else {
      setItemData(allData.filter(m => m.category == value))
    }
  }

  React.useEffect(function () {
    filterValue(defaultCategory)
  },[])


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
          <TabsTrigger className="text-sm p-4" ref={itemRequirementRef} value="1">Pricing Category</TabsTrigger>

          <TabsTrigger className="text-sm p-4" ref={pendingDataRef} value="2">
            Pricing Item
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="1"
        className="relative flex gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table className=" border ">
            <TableHeader className="">
              <TableRow className="">
               
              <TableHead className={"p-4 text-lg font-bold"}>Category</TableHead>
              <TableHead className={"p-4 text-lg font-bold"}>Total Users</TableHead>
              <TableHead className={"p-4 text-lg font-bold w-12"}></TableHead>
              
               
              </TableRow>
            </TableHeader>
            <TableBody>
                
                  {category.map(m => {

                    return <TableRow key={m.name}>
                      <TableCell className="p-4 w-78">{m.name}</TableCell>
                      <TableCell className="p-4 w-78">{m.value}</TableCell>
                      <TableCell className="p-4 w-12 " onClick={function () {
                        alert("add functionality")
                      }}><div className="bg-gray-800 hover:text-red-400 rounded p-2"><Trash2Icon className="size-4 "/></div></TableCell>
                      </TableRow>
                  })
                }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-start gap-4 px-4 flex-col justify-start">
                <div className="flex flex-col gap-3">
                 <Label className="text-lg" htmlFor="target">Create New Category</Label>
                 <Input id="target"  />
               </div>
               <Button onClick={function () {
                alert("add functionality")
               }}>create</Button>

      </div>
         
      </TabsContent>
      <TabsContent
        value="2"
        className="flex flex-col px-4  lg:px-6"
      >
        <div className="flex gap-2 justify-between select-none pb-2">
          <div className="flex gap-3 items-center">
               <Label htmlFor="reviewer">Category</Label>
               <Select onValueChange={filterValue} >
                 <SelectTrigger className="w-full">
                   <SelectValue placeholder="Select a category" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">all</SelectItem>
                  {
                    category.map(m => {
                      return <SelectItem value={m.name}>{m.name}</SelectItem>
                    })
                  }
                 </SelectContent>
               </Select>
          </div>
            <div className="flex gap-1 items-center">
                <Checkbox checked={!saveValue} ref={editCheckRef} onCheckedChange={function (value) {
                  if(value) {
                    alert("entering the edit mode") 
                  setEnableEdit(true)
                  setSaveValue(false)
                  }else if(value == false ) {
                    alert("make you save first")
                  // setEnableEdit(false)
                  }
                }}></Checkbox>
            <div className="text-sm lowercase">
              Edit
            </div>
            {
              enableEdit && <Button onClick={function () {
                setSaveValue(true)
                setEnableEdit(false)
                
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

        </div>
       <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
               {
                itemPricingColumns.map(m=>{
                  return <TableHead className={m.classValue + " text-lg p-4 pb-2"} key={m.accessorKey}>{m.header}</TableHead>
                })
               } 
              </TableRow>
            </TableHeader>
            <TableBody>
                {
                  itemData.map((m,index) => {
                    return <TableRow className="" key={m.id}>
                      <TableCell className="w-78 p-4 pb-2">{m["item"]}</TableCell>
                      <TableCell className="w-64 p-4 pb-2">{m["category"]}</TableCell>
                      <TableCell className="w-64 p-4 pb-2">
                        <input ref={function (ref) {
                          if(!ref) return;
                          allInputRef.current[index] = ref
                        }}  onChange={function (eobj) {
                          dataChange.current[m["item"]]= {
                            item: m["item"],
                            category: m["category"],
                            mrp: eobj.target.value,
                            discountPrice: allInputRef.current[index].value,
                          }
                        }} className="focus:outline-none" type="text" disabled={!enableEdit} defaultValue={m["mrp"]}/>
                        </TableCell>
                      <TableCell className="w-64 p-4 pb-2">
                        <input ref={function (ref) {
                          if(!ref) return;
                          allInputRef.current[index] = ref
                        }} onChange={function (eobj) {
                          dataChange.current[m["item"]]= {
                            item: m["item"],
                            category: m["category"],
                            mrp: allInputRef.current[index].value,
                            discountPrice: eobj.target.value,
                          }
                        }} className="focus:outline-none" type="text" disabled={!enableEdit} defaultValue={m["discountPrice"]}/>
                        </TableCell>
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