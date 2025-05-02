import { PageHeader } from "@/components/ui/page-header/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layers, ExternalLink } from "lucide-react"
import Link from "next/link"
import { CardAction } from "@/components/ui/card-action"

const examples = [
  {
    title: "Interactive Card",
    description: "Example of using CardAction to handle nested interactive elements",
    href: "/examples/interactive-card",
    icon: Layers,
  },
  // Add more examples here as they are created
]

export default function ExamplesPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <PageHeader
        icon={Layers}
        title="Component Examples"
        description="Examples of core components and patterns"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/examples", label: "Examples" }
        ]}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => window.location.href = example.href}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{example.title}</CardTitle>
              {example.icon && <example.icon className="h-5 w-5 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{example.description}</p>
            </CardContent>
            <CardFooter>
              <CardAction>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="gap-1"
                  asChild
                >
                  <Link href={example.href}>
                    <span>View example</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}