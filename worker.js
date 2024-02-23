var process_list = [];

chrome.action.setPopup({ popup: "popup.html" });

chrome.processes.onUpdatedWithMemory.addListener((processes) => {
  process_list = processes;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    const tabs = await chrome.tabs.query({ discarded: false });
    const process_ids = await Promise.all(tabs.map(async (tab) =>
      await chrome.processes.getProcessIdForTab(tab.id)));
    return tabs.map((t, i) => ({ tab: t, pid: process_ids[i],
      cpu: (process_list[process_ids[i]] ?? { cpu: 0 }).cpu,
      js: (process_list[process_ids[i]] ?? { jsMemoryUsed: 0 }).jsMemoryUsed,
      mem: (process_list[process_ids[i]] ?? { privateMemory: 0 }).privateMemory,
      net: (process_list[process_ids[i]] ?? { network: 0 }).network
    }));
  })().then((combined) => {
    console.log(combined);
    sendResponse(combined);
  });
  return true;
});
