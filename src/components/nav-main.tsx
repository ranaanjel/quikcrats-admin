import {  type Icon } from "@tabler/icons-react"
import { Link, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  let pathValue = useLocation().pathname;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items.map((item) => {
            let classNameActive = "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"

            return (
              <Link to={item.url}>
              <SidebarMenuItem key={item.title} >
                <SidebarMenuButton tooltip={item.title} className={pathValue == item.url ? classNameActive : ""}>
                  {item.icon && <item.icon />}
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem></Link>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
