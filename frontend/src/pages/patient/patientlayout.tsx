import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";
import {
  Activity,
  Phone,
  Bell,
  ClipboardList,
  FolderOpen,
  ArrowLeft,
} from "lucide-react";

const tabs = [
  {
    name: "Overview",
    path: "overview",
    icon: Activity,
  },
  {
    name: "Call History",
    path: "calls",
    icon: Phone,
  },
  {
    name: "Alerts",
    path: "alerts",
    icon: Bell,
  },
  {
    name: "Features",
    path: "features",
    icon: Activity,
  },
  {
    name: "Care Plan",
    path: "care-plan",
    icon: ClipboardList,
  },
  {
    name: "Documents",
    path: "documents",
    icon: FolderOpen,
  },
];

export default function PatientLayout() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Patient Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
<button
  onClick={() => navigate("/")}
  className="group flex items-center text-gray-500 transition-colors hover:text-gray-700"
  title="Back">
  <ArrowLeft size={19}  strokeWidth={2.5} />
  <span className="ml-1 max-w-0 overflow-hidden whitespace-nowrap text-[9px] opacity-0 transition-all duration-200 group-hover:max-w-10 group-hover:opacity-100">  </span>
</button>
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Patient ID: {patientId}
            </p>

            <h1 className="text-2xl font-semibold text-gray-800">
              John Doe
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Post-discharge monitoring
            </p>
          </div>

          <div className="flex items-center gap-3">

            <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
              High Risk
            </span>

            <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-sm">
              Monitoring Active
            </span>

          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="px-8 py-6 pb-28">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">

        <div className="max-w-full mx-auto px-8">

          <div className="flex items-center justify-between">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <NavLink
                  key={tab.path}
                  to={`/patient/${patientId}/${tab.path}`}
                  className={({ isActive }) =>
                    `relative flex-1 flex flex-col items-center justify-center
                    py-4 text-xs transition-all duration-200
                    ${
                      isActive
                        ? "text-green-600 font-medium"
                        : "text-gray-500 hover:text-gray-800"
                    }`
                  }
                >

                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 1.8}
                      />

                      <span className="mt-1">
                        {tab.name}
                      </span>

                      {isActive && (
                        <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-green-600 rounded-full" />
                      )}
                    </>
                  )}

                </NavLink>
              );
            })}

          </div>
        </div>
      </div>

    </div>
  );
}