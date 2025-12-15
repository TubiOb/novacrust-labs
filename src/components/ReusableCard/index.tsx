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
    <Card className={`w-full rounded-2xl p-2 border-none ${className}`}>
      {header && 
        <CardHeader>
          {header}
        </CardHeader>
      }
      <CardContent>
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