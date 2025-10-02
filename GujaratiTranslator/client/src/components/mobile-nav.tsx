import { Link, useLocation } from "wouter";
import { FileText, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: FileText, label: "New Quotation" },
    { path: "/history", icon: History, label: "History" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-6 py-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
