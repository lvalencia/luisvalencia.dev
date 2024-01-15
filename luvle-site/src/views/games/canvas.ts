import { fromMaybe, fromNullableOrThrow, isNonNull, type Maybe } from "@luvle/utils";
import { PCFSoftShadowMap, WebGLRenderer } from "three";

interface InitializeCanvasArgs {
  id: string;
  preventStyleChanges?: Maybe<boolean>;
}

interface InitializedCanvas {
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext;
  renderer: WebGLRenderer;
}

export function initializeCanvas({id, preventStyleChanges}: InitializeCanvasArgs): InitializedCanvas {
  const canvas = fromNullableOrThrow({
    nullable: document.getElementById(id),
    error: `Canvas element ${id} not found`,
  }) as HTMLCanvasElement;

  const context = fromNullableOrThrow({
    nullable: canvas.getContext('webgl2'),
    error: "WebGL2 context could not be created"
  }) as WebGL2RenderingContext;

  const renderer = new WebGLRenderer({
    context: context,
    canvas: canvas
  });

  configureRenderer({
    canvas,
    renderer,
    options: {
      preventStyleChanges
    }
  });

  return {
    canvas, 
    context,
    renderer
  };
}

interface ConfigureRendererArgs {
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  options: {
    preventStyleChanges: Maybe<boolean>
  };
}

function configureRenderer({canvas, renderer, options}: ConfigureRendererArgs): void {
  if (!isNonNull(canvas)) {
    throw `Canvas is uninitialized`;
  };
  if (!isNonNull(renderer)) {
    throw `Render is uninitialized`;
  }
  
  const {
    preventStyleChanges 
  } = options;

  const {
    clientWidth,
    clientHeight
  } = canvas;

  const shouldUpdateStyle = !(
    fromMaybe({
      maybe: preventStyleChanges,
      fallback: true
    })
  );

  renderer.setSize(
    clientWidth,
    clientHeight,
    shouldUpdateStyle,
  );

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  renderer.setPixelRatio(window.devicePixelRatio);
}
