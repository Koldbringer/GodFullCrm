import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CardAction } from "@/components/ui/card-action";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  breadcrumbs?: {
    href: string;
    label: string;
  }[];
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  breadcrumbs,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-1.5">
                <span>/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-foreground">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>
        {actions && (
          <CardAction>
            <div className="flex items-center gap-2">{actions}</div>
          </CardAction>
        )}
      </div>
    </div>
  );
}