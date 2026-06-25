"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Banknote,
  Hash,
  Building2,
  CheckCircle2,
  Pencil,
  Plus,
  CreditCard,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import AccountSkeleton from "@/components/profile/AccountSkeleton";
import { bankService, VendorBankAccount } from "@/app/services/bank.service";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import axiosInstance from "@/lib/axios";

interface BankOption {
  name: string;
  code: string;
}

interface AccountFormState extends VendorBankAccount {
  accountName: string;
  status: string;
  accountNumberLast4?: string;
}

interface ModalFormState {
  bankName: string;
  accountNumber: number;
  bankCode: string;
  currency: string;
  accountName: string;
}

const AccountPage = () => {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedAccount, setHasSavedAccount] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Display state — only updates after successful save
  const [formData, setFormData] = useState<AccountFormState>({
    bankName: "",
    accountNumber: 0,
    bankCode: "",
    currency: "NGN",
    accountName: "",
    status: "Not configured",
    accountNumberLast4: "",
  });

  // Modal state — only updates while typing in modal
  const [modalData, setModalData] = useState<ModalFormState>({
    bankName: "",
    accountNumber: 0,
    bankCode: "",
    currency: "NGN",
    accountName: "",
  });

  const loadBankData = useCallback(async () => {
    setIsLoadingData(true);

    // fetch all banks from backend
    try {
      let allBanks: BankOption[] = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await axiosInstance.get(
          `/vendor-bank-accounts/banks?page=${page}&limit=100`
        );
        const { data, pagination } = response.data;

        const normalized = data.map((b: any) => ({
          name: b.name,
          code: b.code,
        }));

        allBanks = [...allBanks, ...normalized];
        hasNextPage = pagination.hasNextPage;
        page++;
      }

      setBanks(allBanks);
    } catch (error: any) {
      toast.error("Unable to load supported banks. Please try again.");
    }

    // fetch saved bank account
    try {
      const accountData = await bankService.getMyBankAccount();
      setFormData({
        bankName: accountData.bankName || "",
        bankCode: accountData.bankCode || "",
        accountNumber: accountData.accountNumber || 0,
        currency: accountData.currency || "NGN",
        accountName:
          (accountData as any).accountName || profile?.fullName || "",
        status: (accountData as any).status || "Active",
        accountNumberLast4:
          (accountData as any).accountNumberLast4 ||
          (accountData.accountNumber
            ? String(accountData.accountNumber).slice(-4)
            : ""),
      });
      setHasSavedAccount(true);
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load your bank account details."
        );
      } else {
        setHasSavedAccount(false);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [profile]);

  useEffect(() => {
    loadBankData();
  }, [loadBankData]);

  const handleModalChange = useCallback(
    (field: keyof ModalFormState, value: string | number) => {
      setModalData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleBankNameChange = (value: string) => {
    const match = banks.find(
      (b) => b.name.toLowerCase() === value.toLowerCase()
    );
    setModalData((prev) => ({
      ...prev,
      bankName: value,
      bankCode: match ? match.code : "",
    }));
  };

  const openAddModal = () => {
    setModalData({
      bankName: "",
      accountNumber: 0,
      bankCode: "",
      currency: "NGN",
      accountName: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    setModalData({
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      bankCode: formData.bankCode,
      currency: formData.currency,
      accountName: formData.accountName,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!modalData.bankName || !modalData.accountNumber) {
      toast.error("Please fill in bank name and account number.");
      return;
    }
    if (!modalData.bankCode) {
      toast.error(
        "Please select a valid bank from the list to get the bank code."
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        bankName: modalData.bankName,
        bankCode: modalData.bankCode,
        accountNumber: modalData.accountNumber,
        currency: modalData.currency,
      };

      await bankService.saveMyBankAccount(payload);
      toast.success("Bank account details saved successfully.");

      // only update display data after successful save
      setFormData((prev) => ({
        ...prev,
        bankName: modalData.bankName,
        bankCode: modalData.bankCode,
        accountNumber: modalData.accountNumber,
        currency: modalData.currency,
        accountName: modalData.accountName,
        status: "Active",
        accountNumberLast4: String(modalData.accountNumber).slice(-4),
      }));

      setHasSavedAccount(true);
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to save bank account details. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isProfileLoading || isLoadingData) {
    return <AccountSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              We could not load your account. Please login again or refresh the
              page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bank Account Details</h1>
            <p className="text-muted-foreground mt-1">
              Add or update your bank payout account for vendor settlements.
            </p>
          </div>
          {hasSavedAccount && (
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit Bank Details
            </button>
          )}
        </div>

        {/* State 1 — No bank account saved */}
        {!hasSavedAccount && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No bank account added yet
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mb-6">
                Upload your account details to receive payments from your
                customers directly to your bank.
              </p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Bank Account
              </button>
            </CardContent>
          </Card>
        )}

        {/* State 2 — Bank account saved */}
        {hasSavedAccount && (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Payout account configured
                  </p>
                  <p className="text-xs text-gray-500">
                    Your bank details are saved and active
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> Bank Name
                  </p>
                  <p className="font-semibold text-gray-800">
                    {formData.bankName || "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5" /> Account Number
                  </p>
                  <p className="font-semibold text-gray-800">
                    {formData.accountNumberLast4
                      ? `********${formData.accountNumberLast4}`
                      : "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5" /> Account Name
                  </p>
                  <p className="font-semibold text-gray-800">
                    {formData.accountName || "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5" /> Bank Code
                  </p>
                  <p className="font-semibold text-gray-800">
                    {formData.bankCode || "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5" /> Currency
                  </p>
                  <p className="font-semibold text-gray-800">
                    {formData.currency || "NGN"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Status
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {formData.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={hasSavedAccount ? "Edit bank details" : "Add bank account"}
          subtitle="Enter your bank account information for payouts"
        >
          <div className="flex flex-col gap-4">

            {/* Bank Name with datalist from backend */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Bank Name
              </label>
              <div className="rounded-xl border border-black/10 bg-white/70 px-3.5 py-2.5">
                <input
                  type="text"
                  value={modalData.bankName}
                  onChange={(e) => handleBankNameChange(e.target.value)}
                  placeholder="Type to search your bank"
                  className="w-full bg-transparent border-none text-gray-800 text-sm placeholder:text-gray-400 outline-none"
                  list="bank-list"
                />
                <datalist id="bank-list">
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.name} />
                  ))}
                </datalist>
              </div>
              {modalData.bankCode && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Bank code auto-filled: {modalData.bankCode}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Account Number
              </label>
              <div className="rounded-xl border border-black/10 bg-white/70 px-3.5 py-2.5">
                <input
                  type="number"
                  value={modalData.accountNumber || ""}
                  onChange={(e) =>
                    handleModalChange("accountNumber", parseInt(e.target.value))
                  }
                  placeholder="Enter your 10-digit account number"
                  className="w-full bg-transparent border-none text-gray-800 text-sm placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Account Name
              </label>
              <div className="rounded-xl border border-black/10 bg-white/70 px-3.5 py-2.5">
                <input
                  type="text"
                  value={modalData.accountName}
                  onChange={(e) =>
                    handleModalChange("accountName", e.target.value)
                  }
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent border-none text-gray-800 text-sm placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Bank Code — auto filled, read only */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Bank Code
              </label>
              <div className="rounded-xl border border-black/10 bg-gray-50 px-3.5 py-2.5">
                <input
                  type="text"
                  value={modalData.bankCode}
                  readOnly
                  placeholder="Auto-filled when bank is selected"
                  className="w-full bg-transparent border-none text-gray-500 text-sm placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Currency
              </label>
              <div className="rounded-xl border border-black/10 bg-white/70 px-3.5 py-2.5">
                <input
                  type="text"
                  value={modalData.currency}
                  onChange={(e) =>
                    handleModalChange("currency", e.target.value)
                  }
                  placeholder="e.g. NGN"
                  className="w-full bg-transparent border-none text-gray-800 text-sm placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 rounded-xl font-medium text-gray-700 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Bank Details"}
            </button>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default AccountPage;