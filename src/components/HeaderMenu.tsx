"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full bg-white z-50 border-b border-slate-100">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center z-50">
            <Logo darkText={true} />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-800">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it works</Link>
            <Link href="/#reviews" className="hover:text-blue-600 transition-colors">Reviews</Link>
          </nav>
          
          <div className="hidden md:flex items-center">
            <Link href="/login" className="text-sm font-semibold text-slate-800 hover:text-blue-600 mr-4">
              Log in
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="rounded-full px-6 shadow-sm font-bold">Start free</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-slate-800 z-50 p-2 relative" 
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-black/40 z-40 transition-all duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}></div>
      <div className={`fixed top-4 left-4 right-4 bg-white rounded-3xl z-50 flex flex-col p-6 transition-all duration-300 transform md:hidden shadow-2xl ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <Logo darkText={true} />
          </Link>
          <button className="text-slate-800 p-2" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col items-start w-full gap-1">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-slate-500 font-medium text-slate-900 w-full py-4 border-b border-slate-100">Home</Link>
          <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="hover:text-slate-500 font-medium text-slate-900 w-full py-4 border-b border-slate-100">How it works</Link>
          <Link href="/#reviews" onClick={() => setIsOpen(false)} className="hover:text-slate-500 font-medium text-slate-900 w-full py-4 border-b border-slate-100">Reviews</Link>
          
          <div className="flex flex-col w-full gap-3 mt-6">
            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="secondary" className="w-full py-6 rounded-full font-bold border-slate-200 text-slate-900">Log in</Button>
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="primary" className="w-full py-6 rounded-full font-bold">Start free</Button>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
