import React, { useState, useEffect } from "react";
import { User, ClipboardCheck, FileText, CheckSquare, Search, Users, AlertTriangle, FileSignature, WifiOff } from "lucide-react";
import { db } from "../firebase";

interface SupervisorDashboardProps {
  language: "ar" | "en";
}

export default function SupervisorDashboard({ language }: SupervisorDashboardProps) {
  const isAr = language === "ar";
  const [activeSubTab, setActiveSubTab] = useState<"rounding" | "reports" | "staff" | "approvals">("rounding");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(!!db);
  }, []);
  const [audits, setAudits] = useState([
    { id: 1, nameAr: "وحدة الرعاية المركزة (ICU)", nameEn: "ICU", status: "audited" },
    { id: 2, nameAr: "قسم الطوارئ", nameEn: "ER", status: "pending" },
  ]);
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, titleAr: "طلب إجازة طارئة للممرض أحمد", titleEn: "Urgent leave request - Nurse Ahmed" },
    { id: 2, titleAr: "طلب صرف مستلزمات عاجلة", titleEn: "Urgent supplies requisition" },
  ]);

  const toggleAudit = (id: number) => {
    setAudits(audits.map(a => a.id === id ? {...a, status: a.status === "audited" ? "pending" : "audited"} : a));
  };

  const tabs = [
    { id: "rounding", icon: ClipboardCheck, labelAr: "المرور والمتابعة", labelEn: "Rounds & Audit" },
    { id: "staff", icon: Users, labelAr: "التمريض والمناوبة", labelEn: "Staff & Shift" },
    { id: "reports", icon: FileText, labelAr: "التقارير", labelEn: "Reports" },
    { id: "approvals", icon: FileSignature, labelAr: "الموافقات", labelEn: "Approvals" },
  ];

  return (
    <div className="p-6 space-y-6">
      {!isOnline && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg flex items-center gap-3">
            <WifiOff /> 
            {isAr ? "تحذير: لا يوجد اتصال بقاعدة البيانات. البيانات قد تكون قديمة." : "Warning: No database connection. Data might be stale."}
          </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isAr ? "لوحة تحكم المشرف" : "Supervisor Dashboard"}</h2>
        <div className="flex gap-2">
            {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeSubTab === tab.id ? "bg-indigo-600 text-white shadow-lg" : "bg-white border hover:bg-slate-50"}`}>
                    <tab.icon size={18}/>
                    {isAr ? tab.labelAr : tab.labelEn}
                </button>
            ))}
        </div>
      </div>
      
      {activeSubTab === "rounding" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <h3 className="font-semibold text-lg">{isAr ? "جولات المرور اليومية" : "Daily Patient Rounds"}</h3>
              <p className="text-gray-500">{isAr ? "قم بتفقد الأقسام، جودة الرعاية، وتوفر التجهيزات." : "Inspect wards, care quality, and equipment availability."}</p>
              <div className="border rounded-lg p-4 space-y-3">
                  {audits.map(audit => (
                    <button key={audit.id} onClick={() => toggleAudit(audit.id)} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded w-full">
                      <span>{isAr ? audit.nameAr : audit.nameEn} - {audit.status === "audited" ? (isAr ? "تم المرور" : "Audited") : (isAr ? "بانتظار المرور" : "Pending Audit")}</span>
                      {audit.status === "audited" ? <CheckSquare className="text-emerald-500" /> : <AlertTriangle className="text-amber-500" />}
                    </button>
                  ))}
              </div>
          </div>
      )}

      {activeSubTab === "staff" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <h3 className="font-semibold text-lg">{isAr ? "نظرة عامة على المناوبة" : "Shift Overview"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border p-4 rounded-lg bg-indigo-50">
                      <div className="text-sm text-indigo-800">{isAr ? "إجمالي التمريض" : "Total Staff"}</div>
                      <div className="text-2xl font-bold">42</div>
                  </div>
                  <div className="border p-4 rounded-lg bg-emerald-50">
                      <div className="text-sm text-emerald-800">{isAr ? "المتواجدون" : "Present"}</div>
                      <div className="text-2xl font-bold text-emerald-600">40</div>
                  </div>
                  <div className="border p-4 rounded-lg bg-amber-50">
                      <div className="text-sm text-amber-800">{isAr ? "غياب/تأخير" : "Absent/Late"}</div>
                      <div className="text-2xl font-bold text-amber-600">2</div>
                  </div>
              </div>
          </div>
      )}

      {activeSubTab === "reports" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <h3 className="font-semibold text-lg">{isAr ? "تقارير الأداء" : "Performance Reports"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="border p-4 rounded-lg flex items-center gap-3 hover:bg-slate-50">
                      <FileText className="text-indigo-500"/>
                      {isAr ? "تقرير التمريض اليومي" : "Daily Nursing Report"}
                  </button>
                  <button className="border p-4 rounded-lg flex items-center gap-3 hover:bg-slate-50">
                      <FileText className="text-red-500"/>
                      {isAr ? "تقرير الحوادث" : "Incident Report"}
                  </button>
              </div>
          </div>
      )}

      {activeSubTab === "approvals" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <h3 className="font-semibold text-lg">{isAr ? "طلبات بانتظار الموافقة" : "Pending Approvals"}</h3>
              {pendingApprovals.length === 0 ? (
                <div className="text-gray-500 text-sm">{isAr ? "لا توجد طلبات معلقة حالياً." : "No pending requests."}</div>
              ) : (
                <div className="space-y-2">
                    {pendingApprovals.map(app => (
                        <div key={app.id} className="p-3 border rounded-lg flex justify-between items-center">
                            <span>{isAr ? app.titleAr : app.titleEn}</span>
                            <div className="flex gap-2">
                                <button onClick={() => setPendingApprovals(pendingApprovals.filter(a => a.id !== app.id))} className="bg-emerald-600 text-white px-3 py-1 rounded text-sm">{isAr ? "موافقة" : "Approve"}</button>
                                <button onClick={() => setPendingApprovals(pendingApprovals.filter(a => a.id !== app.id))} className="bg-red-600 text-white px-3 py-1 rounded text-sm">{isAr ? "رفض" : "Reject"}</button>
                            </div>
                        </div>
                    ))}
                </div>
              )}
          </div>
      )}
    </div>
  );
}
