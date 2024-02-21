require('dotenv').config();
import got from 'got';
import Datetime from 'helpers/Datetime';
import { qualityCheckUser } from 'fixtures/accounts/qualityCheckUser';
import { expect as chaiExpect } from 'chai';
import { faker } from '@faker-js/faker';

class ConsignmentFlow {
  async consignmentList(token, status, page = 1) {
    const response = await got({
      url: `${process.env.URL_LUMEN}users/consignments/${status}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      searchParams: {
        page: page,
        sort_by: 'createdAt_desc'
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    }
  }
  async approveConsignment(token, idItem) {
    const response = await got({
      url: `${process.env.URL_LUMEN}admins/sells/${idItem.id}/status`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: {
        status: 'consignment_approved'
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    }
  }
  async findCourier(token) {
    const response = await got({
      url: `${process.env.URL_LUMEN}couriers`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);

    let data = ['Other', 'Self Drop-Off'];
    let code = ['Other', ''];
    JSON.parse(response.body).data.forEach(el => {
      data.push(el.display_name);
      code.push(el.code);
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      courier: data,
      code: code
    }
  }
  async deliverPackage(token, idConsignmentProduct, courier) {
    const body = {
      seller_courier: courier,
      seller_awb_number: faker.number.int()
    };
    courier === '' ? (body.drop_off_schedule = `${Datetime.tomorrowDropOffDate()} 09.00 - 11.59 (WIB)`, body.seller_awb_number = '', body.seller_courier = 'self - drop - off') : courier === 'Other' ? body.seller_courier = faker.lorem.word() : '';
    const response = await got({
      url: `${process.env.URL_LUMEN}users/consignments/${idConsignmentProduct}/awb-number`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };
  async receivedFromSeller(token, id) {
    const body = {
      notes: '',
      received_at: `${Datetime.getCurrentTimestamp()}`,
      received_by: `${qualityCheckUser.emailAddress}`,
      seller_awb_number: '',
      seller_courier: '',
      seller_courier_option: '',
      seller_sent: `${Datetime.getCurrentTimestamp()}`,
      status: 'KA_RECEIVED',
    };
    const response = await got({
      url: `${process.env.URL_LUMEN}admins/sell-consignments/${id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      status_code: JSON.parse(response.body).status_code
    }
  }
  async qualityCheck(token, id) {
    const body = {
      ka_verified: true,
      status: 'VERIFICATION_PASSED'
    };
    const response = await got({
      url: `${process.env.URL_LUMEN}admins/sell-consignments/${id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      status_code: JSON.parse(response.body).status_code
    }
  }
  async legitCheck(token, id) {
    const body = {
      ka_verified: true,
      status: 'VERIFICATION_PASSED'
    };
    const response = await got({
      url: `${process.env.URL_LUMEN}admins/sell-consignments/${id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      status_code: JSON.parse(response.body).status_code
    }
  }
  async rackList(token) {
    const response = await got({
      url: `${process.env.URL_LUMEN}admins/sell_racks`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      searchParams: {
        no_limit: true,
        availables: true
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    }
  }
  async setRack(token, rack, item) {
    const selectedRack = faker.helpers.arrayElement(rack);
    const body = {
      rack_id: selectedRack.id,
      sell_id: item.user_sell_id
    };
    const response = await got({
      url: `${process.env.URL_LUMEN}admins/sell-consignments/${item.id}/racks`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    }
  }
}

export default new ConsignmentFlow();

