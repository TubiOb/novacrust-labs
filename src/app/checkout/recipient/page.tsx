'use client'

import { ReusableCard } from "@/components/ReusableCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDownIcon, ArrowLeft, Copy, Info } from "lucide-react"
import { useActionState, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { validateStep1, validateStep2, confirmTransaction, RecipientState } from "@/app/actions/recipient"

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
  { code: "+234", flag: "🇳🇬", country: "Nigeria" },
  { code: "+1", flag: "🇺🇸", country: "United States" },
  { code: "+44", flag: "🇬🇧", country: "United Kingdom" },
]

export default function RecipientPage() {
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

  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await step1Action(formData)

    if (result?.success && result?.accountName) {
      setAccountName(result.accountName)
      setCurrentStep(2)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await step2Action(formData)

    if (result?.success) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ReusableCard
          className="lg:p-6"
          header={
            <div className="flex items-center gap-4 p-4">
              {currentStep > 1 && (
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6 text-[#013941]" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-[#013941] text-center flex-1">
                {currentStep === 3 ? "Send ETH to the address below" : "Recipient details"}
              </h1>
            </div>
          }
          content={
            <div className="px-4 py-6">
              {/* Step 1: Bank Details */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="flex flex-col gap-6">
                  {/* Bank Selection */}
                  <div className="flex flex-col gap-3">
                    <Label className="text-[#013941] font-medium text-base">Bank</Label>
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
                      <DropdownMenuContent className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem]">
                        {banks.map((bank) => (
                          <DropdownMenuItem key={bank.value} onClick={() => setSelectedBank(bank)} className="text-base py-3 cursor-pointer" >
                            {bank.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label className="text-[#013941] font-medium text-base">Account number</Label>
                    <Input type="text" placeholder="Enter your account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="h-14 rounded-full border-[#E0E0E0] bg-white text-base placeholder:text-gray-400" />
                  </div>

                  {accountName && (
                    <div className="flex flex-col gap-3">
                      <Label className="text-[#013941] font-medium text-base">Account name</Label>
                      <div className="h-14 rounded-full bg-gray-100 border border-[#E0E0E0] flex items-center px-6">
                        <span className="text-[#013941] font-medium text-base">{accountName}</span>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* Step 2: Additional Details */}
              {currentStep === 2 && (
                <form onSubmit={handleStep2Submit} className="flex flex-col gap-6">
                  <input type="hidden" name="accountName" value={accountName} />
                  <input type="hidden" name="countryCode" value={selectedCountryCode.code} />

                  <div className="flex flex-col gap-3">
                    <Label className="text-[#013941] font-medium text-base">Recipient email</Label>
                    <Input type="email" placeholder="Enter recipient email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="h-14 rounded-full border-[#E0E0E0] bg-white text-base placeholder:text-gray-400" />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label className="text-[#013941] font-medium text-base">Recipient phone number</Label>
                    <div className="flex gap-0 h-14 rounded-full border border-[#E0E0E0] bg-white overflow-hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="rounded-none border-r border-[#E0E0E0] hover:bg-gray-50 px-4 gap-2" >
                            <span className="text-2xl">{selectedCountryCode.flag}</span>
                            <span className="text-[#013941] font-medium">{selectedCountryCode.code}</span>
                            <ChevronDownIcon className="w-4 h-4 text-[#013941]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem]">
                          {countryCodes.map((item) => (
                            <DropdownMenuItem key={item.code} onClick={() => setSelectedCountryCode(item)} className="gap-3 cursor-pointer py-3" >
                              <span className="text-2xl">{item.flag}</span>
                              <span>{item.code}</span>
                              <span className="text-gray-500">{item.country}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Input type="tel" placeholder="000 - 000 - 00000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1 border-0 rounded-none focus-visible:ring-0 text-base placeholder:text-gray-400" />
                    </div>
                  </div>
                </form>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <form className="flex flex-col gap-6">
                  <input type="hidden" name="walletAddress" value={walletAddress} />
                  <input type="hidden" name="amountToSend" value={amountToSend} />
                  <input type="hidden" name="network" value={network} />
                  <div className="flex justify-center">
                    <button onClick={() => copyToClipboard(walletAddress)} className="bg-[#E8F5F7] rounded-full px-6 py-3 flex items-center gap-3 hover:bg-[#d8eef1] transition-colors"
                    >
                      <span className="text-[#013941] font-semibold text-lg">{walletAddress}</span>
                      <Copy className="w-5 h-5 text-[#013941]" />
                    </button>
                  </div>

                  <div className="bg-gray-100 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#828282] text-base">Amount to send</span>
                      <button
                        onClick={() => copyToClipboard(amountToSend)}
                        className="flex items-center gap-2 text-[#013941] font-semibold text-lg"
                      >
                        {amountToSend}
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#828282] text-base">Network</span>
                      <span className="text-[#013941] font-semibold text-lg">{network}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#828282] text-base">Wallet</span>
                      <span className="text-[#013941] font-semibold text-lg">{wallet}</span>
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

                  <Button
                    type="submit"
                    disabled={step3Pending}
                    className="w-full h-14 rounded-full bg-[#013941] hover:bg-[#013941]/90 text-white font-semibold text-base"
                  >
                    {step3Pending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
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
      </div>
    </div>
  )
}