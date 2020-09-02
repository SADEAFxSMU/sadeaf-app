import { shallowMount, createLocalVue } from "@vue/test-utils";
import GenerateInvoiceTable from "../components/tables/GenerateInvoiceTable";
import Element from 'element-ui';

const localVue = createLocalVue();
localVue.use(Element);

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(GenerateInvoiceTable, {localVue});
})

describe('Table Formatting', () => {
  it('should process and format the rows correctly', async () => {
    let fakeEvent1 = {
      id: 1,
      name: "event 1",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person"
        }
      }
    }
    let fakeEvent2 = {
      id: 2,
      name: "event 2",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person 2"
        }
      }
    }
    let fakeEvent32 = {
      id: 2,
      name: "event 32",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person 2"
        }
      }
    }

    let fakeData = [fakeEvent1, fakeEvent2, fakeEvent32];
    await wrapper.setData({
      event: fakeData
    })

    let processedFakeEvent1 = {
      "client": {
        "account": {
          "name": "test person"
        }
      },
      "id": 1,
      "name": "event 1",
      "updated_at": "8/26/2020, 10:24:56 AM"
    }
    let processedFakeEvent2 = {
      "client": {
        "account": {
          "name": "test person 2"
        }
      },
      "id": 2,
      "name": "event 2",
      "updated_at": "8/26/2020, 10:24:56 AM"
    }
    let processedFakeEvent32 = {
      "client": {
        "account": {
          "name": "test person 2"
        }
      },
      "id": 2,
      "name": "event 32",
      "updated_at": "8/26/2020, 10:24:56 AM"
    }

    let processedFakeData = [processedFakeEvent1, processedFakeEvent2, processedFakeEvent32];

    expect(wrapper.vm.processedEventRows).toStrictEqual(processedFakeData)
  });
})

describe('Search by Event', () => {
  it('should filter and page the right rows based on search variable', async () => {
    let fakeEvent1 = {
      id: 1,
      name: "event 1",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person"
        }
      }
    }
    let fakeEvent2 = {
      id: 2,
      name: "event 2",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person 2"
        }
      }
    }
    let fakeEvent32 = {
      id: 2,
      name: "event 32",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person 2"
        }
      }
    }
    let processedFakeEvent2 = {
      "client": {
        "account": {
          "name": "test person 2"
        }
      },
      "id": 2,
      "name": "event 2",
      "updated_at": "8/26/2020, 10:24:56 AM"
    }
    let processedFakeEvent32 = {
      "client": {
        "account": {
          "name": "test person 2"
        }
      },
      "id": 2,
      "name": "event 32",
      "updated_at": "8/26/2020, 10:24:56 AM"
    }

    let fakeData = [fakeEvent1, fakeEvent2, fakeEvent32];
    await wrapper.setData({
      search: "2",
      currentPage: 1,
      pageSize: 3,
      event: fakeData
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
  it('should have the right number of total rows', async () => {
    let fakeEvent1 = {
      id: 1,
      name: "event 1",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person"
        }
      }
    }
    let fakeEvent2 = {
      id: 2,
      name: "event 2",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person 2"
        }
      }
    }
    let fakeEvent32 = {
      id: 2,
      name: "event 32",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person 2"
        }
      }
    }

    let fakeData = [fakeEvent1, fakeEvent2, fakeEvent32];
    await wrapper.setData({
      event: fakeData
    });

    expect(wrapper.vm.totalRows).toBe(fakeData.length);
  });

  it('should show the right rows based on page size', async () => {
    let fakeEvent1 = {
      id: 1,
      name: "event 1",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person"
        }
      }
    }
    let fakeEvent2 = {
      id: 2,
      name: "event 2",
      updated_at: "2020-08-26T10:24:56.874697",
      client: {
        account: {
          name: "test person 2"
        }
      }
    }
    let fakeData = [fakeEvent1, fakeEvent2]

    let processedFakeEvent1 = {
      "client": {
        "account": {
          "name": "test person"
        }
      },
      "id": 1,
      "name": "event 1",
      "updated_at": "8/26/2020, 10:24:56 AM"
    }

    await wrapper.setData({
      pageSize: 1,
      currentPage: 1,
      event: fakeData
    })
    expect(wrapper.vm.pagedRows).toStrictEqual([processedFakeEvent1])
  });
})
