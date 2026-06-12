import React, { useState } from "react";
import { Search, Save, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";

interface MedicationLedgerProps {
  language: "ar" | "en";
}

export default function MedicationLedger({ language }: MedicationLedgerProps) {
  const isAr = language === "ar";
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [medication, setMedication] = useState<any>(null);  
  const [error, setError] = useState<string | null>(null);

  const analyzeMedication = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setMedication(null);
    try {
        const response = await fetch("/api/ai/analyze-medication", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ search_query: query }),
        });
        const data = await response.json();
        if (data.success) {
            setMedication(data.medication);
        } else {
            setError(data.error || (isAr ? "حدث خطأ غير متوقع." : "An unexpected error occurred."));
        }
    } catch (e) {
        setError(isAr ? "تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً." : "Failed to connect to server. Please try again later.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">{isAr ? "سجل ذكاء الأدوية" : "Medication Intelligence Ledger"}</h2>
        
        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow border flex gap-2">
            <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border p-3 rounded-lg"
                placeholder={isAr ? "اكتب اسم الدواء هنا (سيقوم النظام بتصحيحه وتصنيفه تلقائياً)..." : "Enter medication name (AI will auto-correct & classify)..."}
            />
            <button 
                onClick={analyzeMedication}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin"/> : <Search size={20}/>}
                {isAr ? "فحص وتصنيف" : "Analyze"}
            </button>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
                <AlertTriangle size={20}/>
                <p className="text-sm font-medium">{error}</p>
            </div>
        )}

        {medication && (
            <div className="bg-white p-6 rounded-xl shadow border space-y-6 animate-in fade-in zoom-in duration-300">
                <h3 className="text-xl font-semibold">
                    {medication.search_result.corrected_name_trade} 
                    {medication.search_result.is_corrected && <span className="text-sm text-gray-500 ml-2">({isAr ? "تم التصحيح" : "Corrected"})</span>}
                </h3>

                {/* Labels */}
                <div className="flex gap-4">
                    {medication.required_labels.high_alert_status.is_high_alert && (
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                            <AlertTriangle size={20}/> High-Alert
                        </div>
                    )}
                    {medication.required_labels.lasa_status.has_lasa_risk && (
                        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                            <AlertCircle size={20}/> LASA Risk
                        </div>
                    )}
                </div>
                
                {/* Guidelines */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="border p-4 rounded-lg">
                        <h4 className="font-semibold">{isAr ? "طرق الإعطاء" : "Administration Routes"}</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {medication.clinical_guidelines.administration_routes.map((r: string, i: number) => <li key={i}>{r}</li>)}
                        </ul>
                     </div>
                     <div className="border p-4 rounded-lg">
                        <h4 className="font-semibold">{isAr ? "مراقبة العلامات الحيوية" : "Vitals to Monitor"}</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {medication.clinical_guidelines.vital_signs_to_monitor.map((r: string, i: number) => <li key={i}>{r}</li>)}
                        </ul>
                     </div>
                </div>

                <button className="bg-emerald-600 text-white w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-emerald-700">
                    <Save /> {isAr ? "اعتماد الدواء وإضافته" : "Approve and Add"}
                </button>
            </div>
        )}
    </div>
  );
}
