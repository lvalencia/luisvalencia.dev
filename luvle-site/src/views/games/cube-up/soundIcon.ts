import { ToggleableIcon } from "./toggleableIcon";

export function isSoundIcon(icon: any): icon is SoundIcon  {
  return icon instanceof SoundIcon;
}

export class SoundIcon extends ToggleableIcon {
  constructor() {
    const size = 0.38;
    super({
      activeImage: 'sound_on.png',
      inactiveImage: 'sound_off.png',
      dimensions: {
        height: size,
        width: size
      }
    });

    this.mesh.userData = {
      object: this
    };

    this.mesh.position.x = -1.8;
    this.mesh.position.y = 2;
    this.mesh.position.z = 1.64;
  }
}