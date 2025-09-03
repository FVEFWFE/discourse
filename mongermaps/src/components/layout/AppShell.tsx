"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Map, 
  LayoutDashboard, 
  Database, 
  TrendingUp, 
  Users, 
  LogOut,
  User,
  ChevronRight,
  Crown
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";

interface AppShellProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Map", href: "/map/pattaya", icon: Map },
  { name: "Intel Database", href: "/intel-database", icon: Database },
  { name: "Market Analysis", href: "/intelligence/pricing", icon: TrendingUp },
  { name: "Global Rankings", href: "/intelligence/rankings", icon: Users },
];

export function AppShell({ children }: AppShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { data: subscription } = api.subscription.current.useQuery(undefined, {
    enabled: !!session,
  });

  const showUpgradeButton = !subscription || subscription.type === "TRIP_PASS";

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-gray-900 border-r border-gray-800">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-yellow-400">MongerMaps</h1>
            <span className="ml-2 text-xs text-gray-500">INTEL</span>
          </div>
          
          <nav className="flex-1 px-2 mt-8 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? "bg-gray-800 text-yellow-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-yellow-400" : "text-gray-400 group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              );
            })}
          </nav>

          {showUpgradeButton && (
            <div className="px-4 mb-4">
              <Link href="/upgrade">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Insider
                </Button>
              </Link>
            </div>
          )}

          <div className="flex-shrink-0 px-4 py-2 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Data from 2.6M+ posts • YMMV
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header bar */}
        <header className="bg-gray-900 border-b border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-100">
                  {navigation.find(item => item.href === pathname)?.name || "MongerMaps"}
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-auto px-2">
                        <User className="mr-2 h-4 w-4" />
                        <span className="text-sm">{session.user.username}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${session.user.username}`}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/settings">
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-400"
                        onSelect={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}