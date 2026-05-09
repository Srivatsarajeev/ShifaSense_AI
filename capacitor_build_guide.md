# Building ShifaSense AI Capacitor APK

I have successfully initialized Capacitor and added the Android platform to your project. The application code has also been updated to support dynamic API URLs, ensuring it works both on the web and as an APK.

## 1. Configure the API URL
Before building the APK, you **must** update the API URL in your `.env` file. Since the APK runs on a mobile device, `localhost` or `127.0.0.1` will not work.

1. Open `frontend/.env`.
2. Change `VITE_API_URL` to your computer's local IP address (e.g., `http://192.168.1.5:8000`) or your deployed backend URL (e.g., `https://shifasense-backend.vercel.app`).

## 2. Prepare the Build
Run the following commands in the `frontend` directory whenever you make changes to the web code:

```bash
# Build the production web app
npm run build

# Sync the changes to the Android project
npx cap sync
```

## 3. Generate the APK in Android Studio
To create the actual `.apk` file:

1. **Open the Android project**:
   ```bash
   npx cap open android
   ```
   *(This will launch Android Studio with your project loaded.)*

2. **Wait for Gradle to Sync**: 
   Once Android Studio opens, wait for the background processes and Gradle sync to finish (indicated by a green checkmark at the bottom).

3. **Build the APK**:
   - Go to the top menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - Once finished, a notification will appear in the bottom-right corner. Click **Locate** to find your `app-debug.apk`.

## 4. Troubleshooting
- **Network Issues**: If the APK cannot connect to the backend, ensure your phone and computer are on the same Wi-Fi network and that your firewall allows connections on port `8000`.
- **Permissions**: If you need to access the camera or location in the future, you'll need to add those permissions to `android/app/src/main/AndroidManifest.xml`.
