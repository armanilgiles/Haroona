import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      {/* <SidebarTrigger data-testid="button-sidebar-toggle" /> */}
      <div style={{ opacity: 0.0 }}></div>

      <div className="flex flex-col items-center select-none">
        <h1
          className="font-serif text-xl md:text-2xl tracking-[0.3em] font-medium"
          data-testid="text-logo"
        >
          Haroona
        </h1>
        <p
          className="hidden sm:block text-[9px] md:text-[10px] tracking-[0.2em] text-muted-foreground/60 -mt-0.5"
          data-testid="text-tagline"
        >
          Travel the world through style.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* <Button size="icon" variant="ghost" data-testid="button-search-nav">
          <Search className="w-5 h-5" />
        </Button>
        <Avatar className="w-8 h-8 border border-border/50">
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
            alt="User"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar> */}
      </div>
    </nav>
  );
}
