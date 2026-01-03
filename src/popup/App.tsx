import { useState, useEffect } from "react";
import { Schedule, storage } from "../types";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleList from "./components/ScheduleList";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import { Header } from "./components/Header";

function App() {
  const [activeTab, setActiveTab] = useState("Active");
  const [websites, setWebsites] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await storage.get(["blockedWebsites", "schedules"]);
    setWebsites(data.blockedWebsites || []);
    setSchedules(data.schedules || []);
  };

  const showStatus = (message: string, type: "success" | "error") => {
    setStatus({ message, type });
    setTimeout(() => setStatus(null), 3000);
  };

  const addWebsite = async (website: string) => {
    const cleanedWebsite = website.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];

    if (websites.includes(cleanedWebsite)) {
      showStatus("Website already in list", "error");
      return;
    }

    const newWebsites = [...websites, cleanedWebsite];
    await storage.set({ blockedWebsites: newWebsites });
    setWebsites(newWebsites);
    showStatus("Website added", "success");
    chrome.runtime.sendMessage({ action: "updateRules" });
  };

  const removeWebsite = async (website: string) => {
    const newWebsites = websites.filter((w) => w !== website);
    await storage.set({ blockedWebsites: newWebsites });
    setWebsites(newWebsites);
    showStatus("Website removed", "success");
    chrome.runtime.sendMessage({ action: "updateRules" });
  };

  const addSchedule = async (schedule: Omit<Schedule, "id">) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now(),
    };

    const newSchedules = [...schedules, newSchedule];
    await storage.set({ schedules: newSchedules });
    setSchedules(newSchedules);
    showStatus("Schedule saved", "success");
    chrome.runtime.sendMessage({ action: "updateRules" });
  };

  const deleteSchedule = async (id: number) => {
    const newSchedules = schedules.filter((s) => s.id !== id);
    await storage.set({ schedules: newSchedules });
    setSchedules(newSchedules);
    showStatus("Schedule deleted", "success");
    chrome.runtime.sendMessage({ action: "updateRules" });
  };

  return (
    <div className="bg-white-100">
      <Header />
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="px-8 py-5">
        <ScheduleList schedules={schedules} onDeleteSchedule={deleteSchedule} />

        {/* <ScheduleForm onSaveSchedule={addSchedule} /> */}

        {/* {status && (
          <div
            className={`px-3 py-2 rounded text-sm text-center mt-3 ${
              status.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )} */}
      </main>
      <footer className="h-10 bg-blue-300">some footer text</footer>
    </div>
  );
}

export default App;
