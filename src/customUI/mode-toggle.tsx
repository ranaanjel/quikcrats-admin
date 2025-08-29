import {Moon, Sun} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
    const {theme,setTheme} =  useTheme();

    return <div>
        {
            theme=="light"?<Button className="text-black " onClick={() => {setTheme("dark")
                console.log("clicked to dark")}
            } size={"icon"} variant={"secondary"}>
                <Moon className="size-6"/>
            </Button> : <Button className="text-white " onClick={() =>{ setTheme("light")
                console.log("clicked to light" )
            }} size={"icon"} variant={"secondary"}>
                <Sun className="size-6"/>
            </Button> 
        }
    </div>  
}