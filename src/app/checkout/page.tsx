'use client'

import { ReusableCard } from "@/components/ReusableCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
  return (
    <ReusableCard
      className="p-4"
      header={
        <Tabs defaultValue="cryptoToCash" className="w-full mx-auto items-center gap-3">
            <TabsList className="rounded-full bg-[#F2F2F2] gap-3 text-sm">
              <TabsTrigger value="cryptoToCash" className="rounded-full data-[state=active]:bg-[#013941] data-[state=active]:text-white text-[#828282] text-sm font-medium">Crypto to cash</TabsTrigger>
              <TabsTrigger value="cashToCrypto" className="rounded-full data-[state=active]:bg-[#013941] data-[state=active]:text-white text-[#828282] text-sm font-medium">Cash to crypto</TabsTrigger>
              <TabsTrigger value="cryptoToLoan" className="rounded-full data-[state=active]:bg-[#013941] data-[state=active]:text-white text-[#828282] text-sm font-medium">Crypto to float loan</TabsTrigger>
            </TabsList>
            <TabsContent value="cryptoToCash">
              <div>
                <div>
                  <div>Account</div>
                  <div>
                    Make changes to your account here. Click save when you&apos;re
                    done.
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-name">Name</Label>
                    <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-username">Username</Label>
                    <Input id="tabs-demo-username" defaultValue="@peduarte" />
                  </div>
                </div>
                <div>
                  <Button>Save changes</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="cashToCrypto">
              <div>
                <div>
                  <div>Password</div>
                  <div>
                    Change your password here. After saving, you&apos;ll be logged
                    out.
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-current">Current password</Label>
                    <Input id="tabs-demo-current" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-new">New password</Label>
                    <Input id="tabs-demo-new" type="password" />
                  </div>
                </div>
                <div>
                  <Button>Save password</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="cryptoToLoan">
              <div>
                <div>
                  <div>Password</div>
                  <div>
                    Change your password here. After saving, you&apos;ll be logged
                    out.
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-current">Current password</Label>
                    <Input id="tabs-demo-current" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-new">New password</Label>
                    <Input id="tabs-demo-new" type="password" />
                  </div>
                </div>
                <div>
                  <Button>Save password</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
      }
    />
  )
}