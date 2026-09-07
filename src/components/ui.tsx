import { ReactNode } from "react";
import logo from "@/assets/logo.png";

// ─── Colors ───────────────────────────────────────────────────────────────────
export const C = {
  amber: "#FFAA3D",
  amberHover: "#F29A28",
  amberLight: "#FFF1DC",
  navy: "#155F54",
  navyMuted: "#0D4F46",
  coral: "#F58A8D",
  warm: "#FAFAF8",
  border: "#E7E8E1",
  muted: "#71817D",
  label: "#31514B",
  green: "#16A34A",
  greenLight: "#DCFCE7",
  red: "#DC2626",
  redLight: "#FEE2E2",
  yellow: "#CA8A04",
  yellowLight: "#FEF9C3",
  blue: "#8FB8E8",
  blueLight: "#E8F2FC",
};

// ─── Button ───────────────────────────────────────────────────────────────────
interface BtnProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event?: React.MouseEvent) => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export function Button({ children, variant = "primary", size = "md", loading, disabled, onClick, type = "button", fullWidth, className = "", style: styleOverride, ariaLabel }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 rounded-xl select-none";
  const sizes = { sm: "px-4 py-2 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3.5 text-sm" };
  const variants = {
    primary: `text-white disabled:opacity-60`,
    secondary: `text-white disabled:opacity-60`,
    ghost: `hover:bg-gray-100 disabled:opacity-60`,
    danger: `text-white disabled:opacity-60`,
    outline: `border disabled:opacity-60`,
  };
  const styles: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    backgroundColor: variant === "primary" ? C.navy : variant === "secondary" ? C.navy : variant === "danger" ? C.coral : "transparent",
    color: variant === "ghost" ? C.navy : variant === "outline" ? C.navy : "white",
    borderColor: variant === "outline" ? C.border : undefined,
    width: fullWidth ? "100%" : undefined,
    ...styleOverride,
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={(event) => onClick?.(event)}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={styles}
      onMouseEnter={(e) => {
        if (variant === "primary") e.currentTarget.style.backgroundColor = C.navyMuted;
        if (variant === "secondary") e.currentTarget.style.backgroundColor = "#1e2f5c";
        if (variant === "danger") e.currentTarget.style.backgroundColor = "#c94d30";
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") e.currentTarget.style.backgroundColor = C.navy;
        if (variant === "secondary") e.currentTarget.style.backgroundColor = C.navy;
        if (variant === "danger") e.currentTarget.style.backgroundColor = C.coral;
      }}
    >
      {loading ? <Spinner size={14} /> : children}
    </button>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 16, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = "amber" | "navy" | "green" | "red" | "yellow" | "blue" | "gray";
export function Badge({ children, variant = "gray" }: { children: ReactNode; variant?: BadgeVariant }) {
  const map: Record<BadgeVariant, [string, string]> = {
    amber: [C.amberLight, C.amber],
    navy: ["#E8ECF5", C.navy],
    green: [C.greenLight, C.green],
    red: [C.redLight, C.red],
    yellow: [C.yellowLight, C.yellow],
    blue: [C.blueLight, C.blue],
    gray: ["#F3F4F6", "#6B7280"],
  };
  const [bg, color] = map[variant];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: bg, color, fontFamily: "var(--font-body)" }}
    >
      {children}
    </span>
  );
}

// ─── VerifiedBadge ────────────────────────────────────────────────────────────
export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold" style={{ backgroundColor: C.amberLight, color: C.amber }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill={C.amber}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke={C.amber} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {label}
    </span>
  );
}

// ─── AvailabilityDot ──────────────────────────────────────────────────────────
export function AvailabilityDot({ status }: { status: "online" | "available-today" | "away" | "offline" }) {
  const map = {
    online: { color: C.green, label: "Online now" },
    "available-today": { color: C.amber, label: "Available today" },
    away: { color: C.yellow, label: "Away" },
    offline: { color: "#9CA3AF", label: "Offline" },
  };
  const { color, label } = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center shrink-0 font-semibold"
      style={{ width: size, height: size, backgroundColor: C.amberLight, color: C.amber, fontSize: size * 0.35, fontFamily: "var(--font-body)" }}
    >
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = "", onClick, padding = true, style }: { children: ReactNode; className?: string; onClick?: () => void; padding?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-white rounded-2xl border editorial-card ${onClick ? "cursor-pointer" : ""} ${padding ? "p-5" : ""} ${className}`}
      style={{ borderColor: C.border, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({
  label, type = "text", placeholder, value, onChange, suffix, prefix, autoComplete, disabled, multiline, rows = 3,
}: {
  label?: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void;
  suffix?: ReactNode; prefix?: ReactNode; autoComplete?: string; disabled?: boolean; multiline?: boolean; rows?: number;
}) {
  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    borderColor: C.border,
    color: C.navy,
    backgroundColor: disabled ? "#F9FAFB" : "white",
  };
  const cls = `w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all ${prefix ? "pl-10" : ""} ${suffix ? "pr-10" : ""}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium" style={{ color: C.label, fontFamily: "var(--font-body)" }}>{label}</label>}
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`${cls} resize-none`}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,160,32,0.15)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={cls}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,160,32,0.15)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
          />
        )}
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium" style={{ color: C.label, fontFamily: "var(--font-body)" }}>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
        style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)", backgroundColor: "white" }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex border-b" style={{ borderColor: C.border }}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="px-5 py-3 text-sm font-medium transition-colors relative"
          style={{
            fontFamily: "var(--font-body)",
            color: active === t ? C.amber : C.muted,
          }}
        >
          {t}
          {active === t && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: C.amber }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; maxWidth?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: C.border }}>
            <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, body, cta, onCta }: { icon: ReactNode; title: string; body: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl" style={{ backgroundColor: C.amberLight }}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{title}</h3>
      <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: C.muted }}>{body}</p>
      {cta && <Button onClick={onCta}>{cta}</Button>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />;
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{title}</h2>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {action && (
        <button onClick={onAction} className="text-sm font-medium hover:underline" style={{ color: C.amber }}>
          {action}
        </button>
      )}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, sub, color = C.amberLight }: { label: string; value: string | number; icon: ReactNode; sub?: string; color?: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>{label}</p>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: C.muted }}>{sub}</p>}
    </Card>
  );
}

// ─── Toast container ──────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onRemove }: { toasts: { id: string; type: string; message: string }[]; onRemove: (id: string) => void }) {
  if (!toasts.length) return null;
  const colors: Record<string, [string, string]> = {
    success: [C.greenLight, C.green],
    error: [C.redLight, C.red],
    warning: [C.yellowLight, C.yellow],
    info: [C.blueLight, C.blue],
  };
  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2">
      {toasts.map((t) => {
        const [bg, color] = colors[t.type] || colors.info;
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm"
            style={{ backgroundColor: bg, color, fontFamily: "var(--font-body)" }}
          >
            <span className="flex-1">{t.message}</span>
            <button onClick={() => onRemove(t.id)} className="opacity-60 hover:opacity-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className="relative w-11 h-6 rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? C.amber : "#D1D5DB" }}
        onClick={() => onChange(!checked)}
      >
        <div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </div>
      {label && <span className="text-sm" style={{ color: C.label, fontFamily: "var(--font-body)" }}>{label}</span>}
    </label>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
export function Chip({ label, selected, onClick }: { label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150"
      style={{
        backgroundColor: selected ? C.amber : "white",
        color: selected ? "white" : C.navy,
        borderColor: selected ? C.amber : C.border,
        fontFamily: "var(--font-body)",
      }}
    >
      {label}
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = C.amber }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

// ─── Step indicator ──────────────────────────────────────────────────────────
export function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            backgroundColor: i <= current ? C.amber : "#E5E7EB",
          }}
        />
      ))}
    </div>
  );
}

// ─── StarRating ───────────────────────────────────────────────────────────────
export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="flex items-center gap-1">
      <svg width="13" height="13" viewBox="0 0 24 24" fill={C.amber}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      <span className="text-sm font-semibold" style={{ color: C.navy }}>{rating}</span>
      {count !== undefined && <span className="text-xs" style={{ color: C.muted }}>({count})</span>}
    </span>
  );
}

// ─── QR placeholder ──────────────────────────────────────────────────────────
export function QRCode({ value }: { value: string }) {
  // `value` is what a real encoder would take; the placeholder renders a
  // deterministic pattern seeded from its length so it stays stable per link.
  const seed = value.length;
  return (
    <div className="w-32 h-32 rounded-lg overflow-hidden border-2 flex items-center justify-center" style={{ borderColor: C.border }}>
      <svg viewBox="0 0 100 100" width="128" height="128" style={{ display: "block" }}>
        {[0, 1, 2, 3, 4, 5, 6].map(row =>
          [0, 1, 2, 3, 4, 5, 6].map(col => {
            const inFinder = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
            const fill = inFinder || (row * 7 + col * 3 + seed) % 3 !== 0 ? C.navy : "white";
            return <rect key={`${row}-${col}`} x={col * 13 + 3} y={row * 13 + 3} width={11} height={11} fill={fill} />;
          })
        )}
      </svg>
    </div>
  );
}

// ─── AlertBanner ─────────────────────────────────────────────────────────────
export function AlertBanner({ type, title, body }: { type: "info" | "warning" | "error" | "success"; title: string; body?: string }) {
  const map = {
    info: [C.blueLight, C.blue],
    warning: [C.yellowLight, C.yellow],
    error: [C.redLight, C.red],
    success: [C.greenLight, C.green],
  };
  const [bg, color] = map[type];
  return (
    <div className="rounded-xl p-4 flex gap-3" style={{ backgroundColor: bg }}>
      <div className="shrink-0 mt-0.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color, fontFamily: "var(--font-body)" }}>{title}</p>
        {body && <p className="text-xs mt-0.5" style={{ color, opacity: 0.85, fontFamily: "var(--font-body)" }}>{body}</p>}
      </div>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px my-4" style={{ backgroundColor: C.border }} />;
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
      <span className="text-xs" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>{label}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: C.border }}>
      <table className="w-full text-sm" style={{ fontFamily: "var(--font-body)" }}>
        <thead>
          <tr style={{ backgroundColor: C.warm }}>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderTop: i > 0 ? `1px solid ${C.border}` : undefined }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3" style={{ color: C.navy }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── DocuraLogo ──────────────────────────────────────────────────────────────
export function DocuraLogo({ size = 40, showText = false }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} width={size} height={size} alt="Docura" className="object-contain" />
      {showText && <span className="font-bold text-xl" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Docura</span>}
    </div>
  );
}

// ─── CrossBorderCard ─────────────────────────────────────────────────────────
export function CrossBorderCard({ personalDoctor, prescribingDoctor, status }: { personalDoctor: string; prescribingDoctor?: string; status: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: "#FFFBF0" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🌍</span>
        <span className="text-sm font-semibold" style={{ color: C.navy }}>Cross-border care</span>
        <Badge variant="amber">Active</Badge>
      </div>
      <p className="text-xs mb-4" style={{ color: C.muted }}>Your personal doctor can continue caring for you while a locally licensed doctor supports prescriptions in your current country.</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.amber }} />
          <span className="text-xs font-medium" style={{ color: C.navy }}>Personal Doctor: {personalDoctor}</span>
        </div>
        <div className="w-0.5 h-4 ml-1" style={{ backgroundColor: C.border }} />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: prescribingDoctor ? C.green : "#D1D5DB" }} />
          <span className="text-xs font-medium" style={{ color: C.navy }}>
            Prescribing Doctor: {prescribingDoctor || "Awaiting assignment"}
          </span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: C.border }}>
        <span className="text-xs" style={{ color: C.muted }}>Status: </span>
        <span className="text-xs font-semibold" style={{ color: status === "assigned" ? C.green : C.amber }}>{status}</span>
      </div>
    </div>
  );
}

// ─── PageHeader ──────────────────────────────────────────────────────────────
// The standard top of every in-app page: eyebrow, title, supporting line and
// optional actions. Wraps to a column on small screens.
export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.amber }}>{eyebrow}</p>}
        <h1 className="text-2xl sm:text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{title}</h1>
        {subtitle && <p className="text-sm mt-2 max-w-2xl" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ─── ResponsiveTable ─────────────────────────────────────────────────────────
// A table on wide screens, a stack of labelled cards below `lg`. Dashboards use
// this instead of letting a data table scroll sideways on a phone.
export interface ResponsiveColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Hidden in the mobile card when the value is already the card title. */
  primary?: boolean;
}

export function ResponsiveTable<T>({ columns, rows, rowKey, onRowClick, empty }: {
  columns: ResponsiveColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
}) {
  if (!rows.length) {
    return <div className="py-10 text-center text-sm" style={{ color: C.muted }}>{empty || "Nothing to show yet."}</div>;
  }
  return (
    <>
      <div className="hidden lg:block overflow-x-auto rounded-xl border" style={{ borderColor: C.border }}>
        <table className="w-full text-sm" style={{ fontFamily: "var(--font-body)" }}>
          <thead>
            <tr style={{ backgroundColor: C.warm }}>
              {columns.map((column) => (
                <th key={column.key} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                style={{ borderTop: index > 0 ? `1px solid ${C.border}` : undefined }}
              >
                {columns.map((column) => <td key={column.key} className="px-4 py-3 align-middle" style={{ color: C.navy }}>{column.render(row)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden flex flex-col gap-3">
        {rows.map((row) => {
          const primary = columns.find((column) => column.primary) || columns[0];
          const rest = columns.filter((column) => column !== primary);
          return (
            <div
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`rounded-xl border bg-white p-4 ${onRowClick ? "cursor-pointer" : ""}`}
              style={{ borderColor: C.border }}
            >
              <div className="font-semibold text-sm mb-3" style={{ color: C.navy }}>{primary.render(row)}</div>
              <dl className="flex flex-col gap-2">
                {rest.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-3">
                    <dt className="text-xs uppercase tracking-wide shrink-0" style={{ color: C.muted }}>{column.header}</dt>
                    <dd className="text-sm text-right min-w-0" style={{ color: C.navy }}>{column.render(row)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── BarChart ────────────────────────────────────────────────────────────────
// Deliberately dependency-free and fluid: the SVG scales with its container so
// analytics stay readable from 320px upward.
export function BarChart({ labels, values, color = C.navy, format }: { labels: string[]; values: number[]; color?: string; format?: (value: number) => string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-40">
        {values.map((value, index) => (
          <div key={labels[index]} className="flex-1 flex flex-col items-center justify-end gap-2 min-w-0">
            <span className="text-[10px] font-semibold" style={{ color: C.muted }}>{format ? format(value) : value}</span>
            <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(6, (value / max) * 100)}%`, backgroundColor: color, opacity: index === values.length - 1 ? 0.55 : 1 }} />
            <span className="text-[10px] truncate w-full text-center" style={{ color: C.muted }}>{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────
export function Sparkline({ values, color = C.amber }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${28 - ((value - min) / span) * 24}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-8" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─── PermissionRow ───────────────────────────────────────────────────────────
// Used wherever delegated access is granted or removed, so the consequence of a
// toggle is always spelled out next to the control.
export function PermissionRow({ label, description, granted, sensitive, disabled, onChange }: {
  label: string; description: string; granted: boolean; sensitive?: boolean; disabled?: boolean; onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b last:border-0" style={{ borderColor: C.border }}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold" style={{ color: C.navy }}>{label}</p>
          {sensitive && <Badge variant="yellow">Sensitive</Badge>}
        </div>
        <p className="text-xs mt-1" style={{ color: C.muted }}>{description}</p>
      </div>
      <div className="shrink-0 pt-1">
        {disabled
          ? <Badge variant="gray">Patient only</Badge>
          : <Toggle checked={granted} onChange={onChange} />}
      </div>
    </div>
  );
}

// ─── StatusPill ──────────────────────────────────────────────────────────────
const STATUS_TONE: Record<string, BadgeVariant> = {
  active: "green", paid: "green", accepted: "green", completed: "green", approved: "green", resolved: "green", published: "green",
  pending: "amber", upcoming: "amber", processing: "amber", "in-progress": "amber", requested: "amber", "under-review": "amber", "in-review": "amber", waiting: "amber",
  failed: "red", disputed: "red", missed: "red", rejected: "red", revoked: "red", restricted: "red", declined: "red",
  expired: "gray", used: "gray", inactive: "gray", open: "blue", refunded: "blue", investigating: "yellow", "more-info-required": "yellow", onboarding: "yellow",
};

export function StatusPill({ status }: { status: string }) {
  return <Badge variant={STATUS_TONE[status] || "gray"}>{status.replace(/-/g, " ")}</Badge>;
}

// ─── FilterBar ───────────────────────────────────────────────────────────────
export function FilterBar({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className="shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors"
          style={{
            backgroundColor: value === option.id ? C.navy : "white",
            color: value === option.id ? "white" : C.muted,
            borderColor: value === option.id ? C.navy : C.border,
            fontFamily: "var(--font-body)",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ─── SearchField ─────────────────────────────────────────────────────────────
export function SearchField({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label: string }) {
  return (
    <div className="relative w-full">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border pl-11 pr-4 py-3 text-sm outline-none"
        style={{ borderColor: C.border, fontFamily: "var(--font-body)", color: C.navy, backgroundColor: "white" }}
        onFocus={(event) => { event.currentTarget.style.borderColor = C.amber; }}
        onBlur={(event) => { event.currentTarget.style.borderColor = C.border; }}
      />
    </div>
  );
}

// ─── AiDisclosure ────────────────────────────────────────────────────────────
// Shown anywhere Docura's intelligence layer contributes to what is on screen.
// AI assists; the responsible clinician decides.
export function AiDisclosure({ detail }: { detail?: string }) {
  return (
    <div className="rounded-xl p-4 flex gap-3" style={{ backgroundColor: C.amberLight }}>
      <span className="text-base leading-none pt-0.5">✨</span>
      <div>
        <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>AI-assisted, clinician-led</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: C.label }}>
          {detail || "Docura's intelligence layer organises and summarises information. It does not diagnose, prescribe, or make clinical decisions — your doctor does."}
        </p>
      </div>
    </div>
  );
}
