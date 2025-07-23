'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../../public/images/logo.png';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // API call
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      console.log('API URL:', api);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      router.push('/dashboard');
      console.log('Login successful:', formData);

    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: 'url(/images/BG_Frame.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0D1117',
      }}
    >
      <div className="w-[669px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image src={Logo} alt="Polymath" width={258} height={64} />
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/4 rounded-xl p-8 shadow-2xl border-[1px] border-white/4 "
        >
          <h2 className="text-[#00FFFF] text-[24px] font-semibold text-center mb-6">Login</h2>
          <div className="mb-5 bg-white/8  h-[2px]" />
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#FFFFFF] text-[18px] font-normal mb-2">
                Enter mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="yourmail@mailhere"
                className={`w-full h-[56px] px-4 py-3 bg-[#0D1117] text-[#FFFFFF] rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent placeholder-gray-400 transition-colors`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#FFFFFF] text-[18px] font-normal mb-2">
                Enter Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••••"
                  className={`w-full h-[56px] px-4 py-3 pr-12 bg-[#0D1117] text-[#FFFFFF] rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent placeholder-gray-400 transition-colors`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00FFFF] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[55px] py-3 bg-[#00FF7F] text-lg  text-[#0D1117] font-semibold rounded-lg hover:bg-[#00E66B] focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-[#1a2332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[#FFFFFF] text-[18px]  font-normal cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#00FFFF] bg-[#0D1117] border-gray-600 rounded focus:ring-[#00FFFF] focus:ring-2"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-[#00FFFF] text-[18px] font-normal hover:text-[#00E6E6] transition-colors"
                onClick={() => router.push('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;