import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MaybeComponent from "../MaybeComponent.vue";

describe("MaybeComponent", () => {
  const slotContent = "slotContent";
  it("renders the wrapped content", () => {
    const truthyCollection = [1, "hello", [], {}, true];
    truthyCollection.forEach((truthyValue) => {
      const wrapper = mount(MaybeComponent, {
        props: {
          renderIf: truthyValue,
        },
        slots: {
          default: slotContent,
        },
      });
      expect(wrapper.html()).toContain(slotContent);
    });
  });
  it("does not render the wrapped content", () => {
    const falsyCollection = [0, "", false];
    falsyCollection.forEach((falsyValue) => {
      const wrapper = mount(MaybeComponent, {
        props: {
          renderIf: falsyValue,
        },
        slots: {
          default: slotContent,
        },
      });
      expect(wrapper.html()).not.toContain(slotContent);
    });
  });
  it("does not render unnecessary commments in the dom", () => {
    const wrapper = mount(MaybeComponent, {
      props: {
        renderIf: false,
      },
      slots: {
        default: slotContent,
      },
    });

    const comments = ["<!--v-if-->", "<!---->"];

    comments.forEach((comment) => {
      expect(wrapper.html()).not.toContain(comment);
    });
  });
});
