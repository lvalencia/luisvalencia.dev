import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AboutSnippet from "@/components/home/AboutSnippet.vue";

describe("AboutSnippet", () => {
  const titleTag = "h3";
  const title = "title";
  const titleId = "titleId";
  const contentTag = "p";
  const content = "content";
  const contentId = "contentId";

  it("renders a title", () => {
    const wrapper = mount(AboutSnippet, {
      props: {
        title,
      },
    });
    const heading = wrapper.find(titleTag).element;
    expect(heading.innerHTML).toEqual(title);
  });

  it("renders a title with an id", () => {
    const wrapper = mount(AboutSnippet, {
      props: {
        title,
        titleId,
      },
    });
    const heading = wrapper.find(titleTag);
    expect(heading.attributes().id).toEqual(titleId);
  });

  it("does not render a title", () => {
    let wrapper = mount(AboutSnippet, {
      props: {
        title: undefined,
        titleId,
      },
    });
    let heading = wrapper.find(titleTag);
    expect(heading.exists()).toBe(false);

    wrapper = mount(AboutSnippet, {
      props: {},
    });
    heading = wrapper.find(titleTag);
    expect(heading.exists()).toBe(false);
  });

  it("renders content", () => {
    const wrapper = mount(AboutSnippet, {
      props: {
        content,
      },
    });
    const heading = wrapper.find(contentTag).element;
    expect(heading.innerHTML).toEqual(content);
  });

  it("renders content with an id", () => {
    const wrapper = mount(AboutSnippet, {
      props: {
        content,
        contentId,
      },
    });
    const heading = wrapper.find(contentTag);
    expect(heading.attributes().id).toEqual(contentId);
  });

  it("does not render content", () => {
    let wrapper = mount(AboutSnippet, {
      props: {
        content: undefined,
        contentId,
      },
    });
    let heading = wrapper.find(contentTag);
    expect(heading.exists()).toBe(false);

    wrapper = mount(AboutSnippet, {
      props: {},
    });
    heading = wrapper.find(contentTag);
    expect(heading.exists()).toBe(false);
  });

  it("renders title, content, and wrapepd content in the correct order", () => {
    const slotContent = "slotContent";
    const slotHTML = `<div>${slotContent}</div>`;
    const wrapper = mount(AboutSnippet, {
      props: {
        title,
        content,
      },
      slots: {
        default: slotHTML,
      },
    });

    const elements = wrapper.findAll("*").map((domWrapper) => {
      return domWrapper.element;
    });

    expect(elements[0].innerHTML).toEqual(title);
    expect(elements[1].innerHTML).toEqual(content);
    expect(elements[2].innerHTML).toEqual(slotContent);
  });
});
