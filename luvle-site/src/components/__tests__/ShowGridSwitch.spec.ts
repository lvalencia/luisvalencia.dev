import { beforeEach, describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ShowGridSwitch from "@/components/ShowGridSwitch.vue";

describe("ShowGridSwitch", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(ShowGridSwitch, {
      global: {
        stubs: ["FontAwesomeIcon"],
        plugins: [
          createTestingPinia({
            fakeApp: true,
            createSpy: vi.fn(),
          }),
        ],
      },
    });
  });

  it("has a checkbox", () => {
    const checkbox = wrapper.find("input[type='checkbox']");
    expect(checkbox.exists()).toBe(true);
  });

  it("has an icon", () => {
    const icon = wrapper.findComponent(FontAwesomeIcon);
    expect(icon.exists()).toBe(true);
  });

  it("toggles visbility when I click the checkbox", () => {
    const toggleVisbilitySpy = vi.fn();
    (wrapper.vm as any).toggleVisbility = toggleVisbilitySpy;

    const checkbox = wrapper.find("input[type='checkbox']");
    checkbox.trigger("click");

    expect(toggleVisbilitySpy).toHaveBeenCalledOnce();
  });
});
