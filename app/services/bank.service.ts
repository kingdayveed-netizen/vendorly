import axiosInstance from "@/lib/axios";

export interface BankOption {
  name: string;
  code: string;
  shortCode?: string;
}

export interface VendorBankAccount {
  bankName: string;
  accountNumber: number;
  bankCode: string;
  currency: string;
}

export const bankService = {
  getBanks: async (): Promise<BankOption[]> => {
    const response = await axiosInstance.get<{
      data: BankOption[];
    }>("/vendor-bank-accounts/banks");
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  },

  getMyBankAccount: async (): Promise<VendorBankAccount> => {
    const response = await axiosInstance.get<
      VendorBankAccount | { data: VendorBankAccount }
    >("/vendor-bank-accounts/me");
    return (response.data as any).data || response.data;
  },

  saveMyBankAccount: async (
    data: VendorBankAccount,
  ): Promise<VendorBankAccount> => {
    const response = await axiosInstance.post<VendorBankAccount>(
      "/vendor-bank-accounts/me",
      data,
    );
    return response.data;
  },
};
