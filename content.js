document.addEventListener("dblclick", async (event) => {
    try {
      const { isEnabled = true } = await chrome.storage.local.get("isEnabled");
      if (!isEnabled) return;
  
      const selection = window.getSelection();
      const word = selection.toString().trim();
      
      if (word) {
        const { savedWords = [] } = await chrome.storage.local.get("savedWords");
        if (!savedWords.includes(word)) {
          savedWords.push(word);
          await chrome.storage.local.set({ savedWords });
        }
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  });
  