import { Routes, Route, Navigate, } from "react-router-dom";

import PatientLayout from "./pages/patient/patientlayout";
import Overview from "./pages/patient/overview";
import CallHistory from "./pages/patient/CallHistory";
import Alerts from "./pages/patient/Alerts";
import Features from "./pages/patient/Features";
import CarePlan from "./pages/patient/CarePlan";
import Documents from "./pages/patient/Document";

import { useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom' 

import {
  Menu, Activity, Bell, FileText, Headphones, Home, LogOut, Settings, Users, ChevronDown, Search, ShieldPlus, X,
  Phone, FilePenLine, MoreVertical, UserRound, Maximize2, Minimize2, } from 'lucide-react'

function Header({ onMenuClick }: { onMenuClick: () => void })
 {
  return (
<header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

  {/* LEFT - Menu + Logo + Title */}
  <div className="flex items-center gap-3">

    {/* MENU BUTTON */}
    <button
      onClick={onMenuClick}
      className="rounded-md p-2 text-gray-600 hover:bg-gray-100">
      <Menu size={22} />
    </button>

        {/* Shield Icon */}
        <div className="flex h-10 w-10 items-center justify-center">
          <ShieldPlus size={30} strokeWidth={2} className="text-green-700"/>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-[16px] font-semibold text-gray-800"> AI Post-Discharge Monitoring </h1>
          <p className="text-[11px] text-gray-500"> Real-time insights. Better outcomes. </p>
        </div>

  </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="flex h-9 w-72 items-center gap-2 rounded-md border border-gray-200 bg-white px-3">

          <Search size={16}  className="text-gray-500" />
          <input
            type="text"
            placeholder="Search patients, ID, or keywords..."
            className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400" />
        </div>

        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-700"/>
          {/* Notification number */}
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[9px] font-semibold text-white">
            12 </span>
        </div>

        {/* Doctor Profile */}
        <div className="flex items-center gap-3">
          {/* Profile image */}
          <img
            src="https://i.pravatar.cc/100?img=47"
            alt="Dr. Sarah Davis"
            className="h-9 w-9 rounded-full object-cover"/>
          {/* Name + Role */}
          <div className="leading-tight">
            <p className="text-xs font-semibold text-gray-800"> Dr. Sarah Davis </p>
            <p className="text-[10px] text-gray-500"> Care Team</p>
          </div>
          {/* Dropdown */}
          <ChevronDown size={15} className="ml-2 text-gray-600" />
        </div>

      </div>

</header>);
}

function PatientDetail({
  patient,
  onClose,
}: {
  patient: string
  onClose: () => void
}) {

  const patients = {
    'John Doe': {
      image: 'https://i.pravatar.cc/100?img=12',
      id: 'AI-AD300072',
      risk: 'High Risk',
      percentage: '85%',
      age: '62',
      diagnosis: 'Heart Failure',
      doctor: 'Dr. James Wilson',
      discharged: 'May 24, 2024',
    },

    'Mary Chen': {
      image: 'https://i.pravatar.cc/100?img=32',
      id: 'AI-MC380023',
      risk: 'Moderate Risk',
      percentage: '62%',
      age: '51',
      diagnosis: 'Diabetes',
      doctor: 'Dr. Emily Brown',
      discharged: 'May 26, 2024',
    },

    'Sarah Davies': {
      image: 'https://i.pravatar.cc/100?img=47',
      id: 'AI-AN380023',
      risk: 'High Risk',
      percentage: '78%',
      age: '56',
      diagnosis: 'Heart Failure',
      doctor: 'Dr. James Wilson',
      discharged: 'May 24, 2024',
    },

    'Robert Williams': {
      image: 'https://i.pravatar.cc/100?img=11',
      id: 'AI-AW210045',
      risk: 'Low Risk',
      percentage: '28%',
      age: '48',
      diagnosis: 'Hypertension',
      doctor: 'Dr. Michael Smith',
      discharged: 'May 17, 2024',
    },

    'Linda Thompson': {
      image: 'https://i.pravatar.cc/100?img=44',
      id: 'AI-LT220088',
      risk: 'Moderate Risk',
      percentage: '55%',
      age: '59',
      diagnosis: 'COPD',
      doctor: 'Dr. Emily Brown',
      discharged: 'May 25, 2024',
    },
  }

  const data = patients[patient as keyof typeof patients]
  return (
    <div className="h-full overflow-y-auto bg-white">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-800"> Patient Detail </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"> <X size={18} />
        </button>
      </div>

      {/* PATIENT INFORMATION */}
  <div className="border-b border-gray-100 p-4">
    <div className="flex items-center gap-3">
          {/* Patient image */}
    <img src={data.image} alt={patient}
         className="h-14 w-14 rounded-full object-cover"/>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-gray-800"> {patient} </h3>
      <p className="text-[10px] text-gray-500"> ID: {data.id} </p>
        <div className="mt-1 flex gap-2">
          <span className="rounded bg-red-50 px-2 py-1 text-[9px] font-medium text-red-600">
            {data.risk} </span>
          <span className="rounded bg-red-50 px-2 py-1 text-[9px] font-medium text-red-500">
            {data.percentage} </span>
        </div>

    </div>
    </div>
      <p className="mt-2 text-[10px] text-gray-500"> Discharged: {data.discharged} </p>
  </div>

      {/* BASIC DETAILS */}
<div className="grid grid-cols-4 border-b border-gray-100">
<InfoItem
  icon={<UserRound size={13} />}
  title="Age"
  value={data.age} />

<InfoItem
  icon={<Activity size={13} />}
  title="Diagnosis"
  value={data.diagnosis} />

<InfoItem
  icon={<FileText size={13} />}
  title="Care Plan"
  value="Standard" />

<InfoItem
  icon={<UserRound size={13} />}
  title="Primary Dr."
  value={data.doctor} />
</div>

      {/* LATEST CHECK-IN */}
    <section className="m-3 rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-800"> Latest CALLE Check-in </h3>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded bg-green-50 px-2 py-1 text-[9px] font-medium text-green-700">
          Day 7 Check-in </span>
        <span className="text-[9px] text-gray-500">
          Today, 12:35 PM  </span>
        <button className="rounded bg-green-50 px-2 py-1 text-[9px] font-medium text-green-700">
          View Transcript →
        </button>
      </div>
      <div className="mt-3 flex gap-3 text-[9px] text-gray-500">
        <span> Duration: 18:24 min </span>
        <span className="rounded bg-red-50 px-2 py-1 text-red-600">
          2 Alerts </span>
      </div>
    </section>


      {/* EXTRACTED FEATURES */}
<section className="mx-3 rounded-lg border border-gray-200">
  <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
    <h3 className="text-xs font-semibold text-gray-800"> Extracted Features </h3>
    <button className="text-[9px] font-medium text-green-700">
      View Trends →
    </button>
  </div>
<table className="w-full text-[8px]">
    <thead className="bg-gray-50 text-gray-500">
      <tr>
        <th className="px-2 py-2 text-left"> Feature </th>
        <th className="px-2 py-2 text-left"> Current Status </th>
        <th className="px-2 py-2 text-left"> Trend (vs last call) </th>
      </tr>
    </thead>
  <tbody>
  <FeatureRow
    feature="Medication Adherence"
    status="Poor"
    statusColor="red"
    trend="↓ 15%"/>

  <FeatureRow
    feature="Symptoms (Pain)"
    status="Worsening"
    statusColor="red"
    trend="↑ 20%"/>

  <FeatureRow
    feature="Caregiver Support"
    status="Available"
    statusColor="green"
    trend="—" />

  <FeatureRow
    feature="Mobility"
    status="Limited"
    statusColor="yellow"
    trend="↓ 5%" />

  <FeatureRow
    feature="Transportation Barrier"
    status="No"
    statusColor="green"
    trend="—" />

  <FeatureRow
    feature="Financial / Access Barrier"
    status="Possible"
    statusColor="yellow"
    trend="—"  />
  </tbody>
</table>
</section>

      {/* ALERTS */}
      <section className="m-3 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-800">  Active Alerts (2) </h3>
          <button className="text-[9px] font-medium text-green-700">
            View All →
          </button>
        </div>

        {/* Critical alert */}
        <div className="border-b border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-red-50 px-2 py-1 text-[8px] font-medium text-red-600">
              🔴 Critical  </span>
            <span className="text-[9px] font-medium text-gray-700">
              Severe pain reported </span>
            <span className="ml-auto text-[8px] text-gray-400">
            12:35 PM </span>
          </div>
          <p className="mt-1 text-[8px] text-gray-500">
            Evidence: Patient reported pain level 8/10 </p>
        </div>

        {/* Moderate alert */}
        <div className="p-3">

          <div className="flex items-center gap-2">

            <span className="rounded bg-orange-50 px-2 py-1 text-[8px] font-medium text-orange-600">
              🟠 Moderate
            </span>

            <span className="text-[9px] font-medium text-gray-700">
              Medication non-adherence risk
            </span>

            <span className="ml-auto text-[8px] text-gray-400">
              12:35 PM
            </span>

          </div>

          <p className="mt-1 text-[8px] text-gray-500">
            Evidence: Missed 2 doses in last 3 days
          </p>

        </div>

      </section>


      {/* RECOMMENDED ACTION */}
      <section className="m-3 rounded-lg border border-gray-200 p-3">

        <h3 className="text-xs font-semibold text-gray-800">
          Recommended Action
        </h3>

        <p className="mt-2 text-[9px] text-gray-600">
          Clinical review recommended within 24 hours.
        </p>

        <div className="mt-3 flex gap-2">

          <button className="flex items-center gap-1 rounded-md bg-[#176b50] px-3 py-2 text-[9px] font-medium text-white hover:bg-[#12553f]">
            <Phone size={12} />
            Call Patient
          </button>

          <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-2 text-[9px] font-medium text-gray-700 hover:bg-gray-50">
            <FilePenLine size={12} />
            Add Note
          </button>

          <button className="ml-auto rounded-md border border-gray-200 px-2 py-2 text-gray-500">
            <MoreVertical size={14} />
          </button>

        </div>

      </section>

    </div>
  )
}
function InfoItem({
  icon,
  title,
  value,
}: {
icon: ReactNode
  title: string
  value: string
}) {
  return (
    <div className="border-r border-gray-100 p-2">

      <div className="flex items-center gap-1 text-green-700">
        {icon}

        <span className="text-[8px] text-gray-500">
          {title}
        </span>
      </div>

      <p className="mt-1 text-[9px] font-medium text-gray-700">
        {value}
      </p>

    </div>
  )
}
function FeatureRow({
  feature,
  status,
  statusColor,
  trend,
}: {
  feature: string
  status: string
  statusColor: 'red' | 'green' | 'yellow'
  trend: string
}) {
  const statusClasses = {
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  }

  return (
    <tr className="border-t border-gray-100">

      <td className="px-2 py-2 text-gray-600">
        {feature}
      </td>

      <td className="px-2 py-2">
        <span
          className={`rounded px-2 py-1 ${statusClasses[statusColor]}`}
        >
          {status}
        </span>
      </td>

      <td className="px-2 py-2 text-gray-500">
        {trend}
      </td>

    </tr>
  )
}
 
const patients = [
  {
    name: "John Doe",
    id: "AI-AD300072",
    image: "https://i.pravatar.cc/100?img=12",
    risk: "High",
    riskScore: 85,
    alerts: 3,
    days: 7,
    lastCall: "Today, 10:30 AM",
    status: "High Risk",
    medication: 72,
    symptoms: "Worsening",
  },
  {
    name: "Mary Chen",
    id: "AI-AN380023",
    image: "https://i.pravatar.cc/100?img=32",
    risk: "Moderate",
    riskScore: 62,
    alerts: 1,
    days: 5,
    lastCall: "Yesterday, 2:15 PM",
    status: "Moderate Risk",
    medication: 84,
    symptoms: "Stable",
  },
  {
    name: "Sarah Davies",
    id: "AI-SD380023",
    image: "https://i.pravatar.cc/100?img=47",
    risk: "High",
    riskScore: 78,
    alerts: 2,
    days: 7,
    lastCall: "Today, 12:35 PM",
    status: "High Risk",
    medication: 68,
    symptoms: "Worsening",
  },
  {
    name: "Robert Williams",
    id: "AI-AW210045",
    image: "https://i.pravatar.cc/100?img=11",
    risk: "Low",
    riskScore: 28,
    alerts: 0,
    days: 14,
    lastCall: "Yesterday, 11:05 AM",
    status: "On Track",
    medication: 96,
    symptoms: "Improving",
  },
  {
    name: "Linda Thompson",
    id: "AI-LT220088",
    image: "https://i.pravatar.cc/100?img=44",
    risk: "Moderate",
    riskScore: 55,
    alerts: 1,
    days: 6,
    lastCall: "Today, 9:20 AM",
    status: "Moderate Risk",
    medication: 81,
    symptoms: "Stable",
  },
]

function Dashboard() {
  const [sortBy, setSortBy] = useState("risk")
  const [patientsExpanded, setPatientsExpanded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  const navigate = useNavigate()

const sortedPatients = [...patients].sort((a, b) => {
  switch (sortBy) {
    case "recent":
      return a.days - b.days

    case "medication":
      return a.medication - b.medication

    case "symptoms":
      const symptomOrder: Record<string, number> = {
        Worsening: 3,
        Stable: 2,
        Improving: 1,
      }

      return symptomOrder[b.symptoms] - symptomOrder[a.symptoms]

    case "risk":
    default:
      return b.riskScore - a.riskScore
  }
})

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-56 flex-col
          bg-[#063b2f] px-3 py-4 text-white
          transition-transform duration-300
          ${sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'}
        `}
      >
      {/* LOGO + CLOSE BUTTON */}
<div className="relative mb-8 flex justify-center">

  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f5ef]">
      <span className="text-xl">♥</span>
    </div>
  </div>
  <button
    onClick={() => setSidebarOpen(false)}
    className="absolute right-0 top-0 rounded-md p-1 text-gray-300 hover:bg-[#145542] hover:text-white" >
    <X size={18} />
  </button>
</div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 rounded-lg bg-[#2f725d] px-3 py-2.5 text-sm">
            <Home size={17} />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-[#145542]">
            <Users size={17} />
            <span>Patients</span>
          </button>
          <button className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-[#145542]">
            <div className="flex items-center gap-3">
              <Bell size={17} />
              <span>Alerts</span>
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5aa47e] text-xs">
              8
            </span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-[#145542]">
            <Activity size={17} />
            <span>Analytics</span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-[#145542]">
            <FileText size={17} />
            <span>Reports</span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-[#145542]">
            <Settings size={17} />
            <span>Settings</span>
          </button>

        </nav>

        {/* PUSH CONTENT TO BOTTOM */}
        <div className="flex-1" />

        {/* HELP */}
        <div className="mb-6 rounded-lg border border-[#28624f] bg-[#104d3d] p-3 text-center">

          <Headphones size={17} className="mx-auto mb-2" />

          <p className="text-xs font-medium">
            Need Help?
          </p>

          <p className="mt-1 text-[10px] leading-4 text-gray-300">
            Contact support
            <br />
            for any assistance.
          </p>

          <button className="mt-3 w-full rounded-md border border-[#5d9b80] px-2 py-1.5 text-[10px] hover:bg-[#28624f]">
            Contact Support
          </button>

        </div>

        {/* LOGOUT */}
        <button className="flex items-center justify-center text-gray-300 hover:text-white">
          <LogOut size={15} />
        </button>

      </aside>


      {/* RIGHT SIDE */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <Header
         onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* MAIN CONTENT */}
   <main className="p-6">
  {/* PAGE TITLE */}
  <div className="mb-4">
    <h1 className="text-xl font-semibold text-gray-800">
      Dashboard
    </h1>

    <p className="text-xs text-gray-500">
      Welcome back, Dr. Sarah. Here's today's overview.
    </p>
  </div>


  {/* ================= STATISTICS CARDS ================= */}

  <div className="grid grid-cols-5 gap-3">

    {/* Total Patients */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-medium text-gray-600">
        Total Patients
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">
          128
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700">
          <Users size={18} />
        </div>
      </div>

      <p className="mt-2 text-[10px] text-green-700">
        ▲ 12 this week
      </p>
    </div>


    {/* High Risk */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-medium text-gray-600">
        High Risk
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">
          24
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldPlus size={18} />
        </div>
      </div>

      <p className="mt-2 text-[10px] text-gray-500">
        18.8% of total
      </p>
    </div>


    {/* Moderate Risk */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-medium text-gray-600">
        Moderate Risk
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">
          42
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
          <Activity size={18} />
        </div>
      </div>

      <p className="mt-2 text-[10px] text-green-700">
        32.8% of total
      </p>
    </div>


    {/* On Track */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-medium text-gray-600">
        On Track
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">
          62
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700">
          ✓
        </div>
      </div>

      <p className="mt-2 text-[10px] text-green-700">
        48.4% of total
      </p>
    </div>


    {/* Active Alerts */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-medium text-gray-600">
        Active Alerts
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">
          36
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700">
          <Bell size={18} />
        </div>
      </div>

      <p className="mt-2 text-[10px] text-green-700">
        View all alerts →
      </p>
    </div>

  </div>

{/* ================= PATIENT QUEUE ================= */}
<div className={patientsExpanded?"fixed inset-0 z-50 flex flex-col bg-white p-5":"mt-4 rounded-lg border border-gray-200 bg-white shadow-sm"}>
  {/* Queue Header */}
  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
    <div>
      <h2 className="text-sm font-semibold text-gray-800">Patient Queue</h2>
      <p className="text-[10px] text-gray-500">
        {patientsExpanded?"Detailed patient monitoring and risk overview":"All active post-discharge patients"}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="h-8 cursor-pointer rounded-md border border-gray-200 bg-white px-3 text-[10px] text-gray-600 outline-none">
        <option value="risk">Sort by: Readmission Risk</option>
        <option value="recent">Sort by: Newest Check-in</option>
        <option value="medication">Sort by: Medication Adherence</option>
        <option value="symptoms">Sort by: Symptom Progression</option>
      </select>
      <button onClick={()=>setPatientsExpanded(!patientsExpanded)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50">
        {patientsExpanded?<Minimize2 size={13}/>:<Maximize2 size={13}/>}
      </button>
    </div>
  </div>

  {/* Table */}
  <div className={patientsExpanded?"flex-1 overflow-auto":"overflow-x-auto"}>
    <table className="w-full text-left">
      <thead className="sticky top-0 bg-gray-50">
        <tr className="text-[9px] text-gray-500">
          <th className="px-3 py-2">Patient</th>
          <th className="px-3 py-2">Readmission Risk</th>
          <th className="px-3 py-2">Alerts</th>
          <th className="px-3 py-2">Days Since Discharge</th>
          <th className="px-3 py-2">Last Call</th>
          {patientsExpanded&&<>
            <th className="px-3 py-2">Medication</th>
            <th className="px-3 py-2">Symptoms</th>
            <th className="px-3 py-2">Mobility</th>
            <th className="px-3 py-2">Caregiver</th>
          </>}
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedPatients.map((patient)=>(
          <tr key={patient.id} className="border-t border-gray-100 text-[10px] hover:bg-gray-50">
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                <img src={patient.image} className="h-8 w-8 rounded-full" alt={patient.name}/>
                <div>
                  <p className="font-semibold text-gray-800">{patient.name}</p>
                  <p className="text-[8px] text-gray-500">ID: {patient.id}</p>
                </div>
              </div>
            </td>
            <td className="px-3">
              <span className={`rounded px-2 py-1 ${
                patient.risk==="High"?"bg-red-50 text-red-600":
                patient.risk==="Moderate"?"bg-yellow-50 text-yellow-600":
                "bg-green-50 text-green-700"
              }`}>{patient.risk}</span>
              <span className="ml-2">{patient.riskScore}%</span>
            </td>
            <td className="px-3">{patient.alerts}</td>
            <td className="px-3">{patient.days} days</td>
            <td className="px-3">{patient.lastCall}</td>
            {patientsExpanded&&<>
              <td className="px-3">{patient.medication}%</td>
              <td className="px-3">{patient.symptoms}</td>
              <td className="px-3">{patient.name==="Robert Williams"?"Good":"Moderate"}</td>
              <td className="px-3">{patient.name==="John Doe"?"Yes":"Available"}</td>
            </>}
            <td className="px-3">
              <span className={`rounded px-2 py-1 ${
                patient.risk==="High"?"bg-red-50 text-red-600":
                patient.risk==="Moderate"?"bg-yellow-50 text-yellow-600":
                "bg-green-50 text-green-700"
              }`}>{patient.status}</span>
            </td>
            <td className="px-3">
              <button onClick={()=>setSelectedPatient(patient.name)} className="cursor-pointer rounded border border-green-200 px-3 py-1 text-green-700 hover:bg-green-50">View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-3">
    <button className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50">Previous</button>
    <button className="h-7 w-7 rounded-md bg-green-600 text-xs text-white">1</button>
    <button className="h-7 w-7 rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">2</button>
    <button className="h-7 w-7 rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">3</button>
    <button className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50">Next</button>
  </div>
</div>  

{/* ================= DASHBOARD ANALYTICS ================= */}

<div className="mt-4 grid grid-cols-2 gap-3">

  {/* ================= ALERT SUMMARY ================= */}

  <div className="flex min-h-[260px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

    {/* HEADER */}
    <div>
      <h2 className="text-[12px] font-semibold text-gray-800">
        Alert Summary
      </h2>

      <p className="mt-0.5 text-[8px] text-gray-500">
        By severity
      </p>
    </div>

    {/* CONTENT */}
    <div className="flex flex-1 items-center gap-8">

      {/* DONUT */}
      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">

        <div
          className="h-28 w-28 rounded-full"
          style={{
            background:
              "conic-gradient(#dc2626 0deg 119deg, #f59e0b 119deg 271deg, #facc15 271deg 360deg)",
          }}
        />

        <div className="absolute flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-white">
          <span className="text-[22px] font-semibold text-gray-800">
            36
          </span>

          <span className="text-[7px] text-gray-500">
            Total Alerts
          </span>
        </div>

      </div>

      {/* LEGEND */}
      <div className="flex flex-1 flex-col gap-4">

        {/* CRITICAL */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" />

            <span className="text-[9px] text-gray-600">
              Critical
            </span>
          </div>

          <span className="text-[9px] font-medium text-gray-700">
            12 (33%)
          </span>
        </div>

        {/* MODERATE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />

            <span className="text-[9px] text-gray-600">
              Moderate
            </span>
          </div>

          <span className="text-[9px] font-medium text-gray-700">
            15 (42%)
          </span>
        </div>

        {/* LOW */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />

            <span className="text-[9px] text-gray-600">
              Low
            </span>
          </div>

          <span className="text-[9px] font-medium text-gray-700">
            9 (25%)
          </span>
        </div>

      </div>

    </div>

    {/* BUTTON */}
    <div className="border-t border-gray-100 pt-3 text-center">

      <button className="text-[9px] font-medium text-green-700 hover:text-green-800">
        View all alerts →
      </button>

    </div>

  </div>


  {/* ================= FEATURE TRENDS ================= */}

  <div className="flex min-h-[260px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

    {/* HEADER */}
    <div>
      <h2 className="text-[12px] font-semibold text-gray-800">
        Feature Trends

        <span className="ml-1 text-[8px] font-normal text-gray-500">
          (Last 14 Days)
        </span>
      </h2>
    </div>


    {/* LEGEND */}
    <div className="mt-4 grid grid-cols-3 gap-4">

      {/* MEDICATION */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-700" />

          <span className="text-[8px] text-gray-600">
            Medication Adherence
          </span>
        </div>

        <p className="mt-1 ml-4 text-[10px] font-medium text-gray-700">
          82%
        </p>
      </div>


      {/* CAREGIVER */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-600" />

          <span className="text-[8px] text-gray-600">
            Caregiver Support
          </span>
        </div>

        <p className="mt-1 ml-4 text-[10px] font-medium text-gray-700">
          68%
        </p>
      </div>


      {/* SYMPTOM */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

          <span className="text-[8px] text-gray-600">
            Symptom Improvement
          </span>
        </div>

        <p className="mt-1 ml-4 text-[10px] font-medium text-gray-700">
          72%
        </p>
      </div>

    </div>


    {/* TREND CHART */}

    <div className="relative mt-3 flex-1 min-h-[100px]">

      {/* GRID LINES */}
      <div className="absolute left-8 right-0 top-2 border-t border-gray-100" />

      <div className="absolute left-8 right-0 top-1/2 border-t border-gray-100" />

      <div className="absolute left-8 right-0 bottom-5 border-t border-gray-100" />


      {/* Y LABELS */}

      <div className="absolute left-0 top-0 text-[7px] text-gray-400">
        100%
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[7px] text-gray-400">
        50%
      </div>

      <div className="absolute bottom-5 left-1 text-[7px] text-gray-400">
        0%
      </div>


      {/* LINES */}

      <svg
        className="absolute left-8 top-0 h-full w-[calc(100%-32px)]"
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
      >

        <polyline
          points="0,30 30,27 60,29 90,24 120,26 150,21 180,24 210,20 240,22 270,19 300,18"
          fill="none"
          stroke="#176b50"
          strokeWidth="2"
        />

        <polyline
          points="0,47 30,44 60,46 90,42 120,45 150,40 180,42 210,39 240,41 270,38 300,36"
          fill="none"
          stroke="#3b8f6b"
          strokeWidth="2"
        />

        <polyline
          points="0,59 30,55 60,57 90,53 120,55 150,50 180,52 210,49 240,51 270,47 300,45"
          fill="none"
          stroke="#6aa982"
          strokeWidth="2"
        />

      </svg>


      {/* X LABELS */}

      <div className="absolute bottom-0 left-9 right-0 flex justify-between text-[7px] text-gray-400">

        <span>May 18</span>

        <span>May 25</span>

        <span>May 31</span>

      </div>

    </div>


    {/* BUTTON */}

    <div className="border-t border-gray-100 pt-3 text-center">

      <button className="text-[9px] font-medium text-green-700 hover:text-green-800">
        View all trends →
      </button>

    </div>

  </div>

</div>

{/* ================= BOTTOM NAVIGATION ================= */}

<div className="mt-3 rounded-lg border border-gray-200 bg-white shadow-sm">
 <div className="flex items-center justify-between px-6">

    {/* OVERVIEW */}

    <button
      onClick={() => navigate("/patient/AI-AD300072/overview")}
      className="flex items-center gap-2 px-3 py-3 text-[9px] font-medium text-green-700 hover:text-green-800">
      <Activity size={13} />
      <span> Overview </span>
    </button>

    {/* CALL HISTORY */}
    <button
      onClick={() => navigate("/patient/AI-AD300072/calls")}
      className="flex items-center gap-2 px-3 py-3 text-[9px] text-gray-500 hover:text-green-700">
      <Phone size={13} />
      <span> Call History </span>
    </button>

    {/* ALERTS */}
    <button
      onClick={() => navigate("/patient/AI-AD300072/alerts")}
      className="flex items-center gap-2 px-3 py-3 text-[9px] text-gray-500 hover:text-green-700">
      <Bell size={13} />
      <span> Alerts </span>
    </button>

    {/* FEATURES */}
    <button
      onClick={() => navigate("/patient/AI-AD300072/features")}
      className="flex items-center gap-2 px-3 py-3 text-[9px] text-gray-500 hover:text-green-700">
      <Activity size={13} />
      <span> Features </span>
    </button>

    {/* CARE PLAN */}
    <button
      onClick={() => navigate("/patient/AI-AD300072/care-plan")}
      className="flex items-center gap-2 px-3 py-3 text-[9px] text-gray-500 hover:text-green-700">
      <FileText size={13} />
      <span> Care Plan </span>
    </button>

    {/* DOCUMENTS */}
    <button
      onClick={() => navigate("/patient/AI-AD300072/documents")}
      className="flex items-center gap-2 px-3 py-3 text-[9px] text-gray-500 hover:text-green-700">
      <FileText size={13} />
      <span> Documents </span>
    </button>
  </div>
</div>

  {/* ================= PATIENT DETAIL POPUP ================= */}

  {selectedPatient && (
  <div className="fixed right-0 top-16 z-40 h-[calc(100vh-64px)] w-[390px] bg-white shadow-xl">
    <PatientDetail  patient={selectedPatient} onClose={() => setSelectedPatient(null)}/>
  </div>)
  }
</main>

  </div>
  </div>
 
)
}
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Patient Details */}
        <Route path="/patient/:patientId" element={<PatientLayout />}>

          {/* /patient/:patientId */}
          <Route index element={<Navigate to="overview" replace />} />

          {/* /patient/:patientId/overview */}
          <Route path="overview" element={<Overview />} />

          {/* /patient/:patientId/calls */}
          <Route path="calls" element={<CallHistory />} />

          {/* /patient/:patientId/alerts */}
          <Route path="alerts" element={<Alerts />} />

          {/* /patient/:patientId/features */}
          <Route path="features" element={<Features />} />

          {/* /patient/:patientId/care-plan */}
          <Route path="care-plan" element={<CarePlan />} />

          {/* /patient/:patientId/documents */}
          <Route path="documents" element={<Documents />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
