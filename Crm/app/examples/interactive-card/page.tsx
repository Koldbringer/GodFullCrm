import { InteractiveCardExample } from "@/components/examples/interactive-card-example"
import { PageHeader } from "@/components/ui/page-header/page-header"
import { Layers } from "lucide-react"

export default function InteractiveCardPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <PageHeader
        icon={Layers}
        title="Interactive Card Example"
        description="Example of using CardAction to handle nested interactive elements"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/examples", label: "Examples" },
          { href: "/examples/interactive-card", label: "Interactive Card" }
        ]}
      />
      
      <InteractiveCardExample />
    </div>
  )
}