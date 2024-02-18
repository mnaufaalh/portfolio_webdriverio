require('dotenv').config();
import { sellerIndonesia } from 'fixtures/accounts/sellerIndonesia';
import Gestures from 'helpers/Gestures';
import NavigationBar from 'pageobjects/NavigationBar.js';
import ProfileScreen from 'pageobjects/ProfileScreen';

describe("Login", () => {
  it("should able to login with valid credentials", async () => {
    await driver.activateApp(process.env.PACKAGE_ANDROID);
    await NavigationBar.profileButton.click();
    await ProfileScreen.loginButton.click();
    await ProfileScreen.emailField.click();
    await ProfileScreen.emailField.setValue(sellerIndonesia.emailAddress);
    await ProfileScreen.passwordField.click();
    await ProfileScreen.passwordField.setValue(sellerIndonesia.password);
    await driver.hideKeyboard();
    await ProfileScreen.submitLoginButton.click();
    await NavigationBar.profileButton.click();
    await Gestures.swipe(({ x: 0, y: 1000 }), ({ x: 0, y: 10 }));
    expect(await ProfileScreen.logoutButton).toExist();
  });
});
