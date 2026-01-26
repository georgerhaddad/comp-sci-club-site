"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
  label: string
  href: string
}

interface MobileMenuProps {
  navItems: NavItem[]
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navItems }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-1 md:hidden">
      <ModeToggle />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] border-border/50 bg-background/95 backdrop-blur-lg">
          <SheetHeader>
            <SheetTitle className="text-left text-foreground">Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-lg font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileMenu
