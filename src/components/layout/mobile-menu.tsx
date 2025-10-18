"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { MenuIcon, X } from "lucide-react";
import { ModeToggle } from "../ui/theme-toggle";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
}

const MobileMenu = ({ navItems }: MobileMenuProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawerOpen]);

  return (
    <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger className="md:hidden">
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex h-12 flex-row content-between justify-end">
          <DrawerTitle className="hidden"></DrawerTitle>
          <DrawerClose>
            <X />
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col px-4">
          {navItems.map((item, index) => (
            <DrawerClose asChild key={index}>
              <Link
                href={item.href}
                className="hover:text-primary py-2 text-lg font-medium transition-colors"
              >
                {item.label}
              </Link>
            </DrawerClose>
          ))}
        </div>
        <DrawerFooter className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Theme</span>
            <ModeToggle />
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
