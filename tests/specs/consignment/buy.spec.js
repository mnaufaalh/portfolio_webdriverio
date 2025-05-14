require('dotenv').config();
const { remote } = require('webdriverio');
import { faker } from "@faker-js/faker";
import { buyyerIndonesia } from "fixtures/accounts/buyyerIndonesia";
import { legitCheckUser } from "fixtures/accounts/legitCheckUser";
import { qualityCheckUser } from "fixtures/accounts/qualityCheckUser";
import { sellerIndonesia } from "fixtures/accounts/sellerIndonesia";
import ConsignmentFlow from "flows/ConsignmentFlow";
import GeneralFlow from "flows/GeneralFlow";
import LoginFlow from "flows/LoginFlow";
import MarketScreen from "pageobjects/MarketScreen";
import NavigationBar from "pageobjects/NavigationBar";
import ProfileScreen from "pageobjects/ProfileScreen";

describe('Buying Consignment Request', () => {
  let accessTokenSellerIndonesia;
  let accessTokenQualityCheckUser;
  let accessTokenLegitCheckUser;
  let accessTokenBuyyerIndonesia;
  const product = 'sneakers';
  // const product = faker.helpers.arrayElement(['sneakers', 'handbags', 'apparels', 'lifestyles']);
  let bodyProduct;
  let stockSizesSorted;
  let sizeChoosed;
  let minPrice;
  let bodyProductConsign;
  let approveId;
  let courierCode;
  let bodyApproveConsign;
  let consignId;
  let rackList;
  let selectedItem;

  beforeEach(async () => {


  });

  afterEach(async () => {
    await driver.closeApp();
  });

  it('Should able to buy consigment via Third Party', async () => {
    await driver.activateApp(process.env.PACKAGE_ANDROID);
    await LoginFlow.loginViaApi(sellerIndonesia.emailAddress, sellerIndonesia.password).then(res => {
      accessTokenSellerIndonesia = res.accessToken;
    });
    await LoginFlow.loginViaApi(qualityCheckUser.emailAddress, qualityCheckUser.password).then(res => {
      accessTokenQualityCheckUser = res.accessToken;
    });
    await LoginFlow.loginViaApi(legitCheckUser.emailAddress, legitCheckUser.password).then(res => {
      accessTokenLegitCheckUser = res.accessToken;
    });
    await LoginFlow.loginViaApi(buyyerIndonesia.emailAddress, buyyerIndonesia.password).then(res => {
      accessTokenBuyyerIndonesia = res.accessToken;
    });
    console.log(`........`)
    await GeneralFlow.productName(product).then(res => {
      // bodyProduct = faker.helpers.arrayElement(res.body.data);
      bodyProduct = res.body.data[3];
    });
    console.log(`........`)
    await GeneralFlow.productsDetails(accessTokenSellerIndonesia, bodyProduct.id).then(res => {
      let stockSizes = [];
      res.body.availables.forEach(el => {
        stockSizes.length === 0 ? stockSizes.push({ sizeId: el.size.id, minPrice: parseInt(el.asking_price) }) :
          stockSizes[stockSizes.length - 1].sizeId !== el.size.id ? stockSizes.push({ sizeId: el.size.id, minPrice: parseInt(el.asking_price) }) : stockSizes[stockSizes.length - 1].minPrice > el.asking_price ? (stockSizes.pop(), stockSizes.push({ sizeId: el.size.id, minPrice: parseInt(el.asking_price) })) : '';
      });
      res.body.useds.length === 0 ? '' : res.body.useds.forEach(el => {
        const temp = stockSizes.find(element => element.sizeId === el.size.id);
        let index;
        temp === undefined ? stockSizes.push({ sizeId: el.size.id, minPrice: parseInt(el.asking_price) }) : (index = stockSizes.findIndex(obj => obj.sizeId === temp.sizeId), temp.minPrice < parseInt(el.asking_price) ? '' : stockSizes[index].minPrice = parseInt(el.asking_price));
      });
      res.body.pre_orders.length === 0 ? '' : res.body.pre_orders.forEach(el => {
        const temp = stockSizes.find(element => element.sizeId === el.size.id);
        let index;
        temp === undefined ? stockSizes.push({ sizeId: el.size.id, minPrice: parseInt(el.asking_price) }) : (index = stockSizes.findIndex(obj => obj.sizeId === temp.sizeId), temp.minPrice < parseInt(el.asking_price) ? '' : stockSizes[index].minPrice = parseInt(el.asking_price));
      });
      stockSizesSorted = stockSizes.sort((a, b) => a.sizeId - b.sizeId);
      sizeChoosed = stockSizesSorted[faker.number.int({ max: stockSizesSorted.length })];
      minPrice = parseInt(sizeChoosed.minPrice) / 50000;
    });
    console.log(`........`)
    await GeneralFlow.submitSellConsignment(accessTokenSellerIndonesia, bodyProduct, sizeChoosed, minPrice).then(res => {
      bodyProductConsign = res.body;
      console.log(bodyProductConsign, `&&&&&&&&&&`)
    });
    console.log(`........`)
    await ConsignmentFlow.approveConsignment(accessTokenSellerIndonesia, bodyProductConsign).then(res => {
      approveId = res.body.id;
    });
    console.log(`........`)
    await ConsignmentFlow.findCourier(accessTokenSellerIndonesia).then(res => {
      courierCode = faker.helpers.arrayElement(res.code);
    });
    console.log(`........`)
    await ConsignmentFlow.consignmentList(accessTokenSellerIndonesia, 'pending').then(res => {
      bodyApproveConsign = res.body.data.find(obj => {
        return obj.id === approveId
      });
      consignId = bodyApproveConsign.sell_consignments.id;
    });
    console.log(consignId, courierCode)
    await ConsignmentFlow.deliverPackage(accessTokenSellerIndonesia, consignId, courierCode);
    console.log(`........`)

    await ConsignmentFlow.receivedFromSeller(accessTokenQualityCheckUser, consignId);
    console.log(`........`)

    await ConsignmentFlow.qualityCheck(accessTokenQualityCheckUser, consignId);
    console.log(`........`)

    await ConsignmentFlow.legitCheck(accessTokenLegitCheckUser, consignId);
    console.log(`........`)

    await ConsignmentFlow.rackList(accessTokenLegitCheckUser).then(res => {
      rackList = res.body;
    });
    console.log(`........`)

    await ConsignmentFlow.setRack(accessTokenLegitCheckUser, rackList, bodyApproveConsign.sell_consignments);
    console.log(`........`)

    await ProfileScreen.userLogin(sellerIndonesia.emailAddress, sellerIndonesia.password);
    console.log(`........`)

    await NavigationBar.marketButton.click();
    console.log(`........`)

    await MarketScreen.choosedItem(bodyApproveConsign);
    console.log(`........`)

    await MarketScreen.selectSize(bodyProductConsign, accessTokenBuyyerIndonesia, bodyApproveConsign.product_variant_id).then(res => {
      selectedItem = res;
    });

    await MarketScreen.paymentMethod(accessTokenBuyyerIndonesia, selectedItem, bodyApproveConsign.product_variant_id);
  });
});
