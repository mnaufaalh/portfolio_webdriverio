require('dotenv').config();
import { sellerIndonesia } from 'fixtures/accounts/sellerIndonesia';
import NavigationBar from 'pageobjects/NavigationBar.js';
import ProfileScreen from 'pageobjects/ProfileScreen';

describe("Login", () => {
  it("should unable to login with invalid credentials", async () => {
    await driver.activateApp(process.env.PACKAGE_ANDROID);
    await NavigationBar.profileButton.click();
    await ProfileScreen.loginButton.click();
    await ProfileScreen.emailField.click();
    await ProfileScreen.emailField.setValue(sellerIndonesia.emailAddress);
    await ProfileScreen.passwordField.click();
    await ProfileScreen.passwordField.setValue('invalid password');
    await driver.hideKeyboard();
    await ProfileScreen.submitLoginButton.click();
    expect(await ProfileScreen.errorMessage).toExist();
  });
});
