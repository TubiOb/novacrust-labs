'use client'

import { ReusableCard } from "@/components/ReusableCard"
import { Copy, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NovacrustNameLogo } from "../../../../../public/img"

export default function Page() {
  const transactionId = "NC123456789"

  return (
    <ReusableCard
      className="lg:p-2"
      header={
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Image src={NovacrustNameLogo} alt={'Novacrust'} className="w-44 h-12" />
          </div>
        </div>
      }
      content={
        <div className="flex flex-col items-center gap-8 p-4">
          <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-3" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-[#013941]">Your transaction is processing.</h2>
            <p className="text-[#4F4F4F] text-lg">The recipient will receive it shortly.</p>
          </div>

          <div className="w-full bg-gray-100 rounded-2xl p-2 lg:p-5 flex items-center justify-between">
            <span className="text-[#4F4F4F] text-sm font-normal">Transaction ID</span>
            <button onClick={() => navigator.clipboard.writeText(transactionId)} className="flex items-center gap-2 text-[#4F4F4F] font-normal text-base hover:opacity-80 transition-opacity" >
              {transactionId}
              <Copy className="w-4 h-4 cursor-pointer" />
            </button>
          </div>

          <Link href="/" className="text-[#013941] font-semibold text-lg hover:underline">
            Go back to home
          </Link>
        </div>
      }
    footer={null}
    />
  )
}