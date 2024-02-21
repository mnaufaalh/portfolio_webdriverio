import { faker } from '@faker-js/faker';

class ConsignScreen {
  get sneakersButton() {
    return $('[content-desc="Sneakers"]');
  }

  get apprelButton() {
    return $('[content-desc="Apparel"]');
  }

  get handbagsButton() {
    return $('[content-desc="Luxury"]');
  }

  get electronicAndCollectibleButton() {
    return $('[content-desc="Electronic & Collectibles"]');
  }

  async consignItem() {
    const consignItem = 'sneakers'
    // const consignItem = faker.helpers.arrayElement(['sneakers', 'handbags', 'apparels', 'lifestyles']);
    consignItem === 'sneakers' ? await this.sneakersButton.click() : consignItem === 'apparel' ? await this.apprelButton.click() : consignItem === 'handbags' ? await this.handbagsButton.click() : await this.electronicAndCollectibleButton.click();
    return {
      consignItem: consignItem
    };
  }
}

export default new ConsignScreen();
