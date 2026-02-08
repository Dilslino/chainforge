import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-500 via-cyan-500 to-orange-500 bg-clip-text text-transparent">
                Decentralized
              </span>
              <br />
              Task Marketplace
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Post tasks with ETH escrow. Workers claim and complete. Smart contracts release payments automatically. No middlemen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tasks/create">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  Post a Task
                </Button>
              </Link>
              <Link href="/tasks">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-500">1</span>
                </div>
                <CardTitle>Post a Task</CardTitle>
                <CardDescription>
                  Create a task with a description and lock ETH in escrow. Your funds are secure until the work is approved.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500" />
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-cyan-500">2</span>
                </div>
                <CardTitle>Claim & Complete</CardTitle>
                <CardDescription>
                  Workers browse and claim tasks. Once completed, they mark the task as done and wait for approval.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-500">3</span>
                </div>
                <CardTitle>Get Paid</CardTitle>
                <CardDescription>
                  Task creator approves the work. Smart contract automatically releases 98% to the worker, 2% platform fee.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                $0
              </div>
              <p className="text-muted-foreground mt-2">Total Volume</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-orange-500 bg-clip-text text-transparent">
                0
              </div>
              <p className="text-muted-foreground mt-2">Tasks Posted</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                0
              </div>
              <p className="text-muted-foreground mt-2">Tasks Completed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                0
              </div>
              <p className="text-muted-foreground mt-2">Active Workers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-orange-500/10">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Connect your wallet and start earning or posting tasks today. Built on Base Sepolia testnet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tasks">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  Explore Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-cyan-500">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <span className="font-semibold">ChainForge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for hackathon. Powered by Base Sepolia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
