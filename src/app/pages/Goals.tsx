// Goals: a card per goal with how far along it is and what it takes per month, and a dialog to start a new one.
import { useState } from "react";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/dialog/dialog";
import { Input } from "@/components/input/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/input-group/input-group";
import { Label } from "@/components/label/label";
import { Progress } from "@/components/progress/progress";
import { Slider } from "@/components/slider/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { InfoIcon, PlusIcon } from "@/icons";
import * as icons from "@/icons";
import { Section, type PageProps } from "../Dashboard";
import { goals, money } from "../data";

export function Goals({ notify }: PageProps) {
  const total = goals.reduce((s, g) => s + g.saved, 0);
  const target = goals.reduce((s, g) => s + g.target, 0);
  const monthly = goals.reduce((s, g) => s + g.monthly, 0);
  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Saving in total" className="grid gap-3 rounded-card bg-gradient-surface p-5 ring-1 ring-border sm:grid-cols-3 sm:p-6">
        <Figure label="Saved so far" value={money(total)} note={`${Math.round((total / target) * 100)}% of ${money(target)}`} />
        <Figure label="Put aside each month" value={money(monthly)} note="Across three goals" />
        <Figure label="Next to finish" value="New laptop" note="March 2027, on track" />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="type-heading-sm">Your goals</h2>
        <NewGoal onSaved={(name) => notify({ title: "Goal added", text: `${name} is on the list. We will put the first amount aside on November 1.` })} />
      </div>

      <div className="grid items-start gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          const Icon = icons[g.icon];
          const monthsLeft = Math.ceil((g.target - g.saved) / g.monthly);
          return (
            <Section key={g.id} title={g.name} text={`By ${g.by}`} action={<span aria-hidden="true" className="grid size-10 place-items-center rounded-button bg-muted text-muted-foreground"><Icon className="size-5" /></span>}>
              <div className="flex flex-col gap-1">
                <span className="type-display tabular-nums">{money(g.saved)}</span>
                <span className="type-body-sm text-muted-foreground">of {money(g.target)}</span>
              </div>
              <Progress value={pct} aria-label={`${g.name}: ${pct}% saved`} />
              <div className="flex flex-wrap items-center justify-between gap-2 type-body-sm text-muted-foreground">
                <span>{pct}% saved</span>
                <span className="flex items-center gap-1">{money(g.monthly)} a month
                  <Tooltip>
                    <TooltipTrigger asChild><button type="button" aria-label={`How ${g.name} is paced`} className="grid size-6 place-items-center rounded-full outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"><InfoIcon className="size-4" /></button></TooltipTrigger>
                    <TooltipContent>{monthsLeft} more month{monthsLeft === 1 ? "" : "s"} at this pace, which lands {monthsLeft <= 12 ? "on time" : "late"}.</TooltipContent>
                  </Tooltip>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {pct >= 60 ? <Badge variant="success">Ahead</Badge> : <Badge variant="secondary">On track</Badge>}
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => notify({ title: `Added ${money(10000)} to ${g.name}`, text: "It leaves your current account tonight." })}>Add {money(10000)}</Button>
              </div>
            </Section>
          );
        })}
      </div>
    </div>
  );
}

function Figure({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex flex-col gap-1 text-gradient-surface-foreground">
      <span className="type-label-sm text-muted-foreground uppercase">{label}</span>
      <span className="type-heading-md tabular-nums">{value}</span>
      <span className="type-body-sm text-muted-foreground">{note}</span>
    </div>
  );
}

function NewGoal({ onSaved }: { onSaved: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(2400);
  const [months, setMonths] = useState([12]);
  const perMonth = Math.max(1, Math.round(amount / months[0]));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><PlusIcon />New goal</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set a savings goal</DialogTitle>
          <DialogDescription>Pick a target and how long you want to take; we work out the monthly amount.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); onSaved(name.trim() || "Your goal"); setName(""); }}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="goal-name">Goal</Label>
            <Input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="A new laptop, a trip…" autoFocus />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="goal-amount">Amount</Label>
            <InputGroup>
              <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
              <InputGroupInput id="goal-amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value.replace(/[^\d]/g, "")) || 0))} />
            </InputGroup>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between"><Label htmlFor="goal-months">How long</Label><span className="type-body-sm text-muted-foreground tabular-nums">{months[0]} month{months[0] === 1 ? "" : "s"}</span></div>
            <Slider id="goal-months" aria-label="How many months" min={1} max={36} step={1} value={months} onValueChange={setMonths} />
          </div>
          <p className="rounded-small bg-muted/50 p-3 type-body-md">That is <strong className="tabular-nums">{money(perMonth * 100)}</strong> a month, starting November 1.</p>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit">Start saving</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
