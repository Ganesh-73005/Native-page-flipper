# React Native Expo App: Flipper Component

This project is a React Native application built with Expo, showcasing a web-based book-flipper component. The flipper displays interactive content using a `WebView`, making it a versatile and portable solution for rich, animated views within a native app.



## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- **Node.js**: Version 18 or newer. You can download it from [nodejs.org](https://nodejs.org/).
- **npm** or **yarn**: A package manager for JavaScript. npm is included with Node.js.
- **Expo Go App**: Install the Expo Go app on your physical iOS or Android device.
  - [Download for iOS (App Store)](https://apps.apple.com/us/app/expo-go/id982107779)
  - [Download for Android (Google Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **(Optional) iOS Simulator or Android Emulator**: For running the app on your computer.
  - **iOS Simulator**: Requires a Mac with Xcode installed.
  - **Android Emulator**: Requires Android Studio installed.

## Installation

Follow these steps to get your development environment set up:

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install Dependencies**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```
    This command will install all the necessary packages defined in `package.json`, including React, React Native, and Expo.

## Running the Application

Once the dependencies are installed, you can run the app in your development environment.

1.  **Start the Metro Bundler**
    ```bash
    npm start
    ```
    or
    ```bash
    yarn start
    ```
    This command starts the Expo development server and opens a new tab in your web browser with the Expo Developer Tools. You will see a QR code displayed in both the terminal and the browser.

2.  **Run on a Physical Device**
    - Open the **Expo Go** app on your iOS or Android phone.
    - On Android, scan the QR code from the terminal or browser.
    - On iOS, open the native Camera app and point it at the QR code.
    - The app will begin to build and bundle the JavaScript, and it will then load on your device.

3.  **Run on a Simulator/Emulator**
    - In the terminal where the development server is running, press:
      - `i` to open the app in the iOS Simulator.
      - `a` to open the app in the Android Emulator.
    - The simulator/emulator must be running before you press the key.

## Project Structure

Here is an overview of the key files and directories in the project:


.
├── components/          # Reusable React components
│   ├── BookFlipperWebView.tsx # The main WebView flipper component
│   └── flipperContent.json # JSON file containing the HTML for the WebView
│   └── PdfFlipper.tsx  # pdf flipper component
├── App.tsx              # The main entry point of the application
├── package.json         # Project metadata and dependencies
└── README.md            # This file


## Key Technologies

- **React Native**: A framework for building native apps using React.
- **Expo**: A platform and set of tools built around React Native to help you develop, build, and deploy apps quickly.
- **TypeScript**: A statically typed superset of JavaScript that enhances code quality and maintainability.
- **React Native WebView**: A core component for embedding web content within the native app.

## Troubleshooting

- **QR Code Not Working on Android**: Ensure your phone and computer are connected to the **same Wi-Fi network**.
- **App Fails to Build**:
  - Try clearing the cache: `npm start -- --clear` or `yarn start --clear`.
  - Delete the `node_modules` directory and `package-lock.json` (or `yarn.lock`) file, then run `npm install` or `yarn install` again.
- **WebView Content Not Loading**:
  - Check for any errors in the terminal where the Metro bundler is running.
  - Ensure the `flipperContent.json` file is correctly formatted and located in the specified path.
