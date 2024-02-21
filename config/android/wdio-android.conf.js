const projectPath = require('path')
const androidAppPath = projectPath.join(process.cwd(), "./apps/android/app-stag-release.apk")
exports.config = {
    port: 4723,
    specs: [
        './tests/specs/**/**/*.spec.js'
    ],
    suites: {
        login: ['./tests/specs/login/*.spec.js'],
        consignment: ['./tests/specs/consignment/*.spec.js']
    },
    capabilities: [
        {
            "platformName": "Android",
            maxInstances: 1,
            "appium:platformVersion": "12",
            "appium:deviceName": "Galaxy S24",
            "appium:app": androidAppPath,
            "appium:automationName": "uiautomator2",
            "appium:autoGrantPermissions": true,
            'appium:autoLaunch': false,
            'appium:newCommandTimeout': 240,
            'appium:avd': 'Galaxy_S24_API_31',
        }
    ],
    services: [
        [
            'appium',
            {
                command: 'appium',
                args: {
                    address: 'localhost',
                    port: 4723,
                    relaxedSecurity: true,
                }
            }
        ]
    ],
    framework: 'mocha',

    mochaOpts: {
        ui: 'bdd',
        timeout: 150000,
        require: ['@babel/register']
    },
    waitforTimeout: 15000
}
