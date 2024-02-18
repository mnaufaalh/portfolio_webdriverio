import NavigationBar from "./NavigationBar";

class ProfileScreen {
  get loginButton() {
    return $('[content-desc="Login"]');
  }

  get registerButton() {
    return $('[content-desc="Register"]');
  }

  get emailField() {
    return $('[text=Email]');
  }

  get passwordField() {
    return $('[text=Password]');
  }

  get submitLoginButton() {
    return $('(//android.view.View[@content-desc="Login"])[2]');
  }

  get buyingButton() {
    return $('[content-desc="Buying"]');
  }

  get sellingButton() {
    return $('[content-desc="Selling"]');
  }

  get consignmentButton() {
    return $('[content-desc="Consignment"]');
  }

  get myVoucherButton() {
    return $('[content-desc="My Voucher"]');
  }

  get wishlistButton() {
    return $('[content-desc="Wishlist"]');
  }

  get profileSettingButton() {
    return $('[content-desc="Profile Setting"]');
  }

  get helpCenterButton() {
    return $('[content-desc="Help Center"]');
  }

  get logoutButton() {
    return $('[content-desc="Logout"]');
  }

  get errorMessage() {
    return $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View')
  }

  async typeEmail(email) {
    await this.emailField.click();
    await this.emailField.setValue(email);
  }

  async typePassword(password) {
    await this.passwordField.click();
    await this.passwordField.setValue(password);
  }

  async userLogin(email, password) {
    await NavigationBar.profileButton.click();
    await this.loginButton.click();
    await this.typeEmail(email);
    await this.typePassword(password);
    await this.submitLoginButton.click();
  }
}

export default new ProfileScreen();