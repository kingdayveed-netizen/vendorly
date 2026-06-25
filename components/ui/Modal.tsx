"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-8 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(34,197,94,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative glow blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 180,
            height: 180,
            background: "rgba(34,197,94,0.12)",
            borderRadius: "50%",
            top: -60,
            left: -60,
            filter: "blur(8px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 140,
            height: 140,
            background: "rgba(34,197,94,0.10)",
            borderRadius: "50%",
            bottom: -40,
            right: -30,
            filter: "blur(8px)",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 m-0">{title}</h3>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1 mb-0">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/10"
              style={{ background: "rgba(0,0,0,0.05)" }}
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}