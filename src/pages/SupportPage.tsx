import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Headphones, Shield, RotateCcw, Send, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SupportPageProps {
  onNavigate: (route: string) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const faqs = [
    {
      q: 'How does the Sterling 2-Year Comprehensive Warranty work?',
      a: 'Every device sold on Sterling Electronic Sales includes an automatic 2-year warranty covering all hardware defects, internal screen matrix faults, power supply malfunctions, and battery degradation below 80%. If an issue occurs, our concierge team arranges an insured doorstep pickup and loaner unit.',
    },
    {
      q: 'What is your return and refund policy?',
      a: 'We offer a 30-day hassle-free return window for all unopened or undamaged devices. If you are not satisfied with your purchase, initiate a return from your Account Orders dashboard. Once verified by our logistics inspector, full refunds are processed back to your original payment method within 24 hours.',
    },
    {
      q: 'How fast is express delivery across India?',
      a: 'Orders placed before 2:00 PM IST are dispatched the same day via Sterling Express Air. Deliveries to Metro areas (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Kolkata) arrive within 24 to 36 hours. Tier 2 and Tier 3 cities typically arrive in 48 hours.',
    },
    {
      q: 'Is Cash on Delivery (COD) supported?',
      a: 'Yes! COD is supported for orders up to ₹50,000 across 18,000+ PIN codes. All COD orders include our certified Open-Box Delivery service, allowing you to inspect the physical hardware before handing payment to the delivery executive.',
    },
    {
      q: 'Are all products 100% genuine with factory seals?',
      a: 'Absolutely. Sterling is an authorized premium direct retailer for all listed brands, including Apple, Sony, Samsung, Asus, LG, and our in-house Sterling engineering lines. All devices arrive factory sealed with valid manufacturer serial numbers and tax invoices.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showToast('Please fill all concierge contact fields.', 'error');
      return;
    }
    setIsSent(true);
    showToast('Your message has been assigned ticket #ST-REQ-889. A concierge specialist will reply within 2 hours.', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Showroom</span>
          </button>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            24/7 CONCIERGE & CARE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
            Sterling Customer Care Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
            Get prompt technical assistance, initiate warranty claims, track express shipments, or speak with our hardware specialists.
          </p>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-2">
            <Shield className="w-6 h-6 text-cyan-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-100 font-display">Warranty & Claims</h3>
            <p className="text-xs text-slate-400">
              Submit your hardware serial number for instant warranty verification and zero-deductible replacement.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-2">
            <RotateCcw className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-100 font-display">30-Day Doorstep Returns</h3>
            <p className="text-xs text-slate-400">
              Schedule an insured doorstep pickup for returns or exchanges with instant refund processing.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-2">
            <Headphones className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-100 font-display">Hardware Concierge</h3>
            <p className="text-xs text-slate-400">
              Direct line to audio, gaming, and workstation engineers for setup optimization and firmware guidance.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-display">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#0c0f17] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform duration-200 shrink-0 ml-4 ${
                      openFaqIdx === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIdx === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Concierge Form */}
        <div className="p-8 rounded-3xl bg-[#0c0f17] border border-white/10 max-w-2xl">
          <h3 className="text-lg font-bold text-white font-display mb-1">
            Send an Urgent Message to Support
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Average response time: &lt; 2 hours during active showroom hours.
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">How can we assist you?</label>
              <textarea
                rows={4}
                placeholder="Provide order number or hardware model details if applicable..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isSent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{isSent ? 'Dispatched to Team' : 'Dispatch Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
