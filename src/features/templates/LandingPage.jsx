import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Shield, Globe, X, Mail } from 'lucide-react';

const LandingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showDocs, setShowDocs] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const scrollToPricing = () => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20">
       
       {/* --- MODALS --- */}
       <AnimatePresence>
           {showDocs && (
               <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDocs(false)}>
                   <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.9, opacity: 0}} className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                       <div className="flex justify-between items-center mb-6">
                           <h2 className="text-2xl font-bold">Documentation</h2>
                           <button onClick={() => setShowDocs(false)}><X/></button>
                       </div>
                       <p className="text-zinc-400 mb-4">This simulates an API reference page. Since this is a template, imagine beautiful code snippets here!</p>
                       <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-white/5">
                           $ npm install @gw/sdk<br/>
                           $ gw init --typescript<br/>
                           $ gw deploy
                       </div>
                   </motion.div>
               </div>
           )}

           {showContact && (
               <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowContact(false)}>
                   <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 50, opacity: 0}} className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-2xl font-bold">Get Started</h2>
                           <button onClick={() => setShowContact(false)}><X/></button>
                       </div>
                       <p className="text-zinc-400 mb-6">Interested in this plan? Let's connect to discuss implementation details.</p>
                       <a href="mailto:gwiandt@wpi.edu" className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-colors">
                           <Mail size={18} /> Contact Sales (Guillermo)
                       </a>
                   </motion.div>
               </div>
           )}
       </AnimatePresence>

       {/* Hero Section */}
       <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20 mb-8">v2.0 is finally here</div>
             <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Ship faster.<br/> Scale better.
             </h1>
             <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                The comprehensive toolkit for modern engineering teams. 
                Deploy automated workflows in seconds, not days.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={scrollToPricing} className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">Start Building</button>
                <button onClick={() => setShowDocs(true)} className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-full font-bold text-lg hover:bg-zinc-800 transition-colors">View Documentation</button>
             </div>
          </motion.div>
       </section>

       {/* Features Grid with Scroll Reveal */}
       <section className="py-20 bg-zinc-900/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                   { icon: <Zap className="text-yellow-400"/>, title: "Lightning Fast", desc: "Built on Rust for sub-millisecond latency on every request." },
                   { icon: <Shield className="text-green-400"/>, title: "Bank-Grade Security", desc: "SOC2 Type II certified with end-to-end encryption by default." },
                   { icon: <Globe className="text-blue-400"/>, title: "Global Edge Network", desc: "Deploy your logic to 35+ regions with a single click." }
                ].map((f, i) => (
                   <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: i * 0.2 }}
                      className="p-8 bg-black border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-colors"
                   >
                      <div className="mb-6 p-3 bg-zinc-900 w-fit rounded-xl border border-white/5">{f.icon}</div>
                      <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
                   </motion.div>
                ))}
             </div>
          </div>
       </section>

       {/* Pricing with Scroll Reveal */}
       <section id="pricing" className="py-20 max-w-7xl mx-auto px-6">
           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
               <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
               <p className="text-zinc-400 mb-8">Start for free, scale as you grow.</p>
               <div className="flex justify-center items-center gap-4 bg-zinc-900 w-fit mx-auto p-1 rounded-full border border-white/10">
                   {['monthly', 'yearly'].map(cycle => (
                       <button key={cycle} onClick={() => setBillingCycle(cycle)} className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${billingCycle === cycle ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}>
                           {cycle}
                       </button>
                   ))}
               </div>
           </motion.div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {[
                   { name: "Starter", price: 0, feats: ["1 User", "5k Requests", "Community Support"] },
                   { name: "Pro", price: 29, feats: ["5 Users", "1M Requests", "Priority Support", "Analytics"], active: true },
                   { name: "Enterprise", price: 99, feats: ["Unlimited Users", "Unlimited Requests", "Dedicated Manager", "SLA"] },
               ].map((plan, i) => (
                   <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -10 }}
                      className={`p-8 rounded-3xl flex flex-col ${plan.active ? 'bg-indigo-600 text-white' : 'bg-zinc-900/50 border border-white/10'}`}
                   >
                       <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                       <div className="text-4xl font-bold mb-6">
                           ${billingCycle === 'yearly' ? (plan.price * 10).toFixed(0) : plan.price}
                           <span className="text-sm font-normal opacity-70">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                       </div>
                       {billingCycle === 'yearly' && plan.price > 0 && <div className="mb-4 bg-white/20 w-fit px-2 py-1 rounded text-xs font-bold">Save 20%</div>}
                       <div className="space-y-4 mb-8 flex-1">
                           {plan.feats.map(f => (
                               <div key={f} className="flex gap-2 text-sm"><Check size={16} className={plan.active ? 'text-indigo-200' : 'text-indigo-500'} /> {f}</div>
                           ))}
                       </div>
                       <button onClick={() => setShowContact(true)} className={`w-full py-3 rounded-xl font-bold text-sm ${plan.active ? 'bg-white text-indigo-600' : 'bg-white/10 hover:bg-white/20'}`}>
                           Choose Plan
                       </button>
                   </motion.div>
               ))}
           </div>
       </section>

    </div>
  );
};

export default LandingPage;