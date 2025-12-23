import React from "react";
import Link from "next/link";
import { ModeToggle } from "../ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import MobileMenu from "./mobile-menu";

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
      <nav id="main-navbar" className="w-full transition-colors duration-300">
        <div className="container m-auto flex h-12 items-center justify-between px-4 lg:h-16 lg:px-0 lg:text-2xl">
          <h1>Logo</h1>
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <ModeToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <MobileMenu navItems={navItems} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
