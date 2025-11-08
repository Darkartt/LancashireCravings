"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Image, FileText, ShoppingBag } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "product" | "project" | "page" | "blog";
  url: string;
  category?: string;
}

// Mock search data - in production, this would come from your database/API
const searchableItems: SearchResult[] = [
  // Pages
  { id: "page-1", title: "Shop", description: "Browse our collection", type: "page", url: "/shop" },
  { id: "page-2", title: "Commission", description: "Request a custom piece", type: "page", url: "/commission" },
  { id: "page-3", title: "Projects", description: "View our portfolio", type: "page", url: "/projects" },
  { id: "page-4", title: "About", description: "Our story and craftsmen", type: "page", url: "/about" },
  { id: "page-5", title: "Contact", description: "Get in touch", type: "page", url: "/contact" },
  { id: "page-6", title: "Services", description: "What we offer", type: "page", url: "/services" },
  { id: "page-7", title: "Gallery", description: "Photo gallery", type: "page", url: "/gallery" },
  { id: "page-8", title: "Process", description: "How we craft", type: "page", url: "/process" },

  // Products
  { id: "prod-1", title: "Oak Serving Bowl", description: "Handcrafted oak bowl", type: "product", url: "/shop", category: "Bowls" },
  { id: "prod-2", title: "Walnut Cutting Board", description: "Premium walnut board", type: "product", url: "/shop", category: "Kitchen" },
  { id: "prod-3", title: "Cherry Wood Tray", description: "Elegant serving tray", type: "product", url: "/shop", category: "Serving" },

  // Projects
  { id: "proj-1", title: "Eagle Sculpture", description: "Majestic wildlife carving", type: "project", url: "/projects/eagle", category: "Wildlife" },
  { id: "proj-2", title: "Bass Fish", description: "Detailed fish carving", type: "project", url: "/projects/bass", category: "Wildlife" },
  { id: "proj-3", title: "Nessie", description: "Mythical creature", type: "project", url: "/projects/nessie", category: "Mythical" },
];

export function SearchCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Keyboard shortcut to open search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter results based on search query
  useEffect(() => {
    if (search.length === 0) {
      setResults([]);
      return;
    }

    const query = search.toLowerCase();
    const filtered = searchableItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    });

    setResults(filtered);
  }, [search]);

  const handleSelect = useCallback((url: string) => {
    setOpen(false);
    setSearch("");
    router.push(url);
  }, [router]);

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "product":
        return <ShoppingBag className="w-4 h-4" />;
      case "project":
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image className="w-4 h-4" />;
      case "blog":
        return <FileText className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "product":
        return "Product";
      case "project":
        return "Project";
      case "blog":
        return "Blog";
      default:
        return "Page";
    }
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-muted/50"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products, projects, pages..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {search.length > 0 && results.length === 0 && (
            <CommandEmpty>No results found for "{search}"</CommandEmpty>
          )}

          {search.length === 0 && (
            <CommandGroup heading="Quick Links">
              <CommandItem onSelect={() => handleSelect("/shop")}>
                <ShoppingBag className="mr-2 w-4 h-4" />
                <span>Browse Shop</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/commission")}>
                <Package className="mr-2 w-4 h-4" />
                <span>Request Commission</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/projects")}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="mr-2 w-4 h-4" />
                <span>View Projects</span>
              </CommandItem>
            </CommandGroup>
          )}

          {Object.entries(groupedResults).map(([type, items]) => (
            <CommandGroup key={type} heading={getTypeLabel(type as SearchResult["type"]) + "s"}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {getIcon(item.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.category && (
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
