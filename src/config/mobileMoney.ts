export type MobileMoneyProvider = "lumicash" | "ecocash";

export type MobileMoneyProviderConfig = {
  provider: MobileMoneyProvider;
  displayName: string;
  networkName: string;
  /** Receiving phone/account number */
  payTo: string;
  /** Optional: human readable account name shown in wallet */
  accountName?: string;
  /** Optional: a short instruction string shown to users */
  instructions?: string;
};

/**
 * Update these details with your church's official Mobile Money accounts.
 * Keep values as plain text; they will be shown to donors and can be copied.
 */
export const MOBILE_MONEY_PROVIDERS: Record<MobileMoneyProvider, MobileMoneyProviderConfig> = {
  lumicash: {
    provider: "lumicash",
    displayName: "Lumicash",
    networkName: "Lumitel",
    payTo: "+257 00 000 000",
    accountName: "Minevam Kigobe Church",
    instructions: "Open Lumicash → Send Money → enter the number → enter amount → add the reference in message.",
  },
  ecocash: {
    provider: "ecocash",
    displayName: "Ecocash",
    networkName: "Econet Leo",
    payTo: "+257 00 000 000",
    accountName: "Minevam Kigobe Church",
    instructions: "Open Ecocash → Send Money → enter the number → enter amount → add the reference in message.",
  },
};

