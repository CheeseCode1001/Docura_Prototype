import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Button, Card, Badge, Modal, AlertBanner, EmptyState, Divider } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { MEDICAL_DOCUMENTS } from "@/data/mock";

type FilterType = "all" | "Lab Result" | "Medical Report" | "Imaging";
type MedDoc = (typeof MEDICAL_DOCUMENTS)[number];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function LabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ImagingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function typeIcon(type: string) {
  if (type === "Lab Result") return <LabIcon />;
  if (type === "Medical Report") return <ReportIcon />;
  return <ImagingIcon />;
}

function typeIconBg(type: string) {
  if (type === "Lab Result") return C.blue;
  if (type === "Medical Report") return C.navy;
  return C.amber;
}

function statusBadgeVariant(status: string): "green" | "yellow" | "red" {
  if (status === "uploaded") return "green";
  if (status === "processing") return "yellow";
  return "red";
}

function statusLabel(status: string) {
  if (status === "uploaded") return "Uploaded";
  if (status === "processing") return "Processing";
  return "Failed";
}

export default function MedicalDocuments() {
  const { addToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedDoc, setSelectedDoc] = useState<MedDoc | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Lab Results", value: "Lab Result" },
    { label: "Medical Reports", value: "Medical Report" },
    { label: "Imaging", value: "Imaging" },
  ];

  const filtered = activeFilter === "all"
    ? MEDICAL_DOCUMENTS
    : MEDICAL_DOCUMENTS.filter((d) => d.type === activeFilter);

  function openDetail(doc: MedDoc) {
    setSelectedDoc(doc);
    setDetailModalOpen(true);
  }

  return (
    <AppShell role="patient">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: C.navy }} className="text-3xl font-bold">
            Medical Documents
          </h1>
          <p style={{ color: C.muted }} className="mt-1 text-sm">
            Your health records, organized.
          </p>
        </div>
        <Button variant="primary" onClick={() => setUploadModalOpen(true)}>
          + Upload Document
        </Button>
      </div>

      {/* Privacy Banner */}
      <div className="mb-6">
        <AlertBanner
          type="info"
          title="Your privacy"
          body="Your documents are encrypted and only accessible to you and doctors you authorize."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            style={{
              background: activeFilter === f.value ? C.navy : "transparent",
              color: activeFilter === f.value ? "white" : C.muted,
              border: `1.5px solid ${activeFilter === f.value ? C.navy : C.border}`,
              borderRadius: "9999px",
              padding: "6px 18px",
              fontSize: "0.85rem",
              fontWeight: activeFilter === f.value ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
          title="No documents found"
          body="No documents match the selected filter. Try uploading a new document."
          cta="Upload Document"
          onCta={() => setUploadModalOpen(true)}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((doc) => (
            <Card key={doc.id} className="flex flex-col gap-3">
              {/* Icon + Title row */}
              <div className="flex items-start gap-3">
                <div
                  style={{
                    background: typeIconBg(doc.type),
                    borderRadius: "10px",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {typeIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: C.navy, fontWeight: 700, fontSize: "0.95rem" }} className="leading-tight">
                    {doc.title}
                  </p>
                  <p style={{ color: C.muted, fontSize: "0.78rem" }} className="mt-0.5">
                    {doc.doctor}
                  </p>
                </div>
              </div>

              {/* Date + Status */}
              <div className="flex items-center justify-between">
                <span style={{ color: C.muted, fontSize: "0.8rem" }}>{formatDate(doc.date)}</span>
                <Badge variant={statusBadgeVariant(doc.status)}>{statusLabel(doc.status)}</Badge>
              </div>

              {/* Size + Format */}
              <p style={{ color: C.muted, fontSize: "0.78rem" }}>
                {doc.size} &middot; {doc.format}
              </p>

              {/* View details */}
              <button
                onClick={() => openDetail(doc)}
                style={{ color: C.navy, fontSize: "0.82rem", fontWeight: 600, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                View details &rarr;
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedDoc(null); }}
        title={selectedDoc?.title ?? "Document"}
        maxWidth="max-w-lg"
      >
        {selectedDoc && (
          <div className="flex flex-col gap-4">
            {/* Meta rows */}
            <div style={{ background: C.warm, borderRadius: 10, padding: "14px 16px" }} className="flex flex-col gap-2">
              {[
                { label: "Type", value: selectedDoc.type },
                { label: "Date", value: formatDate(selectedDoc.date) },
                { label: "Doctor", value: selectedDoc.doctor },
                { label: "Size", value: selectedDoc.size },
                { label: "Format", value: selectedDoc.format },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span style={{ color: C.muted, fontSize: "0.82rem" }}>{row.label}</span>
                  <span style={{ color: C.navy, fontSize: "0.85rem", fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span style={{ color: C.muted, fontSize: "0.82rem" }}>Status</span>
                <Badge variant={statusBadgeVariant(selectedDoc.status)}>{statusLabel(selectedDoc.status)}</Badge>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: C.label, fontSize: "0.88rem", lineHeight: 1.6 }}>{selectedDoc.description}</p>

            <Divider />

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="primary" onClick={() => addToast("success", `Viewing ${selectedDoc.title}`)}>
                View
              </Button>
              <Button variant="outline" onClick={() => addToast("success", `${selectedDoc.title} download started`)}>
                Download
              </Button>
              <Button variant="outline" onClick={() => addToast("success", `${selectedDoc.title} share link copied`)}>
                Share
              </Button>
            </div>

            {/* Ghost action */}
            <button
              onClick={() => {
                addToast("success", "Added to Health Timeline");
                setDetailModalOpen(false);
              }}
              style={{ color: C.muted, fontSize: "0.82rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              + Add to Health Timeline
            </button>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-5">
          {/* Drop zone */}
          <div
            style={{
              border: `2px dashed ${C.border}`,
              borderRadius: 12,
              padding: "40px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: C.warm,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p style={{ color: C.navy, fontWeight: 600, fontSize: "0.9rem" }}>Drag and drop your file here</p>
            <p style={{ color: C.muted, fontSize: "0.8rem", marginTop: 4 }}>or click to browse</p>
          </div>

          <p style={{ color: C.muted, fontSize: "0.78rem", textAlign: "center" }}>
            Accepted formats: PDF, JPG, PNG, DICOM. Max size: 20MB.
          </p>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                addToast("success", "Document upload started");
                setUploadModalOpen(false);
              }}
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
