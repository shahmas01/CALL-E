import { Routes, Route, Navigate, } from "react-router-dom";

import PatientLayout from "./pages/patient/patientlayout";
import Overview from "./pages/patient/overview";
import CallHistory from "./pages/patient/CallHistory";
import Alerts from "./pages/patient/Alerts";
import Features from "./pages/patient/Features";
import CarePlan from "./pages/patient/CarePlan";
import Documents from "./pages/patient/Document";
import Login from "./pages/Login";

import { useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom' 

import {
  Menu, Activity, Bell, FileText,  Home, LogOut, Settings, Users, ChevronDown, Search, ShieldPlus, X,
  Phone, FilePenLine, MoreVertical, UserRound, Maximize2, Minimize2, } from 'lucide-react'

function Header({
  onMenuClick,
  profileOpen,
  setProfileOpen,
  onLogout,
}: {
  onMenuClick: () => void;
  profileOpen: boolean;
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
}) {
  return (
 <header className="
  sticky top-0 z-50
  flex h-16 items-center justify-between
  border-b border-white/10
  bg-[#064E3B]
  px-3 sm:px-4 lg:px-6
">
  {/* LEFT - Menu + Logo + Title */}
 <div className="flex min-w-0 items-center gap-2 sm:gap-3">

    {/* MENU BUTTON */}
    <button
      onClick={onMenuClick}
      className="rounded-md p-2 text-white hover:bg-transparent
      ">
      <Menu size={22} />
    </button>

        {/* Shield Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
  <ShieldPlus
    size={40}
    strokeWidth={2}
    className="text-white sm:h-[46px] sm:w-[46px]"
  />
</div>

        {/* Title */}
        <div>
          <h1 className="
  font-anton font-bold
  text-[17px] leading-tight
  tracking-wide text-white
  sm:text-[21px]
  lg:text-[25px]
"></h1>
           <p className="text-[11px] text-emerald-100 sm:block"> Real-time insights. Better outcomes. </p>
        </div>

  </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-1 sm:gap-3 lg:gap-6">

        
 
 <div className="relative">

  {/* Profile Button */}
  <button
    onClick={() => setProfileOpen(!profileOpen)}
    className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/10"
  >

    <img
  src="https://i.pravatar.cc/100?img=47"
  alt="Profile"
  className="h-10 w-10 rounded-full object-cover"
/>

    {/* Profile Text */}
    <div className="hidden text-left leading-tight sm:block">
      <p className="text-[13px] font-semibold text-white">
        JS healthcare
      </p>

      <p className="mt-0.5 text-[11px] text-emerald-100">
        Care Team
      </p>
    </div>

    {/* Arrow */}
    <ChevronDown
      size={17}
      className={`ml-2 text-white transition-transform ${
        profileOpen ? "rotate-180" : ""
      }`}
    />

  </button>


  {/* ================= DROPDOWN ================= */}
  {profileOpen && (
    <div
      className="
        absolute right-0 top-[58px] z-50
        w-[190px]
        overflow-hidden
        rounded-xl
        border border-gray-200
        bg-white
        shadow-lg
      "
    >

      {/* Account Info */}
      <div className="border-b border-gray-100 px-4 py-3">
        <p className="text-[13px] font-semibold text-gray-900">
          JS healthcare
        </p>

        <p className="mt-1 text-[11px] text-gray-500">
          Care Team
        </p>
      </div>


      {/* Logout */}
      <button
       onClick={onLogout}
        className="
          flex w-full items-center gap-3
          px-4 py-3
          text-left
          text-[13px]
          font-medium
          text-red-600
          transition
          hover:bg-red-50
        "
      >
        <LogOut size={17} />

        <span>Logout</span>
      </button>

    </div>
  )}

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("risk")
  const [patientsExpanded, setPatientsExpanded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  const navigate = useNavigate()

const filteredPatients = patients.filter((patient) => {
  const search = searchTerm.toLowerCase().trim();

  if (!search) return true;

  return (
    patient.name?.toLowerCase().includes(search) ||
    patient.id?.toLowerCase().includes(search) 
   );
});

const sortedPatients = [...filteredPatients].sort((a, b) => {
  switch (sortBy) {
    case "recent":
      return a.days - b.days;

    case "medication":
      return b.medication - a.medication;

    case "symptoms": {
      const symptomOrder = {
        Worsening: 3,
        Stable: 2,
        Improving: 1,
      };

      return (
        (symptomOrder[b.symptoms] || 0) -
        (symptomOrder[a.symptoms] || 0)
      );
    }

    case "risk":
    default:
      return b.riskScore - a.riskScore;
  }
});
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f6f2e8]">

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
           <button
  onClick={() => {
    setPatientsExpanded(true);
    setSidebarOpen(false);
  }}
  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-[#145542]"
>
  <Users size={17} />
  <span>Patients</span>
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

        

        {/* LOGOUT */}
         <button
  onClick={() => navigate("/login")}
  className="flex items-center justify-center gap-2 text-gray-300 hover:text-white"
>
  <LogOut size={15} />
  <span>Logout</span>
</button>

      </aside>


      {/* RIGHT SIDE */}
      <div className="flex min-w-0 flex-1 flex-col">

       <Header
  onMenuClick={() => setSidebarOpen(!sidebarOpen)}
  profileOpen={profileOpen}
  setProfileOpen={setProfileOpen}
  onLogout={() => {
    setProfileOpen(false);
    navigate("/login");
  }}
/>

        {/* MAIN CONTENT */}
   <main className="min-w-0 flex-1 p-3 sm:p-4 lg:p-6">
  {/* PAGE TITLE */}
  <div className="mb-4">
    <h1 className="text-xl font-semibold text-gray-800">
      Dashboard
    </h1>
  </div>


 {/* ================= STATISTICS + ALERT SUMMARY ================= */}

<div className="
  grid
  grid-cols-1
  gap-3
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-5
">

  {/* ================= TOTAL PATIENTS ================= */}
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-[20px] font-semibold text-gray-600">
      Total Patients
    </p>

    <div className="mt-2 flex items-center justify-between">
      <span className="text-2xl font-semibold text-gray-800">
        128
      </span>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Users size={30} />
      </div>
    </div>

    <p className="mt-2 text-[10px] text-green-700">
      ▲ 12 this week
    </p>
  </div>


  {/* ================= HIGH RISK ================= */}
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-[20px] font-semibold text-gray-600">
      High Risk
    </p>

    <div className="mt-2 flex items-center justify-between">
      <span className="text-2xl font-semibold text-gray-800">
        24
      </span>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600">
        <ShieldPlus size={30} />
      </div>
    </div>

    <p className="mt-2 text-[10px] text-gray-500">
      18.8% of total
    </p>
  </div>


  {/* ================= ON TRACK ================= */}
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-[20px] font-semibold text-gray-600">
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


  {/* ================= ACTIVE ALERTS ================= */}
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-[20px] font-semibold text-gray-600">
      Active Alerts
    </p>

    <div className="mt-2 flex items-center justify-between">
      <span className="text-2xl font-semibold text-gray-800">
        36
      </span>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Bell size={30} />
      </div>
    </div>

    <p className="mt-2 text-[10px] text-green-700">
      View all alerts →
    </p>
  </div>


  {/* ================= ALERT SUMMARY ================= */}
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

    {/* HEADER */}
    <div>
      <p className="text-[20px] font-semibold text-gray-600">
        Alert Summary
      </p>

      <p className="mt-0.5 text-[10px] text-gray-500">
        By severity
      </p>
    </div>


    {/* DONUT + LEGEND */}
    <div className="mt-4 flex items-center gap-4">

      {/* DONUT */}
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">

        <div
          className="h-24 w-24 rounded-full"
          style={{
            background:
              "conic-gradient(#dc2626 0deg 119deg, #f59e0b 119deg 271deg, #facc15 271deg 360deg)",
          }}
        />

        <div className="absolute flex h-[64px] w-[64px] flex-col items-center justify-center rounded-full bg-white">
          <span className="text-[20px] font-semibold text-gray-800">
            36
          </span>

          <span className="text-[7px] text-gray-500">
            Total Alerts
          </span>
        </div>

      </div>


      {/* LEGEND */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">

        {/* CRITICAL */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-600" />

            <span className="text-[9px] text-gray-600">
              Critical
            </span>
          </div>

          <span className="text-[9px] font-medium text-gray-700">
            12 (33%)
          </span>
        </div>


        {/* MODERATE */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-400" />

            <span className="text-[9px] text-gray-600">
              Moderate
            </span>
          </div>

          <span className="text-[9px] font-medium text-gray-700">
            15 (42%)
          </span>
        </div>


        {/* LOW */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-400" />

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
    <div className="mt-4 border-t border-gray-100 pt-2 text-center">
      <button className="text-[9px] font-medium text-green-700 hover:text-green-800">
        View all alerts →
      </button>
    </div>

  </div>

</div>

{/* ================= PATIENT QUEUE ================= */}
<div className={patientsExpanded?"fixed inset-0 z-50 flex flex-col bg-white p-5":"mt-4 rounded-lg border border-gray-200 bg-white shadow-sm"}>
  {/* Queue Header */}
<div className="  border border-gray-200 bg-white shadow-sm overflow-hidden">

  {/* ================= PATIENT QUEUE TOOLBAR ================= */}
<div className="
  flex flex-col gap-3
  border-b border-gray-200
  px-3 py-3
  sm:px-5 sm:py-4
  lg:flex-row lg:items-center lg:justify-between
">
    <div>
      <h2 className="text-[17px] font-semibold text-gray-900">
        Patient Queue
      </h2>

      <p className="mt-1 text-[12px] text-gray-500">
        All active post-discharge patients
      </p>
    </div>

    <div className="
  flex w-full flex-col gap-2
  sm:flex-row
  lg:w-auto
">

      {/* Search */}
      <div className="relative w-full sm:w-[280px] lg:w-[300px]">

        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patients, ID, or keywords"
          className="
            h-10 w-full
            rounded-lg
            border border-gray-200
            bg-white
            pl-10 pr-4
            text-[13px]
            text-gray-700
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-100
          "
        />

      </div>

      {/* Sort */}
     <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="
    h-10 min-w-0 flex-1
    rounded-lg border border-gray-200
    bg-white px-2
    text-[12px] font-medium text-gray-700
    outline-none
    sm:w-[250px] sm:flex-none sm:px-4 sm:text-[13px]
  "
>
        <option value="risk">
          Sort by: Readmission Risk
        </option>

        <option value="recent">
          Sort by: Recent
        </option>

        <option value="medication">
          Sort by: Medication Adherence
        </option>

        <option value="symptoms">
          Sort by: Symptoms
        </option>
      </select>

      {/* Expand */}
      <button
        onClick={() => setPatientsExpanded(!patientsExpanded)}
        className="
    flex h-10 w-10 shrink-0
    items-center justify-center
    rounded-lg border border-gray-200
    bg-white text-gray-600
  "
      >
        {patientsExpanded ? (
          <Minimize2 size={17} />
        ) : (
          <Maximize2 size={17} />
        )}
      </button>

    </div>
  </div>
  </div>

  {/* Table */}

<div className="w-full overflow-x-auto">
  <table className="w-full min-w-[900px] text-left">
      <thead className="sticky top-0 bg-gray-50">
        <tr className="text-[11px] text-gray-500 sm:text-xs lg:text-[13px]">
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
          <tr key={patient.id} className="border-t border-gray-100 text-[13px] hover:bg-gray-50">
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                <img src={patient.image} className="h-8 w-8 rounded-full" alt={patient.name}/>
                <div>
                  <p className="font-semibold text-gray-800">{patient.name}</p>
                  <p className="text-[10px] text-gray-500">ID: {patient.id}</p>
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
    <button className="h-7 w-7 rounded-md bg-[#064E3B] text-xs text-white">1</button>
    <button className="h-7 w-7 rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">2</button>
    <button className="h-7 w-7 rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">3</button>
    <button className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50">Next</button>
  </div>
</div>  

{/* ================= DASHBOARD ANALYTICS ================= */}

<div className="mt-4 grid grid-cols-2 gap-3">

 
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

        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
