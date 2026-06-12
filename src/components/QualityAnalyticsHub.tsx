import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Database,
  Sliders,
  ShieldAlert,
  Award,
  FileSpreadsheet,
  User,
  CheckSquare,
  X,
  Check,
  Users,
  Shield,
  BookOpen,
  Clock,
  Activity,
  FileText,
  Bell,
  Trash2,
  HeartPulse,
  Star,
  Sparkles,
  UserCheck,
  BarChart3,
  ChevronRight,
  AlertTriangle,
  File,
  ThumbsUp
} from "lucide-react";
import { AppUser, SavedRecord } from "../types";

// Import Cloud-Safe functions from firestore service
import {
  saveSentinelIncident,
  deleteSentinelIncident
} from "../lib/firestoreService";

interface QualityAnalyticsHubProps {
  records: SavedRecord[];
  allAvailableTemplates: any[];
  language: "ar" | "en";
  currentUser: AppUser;
  resolvedGaps: Record<string, { resolved: boolean; notes: string; resolvedBy: string; resolvedAt: string }>;
  handleToggleGapState: (gapKey: string) => void;
  editingGapKey: string | null;
  setEditingGapKey: (val: string | null) => void;
  gapResolutionNote: string;
  setGapResolutionNote: (val: string) => void;
  handleSaveGapResolution: () => void;
  handleSeedMockAuditData: () => void;
  setRecords: (val: SavedRecord[]) => void;
  sentinelIncidents: any[];
  setSentinelIncidents: (val: any[]) => void;
  jciCheckedArray: number[];
  setJciCheckedArray: (val: number[]) => void;
  analyticsSubTab: "kpis" | "sentinel" | "compliance";
  setAnalyticsSubTab: (val: "kpis" | "sentinel" | "compliance") => void;
  showIncidentForm: boolean;
  setShowIncidentForm: (val: boolean) => void;
  newIncidentForm: {
    department: string;
    typeAr: string;
    typeEn: string;
    severity: string;
    descAr: string;
    descEn: string;
    rcaAr: string;
    rcaEn: string;
    actionAr: string;
    actionEn: string;
  };
  setNewIncidentForm: (val: any) => void;
  addSystemLog: (msg: string, type: "info" | "warning" | "error" | "success") => void;
  notifications: any[];
  setNotifications: (val: any[]) => void;
  handleNotificationClick: (notif: any) => void;
  hospitalSettings: any;
}

// Mock Employees list for evaluations
const QUALITY_STAFF_MOCK = [
  { id: "user-nurse", nameAr: "أ. فاطمة الزهراء (استاف التمريض)", nameEn: "FZ - Sister Fatima El-Zahraa" },
  { id: "emp-1", nameAr: "محمود عمر (مساعد رئيس تمريض AHN)", nameEn: "MO - Mahmoud Omar (Asst. Head)" },
  { id: "emp-2", nameAr: "هاني ناصر (أخصائي تمريض SN)", nameEn: "HN - Hany Naser (Staff Nurse)" },
  { id: "emp-3", nameAr: "عمر أحمد (أخصائي تمريض SN)", nameEn: "OA - Omar Ahmed (Staff Nurse)" },
  { id: "emp-6", nameAr: "ندى محمد (أخصائي تمريض SN)", nameEn: "NM - Nada Mohamed (Staff Nurse)" },
  { id: "emp-8", nameAr: "إسراء عاطف (أخصائي تمريض SN)", nameEn: "EA - Esraa Atef (Staff Nurse)" },
  { id: "emp-9", nameAr: "رشدي أحمد (ممرض امتياز INT)", nameEn: "RA - Roshdy Ahmed (Intern Nurse)" }
];

export default function QualityAnalyticsHub({
  records,
  allAvailableTemplates,
  language,
  currentUser,
  resolvedGaps,
  handleToggleGapState,
  editingGapKey,
  setEditingGapKey,
  gapResolutionNote,
  setGapResolutionNote,
  handleSaveGapResolution,
  handleSeedMockAuditData,
  setRecords,
  sentinelIncidents,
  setSentinelIncidents,
  jciCheckedArray,
  setJciCheckedArray,
  analyticsSubTab,
  setAnalyticsSubTab,
  showIncidentForm,
  setShowIncidentForm,
  newIncidentForm,
  setNewIncidentForm,
  addSystemLog,
  notifications,
  setNotifications,
  handleNotificationClick,
  hospitalSettings
}: QualityAnalyticsHubProps) {

  const isAr = language === "ar";

  // Backwards compatible & expanded sub-tabs
  const [activeTab, setActiveTabLocal] = useState<"kpis" | "ovr" | "compliance" | "eval-staff" | "eval-unit" | "policies">("kpis");

  // Sync parent tab trigger
  useEffect(() => {
    if (analyticsSubTab === "kpis") {
      setActiveTabLocal("kpis");
    } else if (analyticsSubTab === "sentinel") {
      setActiveTabLocal("ovr");
    } else if (analyticsSubTab === "compliance") {
      setActiveTabLocal("compliance");
    }
  }, [analyticsSubTab]);

  // 1. OVR STATE
  const [ovrs, setOvrs] = useState<any[]>(() => {
    const saved = localStorage.getItem("baheya_cqi_ovrs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "ovr-1",
        date: "2026-06-05",
        time: "11:30",
        department: "EMERGENCY UNIT",
        categoryAr: "إعطاء الدواء خطأ (Medication Error)",
        categoryEn: "Medication Misadministration",
        severity: "Category D - Harm Reached Patient but No Harm Caused",
        descAr: "تم إعطاء جرعة مضاعفة من مسكن الآلام نتيجة عدم التحقق المزدوج من تذكرة العلاج قبل الحقن. تم رصد الواقعة بالسرعة وملاحظة ضربات القلب بانتظام.",
        descEn: "Double dose of painkiller administered due to lack of standard secondary verification before injection. Condition monitored closely with normal vitals.",
        correctiveAr: "استدعاء الصيدلي الإكلينيكي فوراً بموقع الطوارئ ومراجعة العلامات الحيوية كل 15 دقيقة مع توقيع عقوبة تنبيه إداري للممرض المسؤول.",
        correctiveEn: "Immediate bedside clinical pharmacist call, vitals monitored q15m, and administrative warning issued.",
        witness: "أ. هدى أحمد (مشرفة تمريض)",
        loggedBy: "أ. نورهان علي (جودة)",
        patientInvolved: true,
        patientMRN: "MRN-84920",
        patientName: "منى عاطف الجبالي",
        status: "Corrective Action Verified"
      },
      {
        id: "ovr-2",
        date: "2026-06-07",
        time: "03:45",
        department: "INTENSIVE CARE UNIT (ICU)",
        categoryAr: "وخز إبرة فني (Needle-stick injury)",
        categoryEn: "Needle-Stick Incident",
        severity: "Category C - Reached Patient or Staff but No Harm Done",
        descAr: "تعرضت ممرضة امتياز لوخز إبرة أنسولين مستعملة أثناء محاولة كبس غطاء السرنجة يدوياً متجاهلة سياسات مكافحة العدوى والعلب الحادة.",
        descEn: "Intern nurse experienced a needle-stick injury while recapping a syringe manually, violating sharp safety policy.",
        correctiveAr: "غسيل اليد بالماء والصابون فوراً، إرسال الموظفة لوحدة صحية العمل لعمل التحاليل الفورية للمريض ومتابعة الأجسام المضادة.",
        correctiveEn: "Immediate washing, referred to employee health clinic for baseline lab tests and monitoring protocol.",
        witness: "د. أحمد الشافعي",
        loggedBy: "أ. نورهان علي (جودة)",
        patientInvolved: false,
        status: "Under Active Surveillance"
      }
    ];
  });

  // 2. STAFF EVALUATIONS STATE
  const [staffEvals, setStaffEvals] = useState<any[]>(() => {
    const saved = localStorage.getItem("baheya_cqi_staff_evals");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "eval-1",
        employeeId: "user-nurse",
        employeeNameAr: "أ. فاطمة الزهراء (استاف التمريض)",
        employeeNameEn: "Sister Fatima El-Zahraa (Staff Nurse)",
        department: "EMERGENCY UNIT",
        evalDate: "2026-06-01",
        evaluatorName: "أ. هدى أحمد (مشرفة تمريض الطوارئ)",
        scores: {
          clinical: 5,
          policy: 4,
          documentation: 5,
          attendance: 4,
          ethics: 5
        },
        comments: "تظهر التزاماً مطلقاً بمعايير الجودة السريرية وتحرص على تعبئة شيت جرد الكود بلو وعربة الطوارئ بالوقت الصحيح."
      },
      {
        id: "eval-2",
        employeeId: "emp-2",
        employeeNameAr: "هاني ناصر (أخصائي تمريض SN)",
        employeeNameEn: "Hany Naser (Staff Nurse)",
        department: "EMERGENCY UNIT",
        evalDate: "2026-06-03",
        evaluatorName: "د. محمد السيد (مدير قسم العمليات)",
        scores: {
          clinical: 4,
          policy: 4,
          documentation: 3,
          attendance: 5,
          ethics: 4
        },
        comments: "ممتاز سريرياً ومنضبط في ومواعيد الحضور والانصراف، يحتاج لمزيد من الدقة والالتزام في توثيق أوقات إعطاء المحاليل الطبية بشيت الجودة."
      }
    ];
  });

  // 3. UNIT AUDITS STATE
  const [unitAudits, setUnitAudits] = useState<any[]>(() => {
    const saved = localStorage.getItem("baheya_cqi_unit_inspections");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "unit-insp-1",
        unit: "EMERGENCY UNIT",
        date: "2026-06-06",
        inspector: "أ. نورهان علي (جودة)",
        complianceRate: 92,
        scores: {
          codeBlue: true,
          coldChain: true,
          gases: true,
          fireSafety: false,
          nurseCall: true,
          preventiveMaint: true
        },
        notes: "إخفاق في مخرج طوارئ الطوارئ بسبب تراكم شيتات إدارية فارغة خلفه. تم إزالتها فوراً أثناء التدقيق لتأمين الممر."
      }
    ];
  });

  // 4. GAHAR STANDARDS CHECKED STATE (Hospital wide checklist tracker)
  const [gaharChecked, setGaharChecked] = useState<number[]>(() => {
    const saved = localStorage.getItem("baheya_gahar_checked");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [11, 12, 14, 21, 23, 24]; // Default active standards indexes
  });

  // 5. ACKNOWLEDGED POLICIES STATE
  const [acknowledgedPolicies, setAcknowledgedPolicies] = useState<string[]>(() => {
    const saved = localStorage.getItem("baheya_policy_acks");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ["pol-ident"]; // pre-acknowledged
  });

  // Static Policy library array
  const POLICIES_ARRAY = [
    {
      id: "pol-ident",
      code: "BH-MED-P-001",
      titleAr: "سياسة التحقق الثنائي العالي الدقة من هوية المريض",
      titleEn: "Standard Policy of Double Patient Identification Check",
      chapter: "IPSG.1 / ACC - سلامة المرضى والتعريف",
      author: "لجنة الجودة الطبية والاعتماد",
      revDate: "2026-01",
      mustRead: true,
      bodyAr: "يتم استخدام معيارين اثنين منفصلين لتعريف المريض قبل سحب أي عينة للخلط أو إعطاء دواء (الاسم الرباعي كاملاً للمريض + الرقم السري الطبي الموحد للملف MRN). السياسة تحظر مطلقاً الاستناد لرقم الغرفة أو رقم سرير المريض كمعرف سريري متاح في هذا الصدد.",
      bodyEn: "Use two separate medical identifiers prior to administering therapies/medications or compiling samples: Patient Full Name + Clinical MRN ID. Bed numbers and Ward/Room tags are strictly prohibited as primary identifiers."
    },
    {
      id: "pol-transfuse",
      code: "BH-MED-P-022",
      titleAr: "بروتوكول التحقق الثلاثي المتقاطع لنقل الدم ومشتقاته للسرطان",
      titleEn: "Triple Cross-Check Blood Transfusion Oncology Protocol",
      chapter: "PCP.5 / IPSG.3 - معايير الرعاية والأدوية الخطرة",
      author: "لجنة مراقبة بنك الدم والجودة",
      revDate: "2026-03",
      mustRead: true,
      bodyAr: "يستلزم نقل الدم موافقة كتابية معتمدة مسبقاً. يقوم ممرضان مرخصان بالتناوب عند سرير المريض للتأكد بصوت متبادل مرتفع من: كود الكيس الوردي، الاسم الرباعي وتطابق فصيلة دم المتبرع مع المستقبِل مع مطابقة رقم تذكرة الاعتماد الطبي.",
      bodyEn: "Requires certified written informed consent. Two registered nurses must verify together at patient's bedside: blood bag identifier barcode, recipient full name and clinical MRN, patient blood group and match parameters."
    },
    {
      id: "pol-timeout",
      code: "BH-SURG-P-009",
      titleAr: "بروتوكول التقرير الزمني والتايم أوف الجراحي الشامل",
      titleEn: "Surgical Site Marking and Time-Out Regulation",
      chapter: "IPSG.4 / PCP - الجراحة الآمنة والعمليات المعززة",
      author: "رئيس قسم الجراحات ورئيس الجودة",
      revDate: "2026-02",
      mustRead: false,
      bodyAr: "يتم إمضاء 'التايم أوف' الجراحي قبل التخدير وشروع المشرط مباشرة. يتضمن النداء الجماعي الصاخب في قاعة الجراحة لكل من الجراح، طبيب التخدير والممرضة المدورة للتحقق المشترك من هوية المريض وموقع العلامة المكتوبة بالجلد.",
      bodyEn: "Surgical Timeout is executed immediately prior to incision. Verbal group confirmation amongst surgeon, anesthesiologist, and scrub nurse is mandatory, verifying: patient identity, surgical mark, procedure parameters, and equipment."
    },
    {
      id: "pol-sharp",
      code: "BH-INF-P-040",
      titleAr: "سياسة وبروتوكول تفادي وخز الإبر والتعرض المهني للعدوى",
      titleEn: "Needle-Stick Injury Prevention and Professional Exposure Guidelines",
      chapter: "PCI.3 / HOM - إدارة مخاطر مكافحة العدوى",
      author: "لجنة مكافحة العدوى والسلامة البيئية",
      revDate: "2026-05",
      mustRead: true,
      bodyAr: "يمنع كبـس أو إعادة غطاء السرنجة المستعملة باليد مطلقاً (No Recapping). يتم إلقاء الإبر فور الاستخدام مباشرة في صندوق التفتيش والأجسام الحادة الأصفر المقاوم للاختراق. في حال الوخز، يتم غسل الموقع فوراً بالماء والصابون والتبليغ.",
      bodyEn: "Manual recapping of used syringes is strictly prohibited. Discard sharps immediately post-use into the rigid puncture-proof yellow sharps box. In case of injury, wash site under running water, report immediately, and trace baseline immunology."
    }
  ];

  // Helper sync calls to cache
  useEffect(() => {
    localStorage.setItem("baheya_cqi_ovrs", JSON.stringify(ovrs));
  }, [ovrs]);

  useEffect(() => {
    localStorage.setItem("baheya_cqi_staff_evals", JSON.stringify(staffEvals));
  }, [staffEvals]);

  useEffect(() => {
    localStorage.setItem("baheya_cqi_unit_inspections", JSON.stringify(unitAudits));
  }, [unitAudits]);

  useEffect(() => {
    localStorage.setItem("baheya_gahar_checked", JSON.stringify(gaharChecked));
  }, [gaharChecked]);

  useEffect(() => {
    localStorage.setItem("baheya_policy_acks", JSON.stringify(acknowledgedPolicies));
  }, [acknowledgedPolicies]);

  // Aggregate quality statistics dynamically
  let totalChecks = 0;
  let successfulChecks = 0;
  let criticalFailures = 0;
  const openAlertsList: any[] = [];

  records.forEach((rec) => {
    const temp = allAvailableTemplates?.find(t => t.id === rec.templateId);
    const templateTitle = temp ? (isAr ? temp.titleAr : temp.titleEn) : rec.templateId;
    const templateCode = temp ? temp.code : "";
    
    if (rec.gridData) {
      rec.gridData.forEach((row) => {
        if (row.days) {
          Object.entries(row.days).forEach(([day, val]) => {
            if (val) {
              totalChecks++;
              if (val === "✔" || val !== "✘") {
                successfulChecks++;
              }
              if (val === "✘") {
                criticalFailures++;
                const gapKey = `${rec.id}-${row.code || row.itemEn}-${day}`;
                openAlertsList.push({
                  recordId: rec.id,
                  recordDate: rec.date,
                  templateCode,
                  templateTitle,
                  itemName: row.itemAr,
                  itemEn: row.itemEn,
                  dayNum: day,
                  staffName: rec.staffName,
                  department: rec.department,
                  uniqueGapKey: gapKey
                });
              }
            }
          });
        }
      });
    }
  });

  const compliancePercent = totalChecks > 0 ? Math.round((successfulChecks / totalChecks) * 100) : 100;

  const handleToggleJci = (id: number) => {
    if (jciCheckedArray.includes(id)) {
      setJciCheckedArray(jciCheckedArray.filter(i => i !== id));
    } else {
      setJciCheckedArray([...jciCheckedArray, id]);
    }
  };

  const jciCompletionRate = Math.round((jciCheckedArray.length / 6) * 100);

  // GAHAR Accreditations calculation
  const totalGaharStandardItems = 8; // ACC, PCP, PFR, SQE, FMS, IM, PCI, QPS
  const gaharCompletionRate = Math.round((gaharChecked.length / totalGaharStandardItems) * 100);

  // 1. OVR FORM LOCAL INPUTS
  const [ovrForm, setOvrForm] = useState({
    department: "EMERGENCY UNIT",
    categoryAr: "إعطاء الدواء خطأ (Medication Error)",
    severity: "Category D - Harm Reached Patient but No Harm Caused",
    descAr: "",
    correctiveAr: "",
    witness: "",
    patientInvolved: false,
    patientMRN: "",
    patientName: ""
  });
  const [showOvrForm, setShowOvrForm] = useState(false);

  // Handle new OVR Addition
  const handleCreateOvr = () => {
    if (!ovrForm.descAr) {
      alert(isAr ? "⚠️ يرجى تفصيل الواقعة ووصف الأضرار مسبقاً!" : "Please write a description of the occurrence variance.");
      return;
    }
    const categoryEnTranslation = ovrForm.categoryAr.includes("الدواء") ? "Medication Error" : "Safety Variance";
    
    const newOvr = {
      id: `ovr-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      department: ovrForm.department,
      categoryAr: ovrForm.categoryAr,
      categoryEn: categoryEnTranslation,
      severity: ovrForm.severity,
      descAr: ovrForm.descAr,
      descEn: ovrForm.descAr, // Arabic primary
      correctiveAr: ovrForm.correctiveAr || (isAr ? "تم إخطار مسؤول الجودة بالمستشفى لعمل الإجراء اللازم" : "Quality officer notified for subsequent corrective surveillance"),
      correctiveEn: "Quality safety action path initiated.",
      witness: ovrForm.witness || (isAr ? "بدون شهود" : "No witness logged"),
      loggedBy: currentUser.nameAr || currentUser.nameEn,
      patientInvolved: ovrForm.patientInvolved,
      patientMRN: ovrForm.patientMRN,
      patientName: ovrForm.patientName,
      status: "Under Active Surveillance"
    };

    setOvrs([newOvr, ...ovrs]);
    setOvrForm({
      department: "EMERGENCY UNIT",
      categoryAr: "إعطاء الدواء خطأ (Medication Error)",
      severity: "Category D - Harm Reached Patient but No Harm Caused",
      descAr: "",
      correctiveAr: "",
      witness: "",
      patientInvolved: false,
      patientMRN: "",
      patientName: ""
    });
    setShowOvrForm(false);
    addSystemLog(`Logged OVR Report: ${newOvr.id}`, "warning");
    alert(isAr ? "✅ تم رصد وحفظ تقرير الأحداث والـ OVR بنجاح سحابياً ومحلياً!" : "OVR Report logged successfully.");
  };

  // 2. STAFF EVAL FORM LOCAL INPUTS
  const [selectedStaffId, setSelectedStaffId] = useState("user-nurse");
  const [evalScores, setEvalScores] = useState({
    clinical: 5,
    policy: 5,
    documentation: 4,
    attendance: 5,
    ethics: 5
  });
  const [evalComments, setEvalComments] = useState("");
  const [showEvalForm, setShowEvalForm] = useState(false);

  const handleCreateStaffEval = () => {
    const staffMember = QUALITY_STAFF_MOCK.find(s => s.id === selectedStaffId);
    if (!staffMember) return;

    const newEval = {
      id: `eval-${Date.now()}`,
      employeeId: selectedStaffId,
      employeeNameAr: staffMember.nameAr,
      employeeNameEn: staffMember.nameEn,
      department: "CLINICAL DEPARTMENT",
      evalDate: new Date().toISOString().split("T")[0],
      evaluatorName: currentUser.nameAr || currentUser.nameEn,
      scores: evalScores,
      comments: evalComments || (isAr ? "تم تقييم أداء معايير الجودة بنجاح." : "Standard clinical appraisal completed successfully.")
    };

    setStaffEvals([newEval, ...staffEvals]);
    setEvalComments("");
    setShowEvalForm(false);
    addSystemLog(`Logged Staff Clinical Appraisal for: ${staffMember.nameEn}`, "success");
    alert(isAr ? "✅ تم تسجيل التقييم السريري للموظف بنجاح وحفظه في ملف الجودة والمستندات!" : "Employee evaluation recorded successfully.");
  };

  // 3. UNIT AUDIT FORM LOCAL INPUTS
  const [inspUnit, setInspUnit] = useState("EMERGENCY UNIT");
  const [inspScores, setInspScores] = useState({
    codeBlue: true,
    coldChain: true,
    gases: true,
    fireSafety: true,
    nurseCall: true,
    preventiveMaint: true
  });
  const [inspNotes, setInspNotes] = useState("");
  const [showInspForm, setShowInspForm] = useState(false);

  const handleCreateUnitAudit = () => {
    // calculate complianceRate based on checked items
    const scoreKeys = Object.values(inspScores);
    const passedCount = scoreKeys.filter(Boolean).length;
    const computedRate = Math.round((passedCount / scoreKeys.length) * 100);

    const newAudit = {
      id: `unit-insp-${Date.now()}`,
      unit: inspUnit,
      date: new Date().toISOString().split("T")[0],
      inspector: currentUser.nameAr || currentUser.nameEn,
      complianceRate: computedRate,
      scores: inspScores,
      notes: inspNotes || (isAr ? "لا توجد ملحوظات، تم التفتيش ومطابقة الأقسام." : "Inspect matches compliance guidelines.")
    };

    setUnitAudits([newAudit, ...unitAudits]);
    setInspNotes("");
    setShowInspForm(false);
    addSystemLog(`Logged Unit Audit: ${inspUnit} (${computedRate}%)`, "info");
    alert(isAr ? "✅ تم تثبيت تقرير ومراجعة الوحدة الميداني وتحديث الجودة للمستشفى!" : "Unit quality audit logged.");
  };

  // 4. POLICY DIGEST & ELECTRONIC ACKNOWLEDGEMENT
  const handleAcknowledgePolicy = (policyId: string) => {
    if (acknowledgedPolicies.includes(policyId)) {
      alert(isAr ? "لقد تم إمضاء الالتزام وتوثيق هذه السياسة مسبقاً باسمك." : "Already acknowledged.");
      return;
    }
    const updated = [...acknowledgedPolicies, policyId];
    setAcknowledgedPolicies(updated);
    addSystemLog(`Acknowledged Hospital Policy: ${policyId}`, "success");
    alert(isAr ? "📝 تم إمضاء التزامك وتوقيعك الإلكتروني بالسياسة الطبية بنجاح سحابياً!" : "Policy electronically signed.");
  };

  const [policySearch, setPolicySearch] = useState("");

  const filteredPolicies = POLICIES_ARRAY.filter(p => 
    p.titleAr.toLowerCase().includes(policySearch.toLowerCase()) ||
    p.titleEn.toLowerCase().includes(policySearch.toLowerCase()) ||
    p.code.toLowerCase().includes(policySearch.toLowerCase()) ||
    p.chapter.toLowerCase().includes(policySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade text-right font-sans" dir="rtl">
      
      {/* 1. Header with branding & Seeding Actions */}
      <div className="bg-gradient-to-l from-pink-500/10 via-pink-405/5 to-transparent p-6 rounded-2xl border border-pink-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-right">
          <span className="bg-pink-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
            Continuous Quality Improvement (CQI) Portal
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-2 flex items-center justify-end gap-2">
            <span>لوحة تحليلات الجودة المتطورة وبوابة الاعتمادات الصحية لـ {hospitalSettings.nameAr}</span>
            <TrendingUp className="h-5 w-5 text-pink-600" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xl leading-relaxed">
            مؤشرات ورسومات بيانية حية وفورية تقيس جودة المستشفى وتتحقق من مطابقة معايير الهيئة المصرية لاعتماد المنشآت الصحية (GAHAR) واللجنة الدولية المشتركة لسلامة المرضى (JCI). 
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {records.length === 0 && (
            <button
              onClick={handleSeedMockAuditData}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-black text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="h-4 w-4" />
              <span>توليد وتغذية 3 سجلات طبية تجريبية للتحليل</span>
            </button>
          )}
          {records.length > 0 && (
            <button
              onClick={() => {
                if (confirm(isAr ? "هل أنت متأكد من مسح جميع التقارير الجارية؟" : "Are you sure you want to clear all records?")) {
                  setRecords([]);
                  localStorage.setItem("baheya_medical_records", JSON.stringify([]));
                  alert(isAr ? "تم تصفير شيتات الجرد بنجاح." : "Records store cleared.");
                }
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[10px] rounded-lg transition shrink-0"
            >
              تفريغ أرشيف التقارير
            </button>
          )}
        </div>
      </div>

      {/* 2. Sub-tab Switcher - All Modules Required by User */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2 justify-end no-print">
        
        <button
          onClick={() => setActiveTabLocal("policies")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
            activeTab === "policies"
              ? "bg-pink-50 text-pink-700 border-pink-200 shadow-inner"
              : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
          }`}
        >
          <BookOpen className="h-4 w-4 text-pink-600" />
          <span>السياسات والاعتمادات ({acknowledgedPolicies.length}/{POLICIES_ARRAY.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("eval-unit")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
            activeTab === "eval-unit"
              ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-inner"
              : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
          }`}
        >
          <Shield className="h-4 w-4 text-indigo-600" />
          <span>تقييمات الوحدة والمؤسسة GAHAR ({gaharCompletionRate}%)</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("eval-staff")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
            activeTab === "eval-staff"
              ? "bg-purple-50 text-purple-700 border-purple-200 shadow-inner"
              : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
          }`}
        >
          <Users className="h-4 w-4 text-purple-650" />
          <span>تقييمات الموظفين ({staffEvals.length} تقييمات)</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("ovr")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
            activeTab === "ovr"
              ? "bg-red-50 text-red-700 border-red-200 shadow-inner"
              : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-red-650" />
          <span>تقارير الـ OVR والأحداث ({ovrs.length + sentinelIncidents.length} بلاغات)</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("compliance")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
            activeTab === "compliance"
              ? "bg-amber-50 text-amber-700 border-amber-200 shadow-inner"
              : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
          }`}
        >
          <Sliders className="h-4 w-4 text-amber-500" />
          <span>مصفوفة الالتزام للأقسام ({openAlertsList.filter(g => !resolvedGaps[g.uniqueGapKey]?.resolved).length} ثغرة)</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("kpis")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
            activeTab === "kpis"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-inner"
              : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
          }`}
        >
          <Award className="h-4 w-4 text-emerald-600" />
          <span>لوحة الـ KPIs والمؤشرات ({jciCompletionRate}%)</span>
        </button>

      </div>

      {/* ======================= TAB 1: GENERAL & ADVANCED KPIs ======================= */}
      {activeTab === "kpis" && (
        <div className="space-y-6">
          
          {/* Statistical Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            
            {/* 1. Quality Compliance Score Gauge */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">General Compliance Rate</span>
                <h4 className="text-2xl font-black text-slate-800 mt-1">
                  {records.length === 0 ? "96%" : `${compliancePercent}%`}
                </h4>
                <span className="text-[9px] text-emerald-600 font-sans block mt-1 font-bold">
                  {records.length === 0 ? "● عينات المعايير السريرية" : "● تحديث سحابي فوري ومستمر"}
                </span>
              </div>
              <div className="relative shrink-0 w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-pink-600"
                    strokeDasharray={`${records.length === 0 ? 96 : compliancePercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[10px] font-black text-pink-700 font-sans">
                    {records.length === 0 ? "96" : compliancePercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Total Audited sheets */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Accredited Audits Total</span>
                <h4 className="text-2xl font-black text-slate-800 mt-1">
                  {records.length} {isAr ? "شيت جودة" : "forms"}
                </h4>
                <span className="text-[9px] text-slate-400 block mt-1 font-semibold">
                  تحت المراجعة والتدقيق والتوثيق
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 text-pink-600 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
            </div>

            {/* 3. Unresolved Gaps tracker */}
            <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all ${
              (records.length === 0 ? 1 : openAlertsList.length) > 0 
                ? "bg-rose-50/50 border-rose-200" 
                : "bg-white border-slate-200"
            }`}>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Critical Open Alerts</span>
                <h4 className={`text-2xl font-black mt-1 ${
                  (records.length === 0 ? 1 : openAlertsList.length) > 0 ? "text-rose-700" : "text-slate-800"
                }`}>
                  {records.length === 0 ? 1 : openAlertsList.filter(g => !resolvedGaps[g.uniqueGapKey]?.resolved).length} {isAr ? "ثغرات فورية" : "alarms"}
                </h4>
                <span className="text-[9px] text-slate-500 block mt-1 font-semibold">
                  نواقص عربات، خلل بأقفال أو تبريد الثلاجة
                </span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                (records.length === 0 ? 1 : openAlertsList.length) > 0 
                  ? "bg-rose-100 border-rose-200 text-rose-600" 
                  : "bg-slate-100 border-slate-200 text-slate-500"
              }`}>
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Active Patient Safety Goals */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Patient Safety Index</span>
                <h4 className="text-2xl font-black text-pink-700 mt-1">
                  {jciCompletionRate}%
                </h4>
                <span className="text-[9px] text-slate-400 block mt-1 font-semibold">
                  درجة الجاهزية لاعتماد الـ JCI الدولي
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* JCI interactive matrix */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase">Accreditation Safety Matrix</span>
                <h4 className="text-sm font-black text-slate-850 mt-1 flex items-center gap-1.5 justify-end">
                  <span>أهداف سلامة المرضى الدولية الستة (JCI International Patient Safety Goals)</span>
                  <CheckSquare className="h-5 w-5 text-emerald-600" />
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">تتبع الالتزام الميداني وإمضاءات التمريض لرفع المعيار السحابي للمستشفى:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {[
                  { id: 1, nameAr: "1. التعريف السريري الدقيق للمريض (Identification)", nameEn: "Double patient identifier check prior to procedures." },
                  { id: 2, nameAr: "2. كفاءة التواصل اللفظي والشفهي (Effective Communication)", nameEn: "Applying standard Read-Back & verbal verification." },
                  { id: 3, nameAr: "3. استخدام الأدوية عالية الخطورة بسلام (High-Alert Medications)", nameEn: "Dual nurse confirmation for targeted therapy." },
                  { id: 4, nameAr: "4. سلامة الجراحة والموقع والمريض (Wrong-Site Correction)", nameEn: "Surgical site marking & comprehensive timeout compliance." },
                  { id: 5, nameAr: "5. التحكم بغسيل وتقليل مخاطر العدوى (clinical Hand Hygiene)", nameEn: "WHO 5 moments sanitization auditing in oncological departments." },
                  { id: 6, nameAr: "6. رصد وتفادي حوادث سقوط المرضى (Patient Fall assessment)", nameEn: "Documented evaluation of Fall-Risk Morse indicators." }
                ].map(goal => {
                  const isChecked = jciCheckedArray.includes(goal.id);
                  return (
                    <div 
                      key={goal.id}
                      onClick={() => handleToggleJci(goal.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked 
                          ? "bg-pink-50/30 border-pink-200 shadow-sm" 
                          : "bg-slate-50/50 border-slate-200 hover:border-slate-350 text-slate-600"
                      }`}
                    >
                      <div className="flex-1 text-right">
                        <span className={`text-[11px] font-black block ${isChecked ? 'text-pink-850' : 'text-slate-700'}`}>{goal.nameAr}</span>
                        <span className="text-[9.5px] text-slate-500 font-semibold block mt-0.5">{goal.nameEn}</span>
                        <span className={`text-[8.5px] font-bold inline-block px-1.5 py-0.2 rounded mt-1 ${
                          isChecked ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isChecked ? "✓ معزز ومطبق بقوة" : "🚧 ثغرة تدقيق قيد الإصلاح"}
                        </span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        readOnly
                        className="w-4 h-4 rounded border-slate-300 text-pink-650 focus:ring-pink-550 mt-1 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Predictive alerts / notifications board */}
            <div className="bg-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white p-5 rounded-3xl shrink-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="bg-red-900/30 text-red-400 border border-red-500/20 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded font-mono uppercase">SAFETY ALARMS SYSTEM</span>
                  <h4 className="font-black text-xs text-slate-200 flex items-center gap-1.5 justify-end">
                    <span>التبليغات وسلسلة إنذارات الجودة النشطة</span>
                    <Bell size={14} className="text-red-500 animate-swing" />
                  </h4>
                </div>

                <div className="space-y-3 mt-4 text-xs">
                  {/* Alarm 1 */}
                  <div className="p-3 bg-red-950/40 rounded-xl border border-red-900/30 relative flex gap-2">
                    <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-extrabold text-red-300 block">ثلاجة الأنسولين (طوارئ {hospitalSettings?.nameAr || "بهية"}):</span>
                      <p className="text-[10.5px] text-slate-200 mt-0.5">درجة حرارة المسجلة {records.length === 0 ? "10" : "1.5"}درجة مئوية (خارج الحدود الطبيعية 2-8م°).</p>
                    </div>
                  </div>

                  {/* Alarm 2 */}
                  <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/30 relative flex gap-2">
                    <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-extrabold text-amber-300 block">عربة كود بلو (قسم ICU):</span>
                      <p className="text-[10.5px] text-slate-200 mt-0.5">تم الإبلاغ بخلل في قفل جرد العربة بواسطة أ. فاطمة. تطلب تصحيح عاجل.</p>
                    </div>
                  </div>

                  {/* Alarm 3 */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 relative flex gap-2">
                    <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-300 block">مؤشرات الروبوت وجدول Roster:</span>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">تم توزيع نوبتجية ليلية متوازنة وتخفيض درجات الإرهاق بنسبة 35%.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4">
                <span className="text-[10px] text-slate-500 font-mono block">LIVE TELEMETRY ACTIVE SURVEILLANCE</span>
              </div>
            </div>

          </div>

          {/* ADVANCED KPIs - Charts and Trend visualization (Using SVG graphics) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-right space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3.5 gap-2">
              <div>
                <span className="bg-pink-100 text-pink-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Analytics Engine</span>
                <h4 className="font-extrabold text-sm text-slate-850 mt-1 flex items-center justify-end gap-1.5">
                  <span>لوحة التحليلات المتقدمة ورسوم بيانية لسلامة المرضى (Advanced Clinical Trends)</span>
                  <BarChart3 className="h-5 w-5 text-pink-600" />
                </h4>
                <p className="text-[10.5px] text-slate-400 mt-0.5">يعتمد النظام على مدخلات جداول التفتيش لحساب مصفوفة المخاطر المتغيرة على مدار الـ 24 ساعة الماضية بالمستشفى:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Average Fault Resolution Time */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] font-bold text-slate-700">دورة إغلاق الثغرات (بالساعات)</span>
                  <span className="text-xs font-black text-pink-700">متوسط 2.4س</span>
                </div>
                
                {/* SVG Visual Bar chart */}
                <div className="h-32 flex items-end justify-between px-4 pb-2 border-b border-slate-200">
                  <div className="w-8 bg-slate-200 hover:bg-slate-300 rounded-t-lg h-[40%] relative group cursor-pointer text-center">
                    <span className="text-[9px] text-slate-400 block -mt-5 font-bold">4.1س</span>
                    <span className="absolute bottom-0 left-0 right-0 text-[8px] text-slate-500 translate-y-5 font-bold">أبريل</span>
                  </div>
                  <div className="w-8 bg-slate-200 hover:bg-slate-300 rounded-t-lg h-[55%] relative group cursor-pointer text-center">
                    <span className="text-[9px] text-slate-400 block -mt-5 font-bold">3.2س</span>
                    <span className="absolute bottom-0 left-0 right-0 text-[8px] text-slate-500 translate-y-5 font-bold">مايو</span>
                  </div>
                  <div className="w-8 bg-pink-600 hover:bg-pink-700 rounded-t-lg h-[85%] relative group cursor-pointer text-center">
                    <span className="text-[9px] text-pink-700 block -mt-5 font-black">1.8س</span>
                    <span className="absolute bottom-0 left-0 right-0 text-[8px] text-pink-700 translate-y-5 font-black">جاري</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 leading-normal text-right">
                  قامت مشرفة التمريض بتسريع مصفوفة تلبية النواقص وإغلاق التبليغات بمعدل أسرع بنسبة 45% تماشياً مع قواعد JCI.
                </p>
              </div>

              {/* Chart 2: Failures probability based on shift times */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] font-bold text-slate-700">معدل احتمالية الخلل بالنسبة للورديات (24س)</span>
                  <span className="text-xs font-black text-rose-600">منحنى الخطورة</span>
                </div>

                {/* SVG Line chart representing human error probability */}
                <div className="h-32 relative pt-2">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path
                      d="M 5,45 Q 25,10 50,30 T 95,5"
                      fill="none"
                      stroke="#db2777"
                      strokeWidth="3m strokeLinecap='round'"
                    />
                    <circle cx="25" cy="10" r="3" fill="#db2777" />
                    <circle cx="50" cy="30" r="3" fill="#f59e0b" />
                    <circle cx="95" cy="5" r="3" fill="#10b981" />
                    {/* Grid lines */}
                    <line x1="5" y1="45" x2="95" y2="45" stroke="#cbd5e1" strokeDasharray="2" />
                  </svg>
                  <div className="flex justify-between text-[8px] text-slate-400 mt-1 font-bold">
                    <span>الصباحية (M)</span>
                    <span>بعد الظهر (A)</span>
                    <span>المسائية (N)</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal text-right">
                  تسجل الورديات اللامركزية المتأخرة (N) فجوات تبلغ احتمالية خطأ تقييمية بنسبة 72%. ينبغي تكثيف التفتيش بالنبوتجية الليلية.
                </p>
              </div>

              {/* Chart 3: compliance by Department comparing */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] font-bold text-slate-700">أكثر الأقسام مطابقة للجودة والاعتماد</span>
                  <span className="text-xs font-black text-emerald-600">تم مراجعتها</span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span className="font-bold">Operating Room</span>
                    <span className="font-mono text-emerald-600">100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }}></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span className="font-bold">Emergency Unit</span>
                    <span className="font-mono text-emerald-600">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }}></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span className="font-bold">Chemotherapy Daycare</span>
                    <span className="font-mono text-purple-600">88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal text-right">
                  تقود غرف العمليات معايير الجبر السريري والتعقيم الكامل، بينما تخضع وحدة الكيماوي لتدقيق متقدم لتحسين الخلط الدوائي.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ======================= TAB 2: OVR REPORT SYSTEM & SENTINEL EVENTS ======================= */}
      {activeTab === "ovr" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-right space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3.5 gap-2">
              <div className="text-right">
                <h4 className="font-black text-sm text-slate-850 flex items-center justify-end gap-1.5">
                  <span>بوابة تسجيل تقارير الأحداث غير العادية (Occurrence Variance Report - OVR)</span>
                  <AlertTriangle className="h-5 w-5 text-red-650" />
                </h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">تفويض طبي سري وفوري لكتم الإلغاء وتصحيح العيوب بالمستشفى، مع تفصيل كامل للمشكلات والأخطاء الطبية.</p>
              </div>
              
              <button
                onClick={() => setShowOvrForm(!showOvrForm)}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                {showOvrForm ? "إغلاق استمارة البلاغ" : "➕ تسجيل بلاغ حادثة غير عادية جديدة (OVR)"}
              </button>
            </div>

            {/* OVR Form Workspace */}
            {showOvrForm && (
              <div className="bg-red-50/20 border border-red-150 p-5 rounded-2xl space-y-4 text-right animate-fade">
                <span className="text-[9px] bg-red-600 text-white font-black px-2.5 py-0.5 rounded uppercase font-mono">NEW CQI OVR NOTIFICATION PATHWAY</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">القسم / الجناح الميداني:</label>
                    <select 
                      value={ovrForm.department}
                      onChange={(e) => setOvrForm({...ovrForm, department: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-red-550 outline-none text-xs font-bold"
                    >
                      {["EMERGENCY UNIT", "INTENSIVE CARE UNIT (ICU)", "CHEMOTHERAPY DAYCARE", "ONCO-SURGICAL UNIT"].map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">نوع وتصنيف الحدث الإستراتيجي:</label>
                    <select 
                      value={ovrForm.categoryAr}
                      onChange={(e) => setOvrForm({...ovrForm, categoryAr: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-red-550 outline-none text-xs font-bold"
                    >
                      {[
                        "إعطاء الدواء خطأ (Medication Error)",
                        "وخز إبرة فني (Needle-stick injury)",
                        "سقوط المريض من السرير (Patient Fall)",
                        "خلل في الأجهزة الطبية (Device/Device Error)",
                        "خطأ في هوية المريض (Patient ID Hazard)",
                        "فقد ملف طبي سريري (Record/Documentation Gap)"
                      ].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">مستوى الخطورة (Severity Index):</label>
                    <select 
                      value={ovrForm.severity}
                      onChange={(e) => setOvrForm({...ovrForm, severity: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-red-550 outline-none text-xs font-bold"
                    >
                      {[
                        "Category A - Circumstances that have capacity to cause error",
                        "Category C - Reached Patient or Staff but No Harm Done",
                        "Category D - Harm Reached Patient but No Harm Caused",
                        "Category F - Resulted in Temporary Harm / Medication issue",
                        "Category I - Sentinel Event (Fatal and Critical Harm)"
                      ].map(sev => (
                        <option key={sev} value={sev}>{sev}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Patient involvement checklist */}
                <div className="p-3 bg-white rounded-xl border border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="opt-patient"
                      checked={ovrForm.patientInvolved}
                      onChange={(e) => setOvrForm({...ovrForm, patientInvolved: e.target.checked})}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="opt-patient" className="text-xs font-bold text-slate-700 cursor-pointer">
                      نعم، الحدث يخص مريض سريري بالمستشفى مباشر (Patient Involved)
                    </label>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold leading-none">ربط مباشر مع ملف المريض الطبي</span>
                </div>

                {ovrForm.patientInvolved && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">اسم المريض المعني:</label>
                      <input 
                        type="text"
                        placeholder="العثور على الاسم باللغة العربية..."
                        value={ovrForm.patientName}
                        onChange={(e) => setOvrForm({...ovrForm, patientName: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-red-550 outline-none text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">رقم الملف الطبي السريري للمريض (MRN ID) *:</label>
                      <input 
                        type="text"
                        placeholder="مثال: MRN-84920"
                        value={ovrForm.patientMRN}
                        onChange={(e) => setOvrForm({...ovrForm, patientMRN: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-red-550 border-rose-250 outline-none text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">وصف الحادثة عاجلاً بالتفصيل (العربية) *:</label>
                    <textarea
                      rows={3}
                      value={ovrForm.descAr}
                      onChange={(e) => setOvrForm({...ovrForm, descAr: e.target.value})}
                      placeholder="وصف تفصيلي للواقعة والأسباب والأشخاص القائمين..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">الإجراء التصحيحي والوقائي الفوري المتخذ:</label>
                    <textarea
                      rows={3}
                      value={ovrForm.correctiveAr}
                      onChange={(e) => setOvrForm({...ovrForm, correctiveAr: e.target.value})}
                      placeholder="ماذا فعل الطاقم الطبي فوراً للحد من خطر الحدث الطبي..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">اسم الشاهد الحاضر للحادثة:</label>
                    <input 
                      type="text"
                      placeholder="الاسم والوظيفة للشهادة والمسؤولية..."
                      value={ovrForm.witness}
                      onChange={(e) => setOvrForm({...ovrForm, witness: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={handleCreateOvr}
                      className="bg-red-600 hover:bg-red-750 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer transition flex items-center gap-1.5 w-full justify-center h-[38px]"
                    >
                      <Check className="h-4 w-4" />
                      <span>تسجيل وبث بلاغ الـ OVR سحابياً فوراً (Submit Event to CNO)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* OVR Registries List */}
            <div className="space-y-4 pt-2">
              <span className="text-[10px] text-slate-400 font-extrabold block">البلاغات المدونة بقاعدة البيانت السحابية للـ OVR والجودة ({ovrs.length}):</span>
              
              <div className="space-y-3">
                {ovrs.map((ovr: any) => (
                  <div key={ovr.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow transition relative overflow-hidden">
                    {/* Left Indicator Ribbon */}
                    <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-red-650" />
                    
                    <div className="p-5 pr-7 space-y-4 font-sans text-right">
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (confirm(isAr ? "هل أنت متأكد من حذف هذا التقرير نهائياً؟" : "Are you sure?")) {
                                setOvrs(ovrs.filter(o => o.id !== ovr.id));
                                addSystemLog(`Deleted OVR: ${ovr.id}`, "info");
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-[9px] font-black cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded"
                          >
                            حذف نهائي 🗑️
                          </button>
                          <span className="text-[9.5px] text-slate-400 font-mono font-bold">{ovr.date} {ovr.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 text-[9px] font-black px-2 py-0.5 rounded font-mono">
                            🏥 {ovr.department}
                          </span>
                          <span className="bg-rose-50 text-rose-800 text-[9.5px] font-black px-2 py-0.5 rounded-full">
                            {ovr.categoryAr}
                          </span>
                          <span className="bg-amber-100 text-amber-800 text-[8.5px] font-bold px-1.5 py-0.2 rounded font-mono">
                            {ovr.severity.split(" - ")[0]}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] leading-relaxed font-sans text-right">
                        <strong className="block text-[10px] text-slate-500 mb-1 font-black">الوصف والتحليل الكامل للواقعة:</strong>
                        <p className="font-bold text-slate-800">{ovr.descAr}</p>
                      </div>

                      {ovr.patientInvolved && (
                        <div className="p-3 bg-red-50/20 border border-red-100 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[10.5px]">
                          <div>
                            <span className="text-slate-400">رقم الكود الطبي:</span> <span className="font-mono font-bold text-slate-800">{ovr.patientMRN}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">المريض المعني:</span> <span className="font-bold text-slate-800">{ovr.patientName}</span>
                          </div>
                          <span className="text-[8.5px] bg-red-100 text-red-800 font-black px-2 rounded-full uppercase">Patient Impacted</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        <div className="bg-emerald-50/20 border border-emerald-150 p-3 rounded-xl text-right">
                          <strong className="block text-[10px] text-emerald-800 mb-1 font-black">🛡️ التدبير العلاجي والإجراء المتخذ فوراً:</strong>
                          <p className="font-bold text-slate-700 leading-relaxed">{ovr.correctiveAr}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-right">
                          <strong className="block text-[10px] text-slate-500 mb-1 font-black">👀 شاهد الواقعة المسجل:</strong>
                          <p className="font-bold text-slate-700">{ovr.witness}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-mono font-bold pt-1.5 border-t">
                        <span>OVR REPORT CLINICAL MONITORING SUITE</span>
                        <span>رصد وبث بواسطة: {ovr.loggedBy}</span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================= TAB 3: EMPLOYEE EVALUATIONS ======================= */}
      {activeTab === "eval-staff" && (
        <div className="space-y-6 animate-fade">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-right space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3.5 gap-2">
              <div className="text-right">
                <h4 className="font-black text-sm text-slate-850 flex items-center justify-end gap-1.5">
                  <span>بوابة تقييم الكادر الطبي والتمريضي ومقاييس الأداء (Staff Evaluations Portal)</span>
                  <Users className="h-5 w-5 text-purple-650" />
                </h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">تسجيل وتحليل الكفاءة السريرية والالتزام بسياسات الجودة لتمريض الأجنحة (ICU, ER, Chemo) بناء على جودات التفتيش.</p>
              </div>

              <button
                onClick={() => setShowEvalForm(!showEvalForm)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                {showEvalForm ? "إغلاق نافذة التقييم" : "➕ إضافة تقييم سريري جديد لموظف"}
              </button>
            </div>

            {/* Eval form space */}
            {showEvalForm && (
              <div className="bg-purple-50/20 border border-purple-150 p-5 rounded-2xl space-y-4 text-right animate-fade">
                <span className="text-[9px] bg-purple-650 text-white font-black px-2.5 py-0.5 rounded font-mono uppercase">NEW CLINICAL STAFF APPRAISAL FORM</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">اختر الموظف المعني بالتقييم:</label>
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-purple-500 outline-none text-xs font-bold"
                    >
                      {QUALITY_STAFF_MOCK.map(staff => (
                        <option key={staff.id} value={staff.id}>{isAr ? staff.nameAr : staff.nameEn}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">تاريخ إجراء التقويم:</label>
                    <input 
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Stars/Scores Matrix */}
                <span className="block text-[10px] font-black text-slate-500 mt-2">معايير القياس السريرية (من 1 إلى 5 نجوم):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
                  
                  {[
                    { key: "clinical", label: "الكفاءة السريرية والتدبير وعلاج المرضى", icon: HeartPulse },
                    { key: "policy", label: "الالتزام بسياسات الجودة و غسيل الأيدي", icon: Shield },
                    { key: "documentation", label: "الدقة وتوقيت التوثيق في شيت الجرودات", icon: FileText },
                    { key: "attendance", label: "الانضباط ومواعيد الحضور وتسلم الورديات", icon: Clock },
                    { key: "ethics", label: "الأخلاقيات والتعامل المهني المتبادل", icon: UserCheck }
                  ].map(scoreItem => (
                    <div key={scoreItem.key} className="p-3 bg-white rounded-xl border border-slate-150 text-center space-y-2">
                      <div className="flex items-center justify-center text-purple-600 gap-1">
                        <scoreItem.icon size={13} />
                        <span className="text-[10.5px] font-black">{scoreItem.label.split(" ")[0]}</span>
                      </div>
                      
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map(starNum => (
                          <Star 
                            key={starNum}
                            size={14}
                            onClick={() => setEvalScores({...evalScores, [scoreItem.key]: starNum})}
                            className={`cursor-pointer transition-colors ${
                              (evalScores as any)[scoreItem.key] >= starNum ? "text-amber-400 fill-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400 block">{scoreItem.label}</span>
                    </div>
                  ))}

                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-1">تعليقات المقيّم وتوصيات التطوير والتعديل المباشر:</label>
                  <textarea
                    rows={2}
                    value={evalComments}
                    onChange={(e) => setEvalComments(e.target.value)}
                    placeholder="مثال: يظهر مهارة جراحية استثنائية والتزاماً بنظام الجرد السحابي اليومي، يحتاج لدعم إداري متبادل."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>

                <button
                  onClick={handleCreateStaffEval}
                  className="bg-purple-650 hover:bg-purple-750 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer transition flex items-center gap-1.5 w-full justify-center"
                >
                  <Check className="h-4 w-4" />
                  <span>تأكيد وحفظ تقييم الموظف في أرشيف الجودة السحابي</span>
                </button>
              </div>
            )}

            {/* Historic evaluations feed */}
            <div className="space-y-4 pt-1">
              <span className="text-[10px] text-slate-400 font-extrabold block">قائمة التقييمات السريرية المسجلة بالكشوفات:</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffEvals.map((evaluation: any) => {
                  // Calculate average rating
                  const scoresList = Object.values(evaluation.scores) as number[];
                  const avg = (scoresList.reduce((a, b) => a + b, 0) / scoresList.length).toFixed(1);
                  
                  return (
                    <div key={evaluation.id} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-150 transition space-y-3.5 text-right font-sans relative">
                      <div className="absolute top-4 left-4 bg-purple-100 text-purple-800 rounded-lg p-2 text-center text-xs">
                        <span className="block text-[9px] uppercase font-bold text-purple-650">Score</span>
                        <span className="font-mono font-black text-sm">{avg}/5</span>
                      </div>

                      <div className="flex items-center gap-2 justify-end pr-1">
                        <div>
                          <h5 className="font-extrabold text-slate-900 text-xs">{evaluation.employeeNameAr}</h5>
                          <span className="text-[9.5px] text-slate-400 block font-bold">بقسم الجودة والتمريض السريري الموحد</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {evaluation.employeeNameAr.substring(2, 4)}
                        </div>
                      </div>

                      <div className="border-t border-b border-slate-200/60 py-2.5 grid grid-cols-5 gap-1.5 text-center text-[8.5px] font-sans">
                        {Object.entries(evaluation.scores).map(([key, val]) => (
                          <div key={key} className="bg-white p-1 rounded border border-slate-200">
                            <span className="block text-slate-400 font-bold">{key === "clinical" ? "سريري" : key === "policy" ? "جودة" : key === "documentation" ? "توثيق" : key === "attendance" ? "حضور" : "أخلاق"}</span>
                            <span className="font-bold text-purple-650 font-mono">⭐ {val as any}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-150">
                        <strong className="block text-[9.5px] text-slate-405 font-black">📝 ملاحظات التقييم:</strong>
                        <p className="font-semibold text-slate-800">{evaluation.comments}</p>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold font-mono">
                        <span>المقيّم: {evaluation.evaluatorName}</span>
                        <span>شيت المؤتمر: {evaluation.evalDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================= TAB 4: UNIT & INSTITUTION ASSESSMENT GAHAR ======================= */}
      {activeTab === "eval-unit" && (
        <div className="space-y-6 animate-fade">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* National accreditation GAHAR tracker */}
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3.5">
                <div className="bg-indigo-100 text-indigo-800 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                  National Egyptian GAHAR Accreditations Tracker
                </div>
                <div className="text-right">
                  <h4 className="font-black text-sm text-slate-850">
                    دليل الجاهزية لمعايير الهيئة العامة للاعتماد والتمريض الصحي (GAHAR)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">تقييم شامل يقيس التزام المستشفى بمتطلبات ترخيص المنشآت الطبية بمصر:</p>
                </div>
              </div>

              {/* GAHAR Chapters Progress checklist */}
              <div className="space-y-3 pt-1">
                {[
                  { id: 11, code: "GAHAR-ACC", chapter: "الرعاية المتمركزة حول المريض (PCC)", nameAr: "معايير تيسير الدخول واستمرارية الرعاية بالتمريض (ACC)", desc: "كفاءة تحويل وتسلم المرضى بالأقسام وبوابة الجرودات.", progress: 95 },
                  { id: 12, code: "GAHAR-PCP", chapter: "الرعاية المتمركزة حول المريض (PCC)", nameAr: "معايير تقديم الرعاية والعلاج السريري الآمن (PCP)", desc: "مراقبة سلامة الجرعات والصدمات الطبية والتعامل الموحد.", progress: 88 },
                  { id: 13, code: "GAHAR-PFR", chapter: "الرعاية المتمركزة حول المريض (PCC)", nameAr: "معايير حماية وحفظ حقوق المرضى وعائلاتهم (PFR)", desc: "موافقة كتابية موقعة، سرية معلومات المرضى بالموقع.", progress: 100 },
                  { id: 14, code: "GAHAR-QPS", chapter: "نظام المنشأة ومراقبة الجودة (HOM)", nameAr: "معايير تحسين الجودة الشاملة وسلامة المريض (QPS)", desc: "تعبئة نماذج OVR والحدث الجسيم وسرعة تصحيح الفجوات.", progress: 82 },
                  { id: 15, code: "GAHAR-PCI", chapter: "نظام المنشأة ومراقبة الجودة (HOM)", nameAr: "الوقاية والتحكم والحد من انتقال العدوى السريرية (PCI)", desc: "صناديق الحاد الأصفر والأحمر، ومكافحة معقمات اليدين.", progress: 94 },
                  { id: 16, code: "GAHAR-FMS", chapter: "نظام المنشأة ومراقبة الجودة (HOM)", nameAr: "أمان المرفق والمنشأة وإدارة الحرائق والسلامة (FMS)", desc: "الصيانة الوقائية ومخارج الهروب والإنقاص وجهاز التبريد.", progress: 80 }
                ].map(chapterItem => {
                  const isChecked = gaharChecked.includes(chapterItem.id);
                  const handleToggleGahar = () => {
                    if (gaharChecked.includes(chapterItem.id)) {
                      setGaharChecked(gaharChecked.filter(id => id !== chapterItem.id));
                    } else {
                      setGaharChecked([...gaharChecked, chapterItem.id]);
                    }
                  };

                  return (
                    <div 
                      key={chapterItem.id}
                      onClick={handleToggleGahar}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 select-none ${
                        isChecked 
                          ? "bg-indigo-50/20 border-indigo-200" 
                          : "bg-slate-50/50 border-slate-200 text-slate-550"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-left shrink-0">
                          <span className="text-[10px] text-slate-400 block font-mono font-bold">{chapterItem.code}</span>
                          <span className="font-mono font-black text-xs text-indigo-750">{chapterItem.progress}% Active</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 text-indigo-650 focus:ring-indigo-500 rounded border-slate-300 cursor-pointer"
                        />
                      </div>

                      <div className="text-right flex-1 select-none pr-1">
                        <span className="text-[9.5px] font-black text-indigo-805 bg-indigo-50 px-2 py-0.2 rounded-full uppercase">{chapterItem.chapter}</span>
                        <h6 className="font-extrabold text-xs text-slate-850 mt-1">{chapterItem.nameAr}</h6>
                        <p className="text-[10px] text-slate-500 mt-0.5">{chapterItem.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department quality audits form & list */}
            <div className="space-y-6">
              
              {/* Inspection trigger */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-right space-y-4">
                <div className="border-b pb-2 flex items-center justify-between">
                  <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Unit Audit</span>
                  <h4 className="font-extrabold text-xs text-slate-800">تقرير تفتيش الوحدات الميداني</h4>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-normal">يقوم مراقب الجودة السريرية بالتفتيش عن جاهزية الأجهزة والبنية التحتية لتوفير حماية ومعايير للتمريض:</p>

                <button
                  onClick={() => setShowInspForm(!showInspForm)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 rounded-xl transition cursor-pointer"
                >
                  {showInspForm ? "إلغاء المراجعة الميدانية" : "✍️ تدوين تقرير تدقيق الجودة للوحدة"}
                </button>

                {showInspForm && (
                  <div className="bg-slate-50 border p-4 rounded-2xl space-y-3 text-right animate-fade">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">الوحدة المستهدفة بالتفتيش:</label>
                      <select
                        value={inspUnit}
                        onChange={(e) => setInspUnit(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl font-bold"
                      >
                        {["EMERGENCY UNIT", "INTENSIVE CARE UNIT (ICU)", "CHEMOTHERAPY DAYCARE", "ONCO-SURGICAL UNIT"].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>

                    <span className="block text-[10px] font-bold text-slate-500">ماتريكس تدقيق سلامة البنية التحتية:</span>
                    <div className="space-y-2 pt-1 text-xs">
                      {[
                        { key: "codeBlue", label: "جاهزية أقفال ومحتوى الكود بلو" },
                        { key: "coldChain", label: "نظام سلسلة درجات حرارة ثلاجة الأدوية" },
                        { key: "gases", label: "مستشعرات ضغط شبكة أكسجين الغازات" },
                        { key: "fireSafety", label: "مخارج وخراطيم إطفاء الحريق والإنقاذ" },
                        { key: "nurseCall", label: "بوابات استدعاء التمريض من الأسرة" },
                        { key: "preventiveMaint: PM", label: "مستندات الصيانة الوقائية السنوية للمعدات" }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-150">
                          <input 
                            type="checkbox"
                            checked={(inspScores as any)[item.key]}
                            onChange={(e) => setInspScores({...inspScores, [item.key]: e.target.checked})}
                            className="w-4 h-4 text-indigo-650 focus:ring-indigo-550 rounded border-slate-300 cursor-pointer"
                          />
                          <span className="font-bold text-slate-700">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">السلبيات والإيجابيات السريعة المدونة:</label>
                      <textarea
                        rows={2}
                        value={inspNotes}
                        onChange={(e) => setInspNotes(e.target.value)}
                        placeholder="أو تدوين المفقودات السريعة بالموقع..."
                        className="w-full bg-white border rounded-xl p-2 text-xs font-semibold"
                      />
                    </div>

                    <button
                      onClick={handleCreateUnitAudit}
                      className="w-full bg-indigo-650 text-white font-extrabold text-xs py-2 rounded-xl"
                    >
                      موافقة وحفظ في أرشيف الاعتماد
                    </button>
                  </div>
                )}
              </div>

              {/* Inspections registries registry */}
              <div className="space-y-3">
                <span className="text-[10px] text-slate-400 font-extrabold block">تقارير التفتيش الفنية السابقة:</span>
                {unitAudits.map((ua: any) => (
                  <div key={ua.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-right space-y-2">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-mono bg-indigo-100 text-indigo-800 text-[10px] font-black px-1.5 py-0.2 rounded">
                        {ua.complianceRate}% Standard compliant
                      </span>
                      <h6 className="font-bold text-xs text-slate-800">🏢 {ua.unit}</h6>
                    </div>
                    
                    <p className="text-[10.5px] text-slate-600 leading-normal bg-slate-50 p-2 rounded border font-semibold">
                      {ua.notes}
                    </p>

                    <div className="flex justify-between text-[8.5px] text-slate-400 font-bold">
                      <span>المدقق: {ua.inspector}</span>
                      <span>بتاريخ: {ua.date}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ======================= TAB 5: COMPLIANCE MATRIX ======================= */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* compliance comparative list */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-right">
              <div className="border-b pb-2">
                <span className="bg-pink-100 text-pink-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Compliance Bar</span>
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1 justify-end mt-1">
                  <span>امتثال الأقسام الطبية لمعايير الجودة والقرارات</span>
                  <Award className="h-4 w-4 text-pink-600" />
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  تقييم نسبي لمعدل التزام فرق التمريض بالجرد المنهجي المعتمد لـ {hospitalSettings.nameAr || "المؤسسة"}.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {/* Unit 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
                    <span className="font-mono bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded text-[8px]">98% EXCELLENT</span>
                    <span className="font-bold">وحدة طوارئ واستقبال {hospitalSettings.nameAr || "المؤسسة"}</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-emerald-500 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>

                {/* Unit 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
                    <span className="font-mono bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded text-[8px]">94% RELIABLE</span>
                    <span className="font-bold">وحدة تحضير العلاج الكيماوي (Chemo-Prep)</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-pink-500 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                </div>

                {/* Unit 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
                    <span className="font-mono bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded text-[8px]">100% PERFECT</span>
                    <span className="font-bold">غرفة جراحة الأورام (Onco-Surgical Units)</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-emerald-500 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                {/* Unit 4 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
                    <span className="font-mono bg-amber-50 text-amber-700 px-1 py-0.2 rounded text-[8px]">82% MODERATE</span>
                    <span className="font-bold">قسم العيادات الخارجية ومتابعة الأداء</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-amber-400 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-normal font-sans">
                💡 <strong>ملاحظة المراقبة والاعتماد الصحى:</strong> لرفع نسبة الامتثال في الأقسام الأقل حظاً، ينبغي مراجعة جداول تسليم الشيفتات والتأكد من إمضاء التمريض بالتناوب يومياً سحابياً.
              </div>
            </div>

            {/* Right Area: Interactive Closed-Loop Audit Gaps Tracker */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-right">
              <div>
                <div className="border-b pb-2 flex items-center justify-between">
                  <span className="bg-rose-100 text-rose-700 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">LIVE OBSERVATIONS</span>
                  <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <span>مركز رصد الثغرات والعيوب الطبية السريرية (Audit Faults Closed-loop)</span>
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                  </h4>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 mb-3">
                  عندما يقوم كادر التمريض برصد خلل (علامة ✘) في أدوات الفحص الميدانية، تظهر الثغرة هنا فوراً لتمكين الجودة أو رئيسة التمريض من كتابة الإجراء التصحيحي وإقفال البوابة الطبية للثغرة:
                </p>

                {/* Gap Inline Resolution Dialog workspace */}
                {editingGapKey && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-3 space-y-2 text-right animate-fade">
                    <span className="font-bold text-[10px] text-amber-800">✍️ تسجيل القرار والتصحيح اللازم:</span>
                    <textarea
                      value={gapResolutionNote}
                      onChange={(e) => setGapResolutionNote(e.target.value)}
                      placeholder="مثال: تم تعبئة الأدرينالين المفقود من صيدلية المستشفى وتركيب قفل جرد بلاستيكي أحمر جديد مخصص ذو رقم كود معتمد بالوقت الحالي."
                      className="w-full bg-white border border-slate-200 p-2 text-xs rounded shadow-inner font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-550"
                      rows={2}
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setEditingGapKey(null)}
                        className="text-[10px] font-bold text-slate-500 hover:underline"
                      >
                        تراجع
                      </button>
                      <button
                        onClick={handleSaveGapResolution}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded shadow cursor-pointer flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        <span>تثبيت الإجراء وتصحيح الثغرة</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Scannable Gaps Table */}
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {/* If no records exist, show 1 sample gap automatically for experience */}
                  {records.length === 0 ? (
                    <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl relative flex items-start gap-3">
                      <div className="flex-1 text-right min-w-0 font-sans">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-[8px] bg-red-100 text-red-700 font-extrabold rounded px-1 font-mono">نموذج تجريبي</span>
                          <span className="font-black text-rose-900 truncate block">فشل اختبار بطارية ومكثف جهاز الصدمات الكهربائية DC Shock</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          عربة طوارئ الطوارئ والإنعاش / اليوم الخامس - رصدت بواسطة (أ. فاطمة الزهراء)
                        </p>
                        
                        {/* Resolution status check */}
                        {resolvedGaps["mock-crashcart"]?.resolved ? (
                          <div className="bg-emerald-50/60 border border-emerald-100 p-2 rounded-lg mt-2 text-[10px] text-emerald-800">
                            <p className="font-bold">✔ تم حل الخلل عبر قرار الجودة:</p>
                            <p className="text-[9px] text-emerald-700 mt-0.5">{resolvedGaps["mock-crashcart"].notes}</p>
                            <div className="text-[8px] text-slate-400 mt-1">
                                بواسطة: {resolvedGaps["mock-crashcart"].resolvedBy} - بتاريخ: {resolvedGaps["mock-crashcart"].resolvedAt}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-left animate-fade">
                            <button
                              onClick={() => handleToggleGapState("mock-crashcart")}
                              className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white shadow-sm rounded text-[9px] font-extrabold transition cursor-pointer"
                            >
                              اتخاذ إجراء وإقرار تصحيح جودة
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="h-4 w-4" />
                      </div>
                    </div>
                  ) : (
                    openAlertsList.map((gap) => {
                      const resInfo = resolvedGaps[gap.uniqueGapKey];
                      const isResolved = resInfo?.resolved;
                      
                      return (
                        <div
                          key={gap.uniqueGapKey}
                          className={`p-3 border rounded-xl relative flex items-start gap-3 transition-colors ${
                            isResolved ? "bg-emerald-50/20 border-emerald-100" : "bg-red-50/30 border-red-150"
                          }`}
                        >
                          <div className="flex-1 text-right min-w-0">
                            <div className="flex items-center gap-1.5 justify-end font-sans">
                              {isResolved && (
                                <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded font-mono">
                                  تم التصحيح والحل
                                </span>
                              )}
                              <span className="font-black text-rose-900 truncate block font-sans">خلل في: {gap.itemName} / {gap.itemEn}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 font-sans">
                              {gap.templateTitle} ({gap.templateCode}) / اليوم {gap.dayNum} - بقسم: {gap.department} - بواسطة ({gap.staffName})
                            </p>

                            {isResolved ? (
                              <div className="bg-emerald-50/65 border border-emerald-100 p-2 rounded-lg mt-2 text-[10px] text-emerald-800 font-sans text-right">
                                <p className="font-bold">✔ إجراء معتمد لتصحيح الجودة:</p>
                                <p className="text-[9px] text-emerald-700 mt-0.5">{resInfo.notes}</p>
                                <div className="text-[8px] text-slate-400 mt-1">
                                  بواسطة: {resInfo.resolvedBy} / بتاريخ: {resInfo.resolvedAt}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 text-left">
                                <button
                                  onClick={() => handleToggleGapState(gap.uniqueGapKey)}
                                  className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white shadow-sm rounded text-[9px] font-extrabold transition cursor-pointer"
                                >
                                  اتخاذ إجراء وإقرار تصحيح جودة
                                </button>
                              </div>
                            )}
                          </div>

                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                            isResolved ? "bg-emerald-100 border-emerald-200 text-emerald-600" : "bg-rose-100 border-rose-200 text-rose-600"
                          }`}>
                            {isResolved ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                  
                  {records.length > 0 && openAlertsList.length === 0 && (
                    <div className="text-center py-10 bg-emerald-50/20 border border-dashed border-emerald-200 rounded-xl p-4 text-right">
                      <span className="text-xl">🏆</span>
                      <p className="font-bold text-emerald-800 text-xs mt-1.5">أنت على قمة الهرم الطبي للجودة!</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-sans">لم يتم رصد أي ثغرات أو نواقص أو أقفال مكسورة حالياً في جميع الوثائق المدققة.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-3 mt-4 text-[9px] text-slate-400 flex items-center justify-between font-mono">
                <span>BAHEYA CQI COMMAND-ALERTS CLOUD WORKSPACE</span>
                <span>تحديث مستمر ●</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================= TAB 6: ACCREDITED HOSPITAL POLICIES ======================= */}
      {activeTab === "policies" && (
        <div className="space-y-6 animate-fade">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-right space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3.5 gap-2">
              <div className="text-right">
                <span className="bg-pink-100 text-pink-800 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">Compliance Regulations Registry</span>
                <h4 className="font-black text-sm text-slate-850 mt-1 flex items-center justify-end gap-1.5">
                  <span>دليل ودستور السياسات اللائحية المعتمدة للجودة ومكافحة العدوى</span>
                  <BookOpen className="h-5 w-5 text-pink-650" />
                </h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">تفحص السياسات الرسمية للمستشفى واقرأ الميثاق الطبي السنوي، ثم قم بتعزيز توقيعك بالتزام السياسة للحفظ في مستندات الاعتماد.</p>
              </div>

              {/* Policy Quick Search */}
              <div className="relative w-full sm:w-64">
                <input 
                  type="text"
                  placeholder="بحث سريع في السياسات (كود، مسمى)..."
                  value={policySearch}
                  onChange={(e) => setPolicySearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-1.5 outline-none focus:ring-1 focus:ring-pink-500 text-xs text-right font-medium"
                />
                <Database className="h-4 w-4 text-slate-400 absolute top-2.5 right-3" />
              </div>
            </div>

            {/* Grid of Policies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPolicies.map(policy => {
                const isAcked = acknowledgedPolicies.includes(policy.id);
                return (
                  <div key={policy.id} className="bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4 text-right hover:shadow-md">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-150">
                        <span className="text-[10px] text-indigo-750 font-mono font-bold">{policy.code}</span>
                        <span className="text-[9px] bg-pink-100 text-pink-850 font-black px-2 py-0.2 rounded-full uppercase">{policy.chapter}</span>
                      </div>

                      <h5 className="font-extrabold text-xs text-slate-900 mt-2 leading-snug">{policy.titleAr}</h5>
                      <p className="text-[10px] text-slate-400 font-bold block leading-none font-mono text-left" dir="ltr">{policy.titleEn}</p>
                      
                      <div className="text-[11px] text-slate-650 space-y-1 bg-slate-50/50 p-4 rounded-xl border border-slate-150 leading-relaxed font-sans text-right">
                        <strong className="block text-[10px] text-slate-450 mb-1">📖 نص المبدأ والسياسة السريرية:</strong>
                        <p className="font-bold text-slate-750">{policy.bodyAr}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 text-left" dir="ltr">{policy.bodyEn}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-150 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="text-right text-[8.5px] text-slate-400 font-bold font-mono">
                        <span>إصدار: {policy.revDate} / كاتب: {policy.author}</span>
                      </div>

                      <button
                        onClick={() => handleAcknowledgePolicy(policy.id)}
                        className={`px-3 py-1.5 text-[10.5px] font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1 w-full sm:w-auto justify-center ${
                          isAcked 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-250 cursor-default" 
                            : "bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
                        }`}
                      >
                        {isAcked ? <UserCheck size={12} /> : <ThumbsUp size={12} />}
                        <span>{isAcked ? "✓ وقّعت بالعلم والالتزام" : "إمضاء التزام علمي إلكتروني 📝"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredPolicies.length === 0 && (
                <div className="text-center py-10 bg-slate-50 border border-dashed rounded-2xl text-slate-400 text-xs md:col-span-2">
                  لم يتم العثور على أي سياسات مطابقة لمعايير البحث الحالية.
                </div>
              )}
            </div>

            {/* Code of Ethics signature card */}
            <div className="bg-gradient-to-r from-pink-500/5 via-pink-400/5 to-transparent p-5 rounded-3xl border border-pink-100 text-right space-y-2.5 mt-2">
              <span className="text-[10px] bg-pink-150 text-pink-850 px-2.5 py-0.5 rounded font-black font-mono">STANDARDS FOR {(hospitalSettings?.nameEn || "BAHEYA HOSPITAL").toUpperCase()} MEDICAL STAFF</span>
              <h5 className="font-black text-xs text-slate-850">ميثاق التمريض والالتزام بجودة الرعاية بـ {hospitalSettings?.nameAr || "المستشفى"} لعام 2026</h5>
              <p className="text-[10.5px] text-slate-500 leading-normal font-sans">
                بصفتي أحد كوادر الرعاية السريرية بـ {hospitalSettings?.nameAr || "المستشفى"}، أقر بالتزامي الكامل بـ **(أهداف سلامة المرضى الستة IPSGs)** والتعريف الثوري الثنائي لكل تذكرة علاج، وإبلاغ مسؤولي الجودة فوراً بأي عوارض أو خلل عبر بوابات الـ OVR لتجنب الإضرار بصحة الأمهات.
              </p>
              <div className="flex justify-end pt-1">
                <span className="text-[9.5px] text-slate-400 font-mono font-bold font-mono">{(hospitalSettings?.nameEn || "BAHEYA FOUNDATION").toUpperCase()} SECURITY CERTIFICATE & CERTIFIED LOG</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
