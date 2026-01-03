import { Schedule } from "../types";

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === "updateRules") {
    updateBlockingRules();
  }
});

// Update blocking rules when extension installs/updates
chrome.runtime.onInstalled.addListener(() => {
  updateBlockingRules();

  // Set up alarms
  chrome.alarms.create("checkSchedule", { periodInMinutes: 1 });
  chrome.alarms.create("cleanupSchedules", { periodInMinutes: 1440 }); // Once per day
});

// Handle all alarms in one listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkSchedule") {
    updateBlockingRules();
  } else if (alarm.name === "cleanupSchedules") {
    chrome.storage.sync.get(["schedules"], (result) => {
      const schedules = (result.schedules as Schedule[]) || [];
      const today = new Date().toISOString().split("T")[0];

      // Remove past schedules
      const activeSchedules = schedules.filter((s) => s.date >= today);

      chrome.storage.sync.set({ schedules: activeSchedules });
    });
  }
});

function updateBlockingRules(): void {
  chrome.storage.sync.get(["blockedWebsites", "schedules"], (result) => {
    const websites = (result.blockedWebsites as string[]) || [];
    const schedules = (result.schedules as Schedule[]) || [];

    // Check if blocking should be active based on schedules
    // Only block during scheduled times
    const shouldBlock = isBlockingActive(schedules);

    // Remove all existing rules
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingRuleIds = existingRules.map((rule) => rule.id);

      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: existingRuleIds,
          addRules: shouldBlock ? createBlockingRules(websites) : [],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error updating rules:", chrome.runtime.lastError);
          } else {
            console.log("Rules updated. Blocking:", shouldBlock, "Websites:", websites);
          }
        }
      );
    });
  });
}

function isBlockingActive(schedules: Schedule[]): boolean {
  if (schedules.length === 0) return false;

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  // Check if any schedule is active right now
  return schedules.some((schedule) => {
    if (schedule.date !== currentDate) return false;

    return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
  });
}

function createBlockingRules(websites: string[]): chrome.declarativeNetRequest.Rule[] {
  if (!websites || websites.length === 0) return [];

  const rules: chrome.declarativeNetRequest.Rule[] = [];

  websites.forEach((website, index) => {
    // Create rule for the domain and all its subdomains
    rules.push({
      id: index + 1,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          url: chrome.runtime.getURL("blocked.html"),
        },
      },
      condition: {
        urlFilter: `*://*.${website}/*`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });

    // Also block without www
    rules.push({
      id: index + 1 + 1000,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          url: chrome.runtime.getURL("blocked.html"),
        },
      },
      condition: {
        urlFilter: `*://${website}/*`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });
  });

  return rules;
}
