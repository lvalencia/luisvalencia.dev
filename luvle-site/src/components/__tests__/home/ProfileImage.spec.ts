import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProfileImage from "@/components/home/ProfileImage.vue";

const delay = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};

describe("ProfileImage", () => {
  const serverPrefix = "file://";
  it("constructs the image urls", () => {
    const wrapper = mount(ProfileImage, {});
    expect(wrapper.vm.images[0]).equals(
      `${serverPrefix}/assets/images/profile_1.jpeg`
    );
  });
  it("constructs the image urls with specified properites", () => {
    const wrapper = mount(ProfileImage, {
      props: {
        imagePrefix: "hello",
        fileExtention: "png",
        numberOfImages: 1,
      },
    });
    expect(wrapper.vm.images[0]).equals(
      `${serverPrefix}/assets/images/hello_1.png`
    );
  });
  it("constructs the specified number of images", () => {
    const numberOfImages = 1;
    const wrapper = mount(ProfileImage, {
      props: {
        numberOfImages,
      },
    });
    expect(wrapper.vm.images.length).equals(numberOfImages);
  });
  it("has a visible image", () => {
    const wrapper = mount(ProfileImage, {});
    const visibleImage = wrapper.find("img.visible");
    expect(visibleImage.exists()).toBe(true);
  });
  it("rotates the visbile image", async () => {
    const delayInMillis = 10;
    const wrapper = mount(ProfileImage, {
      props: {
        period: delayInMillis,
      },
    });
    const initialVisibleImage = wrapper.find("img.visible");
    await delay(delayInMillis + 1);
    const nextVisibleImage = wrapper.find("img.visible");
    expect(initialVisibleImage.attributes().src).not.equals(
      nextVisibleImage.attributes().src
    );
  });
});
