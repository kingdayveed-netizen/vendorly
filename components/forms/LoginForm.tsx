'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await login(data.email, data.password);
      showToast('Login successful!', 'success');
      
      // Redirect based on role
      if (response.user.role === 'VENDOR') { 
        router.push('/dashboard');
      } else {
        router.push('/explore');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full pr-10 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full pr-10 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm text-green-500 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white" 
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}

