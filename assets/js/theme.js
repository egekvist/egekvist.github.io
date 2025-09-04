// Has to be in the head tag, otherwise a flicker effect will occur.

// Toggle between light and dark theme
let toggleThemeSetting = () => {
  let themeSetting = determineThemeSetting();
  setThemeSetting(themeSetting === "light" ? "dark" : "light");
};

// Change the theme setting and apply the theme
let setThemeSetting = (themeSetting) => {
  localStorage.setItem("theme", themeSetting);
  document.documentElement.setAttribute("data-theme-setting", themeSetting);
  applyTheme();
};

// Apply the theme to the website
let applyTheme = () => {
  let theme = determineThemeSetting();

  transTheme();
  setHighlight(theme);
  setGiscusTheme(theme);
  setSearchTheme(theme);

  if (typeof mermaid !== "undefined") setMermaidTheme(theme);
  if (typeof Diff2HtmlUI !== "undefined") setDiff2htmlTheme(theme);
  if (typeof echarts !== "undefined") setEchartsTheme(theme);
  if (typeof Plotly !== "undefined") setPlotlyTheme(theme);
  if (typeof vegaEmbed !== "undefined") setVegaLiteTheme(theme);

  document.documentElement.setAttribute("data-theme", theme);

  // Update tables
  document.querySelectorAll("table").forEach((table) => {
    table.classList.toggle("table-dark", theme === "dark");
  });

  // Update Jupyter notebooks
  document.querySelectorAll(".jupyter-notebook-iframe-container").forEach((notebook) => {
    const bodyElement = notebook.getElementsByTagName("iframe")[0].contentWindow.document.body;
    bodyElement.setAttribute("data-jp-theme-light", theme === "light");
    bodyElement.setAttribute("data-jp-theme-name", theme === "light" ? "JupyterLab Light" : "JupyterLab Dark");
  });

  // Update medium-zoom overlay
  if (typeof medium_zoom !== "undefined") {
    medium_zoom.update({
      background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee",
    });
  }
};

let setHighlight = (theme) => {
  document.getElementById("highlight_theme_light").media = theme === "light" ? "" : "none";
  document.getElementById("highlight_theme_dark").media = theme === "dark" ? "" : "none";
};

let setGiscusTheme = (theme) => {
  const iframe = document.querySelector("iframe.giscus-frame");
  if (!iframe) return;
  iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: theme } } }, "https://giscus.app");
};

let setSearchTheme = (theme) => {
  const ninjaKeys = document.querySelector("ninja-keys");
  if (!ninjaKeys) return;
  ninjaKeys.classList.toggle("dark", theme === "dark");
};

let transTheme = () => {
  document.documentElement.classList.add("transition");
  setTimeout(() => document.documentElement.classList.remove("transition"), 500);
};

// Determine the current theme setting: "light" or "dark"
let determineThemeSetting = () => {
  let theme = localStorage.getItem("theme");
  if (theme !== "light" && theme !== "dark") theme = "light"; // default to light
  return theme;
};

// Initialize theme on page load
let initTheme = () => {
  setThemeSetting(determineThemeSetting());

  document.addEventListener("DOMContentLoaded", () => {
    const mode_toggle = document.getElementById("light-toggle");
    mode_toggle.addEventListener("click", toggleThemeSetting);
  });
};

initTheme();
