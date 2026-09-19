"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Zoopcart available in my country?",
    answer: "Yes, Zoopcart is available for small businesses worldwide in over 180+ countries."
  },
  {
    question: "Can I create a WhatsApp store for free?",
    answer: "Absolutely! You can start selling and taking orders on WhatsApp for free in just a few minutes."
  },
  {
    question: "Will this reduce order mistakes on WhatsApp?",
    answer: "Yes. Instead of messy direct messages, customers select exact products and quantities from your digital catalog, eliminating manual errors."
  },
  {
    question: "Do I need a long-term contract?",
    answer: "No, there are no long-term contracts. You can use Zoopcart as long as it works for your business."
  },
  {
    question: "Can I accept card payments from my customers?",
    answer: "Yes, Zoopcart integrates with major payment gateways so you can accept credit cards, debit cards, and UPI effortlessly."
  },
  {
    question: "Can I use my own domain for my store?",
    answer: "Yes, premium users can easily connect their custom domain to their Zoopcart store to build their own brand."
  },
  {
    question: "If I need help, how fast can I get support?",
    answer: "We offer 24/7 dedicated support via chat and email to ensure your business never stops."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white border-y border-slate-100">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-[#111111] font-bold text-sm tracking-wide bg-slate-100 px-4 py-1 rounded-full mb-4 inline-block">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111111] mb-8">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-200">
              <button 
                onClick={() => toggle(index)}
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
              >
                <span className="font-semibold text-lg text-[#111111] group-hover:text-[#111111] transition-colors pr-8">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[#111111]' : ''}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-600 text-lg leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
