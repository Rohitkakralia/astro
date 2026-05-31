"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 p-8 text-center">
        
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-orange-600" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          No Remaining Kundalis
        </h1>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-8">
          You have used all kundalis available in your current plan.
          Upgrade your subscription to continue generating kundalis.
        </p>

        {/* Features */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-gray-800">
              Premium Benefits
            </span>
          </div>

          <ul className="space-y-2 text-sm text-gray-600">
            <li>• More Kundali Generations</li>
            <li>• Unlimited Access</li>
            <li>• Faster Predictions</li>
            <li>• Premium Astrology Features</li>
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={() => router.push("/ourPlans")}
          className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-orange-200"
        >
          See Plans
        </button>

      </div>
    </div>
  );
};
