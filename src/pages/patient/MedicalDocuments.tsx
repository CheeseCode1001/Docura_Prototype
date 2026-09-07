import { useRef, useState } from "react";
import { AppShell } from "@/components/layout";
import { AlertBanner, Badge, Button, Card, C, EmptyState, Input, Modal } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { MEDICAL_DOCUMENTS } from "@/data/mock";

type MedDoc = (typeof MEDICAL_DOCUMENTS)[number];
type FilterType = "all" | "Lab Result" | "Medical Report" | "Imaging";

function formatDate(date: string) { return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
function iconFor(type: string) { return type === "Lab Result" ? "LAB" : type === "Imaging" ? "IMG" : "REPORT"; }
function colorFor(type: string) { return type === "Lab Result" ? C.blue : type === "Imaging" ? C.amber : C.navy; }

export default function MedicalDocuments() {
  const { addToast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<MedDoc[]>(() => {
    const saved = window.localStorage.getItem("docura-documents");
    if (!saved) return MEDICAL_DOCUMENTS;
    try { return JSON.parse(saved) as MedDoc[]; } catch { return MEDICAL_DOCUMENTS; }
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selected, setSelected] = useState<MedDoc | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"Lab Result" | "Medical Report" | "Imaging">("Lab Result");

  const visible = documents.filter((document) => {
    const matchesFilter = filter === "all" || document.type === filter;
    const haystack = `${document.title} ${document.doctor} ${document.description}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  });

  function saveDocuments(next: MedDoc[]) {
    setDocuments(next);
    window.localStorage.setItem("docura-documents", JSON.stringify(next));
  }

  function handleFile(file: File) {
    const newDocument = {
      id: `doc-${Date.now()}`, type: uploadType, title: file.name.replace(/\.[^/.]+$/, "") || "Uploaded document", date: new Date().toISOString().slice(0, 10), doctor: "Uploaded by you", consultationId: null, status: "processing" as const, size: `${Math.max(1, Math.round(file.size / 1024))} KB`, format: file.name.split(".").pop()?.toUpperCase() || "FILE", description: "Uploaded from your Docura health records.",
    } as MedDoc;
    saveDocuments([newDocument, ...documents]);
    setUploadOpen(false);
    addToast("success", `${newDocument.title} added to your documents.`);
  }

  return (
    <AppShell role="patient" topBarTitle="Medical documents">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.amber }}>My health</p><h1 className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Medical documents</h1><p className="text-sm mt-2" style={{ color: C.muted }}>Keep reports, lab results, and imaging together for the people involved in your care.</p></div><Button onClick={() => setUploadOpen(true)}>Upload document</Button></div>
        <AlertBanner type="info" title="You control access" body="Documents are stored locally in this demo and should only be shared with doctors you authorize." />
        <div className="flex flex-col md:flex-row gap-3"><div className="flex-1"><Input value={query} onChange={setQuery} placeholder="Search documents, doctors, or descriptions" /></div><div className="flex gap-2 overflow-x-auto pb-1">{(["all", "Lab Result", "Medical Report", "Imaging"] as FilterType[]).map((item) => <button key={item} onClick={() => setFilter(item)} className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border" style={{ borderColor: filter === item ? C.navy : C.border, backgroundColor: filter === item ? C.navy : "white", color: filter === item ? "white" : C.muted }}>{item === "all" ? "All" : item}</button>)}</div></div>
        <div className="flex items-center justify-between"><p className="text-sm font-semibold" style={{ color: C.navy }}>{visible.length} document{visible.length === 1 ? "" : "s"}</p>{query && <button onClick={() => setQuery("")} className="text-xs font-semibold" style={{ color: C.amber }}>Clear search</button>}</div>
        {visible.length === 0 ? <EmptyState icon="📄" title="No documents found" body="Try another search or upload a document to start building your record." cta="Upload document" onCta={() => setUploadOpen(true)} /> : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{visible.map((document) => <Card key={document.id} className="flex flex-col gap-4"><div className="flex items-start gap-3"><div className="w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: colorFor(document.type) }}>{iconFor(document.type)}</div><div className="flex-1 min-w-0"><p className="font-bold text-sm truncate" style={{ color: C.navy }}>{document.title}</p><p className="text-xs mt-1 truncate" style={{ color: C.muted }}>{document.doctor}</p></div></div><div className="flex items-center justify-between"><span className="text-xs" style={{ color: C.muted }}>{formatDate(document.date)} · {document.format}</span><Badge variant={document.status === "uploaded" ? "green" : document.status === "processing" ? "yellow" : "red"}>{document.status}</Badge></div><p className="text-xs leading-relaxed" style={{ color: C.muted }}>{document.description}</p><Button size="sm" variant="outline" onClick={() => setSelected(document)}>View details</Button></Card>)}</div>}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || "Document details"}><div className="flex flex-col gap-4">{selected && <><div className="rounded-xl p-4" style={{ backgroundColor: C.warm }}><p className="text-sm font-semibold" style={{ color: C.navy }}>{selected.type}</p><p className="text-xs mt-1" style={{ color: C.muted }}>{formatDate(selected.date)} · {selected.size} · {selected.format}</p><p className="text-xs mt-3" style={{ color: C.label }}>{selected.description}</p></div><div className="flex flex-wrap gap-2"><Button onClick={() => addToast("success", `${selected.title} preview opened.`)}>Preview</Button><Button variant="outline" onClick={() => addToast("success", `${selected.title} download started.`)}>Download</Button><Button variant="outline" onClick={() => addToast("info", `${selected.title} is ready to share with an authorized doctor.`)}>Share</Button></div></>}</div></Modal>
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload a medical document"><div className="flex flex-col gap-4"><label className="text-sm font-semibold" style={{ color: C.navy }}>Document category<select value={uploadType} onChange={(event) => setUploadType(event.target.value as typeof uploadType)} className="mt-2 w-full rounded-xl border px-3 py-3 text-sm" style={{ borderColor: C.border }}><option>Lab Result</option><option>Medical Report</option><option>Imaging</option></select></label><input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.dicom" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleFile(file); }} /><div className="rounded-2xl border-2 border-dashed p-8 text-center" style={{ borderColor: C.border, backgroundColor: C.warm }}><p className="text-sm font-semibold" style={{ color: C.navy }}>Choose a PDF, image, or DICOM file</p><p className="text-xs mt-1 mb-4" style={{ color: C.muted }}>The file will be added to this browser's demo records.</p><Button onClick={() => fileRef.current?.click()}>Choose file</Button></div><Button variant="ghost" onClick={() => setUploadOpen(false)}>Cancel</Button></div></Modal>
    </AppShell>
  );
}