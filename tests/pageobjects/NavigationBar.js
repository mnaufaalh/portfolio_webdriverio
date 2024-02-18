class NavigationBar {
  get homeButton() {
    return $('[content-desc="Home"]');
  }

  get blogButton() {
    return $('[content-desc="Blog"]');
  }

  get marketButton() {
    return $('[content-desc="Market"]');
  }

  get sellingButton() {
    return $('[content-desc="Selling"]');
  }

  get profileButton() {
    return $('[content-desc="Profile"]');
  }
}

export default new NavigationBar();
