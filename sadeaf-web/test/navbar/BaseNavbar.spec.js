import { createLocalVue, mount } from "@vue/test-utils";
import BaseNavbar from "../../components/navbar/BaseNavbar";
import Element from "element-ui";
import _ from "lodash";

const localVue = createLocalVue();
localVue.use(Element);

let wrapper;

beforeEach(() => {
  wrapper = mount(BaseNavbar, { localVue });
});

describe("Common Nav Links", () => {
  it("should display common nav links", async () => {
    const commonNavLinks = ["/account#profile", "/account#settings", "/account/notifications", "/notifications"];

    const renderedNavLinks = [];
    const navMenu = wrapper.findComponent(Element.Menu);
    _.forOwn(navMenu.vm.$data.items, (navMenuItem, index) => {
      if (navMenuItem.$props.index) {
        expect(navMenuItem.$props.index).toEqual(index);
        expect(commonNavLinks).toContain(index);
        renderedNavLinks.push(index);
      }
    });
    expect(renderedNavLinks.sort()).toEqual(commonNavLinks.sort());
  });
});
