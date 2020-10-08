import { createLocalVue, mount } from '@vue/test-utils';
import BaseNavbar from '../../components/navbar/BaseNavbar';
import Element from 'element-ui';
import _ from 'lodash';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Element);
localVue.use(Vuex);

let wrapper;

describe('Client Nav Links', () => {
  const state = {
    auth: {
      user: {
        role: 'client',
      },
    },
  };

  beforeEach(() => {
    const store = new Vuex.Store({
      state,
    });
    wrapper = mount(BaseNavbar, { store, localVue });
  });

  it('should display common nav links', async () => {
    const commonNavLinks = [
      '/account#profile',
      '/account#settings',
      '/client/account/blacklist',
      '/account/notifications',
      '/notifications',
    ];
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

describe('Common Nav Links', () => {
  const state = {
    auth: {
      user: {
        role: 'user',
      },
    },
  };

  beforeEach(() => {
    const store = new Vuex.Store({
      state,
    });
    wrapper = mount(BaseNavbar, { store, localVue });
  });

  it('should display common nav links', async () => {
    const commonNavLinks = ['/account#profile', '/account#settings', '/account/notifications', '/notifications'];
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

describe('Admin Nav Links', () => {
  const state = {
    auth: {
      user: {
        role: 'admin',
      },
    },
  };

  beforeEach(() => {
    const store = new Vuex.Store({
      state,
    });
    wrapper = mount(BaseNavbar, { store, localVue });
  });

  it('should display common nav links', async () => {
    const commonNavLinks = [
      '/account#profile',
      '/account#settings',
      '/account/notifications',
      '/admin/account/blacklist',
      '/notifications',
    ];
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
