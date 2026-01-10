export function isMobileDevice() {
  return userAgentIsMobile() 
    || screenResolutionIsMobile()
    || respondsToTouchEvents()
    || cssMediaQueryIsMobile();
}

function userAgentIsMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const MOBILE_RESOLUTION_CUTOFF = 768;

function screenResolutionIsMobile(): boolean {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  return (screenWidth <= MOBILE_RESOLUTION_CUTOFF || screenHeight <= MOBILE_RESOLUTION_CUTOFF);
}

function respondsToTouchEvents(): boolean {
  return ('ontouchstart' in window) 
    || (navigator.maxTouchPoints > 0) 
    || (navigator.hasOwnProperty('msMaxTouchPoints') && (navigator as any).msMaxTouchPoints > 0);
}

function cssMediaQueryIsMobile(): boolean {
  const bodyElement = document.body;
  return window.getComputedStyle(bodyElement).getPropertyValue('content').indexOf('mobile') !== -1;
}