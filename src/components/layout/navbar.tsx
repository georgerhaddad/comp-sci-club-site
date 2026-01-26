import React from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import MobileMenu from "./mobile-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
}

const Navbar: React.FC = () => {
  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50">
      <nav
        id="main-navbar"
        className="w-full transition-colors duration-300"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center justify-between lg:h-16">
            <Link className="group flex items-center gap-2.5" href={"/"}>
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
                <Image 
                  src={"/logo-no-name.svg"} 
                  alt="MJC CS Logo" 
                  width={36} 
                  height={36}
                  className="relative"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground lg:text-xl">
                MJC CS
              </span>
            </Link>
            
            <div className="hidden items-center md:flex">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="ml-2 flex items-center border-l border-border/50 pl-2">
                <ModeToggle />
              </div>
            </div>

            <MobileMenu navItems={navItems} />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
