import { Builder, By, Key, until } from 'selenium-webdriver';
import 'geckodriver'; // Make sure geckodriver is installed

(async function runTests() {
  const driver = await new Builder().forBrowser('firefox').build();
  try {
    // Test 1: Home Page Load
    await driver.get('http://linserv1.cims.nyu.edu:14179/');
    await driver.wait(until.titleIs('sweeterthanfiction'), 10000); // Adjust timeout as needed

    // Test 2: Registration Form
    // Replace these with actions suitable for your application
    await driver.findElement(By.name('username')).sendKeys('testuser');
    await driver.findElement(By.name('password')).sendKeys('password123', Key.RETURN);
    await driver.wait(until.titleIs('Registration Success'), 10000); // Adjust timeout as needed

    // Add more tests as needed
  } finally {
    await driver.quit();
  }
})();
