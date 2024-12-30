chrome.runtime.onInstalled.addListener(() => {
    // Remove existing menu items to avoid duplicates
    chrome.contextMenus.removeAll(() => {
      // Create the new menu item
      chrome.contextMenus.create({
        id: "saveWord",
        title: "Save Word",
        contexts: ["selection"]
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        }
      });
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveWord") {
      handleSaveWord(info.selectionText);
    }
  });
  
  // Function to handle saving the word
  async function handleSaveWord(selectedText) {
    try {
      const { isEnabled = true } = await chrome.storage.local.get("isEnabled");
      if (!isEnabled) return;
  
      const word = selectedText.trim();
      if (word) {
        const { savedWords = [] } = await chrome.storage.local.get("savedWords");
        if (!savedWords.includes(word)) {
          savedWords.push(word);
          await chrome.storage.local.set({ savedWords });
        }
      }
    } catch (error) {
      console.error('Error saving word:', error);
    }
  }
  
  // Optional: Listen for extension enable/disable to update context menu
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isEnabled) {
      const isEnabled = changes.isEnabled.newValue;
      chrome.contextMenus.update('saveWord', {
        enabled: isEnabled
      });
    }
  });