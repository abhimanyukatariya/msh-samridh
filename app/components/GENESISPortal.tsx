"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Sparkles, Rocket, Calendar, ArrowRight, Download, Globe, BookOpen, Shield, Users, BarChart3, FileText, Link as LinkIcon, Search, HelpCircle, Sun, Moon } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

type EligibilityAnswers = {
  incorporated: boolean | null;
  dpiit: boolean | null;
  revenue: "none" | "<50L" | "50L-1Cr" | ">1Cr" | null;
  ipStatus: "none" | "filed" | "granted" | null;
};

interface AppData {
  orgName: string;
  contact: string;
  email: string;
  website?: string;
  challengeTrack: string;
  problemStatement: string;
  solution: string;
  team: string;
  docs: string[]; // filenames for demo
}

const demoKpi = { applicants: 892, shortlisted: 112, pilots: 37, funds: 18.4 };
const demoTimeline = [
  { m: "Apr", label: "Launch" },
  { m: "May", label: "EOI Open" },
  { m: "Jun", label: "Workshops" },
  { m: "Jul", label: "Evaluation" },
  { m: "Aug", label: "Pilots" },
  { m: "Sep", label: "Scale" },
];

const kpiSeries = [
  { month: "Apr", apps: 20 },
  { month: "May", apps: 138 },
  { month: "Jun", apps: 316 },
  { month: "Jul", apps: 540 },
  { month: "Aug", apps: 770 },
  { month: "Sep", apps: 892 },
];

const pieData = [
  { name: "HealthTech", value: 32 },
  { name: "EdTech", value: 24 },
  { name: "AgriTech", value: 18 },
  { name: "DeepTech", value: 14 },
  { name: "Other", value: 12 },
];

const badge = (txt: string) => (
  <span className="px-2 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">{txt}</span>
);

const pill = (txt: string) => (
  <span className="px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800">{txt}</span>
);

function SectionCard({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur p-5 md:p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Stat({ title, value, sub }: { title: string; value: string | number; sub?: string }) {
  return (
    <SectionCard>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"><BarChart3 className="w-5 h-5" /></div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
        </div>
      </div>
    </SectionCard>
  );
}

// Simple theme toggle
function ThemeToggle({ theme, setTheme }: { theme: string; setTheme: (v: string) => void }) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === "dark" ? "Light" : "Dark"} mode
    </button>
  );
}

export default function GENESISPortal() {
  const [tab, setTab] = useState<
    "overview" | "challenges" | "apply" | "eligibility" | "mentors" | "resources" | "track" | "dashboard"
  >("overview");
  const [theme, setTheme] = useState<string>("light");
  const [answers, setAnswers] = useState<EligibilityAnswers>({
    incorporated: null,
    dpiit: null,
    revenue: null,
    ipStatus: null,
  });
  const [form, setForm] = useState<AppData>({
    orgName: "",
    contact: "",
    email: "",
    website: "",
    challengeTrack: "Digital Public Goods",
    problemStatement: "",
    solution: "",
    team: "",
    docs: [],
  });
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const eligScore = useMemo(() => {
    let s = 0;
    if (answers.incorporated) s += 30;
    if (answers.dpiit) s += 20;
    if (answers.revenue && answers.revenue !== "none") s += 20;
    if (answers.ipStatus && answers.ipStatus !== "none") s += 30;
    return s;
  }, [answers]);

  const eligVerdict = eligScore >= 60 ? "Likely Eligible" : eligScore >= 40 ? "Borderline – needs mentor review" : "Currently Ineligible";

  const handleSubmit = async () => {
    console.log("Submitting GENESIS app", form);
    setToast("Application submitted (demo). Connect to /api/applications next.");
    setTab("track");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md"><Rocket className="w-5 h-5"/></div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">GENESIS — MeitY Startup Hub</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Grants & Innovation Challenges • Dedicated Scheme Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm"><Download className="w-4 h-4"/>Scheme PDF</a>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["overview", "Overview"],
            ["eligibility", "Eligibility"],
            ["challenges", "Challenge Tracks"],
            ["apply", "Apply"],
            ["track", "Track"],
            ["mentors", "Mentors"],
            ["resources", "Resources"],
            ["dashboard", "Dashboard"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`px-3.5 py-1.5 rounded-xl border text-sm transition ${
                tab === key
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "bg-white/70 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100/70 dark:hover:bg-neutral-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence mode="wait">
              {/* Overview */}
              {tab === "overview" && (
                <motion.div key="ov" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SectionCard>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200"><Sparkles className="w-5 h-5"/></div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">GENESIS – Next-Gen Entrepreneurship, Innovation & Support</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-3xl">
                          GENESIS fosters breakthrough products and Digital Public Goods via grants, pilots, and national challenges. This mini-portal gives applicants a focused experience, while sharing a common login and data model with the main MSH portal.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {pill("Grant Support")}
                          {pill("Pilot Sandboxes")}
                          {pill("Govt. + Industry Mentors")}
                          {pill("Cohort Showcases")}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                    <Stat title="Applicants" value={demoKpi.applicants} sub="This call" />
                    <Stat title="Shortlisted" value={demoKpi.shortlisted} />
                    <Stat title="Active Pilots" value={demoKpi.pilots} />
                  </div>

                  <SectionCard className="mt-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4"/> Key Dates (demo)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {demoTimeline.map((t) => (
                        <div key={t.m} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-950">
                          <p className="text-sm text-neutral-500">{t.label}</p>
                          <p className="text-lg font-semibold mt-1">{t.m} 2025</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {/* Eligibility */}
              {tab === "eligibility" && (
                <motion.div key="el" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SectionCard>
                    <h3 className="text-xl font-semibold tracking-tight">Interactive Eligibility Check</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Answer 4 quick questions to estimate eligibility. This does not replace detailed guidelines.</p>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <p className="text-sm font-medium">Is your startup incorporated in India?</p>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => setAnswers({ ...answers, incorporated: true })} className={`px-3 py-1.5 rounded-lg border ${answers.incorporated===true?"bg-emerald-600 text-white border-emerald-600":""}`}>Yes</button>
                          <button onClick={() => setAnswers({ ...answers, incorporated: false })} className={`px-3 py-1.5 rounded-lg border ${answers.incorporated===false?"bg-rose-600 text-white border-rose-600":""}`}>No</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">DPIIT recognized?</p>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => setAnswers({ ...answers, dpiit: true })} className={`px-3 py-1.5 rounded-lg border ${answers.dpiit===true?"bg-emerald-600 text-white border-emerald-600":""}`}>Yes</button>
                          <button onClick={() => setAnswers({ ...answers, dpiit: false })} className={`px-3 py-1.5 rounded-lg border ${answers.dpiit===false?"bg-rose-600 text-white border-rose-600":""}`}>No</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Revenue (last FY)</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {["none","<50L","50L-1Cr",">1Cr"].map((r)=> (
                            <button key={r} onClick={()=> setAnswers({ ...answers, revenue: r as any })} className={`px-3 py-1.5 rounded-lg border ${answers.revenue===r?"bg-neutral-900 text-white dark:bg-white dark:text-neutral-900":""}`}>{r}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">IP status</p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {["none","filed","granted"].map((r)=> (
                            <button key={r} onClick={()=> setAnswers({ ...answers, ipStatus: r as any })} className={`px-3 py-1.5 rounded-lg border capitalize ${answers.ipStatus===r?"bg-neutral-900 text-white dark:bg-white dark:text-neutral-900":""}`}>{r}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-sm text-neutral-500">Score: <span className="font-semibold text-neutral-900 dark:text-white">{eligScore}/100</span></div>
                      <div className="flex items-center gap-2">
                        {badge("Auto-check")}
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${eligScore>=60?"bg-emerald-600 text-white":eligScore>=40?"bg-amber-500 text-white":"bg-rose-600 text-white"}`}>{eligVerdict}</span>
                      </div>
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {/* Challenges */}
              {tab === "challenges" && (
                <motion.div key="ch" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SectionCard>
                    <h3 className="text-xl font-semibold tracking-tight mb-2">Current Challenge Tracks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[{
                        title: "Digital Public Goods",
                        desc: "Open-source solutions for national scale (education, health, agriculture).",
                      },{
                        title: "AI for Governance",
                        desc: "Responsible AI for citizen services, language tech, cybersecurity.",
                      },{
                        title: "Inclusive Tech",
                        desc: "Accessibility, skilling, and social protection through tech.",
                      },{
                        title: "Sustainable Cities",
                        desc: "Urban data platforms, mobility, energy efficiency and climate.",
                      }].map((c) => (
                        <div key={c.title} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40"><Globe className="w-5 h-5"/></div>
                            <div>
                              <h4 className="font-medium">{c.title}</h4>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{c.desc}</p>
                              <div className="mt-3 flex gap-2">
                                <a className="text-sm inline-flex items-center gap-1 underline" href="#">Read brief <ArrowRight className="w-3.5 h-3.5"/></a>
                                <button onClick={()=> { setForm({ ...form, challengeTrack: c.title }); setTab("apply"); }} className="text-sm inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border">Apply in this track</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {/* Apply */}
              {tab === "apply" && (
                <motion.div key="ap" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SectionCard>
                    <h3 className="text-xl font-semibold tracking-tight">Application Form</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Your progress is autosaved in this browser (demo). Replace with auth + DB.</p>

                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <label className="grid gap-1 text-sm">
                        <span>Organization Name</span>
                        <input value={form.orgName} onChange={(e)=> setForm({...form, orgName: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950" placeholder="Acme Labs Pvt Ltd"/>
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span>Contact Person</span>
                        <input value={form.contact} onChange={(e)=> setForm({...form, contact: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950" placeholder="Name"/>
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span>Email</span>
                        <input value={form.email} onChange={(e)=> setForm({...form, email: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950" placeholder="founder@company.com"/>
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span>Website</span>
                        <input value={form.website} onChange={(e)=> setForm({...form, website: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950" placeholder="https://..."/>
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Challenge Track</span>
                        <select value={form.challengeTrack} onChange={(e)=> setForm({...form, challengeTrack: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950">
                          <option>Digital Public Goods</option>
                          <option>AI for Governance</option>
                          <option>Inclusive Tech</option>
                          <option>Sustainable Cities</option>
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Problem Statement (what are you solving?)</span>
                        <textarea value={form.problemStatement} onChange={(e)=> setForm({...form, problemStatement: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950" rows={3} placeholder="Describe the user pain / policy gap..."/>
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Solution & Impact</span>
                        <textarea value={form.solution} onChange={(e)=> setForm({...form, solution: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950" rows={4} placeholder="What is the product, how it works, why it will scale..."/>
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Team (founders, roles)</span>
                        <textarea value={form.team} onChange={(e)=> setForm({...form, team: e.target.value})} className="rounded-lg border px-3 py-2 bg-white dark:bg-neutral-950" rows={2} placeholder="Names, backgrounds, time commitment..."/>
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-neutral-500 flex items-center gap-2"><Shield className="w-3.5 h-3.5"/> All submissions are logged with audit trails (demo)</div>
                      <div className="flex gap-2">
                        <button onClick={()=> { localStorage.setItem("genesis_draft", JSON.stringify(form)); setToast("Draft saved locally."); }} className="px-3 py-2 rounded-lg border">Save Draft</button>
                        <button onClick={handleSubmit} className="px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg:white dark:text-neutral-900 inline-flex items-center gap-2">Submit <ChevronRight className="w-4 h-4"/></button>
                      </div>
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {/* Track */}
              {tab === "track" && (
                <motion.div key="tr" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SectionCard>
                    <h3 className="text-xl font-semibold tracking-tight">Track Your Application</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">For demo, these are sample stages. Hook to /api/applications/:id for live data.</p>
                    <div className="mt-4 grid gap-3">
                      {["Received","Screening","Mentor Review","Committee","Pilot Grant"].map((s,i)=> (
                        <div key={s} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i<3?"bg-emerald-600 text-white":"bg-neutral-200 dark:bg-neutral-800"}`}>{i<3?<Check className="w-4 h-4"/>:i+1}</div>
                          <div className="flex-1 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <div className={`h-full ${i<3?"w-full bg-emerald-500":"w-0"}`}></div>
                          </div>
                          <span className="text-sm w-36">{s}</span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {/* Mentors */}
              {tab === "mentors" && (
                <motion.div key="me" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SectionCard>
                    <h3 className="text-xl font-semibold tracking-tight">Mentors & Domain Experts</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Curated pool from industry, academia, and govt. For demo only.</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["GovTech","Product","Funding"].map((t) => (
                        <div key={t} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"><Users className="w-4 h-4"/></div>
                            <div>
                              <p className="font-medium">{t} Mentors</p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">Office hours every Fri</p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            {badge("Book slot")}
                            {badge("Request intro")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {/* Resources */}
              {tab === "resources" && (
                <motion.div key="rs" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SectionCard>
                    <h3 className="text-xl font-semibold tracking-tight">Resources</h3>
                    <div className="mt-3 grid md:grid-cols-3 gap-4">
                      {[{
                        t:"Guidelines", i:<BookOpen className="w-4 h-4"/>, s:"PDF",
                      },{ t:"Sandbox Directory", i:<Globe className="w-4 h-4"/>, s:"Pilot partners" },{ t:"FAQ", i:<HelpCircle className="w-4 h-4"/>, s:"Most asked" }].map((r)=> (
                        <a key={r.t} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">{r.i}</div>
                            <div>
                              <p className="font-medium">{r.t}</p>
                              <p className="text-xs text-neutral-500">{r.s}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4"/>
                        </a>
                      ))}
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {/* Dashboard */}
              {tab === "dashboard" && (
                <motion.div key="db" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <SectionCard>
                      <h3 className="font-semibold mb-3">Applications Trend (demo)</h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={kpiSeries}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="apps" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </SectionCard>

                    <SectionCard>
                      <h3 className="font-semibold mb-3">Sector Mix (demo)</h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} outerRadius={90} dataKey="value" nameKey="name">
                              {pieData.map((_, i) => (
                                <Cell key={i} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </SectionCard>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right rail */}
          <div className="space-y-5">
            <SectionCard>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"><Search className="w-4 h-4"/></div>
                <div>
                  <p className="font-medium">Quick Links</p>
                  <div className="mt-2 grid gap-2 text-sm">
                    <a className="inline-flex items-center gap-2 underline" href="#"><FileText className="w-4 h-4"/>Scheme Guidelines</a>
                    <a className="inline-flex items-center gap-2 underline" href="#"><Shield className="w-4 h-4"/>Privacy & Data Policy</a>
                    <a className="inline-flex items-center gap-2 underline" href="#"><LinkIcon className="w-4 h-4"/>MSH Main Portal</a>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <p className="text-sm text-neutral-500">Need help? Write to <span className="font-medium">genesis@msh.gov.in</span>. For production, connect this widget to a ticketing inbox.</p>
            </SectionCard>

            <SectionCard>
              <p className="text-xs text-neutral-500">Demo build • Replace placeholders with live APIs, auth (NextAuth), RBAC, uploads (S3), and audit logs.</p>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 shadow-lg text-sm">{toast}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
