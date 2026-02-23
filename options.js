document.addEventListener("DOMContentLoaded", loadRules);

async function loadRules() {
  const result = await browser.storage.sync.get("sites");
  const sites = result.sites || {};
  console.log("Loaded sites:", sites);
  
  const list = document.getElementById("rulesList");
  list.innerHTML = "";
  Object.entries(sites).forEach(([pattern, sizes]) => {
    const div = document.createElement("div");
    div.className = "site-entry";
    div.innerHTML = `
      <div class="rule-left">
        <strong>${pattern}</strong>
        <div class="details">Width: <span class="value">${sizes.width}</span> | Height: <span class="value">${sizes.height}</span></div>
      </div>
      <div class="button-group">
        <button class="edit-btn" data-pattern="${pattern}" data-width="${sizes.width}" data-height="${sizes.height}">Edit</button>
        <button class="delete-btn" data-pattern="${pattern}">Delete</button>
      </div>
    `;

    
    // Edit button
    const editBtn = div.querySelector(".edit-btn");
    editBtn.addEventListener("click", function() {
      document.getElementById("urlPattern").value = this.dataset.pattern;
      document.getElementById("width").value = this.dataset.width;
      document.getElementById("height").value = this.dataset.height;
      console.log("Edit loaded:", this.dataset);
    });
    
    // Delete button  
    const deleteBtn = div.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteRule(pattern));
    
    list.appendChild(div);
  });
}

document.getElementById("addRule").onclick = async () => {
  console.log("Button clicked!");
  const pattern = document.getElementById("urlPattern").value.trim();
  const width = document.getElementById("width").value.trim();
  const height = document.getElementById("height").value.trim();
  
  if (!pattern || !width || !height) {
    alert("Fill all fields");
    return;
  }
  
  try {
    const result = await browser.storage.sync.get("sites");
    const sites = result.sites || {};
    sites[pattern] = { width, height };
    await browser.storage.sync.set({ sites });
    console.log("Saved:", sites);
    loadRules();
    
    // Clear form after save
    document.getElementById("urlPattern").value = "";
    document.getElementById("width").value = "";
    document.getElementById("height").value = "";
    
  } catch (e) {
    console.error("Save error:", e);
  }
};

window.deleteRule = async (pattern) => {
  const result = await browser.storage.sync.get("sites");
  const sites = result.sites || {};
  delete sites[pattern];
  await browser.storage.sync.set({ sites });
  loadRules();
};

// Fill current URL button
document.getElementById("fillCurrentUrl").onclick = async () => {
  try {
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});
    document.getElementById("urlPattern").value = tab.url;
    console.log("Filled URL:", tab.url);
  } catch (e) {
    console.error("Get URL failed:", e);
  }
};
