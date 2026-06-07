import { Badge } from "@/components/ui/badge";
import { Store, Award, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface ProfileInfoProps {
  fullName: string;
  storeName: string;
  email: string;
  phone: string;
  location?: string;
  createdAt: string;
  totalRevenue: number;
}

export const ProfileInfo = ({
  fullName,
  storeName,
  email,
  phone,
  location,
  createdAt,
  totalRevenue,
}: ProfileInfoProps) => {
  return (
    <div className="flex-1">
      {/* Name and Store Section */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
          {totalRevenue >= 1000000 && (
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700 px-3 py-1 text-xs font-medium"
            >
              <Award className="h-3.5 w-3.5 mr-1.5" />
              Top Seller
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Store className="h-4 w-4" />
          <span className="text-base font-medium">{storeName}</span>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Email Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
              <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{phone}</p>
            </div>
          </div>
        </div>

        {/* Location Card - Conditional */}
        {location ? (
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{location}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</p>
                <p className="text-sm text-gray-500 mt-1">Not set</p>
              </div>
            </div>
          </div>
        )}

        {/* Joined Date Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row - Optional */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Store Status</p>
          <p className="text-sm font-medium text-green-600">Active</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Account Type</p>
          <p className="text-sm font-medium text-gray-900">Vendor</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};