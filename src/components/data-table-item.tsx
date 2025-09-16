import * as React from "react"

import { z } from "zod"
import { toast, Toaster } from "sonner"

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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { useNavigate } from "react-router-dom"
import axios from "axios"

interface dataInterface { name: string, image: string, category: string, subcategory: string, regexValue: string }
interface dataValue {
              id: string,
              imageURL: string,
              disclaimer: string,
              brandId: string,
              productInfoId: {
                shellLife:string,
                storageTemperature:string,
                container:string
              },
              primarySize: number,
              quantity:number,
              unitId: string,
              secondaryUnitId: string,
              conversion:number ,
              secondarySize: number,
              outOfStock: boolean,
              comingSoon:boolean,
              maxOrder:number,
              regExp: string
            }

export function DataTable() {
  const [itemList, setItemList] = React.useState<dataInterface[]>([]);
  const [filterData, setFilterData] = React.useState<dataInterface[]>([]);

  const pendingDataRef = React.useRef<HTMLButtonElement>(null)
  const itemRequirementRef = React.useRef<HTMLButtonElement>(null);

  const clearTimeRef: React.RefObject<ReturnType<typeof setTimeout> | undefined> = React.useRef(undefined)

  let [_, setTotalItem] = React.useState(itemList.length);
  let [gotData, setGotData] = React.useState<any[]>([]);
  let [filterGotData, setFilterGotData] = React.useState<any>([])

  let navigate = useNavigate()

  let fetchData = React.useMemo(async function () {
    let data = await (await fetch(BACKEND_URL + "items", { credentials: "include" })).json()

    if ("object" in data && data.object.includes("login")) {
      navigate("/login");
      localStorage.setItem("data", "")
    }
    setGotData(data.data);
    setFilterGotData(data.data);
    return data.data;
  }, [])



  React.useEffect(function () {
    // console.log(gotData, filterGotData, fetchData)
    // getting all the items from the backend 
    fetch(BACKEND_URL + "items", { credentials: "include" }).then(async (m) => {
      let data = await m.json()
      setItemList(prev => {
        let newData = data.data.map((m: any) => ({ name: m.name, image: m.imageURL, category: m.categoryId, subcategory: m.subCategoryId, regexValue: m.regExp }));
        return newData;
      });
      setFilterData(prev => {
        let newData = data.data.map((m: any) => ({ name: m.name, image: m.imageURL, category: m.categoryId, subcategory: m.subCategoryId, regexValue: m.regExp }));
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
        <div>
          <Input placeholder="search a item" onChange={function (e) {
            let string = e.target.value.toLowerCase();
            clearTimeout(clearTimeRef.current);

            clearTimeRef.current = setTimeout(function () {

              let filterValue = itemList.filter(m => {
                let regexPattern = new RegExp(`${string}`, "i");
                let match = m.regexValue.match(regexPattern);
                return match != null;
              });

              let filterGotData = gotData.filter(m => {
                let regexPattern = new RegExp(`${string}`, "i");

                let match = m.regExp.match(regexPattern);
                return match != null;
              })

              console.log(filterValue, "-------------")

              setFilterGotData(filterGotData);
              setFilterData(filterValue);
            }, 1000)

          }}></Input>
        </div>
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
                filterData.length > 0 ? filterData.map((m, index) => {

                  // console.log(filterData);

                  return <TableRow className="" key={index}>
                    <TableCell className="w-32"><img width={75} height={75} src={m.image} alt="item-image" /></TableCell>
                    <TableCell className="w-64 capitalize"><TableCellViewer item={filterGotData[index]} /></TableCell>
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
      <TabsContent value="2" className="flex flex-col px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border p-4">
          <IndividualCreate></IndividualCreate>
        </div>
        <div className="flex items-center justify-end px-4">
        </div>
      </TabsContent>
      <TabsContent
        value="3"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <BulkCreate></BulkCreate>
        </div>
        <div className="flex items-center justify-end px-4">
        </div>
      </TabsContent>
    </Tabs>
  )
}

function IndividualCreate() {

  let [createState, setCreateState] = React.useState({
    name: "",
    imageURL: "",
    buttonURL: "",
    disclaimer: "The product may not be simlar to picture, the used picture is rather for general reference.",
    brandId: "",
    categoryId: "",
    subCategoryId: "",
    productInfoId: {
      itemName: "",
      category: "",
      shellLife: "1-2 days",
      storageTemperature: "15-22 °C",
      container: "polythene"
    },
    quantity: 0,
    primarySize: 0,
    unitId: "",
    secondarySize: 0,
    secondaryUnitId: "",
    conversion: 0,
    priceId: 0
    // [{
    //   categoryPricing:"",
    //   price:"",
    //   itemName:"",
    //   discountPrice:""
    // }]
    ,
    discountPriceId: 0,
    // [{ // same value for each category -- when creating it.
    //   categoryPricing:"",
    //   discountPrice:"",
    //   price:"",
    //   itemName:"",
    // }]
    savingAmount: 0,
    offersId: [],
    outOfStock: false,
    comingSoon: false,
    maxOrder: 0,
    regExp: "",
    unitInHouse: 1
  });
  let [brandList, setBrandList] = React.useState<string[]>([]);
  let [categoryList, setCategoryList] = React.useState<Record<string, string>[]>([{}]);
  let [subCategoryList, setSubCategoryList] = React.useState<Record<string, string[]>>({});
  let [filterSub, setFilterSub] = React.useState<string[]>([]);
  let [unitList, setUnitList] = React.useState<string[]>([]);
  let [open, setOpen] = React.useState(false)
  let [brandOpen, setBrandOpen] = React.useState(false)
  let [createItemState, setCreateItemState] = React.useState(false);
  let brandRef = React.useRef<HTMLInputElement>(null)
  // let [pricingCategoryList, setPricingCategoryList] = React.useState<string[]>([]);


  function validateInput() {

    let schema = z.object({
      name: z.string().min(2, { message: "please make sure the value has at least 2 characters" }),
      imageURL: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
      buttonURL: z.string(),
      disclaimer: z.string().min(10, { message: "please make sure the value has at least 10 characters" }),
      brandId: z.string().length(24, { message: "please make sure the value has 24 characters" }),
      categoryId: z.string().length(24, { message: "please make sure the value has 24 characters" }),
      subCategoryId: z.string().length(24, { message: "please make sure the value has 24 characters" }),
      productInfoId: z.object({
        itemName: z.string(),
        category: z.string(),
        shellLife: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
        storageTemperature: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
        container: z.string().min(5, { message: "please make sure the value has at least 5 characters" })
      }),
      quantity: z.number({ error: "make sure the quantity is number" }),
      primarySize: z.number({ error: "make sure the primary size is number" }),
      unitId: z.string().length(24, { message: "please make sure the value has 24 characters" }),
      secondarySize: z.number({ error: "make sure the secondary size is number" }).optional(),
      secondaryUnitId: z.string().length(24, { message: "please make sure the secondary value has 24 characters" }).optional().or(z.literal("")),
      conversion: z.number({ error: "make sure the conversion is number" }).optional(),
      priceId: z.number({ error: "make sure the price is number" }),
      discountPriceId: z.number({ error: "make sure the discount price is number" }),
      savingAmount: z.number().default(0),
      offersId: z.array(z.string()).default([]),
      outOfStock: z.boolean({ error: "select the value in out of stock" }),
      comingSoon: z.boolean({ error: "select the value in coming soon" }),
      maxOrder: z.number({ error: "make sure the max order is number" }),
      regExp: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
      unitInHouse: z.number().default(1)
    });

    let check = schema.safeParse(createState);

    let secondaryUnitState = (createState.secondaryUnitId == "" && (createState.conversion != 0 || createState.secondarySize != 0)) || (createState.secondaryUnitId != "" && (createState.conversion == 0 || createState.secondarySize == 0));

    if (check.success) {
      if (secondaryUnitState) {
        console.log("error of secondary unit ")
        toast.error("Error has been occurred", {
          description: "please make sure when you are having the secondary unit, secondary size and conversion is required"
        })
        return;
      } else {
        setCreateItemState(true);
        //backend call 

      }
    }
    else {
      for (var error of (check.error.issues.slice(0, 3))) {
        // creating the sonner value and changing the value as well
        console.log(error)
        toast.error("Error has been occurred", {
          description: error.message,
        })

      }
    }
  }

  React.useEffect(function () {
    let url = BACKEND_URL! + "all";
    fetch(url, { credentials: "include" }).then(async (m) => {
      let { unit, brand, category, subCategory } = await m.json();
      setUnitList(unit)
      setBrandList(brand)
      setCategoryList(category)
      setSubCategoryList(subCategory)
      setFilterSub(subCategory)
    }).catch(err => console.log(err))

  }, [])

  return <div className="flex flex-col gap-3 text-xl ">
    <Label className="w-80">

      Product name :  <span className="text-red-500">*</span>
    </Label>
    <Input className="w-80" onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return {
          ...prev, name: value, productInfoId: {
            ...prev.productInfoId,
            itemName: value
          }
        }
      })
    }}></Input>
    <Label className="w-80">
      Image URL:  <span className="text-red-500">*</span>
    </Label>
    <Input onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, imageURL: value }
      })
    }}></Input>
    <Label>
      Disclaimer :
    </Label>
    <textarea defaultValue={"The product may not be simlar to picture, the used picture is rather for general reference."} className="border rounded text-sm p-2" rows={6} cols={20} onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, disclaimer: value }
      })
    }}></textarea>
    <div className="flex flex-col gap-3">
      <Label>
        Select Category & Subcategory :      <span className="text-red-500">*</span>
      </Label>
      <div className="flex gap-4">
        <Select onValueChange={function (value) {

          let objectId = categoryList.filter(m => {
            let object = Object.keys(m);
            return object[0] == value;
          });

          setCreateState(prev => {
            return {
              ...prev, categoryId: objectId[0][value], productInfoId: {
                ...prev.productInfoId,
                category: value
              }
            }
          })

          setFilterSub(subCategoryList[value as string]);
        }}>
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select a cateogry" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(categoryList).map((m, index) => {
              let [value] = Object.keys(m);

              return <SelectItem key={index} value={value}>{value}</SelectItem>
            })}
          </SelectContent>
        </Select>
        <Select onValueChange={function (value) {
          setCreateState(prev => {
            return { ...prev, subCategoryId: value }
          })
        }}> <SelectTrigger id="category" className="w-full"> <SelectValue placeholder="Select a sub category" />
          </SelectTrigger>
          <SelectContent>
            {filterSub.length > 0 ? Object.values(filterSub).map((m, index) => {
              let [value] = Object.keys(m);
              let [key] = Object.values(m);
              return <SelectItem key={index} value={key}>{value}</SelectItem>
            }): <SelectItem value={"null"} > select the category first</SelectItem> }
          </SelectContent>
        </Select>
      </div>
    </div>

    <Label>
      Brand name : <span className="text-red-500">*</span>
    </Label>
    <div className="flex gap-2">
      <Select onValueChange={function (value) {
        setCreateState(prev => {
          return { ...prev, brandId: value }
        })
      }}>
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder="Select a brand" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(brandList).map((m, index) => {
            let [value] = Object.keys(m);
            let [key] = Object.values(m);
            return <SelectItem key={index} value={key}>{value}</SelectItem>
          })}
        </SelectContent>
      </Select>

      <Dialog open={brandOpen} onOpenChange={setBrandOpen} >
        <DialogTrigger asChild>
          <Button variant="outline">Create <IconPlus></IconPlus></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
            <div className=" flex flex-col gap-4">
              <Input ref={brandRef}></Input>
              <Button onClick={function () {
                // sending the request to the backend
                let data = brandRef.current?.value;

                let url = BACKEND_URL + "createBrand";
                axios.post(url, { data }, { withCredentials: true }).then(n => {
                  
                  let value = n.data;

                  if (value.success) {
                    toast.info(value.message)
                    setTimeout(function () {
                      location.reload();
                    }, 1000)
                  } else {
                    toast.error(value.message)
                  }
                })
              }}>create</Button>
            </div>

          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>

    <Label className="text-xl">
      <span className="w-80">
        Product info :       <span className="text-red-500">*</span>
      </span>
    </Label>
    <div className="pl-10 flex flex-col gap-2">

      <Label>
        <span className="w-80">
          Shell Life :
        </span>
        <Input defaultValue={(function () {

          return "1-2 days"
        })()} onChange={function (e) {
          let value = e.target.value;
          setCreateState(prev => {
            return {
              ...prev, productInfoId: {
                ...prev.productInfoId,
                shellLife: value
              }
            }
          })
        }}></Input>
      </Label>
      <Label>
        <span className="w-80">
          Storage Temperature °C :
        </span>
        <Input defaultValue={(function () {

          return "15-22 °C"
        })()} onChange={function (e) {
          let value = e.target.value;
          setCreateState(prev => {
            return {
              ...prev, productInfoId: {
                ...prev.productInfoId,
                storageTemperature: value
              }
            }
          })
        }}></Input>
      </Label>
      <Label>
        <span className="w-80">

          Container :
        </span>
        <Input defaultValue={(function () {

          return "polythene"
        })()} onChange={function (e) {
          let value = e.target.value;
          setCreateState(prev => {
            return {
              ...prev, productInfoId: {
                ...prev.productInfoId,
                container: value
              }
            }
          })
        }}></Input>
      </Label>
    </div>
    <Label>
      primary size / quantity :
    </Label>
    <Input type="number" onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, primarySize: Number(value), quantity: Number(value) }
      })
    }}></Input>
    <Label>
      current unit :
    </Label>
    <Select onValueChange={function (value) {
      setCreateState(prev => {
        return { ...prev, unitId: value }
      })
    }}>
      <SelectTrigger id="category" className="w-full">
        <SelectValue placeholder="Select a unit" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(unitList).map((m, index) => {
          let [value] = Object.keys(m);
          let [key] = Object.values(m);
          return <SelectItem key={index} value={key}>{value}</SelectItem>
        })}
      </SelectContent>
    </Select>

    <Label>
      secondary unit :

    </Label>
    <Select onValueChange={function (value) {
      setCreateState(prev => {
        return { ...prev, secondaryUnitId: value }
      })
    }}>
      <SelectTrigger id="category" className="w-full">
        <SelectValue placeholder="Select a secondary unit" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(unitList).map((m, index) => {
          let [value] = Object.keys(m);
          let [key] = Object.values(m);
          return <SelectItem key={index} value={key}>{value}</SelectItem>
        })}
      </SelectContent>
    </Select>
    <Label>
      secondary size :
    </Label>
    <Input type="number" onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, secondarySize: Number(value) }
      })
    }}></Input>
    <Label>
      conversion :
    </Label>
    <Input type="number" onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, conversion: Number(value) }
      })
    }}></Input>
    <Label>
      price :  <span className="text-red-500">*</span>
    </Label>
    <Input type="number" onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, priceId: Number(value) }
      })
    }}></Input>
    <Label>
      discount price :  <span className="text-red-500">*</span>

    </Label>
    <Input type="number" onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, discountPriceId: Number(value) }
      })
    }}></Input>
    <Label>
      out of stock  : <span className="text-red-500">*</span>
    </Label>
    <Select onValueChange={function (value) {
      setCreateState(prev => {
        return { ...prev, outOfStock: value == "true" ? true : false }
      })
    }}>
      <SelectTrigger id="category" className="w-full">
        <SelectValue placeholder="Is is out of stock?" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">
          true
        </SelectItem>
        <SelectItem value="false">
          false
        </SelectItem>
      </SelectContent>
    </Select>
    <Label>
      coming soon :   <span className="text-red-500">*</span>
    </Label>
    <Select onValueChange={function (value) {
      setCreateState(prev => {
        return { ...prev, outOfStock: value == "true" ? true : false }
      })
    }}>
      <SelectTrigger id="category" className="w-full">
        <SelectValue placeholder="Is it a coming soon product?" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">
          true
        </SelectItem>
        <SelectItem value="false">
          false
        </SelectItem>
      </SelectContent>
    </Select>
    <Label>
      max order quantity:   <span className="text-red-500">*</span>
    </Label>
    <Input type="number" onChange={function (e) {
      let value = e.target.value;
      setCreateState(prev => {
        return { ...prev, maxOrder: Number(value) }
      })
    }}></Input>
    <Label>
      search value :        <span className="text-red-500">*</span>
    </Label>
    <Input onChange={function (e) {
      let change = e.target.value.toLowerCase();
      setCreateState(prev => {
        return { ...prev, regExp: change }
      })
    }}></Input>
    <div className="w-screen">
      <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button onClick={function () {
            validateInput()
          }} variant="secondary" className="bg-sky-600 text-white ">Preview Item</Button>
        </DialogTrigger>
        <DialogContent className="!w-[80%] !p-4">
          <DialogHeader>
            <DialogTitle className="mt-4">The information following will going to go to the database.</DialogTitle>
          </DialogHeader>

          <div className="p-4">
            {
              createState.name != "" && createState.brandId != "" && createState.categoryId != "" && createState.subCategoryId != "" && createState.unitId != "" ? <div className="flex flex-col gap-1">
                {
                  Object.entries(createState).map(([key, value]) => {
                    let property = key;
                    let data = value;
                    if (property == "buttonURL") {
                      data = "/item/" + createState["name"].toLowerCase().replace(/\s/g, "_");
                    }
                    else if (property == "brandId") {
                      let addon = Object.entries(brandList.filter(m => {
                        let [value] = Object.values(m);
                        return value == data;
                      })[0] ?? { "no": "data" })[0][0];;

                      data += "  |  " + addon;
                    }
                    else if (property == "categoryId") {
                      let addon = Object.entries(categoryList.filter(m => {
                        let [value] = Object.values(m);
                        return value == data;
                      })[0])[0][0];

                      data += "  |  " + addon;
                    }
                    else if (property == "subCategoryId") {
                      let category = Object.entries(categoryList.filter(m => {
                        let [value] = Object.values(m);
                        return value == createState.categoryId;
                      })[0])[0][0];

                      let subcategory = Object.entries(subCategoryList[category].filter(m => {
                        let [value] = Object.values(m);
                        return value == data;
                      })[0])[0][0];
                      data += "  |  " + subcategory;
                    }

                    else if (property == "unitId") {
                      let addon = Object.entries(unitList.filter(m => {
                        let [value] = Object.values(m);
                        return value == data;
                      })[0])[0][0];;

                      data += "  |  " + addon;
                    }
                    else if (property == "secondaryUnitId" && value != "") {
                      let addon = Object.entries(unitList.filter(m => {
                        let [value] = Object.values(m);
                        return value == data;
                      })[0])[0][0];;

                      data += "  |  " + addon;
                    }

                    return <div className="flex  justify-between " key={key}>
                      <span>{property}:</span>
                      <span className="underline self-end" >{typeof data == "object" ? Object.entries(data).map(function ([key, value]) {


                        return <div className="flex gap-2">
                          <span>{key}</span>:<span>{value}</span>
                        </div>

                      }) : data.toString()}</span>
                    </div>

                  })
                }
              </div> : <div className="cursor-pointer" onClick={function (e) {
                console.log(createState.name != "" && createState.brandId != "" && createState.categoryId != "" && createState.subCategoryId != "" && createState.unitId != "", createState.name != "", createState.brandId != "", createState.categoryId != "", createState.subCategoryId != "", createState.unitId != "")
                console.log("hello world")
              }}>
                please make sure the data has itemname at least name init, category, sub category, unit, brand
              </div>
            }
          </div>
          <DialogFooter>
            <Button disabled={!createItemState} type="submit" variant={"default"} onClick={function() {
              let url = BACKEND_URL + "individual";
                axios.post(url, { data:createState }, { withCredentials: true }).then(n => {
                  
                  let value = n.data;

                  if (value.success) {
                    toast.info(value.message)
                    setTimeout(function () {
                      location.reload();
                    }, 1000)
                  } else {
                    toast.error(value.message)
                  }
                })
              
              
            }}>Create Item</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <Toaster />
  </div>
}
function BulkCreate() {

  let [brandList, setBrandList] = React.useState<string[]>([]);
  let [categoryList, setCategoryList] = React.useState<Record<string, string>[]>([{}]);
  let [subCategoryList, setSubCategoryList] = React.useState<Record<string, string[]>>({});
  let [filterSub, setFilterSub] = React.useState<string[]>([]);
  let [unitList, setUnitList] = React.useState<string[]>([]);
  let [sumbitFinalData, setSubmitFinalData] = React.useState<boolean>(false)
  let [finalData, setFinalData] = React.useState<{
    name: string,
    imageURL: string,
    buttonURL: string,
    disclaimer: string,
    brandId: string,
    categoryId: string,
    subCategoryId: string,
    productInfoId: {
      itemName: string,
      category: string,
      shellLife: string,
      storageTemperature: string,
      container: string
    },
    quantity: number,
    primarySize: number,
    unitId: string,
    secondarySize: number,
    secondaryUnitId: string,
    conversion: number,
    priceId: number,
    discountPriceId: number,
    savingAmount: number,
    offersId: [],
    outOfStock: boolean,
    comingSoon: false,
    maxOrder: number,
    regExp: string,
    unitInHouse: 1
  }[]>([])
  let listRef = React.useRef<Record<string, string[]>>({
    "brandlist": [],
    "unitlist": [],
    "categorylist": [],
    "subcategorylist": []
  })
  let objecIdRef = React.useRef<Record<string, Record<string, string>>>({
    "brandlist": {},
    "unitlist": {},
    "categorylist": {},
    "subcategorylist": {}
  })
  let fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(function () {
    let url = BACKEND_URL! + "all";
    fetch(url, { credentials: "include" }).then(async (m) => {
      let { unit, brand, category, subCategory } = await m.json();
      setUnitList(unit)
      setBrandList(brand)
      setCategoryList(category)
      setSubCategoryList(subCategory)
      console.log(unit, brand, category, subCategory)
      setFilterSub(subCategory)
    }).catch(err => console.log(err))

  }, [])

  let checkData = React.useCallback(async function (data: string[][]): Promise<boolean> {
    let schema = z.object({
      name: z.string().min(2, { message: "please make sure the value has at least 2 characters" }),
      imageURL: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
      buttonURL: z.string(),
      disclaimer: z.string().min(10, { message: "please make sure the value has at least 10 characters" }),
      brandId: z.enum(listRef.current["brandlist"], { error: "make the data is in the list " }),
      categoryId: z.enum(listRef.current["categorylist"], { message: "please make sure the category in the database" }),
      subCategoryId: z.enum(listRef.current["subcategorylist"], { message: "please make sure the subcategory in the database" }),
      productInfoId: z.object({
        itemName: z.string(),
        category: z.string(),
        shellLife: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
        storageTemperature: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
        container: z.string().min(5, { message: "please make sure the value has at least 5 characters" })
      }),
      quantity: z.number({ error: "make sure the quantity is number" }),
      primarySize: z.number({ error: "make sure the primary size is number" }),
      unitId: z.enum(listRef.current["unitlist"], { message: "please make sure the unit in the database" }),
      secondarySize: z.number({ error: "make sure the secondary size is number" }).optional(),
      secondaryUnitId: z.enum(["", ...listRef.current["unitlist"]], { message: "please make sure the unit in the database secondary." }).optional(),// z.string().length(24, { message: "please make sure the secondary value has 24 characters" }).optional().or(z.literal("")),
      conversion: z.number({ error: "make sure the conversion is number" }).optional(),
      priceId: z.number({ error: "make sure the price is number" }),
      discountPriceId: z.number({ error: "make sure the discount price is number" }),
      savingAmount: z.number().default(0),
      offersId: z.array(z.string()).default([]),
      outOfStock: z.boolean({ error: "select the value in out of stock" }),
      comingSoon: z.boolean({ error: "select the value in coming soon" }),
      maxOrder: z.number({ error: "make sure the max order is number" }),
      regExp: z.string().min(5, { message: "please make sure the value has at least 5 characters" }),
      unitInHouse: z.number().default(1)
    });


    let newData = [];

    for (var eachRow of data) {
      let createState: {
        name: string,
        imageURL: string,
        buttonURL: string,
        disclaimer: string,
        brandId: string,
        categoryId: string,
        subCategoryId: string,
        productInfoId: {
          itemName: string,
          category: string,
          shellLife: string,
          storageTemperature: string,
          container: string
        },
        quantity: number,
        primarySize: number,
        unitId: string,
        secondarySize: number,
        secondaryUnitId: string,
        conversion: number,
        priceId: number,
        discountPriceId: number,
        savingAmount: number,
        offersId: [],
        outOfStock: boolean,
        comingSoon: false,
        maxOrder: number,
        regExp: string,
        unitInHouse: 1
      } = {
        name: "",
        imageURL: "",
        buttonURL: "",
        disclaimer: "",
        brandId: "",
        categoryId: "",
        subCategoryId: "",
        productInfoId: {
          itemName: "",
          category: "",
          shellLife: "",
          storageTemperature: "",
          container: ""
        },
        quantity: 0,
        primarySize: 0,
        unitId: "",
        secondarySize: 0,
        secondaryUnitId: "",
        conversion: 0,
        priceId: 0,
        discountPriceId: 0,
        savingAmount: 0,
        offersId: [],
        outOfStock: false,
        comingSoon: false,
        maxOrder: 0,
        regExp: "",
        unitInHouse: 1
      }
      if (eachRow.length == 14) {
        createState = {
          name: eachRow[0]!,
          imageURL: eachRow[1]!,
          buttonURL: "/item/" + eachRow[0].replace(/\s+/g, "_")!,
          disclaimer: "The product may not be simlar to picture, the used picture is rather for general reference.",
          brandId: objecIdRef.current["brandlist"][eachRow[2]]!,
          categoryId: objecIdRef.current["categorylist"][eachRow[3]]!,
          subCategoryId: objecIdRef.current["subcategorylist"][eachRow[4]]!,
          productInfoId: {
            itemName: eachRow[0]!,
            category: eachRow[3]!,
            shellLife: eachRow[5]!,
            storageTemperature: eachRow[6]!,
            container: eachRow[7]!
          },
          quantity: Number(eachRow[8])!,
          primarySize: Number(eachRow[8])!,
          unitId: objecIdRef.current["unitlist"][eachRow[9]]!,
          secondarySize: 0,
          secondaryUnitId: "",
          conversion: 0,
          priceId: Number(eachRow[10])!,
          discountPriceId: Number(eachRow[11])!,
          savingAmount: 0,
          offersId: [],
          outOfStock: (eachRow[13]) == "FALSE" ? false : true,
          comingSoon: false,
          maxOrder: 100,
          regExp: eachRow[12]!,
          unitInHouse: 1
        }
      } else if (eachRow.length == 17) {
        createState = {
          name: eachRow[0]!,
          imageURL: eachRow[1]!,
          buttonURL: "/item/" + eachRow[0].replace(/\s+/g, "_")!,
          disclaimer: "The product may not be simlar to picture, the used picture is rather for general reference."!,
          brandId: objecIdRef.current["brandlist"][eachRow[2]]!,
          categoryId: objecIdRef.current["categorylist"][eachRow[3]]!,
          subCategoryId: objecIdRef.current["subcategorylist"][eachRow[4]]!,
          productInfoId: {
            itemName: eachRow[0]!,
            category: eachRow[3]!,
            shellLife: eachRow[5]!,
            storageTemperature: eachRow[6]!,
            container: eachRow[7]!
          },
          quantity: Number(eachRow[8])!,
          primarySize: Number(eachRow[8])!,
          unitId: objecIdRef.current["unitlist"][eachRow[9]]!,
          secondarySize: Number(eachRow[10]) as number,
          secondaryUnitId: objecIdRef.current["unitlist"][eachRow[11]]!,
          conversion: Number(eachRow[12])!,
          priceId: Number(eachRow[13])!,
          discountPriceId: Number(eachRow[14])!,
          savingAmount: 0,
          offersId: [],
          outOfStock: (eachRow[16]) == "FALSE" ? false : true,
          comingSoon: false,
          maxOrder: 100,
          regExp: eachRow[15]!,
          unitInHouse: 1
        }
      }

      console.log(eachRow[9], objecIdRef.current["unitlist"][eachRow[9]])

      let check = schema.safeParse(createState);
      if (check.success) {
        newData.push(createState);
      }
      else {
        for (var error of (check.error.issues.slice(0, 3))) {
          toast.error("Error has been occurred", {
            description: error.message + "  product name : " + createState.name,
          })

        }
        return false;
      }

    }

    setFinalData(newData)
    setSubmitFinalData(true)

    return true;
  }, [])

  return <div className="p-4">
    <div className="text-xl font-serif" >
      Import the data with the csv file extension
    </div>
    <div className="font-serif my-4">
      format to follow in the same order
    </div>
    <div className="flex gap-2 ">
      <div className="text-green-300 flex flex-col gap-2 p-2 border">
        <span >value</span>
        <span>requirement</span>
      </div>
      <div className="flex overflow-scroll w-full h-96 border">
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>item name</span>
          <span>string with minimum 2 character</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72">
          <span>image url</span>
          <span>hosted on storage object , required url</span>
        </div>
        <div className=" flex flex-col gap-2 p-2 min-w-72  ">
          <span>brand id</span>
          <span>must be in the database, must create if not present in the individual item section</span>
          <span className="text-yellow-400 text-sm">{
            brandList.length > 1 && brandList.map((m) => {
              let [value] = Object.keys(m);
              value = value.replace(/\s/g, "_")

              let [objectId] = Object.values(m);

              objecIdRef.current["brandlist"][value] = objectId;
              if (!listRef.current["brandlist"].includes(objectId)) {
                listRef.current["brandlist"].push(objectId);
              }

              return value
            }).sort().join(",\n")}
          </span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>category id</span>
          <span>must be in the database</span>
          <div className="text-yellow-400 flex flex-col gap-2 text-sm">{
            categoryList.length > 1 && categoryList.map((m) => {
              let [value] = Object.keys(m);
              value = value.replace(/(,|&)/g, "").replace(/\s+/g, "_");

              let [objectId] = Object.values(m);
              objecIdRef.current["categorylist"][value] = objectId;
              if (!listRef.current["categorylist"].includes(objectId)) {

                listRef.current["categorylist"].push(objectId);
              }
              return <div key={value}>
                {value}
              </div>
            })
          }</div>
        </div>
        <div className=" flex flex-col gap-2 p-2 min-w-72 ">
          <span>subcategory id</span>
          <span>must be in the database</span>
          <span className="text-yellow-400">{
            Object.entries(subCategoryList).length > 2 && Object.entries(subCategoryList).map(([key, value]) => {

              return <div key={key}>
                <div className="text-md"> {key.toString()}</div>
                <div className="flex flex-col text-sm pl-2">
                  {value.map(m => {

                    let [value] = Object.keys(m);
                    value = value.replace(/(,|&)/g, "").replace(/\s+/g, "_");

                    let [objectId] = Object.values(m);
                    objecIdRef.current["subcategorylist"][value] = objectId;
                    if (!listRef.current["subcategorylist"].includes(objectId)) {

                      listRef.current["subcategorylist"].push(objectId)
                    }

                    return <div key={value}>
                      {value}
                    </div>

                  })}
                </div>
              </div>
            })
          }</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>product info</span>
          <span>shell life, storage temperature, container</span>
          <span>seperated by commas</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>quantity / primary size</span>
          <span>must be a number and can't be zero or empty</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>unit id</span>
          <span>must be in the database</span>
          <span className="text-yellow-400 text-sm">{
            unitList.length > 1 && unitList.map((m) => {
              let [value] = Object.keys(m);
              let [objectId] = Object.values(m);
              objecIdRef.current["unitlist"][value] = objectId;
              if (!listRef.current["unitlist"].includes(objectId)) {

                listRef.current["unitlist"].push(objectId)
              }
              return value
            }).join(",\n")
          }</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>secondary size</span>
          <span>optional, but in case of secondary unit is provided - required. must be a number</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>secondary unit id</span>
          <span>must be in the database, optional.</span>
          <span className="text-yellow-400 text-sm">{
            unitList.length > 1 && unitList.map((m) => {
              let [value] = Object.keys(m);
              return value
            }).join(",\n")
          }</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>conversion</span>
          <span>optional, required only in case of secondary unit id is present</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>price</span>
          <span>must be a number</span>
        </div>
        <div className=" flex flex-col gap-2 p-2 min-w-72 ">
          <span>discount price</span>
          <span>must be a number</span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>search value</span>
          <span>all relevant name for the item </span>
        </div>
        <div className="border flex flex-col gap-2 p-2 min-w-72 ">
          <span>out of stock</span>
          <span>true or false </span>
        </div>
      </div>
    </div>
    <div className="flex justify-center items-center p-4">
      <div className="flex gap-4 w-1/2">
        <div className="w-1/2">Import Data only <code>.csv</code> files </div>
        <Input ref={fileRef} accept=".csv" type="file"></Input>
        <Button type="submit" onClick={async function () {
          let fileList = fileRef.current?.files;

          console.log(fileList)
          if (fileList?.length == 0 || fileList == undefined) {
            toast.error("no file is selected")
            return;
          }

          console.log("data")

          let data = await fileList[0].text();
          let formattedData = data.split("\n").filter(m => m);
          let tableHeader = formattedData[0].split(",");
          let tableRow = formattedData.slice(1,).map(m => m.split(",").filter(m => m).map(m => m.trim()))
          //first check i.e either 14 and 17 values

          let lengthFilter = tableRow.filter(m => {

            let length = m.length;

            if (length != 17 && length != 14) {
              return true;
            }

            return false;
          });


          if (lengthFilter.length > 0) {
            lengthFilter.forEach(m => {
              toast.error("Incomplete value : either have 14 values (without secondary unit or 17 values with secondary unit, conversion and secondary size", {
                description: `item name : ${m[0]}`
              })
            })
            return;
          }

          // second check if the data are correct and types
          if (await checkData(tableRow)) {

          } else {

          }

          // showing the preview for the value

        }}>Import</Button>
      </div>
    </div>
    <div className="font-serif mt-4">
      <span className="underline text-sky-500">
        button url, disclaimer, saving amount, offers, unitInHouse, out of stock, coming soon , max order </span>-- will be assigned the default value so make sure to change them individually.
      <br></br>In case of prices as well as discount price, the same value will be assigned to all the category pricing.
    </div>
    <Toaster></Toaster>
    {(sumbitFinalData) && <Dialog open={sumbitFinalData} onOpenChange={setSubmitFinalData} >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>List of items</DialogTitle>
          <DialogDescription>
            all the items will go database, in case of duplicates item, the item will not going to get registered.
          </DialogDescription>
        </DialogHeader>
        <div className=" min-h-[80vh] overflow-scroll border border-white/20 rounded px-2">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="1"
          >
            {
              finalData.map((m, key) => {
                let dataFinal = Object.entries(m);

                return <AccordionItem value={String(key + 1)} key={key}>
                  <AccordionTrigger>{m.name}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-1   text-balance">
                    {
                      dataFinal.map(([key, value]) => {

                        return <div className="flex">
                          <span className="underline w-1/2">{key} </span>:&nbsp;&nbsp; <span className="w-1/2">{typeof value == "object" ? Object.entries(value).map(function ([key, value]) {
                            return <div className="pl-4">
                              {key}:{value}
                            </div>
                          }) : value.toString()}</span>
                        </div>
                      })
                    }
                  </AccordionContent>
                </AccordionItem>
              })
            }

          </Accordion>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => {
            alert("add funtionality to database")
            setSubmitFinalData(false)
          }} type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    }
  </div>
}


function TableCellViewer({ item }: { item: Record<string, any> }) {
  const isMobile = useIsMobile();

  const [savedValue, setSaved] = React.useState(true);
  const [edit, setEdit] = React.useState(false);
  const classInputValue = "focus:outline-none focus:border underline"
  const editCheckRef = React.useRef<HTMLButtonElement>(null);
  const dataChange = React.useRef<Record<string, any>>({});
  const [changes, setChanges] = React.useState<dataValue>({id: "",
              imageURL:  "",
              disclaimer: "",
              brandId: "",
              productInfoId: { shellLife: "", container: "", storageTemperature: "" },
              primarySize:  0,
              quantity:  0,
              unitId: "",
              secondaryUnitId: "",
              conversion:  0,
              secondarySize:  0,
              outOfStock: false,
              comingSoon: false,
              maxOrder:  0,
              regExp: ""})
  const [brandValue, setBrandValue] = React.useState<string>(item.brandId);
  const [firstUnitValue, setFirstUnitValue] = React.useState<string>(item.unitId);
  const [secondaryUnitValue, setSecondaryUnitValue] = React.useState<string>(item.secondaryUnitId);

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
              <input className={classInputValue} onChange={function (e) {
                dataChange.current["imageURL"] = (e.target.value).trim();
                setChanges(prev => {
  
                  return {...prev, imageURL:e.target.value.trim()}
                })
              }} disabled={savedValue} defaultValue={item?.["imageURL"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Disclaimer</div>
              <input className={classInputValue} onChange={function (e) {
                dataChange.current["disclaimer"] = (e.target.value).trim();
                setChanges(prev => {
                  return {...prev, disclaimer:e.target.value.trim()}
                })
              }} disabled={savedValue} defaultValue={item?.["disclaimer"]} />
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
                <input className={classInputValue} onChange={function (e) {
                  if (!dataChange.current["productInfoId"]) {
                    dataChange.current["productInfoId"] = {}
                  }

                  
                  dataChange.current["productInfoId"]["shellLife"] = (e.target.value).trim();
                  setChanges(prev => {
  
                  return {...prev, productInfoId:{...prev.productInfoId, shellLife:(e.target.value).trim()}}
                })
                  console.log(dataChange.current)
                }} disabled={savedValue} defaultValue={item?.["productInfoId"]["shellLife"]} />
              </Label>
              <Label>
                Storage Temperature
                <input className={classInputValue}  onChange={function (e) {
                  if (!dataChange.current["productInfoId"]) {
                    dataChange.current["productInfoId"] = {}
                  }
                
                  dataChange.current["productInfoId"]["storageTemperature"] = (e.target.value).trim();
                  setChanges(prev => {
  
                  return {...prev, productInfoId:{...prev.productInfoId, storageTemperature:(e.target.value).trim()}}
                })
                  console.log(dataChange.current)
                }} disabled={savedValue} defaultValue={item?.["productInfoId"]["storageTemperature"]} />
              </Label>
              <Label>
                Container
                <input className={classInputValue} onChange={function (e) {
                  if (!dataChange.current["productInfoId"]) {
                    dataChange.current["productInfoId"] = {}
                  }

                  dataChange.current["productInfoId"]["container"] = (e.target.value).trim();
                  setChanges(prev => {
  
                  return {...prev, productInfoId:{...prev.productInfoId, container:(e.target.value).trim()}}
                })
                }} disabled={savedValue} defaultValue={item?.["productInfoId"]["container"]} />
              </Label>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Primary Size / Quantity</div>
              <input className={classInputValue} onChange={function (e) {


                dataChange.current["quantity"] = Number((e.target.value).trim());
                setChanges(prev => {
  
                  return {...prev,quantity: Number((e.target.value).trim()),primarySize: Number((e.target.value).trim()) }
                })

              }} disabled={savedValue} defaultValue={item?.["primarySize"]} />
            </div>
            <div className="flex flex-col gap-3 tems-center">
              <div className="flex gap-3 items-center">

                <div className="text-xl">Current Unit</div>
                <div>
                  {firstUnitValue}
                </div>
              </div>
              <Badge variant={"destructive"}>changing results in no previous offers</Badge>
              <DialogViewer disableTrue={savedValue} type="unit" value={"Change the Primary unit"} setValue={setFirstUnitValue}></DialogViewer>

            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">

                <div className="text-xl">Secondary Unit</div>
                <div>
                  {secondaryUnitValue || "none"}
                </div>
              </div>
              <DialogViewer disableTrue={savedValue} type="unit" value={"Change the Secondary unit"} setValue={setSecondaryUnitValue}></DialogViewer></div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Secondary Size</div>
              <input className={classInputValue} onChange={function (e) {


                dataChange.current["secondarySize"] = Number((e.target.value).trim());
                  setChanges(prev => {
  
                  return {...prev,secondarySize: Number((e.target.value).trim()) }
                })

              }} disabled={savedValue} placeholder={item?.["secondaryUnitId"] || "no value in db"} defaultValue={item?.["secondarySize"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Conversion</div>
              <input className={classInputValue} onChange={function (e) {


                dataChange.current["conversion"] = Number((e.target.value).trim());
                 setChanges(prev => {
  
                  return {...prev,conversion: Number((e.target.value).trim()) }
                })
              }} disabled={savedValue} placeholder={item?.["secondaryUnitId"] || "no value in db"} defaultValue={item?.["conversion"]} />
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
              <div className="text-sm">offers is same for all pricing category and same unit for all the offers for consistency</div>
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
              <DialogViewer disableTrue={savedValue} itemId={item.id} unitId={item.unitId} type="offers" value="create new offers or delete existing one" changes={item.offersId}></DialogViewer>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Out Of Stock</div>

              <Select defaultValue={item.outOfStock ? "true" : "false"} onValueChange={(value) => {
                dataChange.current["outOfStock"] = value == "true" ? true : false;
                 setChanges(prev => {
  
                  return {...prev,outOfStock: value == "true" ? true : false }
                })
              }} disabled={savedValue}>
                <SelectTrigger id="outOfStock" className="w-full">
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
              <Select defaultValue={item.comingSoon ? "true" : "false"} onValueChange={value => {
                dataChange.current["comingSoon"] = value == "true" ? true : false;
                setChanges(prev => {
  
                  return {...prev,comingSoon: value == "true" ? true : false }
                })
              }} disabled={savedValue}>
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
              <input type="number" onChange={function (e) {
                
                dataChange.current["maxOrder"] = Number((e.target.value).trim());
                setChanges(prev => {
  
                  return {...prev,maxOrder:Number((e.target.value).trim()) }
                })
              }} className={classInputValue} disabled={savedValue} defaultValue={item?.["maxOrder"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Search Value</div>
              <input className={classInputValue} onChange={function (e) {
                dataChange.current["regExp"] = String((e.target.value).trim());
                setChanges(prev => {
                  return {...prev,regExp:String((e.target.value).trim()) }
                })
              }} disabled={savedValue} defaultValue={item?.["regExp"]} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Inventory <Badge className="" variant={"destructive"}>WIP</Badge></div>
              <input className={classInputValue} disabled={true} defaultValue={item?.["unitInHouse"]} />
            </div>

          </div>
        </div>
        <DrawerFooter>
          <DialogViewer type="submit" value="Submit to database" brandId={brandValue} unitId={firstUnitValue} secondaryUnitId={secondaryUnitValue} itemId={item.id} changes={changes} onclickValue={function () {

          }}></DialogViewer>
          <DialogViewer type="submit" value="Delete item in database" changes={dataChange.current} onclickValue={function () {
            toast.error("Not allowed in v1")
          }}></DialogViewer>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}



function DialogViewer({ type, value, changes, onclickValue, setValue, disableTrue, itemId, unitId, brandId, secondaryUnitId }: { brandId?: string, secondaryUnitId?: string, itemId?: string, unitId?: string, type: "alert" | "confirm" | "offers" | "unit" | "submit" | "brand", value?: string, changes?: dataValue|any, onclickValue?: () => void, setValue?: React.Dispatch<React.SetStateAction<any>>, disableTrue?: boolean }) {

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
      fetch(BACKEND_URL! + "brand", { credentials: "include" }).then(async (m) => {
        let data = await m.json()
        setBrandList(data.data)
        setFilterValue(data.data)
      }).catch(err => console.log(err))
    } else if (type == "unit") {

      fetch(BACKEND_URL! + "unit", { credentials: "include" }).then(async (m) => {
        let data = await m.json()
        setUnitList(data.data)
      }).catch(err => console.log(err))
    }
  }, [])

  const clearTime: React.RefObject<ReturnType<typeof setTimeout> | undefined> = React.useRef(undefined);


  if (type == "confirm" || type == "submit" && !disableTrue) {

    return <Dialog >
      <DialogTrigger asChild>
        <Button onClick={function () {
          console.log(changes)
        }} variant="default">{value?.split(" ")[0]}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Action</DialogTitle>
          <DialogDescription>
            {value}
          </DialogDescription>
        </DialogHeader>
        {/* {changes} */}
        <div className="flex flex-col gap-2">
          <Badge >
            if the column value is empty meaning no changes to that value
          </Badge>
          <div className="flex w-full justify-between">
            <span>imageURL</span>
            <span>{changes?.["imageURL"]}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>disclaimer</span>
            <span>{changes?.["disclaimer"]}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>brand</span>
            <span>{brandId}</span>
          </div>
          <div className="flex w-full justify-between gap-2">
            <div>productInfoId</div>
            {
              changes?.["productInfoId"] && <div className="flex-col flex">
                <span>shell life : {changes["productInfoId"]["shellLife"]} </span>
                <span>storage temperature :{changes["productInfoId"]["storageTemperature"]} </span>
                <span>container :{changes["productInfoId"]["container"]}  </span>
              </div>
            }
          </div>
          <div className="flex w-full justify-between">
            <span>primary size / quantity </span>
            <span>{String(changes?.["quantity"])}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>current unit</span>
            <span>{unitId}</span>
          </div>
          <div>
            <Badge variant={"destructive"}>if changes primary unit then results in deletion of all current offers</Badge>
          </div>
          <div className="flex w-full justify-between">
            <span>secondary unit</span>
            <span>{secondaryUnitId}</span>
          </div>
          <Badge variant={"destructive"}>secondary unit requires secondary size and conversion</Badge>
          <div className="flex w-full justify-between">
            <span>conversion</span>
            <span>{changes?.["conversion"]}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>secondary size</span>
            <span>{changes?.["secondarySize"]}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>outOfStock</span>
            <span>{changes?.["outOfStock"]?"true":"false"}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>comingSoon</span>
            <span>{changes?.["comingSoon"]?"true":"false"}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>maxOrder</span>
            <span>{changes?.["maxOrder"]}</span>
          </div>
          <div className="flex w-full justify-between">
            <span>regexValue</span>
            <span>{changes?.["regExp"]}</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={function () {
            if(!changes) {
              return;
            }
            if (onclickValue) onclickValue()
            let dataToSend = {
              id: itemId,
              imageURL: changes["imageURL"] ?? "",
              disclaimer: changes["disclaimer"] ?? "",
              brandId: brandId,
              productInfoId: changes["productInfoId"] ?? { shellLife: "", container: "", storageTemperature: "" },
              primarySize: changes["quantity"] ?? 0,
              quantity: changes["quantity"] ?? 0,
              unitId: unitId,
              secondaryUnitId: secondaryUnitId,
              conversion: changes["conversion"] ?? 0,
              secondarySize: changes["secondarySize"] ?? 0,
              outOfStock: changes["outOfStock"] ?? false,
              comingSoon: changes["comingSoon"] ?? false,
              maxOrder: changes["maxOrder"] ?? 0,
              regExp: changes["regExp"] ?? ""
            }
            if (!dataToSend.secondaryUnitId) {
              // irrespective of data in there
              dataToSend.conversion = 0;
              dataToSend.secondarySize = 0;
            } else if (dataToSend.secondaryUnitId && (dataToSend.conversion == 0 || dataToSend.secondarySize == 0)) {
              toast.error("make sure to have the conversion and secondary size when creating secondary unit")
              return;
            }

            console.log(dataToSend)
            let url = BACKEND_URL + "individual ";

            axios.put(url, {data:dataToSend}, { withCredentials: true }).then(value => {
              let data = value.data;
              
              if (data.success) {
                toast.info(data.message + ' refreshing')
                setTimeout(function () {
                  location.reload();
                }, 900)
              } else {
                toast.error(data.message)
              }
            }).catch(err => {
              console.log(err, "error")
            })



          }} type="submit">Confirm</Button>
        </DialogFooter>
        <Toaster></Toaster>
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


                      if (setValue) setValue(m);
                      if (onclickValue) onclickValue();
                      setOpen(false);
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

                let data = brandRef.current?.value;

                let url = BACKEND_URL + "createBrand";
                axios.post(url, { data }, { withCredentials: true }).then(n => {
                  let value = n.data;
                  if (value.success) {
                    toast.info(value.message)
                    if (setValue) setValue(brandRef.current?.value);
                    setOpen(false)
                    setTimeout(function () {
                      location.reload();
                    }, 500)
                  } else {
                    toast.error(value.message)
                  }
                })

              }}>create</Button>
            </div>

          </div>

        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
        <Toaster></Toaster>
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

                let url = BACKEND_URL + "offer/" + m.id + "/" + itemId;
                axios.delete(url, { withCredentials: true }).then(n => {
                  let value = n.data;
                  if (value.success) {

                    toast.success(value.message)

                    setTimeout(function () {
                      location.reload();
                    }, 900)
                  } else {
                    toast.error(value.message)
                  }
                })

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
              <Select defaultValue="false" onValueChange={function (e) {
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

                  let url = BACKEND_URL + "createOffer";
                  // console.log(offers)
                  axios.post(url, {
                    data: {
                      ...offers,
                      unitId: unitId,
                      itemId: itemId
                    }
                  }, { withCredentials: true }).then(n => {

                    let value = n.data;
                    console.log(value)
                    if (value.success) {

                      toast.success(value.message)

                      setOffers(prev => {
                        return {
                          price: 0,
                          quantity: 0,
                          superSaver: false,

                        }
                      })
                      setTimeout(function () {
                        location.reload();
                      }, 900)
                    } else {
                      toast.error(value.message)
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
        <Toaster></Toaster>
      </DialogContent>
    </Dialog>
  } else {
    return <Button>check edit to start making changes</Button>
  }
}
