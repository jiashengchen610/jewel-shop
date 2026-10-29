// Settings: profile, what we tell you about, how the app looks, and the one thing that cannot be undone.
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/alert-dialog/alert-dialog";
import { Button } from "@/components/button/button";
import { Checkbox } from "@/components/checkbox/checkbox";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import { RadioGroup, RadioGroupItem } from "@/components/radio-group/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select/select";
import { Separator } from "@/components/separator/separator";
import { Switch } from "@/components/switch/switch";
import { Textarea } from "@/components/textarea/textarea";
import { Section, type PageProps } from "../Dashboard";

const ALERTS = [
  { id: "bills", label: "A bill is due in three days", text: "So nothing is paid late.", on: true },
  { id: "large", label: "A payment over $200", text: "The moment it happens.", on: true },
  { id: "goal", label: "A goal reaches a milestone", text: "Every 25%.", on: false },
  { id: "weekly", label: "A weekly summary", text: "Sunday evening.", on: true },
];

export function Settings({ notify, dark, onDark }: PageProps) {
  const [alerts, setAlerts] = useState(Object.fromEntries(ALERTS.map((a) => [a.id, a.on])));
  const [appearance, setAppearance] = useState<"light" | "dark">(dark ? "dark" : "light");
  const pick = (v: "light" | "dark") => { setAppearance(v); onDark(v === "dark"); };
  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Section title="Profile" text="How you appear, and where statements go.">
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); notify({ title: "Profile saved" }); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2"><Label htmlFor="name">Name</Label><Input id="name" defaultValue="Mira Chen" autoComplete="name" /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="mira@example.com" autoComplete="email" /></div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger id="currency" className="w-full sm:w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">US dollar (USD)</SelectItem>
                <SelectItem value="eur">Euro (EUR)</SelectItem>
                <SelectItem value="gbp">Pound sterling (GBP)</SelectItem>
                <SelectItem value="twd">New Taiwan dollar (TWD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2"><Label htmlFor="about">A note for your statements</Label><Textarea id="about" placeholder="Shown at the top of every PDF statement" rows={3} /></div>
          <div className="flex justify-end"><Button type="submit">Save changes</Button></div>
        </form>
      </Section>

      <Section title="Alerts" text="What we tell you about, by email and on your phone.">
        <div className="flex flex-col">
          {ALERTS.map((a, i) => (
            <div key={a.id}>
              <label htmlFor={`alert-${a.id}`} className="flex cursor-pointer items-center justify-between gap-4 py-3">
                <span className="flex flex-col gap-0.5"><span className="type-label-md">{a.label}</span><span className="type-body-sm text-muted-foreground">{a.text}</span></span>
                <Switch id={`alert-${a.id}`} checked={alerts[a.id]} onCheckedChange={(on) => setAlerts({ ...alerts, [a.id]: on })} />
              </label>
              {i < ALERTS.length - 1 && <Separator />}
            </div>
          ))}
        </div>
        <label className="flex items-start gap-3 rounded-small bg-muted/50 p-3 type-body-sm">
          <Checkbox id="digest" defaultChecked className="mt-0.5" />
          <span>Bundle alerts into one message a day when there are more than three.</span>
        </label>
      </Section>

      <Section title="Appearance" text="Light or dark; the colors are the same design system either way.">
        <RadioGroup value={appearance} onValueChange={(v) => pick(v as "light" | "dark")} aria-label="Appearance" className="grid gap-3 sm:grid-cols-2">
          {(["light", "dark"] as const).map((v) => (
            <label key={v} htmlFor={`look-${v}`} className={`flex cursor-pointer items-center gap-3 rounded-small border-2 p-3 ${appearance === v ? "border-foreground" : "border-border"}`}>
              <RadioGroupItem id={`look-${v}`} value={v} />
              <span className="flex flex-col gap-0.5"><span className="type-label-md">{v === "light" ? "Light" : "Dark"}</span><span className="type-body-sm text-muted-foreground">{v === "light" ? "Bright background, dark text." : "Dark background, light text; easier at night."}</span></span>
            </label>
          ))}
        </RadioGroup>
      </Section>

      <Section title="Close your account" text="Statements stay available for 90 days; everything else is deleted.">
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive" className="self-start">Close account</Button></AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Close your account?</AlertDialogTitle>
              <AlertDialogDescription>Your three savings goals and this month's transactions are deleted. This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my account</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => notify({ title: "Not today", text: "This is a demo: nothing was closed." })}>Close it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>
    </div>
  );
}
