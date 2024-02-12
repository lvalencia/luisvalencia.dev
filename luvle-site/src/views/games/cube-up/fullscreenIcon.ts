import { ToggleableIcon, ToggleableState } from "./toggleableIcon";

export function isFullscreenIcon(icon: any): icon is FullscreenIcon  {
  return icon instanceof FullscreenIcon;
}

export class FullscreenIcon extends ToggleableIcon {
  constructor() {
    const size = 0.40;
    super({
      activeImage: 'close.png',
      inactiveImage: 'expand.png',
      dimensions: {
        height: size,
        width: size
      },
      initialState: ToggleableState.INACTIVE
    });
    
    this.mesh.position.x = -2.0;
    this.mesh.position.y = 2;
    this.mesh.position.z = 1.2;

    this.mesh.userData = {
      object: this
    };
  }
}