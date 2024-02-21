require('dotenv').config();
import NavigationBar from 'pageobjects/NavigationBar.js';
import ProfileScreen from 'pageobjects/ProfileScreen';
import SellingScreen from 'pageobjects/SellingScreen';
import ConsignScreen from 'pageobjects/ConsignScreen';
import ConsignRequestScreen from 'pageobjects/ConsignRequestScreen';
import InputSKUScreen from 'pageobjects/InputSKUScreen';
import LoginFlow from 'flows/LoginFlow';
import ConsignRequestSuccessScreen from 'pageobjects/ConsignRequestSuccessScreen';
import ConsignmentFlow from 'flows/ConsignmentFlow';
import ConsignmentScreen from 'pageobjects/ConsignmentScreen';
import ConsignmentDetailScreen from 'pageobjects/ConsignmentDetailScreen';
import { sellerIndonesia } from 'fixtures/accounts/sellerIndonesia';
import { qualityCheckUser } from 'fixtures/accounts/qualityCheckUser';
import { legitCheckUser } from 'fixtures/accounts/legitCheckUser';

describe("Selling Consignment Request", () => {
  let accessTokenSellerIndonesia;
  let accessTokenQualityCheckUser;
  let accessTokenLegitCheckUser;

  beforeEach(async () => {
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
  });

  afterEach(async () => {
    await driver.closeApp();
  });

  it("Should able to consign an item until active", async () => {
    let consignItem;
    let item;
    let condition;
    let boxCondition;
    let sizeId;
    let idItem;
    let courier;
    let rackList;

    await ProfileScreen.userLogin(sellerIndonesia.emailAddress, sellerIndonesia.password);
    await NavigationBar.sellingButton.waitForExist();
    await NavigationBar.sellingButton.click();
    await SellingScreen.consingmentUpload.waitForExist();
    await SellingScreen.consingmentUpload.click();
    await ConsignScreen.consignItem().then(res => {
      consignItem = res.consignItem;
    });
    await driver.pause(3000);
    await ConsignRequestScreen.productName;
    await InputSKUScreen.findSKU(consignItem).then(res => {
      item = res;
    });
    await ConsignRequestScreen.selectSize(consignItem, item, accessTokenSellerIndonesia).then(res => {
      sizeId = res;
    });
    await ConsignRequestScreen.selectCondition(consignItem).then(res => {
      condition = res.condition;
    });
    await ConsignRequestScreen.selectBoxCondition().then(res => {
      boxCondition = res.boxCondition;
    })
    await ConsignRequestScreen.swipeDownUntilBottom;
    if (condition === 'Used' || boxCondition !== 'Perfect') {
      await ConsignRequestScreen.uploadPhoto();
    }
    await ConsignRequestScreen.addValueAdditionalNotes();
    await ConsignRequestScreen.addValuePrice(accessTokenSellerIndonesia, item.id, sizeId);
    await ConsignRequestScreen.continueButton.click();
    await ConsignRequestScreen.checkboxUserAgreement;
    await ConsignRequestScreen.proceedButton.click();
    await expect(ConsignRequestSuccessScreen.goToConsignmentDashboard).toExist();
    await ConsignmentFlow.consignmentList(accessTokenSellerIndonesia, 'pending').then(res => {
      idItem = res.body.data[0];
    });
    await ConsignmentFlow.approveConsignment(accessTokenSellerIndonesia, idItem);
    await ConsignmentFlow.consignmentList(accessTokenSellerIndonesia, 'pending').then(res => {
      idItem = res.body.data[0];
    });
    await ConsignRequestSuccessScreen.goToConsignmentDashboard.click();
    await ConsignmentScreen.selectorItem(idItem, 'Pending', consignItem);
    await ConsignmentFlow.findCourier(accessTokenSellerIndonesia).then(res => {
      courier = res.courier;
    });
    await ConsignmentDetailScreen.deliveryMethod(courier);
    await ConsignmentFlow.receivedFromSeller(accessTokenQualityCheckUser, idItem.sell_consignments.id);
    await ConsignmentFlow.qualityCheck(accessTokenQualityCheckUser, idItem.sell_consignments.id);
    await ConsignmentFlow.legitCheck(accessTokenLegitCheckUser, idItem.sell_consignments.id);
    await ConsignmentFlow.rackList(accessTokenLegitCheckUser).then(res => {
      rackList = res.body;
    });
    await ConsignmentFlow.setRack(accessTokenLegitCheckUser, rackList, idItem.sell_consignments);
    await ConsignmentFlow.consignmentList(accessTokenSellerIndonesia, 'active').then(res => {
      idItem = res.body.data[0];
    });
    await ConsignmentScreen.tabStatus.click();
    await ConsignmentScreen.selectorItem(idItem, 'Active');
  });
});
