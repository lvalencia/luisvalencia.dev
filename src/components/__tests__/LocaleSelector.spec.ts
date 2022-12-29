import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LocaleSelector from "@/components/LocaleSelector.vue";
import { createI18n } from "vue-i18n";

describe("LocaleSelector", () => {
  it("changes the locale attribute to the selected locale", () => {
    const testI18n = createI18n({
      legacy: false,
      allowComposition: true,
      locale: "en",
      fallbackLocale: "en",
      messages: {
        en: {},
        es: {},
      },
    });

    const wrapper = mount(LocaleSelector, {
      global: {
        plugins: [testI18n],
      },
    });

    expect((wrapper.vm as any).locale).toBe("en");

    const selector = wrapper.find("select");
    const value = selector.findAll("option").at(1)?.element.value;
    selector.setValue(value);
    selector.element.dispatchEvent(new Event("change"));

    expect((wrapper.vm as any).locale).toBe(value);
  });
});
