<script lang="ts">
import { range } from "@/helpers/array";
import { Time } from "@/helpers/time";
import { ref } from "vue";

interface MakeImageIteratorArgs {
  size: number;
  prefix: string;
  extension: string;
}

let imagesDirectoryRelativePath = "assets/images";

function makeImages({ prefix, size, extension }: MakeImageIteratorArgs) {
  return range({
    startAt: 1,
    size,
  }).map((index) => {
    return new URL(
      `../${imagesDirectoryRelativePath}/${prefix}_${index}.${extension}`,
      import.meta.url
    ).href;
  });
}

let interval: number = -1;
let period = new Time({
  seconds: 2,
}).inMilliseconds();
let _visibleIndex = ref(0);

export default {
  props: {
    imagePrefix: {
      type: String,
      default: "profile",
    },
    numberOfImages: {
      type: Number,
      default: 10,
    },
    fileExtention: {
      type: String,
      default: "jpeg",
    },
  },
  beforeMount() {
    interval = window.setInterval(() => {
      _visibleIndex.value = (_visibleIndex.value + 1) % this.numberOfImages;
    }, period);
  },
  beforeUnmount() {
    clearInterval(interval);
  },
  data() {
    return {
      images: makeImages({
        prefix: this.imagePrefix,
        size: this.numberOfImages,
        extension: this.fileExtention,
      }),
    };
  },
  computed: {
    visibleIndex(): number {
      return _visibleIndex.value;
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <img
      v-for="(image, index) of images"
      :key="`iamge-${image}`"
      :src="image"
      :class="{ visible: index === visibleIndex }"
    />
  </div>
</template>

<style scoped lang="scss">
$height: 350px;
$width: 350px;

.wrapper {
  position: relative;
  border-radius: 100%;
  overflow: hidden;
  display: inline-block;
  min-height: $height;
  min-width: $width;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;

  &.visible {
    visibility: visible;
  }
}
</style>
