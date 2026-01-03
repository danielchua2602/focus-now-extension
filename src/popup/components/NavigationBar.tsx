import clsx from "clsx";

interface NavigationBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="h-22 flex items-center text-gray-300">
      <button
        className={clsx("py-5 px-8 font-medium", {
          "text-black border-b-2 border-blue-300": activeTab === "Active",
        })}
        role="tab"
        aria-selected={activeTab === "Active"}
        onClick={() => setActiveTab("Active")}
      >
        Active
      </button>
      <span className="h-10 w-0.5 bg-blue-300"></span>
      <button
        className={clsx("py-5 px-8 font-medium", {
          "text-black border-b-2 border-blue-300": activeTab === "Upcoming",
        })}
        role="tab"
        aria-selected={activeTab === "Upcoming"}
        onClick={() => setActiveTab("Upcoming")}
      >
        Upcoming
      </button>
      <div className="ml-auto px-8 py-5">
        <button className="flex gap-1 px-3 py-2 text-blue-500 font-semibold rounded-md border border-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path
              fill-rule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
          Add Schedule
        </button>
      </div>
    </nav>
  );
}
