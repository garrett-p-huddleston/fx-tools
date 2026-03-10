import { useState, useEffect, useRef } from "react";

const STATUS_CONFIG = {
  "Not Contacted":  { color: "#888",    bg: "#2A2A2A", dot: "#666" },
  "Messaged":       { color: "#C9A84C", bg: "#2A2200", dot: "#C9A84C" },
  "Responded":      { color: "#7EC8A4", bg: "#0A2A1A", dot: "#7EC8A4" },
  "Call Scheduled": { color: "#7AABCC", bg: "#0A1A2A", dot: "#7AABCC" },
  "Converted":      { color: "#B8A0D8", bg: "#1A0A2A", dot: "#B8A0D8" },
};

const STATUSES = Object.keys(STATUS_CONFIG);

const TIER_COLORS = { "1": "#C9A84C", "2": "#8B9E8B", "3": "#7A8A9A" };

const EMPTY_FORM = {
  name: "", title: "", firm: "", location: "",
  email: "", tier: "2", status: "Not Contacted",
  dateContacted: "", followUpDate: "", notes: "",
};

const STORAGE_KEY = "fx-leads-v1";

function loadLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLeads(leads) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); } catch {}
}

function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function isOverdue(date) {
  if (!date) return false;
  return new Date(date) < new Date(new Date().toDateString());
}

export default function LeadTracker() {
  const [leads, setLeads] = useState(loadLeads);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTier, setFilterTier] = useState("All");
  const formRef = useRef(null);

  useEffect(() => { saveLeads(leads); }, [leads]);

  const openForm = (lead = null) => {
    if (lead) { setForm({ ...lead }); setEditId(lead.id); }
    else { setForm(EMPTY_FORM); setEditId(null); }
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const submitForm = () => {
    if (!form.name.trim() || !form.firm.trim()) return;
    if (editId) {
      setLeads((prev) => prev.map((l) => (l.id === editId ? { ...form, id: editId } : l)));
      setSelectedId(null);
    } else {
      setLeads((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateStatus = (id, status) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  const filtered = leads.filter((l) => {
    if (filterStatus !== "All" && l.status !== filterStatus) return false;
    if (filterTier !== "All" && l.tier !== filterTier) return false;
    return true;
  });

  const selected = leads.find((l) => l.id === selectedId);
  const stats = STATUSES.reduce((acc, s) => { acc[s] = leads.filter((l) => l.status === s).length; return acc; }, {});
  const overdueCount = leads.filter((l) => l.followUpDate && isOverdue(l.followUpDate) && l.status !== "Converted").length;

  const inputStyle = {
    width: "100%", background: "#1A1A1A", border: "1px solid #2A2A2A",
    color: "#E8E0D0", padding: "8px 10px", fontSize: 12,
    fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: 9, color: "#555",
    fontFamily: "'Courier New', monospace", letterSpacing: "0.15em",
    marginBottom: 6, textTransform: "uppercase",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#E8E0D0", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Top Bar */}
      <div style={{ borderBottom: "1px solid #2A2A2A", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#111", zIndex: 100 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#C9A84C", fontFamily: "'Courier New', monospace", textTransform: "uppercase", marginBottom: 3 }}>
            FX Treasury · European Search 2026
          </div>
          <div style={{ fontSize: 18, letterSpacing: "-0.01em" }}>Lead Tracker</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {overdueCount > 0 && (
            <div style={{ fontSize: 10, fontFamily: "'Courier New', monospace", color: "#E07070", background: "#2A0A0A", padding: "4px 10px", borderRadius: 2 }}>
              {overdueCount} OVERDUE
            </div>
          )}
          <button onClick={() => openForm()} style={{ background: "#C9A84C", color: "#111", border: "none", padding: "8px 18px", fontSize: 11, letterSpacing: "0.1em", fontFamily: "'Courier New', monospace", cursor: "pointer", textTransform: "uppercase" }}>
            + Add Lead
          </button>
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {STATUSES.map((s) => (
            <div key={s} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", padding: "10px 16px", borderRadius: 3, minWidth: 90 }}>
              <div style={{ fontSize: 20, color: STATUS_CONFIG[s].dot, marginBottom: 2 }}>{stats[s] || 0}</div>
              <div style={{ fontSize: 9, color: "#555", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s}</div>
            </div>
          ))}
          <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", padding: "10px 16px", borderRadius: 3, minWidth: 90 }}>
            <div style={{ fontSize: 20, color: "#E8E0D0", marginBottom: 2 }}>{leads.length}</div>
            <div style={{ fontSize: 9, color: "#555", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Total</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#555", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" }}>STATUS</span>
            {["All", ...STATUSES].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ background: filterStatus === s ? "#2A2A2A" : "transparent", border: `1px solid ${filterStatus === s ? "#444" : "#2A2A2A"}`, color: filterStatus === s ? "#E8E0D0" : "#555", padding: "3px 10px", fontSize: 10, fontFamily: "'Courier New', monospace", cursor: "pointer", borderRadius: 2 }}>
                {s === "All" ? "ALL" : s.slice(0, 4).toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 12 }}>
            <span style={{ fontSize: 10, color: "#555", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" }}>TIER</span>
            {["All", "1", "2", "3"].map((t) => (
              <button key={t} onClick={() => setFilterTier(t)} style={{ background: filterTier === t ? "#2A2A2A" : "transparent", border: `1px solid ${filterTier === t ? "#444" : "#2A2A2A"}`, color: filterTier === t ? (TIER_COLORS[t] || "#E8E0D0") : "#555", padding: "3px 10px", fontSize: 10, fontFamily: "'Courier New', monospace", cursor: "pointer", borderRadius: 2 }}>
                {t === "All" ? "ALL" : `T${t}`}
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 && (
              <div style={{ border: "1px dashed #2A2A2A", padding: "48px 24px", textAlign: "center", color: "#444", fontSize: 13 }}>
                {leads.length === 0 ? "No leads yet. Add your first contact to get started." : "No leads match the current filters."}
              </div>
            )}
            {filtered.map((lead) => {
              const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG["Not Contacted"];
              const overdue = isOverdue(lead.followUpDate) && lead.status !== "Converted";
              const isSelected = selectedId === lead.id;
              return (
                <div key={lead.id} onClick={() => setSelectedId(isSelected ? null : lead.id)} style={{ border: `1px solid ${isSelected ? "#444" : "#222"}`, borderLeft: `3px solid ${TIER_COLORS[lead.tier] || "#555"}`, background: isSelected ? "#1A1A1A" : "#151515", padding: "14px 16px", marginBottom: 6, cursor: "pointer", transition: "all 0.15s ease" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, color: "#E8E0D0" }}>{lead.name}</span>
                        <span style={{ fontSize: 11, color: "#666" }}>·</span>
                        <span style={{ fontSize: 12, color: "#AAA" }}>{lead.title}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "#888", fontFamily: "'Courier New', monospace" }}>{lead.firm}</span>
                        {lead.location && <span style={{ fontSize: 10, color: "#555", fontFamily: "'Courier New', monospace" }}>{lead.location}</span>}
                        <span style={{ fontSize: 9, fontFamily: "'Courier New', monospace", color: TIER_COLORS[lead.tier] || "#555", letterSpacing: "0.1em" }}>T{lead.tier}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, background: cfg.bg, padding: "3px 8px", borderRadius: 2 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot }} />
                        <span style={{ fontSize: 9, color: cfg.color, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>{lead.status.toUpperCase()}</span>
                      </div>
                      {lead.followUpDate && (
                        <span style={{ fontSize: 9, fontFamily: "'Courier New', monospace", color: overdue ? "#E07070" : "#555" }}>
                          {overdue ? "⚠ " : "↻ "}{formatDate(lead.followUpDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ width: 300, flexShrink: 0, border: "1px solid #2A2A2A", background: "#151515", padding: "20px", position: "sticky", top: 80 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, color: "#E8E0D0", marginBottom: 2 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{selected.title}</div>
                <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", color: "#C9A84C" }}>{selected.firm} · {selected.location}</div>
              </div>
              {selected.email && (
                <div style={{ marginBottom: 12 }}>
                  <div style={labelStyle}>EMAIL</div>
                  <div style={{ fontSize: 11, color: "#AAA", wordBreak: "break-all" }}>{selected.email}</div>
                </div>
              )}
              <div style={{ marginBottom: 12 }}>
                <div style={labelStyle}>STATUS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {STATUSES.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const active = selected.status === s;
                    return (
                      <button key={s} onClick={(e) => { e.stopPropagation(); updateStatus(selected.id, s); }} style={{ background: active ? cfg.bg : "transparent", border: `1px solid ${active ? cfg.dot : "#2A2A2A"}`, color: active ? cfg.color : "#444", padding: "5px 10px", fontSize: 10, fontFamily: "'Courier New', monospace", cursor: "pointer", textAlign: "left", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: active ? cfg.dot : "#333" }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>CONTACTED</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{formatDate(selected.dateContacted)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>FOLLOW-UP</div>
                  <div style={{ fontSize: 11, color: isOverdue(selected.followUpDate) && selected.status !== "Converted" ? "#E07070" : "#888" }}>{formatDate(selected.followUpDate)}</div>
                </div>
              </div>
              {selected.notes && (
                <div style={{ marginBottom: 16 }}>
                  <div style={labelStyle}>NOTES</div>
                  <div style={{ fontSize: 11, color: "#888", lineHeight: 1.7, background: "#1A1A1A", padding: "10px 12px", borderLeft: "2px solid #2A2A2A", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{selected.notes}</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); openForm(selected); }} style={{ flex: 1, background: "#2A2A2A", border: "1px solid #3A3A3A", color: "#E8E0D0", padding: "7px", fontSize: 10, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: "0.1em" }}>EDIT</button>
                <button onClick={(e) => { e.stopPropagation(); deleteLead(selected.id); }} style={{ flex: 1, background: "#2A0A0A", border: "1px solid #4A1A1A", color: "#E07070", padding: "7px", fontSize: 10, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: "0.1em" }}>DELETE</button>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div ref={formRef} style={{ marginTop: 32, border: "1px solid #2A2A2A", background: "#151515", padding: "28px" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C9A84C", fontFamily: "'Courier New', monospace", marginBottom: 20, textTransform: "uppercase" }}>
              {editId ? "Edit Lead" : "New Lead"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { key: "name", label: "Full Name *", placeholder: "Jan de Vries" },
                { key: "title", label: "Title", placeholder: "FX Dealer" },
                { key: "firm", label: "Firm *", placeholder: "ING Group" },
                { key: "location", label: "Location", placeholder: "Amsterdam" },
                { key: "email", label: "Email", placeholder: "j.devries@ing.com" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Tier</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["1", "2", "3"].map((t) => (
                    <button key={t} onClick={() => setForm((f) => ({ ...f, tier: t }))} style={{ flex: 1, padding: "8px", background: form.tier === t ? "#2A2A2A" : "#1A1A1A", border: `1px solid ${form.tier === t ? TIER_COLORS[t] : "#2A2A2A"}`, color: form.tier === t ? TIER_COLORS[t] : "#555", fontSize: 11, fontFamily: "'Courier New', monospace", cursor: "pointer" }}>
                      T{t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} style={{ ...inputStyle }}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date Contacted</label>
                <input type="date" value={form.dateContacted} onChange={(e) => setForm((f) => ({ ...f, dateContacted: e.target.value }))} style={{ ...inputStyle, colorScheme: "dark" }} />
              </div>
              <div>
                <label style={labelStyle}>Follow-up Date</label>
                <input type="date" value={form.followUpDate} onChange={(e) => setForm((f) => ({ ...f, followUpDate: e.target.value }))} style={{ ...inputStyle, colorScheme: "dark" }} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Notes / Conversation Log</label>
              <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="What was discussed, any follow-up actions, tone of conversation..." rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={submitForm} style={{ background: "#C9A84C", color: "#111", border: "none", padding: "10px 24px", fontSize: 11, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {editId ? "Save Changes" : "Add Lead"}
              </button>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditId(null); }} style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", padding: "10px 24px", fontSize: 11, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
