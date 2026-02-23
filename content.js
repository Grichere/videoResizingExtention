(async function() {
  
  const result = await browser.storage.sync.get("sites");
  const sites = result.sites || {};
  const currentUrl = window.location.href;
  
  console.log("URL:", currentUrl);
  console.log("Rules:", sites);
  
  // Keats kalvidres pattern
  if (!currentUrl.includes("keats.kcl.ac.uk/mod/kalvidres")) return;
  
  const sizes = sites["https://keats.kcl.ac.uk/*"] || {width: "90vw", height: "51vw"};
  
  resizeKeatsKaltura(sizes);
  watchKeatsKaltura(sizes);
  
  function resizeKeatsKaltura(sizes) {
    const iframe = document.querySelector("#contentframe");
    const container = document.querySelector(".kaltura-player-container");
    
    if (!iframe || !container) {
      console.log("Waiting for elements...");
      return;
    }
    
    // CONTAINER FIRST
    container.style.setProperty("width", sizes.width, "important");
    container.style.setProperty("height", sizes.height, "important");
    container.style.setProperty("max-width", "100vw", "important");
    container.style.setProperty("min-height", sizes.height, "important");
    container.style.removeProperty("max-width");
    
    // IFRAME 100% of container
    iframe.style.setProperty("width", "100%", "important");
    iframe.style.setProperty("height", "100%", "important");
    iframe.width = "100%";
    iframe.height = "100%";
    
    console.log("RESIZED:", sizes, "Container:", container, "Iframe:", iframe);
  }
  
  function watchKeatsKaltura(sizes) {
    const observer = new MutationObserver(resizeKeatsKaltura.bind(null, sizes));
    observer.observe(document.body, {childList: true, subtree: true});
  }
})();
