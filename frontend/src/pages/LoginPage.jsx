import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SunSnowIcon } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';

const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const queryClient = useQueryClient();

  const { mutate: login_mutation, isPending, error } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  })


  const handleLogin = (e) => {
    e.preventDefault();
    login_mutation(loginData);
  }

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="night"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex justify-center flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <SunSnowIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
               NeXoraa
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <form className="w-full" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Welcome Back</h2>
                <p className="text-sm opacity-70">
                  Sign in to your account to continue your language journey
                </p>
              </div>
              {/* EMAIL FIELD */}
              <div className="form-control">
                <label className="label">
                  <span className="font-bold label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="abcd@gmail.com"
                  required
                />
              </div>


              {/* PASSWORD FIELD */}
              <div className="form-control">
                <label className="label">
                  <span className="font-bold label-text">Password</span>
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="xxxxxxxxxx"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Signing in ...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>


              <div className="text-center mt-4">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/Sign in-bro.svg" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="text-sm opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage