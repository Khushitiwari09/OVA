# MenseCare App 🌸

A modern menstrual cycle tracking and women's health insights application built with React Native and Expo.

## Features

- **Cycle Tracker** - Track your menstrual flow and cycle patterns
- **Health Insights** - Get personalized diet and wellness recommendations
- **Body Signals** - Understand your body's changes throughout the cycle
- **Scan Analysis** - AI-powered health analysis and results

## Prerequisites

Before running this project, ensure you have the following installed on your system:

### Required Software

| Software     | Version         | Download Link                     |
| ------------ | --------------- | --------------------------------- |
| **Node.js**  | v18.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm**      | v9.x or higher  | Comes with Node.js                |
| **Expo CLI** | Latest          | Installed via npm                 |

### For Mobile Development

| Platform    | Requirements                                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Android** | Android Studio with Android SDK, or a physical Android device with [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| **iOS**     | macOS with Xcode, or a physical iOS device with [Expo Go](https://apps.apple.com/app/expo-go/id982107779)                                     |
| **Web**     | Any modern browser (Chrome, Firefox, Safari, Edge)                                                                                            |

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MenseCareApp
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:

- React Native 0.81.5
- Expo SDK 54
- React Navigation
- Expo Router (file-based routing)
- And other dependencies

### Step 3: Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

## Running the App

### Start Development Server

```bash
npm start
# or
npx expo start
```

This will open the Expo Dev Tools in your terminal. You'll see a QR code and several options.

### Run on Specific Platform

```bash
# Android (emulator or device)
npm run android

# iOS (simulator or device - macOS only)
npm run ios

# Web browser
npm run web
```

### Using Expo Go (Recommended for Quick Testing)

1. Install **Expo Go** on your mobile device:
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Run `npm start` in your terminal

3. Scan the QR code:
   - **Android**: Use the Expo Go app to scan
   - **iOS**: Use the Camera app to scan

## Project Structure

```
MenseCareApp/
├── app/                    # App screens (file-based routing)
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.js       # Login screen
│   │   ├── dashboard.js   # Main dashboard
│   │   ├── explore.tsx    # Explore tab
│   │   └── _layout.tsx    # Tab layout config
│   ├── modal.tsx          # Modal screen
│   └── _layout.js         # Root layout
├── assets/                # Images, fonts, icons
├── components/            # Reusable components
├── constants/             # App constants (colors, etc.)
├── hooks/                 # Custom React hooks
├── scripts/               # Utility scripts
├── app.json              # Expo configuration
├── package.json          # Dependencies & scripts
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm start`             | Start the Expo development server |
| `npm run android`       | Run on Android emulator/device    |
| `npm run ios`           | Run on iOS simulator/device       |
| `npm run web`           | Run in web browser                |
| `npm run lint`          | Run ESLint for code quality       |
| `npm run reset-project` | Reset to a fresh project template |

## Tech Stack

- **Framework**: React Native 0.81.5
- **Development Platform**: Expo SDK 54
- **Navigation**: Expo Router + React Navigation 7.x
- **Language**: TypeScript / JavaScript
- **Styling**: React Native StyleSheet
- **State Management**: React Hooks

## Troubleshooting

### Common Issues

**Metro bundler issues:**

```bash
npx expo start --clear
```

**Dependency issues:**

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

**Cache issues:**

```bash
npx expo start -c
```

### Platform-Specific Issues

**Android**: Ensure Android Studio is installed with proper SDK setup. Set `ANDROID_HOME` environment variable.

**iOS**: Requires macOS with Xcode installed. Run `sudo xcode-select --switch /Applications/Xcode.app` if needed.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For questions or issues, please open an issue in the repository.
