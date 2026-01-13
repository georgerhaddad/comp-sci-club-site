import React from "react";
import Link from "next/link";
import { ModeToggle } from "../ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import MobileMenu from "./mobile-menu";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <nav
        id="main-navbar"
        className="w-full px-4 transition-colors duration-300"
      >
        <div className="container m-auto flex h-12 items-center justify-between px-4 lg:h-16 lg:px-0 lg:text-2xl">
          <Link className="flex h-full items-center gap-2" href={"/"}>
            <Image src={"/logo-no-name.svg"} alt={""} width={32} height={32} />
            <h1 className="font-bold">MJC CS</h1>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-background data-[active=true]:bg-primary/50 data-[active=true]:text-accent-foreground hover:bg-secondary/80 hover:text-accent-foreground focus:bg-background focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4"
                      }
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <ModeToggle />
          </div>

          <MobileMenu navItems={navItems} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
