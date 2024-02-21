class SellingScreen {
  get singleUpload() {
    return $('[content-desc="Single Upload\n(One Product)\nThe easiest way to upload single product"]')
  }

  get bulkUpload() {
    return $('[content-desc="Bulk Upload\n(Multiple Products)\nYou have more than 5 items to sell? Just fill out an excel form and upload it back to us"]')
  }

  get consingmentUpload() {
    return $('[content-desc="Consignment\n(Send to Warehouse)\nGet rid of all time hassle and keep your products stored in our warehouse."]')
  }
}

export default new SellingScreen();