(async function() {
  console.log("Auto Video Resizer");
  
  const result = await browser.storage.sync.get("sites");
  const sites = result.sites || {};
  const currentUrl = window.location.href;
  
  // Find matching rule
  let match = null;
  for (const [pattern, config] of Object.entries(sites)) {
    if (new RegExp("^" + pattern.replace(/\*/g, ".*")).test(currentUrl)) {
      match = config;
      console.log("Rule match:", pattern);
      break;
    }
  }
  
  if (!match) return;
  
  autoResizeVideos(match);
  
  function autoResizeVideos(config) {
    // UNIVERSAL DETECTORS (no selectors needed)
    const videoTargets = [
      // Native <video> elements
      ...document.querySelectorAll("video"),
      
      // Common iframes (YouTube, Vimeo, Kaltura, Twitch, etc)
      ...document.querySelectorAll("iframe[src*='youtube'], iframe[src*='vimeo'], iframe[src*='kaltura'], iframe[src*='twitch'], iframe[src*='player.vimeo']"),
      
      // Heuristic: Large iframes (likely video)
      ...Array.from(document.querySelectorAll("iframe")).filter(iframe => 
        iframe.offsetWidth > 300 && iframe.offsetHeight > 150
      ),
      
      // Known player containers
      ...document.querySelectorAll(".kaltura-player-container, #movie_player, .video-player, .player-container")
    ];
    
    console.log(`🎬 Found ${videoTargets.length} video targets`);
    
    videoTargets.forEach((target, i) => {
      // Resize target
      target.style.setProperty("width", config.width, "important");
      target.style.setProperty("height", config.height, "important");
      target.style.setProperty("max-width", "100vw", "important");
      target.style.setProperty("position", "relative", "important");
      
      // Resize immediate parent (container killer)
      const parent = target.parentElement;
      if (parent) {
        parent.style.setProperty("width", config.width, "important");
        parent.style.setProperty("height", config.height, "important");
        parent.style.setProperty("max-width", "100vw", "important");
        parent.style.setProperty("overflow", "visible", "important");
      }
      
      console.log(`Resized #${i}:`, target.tagName, target.src?.substring(0, 50));
    });
  }
  
  // Watch for dynamic players
  const observer = new MutationObserver(autoResizeVideos.bind(null, match));
  observer.observe(document.body, {childList: true, subtree: true});
  
  // Resize on window resize
  window.addEventListener("resize", () => autoResizeVideos(match));
})();
