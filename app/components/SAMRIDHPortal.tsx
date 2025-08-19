"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, PieChart, Cell } from "recharts";
import { CheckCircle2, AlertTriangle, Rocket, FileSignature, ShieldCheck, Users, Building2, Calendar, Upload, ArrowRight, ArrowLeft, Send, Eye, Award, ClipboardList, CheckSquare, Settings, Inbox, FileText, Workflow, TrendingUp, Coins, BookOpen } from "lucide-react";

/*
  SAMRIDH Mini-Portal UI (single-file demo)
  -------------------------------------------------------------
  - Built as a self-contained React component you can drop into a Next.js/CRA app.
  - Uses TailwindCSS classes for styling (no external UI kit required).
  - Demonstrates core flows you requested:
      • Public Landing + Overview
      • Eligibility Wizard
      • Multi-step Application Form (draft + submit)
      • Applicant Status Tracker (stages, milestones, claims)
      • Reviewer Console (queues, rubric scoring, shortlist)
      • Admin / Cohort Manager (milestones, disbursement checkpoints)
      • Leadership Dashboard (live KPIs over sample data)
  - Replace placeholder handlers with API calls later.
*/

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "eligibility", label: "Eligibility" },
  { key: "apply", label: "Apply" },
  { key: "track", label: "Track" },
  { key: "review", label: "Review" },
  { key: "admin", label: "Admin" },
  { key: "dashboard", label: "Dashboard" },
];

const ROLES = ["Applicant", "Reviewer", "Admin"] as const;

type Role = typeof ROLES[number];

const stages = [
  { key: "submitted", label: "Submitted" },
  { key: "screening", label: "Screening" },
  { key: "due_diligence", label: "Due Diligence" },
  { key: "committee", label: "Committee" },
  { key: "awarded", label: "Awarded" },
  { key: "onboarded", label: "Onboarded" },
];

const KPI = ({ title, value, icon: Icon, subtitle }: any) => (
  <div className="rounded-2xl p-5 bg-white shadow-sm border border-slate-100 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <div className="text-slate-500 text-sm">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  </div>
);

function Section({ title, subtitle, children }: any) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span>{title}</span>
        </h3>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Pill({ children, tone = "default" }: any) {
  const tones: Record<string, string> = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warn: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs ${tones[tone]}`}>{children}</span>;
}

// ---------- Overview ----------
function Overview() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <Section title="SAMRIDH – Startup Accelerators of MeitY for Product Innovation, Development & Growth" subtitle="Dedicated workspace for applicants, reviewers, and administrators.">
          <div className="prose max-w-none">
            <p>
              SAMRIDH supports startups with market access, mentorship, and funding support through
              accelerator partnerships. This mini-portal provides a focused experience for the scheme,
              while sharing a common login and data model with the main MSH portal.
            </p>
            <ul>
              <li>Apply once, save drafts, and track your application in real-time.</li>
              <li>Reviewers can score via a transparent rubric and shortlist to cohorts.</li>
              <li>Admins manage milestones, verify claims, and track disbursements with audit logs.</li>
            </ul>
          </div>
        </Section>
        <Section title="Key Dates" subtitle="Indicative; replace with live API-fed dates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Call Opens", date: "15 Sep 2025" },
              { title: "Call Closes", date: "30 Oct 2025" },
              { title: "Committee", date: "Dec 2025" },
            ].map((d) => (
              <div className="rounded-xl border border-slate-100 p-4 flex items-center gap-3" key={d.title}>
                <Calendar className="h-5 w-5" />
                <div>
                  <div className="text-sm text-slate-500">{d.title}</div>
                  <div className="font-medium">{d.date}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <div className="space-y-6">
        <KPI title="Applications (current)" value="1,284" subtitle="Live feed from DB in prod" icon={Inbox} />
        <KPI title="Shortlisted" value="184" icon={CheckSquare} />
        <KPI title="Cohorts Running" value="12" icon={Users} />
        <KPI title="Funds Disbursed" value="₹ 42.6 Cr" icon={Coins} />
      </div>
    </div>
  );
}

// ---------- Eligibility Wizard ----------
const ELIGIBILITY_QUESTIONS = [
  { key: "incorporated", label: "Is your startup incorporated in India?" },
  { key: "dpiit", label: "Do you have valid DPIIT recognition?" },
  { key: "ip", label: "Do you hold or control relevant IP / licenses?" },
  { key: "revenue", label: "Do you have revenue or pilots in the last 12 months?" },
  { key: "accelerator", label: "Are you willing to join an accelerator cohort for 6 months?" },
];

function Eligibility({ onEligible }: { onEligible: () => void }) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const allAnswered = ELIGIBILITY_QUESTIONS.every((q) => answers[q.key] !== undefined);
  const yesCount = ELIGIBILITY_QUESTIONS.filter((q) => answers[q.key]).length;
  const isEligible = allAnswered && yesCount >= 4; // tweak rule as required

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {ELIGIBILITY_QUESTIONS.map((q) => (
          <div key={q.key} className="rounded-xl border border-slate-100 p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{q.label}</div>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-lg border ${answers[q.key] === true ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}
                onClick={() => setAnswers((a) => ({ ...a, [q.key]: true }))}
              >
                Yes
              </button>
              <button
                className={`px-3 py-1 rounded-lg border ${answers[q.key] === false ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}
                onClick={() => setAnswers((a) => ({ ...a, [q.key]: false }))}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <Section title="Eligibility Result" subtitle="Calculated instantly based on your answers">
          <div className="flex items-center gap-3">
            {isEligible ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            )}
            <div className="text-lg font-semibold">
              {isEligible ? "You are eligible to apply." : allAnswered ? "Not eligible yet." : "Answer all questions"}
            </div>
          </div>
          <div className="text-sm text-slate-500 mt-2">Yes answers: {yesCount}/{ELIGIBILITY_QUESTIONS.length}</div>
          <button
            disabled={!isEligible}
            onClick={onEligible}
            className={`mt-4 w-full px-4 py-2 rounded-xl text-white ${isEligible ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-300 cursor-not-allowed"}`}
          >
            Start Application
          </button>
        </Section>
      </div>
    </div>
  );
}

// ---------- Application Form (multi-step) ----------
const APPLICATION_STEPS = [
  { key: "org", label: "Organization" },
  { key: "team", label: "Team" },
  { key: "product", label: "Product" },
  { key: "traction", label: "Traction" },
  { key: "financials", label: "Financials" },
  { key: "docs", label: "Documents" },
  { key: "review", label: "Review & Submit" },
];

type AppData = {
  orgName?: string; cin?: string; state?: string; website?: string; dpiit?: string;
  teamSize?: number; founders?: string; advisors?: string;
  productName?: string; problem?: string; solution?: string; ip?: string;
  tractionUsers?: number; pilots?: string; partners?: string;
  askAmount?: number; coFunding?: number; revenue12m?: number;
  documents?: string[];
};

function ApplicationForm({ onSubmit }: { onSubmit: (data: AppData) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AppData>(() => {
    try {
      const cached = localStorage.getItem("samridh_draft");
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const saveDraft = () => {
    localStorage.setItem("samridh_draft", JSON.stringify(data));
  };

  const next = () => setStep((s) => Math.min(APPLICATION_STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const Stepper = (
    <div className="flex items-center gap-2 flex-wrap">
      {APPLICATION_STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={`h-9 px-3 rounded-full flex items-center text-sm border ${i === step ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200"}`}>
            {i + 1}. {s.label}
          </div>
          {i < APPLICATION_STEPS.length - 1 && <div className="w-6 h-px bg-slate-200" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Section title="Application Progress" subtitle="You can save as draft anytime.">{Stepper}</Section>

      {/* Step content */}
      <Section title={APPLICATION_STEPS[step].label}>
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Organization Name" value={data.orgName} onChange={(v)=>setData({...data, orgName:v})} />
            <Input label="CIN" value={data.cin} onChange={(v)=>setData({...data, cin:v})} />
            <Input label="State" value={data.state} onChange={(v)=>setData({...data, state:v})} />
            <Input label="Website" value={data.website} onChange={(v)=>setData({...data, website:v})} />
            <Input label="DPIIT No." value={data.dpiit} onChange={(v)=>setData({...data, dpiit:v})} />
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput label="Team Size" value={data.teamSize} onChange={(v)=>setData({...data, teamSize:v})} />
            <TextArea label="Founders (names, roles)" value={data.founders} onChange={(v)=>setData({...data, founders:v})} />
            <TextArea label="Advisors / Mentors" value={data.advisors} onChange={(v)=>setData({...data, advisors:v})} />
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name" value={data.productName} onChange={(v)=>setData({...data, productName:v})} />
            <TextArea label="Problem Statement" value={data.problem} onChange={(v)=>setData({...data, problem:v})} />
            <TextArea label="Solution Overview" value={data.solution} onChange={(v)=>setData({...data, solution:v})} />
            <TextArea label="IP / Patents / Licenses" value={data.ip} onChange={(v)=>setData({...data, ip:v})} />
          </div>
        )}
        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput label="Users / Deployments (last 12m)" value={data.tractionUsers} onChange={(v)=>setData({...data, tractionUsers:v})} />
            <TextArea label="Pilots / POCs" value={data.pilots} onChange={(v)=>setData({...data, pilots:v})} />
            <TextArea label="Partners / Clients" value={data.partners} onChange={(v)=>setData({...data, partners:v})} />
          </div>
        )}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput label="Funding Ask (₹)" value={data.askAmount} onChange={(v)=>setData({...data, askAmount:v})} />
            <CurrencyInput label="Co-funding (₹)" value={data.coFunding} onChange={(v)=>setData({...data, coFunding:v})} />
            <CurrencyInput label="Revenue (last 12m, ₹)" value={data.revenue12m} onChange={(v)=>setData({...data, revenue12m:v})} />
          </div>
        )}
        {step === 5 && (
          <div className="space-y-3">
            <Uploader onFiles={(list)=>setData({...data, documents:list})} />
            {data.documents && data.documents.length>0 && (
              <ul className="list-disc pl-6 text-sm text-slate-600">
                {data.documents.map((d,i)=> <li key={i}>{d}</li>)}
              </ul>
            )}
          </div>
        )}
        {step === 6 && (
          <div className="space-y-3 text-sm">
            <p className="text-slate-600">Please verify details before submitting. You can still edit after saving draft.</p>
            <pre className="bg-slate-50 p-4 rounded-xl overflow-auto max-h-72 text-xs border border-slate-100">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button onClick={prev} disabled={step===0} className={`px-4 py-2 rounded-xl border ${step===0?"border-slate-200 text-slate-300":"border-slate-300 hover:bg-slate-50"}`}>
            <div className="flex items-center gap-2"><ArrowLeft className="h-4 w-4"/> Back</div>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={saveDraft} className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Save Draft</button>
            {step < APPLICATION_STEPS.length - 1 ? (
              <button onClick={next} className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black">
                Next <ArrowRight className="h-4 w-4 inline ml-2"/>
              </button>
            ) : (
              <button onClick={()=>onSubmit(data)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                Submit Application <Send className="h-4 w-4 inline ml-2"/>
              </button>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

// ---------- Applicant Track Status ----------
function TrackStatus() {
  const currentStage = "due_diligence";
  const myMilestones = [
    { title: "Onboarding Docs", due: "2025-10-20", status: "Pending" },
    { title: "Pilot Signed", due: "2025-11-05", status: "In Review" },
    { title: "Quarterly Report Q1", due: "2026-01-15", status: "Not Started" },
  ];

  return (
    <div className="space-y-6">
      <Section title="Application Status" subtitle="Live stage with timestamps">
        <div className="flex flex-wrap items-center gap-3">
          {stages.map((s, idx) => {
            const active = stages.findIndex((ss) => ss.key === currentStage) >= idx;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`h-9 px-3 rounded-full flex items-center text-sm border ${active ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200"}`}>
                  {active ? <CheckCircle2 className="h-4 w-4 mr-1"/> : <div className="h-2 w-2 rounded-full bg-slate-300 mr-2"/>}
                  {s.label}
                </div>
                {idx < stages.length - 1 && <div className="w-6 h-px bg-slate-200" />}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Milestones">
        <div className="space-y-3">
          {myMilestones.map((m,i)=> (
            <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
              <div className="space-y-1">
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-slate-500">Due: {m.due}</div>
              </div>
              <div className="flex items-center gap-3">
                <Pill tone={m.status === "Pending" ? "warn" : m.status === "In Review" ? "info" : "default"}>{m.status}</Pill>
                <button className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center gap-2">
                  <Upload className="h-4 w-4"/> Upload Artifact
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------- Reviewer Console ----------
const sampleApps = [
  { id: "APP-1001", org: "Agnika Tech", state: "KA", sector: "HealthTech", stage: "screening" },
  { id: "APP-1002", org: "Vyom IoT", state: "MH", sector: "IoT", stage: "screening" },
  { id: "APP-1003", org: "NexGrid", state: "DL", sector: "GridTech", stage: "due_diligence" },
];

function Reviewer() {
  const [active, setActive] = useState(sampleApps[0]);
  const [scores, setScores] = useState<any>({ team: 3, market: 3, innovation: 3, scalability: 3, documentation: 3 });
  const weights = { team: 0.2, market: 0.25, innovation: 0.25, scalability: 0.2, documentation: 0.1 };
  const total = Object.entries(scores).reduce((acc: number, [k, v]: any) => acc + v * (weights as any)[k], 0) * 20; // out of 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Section title="Queue" subtitle="Assigned to you">
        <div className="space-y-2">
          {sampleApps.map((a) => (
            <button key={a.id} onClick={()=>setActive(a)} className={`w-full text-left rounded-xl border p-3 ${active.id===a.id?"border-slate-900":"border-slate-200 hover:border-slate-300"}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{a.org}</div>
                <Pill>{a.id}</Pill>
              </div>
              <div className="text-xs text-slate-500 mt-1">{a.sector} • {a.state} • Stage: {a.stage}</div>
            </button>
          ))}
        </div>
      </Section>
      <div className="lg:col-span-2 space-y-6">
        <Section title={`Application: ${active.org}`} subtitle={active.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <div className="font-medium mb-1">Executive Summary</div>
              <p className="text-slate-600">Placeholder for one-page summary (auto-generated from applicant's form). Includes problem, solution, traction, and ask.</p>
            </div>
            <div>
              <div className="font-medium mb-1">Attachments</div>
              <ul className="list-disc pl-5">
                <li>Pitch deck.pdf</li>
                <li>Financials.xlsx</li>
                <li>DPIIT Certificate.pdf</li>
              </ul>
            </div>
          </div>
        </Section>
        <Section title="Scoring Rubric" subtitle="Weighted to compute a 100-point score">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {Object.keys(scores).map((k)=> (
              <div key={k} className="rounded-xl border p-3">
                <div className="text-sm font-medium capitalize">{k}</div>
                <input type="range" min={1} max={5} value={scores[k]} onChange={(e)=>setScores({...scores, [k]: Number(e.target.value)})} className="w-full"/>
                <div className="text-xs text-slate-500">{scores[k]} / 5 • weight {(weights as any)[k]*100}%</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Total: {Math.round(total)} / 100</div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Save Score</button>
              <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Shortlist</button>
              <button className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">Reject</button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

// ---------- Admin / Cohort Manager ----------
function AdminCohort() {
  const [milestones, setMilestones] = useState<any[]>([
    { title: "Onboarding Docs", due: "2025-10-20" },
    { title: "Pilot Signed", due: "2025-11-05" },
  ]);
  const addMilestone = () => setMilestones((m)=> [...m, { title: "New Milestone", due: new Date().toISOString().slice(0,10) }]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Section title="Create Cohort" subtitle="Group shortlisted startups into a batch">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Cohort Name" placeholder="SAMRIDH-2025-Batch-1" />
          <Input label="Start Date" type="date" />
          <Input label="End Date" type="date" />
          <Input label="Manager" placeholder="Your Name" />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Save Draft</button>
          <button className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black">Create Cohort</button>
        </div>
      </Section>
      <Section title="Milestone Template" subtitle="Applied to new awards">
        <div className="space-y-2">
          {milestones.map((m,i)=> (
            <div key={i} className="grid grid-cols-6 gap-2 items-center">
              <input value={m.title} onChange={(e)=>{
                const copy=[...milestones];
                copy[i].title=e.target.value; setMilestones(copy);
              }} className="col-span-4 px-3 py-2 rounded-lg border"/>
              <input type="date" value={m.due} onChange={(e)=>{
                const copy=[...milestones];
                copy[i].due=e.target.value; setMilestones(copy);
              }} className="col-span-2 px-3 py-2 rounded-lg border"/>
            </div>
          ))}
          <button onClick={addMilestone} className="mt-2 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center gap-2"><PlusIcon/> Add Milestone</button>
        </div>
      </Section>
      <Section title="Disbursement Controls" subtitle="Two-person approval, audit logged">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input label="Sanction No." placeholder="MSH/SAMRIDH/2025/042"/>
          <CurrencyInput label="Tranche Amount (₹)"/>
          <Input label="Approver (Finance)" placeholder="Finance Officer"/>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Create Tranche</button>
          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Approve & Release</button>
        </div>
      </Section>
      <Section title="Audit Log" subtitle="Immutable record of actions">
        <div className="text-sm text-slate-600 space-y-1">
          <div>2025-08-18 10:02 — Cohort SAMRIDH-2025-Batch-1 created by Admin.</div>
          <div>2025-08-18 10:05 — Milestone template updated (added: Quarterly Report).</div>
          <div>2025-08-18 10:10 — Disbursement Tranche #1 drafted (₹ 50,00,000).</div>
        </div>
      </Section>
    </div>
  );
}

// ---------- Dashboard ----------
function LeadershipDashboard() {
  const kpi = [
    { title: "Applications", value: 1284, icon: Inbox },
    { title: "Shortlisted", value: 184, icon: CheckSquare },
    { title: "Cohorts", value: 12, icon: Users },
    { title: "Disbursed (₹ Cr)", value: 42.6, icon: Coins },
  ];
  const byState = [
    { name: "KA", apps: 210 },
    { name: "MH", apps: 190 },
    { name: "DL", apps: 140 },
    { name: "TN", apps: 120 },
    { name: "GJ", apps: 95 },
  ];
  const bySector = [
    { name: "HealthTech", value: 26 },
    { name: "FinTech", value: 19 },
    { name: "IoT", value: 17 },
    { name: "AI/ML", value: 22 },
    { name: "GovTech", value: 16 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpi.map((k, i) => (
          <KPI key={i} title={k.title} value={k.value} icon={k.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Applications by State" subtitle="Top contributor states">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byState}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="apps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Applications by Sector" subtitle="Share of total">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={bySector} outerRadius={100} label>
                  {bySector.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}

// ---------- Small UI helpers ----------
function Input({ label, value, onChange, type = "text", placeholder }: any) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-slate-600">{label}</div>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </label>
  );
}

function NumberInput({ label, value, onChange }: any) {
  return <Input label={label} type="number" value={value ?? ""} onChange={(v: any)=>onChange?.(Number(v))} />;
}

function CurrencyInput({ label, value, onChange }: any) {
  return <Input label={label} type="number" value={value ?? ""} onChange={(v: any)=>onChange?.(Number(v))} placeholder="0" />;
}

function TextArea({ label, value, onChange, placeholder }: any) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-slate-600">{label}</div>
      <textarea
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </label>
  );
}

function Uploader({ onFiles }: { onFiles: (list: string[]) => void }) {
  const [list, setList] = useState<string[]>([]);
  const add = () => {
    const name = prompt("Enter a filename (simulate upload):");
    if (name) {
      const next = [...list, name];
      setList(next);
      onFiles(next);
    }
  };
  return (
    <div>
      <button onClick={add} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center gap-2">
        <Upload className="h-4 w-4"/> Add Document
      </button>
    </div>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>;
}

// ---------- Main Shell ----------
export default function SAMRIDHPortal() {
  const [role, setRole] = useState<Role>("Applicant");
  const [tab, setTab] = useState<string>("overview");
  const [toast, setToast] = useState<string | null>(null);

  const visibleTabs = useMemo(() => {
    return TABS.filter((t) => {
      if (t.key === "review" && role !== "Reviewer") return false;
      if (t.key === "admin" && role !== "Admin") return false;
      return true;
    });
  }, [role]);

  const submitApp = (data: AppData) => {
    // TODO: replace with POST /api/applications
    console.log("SUBMIT", data);
    setToast("Application submitted successfully. You can track status in the Track tab.");
    setTab("track");
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center"><Rocket className="h-5 w-5"/></div>
            <div>
              <div className="font-semibold leading-tight">SAMRIDH — MeitY Startup Hub</div>
              <div className="text-xs text-slate-500">Dedicated Scheme Workspace</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-1 p-1 rounded-xl bg-slate-100">
              {ROLES.map((r)=> (
                <button key={r} onClick={()=>setRole(r)} className={`px-3 py-1.5 rounded-lg text-sm ${role===r?"bg-white shadow border border-slate-200":"text-slate-600"}`}>{r}</button>
              ))}
            </div>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 -mt-2">
          <div className="flex gap-2 flex-wrap">
            {visibleTabs.map((t)=> (
              <button key={t.key} onClick={()=>setTab(t.key)} className={`px-3 py-1.5 rounded-lg text-sm border ${tab===t.key?"bg-slate-900 text-white border-slate-900":"bg-white border-slate-200 hover:border-slate-300"}`}>{t.label}</button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {tab === "overview" && <Overview/>}
        {tab === "eligibility" && <Eligibility onEligible={()=>setTab("apply")} />}
        {tab === "apply" && <ApplicationForm onSubmit={submitApp} />}
        {tab === "track" && <TrackStatus />}
        {tab === "review" && role === "Reviewer" && <Reviewer />}
        {tab === "admin" && role === "Admin" && <AdminCohort />}
        {tab === "dashboard" && <LeadershipDashboard />}
      </main>

      <footer className="py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          ******* Dedicated User Interface For SAMRIDH *******.
        </div>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-6 left-1/2 -translate-x-1/2">
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg">{toast}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
