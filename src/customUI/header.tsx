import {  Power, ShoppingCart } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function Header() {
    return <div className="w-full p-8 pb-4">
       <div className="flex justify-between">
        <div className="flex gap-2">
          <ShoppingCart></ShoppingCart>
          <div className="text-xl font-semibold">
            quikcrats
          </div>
        </div>
        <div className="flex gap-4 items-center">
        <Power className="text-red-400 cursor-pointer" onClick={function () {
          alert("functionality to add")
        }}></Power>
        <ModeToggle></ModeToggle>
        
        </div>
        </div> 
    </div>
}