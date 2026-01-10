import { isMobileDevice } from "./mobile";

export const makeFullScreen = isMobileDevice() ? fullScreenOnMobile : fullScreenOnDesktop;

function fullScreenOnDesktop(target: Element) {
  target.requestFullscreen();
}
//document.getElementsByClassName('games')[0]

function fullScreenOnMobile(target: Element) {
  const appContainer = document.getElementById('app')!;
  const header = document.getElementsByTagName('header')[0]!;
  [
    appContainer,
    header,
    target,
  ].forEach((element) => {
    element.classList.add('fullscreen');
  });
}

export const exitFullScreen = isMobileDevice() ? exitFullScreenOnMobile : exitFullScreenOnDesktop;

function exitFullScreenOnDesktop() {
  document.exitFullscreen();
}

function exitFullScreenOnMobile(target: Element) {
  const appContainer = document.getElementById('app')!;
  const header = document.getElementsByTagName('header')[0]!;
  [
    appContainer,
    header,
    target,
  ].forEach((element) => {
    element.classList.remove('fullscreen');
  });
}