# Budgeting app

A mobile budgeting app for young professionals. It should feel like a friend who is good with money: upbeat, easy to read at a glance, and never judging how you spend.

## Overview

- Friendly, not preachy: the app shows where money goes and what is left; it does not scold.
- Glanceable: the most important number on each screen (left to spend, this month's total) is big and comes first.
- Calm by default: color marks actions and real status, not every number.
- Built for one hand on a phone: big tap targets, main actions within thumb reach.

## Colors

- primary (bright blue): the main action on a screen, such as Add expense or Save budget. One per screen. Also used for links, the selected tab and focus rings.
- background, card: white in light mode, deep slate in dark mode. Cards group a budget, an account or a list of transactions.
- muted / muted-foreground: secondary surfaces and supporting text such as dates, categories and notes.
- secondary, accent: soft slate fills for secondary buttons, chips and selected filters.
- destructive: deleting things for good and errors only. Never use it to show overspending or a negative balance.
- warning: a gentle heads-up, such as a budget almost used up. Use it sparingly and always with words that say what to do.
- success: goals reached and bills paid. Pair it with an icon and text.
- info: neutral notices. Info is a blue close to the primary, so always pair it with an icon and text, and never use it for something tappable.
- Charts use the chart colors in their order: blue first, then the other series colors. Spending over a limit is shown with a label or a marker, not by turning the chart red.

## Typography

- Nunito for everything. Its rounded shapes carry the friendly feel; hierarchy comes from size and weight.
- Display style for the one big number on a screen (left to spend, balance) and for screen titles.
- Heading styles for section and card titles; body styles for lists, descriptions and fields. On phones, prefer the larger body size for reading text.
- Amounts use tabular figures so columns line up. Positive and negative amounts differ by sign and label, not only by color.
- No all-caps headings.

## Shape and depth

- Corners are pill-shaped for controls: buttons, inputs, chips and badges are fully rounded. This is a big part of the friendly feel.
- Cards, sheets and dialogs use the large container radius, not full pills.
- Parts inside a rounded container (tabs in a tab bar, options in a menu) follow the container's corners minus the gap.
- Light shadows only: a faint one for cards, a stronger one for things that float (sheets, dialogs, toasts).

## Layout

- Mobile first: one column, generous spacing, a bottom tab bar for the main sections.
- Tap targets at least 44 by 44 points; the main action sits low on the screen, in thumb reach.
- Each screen opens with its key number, then the details (categories, transactions).
- Keep forms short: adding an expense should take a few taps.

## Components

- Buttons: primary for the single main action; outline or ghost for the rest (Edit, See all).
- Badges: categories and small facts (Recurring, Shared). Neutral by default; status colors only for real status (Paid, Almost used up).
- Toasts: short confirmations with an undo where it helps (Expense added. Undo).
- Alerts: inline, for things that need attention, written as a suggestion, not a warning.
- Dialogs: only for decisions that need focus, such as deleting a budget.
- Switches for settings that apply at once; checkboxes for choices in a form.

## Do's and Don'ts

- Do celebrate progress in small ways: a goal reached, a month under budget.
- Do make it easy to fix mistakes: undo, edit, move a transaction.
- Don't paint overspending red or use alarm icons for normal spending.
- Don't show more than one key number in display size per screen.
- Don't hide important amounts behind color alone.
