import { faker } from "@faker-js/faker";
import GeneralFlow from "flows/GeneralFlow";
import Gestures from "helpers/Gestures";

class MarketScreen {
  get searchBar() {
    return $('[text = "Search sneakers, apparel, luxury, or toys"]');
  }

  get slideSize() {
    return Gestures.swipe(({ x: 550, y: 500 }), ({ x: 850, y: 500 }));
  }

  get sellButtonProductDetails() {
    return $('[content-desc="Sell"]');
  }

  get continueYourPaymentButton() {
    return $('[content-desc="Continue Your Payment"]');
  }

  async bankLogo(bank) {
    await $(`//android.view.View[@content-desc="banklogo${bank}"]`).waitForExist();
    return $(`//android.view.View[@content-desc="banklogo${bank}"]`).click();
  }

  get vaField() {
    return $('//android.view.View[@resource-id="vaField"]');
  }

  async selectedSize(product) {
    return await $(`[content-desc="US ${product.size}\nIDR  ${(product.price / 1000).toLocaleString()}K"]`).click();
  }

  async expressRequestProductDetail(price) {
    return await $(`[content-desc="Express\nBrand New / Perfect Box / Complete Accessories\nShips TODAY within business hours. Purchases after business hours will be processed on the next day\nIDR ${price}"]`).click();
  }

  async standardRequestProductDetail(price, box_condition) {
    return box_condition !== 'CACAT' ? await $(`[content-desc="Standard\nBrand New / Perfect Box / Complete Accessories\n3-10 Business Days ETA\nIDR ${price}"]`).click() : await $(`[content-desc="Standard 99%\nBrand New / Defect Box / Complete Accessories\n3-10 Business Days ETA\nIDR ${price}"]`).click();
  }

  async preOrderRequestProductDetail(price) {
    return await $(`[content-desc="Pre-Order\nBrand New / Perfect Box / Complete Accessories\n10-14 Business Days\nIDR ${price}"]`).click();
  }

  async typeOfBuy(product) {
    const price = product.price.toLocaleString();
    return product.request_type === 'CONSIGNMENT_REQUEST' ? await this.expressRequestProductDetail(price) : product.request_type === 'SELL_REQUEST' ? await this.standardRequestProductDetail(price, product.box_condition) : await this.preOrderRequestProductDetail(price);
  }

  get continueToBuyButton() {
    return driver.touchAction({ action: 'tap', x: 550, y: 2075 });
  }

  async paymentButton() {
    await Gestures.swipe(({ x: 500, y: 1800 }), ({ x: 500, y: 1000 }));
    return $('[content-desc="Payment\nSelect payment"]').click();
  }

  async virtualAccount(bank) {
    await driver.pause(2000);
    await Gestures.swipe(({ x: 500, y: 2000 }), ({ x: 500, y: 400 }));
    return bank !== 'Gopay' ? await $(`[content-desc="Virtual Account ${bank}"]`).click() : await $(`[content-desc="${bank}"]`).click();
  }

  async proceedCheckoutButton(token, price, id) {
    let country;
    let province;
    let idProvince;
    let priceShippingAndHandling;

    await GeneralFlow.shippingInformation(token).then(el => {
      const response = el.body[0];
      country = response.country;
      province = response.province;
    });
    await GeneralFlow.idProvince(token, country).then(el => {
      idProvince = el.body.find(({ name }) => name === province);
    });
    await GeneralFlow.shippingAndHandlingPrice(token, id, idProvince.id, country, price.price).then(el => priceShippingAndHandling = el.body);
    const totalShipping = (price.price + priceShippingAndHandling).toLocaleString();
    await $(`[content-desc="Proceed IDR ${totalShipping}"]`).click();
  }

  async choosedItem(item) {
    await this.searchBar.click();
    await driver.pause(2000);
    await this.searchBar.click();
    await this.searchBar.setValue(item.product_variant.display_name);
    await driver.keys("\uE007");
    return await this.selectItem(item);
  }

  async slideIntoLeft() {
    return driver.touchAction([{ action: 'longPress', x: 950, y: 2075 }, { action: 'moveTo', x: 100, y: 2075 }, 'release']);
  }


  async checkSmallestSize(product) {
    const size = product[product.length - 1].size;
    const price = (product[product.length - 1].price / 1000).toLocaleString();
    if (await $(`[content-desc="US ${size}\nIDR  ${price}K"]`).isDisplayed()) {
      await $(`[content-desc="US ${size}\nIDR  ${price}K"]`).click();
      if (await this.sellButtonProductDetails.isDisplayed()) {
        return await $(`[content-desc="US ${size}\nIDR  ${price}K"]`).click();
      }
    } else {
      await Gestures.swipe(({ x: 950, y: 2075 }), ({ x: 100, y: 2075 }));
      return await this.checkSmallestSize(product);
    }
  }

  async selectItem(item) {
    return await $(`[content-desc="${item.product_variant.product.brand.name}\n${item.product_variant.display_name}"]`).click();
  }

  async selectSize(item, token, id) {
    let productPreOrder = [];
    let productAvailable = [];
    await GeneralFlow.productsDetails(token, id).then(res => {
      res.body.availables.forEach(el => {
        productAvailable.length === 0 ? productAvailable.push({ size: el.size.US, price: parseInt(el.asking_price), box_condition: el.box_condition, request_type: el.request_type }) : productAvailable[productAvailable.length - 1].size !== el.size.US ?
          productAvailable.push({ size: el.size.US, price: parseInt(el.asking_price), box_condition: el.box_condition, request_type: el.request_type }) : productAvailable[productAvailable.length - 1].price > parseInt(el.asking_price) ? (productAvailable.pop(), productAvailable.push({ size: el.size.US, price: parseInt(el.asking_price), box_condition: el.box_condition, request_type: el.request_type })) : '';
      });
      res.body.pre_orders.forEach(el => {
        productPreOrder.length === 0 ? productPreOrder.push({ size: el.size.US, price: parseInt(el.asking_price), box_condition: el.box_condition, request_type: 'PRE_ORDER_REQUEST' }) : productPreOrder[productPreOrder.length - 1].size !== el.size.US ?
          productPreOrder.push({ size: el.size.US, price: parseInt(el.asking_price), box_condition: el.box_condition, request_type: 'PRE_ORDER_REQUEST' }) : productPreOrder[productPreOrder.length - 1].price > parseInt(el.asking_price) ? (productPreOrder.pop(), productPreOrder.push({ size: el.size.US, price: parseInt(el.asking_price), box_condition: el.box_condition, request_type: 'PRE_ORDER_REQUEST' })) : '';
      });
      productPreOrder.forEach(el => {
        const foundSize = productAvailable.find(e => e.size === el.size);
        foundSize ? el.price < foundSize.price ? (foundSize.price = el.price, foundSize.box_condition = el.box_condition, foundSize.request_type = el.request_type) : '' : productAvailable.push(el);
      });
    });
    const finalSize = productAvailable.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
    const indexSize = finalSize.map(el => el.size).indexOf(item.size.US);
    await this.checkSmallestSize(finalSize);
    for (let i = 0; i < finalSize.length - 1 - indexSize; i++) {
      await driver.pause(500)
      await this.slideSize;
    };
    await this.selectedSize(finalSize[indexSize]);
    await this.typeOfBuy(finalSize[indexSize]);
    await this.continueToBuyButton;
    return finalSize[indexSize];
  };

  async paymentMethod(token, item, id) {
    await this.paymentButton();
    const bankLists = ['BCA', 'Mandiri', 'Permata', 'BNI', 'BRI', 'Gopay'];
    const bank = faker.helpers.arrayElement(bankLists);
    await this.virtualAccount(bank);
    await this.proceedCheckoutButton(token, item, id);
    return this.continueYourPaymentButton.click();
  };
};

export default new MarketScreen();