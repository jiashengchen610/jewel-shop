// The dashboard: a shell (a sidebar from the large breakpoint up, a top bar with a slide-in menu below it) around four
// pages picked by the URL hash. Everything on screen is one of this design system's components or a token utility.
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/item/item";
import { Separator } from "@/components/separator/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/sheet/sheet";
import { Switch } from "@/components/switch/switch";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/toast/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip/tooltip";
import { BellIcon, LayoutDashboardIcon, MenuIcon, ReceiptIcon, SettingsIcon, TargetIcon, UserIcon } from "@/icons";
import { Overview } from "./pages/Overview";
import { Transactions } from "./pages/Transactions";
import { Goals } from "./pages/Goals";
import { Settings } from "./pages/Settings";

export type PageId = "overview" | "transactions" | "goals" | "settings";
const PAGES: { id: PageId; label: string; icon: typeof LayoutDashboardIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { id: "transactions", label: "Transactions", icon: ReceiptIcon },
  { id: "goals", label: "Goals", icon: TargetIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];
const fromHash = (): PageId => (PAGES.some((p) => p.id === location.hash.slice(2)) ? (location.hash.slice(2) as PageId) : "overview");

export type Notice = { title: string; text?: string };
export type PageProps = { go: (p: PageId) => void; notify: (n: Notice) => void; dark: boolean; onDark: (on: boolean) => void };

export function Dashboard() {
  const [page, setPage] = useState<PageId>(fromHash);
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("dark") === "1" || (localStorage.getItem("dark") === null && matchMedia("(prefers-color-scheme: dark)").matches); } catch { return false; } });
  useEffect(() => {
    const on = () => setPage(fromHash());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("dark", dark ? "1" : "0"); } catch { /* private window */ }
  }, [dark]);
  const go = (p: PageId) => { location.hash = `/${p}`; setMenu(false); scrollTo({ top: 0 }); };
  const props: PageProps = { go, notify: setNotice, dark, onDark: setDark };
  const current = PAGES.find((p) => p.id === page) ?? PAGES[0];

  const nav = (
    <nav aria-label="Pages" className="flex flex-col gap-1">
      {PAGES.map((p) => (
        <Item key={p.id} asChild size="sm" variant={p.id === page ? "muted" : "default"}>
          <a href={`#/${p.id}`} aria-current={p.id === page ? "page" : undefined} onClick={(e) => { e.preventDefault(); go(p.id); }}>
            <ItemMedia variant="icon"><p.icon /></ItemMedia>
            <ItemContent><ItemTitle>{p.label}</ItemTitle></ItemContent>
          </a>
        </Item>
      ))}
    </nav>
  );
  const account = (
    <Item size="sm" variant="outline">
      <ItemMedia variant="icon"><UserIcon /></ItemMedia>
      <ItemContent>
        <ItemTitle>Mira Chen</ItemTitle>
        <span className="type-body-sm text-muted-foreground">Personal · USD</span>
      </ItemContent>
    </Item>
  );

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="sticky top-0 hidden h-dvh flex-col gap-4 border-r bg-card p-4 lg:flex">
            <Brand />
            {nav}
            <div className="mt-auto flex flex-col gap-3">
              <DarkSwitch id="dark-side" dark={dark} onDark={setDark} />
              <Separator />
              {account}
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 px-4 py-2 backdrop-blur-sm lg:hidden">
              <Sheet open={menu} onOpenChange={setMenu}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon-lg" aria-label="Open the menu"><MenuIcon /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex w-72 flex-col gap-4">
                  <SheetHeader>
                    <SheetTitle>Plinth Dashboard</SheetTitle>
                    <SheetDescription>Your money this month, in one place.</SheetDescription>
                  </SheetHeader>
                  {nav}
                  <div className="mt-auto flex flex-col gap-3">
                    <DarkSwitch id="dark-sheet" dark={dark} onDark={setDark} />
                    <Separator />
                    {account}
                  </div>
                </SheetContent>
              </Sheet>
              <Brand compact />
              <span className="ml-auto flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="ghost" size="icon-lg" aria-label="Notifications: 2 new"><BellIcon /></Button></TooltipTrigger>
                  <TooltipContent>2 new: a bill is due, a goal is ahead</TooltipContent>
                </Tooltip>
              </span>
            </header>

            <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 pb-12 sm:p-6 lg:p-8">
              <PageHeader page={current.id} />
              {page === "overview" && <Overview {...props} />}
              {page === "transactions" && <Transactions {...props} />}
              {page === "goals" && <Goals {...props} />}
              {page === "settings" && <Settings {...props} />}
            </main>
          </div>
        </div>
        <Toast open={Boolean(notice)} onOpenChange={(open) => { if (!open) setNotice(null); }} duration={4000}>
          <div className="grid gap-1">
            <ToastTitle>{notice?.title}</ToastTitle>
            {notice?.text && <ToastDescription>{notice.text}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#/overview" className="flex items-center gap-2.5 rounded-item px-1 py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Plinth Dashboard, overview">
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-button bg-gradient-brand text-gradient-brand-foreground">
        <svg width="18" height="18" viewBox="0 0 28 28"><rect x="3" y="17" width="22" height="7" rx="2" fill="currentColor" /><rect x="8" y="5" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>
      </span>
      {!compact && <span className="type-heading-xs">Plinth Dashboard</span>}
      {compact && <span className="type-label-md">Plinth</span>}
    </a>
  );
}

function DarkSwitch({ id, dark, onDark }: { id: string; dark: boolean; onDark: (on: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-3 px-1 type-label-md">
      Dark mode
      <Switch id={id} checked={dark} onCheckedChange={onDark} />
    </label>
  );
}

const TITLES: Record<PageId, [string, string]> = {
  overview: ["Overview", "October 2026 · your money this month, in one place."],
  transactions: ["Transactions", "Everything in and out this month. Search, filter, and check what is still pending."],
  goals: ["Goals", "What you are saving for, how far along each one is, and what it takes per month."],
  settings: ["Settings", "Your profile, what we tell you about, and how the app looks."],
};

function PageHeader({ page }: { page: PageId }) {
  const [title, text] = TITLES[page];
  return (
    <div className="flex flex-col gap-1">
      <h1 className="type-heading-lg">{title}</h1>
      <p className="type-body-md text-muted-foreground">{text}</p>
    </div>
  );
}

/** A card-shaped section with a title row, shared by the pages. */
export function Section({ title, text, action, children, className = "" }: { title: string; text?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={`flex min-w-0 flex-col gap-4 rounded-card bg-card p-5 ring-1 ring-border ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="type-heading-xs">{title}</h2>
          {text && <p className="type-body-sm text-muted-foreground">{text}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
