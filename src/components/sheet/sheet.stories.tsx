import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "@/components/button/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/sheet/sheet";
import { LayoutDashboardIcon, MenuIcon, PiggyBankIcon, ReceiptIcon, SettingsIcon, WalletIcon } from "@/icons";

/**
 * A panel that slides in from the side of the screen over a dimmed page: the main navigation on small screens, or a
 * short side task such as filters. It closes with Escape, the close button or a tap on the overlay. For a decision
 * that needs an answer, use a Dialog; for a short message, a Toast.
 */
const meta = {
  title: "Components/Overlays/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  args: { onOpenChange: fn() },
  argTypes: { onOpenChange: { table: { disable: true } }, open: { control: "boolean" } },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const links = [
  { label: "Overview", icon: LayoutDashboardIcon },
  { label: "Bills", icon: ReceiptIcon },
  { label: "Spending limits", icon: WalletIcon },
  { label: "Savings goals", icon: PiggyBankIcon },
  { label: "Settings", icon: SettingsIcon },
];

function Navigation({ side }: { side?: "left" | "right" }) {
  return (
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription>The Rivera household</SheetDescription>
      </SheetHeader>
      <nav aria-label="Main" className="flex flex-col gap-1 px-4">
        {links.map(({ label, icon: Icon }) => (
          <SheetClose asChild key={label}>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="#">
                <Icon />
                {label}
              </a>
            </Button>
          </SheetClose>
        ))}
      </nav>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Sign out</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

/** Closed on load: the menu button opens the panel from the right. */
export const Default: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <Navigation />
    </Sheet>
  ),
};

/** From the left edge, closed on load. */
export const Left: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <Navigation side="left" />
    </Sheet>
  ),
};

/** Open from the start, to see the panel and its overlay. */
export const Open: Story = {
  args: { defaultOpen: true },
  render: Default.render,
};

/** Interaction test: open from the menu button, read the title, close with Escape. Hidden from the manifest. */
export const OpenAndEscape: Story = {
  tags: ["!manifest"],
  render: Default.render,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open menu" }));
    // It slides in, so check what it says rather than where it is yet.
    const sheet = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "Menu" });
    await expect(within(sheet).getByRole("navigation", { name: "Main" })).toHaveTextContent("Savings goals");
    await userEvent.keyboard("{Escape}");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};
