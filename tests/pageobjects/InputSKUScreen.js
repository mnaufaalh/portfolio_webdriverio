import { faker } from '@faker-js/faker';
import GeneralFlow from 'flows/GeneralFlow';

class InputSKUScreen {
  get coloumnSearch() {
    return $('[text="Search name or SKU of the product"]');
  }

  async itemSelected(item) {
    await $(`[content-desc="${item.display_name}\n${item.sku}"]`).waitForExist();
    return $(`[content-desc="${item.display_name}\n${item.sku}"]`).click();
  }

  async findSKU(product) {
    let body;
    let randomItem;
    await GeneralFlow.productName(product).then(res => {
      body = res.body;
    });
    const responseParse = body.data;
    const lengthData = responseParse.length;
    // product === 'lifestyles' ? randomItem = faker.number.int({ min: 2, max: lengthData - 1 }) : randomItem = faker.number.int(lengthData - 1);
    randomItem = faker.number.int(lengthData - 1);
    const sku = responseParse[randomItem].SKU;
    const display_name = responseParse[randomItem].display_name;
    const id = responseParse[randomItem].id;
    const sex = responseParse[randomItem].sex;
    const brand_name = responseParse[randomItem].brands[0];
    await this.coloumnSearch.waitForExist();
    await this.coloumnSearch.click();
    await this.coloumnSearch.setValue(display_name);
    await driver.pause(3000);
    await driver.keys(['Enter']);
    return {
      display_name: display_name,
      sku: sku,
      id: id,
      sex: sex,
      brand_name: brand_name
    };
  }
}

export default new InputSKUScreen();