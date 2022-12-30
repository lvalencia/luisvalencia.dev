import { beforeEach, describe, it, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import LocaleSelector from "@/components/LocaleSelector.vue";
import { createI18n } from "vue-i18n";

describe("LocaleSelector", () => {
  const locale = "ca";
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(LocaleSelector, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            allowComposition: true,
            locale,
            fallbackLocale: locale,
            messages: {
              en: {},
              es: {},
              ca: {},
            },
          }),
        ],
      },
    });
  });

  it("defaults sets the current locale as the selected locale", () => {
    const selector = wrapper.find("select").element;
    const options = selector.options;
    const selection = options[selector.selectedIndex].value;

    expect(selection).toBe(locale);
  });

  it("changes the locale attribute to the selected locale", () => {
    expect((wrapper.vm as any).locale).toBe(locale);

    const selector = wrapper.find("select");
    const value = selector.findAll("option").at(1)?.element.value;
    selector.setValue(value);
    selector.element.dispatchEvent(new Event("change"));

    expect((wrapper.vm as any).locale).toBe(value);
  });
});
