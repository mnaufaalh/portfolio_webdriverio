class ConsignmentScreen {
  get tabStatus() {
    return $('[content-desc="Active\nTab 2 of 4"]');
  }

  get searchBar() {
    return $('[text="Search your pending consignment here"]');
  }

  async selectorItem(item, stage, product) {
    let askingPrice = parseFloat(item.asking_price).toLocaleString();
    let lowestPrice;
    item.lowest_ask === null ? lowestPrice = 0 : lowestPrice = parseFloat(item.lowest_ask).toLocaleString();
    let status;
    if (stage === 'Pending') {
      let words = item.status.split('_');
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
      status = `${words.join(' ')}\nSelect delivery method`
    } else {
      askingPrice > lowestPrice ? status = `Lowest Ask:\nIDR ${lowestPrice}\nWaiting In Line` : status = item.sell_consignments.status.toLowerCase().split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
    }

    if (stage === 'Pending') {
      await this.searchBar.waitForExist();
      await this.searchBar.click();
      await this.searchBar.setValue(item.consignment_id);
      await driver.keys(['Enter']);
      if (product === 'sneakers') {
        return await $(`[content-desc="${item.product_variant.product.brand.name}\n${item.product_variant.display_name}\nUS ${item.size.US}\nCG ID: ${item.consignment_id}\nHypequarter Display\nIDR ${askingPrice}\n${status}"]`).click();
      } else {
        return await $(`[content-desc="${item.product_variant.product.brand.name}\n${item.product_variant.display_name}\n${item.size.US}\nCG ID: ${item.consignment_id}\nHypequarter Display\nIDR ${askingPrice}\n${status}"]`).click();
      }
    }
  }
}

export default new ConsignmentScreen();