import { cn } from "@/lib/utils"

const MaxWidthWrapper = ({ className, children }) => {
  return (
    <div
      className={cn(
        "w-full max-w-screen-2xl",
        className
      )}
    >
      {children}
    </div>
  )
}

export default MaxWidthWrapper