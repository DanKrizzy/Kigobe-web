import { useState } from "react";
import { HandCoins, Save, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState } from "@/admin/components/AdminUI";
import { useDonationSettings, useDonationRecords } from "@/admin/stores/adminDataStore";
import type { DonationProvider, DonationSettings } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const providers: { key: keyof DonationSettings; label: string; network: string }[] = [
  { key: "lumicash", label: "Lumicash", network: "Lumitel" },
  { key: "ecocash", label: "Ecocash", network: "Econet Leo" },
];

export default function AdminDonation() {
  const { donation, saveDonation } = useDonationSettings();
  const records = useDonationRecords();
  const [draft, setDraft] = useState<DonationSettings>(donation);

  const updateProvider = (key: keyof DonationSettings, patch: Partial<DonationProvider>) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const handleSave = () => {
    saveDonation(draft);
    toast.success("Donation settings saved");
  };

  return (
    <div>
      <PageHeader
        title="Donation"
        description="Manage mobile money accounts and review recorded donations."
        actions={
          <Button onClick={handleSave} className="gradient-primary gap-1.5">
            <Save className="w-4 h-4" /> Save settings
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {providers.map((provider) => (
          <Card key={provider.key}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" /> {provider.label}
                <span className="text-xs font-normal text-muted-foreground">({provider.network})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Pay-to number">
                <Input
                  value={draft[provider.key].payTo}
                  onChange={(e) => updateProvider(provider.key, { payTo: e.target.value })}
                  placeholder="+257 ..."
                />
              </Field>
              <Field label="Account name">
                <Input
                  value={draft[provider.key].accountName}
                  onChange={(e) => updateProvider(provider.key, { accountName: e.target.value })}
                />
              </Field>
              <Field label="Instructions">
                <Textarea
                  value={draft[provider.key].instructions}
                  onChange={(e) => updateProvider(provider.key, { instructions: e.target.value })}
                  rows={3}
                />
              </Field>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HandCoins className="w-4 h-4 text-primary" /> Recorded donations ({records.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.items.length === 0 ? (
            <EmptyState
              icon={<HandCoins className="w-6 h-6" />}
              title="No donations recorded"
              description="Donations submitted through the website will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.items.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">{record.reference}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{record.name}</div>
                        <div className="text-xs text-muted-foreground">{record.email}</div>
                      </TableCell>
                      <TableCell className="capitalize">{record.type}</TableCell>
                      <TableCell className="capitalize">{record.provider}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {Number(record.amount).toLocaleString()} BIF
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete donation record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the record from this browser. It cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  records.remove(record.id);
                                  toast.success("Record deleted");
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
