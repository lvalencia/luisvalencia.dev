import { beforeEach, describe, it, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ProfileImage from "@/components/ProfileImage.vue";

describe("ProfileImage", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(ProfileImage, {
    });
  });
  describe("props", () => {
    it("defaults to 'profile' prefix", () => {
        expect(wrapper.props().imagePrefix).toBe("profile")
    });
    it("defaults to 10 images", () => {
        expect(wrapper.props().numberOfImages).toBe(10)
    });
    it("defaults to jpeg extension", () => {
        expect(wrapper.props().fileExtention).toBe("jpeg")
    });
  });
});
