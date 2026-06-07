"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  Eye,
  EyeOff,
  Home,
  Store,
  User,
  ShoppingBag,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    storeName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Phone number is required"),
    location: z.string().min(2, "Location shouldn't be less than 2 characters"),
    role: z.enum(["VENDOR", "CUSTOMER"]),
  })
  .superRefine((data, ctx) => {
    if (data.role === "VENDOR" && !data.storeName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Store name is required for vendors",
        path: ["storeName"],
      });
    }
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"VENDOR" | "CUSTOMER">(
    "VENDOR",
  );
  const { signup } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "VENDOR",
    },
  });

  const role = watch("role");

  const onSubmit = async (data: SignupFormData) => {
    console.log("Form Data:", data);
    try {
      setIsLoading(true);
      await signup(
        data.fullName,
        data.email,
        data.password,
        data.role,
        data.role === "VENDOR" ? data.storeName! : "",
        data.phone,
        data.location,
      );
      showToast("Account created successfully!", "success");
      router.push("/verifyEmail");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to create account",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const RoleOption = ({
    value,
    label,
    icon: Icon,
  }: {
    value: "VENDOR" | "CUSTOMER";
    label: string;
    icon: any;
  }) => (
    <button
      type="button"
      onClick={() => {
        setSelectedRole(value);
        setValue("role", value);
      }}
      className={cn(
        "flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
        role === value
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:border-gray-300 bg-white",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-full",
          role === value ? "bg-green-100" : "bg-gray-100",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            role === value ? "text-green-600" : "text-gray-500",
          )}
        />
      </div>
      <div className="flex-1 text-left">
        <p
          className={cn(
            "font-medium",
            role === value ? "text-green-700" : "text-gray-700",
          )}
        >
          {label}
        </p>
        <p className="text-xs text-gray-500">
          {value === "VENDOR"
            ? "Sell products on our platform"
            : "Shop from our vendors"}
        </p>
      </div>
      {role === value && (
        <div className="bg-green-500 rounded-full p-1">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          I want to sign up as <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <RoleOption value="VENDOR" label="Vendor" icon={Store} />
          <RoleOption value="CUSTOMER" label="Customer" icon={ShoppingBag} />
        </div>
        {errors.role && (
          <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-bold text-gray-800 mb-2"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className="w-full pl-10 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            {...register("fullName")}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {role === "VENDOR" && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <label
            htmlFor="storeName"
            className="block text-sm font-bold text-gray-800 mb-2"
          >
            Store Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="storeName"
              type="text"
              placeholder="e.g., Iyke Collections"
              className="w-full pl-10 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              {...register("storeName")}
            />
          </div>
          {errors.storeName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.storeName.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-gray-800 mb-2"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-bold text-gray-800 mb-2"
        >
          Whatsapp Number <span className="text-red-500">*</span>
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          className="w-full bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-bold text-gray-800 mb-2"
        >
          Location <span className="text-red-500">*</span>
        </label>
        <Input
          id="location"
          type="text"
          placeholder="e.g: Port-Harcourt"
          className="w-full bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-bold text-gray-800 mb-2"
        >
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            className="w-full pr-10 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white inline-flex items-center justify-center gap-2 h-12 font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⚪</span>
            Creating Account...
          </span>
        ) : (
          <>
            <Home className="h-5 w-5" />
            {role === "VENDOR" ? "Create My Store" : "Create My Account"}
          </>
        )}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-green-600 hover:text-green-700 font-semibold hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </form>
  );
}
