import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Badge } from "@/components/badge/badge";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/table/table";

/**
 * Rows of data compared across columns: transactions, bills, payments. Compact rows, a muted header and a hover
 * background on body rows. Right-align amounts (text-right on the head and the cells) and put totals in the footer.
 * For a list of things with an icon, a description and an action, use Item instead.
 */
const meta = {
  title: "Components/Data display/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const transactions = [
  { date: "Oct 24", description: "Corner Market", category: "Groceries", amount: "-$86.40" },
  { date: "Oct 23", description: "City Power & Light", category: "Bills", amount: "-$112.00" },
  { date: "Oct 22", description: "Salary, Northwind Ltd", category: "Income", amount: "+$3,250.00" },
  { date: "Oct 21", description: "Transfer to Holiday fund", category: "Savings", amount: "-$200.00" },
  { date: "Oct 20", description: "Green Leaf Cafe", category: "Eating out", amount: "-$24.50" },
];

function Transactions({ withFooter = false }: { withFooter?: boolean }) {
  return (
    <Table className="min-w-xl">
      <TableCaption>Transactions from October 20 to 24.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.description}>
            <TableCell>{t.date}</TableCell>
            <TableCell>{t.description}</TableCell>
            <TableCell>
              <Badge variant="secondary">{t.category}</Badge>
            </TableCell>
            <TableCell className="text-right">{t.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {withFooter && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Net for these days</TableCell>
            <TableCell className="text-right">+$2,827.10</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

/** A few transactions: date, description, category and a right-aligned amount. */
export const Default: Story = { render: () => <Transactions /> };

/** With a footer row for the total. */
export const WithFooter: Story = { render: () => <Transactions withFooter /> };

/** Checks that the column headers and the caption are announced. Hidden from the manifest. */
export const Semantics: Story = {
  tags: ["!manifest"],
  render: () => <Transactions withFooter />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole("table", { name: "Transactions from October 20 to 24." });
    await expect(within(table).getAllByRole("columnheader")).toHaveLength(4);
    await expect(within(table).getByRole("cell", { name: "+$2,827.10" })).toBeInTheDocument();
  },
};
