import Link from 'next/link';
import { PanelRightOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ColorModeToggle } from '@/components/ui/color-mode';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { NavLink, NavLinkItem } from './nav-link';

export function HeaderDrawer({ menus, isAuthenticated }: { menus: NavLinkItem[]; isAuthenticated: boolean }) {
  return (
    <div className="flex md:hidden">
      <Drawer modal swipeDirection="right" showSwipeHandle>
        <DrawerTrigger
          render={
            <Button size="icon" variant="ghost" aria-label="Open menu">
              <PanelRightOpen />
            </Button>
          }
        />
        <DrawerContent>
          <DrawerHeader className="flex-row items-center justify-between">
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerClose
              render={
                <Button size="icon" variant="ghost" aria-label="Close menu">
                  <X />
                </Button>
              }
            />
          </DrawerHeader>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 px-4 py-2">
            {menus.map(item => (
              <DrawerClose
                key={item.href}
                render={<NavLink href={item.href} label={item.label} className="py-2.5 text-base" />}
              />
            ))}
          </nav>

          <Separator className="mx-4 my-2 w-auto" />

          {/* Footer actions */}
          <DrawerFooter className="flex-col gap-2">
            <Link
              href={isAuthenticated ? '/profile' : '/login'}
              className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
              {isAuthenticated ? 'Profil' : 'Masuk'}
            </Link>
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-muted-foreground">Tema</span>
              <ColorModeToggle />
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
