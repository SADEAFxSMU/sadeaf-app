import { createLocalVue, mount, config } from "@vue/test-utils";
import Layout from "../layouts/default";
import Element from 'element-ui';

config.stubs['nuxt'] = { template: "<div/>"};

const localVue = createLocalVue();
localVue.use(Element);

let wrapper;

beforeEach(() => {
  wrapper = mount(Layout, {localVue});
});

describe('User Role-Specific Navbar', () => {

  const {
    AdminNavbar,
    ClientNavbar,
    VolunteerNavbar,
    ServiceRequestorNavbar,
  } = Layout.components;

  it('should display correct navbar for "admin" user type', async () => {
    await wrapper.setData({ userType: 'admin' });
    expect(wrapper.findComponent(AdminNavbar).exists()).toBe(true);
  });

  it('should display correct navbar for "client" user type', async () => {
    await wrapper.setData({ userType: 'client' });
    expect(wrapper.findComponent(ClientNavbar).exists()).toBe(true);
  });

  it('should display correct navbar for "volunteer" user type', async () => {
    await wrapper.setData({ userType: 'volunteer' });
    expect(wrapper.findComponent(VolunteerNavbar).exists()).toBe(true);
  });

  it('should display correct navbar for "service_requestor" user type', async () => {
    await wrapper.setData({ userType: 'service_requestor' });
    expect(wrapper.findComponent(ServiceRequestorNavbar).exists()).toBe(true);
  });
});
