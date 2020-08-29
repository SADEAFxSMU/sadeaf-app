import { shallowMount, createLocalVue } from "@vue/test-utils";
import GenerateInvoiceTable from "../components/tables/GenerateInvoiceTable";
import Element from 'element-ui';

const localVue = createLocalVue();
localVue.use(Element);

const fakeEvent1 = {
  id: 1,
  name: "event 1",
  updated_at: "2020-08-26T10:24:56.874697",
  client: {
    account: {
      name: "test person"
    }
  }
}
const fakeEvent2 = {
  id: 2,
  name: "event 2",
  updated_at: "2020-08-26T10:24:56.874697",
  client: {
    account: {
      name: "test person 2"
    }
  }
}
const processedFakeEvent1 = {
  "client": {
    "account": {
      "name": "test person"
    }
  },
  "id": 1,
  "name": "event 1",
  "updated_at": "8/26/2020, 10:24:56 AM"
}
const processedFakeEvent2 = {
  "client": {
    "account": {
      "name": "test person 2"
    }
  },
  "id": 2,
  "name": "event 2",
  "updated_at": "8/26/2020, 10:24:56 AM"
}

const fakeData = [fakeEvent1, fakeEvent2]
let wrapper;

beforeEach(() => {
  wrapper = shallowMount(GenerateInvoiceTable, {localVue});
  wrapper.setData({event: fakeData})
})

describe('Table Formatting', () => {
  it('should process and format the rows correctly', () => {
    expect(wrapper.vm.processedEventRows).toStrictEqual([processedFakeEvent1, processedFakeEvent2])
  });
})

describe('Search by Event', () => {
  it('should filter the right rows based on search variable', () => {
    wrapper.setData({search: "2"})
    expect(wrapper.vm.filteredRows).toStrictEqual([processedFakeEvent2])
  });
})


describe('Table Pagination', () => {
  it('should have the right number of total rows', () => {
    expect(wrapper.vm.totalRows).toBe(2);
  });

  it('should show the right rows based on page size', () => {
    wrapper.setData({pageSize: 1})
    wrapper.setData({currentPage: 1})
    expect(wrapper.vm.pagedRows).toStrictEqual([processedFakeEvent1])
  });
})
