import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { useEffect, useState } from "react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
let navigate=useNavigate();
let [userName, setUserName] = useState("....");
let [email, setEmail]  = useState("....");
let [params, setParams] = useSearchParams()

  useEffect(function(){
    let data = JSON.parse(localStorage.getItem("data") as string || "{}");

    let user = "";
    let email = "";
    if(JSON.stringify(data) == "{}") {
      user = params.get("user") ?? "";
      email = params.get("email") ?? "";
      localStorage.setItem("data", JSON.stringify({user_data:{username:user, email:email}}))

      if(user == "" && email == "") {
        let url = BACKEND_URL!+ "logout" 
              axios.post(url,{
              },{
                withCredentials:true
              }).then( () => {
                  navigate('/login');
                  localStorage.setItem("data","");
              })
      }
    }else {
      user = data?.user_data.username ?? "";
      email = data?.user_data.email ?? "";

    }
    setUserName(user);
    setEmail(email);
  })


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={"/favicon.svg"} height={100} width={100} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            
            <DropdownMenuItem onClick={function () {
              let url = BACKEND_URL!+ "logout" 
              axios.post(url,{
              },{
                withCredentials:true
              }).then( m => {
                  navigate('/login');
                  localStorage.setItem("data","");
              })

              // deleting the cookie - server event cookie to null
            }}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
