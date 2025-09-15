import * as React from "react"

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
import { Badge } from "./ui/badge"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { toast, Toaster } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"



export function DataTable() {
  const [category, setCategory] = React.useState<{name:string,value:number, default:boolean, id?:string}[]>([{name:"low",value:1, default:false},{name:"medium", default:true, value:1}, {default:false,name:"high", value:1}]);
  const allData = itemPricingOrder;
  let categoryPricingId = React.useRef<Record<string, string>>({})

  const [defaultCategory, _]  = React.useState("all");

  const dataChange = React.useRef<Record<string,{
    itemName: string,
    categoryPricing: string,
    price: string,
    discountPrice: string,
    id:string
  }>>({})
  
  const inputRef = React.useRef<HTMLInputElement>(null)


  const [itemData, setItemData] = React.useState<{itemName:string, price:number, discountPrice:number, categoryPricing:string,id:string}[]>([]);
  const [filterData, setFilterData] = React.useState<{itemName:string, price:number, discountPrice:number, categoryPricing:string,id:string}[]>([])

  const [enableEdit, setEnableEdit] = React.useState(false)
  const [saveValue, setSaveValue] = React.useState(true);

  const [inputValue, setInputValue] = React.useState("");

  const editCheckRef = React.useRef<HTMLButtonElement>(null)
  const allInputPriceRef = React.useRef<HTMLInputElement[]>([])
  const allInputDiscountRef = React.useRef<HTMLInputElement[]>([])

  function filterValue(value:string) {
    console.log(defaultCategory, value)
    if(value == "all") {
      setFilterData(itemData)
    }else {
      let newData  = itemData.filter(m => categoryPricingId.current[m.categoryPricing] == value)
      console.log(newData, categoryPricingId.current)
      setFilterData(newData)
    }
  }

  React.useEffect(function () {
    filterValue(defaultCategory)
    let url = BACKEND_URL + "priceData";
    axios.get(url, {withCredentials:true}).then(m =>{

      let data = m.data;
      let categoryList = data.categoryPricingList;
      let userCategoryValue = data.categorizingUser;
      let priceList = data.priceList;

      setCategory(() => {
        let newData = [];
        categoryList.forEach((m:{name:string, default:boolean, id:string})=>{

          categoryPricingId.current[m.id] = m.name;

          newData.push({
            name:m.name,value:userCategoryValue[m.name]??0, default:m.default,id:m.id
          })
        })


        newData.push({name:"no-category", default:false, value:userCategoryValue["no-category"],id:""})
        return newData;
      })
      setItemData(priceList);
      setFilterData(priceList);
    })

  },[])

  function deleteCategoryPricing(id:string) {
    toast.error("can't delete the category pricing once created, in v1")
  }

  function createCategoryPricing(name:string) {
    if(name.trim() == "") {
      toast.error("please name can't be empty")
      return
    }
    let url = BACKEND_URL + "newCategoryPricing"+"/"+name.trim();
    
    axios.post(url, {}, {withCredentials:true}).then(value => {
      let data = value.data;
      if(data.success) {
        toast.info(data.message + ' refreshing')
        setTimeout(function() {
          location.reload();
        },500)
      }else {
        toast.error(data.message)
      }
    }).catch(err => {
      console.log(err, "error")
    })
  }


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
          <TabsTrigger className="text-sm p-4"  value="1">Pricing Category</TabsTrigger>

          <TabsTrigger className="text-sm p-4" value="2">
            Pricing Item
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="1"
        className="relative flex gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg ">
        <div className="text-xs mb-2"><Badge>default* medium is fixed</Badge></div>
          <Table className=" border ">
            <TableHeader className="">
              <TableRow className="">
               
              <TableHead className={"p-4 text-lg font-bold"}>Category</TableHead>
              <TableHead className={"p-4 text-lg font-bold"}>Total Users</TableHead>
              <TableHead className={"p-4 text-lg font-bold w-12"}></TableHead>
              
               
              </TableRow>
            </TableHeader>
            <TableBody>
                
                  {category.map((m, index) => {
                    return <TableRow key={index}>
                      <TableCell className="p-4 w-78 flex gap-4">{m.name} {m.default&&<Badge>default</Badge>}</TableCell>
                      <TableCell className="p-4 w-78">{String(m.value) == "" ? 0 : m.value}</TableCell>
                      <TableCell className="p-4 w-12 ">{m.name !== "no-category"&&<div className="bg-gray-800 hover:bg-gray-50 hover:text-red-400 rounded p-2" onClick={function() {
                        deleteCategoryPricing(m.id as string)
                      }}> <Trash2Icon className="size-4 "/></div>}</TableCell>
                      </TableRow>
                  })
                }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-start gap-4 px-4 flex-col justify-start">
                <div className="flex flex-col gap-3">
                 <Label className="text-lg" htmlFor="target">Create New Category</Label>
                 <Input onClick={function(){
                  
    toast.info("carefully create once created can't delete, in v1")
                 }} onChange={function(e){
                  let value = e.target.value;
                  setInputValue(value)
                 }} ref={inputRef} id="target" />
               </div>
               
                 <Dialog>
      <form>
        <DialogTrigger asChild>
         <Button>create</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Creation of Category?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {inputValue.trim() !== "" ? <span className="underline">{inputRef.current?.value as string}</span>: "no value is given"} is the value for category pricing.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={function () {
                createCategoryPricing(inputRef.current?.value as string)
               }} type="button">Confirm Create</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>

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
                    category.map((m,index) => {
                      if(m.name == "no-category") {
                        return;
                      }

                      return <SelectItem key={index} value={m.name}>{m.name}</SelectItem>
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
              enableEdit && <Button onClick={async function () {
                setSaveValue(true)
                setEnableEdit(false)
                
                // pushing to the database the data -- changes
                //TODO
                let url = BACKEND_URL+"priceChange"
                axios.put(url,{data:dataChange.current},{withCredentials:true}).then(m=>{
                  let data = m.data;

                  if(data.success) {

                    toast.info(data.message)
                  }else {
                    toast.error("try again not updated"+ " "+data.message);
                    window.location.reload();
                  }
                  
                })

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
                 filterData.length > 0 &&  filterData.map((m,index) => {




                    return <TableRow className="" key={index}>
                      <TableCell className="w-78 p-4 pb-2">{m.itemName}</TableCell>
                      <TableCell className="w-64 p-4 pb-2">{m.categoryPricing}</TableCell>
                      <TableCell className="w-64 p-4 pb-2">
                        <input ref={function (ref) {
                          if(!ref) return;
                          allInputPriceRef.current[index] = ref
                        }}  onChange={function (eobj) {
                          dataChange.current[m.itemName]= {
                            itemName: m.itemName,
                            categoryPricing: m.categoryPricing,
                            price: eobj.target.value,
                            discountPrice: allInputDiscountRef.current[index].value,
                            id:m.id
                          }
                        }} className="focus:outline-none" type="text" disabled={!enableEdit} defaultValue={m.price}/>
                        </TableCell>
                      <TableCell className="w-64 p-4 pb-2">
                        <input ref={function (ref) {
                          if(!ref) return;
                          allInputDiscountRef.current[index] = ref
                        }} onChange={function (eobj) {
                          dataChange.current[m.itemName]= {
                            itemName: m.itemName,
                            categoryPricing: m.categoryPricing,
                            price: allInputPriceRef.current[index].value,
                            discountPrice: eobj.target.value,
                            id:m.id
                          }
                        }} className="focus:outline-none" type="text" disabled={!enableEdit} defaultValue={m.discountPrice}/>
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
      <Toaster></Toaster>
    </Tabs>
   
  )
}