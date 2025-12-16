import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { z } from 'zod';

const cryptoToCashSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)), 'Please enter a valid number')
    .refine((val) => Number(val) > 0, 'Amount must be greater than 0')
    .refine((val) => Number(val) >= 10, 'Minimum amount is 10')
    .refine((val) => Number(val) <= 1000000, 'Maximum amount is 1,000,000'),
  fromCurrency: z.string().min(1, 'Please select a currency'),
  toCurrency: z.string().min(1, 'Please select a currency'),
  payFrom: z.string().min(1, 'Please select where to pay from').refine((val) => val !== 'null', 'Please select where to pay from'),
  payTo: z.string().min(1, 'Please select where to pay to').refine((val) => val !== 'null', 'Please select where to pay to'),
})

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  feature: z.string(),
})

export interface CheckoutState {
  errors?: {
    amount?: string;
    payFrom?: string;
    payTo?: string;
    email?: string;
    _form?: string;
  };
  success?: boolean;
  message?: string;
}


export async function convertCryptoToCash( prevState: CheckoutState, formData: FormData ): Promise<CheckoutState> {
  const validateFields = cryptoToCashSchema.safeParse({
    amount: formData.get('amount'),
    fromCurrency: formData.get('fromCurrency'),
    toCurrency: formData.get('toCurrency'),
    payFrom: formData.get('payFrom'),
    payTo: formData.get('payTo'),
  })

  if (!validateFields.success) {
    const errors: Record<string, string> = {};

    validateFields.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      errors[path] = issue.message
    })

    return { errors }
  }
    
    
  try {
    const { amount, fromCurrency, toCurrency, payFrom, payTo } = validateFields.data;

    await new Promise(resolve => setTimeout(resolve, 1000));
        
    console.log('Conversion successful: ', { amount, fromCurrency, toCurrency, payFrom, payTo });

    redirect('/checkout/recipient');
  }
  catch (err: any) {
    if (isRedirectError(err)) {
      throw err;
    }

    return {
      errors: {
        _form: 'Failed to process conversion. Please try again.',
      }
    }
  }
}



export async function subscribeForUpdates( prevState: CheckoutState, formData: FormData ): Promise<CheckoutState> {
  const validateFields = emailSchema.safeParse({
    email: formData.get('email'),
    feature: formData.get('feature'),
  })

  if (!validateFields.success) {
    const errors: Record<string, string> = {};

    validateFields.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      errors[path] = issue.message
    })

    return { errors }
  }

  try {
    const { email, feature } = validateFields.data;

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Subscription successful: ', { email, feature });

    return {
      success: true,
      message: "Thanks! We'll notify you when this feature is available."
    }
  }
  catch (err: any) {
    if (isRedirectError(err)) {
      throw err;
    }
    
    return {
      errors: {
        _form: 'Failed to subscribe. Please try again.'
      }
    }
  }
}