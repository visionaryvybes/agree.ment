'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContracts, useProtocolActions } from '@/store/contracts';
import { 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  FileText, 
  CurrencyDollar,
  User,
  Users,
  CaretRight,
  DownloadSimple,
  Warning,
  PlusCircle,
  Eye,
  CheckCircle,
  Link as LinkIcon,
  MagicWand,
  Sparkle,
  Image as ImageIcon
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';
import DigitalSeal from '@/components/ui/digital-seal';

export default function ContractDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getContract } = useContracts();
  const contract: any = getContract(id as string);
  const [mounted, setMounted] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#010101]" />;
  if (!contract) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
       <Warning size={64} className="text-text-3 opacity-20" />
       <h1 className="heading-display text-4xl text-white opacity-40 uppercase italic">Deal Not Found.</h1>
       <Link href="/dashboard" className="btn-titanium px-10 py-4 text-[11px] font-black uppercase tracking-widest">Return to Deals</Link>
    </div>
  );

  const handleEnhance = async () => {
    setIsEnhancing(true);
    // Simulation of Nano Banana Pro 2 reading context and generating visual
    setTimeout(() => {
        setIsEnhancing(false);
        setEnhancedImage('/enhanced_identity_demo.png'); // Placeholder or we generate one
    }, 3000);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { label: 'ACTIVE DEAL', color: 'text-emerald', bg: 'bg-emerald/5', border: 'border-emerald/30', icon: ShieldCheck };
      case 'pending_signature': return { label: 'PENDING SIGNATURE', color: 'text-text-3', bg: 'bg-white/5', border: 'border-white/10', icon: Clock };
      case 'disputed': return { label: 'PROBLEM FOUND', color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20', icon: Warning };
      default: return { label: 'UNKNOWN', color: 'text-text-3', bg: 'bg-white/5', border: 'border-white/10', icon: Clock };
    }
  };

  const status = getStatusConfig(contract.status);

  return (
    <div className="space-y-12 pb-32 max-w-7xl mx-auto px-4 relative">
      <div className="vibrant-glow top-0 right-1/4 w-[600px] h-[600px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 left-1/4 w-[500px] h-[500px] bg-blue/10" />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-8">
           <Link href="/dashboard" className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-3 hover:bg-emerald hover:text-[#010101] shadow-xl transition-all duration-700 hover:rotate-6">
              <ArrowLeft size={28} weight="bold" />
           </Link>
           <div>
              <div className={cn("badge-vibrant mb-4 inline-flex items-center gap-3", 
                contract.status === 'active' ? 'badge-active' : 
                contract.status === 'pending_signature' ? 'badge-pending' : 
                'badge-disputed'
              )}>
                 <status.icon size={16} weight="bold" />
                 {status.label}
              </div>
              <h1 className="heading-display text-5xl md:text-8xl text-white tracking-tighter italic uppercase">{contract.title}</h1>
           </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
           <Magnetic>
              <button 
                onClick={handleEnhance}
                disabled={isEnhancing}
                className={cn(
                  "btn-vibrant px-10 relative overflow-hidden group",
                  enhancedImage ? "bg-white/10 text-white" : "btn-vibrant-emerald"
                )}
              >
                 <MagicWand size={22} weight="bold" className={cn(isEnhancing && "animate-spin")} />
                 <span>{isEnhancing ? "SCANNING..." : enhancedImage ? "VISUALS ACTIVE" : "MAGIC ENHANCE"}</span>
                 
                 {/* Premium Glow effect */}
                 <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              </button>
           </Magnetic>
           <Magnetic>
              <button className="btn-vibrant bg-[#1A1A1E] text-white border border-white/10 hover:bg-white hover:text-[#010101] px-10">
                 <DownloadSimple size={22} weight="bold" />
                 <span>EXPORT PDF</span>
              </button>
           </Magnetic>
        </div>
      </header>

      {/* ── ENHANCED IDENTITY SECTION ─────────────────────────────── */}
      <AnimatePresence>
         {(isEnhancing || enhancedImage) && (
            <motion.div 
               initial={{ opacity: 0, height: 0, y: -20 }}
               animate={{ opacity: 1, height: 'auto', y: 0 }}
               exit={{ opacity: 0, height: 0, y: -20 }}
               className="relative overflow-hidden rounded-[60px] border border-emerald/20 bg-emerald/5 backdrop-blur-3xl"
            >
               <div className="p-12 border-b border-emerald/10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-emerald rounded-2xl flex items-center justify-center text-[#010101] shadow-[0_0_30px_#00FFD1]">
                        <ImageIcon size={24} weight="bold" />
                     </div>
                     <div>
                        <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Visual Identification</h4>
                        <p className="text-[10px] font-black text-emerald uppercase tracking-[0.2em] mt-1">Generated by Nano Banana Pro 2</p>
                     </div>
                  </div>
                  {isEnhancing && <Sparkle size={32} className="text-emerald animate-pulse" weight="bold" />}
               </div>
               
               <div className="h-[400px] w-full bg-[#050505] relative flex items-center justify-center overflow-hidden">
                  {isEnhancing ? (
                     <div className="flex flex-col items-center gap-8">
                        <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden relative">
                           <motion.div 
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                              className="absolute inset-0 bg-emerald shadow-[0_0_15px_#00FFD1]"
                           />
                        </div>
                        <p className="text-[10px] font-black text-text-3 uppercase tracking-[0.5em] animate-pulse italic">Scanning Agreement Context...</p>
                     </div>
                  ) : (
                     <motion.div 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full h-full"
                     >
                        <img 
                           src={enhancedImage!} 
                           className="w-full h-full object-cover opacity-80 mix-blend-screen"
                           alt="Agreement Context Identity"
                           onError={(e) => {
                             // Fallback to a high-quality abstract if image doesn't exist yet
                             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1920';
                           }}
                        />
                        {/* Overlay Branding */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                        <div className="absolute bottom-12 left-12">
                           <h2 className="heading-display text-4xl text-white italic uppercase tracking-tighter leading-none">{contract.title}</h2>
                           <p className="text-[10px] font-black text-emerald uppercase tracking-[0.5em] mt-4">Verified Narrative Identity</p>
                        </div>
                     </motion.div>
                  )}
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-12 relative z-10">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-12">
           {/* Summary Grid */}
           <div className="grid sm:grid-cols-3 gap-8">
              {[
                { label: 'Asset Value', val: `$${(contract.totalAmount || 0).toLocaleString()}`, icon: CurrencyDollar, color: 'text-emerald' },
                { label: 'Saved On', val: new Date(contract.createdAt).toLocaleDateString(), icon: Clock, color: 'text-blue' },
                { label: 'Category', val: contract.category, icon: FileText, color: 'text-amber' },
              ].map((stat) => (
                <div key={stat.label} className={cn(
                  "p-10 rounded-[40px] bg-white/[0.03] border backdrop-blur-3xl space-y-8 group transition-all duration-700",
                  stat.color === 'text-emerald' ? 'border-emerald/10 hover:border-emerald/50 hover:shadow-[0_0_50px_rgba(0,255,209,0.1)]' :
                  stat.color === 'text-blue' ? 'border-blue/10 hover:border-blue/50 hover:shadow-[0_0_50px_rgba(0,112,255,0.1)]' :
                  'border-amber/10 hover:border-amber/50 hover:shadow-[0_0_50px_rgba(255,184,0,0.1)]'
                )}>
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-text-3 group-hover:bg-white group-hover:text-[#010101] transition-all duration-500 shadow-xl group-hover:scale-110">
                      <stat.icon size={28} weight="bold" />
                   </div>
                   <div>
                      <p className={cn("text-[11px] font-black uppercase tracking-[0.3em] mb-2", stat.color)}>{stat.label}</p>
                      <h4 className="text-3xl font-black text-white italic tracking-tighter group-hover:translate-x-2 transition-transform">{stat.val}</h4>
                   </div>
                </div>
              ))}
           </div>

           {/* Stakeholders Section */}
           <div className="space-y-8">
              <h3 className="text-[14px] font-black text-white uppercase tracking-[0.5em] px-2">Agreement Parties</h3>
              <div className="grid sm:grid-cols-2 gap-8">
                 {[
                   { label: 'OWNER', name: contract.parties?.[0]?.name, role: 'Primary' },
                   { label: 'SIGNATORY', name: contract.parties?.[1]?.name, role: 'Counter-Party' }
                 ].map(party => (
                   <div key={party.label} className="p-10 rounded-[50px] bg-white/[0.03] border border-white/5 backdrop-blur-3xl flex items-center gap-8 group hover:border-emerald/30 transition-all duration-700">
                      <div className="w-20 h-20 rounded-3xl bg-[#080808] border border-white/10 flex items-center justify-center text-emerald shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                         <User size={40} weight="bold" />
                      </div>
                      <div>
                         <p className="text-[11px] font-black text-text-3 uppercase tracking-widest">{party.label}</p>
                         <h4 className="text-2xl font-black text-white mt-2 group-hover:text-emerald transition-colors tracking-tighter">{party.name || 'Anonymous User'}</h4>
                         <span className="text-[11px] font-black text-emerald/50 uppercase tracking-widest mt-1 block">{party.role}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Clause Registry */}
           <div className="p-14 rounded-[60px] bg-[#0A0A0A] border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald/5 blur-[100px]" />
              <h3 className="text-[14px] font-black text-text-3 uppercase tracking-[0.6em] mb-16">The Deal Points</h3>
              
              <div className="space-y-6">
                 {contract.clauses?.length > 0 ? contract.clauses.map((clause: any, i: number) => (
                    <div key={clause.id} className="flex items-center justify-between p-8 rounded-3xl bg-white/[0.03] border border-white/5 group hover:bg-emerald hover:border-transparent transition-all duration-500 cursor-pointer shadow-xl">
                       <div className="flex items-center gap-6">
                          <div className="w-3 h-3 rounded-full bg-emerald shadow-[0_0_15px_#00FFD1] group-hover:bg-[#010101] group-hover:shadow-none transition-colors" />
                          <span className="text-[12px] font-black text-white uppercase tracking-widest group-hover:text-[#010101] transition-colors">{clause.title}</span>
                       </div>
                       <CaretRight size={28} weight="bold" className="text-text-3 group-hover:text-[#010101] group-hover:translate-x-2 transition-all" />
                    </div>
                 )) : [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-8 rounded-3xl bg-white/[0.03] border border-white/5 group hover:bg-emerald hover:border-transparent transition-all duration-500 cursor-pointer shadow-xl">
                       <div className="flex items-center gap-6">
                          <div className="w-3 h-3 rounded-full bg-emerald shadow-[0_0_15px_#00FFD1] group-hover:bg-[#010101] group-hover:shadow-none transition-colors" />
                          <span className="text-[12px] font-black text-white uppercase tracking-widest group-hover:text-[#010101] transition-colors">Term Point 0{i}</span>
                       </div>
                       <CaretRight size={28} weight="bold" className="text-text-3 group-hover:text-[#010101] group-hover:translate-x-2 transition-all" />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Status / Digital Seal */}
        <div className="lg:col-span-1 space-y-10">
           <div className="p-12 rounded-[60px] bg-emerald text-[#010101] flex flex-col items-center text-center gap-12 shadow-[0_0_120px_rgba(0,255,209,0.3)] border-8 border-[#010101] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_70%)] opacity-30 group-hover:opacity-60 transition-opacity" />
              <div className="relative z-10">
                 <DigitalSeal />
                 <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#010101] rounded-[24px] flex items-center justify-center text-emerald shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-4 border-emerald group-hover:scale-110 transition-transform">
                    <ShieldCheck size={36} weight="bold" />
                 </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                 <h3 className="heading-display text-5xl italic uppercase underline decoration-2 underline-offset-8">Final Seal</h3>
                 <p className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] break-all px-4">AGREEMINT-ID: {contract.id?.slice(0, 16).toUpperCase()}</p>
              </div>

              <div className="w-full space-y-6 pt-12 border-t border-[#010101]/15 relative z-10 text-center">
                 <div className="flex items-center justify-between text-[12px] font-black uppercase tracking-widest px-4">
                    <span className="opacity-50">STATUS</span>
                    <span>{status.label.split(' ')[0]}</span>
                 </div>
                 <div className="flex items-center justify-between text-[12px] font-black uppercase tracking-widest px-4">
                    <span className="opacity-50">INTEGRITY</span>
                    <span className="bg-[#010101] text-emerald px-4 py-1 rounded-full shadow-xl">100.00%</span>
                 </div>
              </div>
           </div>

           <div className="p-12 rounded-[60px] bg-[#0A0A0A] border border-white/10 flex flex-col gap-10 shadow-2xl overflow-hidden relative">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue/5 blur-[80px]" />
              <h4 className="text-[12px] font-black text-white uppercase tracking-[0.5em] px-2 text-center">History Log</h4>
              <div className="space-y-8">
                 {[
                   { t: '11:04 AM', msg: 'Verified by AgreeMint Network' },
                   { t: '10:42 AM', msg: 'Digital Seal Applied Successfully' },
                   { t: '09:12 AM', msg: 'Contract Created' }
                 ].map((log, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className="text-[10px] font-black text-emerald opacity-60 whitespace-nowrap mt-1 group-hover:opacity-100 transition-opacity">{log.t}</div>
                      <p className="text-[11px] font-black text-text-3 uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors">{log.msg}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
