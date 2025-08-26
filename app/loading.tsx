"use client"
// app/loading.tsx
import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
      <svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        className="loading-svg"
      >
        <circle
          cx="60"
          cy="60"
          r="15"
          fill="#3b82f6"
          className="animate-pulse-circle-1"
        />
        <circle
          cx="60"
          cy="60"
          r="12"
          fill="#60a5fa"
          className="animate-pulse-circle-2"
        />
        <circle
          cx="60"
          cy="60"
          r="9"
          fill="#93c5fd"
          className="animate-pulse-circle-3"
        />
      </svg>

      <style jsx>{`
        .loading-svg {
          filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5));
        }
        @keyframes pulse-rotate-1 {
          0% { transform: rotate(0deg) translate(25px) rotate(0deg) scale(1); opacity: 0.8; }
          50% { transform: rotate(180deg) translate(25px) rotate(-180deg) scale(1.5); opacity: 1; }
          100% { transform: rotate(360deg) translate(25px) rotate(-360deg) scale(1); opacity: 0.8; }
        }
        @keyframes pulse-rotate-2 {
          0% { transform: rotate(120deg) translate(25px) rotate(-120deg) scale(1.2); opacity: 0.7; }
          50% { transform: rotate(300deg) translate(25px) rotate(-300deg) scale(1.7); opacity: 0.9; }
          100% { transform: rotate(480deg) translate(25px) rotate(-480deg) scale(1.2); opacity: 0.7; }
        }
        @keyframes pulse-rotate-3 {
          0% { transform: rotate(240deg) translate(25px) rotate(-240deg) scale(0.8); opacity: 0.6; }
          50% { transform: rotate(420deg) translate(25px) rotate(-420deg) scale(1.3); opacity: 0.8; }
          100% { transform: rotate(600deg) translate(25px) rotate(-600deg) scale(0.8); opacity: 0.6; }
        }
        .animate-pulse-circle-1 {
          animation: pulse-rotate-1 1.5s ease-in-out infinite;
          transform-origin: 60px 60px;
        }
        .animate-pulse-circle-2 {
          animation: pulse-rotate-2 1.5s ease-in-out infinite;
          transform-origin: 60px 60px;
        }
        .animate-pulse-circle-3 {
          animation: pulse-rotate-3 1.5s ease-in-out infinite;
          transform-origin: 60px 60px;
        }
      `}</style>
    </div>
  );
}