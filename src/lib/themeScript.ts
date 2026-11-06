/** Inline <head> script: applies the stored theme before first paint. (Plain module — no "use client".) */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='dark'}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark'}})();`;
