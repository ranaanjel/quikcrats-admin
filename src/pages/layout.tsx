import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header";
import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast, Toaster } from "sonner";


export function Layout() {
  let {pathname} = useLocation();
  let navigate = useNavigate();
  useEffect(function(){

  if(pathname != "login") {
       axios.get(BACKEND_URL+"verifyAdmin",{
        withCredentials:true
       }).then(m => {
        // since it will run on every page for the authentication i can don't have create the middleware in the 
        // backend for checking each route, since the passport.use("session") only adds user or undefined we have //
        // to make sure the middleware is secure but not here.

        let verified = m.data.verified;
        console.log("user is verified", verified);
        if(!verified){
          navigate("/login")
          localStorage.setItem("data", "")
        }
       }).catch(_ =>  {
        navigate("/login")
        localStorage.setItem("data", "")
       })
    }
  },[])
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }

    >
      <AppSidebar variant="inset" />
       {/* header */}
      <SidebarInset>
       <SiteHeader /> 
       <div className="sm:h-lvh pb-10 overflow-scroll">
        <Outlet></Outlet>
       
       </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

//  <div className="flex-1 flex flex-col">
//                 <Header></Header>
//                 <Outlet></Outlet>
            {/* </div> */}