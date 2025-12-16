'use client'

import { ReusableCard } from "@/components/ReusableCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDownIcon, ArrowLeft, Copy, Info, Loader2 } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { validateStep1, validateStep2, confirmTransaction, RecipientState } from "@/app/actions/recipient"
import { redirect } from "next/navigation"
import { Dollar, Ngn, Pounds } from "../../../../public/img"
import Image from "next/image"

const banks = [
  { label: "Access Bank", value: "access-bank" },
  { label: "First Bank of Nigeria", value: "first-bank" },
  { label: "United Bank for Africa (UBA)", value: "uba" },
  { label: "Guaranty Trust Bank (GTBank)", value: "gtbank" },
  { label: "Zenith Bank", value: "zenith-bank" },
  { label: "Stanbic IBTC Bank", value: "stanbic-ibtc" },
  { label: "Ecobank Nigeria", value: "ecobank" },
  { label: "Fidelity Bank", value: "fidelity-bank" },
  { label: "Union Bank of Nigeria", value: "union-bank" },
  { label: "First City Monument Bank (FCMB)", value: "fcmb" },
]

const countryCodes = [
  { code: "+234", flag: Ngn, country: "Nigeria" },
  { code: "+1", flag: Dollar, country: "United States" },
  { code: "+44", flag: Pounds, country: "United Kingdom" },
]

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1)

  const [step1State, step1Action, step1Pending] = useActionState<RecipientState, FormData>(validateStep1, {})
  const [step2State, step2Action, step2Pending] = useActionState<RecipientState, FormData>(validateStep2, {})
  const [step3State, step3Action, step3Pending] = useActionState<RecipientState, FormData>(confirmTransaction, {})

  const [selectedBank, setSelectedBank] = useState<(typeof banks)[0] | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")

  const [recipientEmail, setRecipientEmail] = useState("")
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0])
  const [phoneNumber, setPhoneNumber] = useState("")

  const walletAddress = "4LiV4YjbxsL6739MKghUd"
  const amountToSend = "100 ETH"
  const network = "ETH"
  const wallet = "Other"

  useEffect(() => {
    if (step1State.success && step1State.accountName) {
      setAccountName(step1State.accountName)
      setCurrentStep(2)
    }
  }, [step1State])

  useEffect(() => {
    if (step2State.success) {
      setCurrentStep(3)
    }
  }, [step2State])

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
    if (currentStep === 1) {
      redirect('/checkout')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <ReusableCard
      className="lg:p-2"
      header={
        <div className="flex items-center gap-4 p-2">
          {currentStep >= 1 && (
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-[#013941]" />
            </button>
          )}
          <h1 className="text-xl font-semibold text-[#013941] text-center flex-1">
            {currentStep === 3 ? "Send ETH to the address below" : "Recipient details"}
          </h1>
        </div>
      }
      content={
        <div className="p-3">
          {/* Step 1: Bank Details */}
          {currentStep === 1 && (
            <form action={step1Action} className="flex flex-col gap-6">
              {/* Bank Selection */}
              <div className="flex flex-col gap-3">
                <Label className="text-[#828282] font-medium text-[1rem]">Bank</Label>
                <input type="hidden" name="bank" value={selectedBank?.value || ""} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-14 rounded-full border-[#E0E0E0] bg-white hover:bg-gray-50 text-base" >
                      <span className={selectedBank ? "text-[#013941]" : "text-gray-400"}>
                        {selectedBank ? selectedBank.label : "Select an option"}
                      </span>
                      <ChevronDownIcon className="w-5 h-5 text-[#013941]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem] z-100">
                    {banks.map((bank) => (
                      <DropdownMenuItem key={bank.value} onClick={() => setSelectedBank(bank)} className="text-base py-3 cursor-pointer" >
                        {bank.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {step1State.errors?.bank && <p className="text-sm text-red-600">{step1State.errors.bank}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-[#828282] font-medium text-[1rem]">Account number</Label>
                <Input type="text" name="accountNumber" placeholder="Enter your account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="h-14 border border-[#E0E0E0] outline-none ring-none focus-visible:ring-0 rounded-full text-[#000E10] font-medium text-[1rem] placeholder:text-gray-400" />
                {step1State.errors?.accountNumber && (
                  <p className="text-sm text-red-600">{step1State.errors.accountNumber}</p>
                )}
              </div>

                <div className="flex flex-col gap-3">
                  <Label className="text-[#828282] font-medium text-[1rem]">Account name</Label>
                  <div className="h-14 rounded-full bg-gray-100 border border-[#E0E0E0] flex items-center px-6">
                    <span className="text-[#013941] font-medium text-base">ODUTUGA GBEKE</span>
                  </div>
                </div>

              {step1State.errors?._form && (
                <p className="text-sm text-red-600 text-center">{step1State.errors._form}</p>
              )}

              <Button type="submit" disabled={!selectedBank || !accountNumber || step1Pending} className="w-full h-14 rounded-full bg-[#013941] hover:bg-[#013941]/90 text-white font-semibold text-base cursor-pointer" >
                {step1Pending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 cursor-pointer" />
                    Verifying...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </form>
          )}

          {/* Step 2: Additional Details */}
          {currentStep === 2 && (
            <form action={step2Action} className="flex flex-col gap-6">
              <input type="hidden" name="accountName" value={accountName} />
              <input type="hidden" name="countryCode" value={selectedCountryCode.code} />

              <div className="flex flex-col gap-3">
                <Label className="text-[#013941] font-medium text-base">Recipient email</Label>
                <Input type="email" name='recipientEmail' placeholder="Enter recipient email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="h-14 border border-[#E0E0E0] outline-none ring-none focus-visible:ring-0 rounded-full text-[#000E10] font-medium text-[1rem] placeholder:text-gray-400" />
                {step2State.errors?.recipientEmail && (
                  <p className="text-sm text-red-600">{step2State.errors.recipientEmail}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-[#013941] font-medium text-base">Recipient phone number</Label>
                <div className="flex gap-0 rounded-full border border-[#E0E0E0] bg-white overflow-hidden p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-none border-r border-[#E0E0E0] hover:bg-gray-50 px-4 gap-2 flex items-center" >
                        <Image src={selectedCountryCode.flag} alt={selectedCountryCode.country} className="lg:w-7 lg:h-7 w-5 h-5" />
                        <span className="text-[#013941] font-medium">{selectedCountryCode.code}</span>
                        <ChevronDownIcon className="w-4 h-4 text-[#013941]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem] items-center z-100">
                      {countryCodes.map((item) => (
                        <DropdownMenuItem key={item.code} onClick={() => setSelectedCountryCode(item)} className="gap-3 cursor-pointer py-3" >
                          <Image src={item.flag} alt={item.country} className="lg:w-7 lg:h-7 w-5 h-5" />
                          <span>{item.code}</span>
                          <span className="text-gray-500">{item.country}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Input type="tel" name="phoneNumber" placeholder="000 - 000 - 00000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1 border-none outline-none ring-none focus-visible:ring-0 text-[#000E10] font-medium text-[1rem] placeholder:text-gray-400" />
                </div>
                {step2State.errors?.phoneNumber && (
                  <p className="text-sm text-red-600">{step2State.errors.phoneNumber}</p>
                )}

              </div>
              {step2State.errors?._form && (
                <p className="text-sm text-red-600 text-center">{step2State.errors._form}</p>
              )}

              <Button type="submit" disabled={!recipientEmail || !phoneNumber || step2Pending} className="w-full h-14 rounded-full bg-[#013941] hover:bg-[#013941]/90 text-white font-semibold text-base cursor-pointer" >
                {step2Pending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 cursor-pointer" />
                    Saving...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </form>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <form action={step3Action} className="flex flex-col gap-6">
              <input type="hidden" name="walletAddress" value={walletAddress} />
              <input type="hidden" name="amountToSend" value={amountToSend} />
              <input type="hidden" name="network" value={network} />
              <div className="flex justify-center">
                <button onClick={() => copyToClipboard(walletAddress)} className="bg-[#E8F5F7] rounded-full px-6 py-3 flex items-center gap-3 hover:bg-[#d8eef1] transition-colors cursor-pointer">
                  <span className="text-[#013941] font-normal text-[1rem]">{walletAddress}</span>
                  <Copy className="w-4 h-4 text-[#013941] cursor-pointer" />
                </button>
              </div>

              <div className="bg-gray-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#828282] text-base">Amount to send</span>
                  <button onClick={() => copyToClipboard(amountToSend)} className="flex items-center gap-2 text-[#013941] font-normal text-[1rem] cursor-pointer" >
                    {amountToSend}
                    <Copy className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#828282] text-base">Network</span>
                  <span className="text-[#013941] font-normal text-[1rem]">{network}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#828282] text-base">Wallet</span>
                  <span className="text-[#013941] font-normal text-[1rem]">{wallet}</span>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-[#013941] leading-relaxed">
                  Only send {"{USDT}"} to this address. Ensure the sender is on the {"{CELO}"} network otherwise you
                  might lose your deposit
                </p>
              </div>
              {step3State.errors?._form && (
                <p className="text-sm text-red-600 text-center">{step3State.errors._form}</p>
              )}

              <Button type="submit" disabled={step3Pending} className="w-full h-14 rounded-full bg-[#013941] hover:bg-[#013941]/90 text-white font-semibold text-base cursor-pointer" >
                {step3Pending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 cursor-pointer" />
                    Processing...
                  </>
                ) : (
                  "I have sent it"
                )}
              </Button>
            </form>
          )}
        </div>
      }
      footer={null}
    />

  )
}