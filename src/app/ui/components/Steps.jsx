
import { cn } from "@/lib/utils"



export function Steps({ className, children, ...props }) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}



export function StepItem({ className, children, ...props }) {
  return (
    <div className={cn("flex items-start gap-2 pb-3", className)} {...props}>
      <div className="flex-none mt-0.5">
        <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  )
}
