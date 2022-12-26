import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import PaperStyler from "../../stylers/PaperStyler.vue";

describe("PaperStyler", () => {
  it("appends styled overlay", () => {
    const wrapper = mount(PaperStyler);
    expect(wrapper.find("div.paper-overlay").exists()).toBe(true);
  });
  it("renders child elements that it wraps", () => {
    const expectedContent = "Expected Content";
    const wrapper = mount(PaperStyler, {
      slots: {
        default: expectedContent,
      },
    });

    expect(wrapper.html()).toContain(expectedContent);
  });
});
