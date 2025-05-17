import { Loader2 } from "lucide-react"

export default function CheckoutLoading() {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-medium">Checkout wird geladen...</h2>
      <p className="text-muted-foreground">Bitte haben Sie einen Moment Geduld.</p>
    </div>
  )
}
