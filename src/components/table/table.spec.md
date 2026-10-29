# Table

## Parts
- Table: a scrolling container (horizontal overflow) around a `<table>`
- TableHeader (`<thead>`), muted background
- TableBody (`<tbody>`)
- TableFooter (`<tfoot>`), for totals
- TableRow (`<tr>`), with a bottom border; body rows get a hover background
- TableHead (`<th>`), column title
- TableCell (`<td>`)
- TableCaption (`<caption>`), below the table

## States
Row: default, hover (body rows only), selected (`data-state="selected"`, same background as hover).

## Props
Every part takes the props of its HTML element plus `className`. Alignment is the caller's: numbers get
`className="text-right"` on both the TableHead and the TableCell. Figures are tabular so amounts line up.

## Tokens
table-border; table-header-background, table-header-foreground; table-row-foreground, table-row-background-hover;
table-footer-background, table-footer-foreground; table-caption-foreground; text: table-head-font (label.md),
table-cell-font (body.md), table-footer-font (label.md), table-caption-font (body.sm).

## Accessibility
Native table semantics: `<th>` cells are column headers (`scope="col"` by default), so screen readers announce the
column with each cell. TableCaption names the table. Hover is decoration only; rows are not focusable unless the caller
puts a link or button in a cell.
