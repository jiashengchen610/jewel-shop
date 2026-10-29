# Household budget dashboard

A budgeting dashboard for households: income, bills, savings goals and spending limits in one place. It should feel clear and calm: a tidy kitchen table where the month's money is laid out plainly, so anyone in the household can see where things stand in a few seconds.

## Overview

- Clear: every screen answers one question first (How much is left this month? What's due next?), in a big number or a short sentence.
- Calm: a quiet, mostly ink-and-white look. Color appears only where it means something: an action, a status, a chart series.
- Soft, friendly shapes: fully rounded buttons and fields, generously rounded cards. Nothing sharp or crowded.
- Shared: written and laid out so every member of the household understands it, not only the person who set it up.

## Colors

- primary (deep ink, nearly black with a hint of navy; light gray in dark mode): the main action on a view, such as Add bill or Save goal. One per view. The look relies on this ink against white instead of a bright brand color.
- background, card: white in light mode, near-black in dark mode. Cards hold one topic each: income, bills, a goal, a limit.
- muted / muted-foreground: secondary surfaces and supporting text such as dates, categories and who paid.
- secondary, accent: soft gray fills for secondary buttons, selected filters, hovered rows and tab bars.
- destructive: deleting things for good and errors only. Never use it for being over a limit or a negative balance.
- warning: a limit almost reached or a bill due soon. Always with words that say what to do.
- success: a goal reached, a bill paid. Always with an icon or text.
- info: neutral notices, such as a sync in progress.
- Charts carry most of the color. Use the chart colors in order (blue first); keep the same category in the same color on every chart. Use the one-hue scale for low-to-high values and the two-sided scale for above or below a limit.

## Typography

- Inter for everything: headings, text, buttons and labels. Hierarchy comes from size and weight, not from extra fonts or colors.
- Display style for the one key number on a page (left to spend, total saved) and for page titles.
- Heading styles for section, dialog and card titles; body styles for tables, lists, descriptions and fields; label styles for buttons, tabs and badges.
- Amounts use tabular figures so columns line up, and are right-aligned in tables. Positive and negative amounts differ by sign and label, not only by color.
- No all-caps headings.

## Shape and depth

- Controls are pill-shaped: buttons, fields, chips and badges are fully rounded.
- Cards, panels and dialogs use the large container radius: soft, generous corners.
- Small marks (checkboxes, tooltips) use the small radius.
- Parts inside a rounded container (tabs in a tab bar, options in a menu) follow the container's corners minus the gap, so the space between stays even.
- Depth is quiet: a faint shadow for cards, a stronger one only for things that float (menus, dialogs, toasts).

## Layout

- A dashboard grid of cards on wide screens; one column on narrow ones. The most important card (this month's summary) sits top left.
- Generous spacing between cards; tighter, consistent spacing inside them.
- Each card shows a headline number, then the detail, then at most one action.
- Tables for transactions and bills: few columns, clear headers, amounts on the right.
- Progress bars for limits and goals, always with the numbers next to them ("$320 of $500").
- Body text stays under 75 characters per line.

## Components

- Buttons: primary for the single main action; outline or ghost for the rest (Edit, See all). Button groups for related choices such as a month switcher.
- Badges: categories and small facts (Recurring, Shared, Paid). Neutral by default; status colors only for real status.
- Progress: spending limits and savings goals. Pair with the amount and what's left.
- Charts: one question per chart, with an accessible label and a legend or labeled series.
- Empty states: say what will appear here and offer one action (Add your first bill).
- Toasts: short confirmations, with undo where it helps (Bill deleted. Undo).
- Alerts: inline, for things that need attention, written as helpful facts.
- Dialogs and alert dialogs: only for decisions that need focus, such as deleting a goal.

## Do's and Don'ts

- Do lead with the answer, then the detail.
- Do keep the same category in the same color everywhere.
- Do make mistakes easy to fix: undo, edit, move a transaction.
- Don't paint over-limit spending red or use alarm icons for ordinary spending.
- Don't add a bright brand color to decorate; ink, white and the chart colors are enough.
- Don't show more than one display-size number per card.
- Don't hide meaning in color alone.
