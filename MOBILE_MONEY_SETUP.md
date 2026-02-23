# Mobile Money Donation Setup (Lumicash + Ecocash)

This project supports Mobile Money donations on the `/donate` page:

- **Lumicash** (Lumitel)
- **Ecocash** (Econet Leo)

## Configure church receiving numbers

Edit:

- `src/config/mobileMoney.ts`

Update the values for:

- `payTo`: the official receiving phone/account number
- `accountName` (optional): shown to donors
- `instructions` (optional): steps shown on the donation page

## How it works

1. Donor selects **Tithe / Offering / Donation**
2. Donor selects **Lumicash** or **Ecocash**
3. The page shows:
   - The **number to pay**
   - A generated **reference** to include in the Mobile Money message/description
4. Donor completes payment in their wallet app
5. Donor can optionally paste a **Transaction ID** (from SMS/app) to help matching

## Optional next step (recommended)

To fully “confirm” donations automatically, add a backend endpoint to store:

- donor details (name/email/phone)
- amount
- payment provider
- reference
- transaction id

Then the church admin team can reconcile transactions reliably.

