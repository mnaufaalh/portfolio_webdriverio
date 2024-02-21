import { faker } from "@faker-js/faker";
import GeneralFlow from "flows/GeneralFlow";
import Gestures from "helpers/Gestures";
import InputSKUScreen from "./InputSKUScreen";

class ConsignRequestScreen {
  get productName() {
    return Gestures.tap({ x: 500, y: 650 });
  }

  get swipeDownSize() {
    return Gestures.swipe(({ x: 555, y: 1998 }), ({ x: 555, y: 1050 }));
  }

  get swipeDownUntilBottom() {
    return Gestures.swipe(({ x: 525, y: 1850 }), ({ x: 525, y: 250 }));
  }

  get uploadPhotoButton() {
    return Gestures.tap({ x: 233, y: 764 });
  }

  get productCondition() {
    return $('//android.widget.ImageView[@text="Select Condition"]');
  }

  get productBoxCondition() {
    return $('//android.widget.ImageView[@text="Select Box Condition"]');
  }

  get uploadViaCamera() {
    return $('//android.widget.ImageView[@content-desc="Camera"]');
  }

  get shutterCamera() {
    return $('//android.widget.ImageView[@content-desc="Shutter"]');
  }

  get acceptPhoto() {
    return $('//android.widget.ImageButton[@content-desc="Done"]');
  }

  get productAdditionalNotes() {
    return $('//android.widget.EditText[@text="Tell us other details we should know"]');
  }

  get productPrice() {
    return $('//android.widget.EditText[@text="IDR\n0"]')
  }

  get continueButton() {
    return $('[content-desc="Continue"]');
  }

  get checkboxUserAgreement() {
    return Gestures.tap({ x: 973, y: 1914 });
  }

  get proceedButton() {
    return $('[content-desc="Proceed"]');
  }

  async productSize(product) {
    if (product === 'sneakers') {
      return $('[text="Select Size (US)"]').click();
    } else {
      return $('[text="Select Size "]').click();
    }
  }

  async selectSize(product, item, accessToken) {
    let body;
    let category_id;
    let brand_id;
    let sizeAvailableId;

    await GeneralFlow.sizeProduct(accessToken, item).then(res => {
      body = res.body;
    });
    if (body === undefined || body.length === 0) {
      await GeneralFlow.productsDetails(accessToken, item.id).then(res => {
        category_id = res.body.product.category_id;
      });
      await GeneralFlow.selectBrand(accessToken, category_id, item.brand_name).then(res => {
        brand_id = res.body;
      });
      await GeneralFlow.browseSize(accessToken, brand_id, category_id, item.sex).then(res => {
        sizeAvailableId = res;
      });
      await GeneralFlow.postSizeAvailable(accessToken, item.id, sizeAvailableId);
      await GeneralFlow.sizeProduct(accessToken, item).then(res => {
        body = res.body;
      });
    }
    await InputSKUScreen.itemSelected(item);
    await this.productSize(product);
    let sizes = [];
    body.forEach(el => {
      sizes.push({ US: el.US, id: el.id });
    });
    const size = faker.helpers.arrayElement(sizes);
    const indexSize = sizes.map(el => el.US).indexOf(size.US);
    const numberOfSwipes = Math.floor(indexSize / 7);
    for (let i = 0; i < numberOfSwipes; i++) {
      await driver.pause(1000);
      await this.swipeDownSize;
    }
    if (product === 'sneakers') {
      if (item.sex === 'F') {
        await $(`[content-desc="US ${size.US}W"]`).waitForExist();
        await $(`[content-desc="US ${size.US}W"]`).click();
      } else {
        await $(`[content-desc="US ${size.US}"]`).waitForExist();
        await $(`[content-desc="US ${size.US}"]`).click();
      }
    } else {
      await $(`[content-desc="${size.US}"]`).waitForExist();
      await $(`[content-desc="${size.US}"]`).click();
    }
    return size.id
  };

  async selectCondition(product) {
    let conditionList;
    await this.productCondition.waitForExist();
    await this.productCondition.click();
    product === 'handbags' ? conditionList = ['Brand New', 'Pristine', 'Good', 'Well Used', 'Like New', 'Vintage'] : conditionList = ['Brand New', 'Used'];
    const condition = faker.helpers.arrayElement(conditionList);
    await $(`[content-desc="${condition}"]`).click();
    return { condition: condition };
  }

  async selectBoxCondition() {
    await this.productBoxCondition.waitForExist();
    await this.productBoxCondition.click();
    const boxCondition = faker.helpers.arrayElement(['Perfect', 'Defect', 'Missing Box']);
    await $(`[content-desc="${boxCondition}"]`).click();
    return {
      boxCondition: boxCondition
    };
  }

  async uploadPhoto() {
    for (let i = 0; i < 5; i++) {
      await driver.pause(1000)
      await this.uploadPhotoButton;
      await this.uploadViaCamera.waitForExist();
      await this.uploadViaCamera.click();
      await this.shutterCamera.waitForExist();
      await this.shutterCamera.click();
      await this.acceptPhoto.waitForExist();
      await this.acceptPhoto.click();
    }
    return await driver.pause(1000);
  }

  async addValueAdditionalNotes() {
    await this.productAdditionalNotes.click();
    await this.productAdditionalNotes.setValue(faker.lorem.words());
    return await driver.hideKeyboard();
  }

  async addValuePrice(accessToken, itemId, sizeId) {
    let min_price;
    await this.productPrice.click();
    await GeneralFlow.findLowestPrice(accessToken, itemId, sizeId).then(res => {
      min_price = Math.floor(res.body / 50000);
    });
    let newPrice;
    min_price > 1 ? newPrice = faker.number.int({ max: min_price }) : newPrice = 1;
    await this.productPrice.setValue(newPrice * 50000);
    return await driver.hideKeyboard();
  }
}

export default new ConsignRequestScreen();