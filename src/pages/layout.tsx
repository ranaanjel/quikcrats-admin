import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header";
import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export function Layout() {
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