"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zyp-border">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link href="/" className="flex items-center z-50">
          <img src="/logo.png" alt="Zypcart" className="h-10 object-contain bg-white px-2 py-1 rounded-xl" />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-zyp-textPrimary">
          <Link href="/" className="hover:text-zyp-primary transition-colors">Home</Link>
          <Link href="/#how-it-works" className="hover:text-zyp-primary transition-colors">How it works</Link>
          <Link href="/#reviews" className="hover:text-zyp-primary transition-colors">Reviews</Link>
        </nav>
        
        <div className="hidden md:flex items-center">
          <Link href="/login" className="text-sm font-semibold text-zyp-textPrimary hover:text-zyp-primary mr-4">
            Log in
          </Link>
          <Link href="/signup">
            <Button variant="primary" className="rounded-full px-6 shadow-sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-800 z-50 p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Nav */}
        <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-all duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <nav className="flex flex-col items-center gap-8 text-lg font-bold text-slate-900 w-full px-6">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors w-full text-center py-3 border-b border-slate-100">Home</Link>
            <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors w-full text-center py-3 border-b border-slate-100">How it works</Link>
            <Link href="/#reviews" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors w-full text-center py-3 border-b border-slate-100">Reviews</Link>
            
            <div className="flex flex-col w-full gap-4 mt-4">
              <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="secondary" className="w-full py-6 rounded-xl font-bold border-slate-200">Log in</Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                <Button className="w-full py-6 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700">Get Started Free</Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

