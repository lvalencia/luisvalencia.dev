import { degreesToRadians } from "@/helpers/degrees";
import { Edge } from "./edges";
import { SubmitButton } from "./submitButton";

interface CreateSubmitButtonArgs {
  onPressed?: () => void;
  initialColor?: number;
}

export function createSubmitButton(args: CreateSubmitButtonArgs = {}): SubmitButton {
  const {
    onPressed,
    initialColor
  } = args;

  const submitButton = new SubmitButton({
    onClick: onPressed,
    initialColor
  });

  setPosition(submitButton);
  stylize(submitButton);

  return submitButton;
}

function setPosition(submitButton: SubmitButton): void {
  submitButton.cube.position = {
    x: 3.25, 
    y: 0, 
    z: 1.25
  };
  submitButton.cube.initialSetPosition = submitButton.cube.position;
  submitButton.rotation.y = degreesToRadians(45);
  submitButton.rotation.x = degreesToRadians(20);
  submitButton.rotation.z = degreesToRadians(0);
}

function stylize(submitButton: SubmitButton): void {
  const edges = new Edge({
    geometry: submitButton.cube.getGeometry(),
  });
  submitButton.cube.addEdges(edges);
}