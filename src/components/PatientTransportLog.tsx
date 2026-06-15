import React, { useState } from "react";
import { Activity, Clock, CheckCircle2, User, UserCheck, ArrowRightLeft, ShieldAlert, BedDouble, PlusCircle } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function PatientTransportLog({ language }: Props) {
  const isAr = language === "ar";
  
  const [transports, setTransports] = useState<any[]>([
    {
      id: "tr-1",
      patientName: "علي محمد السيد",
      mrn: "MRN-10901",
      fromUnit: "EMERGENCY UNIT (Bed 4)",
      toUnit: "INTENSIVE CARE UNIT (Bed 2)",
      status: "completed",
      timeAssigned: "10:15 AM",
      timeCompleted: "10:35 AM",
      assignedPorter: "محمود حسن",
      type: "Critical Transfer",
      equipmentNeeded: ["Oxygen Cylinder", "Portable Monitor"]
    },
    {
      id: "tr-2",
      patientName: "سعاد عبد الجليل",
      mrn: "MRN-33421",
      fromUnit: "MEDICAL WARD (Room 304)",
      toUnit: "RADIOLOGY UNIT (CT Scan)",
      status: "in-progress",
      timeAssigned: "11:00 AM",
      timeCompleted: null,
      assignedPorter: "إبراهيم الدسوقي",
      type: "Diagnostic",
      equipmentNeeded: ["Wheelchair"]
    },
    {
      id: "tr-3",
      patientName: "نور الدين عمر",
      mrn: "MRN-55823",
      fromUnit: "OPERATING ROOM (Recovery)",
      toUnit: "SURGICAL WARD (Room 412)",
      status: "pending",
      timeAssigned: "11:20 AM",
      timeCompleted: null,
      assignedPorter: "Unassigned",
      type: "Post-Op Transfer",
      equipmentNeeded: ["Stretcher"]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in-progress": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    if (isAr) {
      switch (status) {
        case "completed": return "مكتمل";
        case "in-progress": return "جاري النقل";
        case "pending": return "في الانتظار";
        default: return "غير معروف";
      }
    }
    return status.toUpperCase();
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-indigo-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ArrowRightLeft className="h-7 w-7 text-indigo-600" />
            {isAr ? "نظام النقل وحركة المرضى" : "Patient Transport & Logistics"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "تتبع مباشر لحركة المرضى بين الأقسام، الطوارئ، الأشعة والعمليات" : "Live tracking of patient movement across wards, ED, O.R and Radiology."}
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition shadow-sm flex items-center gap-2 shrink-0">
           <PlusCircle className="w-5 h-5" />
           {isAr ? "طلب نقل جديد" : "Request Transport"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl">
             12
           </div>
           <div>
             <p className="text-xs text-slate-500 font-bold">{isAr ? "إجمالي طلبات النقل اليوم" : "Total Transport Requests"}</p>
             <p className="font-black text-lg text-slate-800">{isAr ? "12 مريض" : "12 Patients"}</p>
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl">
             3
           </div>
           <div>
             <p className="text-xs text-slate-500 font-bold">{isAr ? "حالات في الانتظار" : "Pending Operations"}</p>
             <p className="font-black text-lg text-slate-800">{isAr ? "يتطلب تعيين ناقل" : "Requires Assignment"}</p>
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl">
             15m
           </div>
           <div>
             <p className="text-xs text-slate-500 font-bold">{isAr ? "متوسط وقت إنجاز النقل" : "Average Transport Time"}</p>
             <p className="font-black text-lg text-slate-800">{isAr ? "ضمن المعدل المسموح" : "Within KPI Target"}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              {isAr ? "لوحة المراقبة التفاعلية للمهام القياسية" : "Live Task Board"}
            </h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">{isAr ? "الحالات الحرجة فقط" : "Critical Only"}</button>
            </div>
        </div>
        <div className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-black">{isAr ? "المريض ورقم الملف (MRN)" : "Patient / MRN"}</th>
                <th className="py-3 px-4 font-black text-center">{isAr ? "المسار (من / إلى)" : "Route (From -> To)"}</th>
                <th className="py-3 px-4 font-black text-center">{isAr ? "نوع النقل والاحتياجات" : "Transport Type & Needs"}</th>
                <th className="py-3 px-4 font-black text-center">{isAr ? "الناقل المعين (Porter)" : "Assigned Porter"}</th>
                <th className="py-3 px-4 font-black text-center">{isAr ? "حالة المهمة والوقت" : "Status & Time"}</th>
                <th className="py-3 px-4 font-black text-center">{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transports.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-4">
                     <p className="font-bold text-slate-900">{t.patientName}</p>
                     <p className="font-mono text-xs text-slate-500 mt-1 bg-slate-100 inline-block px-1 rounded">{t.mrn}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <p className="text-xs font-bold text-indigo-700">{t.fromUnit}</p>
                    <div className="flex justify-center my-1"><ArrowRightLeft className="w-3 h-3 text-slate-400 rotate-90 md:rotate-0" /></div>
                    <p className="text-xs font-bold text-emerald-700">{t.toUnit}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${t.type.includes('Critical') ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                      {t.type}
                    </span>
                    <div className="mt-2 text-[10px] text-slate-500">
                       <BedDouble className="w-3 h-3 inline-block mx-1" /> {t.equipmentNeeded.join(", ")}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                     <div className="flex items-center justify-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                         <User className="w-3 h-3 text-slate-500" />
                       </div>
                       <span className={`text-xs font-bold ${t.assignedPorter === 'Unassigned' ? 'text-rose-500' : 'text-slate-700'}`}>
                         {t.assignedPorter}
                       </span>
                     </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(t.status)}`}>
                       {getStatusText(t.status)}
                     </span>
                     <div className="text-[10px] font-medium text-slate-500 mt-2 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> Requested: {t.timeAssigned}
                     </div>
                  </td>
                  <td className="py-4 px-4 text-center space-x-2 space-x-reverse">
                    {t.status === "pending" && (
                      <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                        {isAr ? "تعيين ناقل" : "Assign Porter"}
                      </button>
                    )}
                    {t.status === "in-progress" && (
                      <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {isAr ? "تأكيد وصول المريض" : "Confirm Arrival"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
