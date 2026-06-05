# Welcome to the Expo based bin app 👋
# binGO SmartBin App

The SmartBin App is the intelligent collection-point component of the **binGO – Campus Recycle Rewards** ecosystem. Developed using **React Native (Expo)**, the application runs on a dedicated smartphone mounted at a recycling station and serves as the interface between users and the recycling system.

The app generates unique QR codes that users scan to initiate recycling sessions. Once a session is active, the SmartBin device captures images of deposited recyclable items using the device camera. A **YOLOv8-based computer vision model** processes these images to identify and classify supported recyclable items such as aluminum cans and plastic bottles. The detected item counts are then synchronized with **Firebase Realtime Database**, enabling real-time tracking of recycling activity.

### Key Features

* QR Code-based session initiation
* Real-time recycling session management
* Camera-based image capture
* YOLOv8-powered recyclable item classification
* Automatic can and bottle counting
* Firebase Realtime Database integration
* Live session status updates
* Lightweight Expo-based deployment

### Technology Stack

* React Native
* Expo SDK
* TypeScript
* Firebase Realtime Database
* YOLOv8 Object Detection
* Expo Camera
* QR Code Generation Libraries

### Workflow

1. SmartBin generates a session QR code.
2. User scans the QR code using the binGO User App.
3. Recycling session is created and linked to the user.
4. SmartBin camera captures images of deposited items.
5. YOLOv8 detects and classifies recyclable objects.
6. Item counts are updated in Firebase.
7. Session statistics become available to the User App in real time.

The SmartBin App enables automated recyclable waste tracking without requiring dedicated hardware, making it a cost-effective and scalable solution for smart recycling initiatives.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)


