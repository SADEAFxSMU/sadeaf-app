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

const fakeEvent32 = {
  id: 2,
  name: "event 32",
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
const processedFakeEvent32 = {
  "client": {
    "account": {
      "name": "test person 2"
    }
  },
  "id": 2,
  "name": "event 32",
  "updated_at": "8/26/2020, 10:24:56 AM"
}

const fakeData = [fakeEvent1, fakeEvent2, fakeEvent32]
const processedFakeData = [processedFakeEvent1, processedFakeEvent2, processedFakeEvent32]
let wrapper;

beforeEach(() => {
  wrapper = shallowMount(GenerateInvoiceTable, {localVue});
  wrapper.setData({event: fakeData})
})

describe('Table Formatting', () => {
  it('should process and format the rows correctly', () => {
    expect(wrapper.vm.processedEventRows).toStrictEqual(processedFakeData)
  });
})

describe('Search by Event', () => {
  it('should filter and page the right rows based on search variable', async () => {
    await wrapper.setData({
      search: "2",
      currentPage: 1,
      pageSize: 3
    })
    expect(wrapper.vm.pagedRows).toStrictEqual([processedFakeEvent2, processedFakeEvent32])

    await wrapper.setData({
      search: "2",
      currentPage: 1,
      pageSize: 1
    })
    expect(wrapper.vm.pagedRows).toStrictEqual([processedFakeEvent2])
  });
})


describe('Table Pagination', () => {
  it('should have the right number of total rows', () => {
    expect(wrapper.vm.totalRows).toBe(fakeData.length);
  });

  it('should show the right rows based on page size', async () => {
    await wrapper.setData({
      pageSize: 1,
      currentPage: 1
    })
    expect(wrapper.vm.pagedRows).toStrictEqual([processedFakeEvent1])
  });
})
