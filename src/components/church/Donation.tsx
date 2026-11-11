import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Copy, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MOBILE_MONEY_PROVIDERS, type MobileMoneyProvider } from "@/config/mobileMoney";
import { useSiteDonation } from "@/hooks/useSiteContent";
import { STORAGE_KEYS, generateId, getDonationRecords, writeStore } from "@/data/siteData";

const donationSchema = z.object({
  type: z.enum(["tithe", "offering", "donation"]),
  paymentMethod: z.enum(["lumicash", "ecocash"]),
  amount: z.number().min(1, "Amount must be at least 1"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  transactionId: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

const quickAmounts = [5000, 10000, 25000, 50000, 100000];

export default function Donation() {
  const { t } = useTranslation();
  const donationSettings = useSiteDonation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<"tithe" | "offering" | "donation">("donation");
  const [paymentMethod, setPaymentMethod] = useState<MobileMoneyProvider>("lumicash");
  const [savedReference, setSavedReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      type: "donation",
      paymentMethod: "lumicash",
      amount: 0,
      name: "",
      email: "",
      phone: "",
      message: "",
      transactionId: "",
    },
  });

  const amount = watch("amount");
  const provider = {
    ...MOBILE_MONEY_PROVIDERS[paymentMethod],
    ...donationSettings[paymentMethod],
  };

  const reference = useMemo(() => {
    if (savedReference) return savedReference;
    return `MK-${selectedType.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  }, [savedReference, selectedType]);

  const copyToClipboard = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(successMessage);
    } catch {
      toast.error(t("donation.copyFailed"));
    }
  };

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true);
    try {
      setSavedReference(reference);
      const records = getDonationRecords();
      writeStore(STORAGE_KEYS.donations, [
        {
          id: generateId("don"),
          reference,
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() ?? "",
          type: data.type,
          amount: Number(data.amount) || 0,
          provider: data.paymentMethod,
          transactionId: data.transactionId?.trim() ?? "",
          message: data.message?.trim() ?? "",
          createdAt: new Date().toISOString(),
        },
        ...records,
      ]);
      toast.success(t("donation.instructionsReady"));
    } catch (error) {
      toast.error(t("donation.error"));
      // eslint-disable-next-line no-console
      console.error("Donation submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuickAmount = (value: number) => {
    setValue("amount", value, { shouldValidate: true });
  };

  return (
    <section id="donate" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">{t("donation.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("donation.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("donation.title")}</CardTitle>
            <CardDescription>{t("donation.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Donation Type */}
              <Tabs
                value={selectedType}
                onValueChange={(v) => {
                  setSelectedType(v as "tithe" | "offering" | "donation");
                  setValue("type", v as "tithe" | "offering" | "donation");
                  setSavedReference(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tithe">{t("donation.tithe")}</TabsTrigger>
                  <TabsTrigger value="offering">{t("donation.offering")}</TabsTrigger>
                  <TabsTrigger value="donation">{t("donation.donation")}</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>{t("donation.paymentMethod")}</Label>
                <Tabs
                  value={paymentMethod}
                  onValueChange={(v) => {
                    setPaymentMethod(v as MobileMoneyProvider);
                    setValue("paymentMethod", v as MobileMoneyProvider);
                    setSavedReference(null);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="lumicash">{t("donation.lumicash")}</TabsTrigger>
                    <TabsTrigger value="ecocash">{t("donation.ecocash")}</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-sm text-muted-foreground">
                  {t("donation.payVia", { method: provider.displayName, network: provider.networkName })}
                </p>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">{t("donation.amount")} (BIF)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={t("donation.enterAmount")}
                  {...register("amount", { valueAsNumber: true })}
                  className={errors.amount ? "border-destructive" : ""}
                />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}

                <div className="flex flex-wrap gap-2 mt-3">
                  {quickAmounts.map((amt) => (
                    <Button
                      key={amt}
                      type="button"
                      variant={amount === amt ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuickAmount(amt)}
                    >
                      {amt.toLocaleString()} BIF
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mobile Money Instructions */}
              <div className="rounded-lg border bg-card p-4 space-y-3">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {t("donation.sendTo")} {provider.displayName} ({provider.networkName})
                  </p>
                  {provider.accountName ? (
                    <p className="text-sm text-muted-foreground">
                      {t("donation.accountName")}: {provider.accountName}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{t("donation.numberToPay")}</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm">{provider.payTo}</code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(provider.payTo, t("donation.copiedNumber"))}
                        aria-label={t("donation.copy")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{t("donation.reference")}</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm">{reference}</code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(reference, t("donation.copiedReference"))}
                        aria-label={t("donation.copy")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{provider.instructions ?? t("donation.defaultInstructions")}</p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t("donation.name")}</Label>
                <Input
                  id="name"
                  placeholder={t("donation.enterName")}
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("donation.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("donation.enterEmail")}
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t("donation.phone")}</Label>
                <Input id="phone" type="tel" placeholder={t("donation.enterPhone")} {...register("phone")} />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">{t("donation.message")}</Label>
                <Textarea id="message" placeholder={t("donation.enterMessage")} rows={4} {...register("message")} />
              </div>

              {/* Transaction ID (optional) */}
              <div className="space-y-2">
                <Label htmlFor="transactionId">{t("donation.transactionId")}</Label>
                <Input id="transactionId" placeholder={t("donation.enterTransactionId")} {...register("transactionId")} />
                <p className="text-sm text-muted-foreground">{t("donation.transactionIdHelp")}</p>
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("donation.processing")}
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    {t("donation.donateNow")}
                  </>
                )}
              </Button>

              {savedReference ? (
                <div className="rounded-lg bg-muted p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{t("donation.savedTitle")}</p>
                    <p className="text-sm text-muted-foreground">{t("donation.savedBody", { reference: savedReference })}</p>
                  </div>
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
