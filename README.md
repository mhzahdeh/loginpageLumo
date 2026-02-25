# LumosFit iOS App

This app is built with **React Native** and **Expo**. React Native lets you build native iOS (and Android) apps using JavaScript and React. Expo is a framework and toolchain that simplifies setting up, building, and running React Native projects.

---

## First-time setup

After you clone or fork the repository and have the code on your machine, run these commands from the project root (the `ios-app-lumosfit` folder):


| Command                            | What it does                                                                                                                                                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`                      | Installs project dependencies (Node modules).                                                                                                                                                                                                                 |
| `npx expo install expo-dev-client` | Installs the Expo dev client so you can run development builds on simulator or device. A *development build* is a build of your app that includes Expo's developer tools and loads your JavaScript from the dev server so you get fast refresh and debugging. |


**Optional:** [Watchman](https://facebook.github.io/watchman/docs/install#macos) can improve performance when files change. On macOS with Homebrew:

```bash
brew install watchman
```

*Installs Watchman for faster file watching.*

---

## Get started

1. **Install dependencies**
  ```bash
   npm install
  ```
   *Installs project dependencies (Node modules).*
2. **Start the app**
  ```bash
   npx expo start
  ```
   *Starts the Expo dev server—a local server that serves your JavaScript bundle so code changes can appear with fast refresh without rebuilding the native app.*
   In the output, you'll find options to open the app in a:
  - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
  - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
  - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
  - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
   You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction/).

---

## Prerequisites

- **Node.js** (LTS) — [nodejs.org](https://nodejs.org/)
- **macOS** with **Xcode** (for iOS simulator or device)
- **Git** (to clone the repo)

---

## Two ways to run the app for testing

You can either run the app in the **iOS Simulator** (in Xcode) or on a **physical iPhone** connected to your Mac.

---

### Option 1: iOS Simulator (Xcode)

1. **Install Xcode**
  Install from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835) (or update if you already have it).
2. **Install Xcode Command Line Tools**
  Open Xcode → **Settings…** (or ⌘ + ,) → **Locations** → choose the latest version in the **Command Line Tools** dropdown.
3. **Install iOS platform support in Xcode**
  In Xcode, go to **Settings…** → **Components**. Under **Platform Support**, ensure **iOS** is installed (you should see a version number and size, e.g. "Last used …", not a "Get" button). If you see **Get** next to iOS, click it to download and install the iOS platform.
   Xcode Settings → Components: ensure iOS is installed under Platform Support
4. **Run the app in the simulator**
  From the project root:
   *Builds the app and launches it in the default iOS Simulator.*
   Expo will start the dev server (the local server that serves your JavaScript bundle so you can see code changes with fast refresh without rebuilding the native app) and open the simulator. You can pick a different simulator when prompted if needed.

---

### Option 2: Physical iPhone (device)

1. **Complete Option 1 steps 1–3** (Xcode and iOS platform support must be installed).
2. **Connect your iPhone**
  Plug your iPhone into your Mac with a USB cable. Unlock the device and tap **Trust** if your iPhone asks to trust the computer.
3. **Enable Developer Mode on your iPhone**
  - On the iPhone: **Settings** → **Privacy & Security** → **Developer Mode**.
  - Turn **Developer Mode** **On**.
  - Confirm the restart when prompted; after the device restarts, confirm again and enter your passcode if asked.
4. **Set a unique bundle identifier** 
   **If you forked this repo:** Use a bundle identifier that *you* will register with your own Apple Developer account (e.g. `com.forkername.lumosfit`). The bundle ID is tied to a specific Apple Developer account and that account's provisioning profiles. To run on a physical device, the app must be signed with a profile that matches that bundle ID and is created by your account. If you keep the original author's bundle ID, only their account can create valid profiles—you'll get errors like "No profiles for 'com.yourname.lumosfit' were found." Set `expo.ios.bundleIdentifier` in `app.json` to something you'll register (e.g. `com.forkername.lumosfit`), then use your Apple Developer account to register that bundle ID and create the provisioning profile.
5. **Build and run on your device**
  From the project root:
   *Builds the app and lists connected devices; choose your iPhone to install and run.*
   Select your iPhone from the list when prompted. The app will build and install on your phone.
6. **If your iPhone shows "Untrusted Developer"**
  After the app is installed, iOS may block it until you trust your developer certificate:
  - On the iPhone: **Settings** → **VPN & Device Management** (or **General** → **VPN & Device Management** on some versions).
  - Under **Developer App**, tap your developer profile and choose **Allow** (or **Trust "…"**).
   You only need to do this once per device/profile.
7. **Open the app and connect to the dev server**
  Find the LumosFit app in your iPhone's home screen or App Library and open it. To load your project from the dev server (so you get fast refresh and the latest code), the app needs to connect to the URL where the dev server is running. You can either **scan the QR code** shown in the terminal (with your iPhone camera or from inside the app if it offers a scanner), or **enter the dev server URL** from the terminal (e.g. `exp://192.168.x.x:8081`) into the app when it asks for a URL. Once connected, the app will load your JavaScript bundle from your Mac.

---

## Quick reference: terminal commands


| Command                            | What it does                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`                      | Install dependencies.                                                                                                                  |
| `npx expo install expo-dev-client` | Add Expo dev client for development builds (a build of your app that includes Expo's dev tools and loads JS from the dev server).      |
| `npx expo run:ios`                 | Build and run on the default iOS Simulator.                                                                                            |
| `npx expo run:ios --device`        | Build and run on a connected iPhone (choose device when prompted).                                                                     |
| `npx expo start`                   | Start the Expo dev server only (serves your JS bundle for fast refresh and debugging; then press `i` for iOS simulator if configured). |


---

## Useful links

- [Create an Expo project](https://docs.expo.dev/get-started/create-a-project/)
- [Set up your environment (iOS, physical device, development build, local)](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical&mode=development-build&buildEnv=local)

