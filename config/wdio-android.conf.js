const projectPath = require('path')
const androidAppPath = projectPath.join(process.cwd(), "./apps/android/app-stag-release.apk")
exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        './tests/specs/**/**/*.spec.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 10,
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
    logLevel: 'info',
    bail: 0,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
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
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 150000,
        require: ['@babel/register']
    },
    waitforTimeout: 15000
}
