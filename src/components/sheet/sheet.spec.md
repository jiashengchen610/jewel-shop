# Sheet

## Parts
- Sheet (Radix Dialog root)
- SheetTrigger
- SheetOverlay (backdrop)
- SheetContent (role dialog, portal): a full-height panel at the left or right edge, with a close button (x icon)
- SheetHeader, SheetTitle, SheetDescription, SheetFooter (pinned to the bottom), SheetClose

## States
Closed, open, opening (slides in from its side), closing (slides out).

## Props
Radix Dialog props on Sheet: `open`, `defaultOpen`, `onOpenChange`, `modal`. SheetContent: `side` (`"left"` |
`"right"`, default `"right"`), `showCloseButton` (boolean, default true).

## Tokens
sheet-overlay; sheet-content-background, -foreground, -border; sheet-description-foreground; sheet-shadow;
sheet-close-radius; text: sheet-title-font (heading.md), sheet-description-font (body.md); layer-dialog;
duration-slow (open), duration-normal (close); ease-enter.

## Accessibility
Same as Dialog: focus moves into the panel and stays there; Escape, the close button and a click on the overlay close
it; focus returns to the trigger. Labelled by SheetTitle, described by SheetDescription. The close button is named
"Close". An icon-only trigger needs an `aria-label` ("Open menu").
