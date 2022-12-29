<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useGrid } from "../stores/useGrid";

export default {
  methods: {
    ...mapActions(useGrid, ["toggleVisbility"]),
  },
  computed: {
    ...mapState(useGrid, ["gridState", "isVisible"]),
    icon() {
      const icon = this.isVisible ? "fa-pen-ruler" : "fa-pen";
      return `fa-solid ${icon}`;
    },
  },
};
</script>

<template>
  <div class="container" :class="{ visible: isVisible }">
    <input
      type="checkbox"
      @click="toggleVisbility"
      :checked="isVisible"
      data-testid="show-grid"
    />
    <label>
      <font-awesome-icon :icon="icon" data-testid="show-grid-icon" />
    </label>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/color.scss";

$input-height: 1.5em;
$input-width: calc($input-height * 2);

$slider-height: $input-height;
$slider-width: calc($input-width / 2);

$slider-position-change-timing: 0.32s;
$background-color-change-timing: calc($slider-position-change-timing + 0.08s);
$icon-change-timing: calc($slider-position-change-timing);
$background-timing-function: linear;
$slider-timing-function: ease-in-out;

.container {
  display: flex;
  align-items: center;

  & > * {
    &:first-child {
      margin-right: 8px;
    }
  }
}

input[type="checkbox"] {
  // Reset Appearance
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  outline: none;

  // Styling
  width: $input-width;
  height: $input-height;
  background-color: $primary;
  border-radius: 1em;
  box-shadow: 0px 2px 5px 1px hsla(0, 0%, 0%, 0.5);

  // Location
  position: relative;

  // Behavior
  transition: background-color $background-color-change-timing;
  transition-timing-function: $background-timing-function;

  &:before {
    // Styling
    content: " ";
    width: $slider-width;
    height: $slider-height;
    background-color: $on-primary;
    border-radius: 100%;

    // Location
    position: absolute;
    top: 0;
    left: 0;

    // Animation Behavior
    transition: all $slider-position-change-timing;
    transition-timing-function: $slider-timing-function;
  }

  &:checked {
    background-color: $primary-variant;

    &:before {
      transform: translate(100%);
    }
  }
}

svg {
  transition: all $icon-change-timing;
  transition-timing-function: $slider-timing-function;
  transform: scaleX(-1);

  &[data-icon="pen-ruler"] {
    transform: scaleX(1);
  }
}
</style>
