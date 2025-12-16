'use client'

interface ReusableCardProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

import { Card, CardHeader, CardContent, CardFooter } from "../ui/card"

export const ReusableCard = ({ header, content, footer, className='' }: ReusableCardProps) => {
  return (
    <Card className={`w-full rounded-2xl py-6! bg-white border-none ${className}`}>
      {header && 
        <CardHeader className="p-1 sm:p-2">
          {header}
        </CardHeader>
      }
      <CardContent className="p-2">
        {content}
      </CardContent>
      {footer && 
        <CardFooter className="flex-col gap-2">
          {footer}
        </CardFooter>
      }
    </Card>
  )
}