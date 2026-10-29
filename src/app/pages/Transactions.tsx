// Transactions: search and filters on top, a table from the medium breakpoint up and a list of rows below it, an
// empty state when nothing matches, and a footer with the total of what is shown.
import { useMemo, useState } from "react";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { ButtonGroup } from "@/components/button-group/button-group";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/empty/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input-group/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/item/item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select/select";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/table/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs/tabs";
import { ChevronDownIcon, InboxIcon, ReceiptIcon, SearchIcon } from "@/icons";
import { Panel, Section, type PageProps } from "../Dashboard";
import { categoryTone, money, shortDate, transactions, type Category } from "../data";

const CATEGORIES = ["All", ...new Set(transactions.map((t) => t.category))] as const;
type Kind = "all" | "in" | "out";
const PAGE = 8;

export function Transactions({ notify }: PageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [kind, setKind] = useState<Kind>("all");
  const [shown, setShown] = useState(PAGE);
  const rows = useMemo(() => transactions.filter((t) =>
    (category === "All" || t.category === category) &&
    (kind === "all" || (kind === "in" ? t.amount > 0 : t.amount < 0)) &&
    (!query.trim() || `${t.merchant} ${t.category}`.toLowerCase().includes(query.trim().toLowerCase())),
  ), [query, category, kind]);
  const total = rows.reduce((s, t) => s + t.amount, 0);
  const visible = rows.slice(0, shown);
  const reset = () => { setQuery(""); setCategory("All"); setKind("all"); setShown(PAGE); };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="w-full sm:w-72">
          <InputGroupInput placeholder="Search by name or category" aria-label="Search transactions" value={query} onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }} />
          <InputGroupAddon align="inline-end"><SearchIcon /></InputGroupAddon>
        </InputGroup>
        <Select value={category} onValueChange={(v) => { setCategory(v); setShown(PAGE); }}>
          <SelectTrigger aria-label="Category" className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c === "All" ? "All categories" : c}</SelectItem>)}</SelectContent>
        </Select>
        <Tabs value={kind} onValueChange={(v) => { setKind(v as Kind); setShown(PAGE); }}>
          <TabsList aria-label="Direction">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in">In</TabsTrigger>
            <TabsTrigger value="out">Out</TabsTrigger>
          </TabsList>
        </Tabs>
        <ButtonGroup aria-label="Period" className="sm:ml-auto">
          <Button variant="outline" onClick={() => notify({ title: "October 2026", text: "Earlier months come with the real account." })}>October</Button>
          <Button variant="outline" size="icon" aria-label="Pick a month" onClick={() => notify({ title: "October 2026", text: "Earlier months come with the real account." })}><ChevronDownIcon /></Button>
        </ButtonGroup>
      </div>

      {rows.length === 0 ? (
        <Panel>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
              <EmptyTitle>Nothing matches</EmptyTitle>
              <EmptyDescription>No transaction this month fits “{query || category}”. Try another word, or clear the filters.</EmptyDescription>
            </EmptyHeader>
            <Button variant="outline" onClick={reset}>Clear filters</Button>
          </Empty>
        </Panel>
      ) : (
        <Section title={`${rows.length} transaction${rows.length === 1 ? "" : "s"}`} text={`${money(total, true)} in total${rows.some((t) => t.status === "pending") ? " · one still pending" : ""}`}>
          <div className="hidden md:block">
            <Table>
              <TableCaption className="sr-only">Transactions in October 2026</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground tabular-nums">{shortDate(t.date)}</TableCell>
                    <TableCell className="type-label-md">{t.merchant}</TableCell>
                    <TableCell><Badge variant={categoryTone[t.category as Category]}>{t.category}</Badge></TableCell>
                    <TableCell>{t.status === "pending" ? <Badge variant="warning">Pending</Badge> : <span className="text-muted-foreground">Cleared</span>}</TableCell>
                    <TableCell className={`text-right tabular-nums ${t.amount > 0 ? "text-success" : ""}`}>{money(t.amount, true)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Shown: {visible.length} of {rows.length}</TableCell>
                  <TableCell className="text-right tabular-nums">{money(visible.reduce((s, t) => s + t.amount, 0), true)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex flex-col gap-1 md:hidden">
            {visible.map((t) => (
              <Item key={t.id} size="sm" variant="outline">
                <ItemMedia variant="icon"><ReceiptIcon /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{t.merchant}</ItemTitle>
                  <ItemDescription>{shortDate(t.date)} · {t.category}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col items-end gap-1">
                  <span className={`type-label-md tabular-nums ${t.amount > 0 ? "text-success" : ""}`}>{money(t.amount, true)}</span>
                  {t.status === "pending" && <Badge variant="warning">Pending</Badge>}
                </ItemActions>
              </Item>
            ))}
          </div>
          {shown < rows.length && <Button variant="outline" className="self-center" onClick={() => setShown(shown + PAGE)}>Show {Math.min(PAGE, rows.length - shown)} more</Button>}
        </Section>
      )}
    </div>
  );
}
