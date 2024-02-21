import { faker } from "@faker-js/faker";
import Datetime from "helpers/Datetime";
import Gestures from "helpers/Gestures";

class ConsignmentDetailScreen {
  get selectDeliveryMethodButton() {
    return $('[content-desc="Select Delivery Method"]');
  }
  get pickUpButton() {
    return $('//android.view.View[@content-desc="Pick Up\nYour chosen courier will come to your location\nPowered by "]');
  }
  get dropOffButton() {
    return $('[content-desc="Drop Off\nDeliver it yourself or drop your package to any logistic service nearby."]');
  }
  get continueDeliveryMethodButton() {
    return $('[content-desc="Continue"]');
  }
  get browseFilesDropOff() {
    return $('[content-desc="Browse Files"]');
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
  get courierButton() {
    return $('[text="Select Courier"]');
  }
  async chooseCourier(courier) {
    return await $(`[content-desc="${courier}"]`).click();
  }
  get courierName() {
    return $('[text="Input courier name"]');
  }
  get selfDropOffTime() {
    return $('[content-desc="09:00 - 11:59 "]');
  }
  get submitSelfDropOff() {
    return $('[content-desc="Submit"]');
  }
  get AWBNumberField() {
    return $('[text="Input AWB number"]');
  }
  get submitDropOffButton() {
    return $('[content-desc="Submit"]');
  }
  get submitDropOffConfirmationButton() {
    return Gestures.tap({ x: 750, y: 1400 });
  }

  get activeConsignmentStatus() {
    return $('[content-desc="Active Consignment"]');
  }

  async selfDropOff() {
    await $(`[content-desc="${Datetime.tomorrowDropOffDate()}"]`).click();
    await this.selfDropOffTime.click();
    await this.submitSelfDropOff.click();
    return Gestures.tap({ x: 748, y: 1415 });
  }


  async deliveryMethod(courier) {
    await this.selectDeliveryMethodButton.click();
    await this.dropOffButton.click();
    await this.continueDeliveryMethodButton.click();
    await this.browseFilesDropOff.click();
    await this.uploadViaCamera.click();
    await this.shutterCamera.click();
    await this.acceptPhoto.click();
    await this.courierButton.waitForExist();
    await this.courierButton.click();
    const selectedCourier = faker.helpers.arrayElement(courier);
    await this.chooseCourier(selectedCourier);
    selectedCourier === 'Other' ? (await this.courierName.click(), await this.courierName.setValue(faker.lorem.words()), await driver.hideKeyboard()) : selectedCourier === 'Self Drop-Off' ? await this.selfDropOff() : (await this.AWBNumberField.click(), await this.AWBNumberField.setValue(faker.number.int()), await driver.hideKeyboard(), await this.submitDropOffButton.click());
    await driver.pause(3000);
    return await this.submitDropOffConfirmationButton;
  }

}

export default new ConsignmentDetailScreen();