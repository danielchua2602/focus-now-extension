import { ExtensionMessage } from '../types';
import { storage } from '../lib/storage';
import { isScheduleActive, isScheduleCompleted } from '../lib/scheduleUtils';

const ALARMS = {
  checkSchedule: 'checkSchedule',
  cleanupSchedules: 'cleanupSchedules',
} as const;

// ============================================================================
// Initialization - Runs immediately when service worker activates
// ============================================================================
ensureAlarms();
updateBlockingRules();

// ============================================================================
// Event Listeners
// ============================================================================
// when extension installs / updates
chrome.runtime.onInstalled.addListener(() => {
  ensureAlarms();
  updateBlockingRules();
});

// on browser startup
chrome.runtime.onStartup.addListener(() => {
  ensureAlarms();
  updateBlockingRules();
});

// popup adding / editing
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, _sendResponse) => {
    if (message.action === 'updateRules') {
      updateBlockingRules();
    }
  }
);

// Handle all alarms in one listener
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARMS.checkSchedule) {
    updateBlockingRules();
  } else if (alarm.name === ALARMS.cleanupSchedules) {
    const result = await storage.get(['schedules']);
    const schedules = result.schedules || [];
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone

    // Remove past schedules
    const activeSchedules = schedules.filter((s) => s.endDate >= today);

    await storage.set({ schedules: activeSchedules });
  }
});

// ============================================================================
// Core Functions
// ============================================================================

async function ensureAlarms() {
  const checkAlarm = await chrome.alarms.get(ALARMS.checkSchedule);
  if (!checkAlarm) {
    chrome.alarms.create(ALARMS.checkSchedule, { periodInMinutes: 1 });
  }
  const cleanupAlarm = await chrome.alarms.get(ALARMS.cleanupSchedules);
  if (!cleanupAlarm) {
    chrome.alarms.create(ALARMS.cleanupSchedules, { periodInMinutes: 60 * 24 });
  }
}

/**
 * This function checks all schedules, removes completed ones,
 * and updates blocking rules based on active schedules.
 **/
async function updateBlockingRules(): Promise<void> {
  const result = await storage.get(['schedules']);
  const schedules = result.schedules || [];

  const activeSchedules = schedules.filter(
    (schedule) => !isScheduleCompleted(schedule)
  );

  // Remove completed schedules
  if (activeSchedules.length < schedules.length) {
    const completedCount = schedules.length - activeSchedules.length;
    console.log(`[FocusNow] Removing ${completedCount} completed schedule(s)`);
    await storage.set({ schedules: activeSchedules });
  }

  const activeWebsites = activeSchedules
    .filter((schedule) => isScheduleActive(schedule))
    .map((schedule) => schedule.website);

  // Remove duplicates
  const uniqueActiveWebsites = Array.from(new Set(activeWebsites));

  // Update blocking rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map((rule) => rule.id);
  const newRules = createBlockingRules(uniqueActiveWebsites);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRuleIds,
    addRules: newRules,
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function createBlockingRules(
  websites: string[]
): chrome.declarativeNetRequest.Rule[] {
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
          url: chrome.runtime.getURL('src/blocked/blocked.html'),
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
          url: chrome.runtime.getURL('src/blocked/blocked.html'),
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
