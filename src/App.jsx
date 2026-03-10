import { useState } from "react";
import OutreachTodo from "./OutreachTodo";
import LeadTracker from "./LeadTracker";

export default function App() {
  const [tab, setTab] = useState("checklist");

  return (
    <div style={{ minHeight: "100vh", background: "#111" }}>
      <div style={{
        background: "#0D0D0D",
        borderBottom: "1px solid #222",
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        gap: 0,
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.3em", color: "#C9A84C",
          fontFamily: "'Courier New', monospace", textTransform: "uppercase",
          marginRight: 32, padding: "16px 0", whiteSpace: "nowrap",
        }}>
          GH · FX TOOLS
        </div>
        {[
          { id: "checklist", label: "Research Checklist" },
          { id: "leads", label: "Lead Tracker" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: tab === id ? "2px solid #C9A84C" : "2px solid transparent",
              color: tab === id ? "#E8E0D0" : "#555",
              padding: "16px 20px",
              fontSize: 11,
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.15s ease",
              marginBottom: "-1px",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "checklist" && <OutreachTodo />}
      {tab === "leads" && <LeadTracker />}
    </div>
  );
}
