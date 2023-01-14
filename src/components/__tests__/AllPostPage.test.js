import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Button from "../global/Button.vue";

describe("Test button in AllPostPage.vue component", () => {
  it("should emit buttonClicked event when button is clicked", async () => {
    const wrapper = mount(Button, {
      props: {
        title: "Read more",
      },
    });
    wrapper.vm.$emit("buttonClicked");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().buttonClicked).toBeTruthy();
  });
});
