import React, { useState } from "react";
import { Settings, ShieldAlert, Banknote, Users, Server, Lock, DownloadCloud, LineChart, BarChart } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function SystemAdminPanel({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"config" | "tariff" | "rbac" | "logs" | "bi">("bi");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-fuchsia-500 mb-6 text-white">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Settings className="h-7 w-7 text-fuchsia-400" />
            {isAr ? "لوحة تحكم النظام والإدارة (System Admin)" : "System Admin & Control Panel"}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {isAr ? "تهيئة المستشفى، تسعير الخدمات، الصلاحيات (RBAC)، وسجل الرقابة (Audit Trails)." : "Hospital config, Tariffs, RBAC, and secure Audit Logs."}
          </p>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-xl gap-1 flex-wrap border border-slate-700">
          <button onClick={() => setActiveTab("bi")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "bi" ? "bg-fuchsia-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
            <LineChart className="w-4 h-4" /> {isAr ? "اللوحة التنفيذية" : "Executive BI"}
          </button>
          <button onClick={() => setActiveTab("config")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "config" ? "bg-fuchsia-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
            <Server className="w-4 h-4" /> {isAr ? "الإعدادات العامة" : "Metadata"}
          </button>
          <button onClick={() => setActiveTab("tariff")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "tariff" ? "bg-fuchsia-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
            <Banknote className="w-4 h-4" /> {isAr ? "تسعير الخدمات" : "Tariff Matrix"}
          </button>
          <button onClick={() => setActiveTab("rbac")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "rbac" ? "bg-fuchsia-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
            <Users className="w-4 h-4" /> {isAr ? "صلاحيات المستخدمين" : "RBAC / Users"}
          </button>
          <button onClick={() => setActiveTab("logs")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "logs" ? "bg-fuchsia-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
            <ShieldAlert className="w-4 h-4" /> {isAr ? "سجل الرقابة" : "Audit Trail"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
         {activeTab === "bi" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
               <div className="col-span-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm">
                     <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">{isAr ? "إجمالي الإيرادات (اليوم)" : "Total Revenue (Today)"}</p>
                     <p className="text-3xl font-black text-slate-800">EGP 245K</p>
                     <p className="text-xs text-emerald-500 font-bold mt-1">↑ 12% vs Yesterday</p>
                  </div>
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm">
                     <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">{isAr ? "المرضى الحاليين بأجنحة التنويم" : "Current IPD Census"}</p>
                     <p className="text-3xl font-black text-rose-600">142</p>
                     <p className="text-xs text-slate-400 font-bold mt-1">85% Occupancy Rate</p>
                  </div>
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm">
                     <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">{isAr ? "زيارات العيادات الخارجية" : "OPD Visits (Today)"}</p>
                     <p className="text-3xl font-black text-blue-600">315</p>
                     <p className="text-xs text-slate-400 font-bold mt-1">Avg waiting time: 14m</p>
                  </div>
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm">
                     <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">{isAr ? "العمليات الجراحية" : "Surgeries (Today)"}</p>
                     <p className="text-3xl font-black text-purple-600">18</p>
                     <p className="text-xs text-emerald-500 font-bold mt-1">100% On-time Starts</p>
                  </div>
               </div>

               <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                     <LineChart className="w-5 h-5 text-fuchsia-500" />
                     <h3 className="font-black text-slate-800">{isAr ? "مؤشرات الأداء الرئيسية - أسبوعي" : "Weekly Key Performance Indicators"}</h3>
                  </div>
                  <div className="h-64 flex items-end justify-between items-stretch gap-4 px-4 pb-8 pt-4 border-b border-l border-slate-100">
                     <div className="flex flex-col justify-end items-center gap-2 flex-1 group">
                        <div className="w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-200 transition-colors relative" style={{ height: '40%' }}></div>
                        <div className="w-full bg-indigo-500 rounded-t-sm group-hover:bg-indigo-600 transition-colors relative" style={{ height: '60%' }}>
                           <span className="absolute -top-6 w-full text-center text-xs font-bold text-slate-400">Sat</span>
                        </div>
                     </div>
                     <div className="flex items-end justify-center w-8 h-full"><span className="text-[10px] text-slate-300 transform -rotate-90">Trend Data Example</span></div>
                  </div>
               </div>

               <div className="col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                     <BarChart className="w-5 h-5 text-fuchsia-500" />
                     <h3 className="font-black text-slate-800">{isAr ? "توزيع المرضى حسب نوع التغطية" : "Payer Mix"}</h3>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-xs font-bold mb-1"><span>{isAr ? "نقدي" : "Cash"}</span><span>45%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-400 h-2 rounded-full" style={{ width: '45%' }}></div></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold mb-1"><span>{isAr ? "تأمين طبي" : "Private Insurance"}</span><span>35%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-400 h-2 rounded-full" style={{ width: '35%' }}></div></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold mb-1"><span>{isAr ? "تعاقدات شركات" : "Corporate"}</span><span>15%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-purple-400 h-2 rounded-full" style={{ width: '15%' }}></div></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold mb-1"><span>{isAr ? "حكومي / نفقة دولة" : "Government"}</span><span>5%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-rose-400 h-2 rounded-full" style={{ width: '5%' }}></div></div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {activeTab === "config" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in max-w-3xl">
               <h3 className="font-black text-slate-800 border-b border-slate-100 pb-3 mb-6">{isAr ? "بيانات المنشأة الطبية (Hospital Metadata)" : "Hospital Metadata"}</h3>
               <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Hospital Name / Legal Entity</label>
                    <input type="text" defaultValue="Baheya Foundation Hospital" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-slate-50 font-bold text-slate-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">Default Currency</label>
                       <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none font-bold"><option>EGP (Egyptian Pound)</option></select>
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">System Timezone</label>
                       <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none font-bold"><option>Africa/Cairo (UTC+2)</option></select>
                     </div>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === "tariff" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-slate-800 flex items-center gap-2">
                     <Banknote className="w-5 h-5 text-fuchsia-500" /> {isAr ? "مصفوفة أسعار الخدمات الطبية (Service Tariff Matrix)" : "Service Tariff Matrix"}
                   </h3>
                   <select className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold outline-none">
                      <option>Cash / Default Pricing</option>
                      <option>Misr Insurance Prices</option>
                      <option>Corporate Discount List</option>
                   </select>
               </div>
               <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="py-2 px-4 text-start font-bold">Service Code</th>
                      <th className="py-2 px-4 text-start font-bold">Service Name</th>
                      <th className="py-2 px-4 text-start font-bold">Category</th>
                      <th className="py-2 px-4 text-start font-bold">Base Price (EGP)</th>
                      <th className="py-2 px-4 text-start font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                     <tr>
                        <td className="py-3 px-4 text-slate-500 font-bold">OPD-101</td>
                        <td className="py-3 px-4 font-bold text-slate-800 font-sans">Internal Medicine Consultation</td>
                        <td className="py-3 px-4 text-slate-500 font-sans">Consultations</td>
                        <td className="py-3 px-4 font-black text-indigo-700">300.00</td>
                        <td className="py-3 px-4"><button className="text-fuchsia-600 font-bold hover:underline font-sans">Edit Price</button></td>
                     </tr>
                     <tr className="bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-500 font-bold">LAB-CBC</td>
                        <td className="py-3 px-4 font-bold text-slate-800 font-sans">Complete Blood Count (CBC)</td>
                        <td className="py-3 px-4 text-slate-500 font-sans">Laboratory</td>
                        <td className="py-3 px-4 font-black text-indigo-700">150.00</td>
                        <td className="py-3 px-4"><button className="text-fuchsia-600 font-bold hover:underline font-sans">Edit Price</button></td>
                     </tr>
                     <tr>
                        <td className="py-3 px-4 text-slate-500 font-bold">IPD-ICU-01</td>
                        <td className="py-3 px-4 font-bold text-slate-800 font-sans">ICU Bed Stay (Per Day)</td>
                        <td className="py-3 px-4 text-slate-500 font-sans">Accommodation</td>
                        <td className="py-3 px-4 font-black text-indigo-700">5,000.00</td>
                        <td className="py-3 px-4"><button className="text-fuchsia-600 font-bold hover:underline font-sans">Edit Price</button></td>
                     </tr>
                  </tbody>
               </table>
            </div>
         )}

         {activeTab === "rbac" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 col-span-1">
                  <h3 className="font-black text-slate-800 mb-4">{isAr ? "الأدوار الثابتة (Roles)" : "Defined Roles"}</h3>
                  <div className="space-y-2">
                     <button className="w-full text-left bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-800 font-bold p-3 rounded-xl text-sm">Doctor (OPD)</button>
                     <button className="w-full text-left bg-white border border-slate-200 text-slate-600 font-bold p-3 rounded-xl text-sm hover:border-slate-300">Nurse (Ward)</button>
                     <button className="w-full text-left bg-white border border-slate-200 text-slate-600 font-bold p-3 rounded-xl text-sm hover:border-slate-300">Cashier / Billing</button>
                     <button className="w-full text-left bg-white border border-slate-200 text-slate-600 font-bold p-3 rounded-xl text-sm hover:border-slate-300">System Admin</button>
                  </div>
               </div>
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 col-span-2">
                  <h3 className="font-black text-slate-800 mb-4">{isAr ? "مصفوفة صلاحيات (Doctor OPD)" : "Doctor (OPD) Permissions Grid"}</h3>
                  <table className="w-full text-sm">
                     <thead className="bg-slate-50 text-slate-500">
                        <tr>
                           <th className="py-2 px-3 text-start">Module / Screen</th>
                           <th className="py-2 px-3 text-center">Read</th>
                           <th className="py-2 px-3 text-center">Write (Create)</th>
                           <th className="py-2 px-3 text-center">Update</th>
                           <th className="py-2 px-3 text-center">Delete</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        <tr>
                           <td className="py-3 px-3 font-bold text-slate-700">Patient EMR (Notes, Dx)</td>
                           <td className="text-center"><span className="text-emerald-500 font-black">✓</span></td>
                           <td className="text-center"><span className="text-emerald-500 font-black">✓</span></td>
                           <td className="text-center"><span className="text-emerald-500 font-black">✓</span></td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                        </tr>
                        <tr>
                           <td className="py-3 px-3 font-bold text-slate-700">Billing & Ledger</td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                        </tr>
                        <tr>
                           <td className="py-3 px-3 font-bold text-slate-700">Lab Results</td>
                           <td className="text-center"><span className="text-emerald-500 font-black">✓</span></td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                           <td className="text-center"><span className="text-slate-300 font-black">✗</span></td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         
         {activeTab === "logs" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-sm p-6 animate-fade-in text-slate-300">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-white flex items-center gap-2">
                     <Lock className="w-5 h-5 text-emerald-500" /> {isAr ? "سجل الرقابة وحركات النظام (Audit Trails)" : "Immutable Audit Trails"}
                   </h3>
                   <button className="bg-slate-800 border border-slate-600 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded transition flex items-center gap-2">
                      <DownloadCloud className="w-4 h-4"/> CSV Export
                   </button>
               </div>
               <div className="font-mono text-xs space-y-2 bg-black p-4 rounded-xl h-[400px] overflow-y-auto border border-slate-800">
                  <p className="border-b border-slate-800 pb-2"><span className="text-emerald-400">[2026-06-16 08:05:12]</span> <span className="text-blue-400">INFO</span> | User: <b>dr_ahmed</b> | Screen: EMR_Prescription | Action: CREATE | Target: MRN-2026-0041 | IP: 192.168.1.45</p>
                  <p className="border-b border-slate-800 pb-2"><span className="text-emerald-400">[2026-06-16 08:30:45]</span> <span className="text-yellow-400">WARN</span> | User: <b>cashier_01</b> | Screen: Ledger_Adjust | Action: DISCOUNT_APPLY (-10%) | Target: INV-6021 | Auth: cno_override</p>
                  <p className="border-b border-slate-800 pb-2"><span className="text-emerald-400">[2026-06-16 09:12:00]</span> <span className="text-red-400">DENY</span> | User: <b>nurse_ola</b> | Screen: Billing_Ledger | Action: VIEW | Reason: RBAC Violation "Deny Read"</p>
                  <p className="border-b border-slate-800 pb-2"><span className="text-emerald-400">[2026-06-16 09:15:22]</span> <span className="text-blue-400">INFO</span> | System: <b>LIS_Engine</b> | Screen: AutoVerify | Action: SIGN_OFF | Target: SMP.2606.10A | Result: Normal Range</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
