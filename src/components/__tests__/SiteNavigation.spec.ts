import { beforeEach, describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SiteNavigation from "@/components/SiteNavigation.vue";
import { createI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

describe("SiteNavigation", () => {
  const locale = "en";

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mock("@/router", () => {
      return {
        default: {
          getRoutes() {
            return [
              {
                path: "/1",
                name: "route1",
                meta: {
                  appearsOnTopNavigation: true,
                  i18nKey: "route1",
                },
              },
              {
                path: "/2",
                name: "route2",
                meta: {
                  appearsOnTopNavigation: false,
                },
              },
              {
                path: "/3",
                name: "route3",
                meta: {
                  appearsOnTopNavigation: true,
                  i18nKey: "route3",
                },
              },
              {
                path: "/4",
                name: "route4",
                meta: {},
              },
              {
                path: "/5",
                name: "route5",
              },
              {
                path: "/6",
                name: "route6",
                meta: {
                  appearsOnOtherNavigation: true,
                  i18nKey: "route6",
                },
              },
            ];
          },
        },
      };
    });
  });

  it("displays route links for routes marked to appear on site navigation", () => {
    const wrapper = mount(SiteNavigation, {
      global: {
        stubs: {
          "router-link": { template: "<div/>" },
          "router-view": { template: "<div/>" },
        },
        plugins: [
          createI18n({
            legacy: false,
            allowComposition: true,
            locale,
            fallbackLocale: locale,
            messages: {
              en: {
                route1: "first route",
                route3: "third route",
              },
            },
          }),
        ],
      },
    });

    const routeLinks = wrapper.findAllComponents(RouterLink);
    expect(routeLinks.length).toBeGreaterThan(0);

    const rawRoutes = routeLinks.map((routeLink) => routeLink.attributes().to);
    expect(rawRoutes).toEqual(["/1", "/3"]);
  });

  it("filters route links for display based on route filter key", () => {
    const wrapper = mount(SiteNavigation, {
      props: {
        routeFilterKey: "appearsOnOtherNavigation",
      },
      global: {
        stubs: {
          "router-link": { template: "<div/>" },
          "router-view": { template: "<div/>" },
        },
        plugins: [
          createI18n({
            legacy: false,
            allowComposition: true,
            locale,
            fallbackLocale: locale,
            messages: {
              en: {
                route1: "first route",
                route3: "third route",
              },
            },
          }),
        ],
      },
    });

    const routeLinks = wrapper.findAllComponents(RouterLink);
    expect(routeLinks.length).toBeGreaterThan(0);

    const rawRoutes = routeLinks.map((routeLink) => routeLink.attributes().to);
    expect(rawRoutes).toEqual(["/6"]);
  });
});
