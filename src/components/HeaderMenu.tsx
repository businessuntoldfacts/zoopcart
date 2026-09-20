"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 w-full bg-white z-40 border-b border-slate-100">
        <div className="w-full max-w-7xl mx-auto px-3 md:px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center z-50 -ml-1">
            <Logo darkText={true} />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-800">
            <Link href="/" className="hover:text-slate-500 transition-colors">Home</Link>
            <Link href="/features" className="hover:text-slate-500 transition-colors">Features</Link>
            <Link href="/reviews" className="hover:text-slate-500 transition-colors">Reviews</Link>
            <Link href="/blog" className="hover:text-slate-500 transition-colors">Blog</Link>
          </nav>
          
          <div className="hidden md:flex items-center">
            <Link href="/login" className="text-sm font-semibold text-slate-800 hover:text-slate-500 mr-4">
              Log in
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="rounded-full px-6 shadow-sm font-bold">Start free</Button>
            </Link>
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-1.5 md:hidden z-50">
            <Link href="/signup">
              <Button variant="primary" className="h-[32px] rounded-full px-4 text-[13px] font-semibold tracking-wide shadow-none border border-transparent flex items-center justify-center">Start free</Button>
            </Link>
            <button 
              className="text-slate-800 p-1.5 relative -mr-1" 
              onClick={() => setIsOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Mobile Nav Popup */}
      <div className={`fixed top-4 left-4 right-4 bg-white rounded-[24px] z-[70] flex flex-col p-6 transition-all duration-300 ease-out transform origin-top md:hidden shadow-2xl ${isOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible -translate-y-4'}`}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-2">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center -ml-1">
            <Logo darkText={true} />
          </Link>
          <button className="text-slate-800 p-2 -mr-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex flex-col items-start w-full gap-0 overflow-y-auto max-h-[60vh]">
          <Link href="/" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Home</Link>
          <Link href="/features" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Features</Link>
          <Link href="/reviews" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Reviews</Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Blog</Link>
          <Link href="/help" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Help Center</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4">About Us</Link>
        </nav>
        
        <div className="flex flex-col w-full gap-3 mt-4 pt-4 border-t border-slate-100 bg-white">
          <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
            <Button variant="secondary" className="w-full py-6 rounded-full font-bold border border-slate-200 text-slate-900 bg-white">Log in</Button>
          </Link>
          <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
            <Button variant="primary" className="w-full py-6 rounded-full font-bold">Start free</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
