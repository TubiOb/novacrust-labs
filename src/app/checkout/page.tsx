'use client'

import { ReusableCard } from "@/components/ReusableCard"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, ChevronDownIcon, Search } from "lucide-react"
import Image from "next/image"
import { Eth, Usdt_Bnb, Usdt_Celo, Usdt_Ton, Ngn, Dollar, Euros, Pounds, Metamask, Rainbow, WalletConnect, OtherWallets } from "../../../public/img"
import { useActionState, useEffect, useState } from "react"
import { convertCryptoToCash, subscribeForUpdates } from "../actions/checkout"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

const currencies = [
  { icon: Usdt_Celo, label: "USDT - CELO", value: "usdt-celo" },
  { icon: Usdt_Bnb, label: "USDT - TON", value: "usdt-ton" },
  { icon: Usdt_Ton, label: "USDT - BNB", value: "usdt-bnb" },
  { icon: Eth, label: "ETH - USDT", value: "eth-usdt" },
]

const fiatCurrencies = [
  { icon: Ngn, label: "NGN", value: "naira" },
  { icon: Dollar, label: "USD", value: "dollar" },
  { icon: Euros, label: "EUR", value: "euros" },
  { icon: Pounds, label: "GBP", value: "pounds" },
]

const paymentOption = [
  { icon: Metamask, label: "Metamask", value: "metamask" },
  { icon: Rainbow, label: "Rainbow", value: "rainbow" },
  { icon: WalletConnect, label: "WalletConnect", value: "walletconnect" },
  { icon: OtherWallets, label: "Other Crypto Wallets (Binance, Conibase, Bybit etc)", value: "others" },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<'cryptoToCash' | 'cashToCrypto' | 'cryptoToLoan'>('cryptoToCash')
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState(fiatCurrencies[0]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<typeof paymentOption[0] | null>(null);
  const [selectedPaymentToOption, setSelectedPaymentToOption] = useState<typeof paymentOption[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState('1.00');

  const [cryptoState, cryptoAction, isPendingCrypto] = useActionState(convertCryptoToCash, { errors: {} });
  const [emailState, emailAction, isPendingEmail] = useActionState(subscribeForUpdates, { errors: {} });

  useEffect(() => {
    if (emailState.success) {
      const timer = setTimeout(() => {
        emailState.success = false;
        emailState.message = '';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [emailState.success]);

  const filteredCurriencies = currencies.filter(currency =>
    currency.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFooterContent = (activeTab: 'cryptoToCash' | 'cashToCrypto' | 'cryptoToLoan') => {
    switch (activeTab) {
      case "cryptoToCash":
        return (
          <Button type="submit" form="cryptoToCashForm" disabled={isPendingCrypto} className="bg-[#013941] font-instrument-sans text-white w-full py-4 lg:py-7 px-6 lg:px-10 rounded-full cursor-pointer font-bold text-base hover:bg-[#013941]/90" size='lg'>
            {isPendingCrypto ? 'Processing...' : 'Convert now'}
          </Button>
        )
      case "cashToCrypto":
        return (
          <Button type="submit" form="emailForm" disabled={isPendingEmail} className="bg-[#013941] font-instrument-sans text-white w-full py-4 lg:py-7 px-6 lg:px-10 rounded-full cursor-pointer font-bold text-base hover:bg-[#013941]/90" size='lg'>
            {isPendingEmail ? 'Submitting...' : 'Update me'}
          </Button>
        )
      case "cryptoToLoan":
        return (
          <Button type="submit" form="emailForm" disabled={isPendingEmail} className="bg-[#013941] font-instrument-sans text-white w-full py-4 lg:py-7 px-6 lg:px-10 rounded-full cursor-pointer font-bold text-base hover:bg-[#013941]/90" size='lg'>
            {isPendingEmail ? 'Submitting...' : 'Update me'}
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Tabs defaultValue="cryptoToCash" value={activeTab} onValueChange={(value: string) => { if (value === 'cryptoToCash' || value === 'cashToCrypto' || value === 'cryptoToLoan') { setActiveTab(value) } }} className="w-full items-center gap-3">
      <ReusableCard
        className="lg:p-2"
        header={
          <TabsList className="grid items-center justify-center w-full grid-cols-3 p-0.5 rounded-full bg-[#F2F2F2] gap-1 lg:gap-3 text-sm">
            <TabsTrigger value="cryptoToCash" className="rounded-4xl lg:rounded-full data-[state=active]:bg-[#013941] data-[state=active]:text-white text-[#828282] text-[0.656rem] lg:text-sm font-medium cursor-pointer transition-all ease-in-out duration-150">
              <span>Crypto to cash</span>
            </TabsTrigger>
            <TabsTrigger value="cashToCrypto" className="rounded-4xl lg:rounded-full data-[state=active]:bg-[#013941] data-[state=active]:text-white text-[#828282] text-[0.656rem] lg:text-sm font-medium cursor-pointer transition-all ease-in-out duration-150">
              <span>Cash to crypto</span>
            </TabsTrigger>
            <TabsTrigger value="cryptoToLoan" className="rounded-4xl lg:rounded-full data-[state=active]:bg-[#013941] data-[state=active]:text-white text-[#828282] text-[0.656rem] lg:text-sm font-medium cursor-pointer transition-all ease-in-out duration-150">
              <span>Crypto to float loan</span>
            </TabsTrigger>
          </TabsList>
        }
        content={
          <>
            <LoadingOverlay isLoading={isPendingCrypto || isPendingEmail} activeTab={activeTab} />

            <TabsContent value="cryptoToCash" className="w-full border-0 flex flex-col gap-6 transition-all ease-in-out duration-150">
              <form id='cryptoToCashForm' action={cryptoAction} className="flex flex-col gap-6">
                {cryptoState.errors?._form && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2 lg:p-4 flex items-center gap-2 text-red-600">
                    <AlertCircle className="size-5" />
                    <span>{cryptoState.errors._form}</span>
                  </div>
                )}

                {/* YOU PAY */}
                <div className="flex flex-col gap-1">
                  <div className="[--radius:1rem] rounded-2xl lg:rounded-3xl w-full border border-[#E0E0E0] flex flex-col items-start justify-between p-2 lg:p-4 gap-3">
                    <Label className="text-[#828282] font-medium text-[1rem]">You pay</Label>
                    <div className="flex items-center justify-between flex-1 w-full">
                      <Input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-0 border-none outline-none ring-none bg-transparent p-2 shadow-none focus-visible:ring-0 rounded-xl text-[#000E10] font-semibold text-[1rem] w-auto max-w-32 lg:max-w-50 shrink-0" placeholder="1.00" step={'0.01'} />
                      <input type="hidden" name="fromCurrency" value={selectedCurrency.value} />
                      <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl lg:rounded-3xl p-0 cursor-pointer">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="cursor-pointer">
                            <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#013941] bg-transparent hover:bg-transparent border-0 ring-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                              <Image src={selectedCurrency.icon} alt={selectedCurrency.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                              {selectedCurrency.label.split(' - ')[0]}
                              <ChevronDownIcon className="size-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem] z-100">
                            <div className="relative mb-3">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-[#828282]" />
                              <Input className="pl-10 pr-4 py-4 text-sm bg-white text-[#000E10] border border-[#E0E0E0] rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#828282]" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="space-y-1 max-h-70 overflow-y-auto">
                              {filteredCurriencies.length > 0 ? (
                                filteredCurriencies.map((currency) => (
                                  <DropdownMenuItem key={currency.value} onClick={() => setSelectedCurrency(currency)} className="flex items-center gap-3 p-1 text-sm text-[#013941] font-medium rounded-xl cursor-pointer hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] focus:text-[#013941] transition-colors">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                      <Image src={currency.icon} alt={currency.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                                    </div>
                                    <span className='text-sm'>{currency.label}</span>
                                  </DropdownMenuItem>
      
                                ))
                              )
                              : 
                              (
                                <div className="text-center py-6 text-sm text-[#828282]">
                                  No results found
                                </div>
                              )}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {cryptoState.errors?.amount && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="size-4" />
                        <span>{cryptoState.errors.amount}</span>
                      </div>
                    )}
                  </div>
                </div>
    
                {/* YOU RECEIVE */}
                <div className="[--radius:1rem] rounded-2xl lg:rounded-3xl w-full border border-[#E0E0E0] flex flex-col items-start justify-between p-2 lg:p-4 gap-3">
                  <Label className="text-[#828282] font-medium text-[1rem]">You receive</Label>
                  <div className="flex items-center justify-between flex-1 w-full">
                    <Label className="text-[#000E10] font-semibold text-[1rem]">{amount || '0.00'}</Label>
                    <input type="hidden" name="toCurrency" value={selectedFiatCurrency.value} />
                    <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl lg:rounded-3xl p-0 cursor-pointer">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#013941] bg-transparent hover:bg-transparent border-0 ring-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                            <Image src={selectedFiatCurrency.icon} alt={selectedFiatCurrency.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                            {selectedFiatCurrency.label}
                            <ChevronDownIcon className="size-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem] z-100">
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-[#828282]" />
                            <Input className="pl-10 pr-4 py-4 text-sm bg-white text-[#000E10] border border-[#E0E0E0] rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#828282]" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                          </div>
                          <div className="space-y-1 max-h-70 overflow-y-auto">
                            {fiatCurrencies.length > 0 ? (
                              fiatCurrencies.map((currency) => (
                                <DropdownMenuItem key={currency.value} onClick={() => setSelectedFiatCurrency(currency)} className="flex items-center gap-3 p-1 text-sm text-[#013941] font-medium rounded-xl cursor-pointer hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] focus:text-[#013941] transition-colors">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <Image src={currency.icon} alt={currency.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                                  </div>
                                  <span className='text-sm'>{currency.label}</span>
                                </DropdownMenuItem>
    
                              ))
                            )
                            : 
                            (
                              <div className="text-center py-6 text-sm text-[#828282]">
                                No results found
                              </div>
                            )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
    
                {/* PAY FROM */}
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col items-start justify-between flex-1 w-full gap-2">
                    <Label className="text-[#013941] font-medium text-[1rem]">Pay from</Label>
                    <input type="hidden" name="payFrom" value={selectedPaymentOption?.value || ''} />
                    <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl lg:rounded-3xl p-0 cursor-pointer w-full">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer w-full p-6">
                          <Button variant="ghost" className="flex items-center justify-between gap-2 px-3 p-6 text-sm font-medium text-[#013941] bg-transparent hover:bg-transparent border-0 ring-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 z-100">
                            {selectedPaymentOption ? (
                              <>
                                <div className="flex items-center gap-3">
                                  <Image src={selectedPaymentOption.icon} alt={selectedPaymentOption.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                                  <span className="text-[#013941] font-medium">
                                    {selectedPaymentOption.label}
                                  </span>
                                </div>
                                <ChevronDownIcon className="size-5" />
                              </>
                            )
                            :
                            (
                              <>
                                <span className="text-[#013941] font-normal">Select an option</span>
                                <ChevronDownIcon className="size-5" />
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem] z-100">
                          <div className="space-y-1 max-h-70 overflow-y-auto">
                            {paymentOption.length > 0 ? (
                              paymentOption.map((option) => (
                                <DropdownMenuItem key={option.value} onClick={() => setSelectedPaymentOption(option)} className="flex items-center gap-3 p-1 text-sm text-[#013941] font-medium rounded-xl cursor-pointer hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] focus:text-[#013941] transition-colors">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <Image src={option.icon} alt={option.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                                  </div>
                                  <span>{option.label}</span>
                                </DropdownMenuItem>
                              ))
                            )
                            : 
                            (
                              <div className="text-center py-6 text-sm text-[#828282]">
                                No results found
                              </div>
                            )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {cryptoState.errors?.payFrom && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="size-4" />
                      <span>{cryptoState.errors.payFrom}</span>
                    </div>
                  )}
                </div>
    
                {/* PAY TO */}
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col items-start justify-between flex-1 w-full gap-2">
                    <Label className="text-[#013941] font-medium text-[1rem]">Pay to</Label>
                    <input type="hidden" name="payTo" value={selectedPaymentToOption?.value || ''} />
                    <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl lg:rounded-3xl p-0 cursor-pointer w-full">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer w-full p-6">
                          <Button variant="ghost" className="flex items-center justify-between gap-2 px-3 p-6 text-sm font-medium text-[#013941] bg-transparent hover:bg-transparent border-0 ring-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                            {selectedPaymentToOption ? (
                              <>
                                <div className="flex items-center gap-3">
                                  <Image src={selectedPaymentToOption.icon} alt={selectedPaymentToOption.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                                  <span className="text-[#013941] font-medium">
                                    {selectedPaymentToOption.label}
                                  </span>
                                </div>
                                <ChevronDownIcon className="size-5" />
                              </>
                            )
                            :
                            (
                              <>
                                <span className="text-[#013941] font-normal">Select an option</span>
                                <ChevronDownIcon className="size-5" />
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="[--radius:0.95rem] rounded-xl bg-white border border-[#E0E0E0] p-2.5 w-[calc(100vw-2rem)] sm:w-70 md:w-[20rem] max-w-[20rem] z-100">
                          <div className="space-y-1 max-h-70 overflow-y-auto">
                            {paymentOption.length > 0 ? (
                              paymentOption.map((option) => (
                                <DropdownMenuItem key={option.value} onClick={() => setSelectedPaymentToOption(option)} className="flex items-center gap-3 p-1 text-sm text-[#013941] font-medium rounded-xl cursor-pointer hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] focus:text-[#013941] transition-colors">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <Image src={option.icon} alt={option.label} className="lg:w-7 lg:h-7 w-5 h-5" />
                                  </div>
                                  <span>{option.label}</span>
                                </DropdownMenuItem>
      
                              ))
                            )
                            : 
                            (
                              <div className="text-center py-6 text-sm text-[#828282]">
                                No results found
                              </div>
                            )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {cryptoState.errors?.payTo && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="size-4" />
                      <span>{cryptoState.errors.payTo}</span>
                    </div>
                  )}
                </div>
              </form>
            </TabsContent>
  

            {/* CASH TO CRYPTO TAB */}
            <TabsContent value="cashToCrypto" className="w-full border-0 flex flex-col gap-6 transition-all ease-in-out duration-150">
              <form id="emailForm" action={emailAction} className="flex flex-col gap-6">
                <input type="hidden" name="feature" value='cashToCrypto' />

                {emailState.success && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-2 lg:p-4 flex items-center gap-2 text-green-600">
                    <CheckCircle className="size-5" />
                    <span>{emailState.message}</span>
                  </div>
                )}

                {emailState.errors?._form && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2 lg:p-4 flex items-center gap-2 text-red-600">
                    <AlertCircle className="size-5" />
                    <span>{emailState.errors._form}</span>
                  </div>
                )}
                <div className="flex flex-col gap-8 lg:gap-4 lg:p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#013941] font-clash font-medium text-[2rem] text-center">Coming Soon!</h3>
                    <div className="text-center flex flex-col">
                      <span className="text-[#013941] font-normal text-[1rem] text-center">
                        Cash to Crypto is almost here.
                      </span>
                      <span className="text-[#013941] font-normal text-[1rem] text-center">
                        Enter your email and we’ll let you know the moment it’s live.
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#013941] font-medium text-[1rem]">Email</Label>
                    <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl lg:rounded-3xl p-0 cursor-pointer w-full">
                      <Input type="email" name='email' placeholder="Enter your email" className="border-0 bg-transparent text-[#000E10] px-5 py-6 focus-visible:ring-0 rounded-2xl lg:rounded-3xl"></Input>
                    </div>
                    {emailState.errors?.email && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="size-4" />
                        <span>{emailState.errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </TabsContent>
  

            {/* CRYPTO TO LOAN TAB */}
            <TabsContent value="cryptoToLoan" className="w-full border-0 flex flex-col gap-6 transition-all ease-in-out duration-150">
              <form action={emailAction} className="flex flex-col gap-6">
                <input type="hidden" name="feature" value='cryptoToLoan' />
                {emailState.success && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-2 lg:p-4 flex items-center gap-2 text-green-600">
                    <CheckCircle className="size-5" />
                    <span>{emailState.message}</span>
                  </div>
                )}

                {emailState.errors?._form && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2 lg:p-4 flex items-center gap-2 text-red-600">
                    <AlertCircle className="size-5" />
                    <span>{emailState.errors._form}</span>
                  </div>
                )}
                <div className="flex flex-col gap-8 lg:gap-4 lg:p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#013941] font-clash font-medium text-[2rem] text-center">Coming Soon!</h3>
                    <div className="text-center flex flex-col">
                      <span className="text-[#013941] font-normal text-[1rem] text-center">
                        Crypto to Fiat Loan is almost here.
                      </span>
                      <span className="text-[#013941] font-normal text-[1rem] text-center">
                        Enter your email and we’ll let you know the moment it’s live.
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#013941] font-medium text-[1rem]">Email</Label>
                    <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl lg:rounded-3xl p-0 cursor-pointer w-full">
                      <Input type="email" name='email' placeholder="Enter your email" className="border-0 bg-transparent text-[#000E10] px-5 py-6 focus-visible:ring-0 rounded-3xl"></Input>
                    </div>
                    {emailState.errors?.email && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="size-4" />
                        <span>{emailState.errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </TabsContent>
          </>
        }
        footer={getFooterContent(activeTab)}
      />
    </Tabs>
  )
}