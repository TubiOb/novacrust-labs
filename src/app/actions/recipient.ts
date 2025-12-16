import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"
import { z } from "zod"

const step1Schema = z.object({
  bank: z.string().min(1, "Please select a bank"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .refine((val) => /^\d+$/.test(val), "Account number must contain only digits"),
})

const step2Schema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  recipientEmail: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  countryCode: z.string().min(1, "Country code is required"),
})

const step3Schema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  amountToSend: z.string().min(1, "Amount is required"),
  network: z.string().min(1, "Network is required"),
})

export interface RecipientState {
  errors?: {
    bank?: string
    accountNumber?: string
    accountName?: string
    recipientEmail?: string
    phoneNumber?: string
    countryCode?: string
    walletAddress?: string
    amountToSend?: string
    network?: string
    _form?: string
  }
  success?: boolean
  message?: string
  accountName?: string
}

export async function validateStep1(prevState: RecipientState, formData: FormData): Promise<RecipientState> {
  const validateFields = step1Schema.safeParse({
    bank: formData.get("bank"),
    accountNumber: formData.get("accountNumber"),
  })

  if (!validateFields.success) {
    const errors: Record<string, string> = {}

    validateFields.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      errors[path] = issue.message
    })

    return { errors }
  }

  try {
    const { bank, accountNumber } = validateFields.data

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const accountName = "ODUTUGA GBEKE"

    console.log("Step 1 validated:", { bank, accountNumber, accountName })

    return {
      success: true,
      accountName,
      message: "Account verified successfully",
    }
  } catch (err: any) {
    if (isRedirectError(err)) {
      throw err
    }

    return {
      errors: {
        _form: "Failed to verify account. Please try again.",
      },
    }
  }
}



export async function validateStep2(prevState: RecipientState, formData: FormData): Promise<RecipientState> {
  const validateFields = step2Schema.safeParse({
    accountName: formData.get("accountName"),
    recipientEmail: formData.get("recipientEmail"),
    phoneNumber: formData.get("phoneNumber"),
    countryCode: formData.get("countryCode"),
  })

  if (!validateFields.success) {
    const errors: Record<string, string> = {}

    validateFields.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      errors[path] = issue.message
    })

    return { errors }
  }

  try {
    const { accountName, recipientEmail, phoneNumber, countryCode } = validateFields.data

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Step 2 validated:", {
      accountName,
      recipientEmail,
      phoneNumber,
      countryCode,
    })

    return {
      success: true,
      message: "Recipient details saved successfully",
    }
  } catch (err: any) {
    if (isRedirectError(err)) {
      throw err
    }

    return {
      errors: {
        _form: "Failed to save recipient details. Please try again.",
      },
    }
  }
}

export async function confirmTransaction(prevState: RecipientState, formData: FormData): Promise<RecipientState> {
  const validateFields = step3Schema.safeParse({
    walletAddress: formData.get("walletAddress"),
    amountToSend: formData.get("amountToSend"),
    network: formData.get("network"),
  })

  if (!validateFields.success) {
    const errors: Record<string, string> = {}

    validateFields.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      errors[path] = issue.message
    })

    return { errors }
  }

  try {
    const { walletAddress, amountToSend, network } = validateFields.data

    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Transaction confirmed:", { walletAddress, amountToSend, network })

    redirect("/checkout/recipient/success")
  } catch (err: any) {
    if (isRedirectError(err)) {
      throw err
    }

    return {
      errors: {
        _form: "Failed to process transaction. Please try again.",
      },
    }
  }
}