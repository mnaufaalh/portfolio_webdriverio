require('dotenv').config();
import { faker } from '@faker-js/faker';
import { expect as chaiExpect } from 'chai';
import got from 'got';

class GeneralFlow {
  async productName(product) {
    const response = await got({
      url: `${process.env.URL_AWS}search`,
      method: 'GET',
      searchParams: {
        category: product,
        sort_by: 'most_popular',
        _scope: 'selling'
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };

  async sizeProduct(accessToken, product) {
    const response = await got({
      url: `${process.env.URL_LUMEN}sizes/variants/${product.id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };

  async submitSellConsignment(accessToken, product, size) {
    const body = {
      product_variant_id: product.id,
      size_id: size.id,
      asking_price: faker.number.int({ min: 1, max: 20000 }) * 50000,
      quantity: 1,
      box_condition: 'SEMPURNA',
      sneakers_condition: 'BARU'
    }
    const response = await got({
      url: `${process.env.URL_LUMEN}users/consignments`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };

  async productsDetails(accessToken, id) {
    const response = await got({
      url: `${process.env.URL_LUMEN}products/${id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };

  async findLowestPrice(accessToken, product_variant_id, size_id) {
    const body = {
      product_variant_id: product_variant_id,
      size_id: size_id,
      sneakers_condition: 'BARU',
      box_condition: 'SEMPURNA',
      hypequarter_display: true,
      asking_price: 0
    };
    const response = await got({
      url: `${process.env.URL_LUMEN}products/prices`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data.min_price
    };
  };

  async shippingInformation(accessToken) {
    const response = await got({
      url: `${process.env.URL_AWS}users/shipping`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };

  async idProvince(accessToken, country) {
    const response = await got({
      url: `${process.env.URL_AWS}postalcode/province`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      searchParams: {
        country: country
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };

  async shippingAndHandlingPrice(accessToken, id, destination, country, price) {
    const body = {
      product_variant_id: id,
      destination: destination,
      country: country,
      product_price: price,
      product_addon: 'FLAT_RATE'
    };
    const response = await got({
      url: `${process.env.URL_AWS}couriers`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      json: body
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    };
  };

  async selectBrand(accessToken, category_id, nameBrand) {
    const response = await got({
      url: `${process.env.URL_LUMEN}admins/brands?`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      searchParams: {
        category_id: category_id
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    // const body = JSON.parse(response.body).data.find(el => el.name === nameBrand)
    return {
      body: JSON.parse(response.body).data
    }
  }

  async browseSize(accessToken, brand_id, category_id, sex) {
    let size_id = [];
    for (const id of brand_id) {
      const response = await got({
        url: `${process.env.URL_LUMEN}admins/brand_sizes?`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        searchParams: {
          no_limit: true,
          brand_id: id.id,
          category_id: category_id,
          sex: sex
        }
      });
      chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
      if (JSON.parse(response.body).data.length !== 0) {
        JSON.parse(response.body).data.forEach(el => {
          size_id.push({ id: el.size_id, size_order: 0, size_type: el.alias });
        })
        break;
      };
    };
    return size_id;
  }

  async postSizeAvailable(accessToken, id, sizeAvailable) {
    const response = await got({
      url: `${process.env.URL_LUMEN}/admins/productvariants/sizes/${id}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      json: { size_id: sizeAvailable }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      body: JSON.parse(response.body).data
    }
  }
};

export default new GeneralFlow();


