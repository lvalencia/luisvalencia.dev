import { test, expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

declare const window: any;
const { describe } = test;

describe("Home Page", () => {
  describe("content", () => {
    test("contains name on the landing page", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("h1")).toHaveText("Luis Valencia");
    });
    test("internal links do not target a new page", async ({ page }) => {
      await page.goto("/");
      const internalLinks = await page.locator("a[href^='#']");
      const internalLinkTargets = await Promise.all(
        (
          await internalLinks.elementHandles()
        ).map(async (elementHandle) => {
          return await elementHandle.getAttribute("target");
        })
      );

      expect(
        internalLinkTargets.every((linkTarget) => linkTarget === null)
      ).toBe(true);
    });
  });

  describe("grid", () => {
    test("grid toggle shows grid lines", async ({ page }) => {
      const getCSSBorderValue = async (locator: Locator) => {
        return locator.evaluate((el) => {
          // You have to inline "border" ; lexical closures are
          // not respected in call to `locator.evaluate`
          return window.getComputedStyle(el).getPropertyValue("border");
        });
      };

      await page.goto("/");

      const gridSwitch = await page.getByTestId("show-grid");
      await gridSwitch.check();

      const gridContainerSelector = ".grid-container.show";
      await page.waitForSelector(gridContainerSelector);
      const containers = page.locator(gridContainerSelector);
      expect(await containers.count()).toBeGreaterThan(0);

      const gridItemSelector = ".grid-item.show";
      await page.waitForSelector(gridItemSelector);
      const items = page.locator(gridItemSelector);
      expect(await items.count()).toBeGreaterThan(0);

      const containerBoarder = await getCSSBorderValue(containers.first());

      expect(containerBoarder).toMatch(/^.*$/);

      const itemBorder = await getCSSBorderValue(items.first());
      expect(itemBorder).toMatch(/^.*$/);
    });

    test("grid toggle updates grid indicator icon", async ({ page }) => {
      await page.goto("/");

      const getDataIconAttribute = async () => {
        return await gridIndictorIcon.evaluate((element) => {
          // You have to inline "data-icon" ; lexical closures are
          // not respected in call to `locator.evaluate`
          return element.getAttribute("data-icon");
        });
      };

      const gridIndictorIcon = page.getByTestId("show-grid-icon");
      await expect(gridIndictorIcon).toHaveCount(1);

      const beforeAttribute = await getDataIconAttribute();
      expect(beforeAttribute).toBe("pen");

      const gridSwitch = page.getByTestId("show-grid");
      await gridSwitch.check();

      const afterAttribute = await getDataIconAttribute();
      expect(afterAttribute).toBe("pen-ruler");
    });
  });

  describe("localization", () => {
    test("default locale is en", async ({ page }) => {
      await page.goto("/");
      const localeSelector = page.getByTestId("locale-select");
      const locale = await localeSelector.inputValue();
      expect(locale).toBe("en");
    });

    test("toggling locale to es translates content to Spanish", async ({
      page,
    }) => {
      await page.goto("/");

      const spanishLocale = "es";

      const localeSelector = page.getByTestId("locale-select");
      await localeSelector.selectOption(spanishLocale);

      const locale = await localeSelector.inputValue();
      expect(locale).toBe(spanishLocale);

      const occupation = page.getByTestId("occupation");
      await expect(occupation).toHaveText("Ingeniero de Software");

      const location = page.getByTestId("location");
      await expect(location).toHaveText("Sur de California");
    });

    test("toggling locale to en translates content to English", async ({
      page,
    }) => {
      await page.goto("/");

      const spanishLocale = "es";
      const englishLocale = "en";

      const localeSelector = page.getByTestId("locale-select");
      await localeSelector.selectOption(spanishLocale);
      await localeSelector.selectOption(englishLocale);

      const occupation = page.getByTestId("occupation");
      await expect(occupation).toHaveText("Software Engineer");

      const location = page.getByTestId("location");
      await expect(location).toHaveText("Southern California");
    });

    test("toggling locale to ca translates content to Catalan", async ({
      page,
    }) => {
      await page.goto("/");

      const catalanLocale = "ca";

      const localeSelector = page.getByTestId("locale-select");
      await localeSelector.selectOption(catalanLocale);

      const locale = await localeSelector.inputValue();
      expect(locale).toBe(catalanLocale);

      const occupation = page.getByTestId("occupation");
      await expect(occupation).toHaveText("Enginyer de Software");

      const location = page.getByTestId("location");
      await expect(location).toHaveText("Sud de Califòrnia");
    });
  });
});
