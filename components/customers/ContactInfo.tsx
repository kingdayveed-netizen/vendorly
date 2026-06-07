"use client";

import { AtSign, Smartphone, MapPin as MapPinIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface ContactInfoProps {
  email?: string;
  phone?: string;
  address?: string;
}

export const ContactInfo = ({ email, phone, address }: ContactInfoProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <AtSign className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">{email || "—"}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Smartphone className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium">{phone || "—"}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm font-medium">{address || "No address provided"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};