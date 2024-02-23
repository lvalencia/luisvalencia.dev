import { ToggleableIcon, ToggleableState } from "./toggleableIcon";

export function isPauseIcon(icon: any): icon is PauseIcon {
  return icon instanceof PauseIcon;
}

export class PauseIcon extends ToggleableIcon {
  constructor() {
    const size = 0.40;
    super({
      activeImage: 'play.png',
      inactiveImage: 'pause.png',
      dimensions: {
        height: size,
        width: size
      },
      initialState: ToggleableState.INACTIVE
    });
    
    this.mesh.position.x = -2.22;
    this.mesh.position.y = 2;
    this.mesh.position.z = 0.74;

    this.mesh.userData = {
      object: this
    };
  }

  public hide(): void {
    this.material.opacity = 0;
  }

  public show(): void {
    this.material.opacity = 1;
  }
}