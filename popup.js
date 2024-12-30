const wordList = document.getElementById("wordList");
const exportButton = document.getElementById("export");
const toggleSwitch = document.getElementById("toggleExtension");

// Load initial state and saved words
async function initialize() {
  const { isEnabled = true, savedWords = [] } = await chrome.storage.local.get([
    "isEnabled",
    "savedWords",
  ]);
  toggleSwitch.checked = isEnabled;
  savedWords.forEach((word) => addWordToUI(word));
}

// Toggle extension state
toggleSwitch.addEventListener("change", async () => {
  await chrome.storage.local.set({ isEnabled: toggleSwitch.checked });
});

function addWordToUI(word) {
  const li = document.createElement("li");
  const wordSpan = document.createElement("span");
  wordSpan.textContent = word;
  
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.innerHTML = "×";
  
  li.appendChild(wordSpan);
  li.appendChild(deleteButton);
  
  deleteButton.addEventListener("click", () => removeWord(word, li));
  wordList.appendChild(li);
}

async function removeWord(word, li) {
  try {
    const { savedWords = [] } = await chrome.storage.local.get("savedWords");
    const updatedWords = savedWords.filter((w) => w !== word);
    await chrome.storage.local.set({ savedWords: updatedWords });
    wordList.removeChild(li);
  } catch (error) {
    console.error("Error removing word:", error);
  }
}

exportButton.addEventListener("click", async () => {
  try {
    const { savedWords = [] } = await chrome.storage.local.get("savedWords");
    const blob = new Blob([savedWords.join("\n")], { 
      type: "text/plain;charset=utf-8" 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "saved_words.txt";
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting words:", error);
  }
});

initialize();
