import { createLocalVue, mount } from "@vue/test-utils";
import Element from "element-ui";
import NotificationPreferencesForm from "../components/forms/NotificationPreferencesForm";

const localVue = createLocalVue();
localVue.use(Element);
let wrapper;
const $apollo = { loading: false };
const ELEMENTUI_INPUT_ERROR_CLASS = ".el-form-item__error";
const ELEMENTUI_CHECKBOX_COMPONENT_NAME = "el-checkbox";
const ELEMENTUI_BUTTON_COMPONENT_NAME = "el-button";

beforeEach(() => {
  wrapper = mount(NotificationPreferencesForm, {
    localVue,
    propsData: {
      formWidth: "500",
    },
    mocks: {
      $apollo,
    },
    data() {
      return {
        // declare these to prevent reactivity warnings
        form: {
          telegramPreferred: false,
          emailPreferred: false,
        },
      };
    },
  });
});

describe("Telegram user-handle input field", () => {
  it("should not validate if empty", async () => {
    await wrapper.setData({
      form: {
        telegramPreferred: true,
        emailPreferred: false,
        telegramHandle: "",
      },
      accountType: "client",
    });

    await wrapper.findComponent({ name: ELEMENTUI_BUTTON_COMPONENT_NAME }).trigger("click");
    const expectedErrorMessage = "Please input a telegram handle";
    expect(wrapper.find(ELEMENTUI_INPUT_ERROR_CLASS).text()).toBe(expectedErrorMessage);
  });

  it("should not validate if user-handle starts with @", async () => {
    await wrapper.setData({
      form: {
        telegramPreferred: true,
        emailPreferred: false,
        telegramHandle: "@someUserHandle",
      },
      accountType: "client",
    });

    await wrapper.findComponent({ name: ELEMENTUI_BUTTON_COMPONENT_NAME }).trigger("click");
    const expectedErrorMessage = "You do not need to add the @ at the start of your handle";
    expect(wrapper.find(ELEMENTUI_INPUT_ERROR_CLASS).text()).toBe(expectedErrorMessage);
  });
});

describe("Client Form", () => {
  it("should not show any alert preferences if email and telegram are not checked", async () => {
    await wrapper.setData({
      form: {
        telegramPreferred: false,
        emailPreferred: false,
      },
      accountType: "client",
    });
    let allCheckboxes = wrapper.findAllComponents({ name: ELEMENTUI_CHECKBOX_COMPONENT_NAME });
    expectOnlyEmailAndTelegramCheckboxes(allCheckboxes);
  });

  it("should show all preference checkboxes when either email or telegram is checked", async () => {
    await wrapper.setData({
      form: {
        telegramPreferred: false,
        emailPreferred: true,
      },
      accountType: "client",
    });

    let allCheckboxes = wrapper.findAllComponents({ name: ELEMENTUI_CHECKBOX_COMPONENT_NAME });
    expectAllClientPreferencesToBePresent(allCheckboxes);

    await wrapper.setData({
      form: {
        telegramPreferred: true,
        emailPreferred: false,
      },
      accountType: "client",
    });

    allCheckboxes = wrapper.findAllComponents({ name: ELEMENTUI_CHECKBOX_COMPONENT_NAME });
    expectAllClientPreferencesToBePresent(allCheckboxes);
  });

  it("should only show 2 client-specific alert preferences", async () => {
    // Use the preference explanation to test instead of the checkbox label
    // because client and volunteer share a similar checkbox label
    const clientPreferenceExplanations = [
      "You will be notified when a volunteer has been matched to you",
      "You will be notified if volunteers have still not been matched to you a few hours before your event",
    ];
    await wrapper.setData({
      form: {
        emailPreferred: true,
      },
      accountType: "client",
    });

    // skip the first explanation for Email checkbox
    const preferenceExplanationWrappers = wrapper.findAll(".form-element-explanation").wrappers.slice(1);
    expect(preferenceExplanationWrappers).toHaveLength(2);

    for (let i = 0; i < clientPreferenceExplanations.length; i++) {
      expect(preferenceExplanationWrappers[i].text()).toBe(clientPreferenceExplanations[i]);
    }
  });
});

describe("Volunteer Form", () => {
  it("should not show any alert preferences if email and telegram are not checked", async () => {
    await wrapper.setData({
      form: {
        telegramPreferred: false,
        emailPreferred: false,
      },
      accountType: "volunteer",
    });
    let allCheckboxes = wrapper.findAllComponents({ name: ELEMENTUI_CHECKBOX_COMPONENT_NAME });
    expectOnlyEmailAndTelegramCheckboxes(allCheckboxes);
  });

  it("should show all preference checkboxes when either email or telegram is checked", async () => {
    await wrapper.setData({
      form: {
        telegramPreferred: false,
        emailPreferred: true,
      },
      accountType: "volunteer",
    });

    let allCheckboxes = wrapper.findAllComponents({ name: ELEMENTUI_CHECKBOX_COMPONENT_NAME });
    expectAllVolunteerPreferencesToBePresent(allCheckboxes);

    await wrapper.setData({
      form: {
        telegramPreferred: true,
        emailPreferred: false,
      },
      accountType: "volunteer",
    });

    allCheckboxes = wrapper.findAllComponents({ name: ELEMENTUI_CHECKBOX_COMPONENT_NAME });
    expectAllVolunteerPreferencesToBePresent(allCheckboxes);
  });

  it("should only show 4 volunteer-specific alert preferences", async () => {
    const volunteerPreferencesExplanation = [
      "You will only be notified of assignments that urgently needs a volunteer. This includes assignments in the next few hours, or 1 to 2 days",
      "You will receive notifications of all new assignments",
      "You will receive periodic updates for assignments that have not been matched to a volunteer",
      "You will receive a notification when an assignment you have selected is matched to you",
    ];
    await wrapper.setData({
      form: {
        emailPreferred: true,
      },
      accountType: "volunteer",
    });

    // skip the first explanation for Email checkbox
    const preferenceExplanationWrappers = wrapper.findAll(".form-element-explanation").wrappers.slice(1);
    expect(preferenceExplanationWrappers).toHaveLength(4);

    for (let i = 0; i < volunteerPreferencesExplanation.length; i++) {
      expect(preferenceExplanationWrappers[i].text()).toBe(volunteerPreferencesExplanation[i]);
    }
  });
});

// test helpers
function expectAllClientPreferencesToBePresent(checkboxElements) {
  expect(checkboxElements).toHaveLength(4);
  expect(checkboxElements.at(0).text()).toBe("Email");
  expect(checkboxElements.at(1).text()).toBe("Telegram");
  expect(checkboxElements.at(2).text()).toBe("Matched Assignments");
  expect(checkboxElements.at(3).text()).toBe("Unmatched Assignments");
}

function expectAllVolunteerPreferencesToBePresent(checkboxElements) {
  expect(checkboxElements).toHaveLength(6);
  expect(checkboxElements.at(0).text()).toBe("Email");
  expect(checkboxElements.at(1).text()).toBe("Telegram");
  expect(checkboxElements.at(2).text()).toBe("Urgent Assignments");
  expect(checkboxElements.at(3).text()).toBe("New Assignments");
  expect(checkboxElements.at(4).text()).toBe("Periodic Assignment Updates");
  expect(checkboxElements.at(5).text()).toBe("Matched Assignments");
}

function expectOnlyEmailAndTelegramCheckboxes(checkboxElements) {
  expect(checkboxElements).toHaveLength(2);
  expect(checkboxElements.at(0).text()).toBe("Email");
  expect(checkboxElements.at(1).text()).toBe("Telegram");
}
