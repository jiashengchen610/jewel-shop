// Overview: the month at a glance. The balance sits straight on the gradient; the three numbers that matter are glass
// panels; below them the spending history, where the money went, recent transactions, bills, goals and subscriptions.
// Both charts draw from the same sequential chart colors. The donut steps through them, light for less, dark for
// more; the bars share one vertical gradient from the darkest step at the top to a light one at the base.
import { useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, Rectangle, XAxis, type BarShapeProps } from "recharts";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/chart/chart";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/item/item";
import { Progress } from "@/components/progress/progress";
import { ArrowRightIcon, CalendarClockIcon, ReceiptIcon, RepeatIcon, TrendingUpIcon } from "@/icons";
import { Panel, Section, type PageProps } from "../Dashboard";
import { balance, bills, goals, income, left, money, months, saved, shares, shortDate, spent, subscriptions, transactions } from "../data";

/** The sequential chart colors, lightest to darkest: one scale for every chart on the page. */
const seq = (n: number) => `var(--chart-seq-${Math.min(7, Math.max(1, n))})`;
/** A length token's value in pixels, read from the page's CSS variables (rem values scaled by the root font size). */
function cssPx(name: string, fallback: number) {
  if (typeof document === "undefined") return fallback;
  const root = getComputedStyle(document.documentElement);
  const m = /^(-?[\d.]+)(px|rem)?$/.exec(root.getPropertyValue(name).trim());
  if (!m) return fallback;
  return m[2] === "rem" ? parseFloat(m[1]) * parseFloat(root.fontSize) : parseFloat(m[1]);
}
const monthlyConfig = { total: { label: "Spent", color: seq(7) } } satisfies ChartConfig;
// The four biggest categories, darkest first, and the long tail as "Other": five slices on the scale's five strongest
// steps, so even the smallest reads against the glass in both modes.
const ranked = shares.filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
const slices = [...ranked.slice(0, 4), ...(ranked.length > 4 ? [{ category: "Other", value: ranked.slice(4).reduce((s, x) => s + x.value, 0) }] : [])]
  .map((s, i) => ({ ...s, fill: seq(7 - i) }));
const shareConfig = Object.fromEntries(slices.map((s) => [s.category, { label: s.category, color: s.fill }])) satisfies ChartConfig;

export function Overview({ go }: PageProps) {
  const recent = transactions.slice(0, 5);
  // The bars' top corners follow the control corner role (buttons, items), capped at a quarter of the bar's width: the
  // pill setting gives a soft top rather than a semicircle, and a squarer setting in Style gives squarer bars.
  const [cornerRadius] = useState(() => cssPx("--control-radius", 6));
  const barShape = (props: BarShapeProps) => {
    const r = Math.min(cornerRadius, (props.width ?? 0) / 4);
    return <Rectangle {...props} radius={[r, r, 0, 0]} />;
  };
  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Balance" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="type-label-sm uppercase opacity-80">Current balance</span>
            <span className="type-display tabular-nums">{money(balance)}</span>
            <span className="flex items-center gap-1.5 type-body-sm opacity-90"><TrendingUpIcon className="size-4" aria-hidden="true" />Up 2.4% on last month</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => go("transactions")}>See transactions<ArrowRightIcon /></Button>
            <Button variant="secondary" onClick={() => go("goals")}>Goals</Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Kpi label="Income" value={money(income)} note="Salary and one invoice" />
          <Kpi label="Spent" value={money(spent)} note={`${Math.round((spent / income) * 100)}% of income`} />
          <Kpi label="Left to spend" value={money(left)} note={`${money(saved)} already saved`} />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        <Section title="Spending history" text="The last six months, without savings." className="2xl:col-span-2">
          <ChartContainer config={monthlyConfig} className="aspect-auto h-56 w-full" aria-label="Spent per month">
            <BarChart accessibilityLayer data={months} margin={{ top: 4 }}>
              <defs>
                {/* One fill for every bar: the scale's darkest step at the top, fading to a light one at the base.
                    The stops are chart roles, so the gradient follows the brand and flips with the scale in dark mode. */}
                <linearGradient id="spent-bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: seq(7) }} />
                  <stop offset="100%" style={{ stopColor: seq(3) }} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="total" fill="url(#spent-bar)" shape={barShape} />
            </BarChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Average" value={money(Math.round((months.reduce((s, m) => s + m.total, 0) / months.length) * 100))} note="a month, since May" />
            <Stat label="This month" value={months[5].total < months[4].total ? "Below average" : "Above average"} note={`${money(Math.abs(months[5].total - months[4].total) * 100)} ${months[5].total < months[4].total ? "less" : "more"} than September`} />
          </div>
        </Section>

        <Section title="Where it went" text="This month, by category.">
          <div className="flex flex-wrap items-center gap-4">
            <ChartContainer config={shareConfig} className="aspect-square w-40 flex-none sm:w-44" aria-label="Spending by category">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
                <Pie data={slices} dataKey="value" nameKey="category" innerRadius="58%" outerRadius="96%" strokeWidth={3}>
                  {slices.map((s) => <Cell key={s.category} fill={s.fill} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="grid min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2" aria-label="Spending by category, as a list">
              {slices.map((s) => (
                <li key={s.category} className="flex items-center gap-2 type-body-sm">
                  <span aria-hidden="true" className="size-2.5 flex-none rounded-full" style={{ background: s.fill }} />
                  <span className="min-w-0 flex-1 truncate">{s.category}</span>
                  <span className="tabular-nums text-muted-foreground">{money(s.value * 100)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="Recent transactions" text="The last five." action={<Button variant="ghost" size="sm" onClick={() => go("transactions")}>All<ArrowRightIcon /></Button>}>
          <div className="flex flex-col gap-1">
            {recent.map((t) => (
              <Item key={t.id} size="sm">
                <ItemMedia variant="icon"><ReceiptIcon /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{t.merchant}</ItemTitle>
                  <ItemDescription>{shortDate(t.date)} · {t.category}{t.status === "pending" ? " · pending" : ""}</ItemDescription>
                </ItemContent>
                <ItemActions><span className={`type-label-md tabular-nums ${t.amount > 0 ? "text-success" : ""}`}>{money(t.amount, true)}</span></ItemActions>
              </Item>
            ))}
          </div>
        </Section>

        <Section title="Upcoming bills" text={`${bills.length} in the next five weeks · ${money(bills.reduce((s, b) => s + b.amount, 0))}`}>
          <div className="flex flex-col gap-1">
            {bills.map((b) => (
              <Item key={b.name} size="sm" variant="muted">
                <ItemMedia variant="icon"><CalendarClockIcon /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{b.name}</ItemTitle>
                  <ItemDescription>Due {shortDate(b.due)}</ItemDescription>
                </ItemContent>
                <ItemActions className="items-center gap-2">
                  {b.auto ? <Badge variant="secondary">Auto-pay</Badge> : <Badge variant="warning">Pay by hand</Badge>}
                  <span className="type-label-md tabular-nums">{money(b.amount)}</span>
                </ItemActions>
              </Item>
            ))}
          </div>
        </Section>

        <Section title="Savings goals" text="Three goals, all on track." action={<Button variant="ghost" size="sm" onClick={() => go("goals")}>All goals<ArrowRightIcon /></Button>}>
          <div className="flex flex-col gap-4">
            {goals.map((g) => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <div key={g.id} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2"><span className="type-label-md">{g.name}</span><span className="type-body-sm text-muted-foreground tabular-nums">{money(g.saved)} of {money(g.target)}</span></div>
                  <Progress value={pct} aria-label={`${g.name}: ${pct}% saved`} />
                </div>
              );
            })}
          </div>
          <p className="type-body-sm text-muted-foreground">{money(saved)} went to savings this month.</p>
        </Section>

        <Section title="Subscriptions" text={`${subscriptions.length} active · ${money(subscriptions.reduce((s, x) => s + x.price, 0))} a month`}>
          <div className="flex flex-col gap-1">
            {subscriptions.map((s) => (
              <Item key={s.name} size="sm">
                <ItemMedia variant="icon"><RepeatIcon /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{s.name}</ItemTitle>
                  <ItemDescription>{s.note} · {money(s.price)}</ItemDescription>
                </ItemContent>
                <ItemActions aria-label={`${s.name}, the last four months`} className="h-6 items-end gap-1">
                  {s.months.map((m, i) => <span key={i} className="w-2 rounded-xs" style={{ height: `${m}%`, background: seq(i + 3) }} />)}
                </ItemActions>
              </Item>
            ))}
          </div>
          <Badge variant="outline" className="self-start">Reviewed in October</Badge>
        </Section>
      </div>
    </div>
  );
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Panel className="flex flex-col gap-1 p-4">
      <span className="type-label-sm text-muted-foreground uppercase">{label}</span>
      <span className="type-heading-md tabular-nums">{value}</span>
      <span className="type-body-sm text-muted-foreground">{note}</span>
    </Panel>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-small bg-muted/50 p-3">
      <span className="type-label-sm text-muted-foreground uppercase">{label}</span>
      <span className="type-heading-sm">{value}</span>
      <span className="type-body-sm text-muted-foreground">{note}</span>
    </div>
  );
}
