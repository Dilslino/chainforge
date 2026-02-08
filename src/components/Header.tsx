"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              ChainForge
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/tasks">
              <Button variant="ghost" size="sm">
                Browse Tasks
              </Button>
            </Link>
            <Link href="/tasks/create">
              <Button variant="ghost" size="sm">
                Post a Task
              </Button>
            </Link>
          </nav>
        </div>

        {/* Connect Button */}
        <div className="flex items-center gap-4">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </header>
  );
}
