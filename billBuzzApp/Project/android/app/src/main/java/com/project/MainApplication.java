package com.project;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;
import com.onesignal.OneSignal;
import com.onesignal.debug.LogLevel;
import com.onesignal.Continue;

public class MainApplication extends Application implements ReactApplication {

    // NOTE: Replace the below with your own ONESIGNAL_APP_ID
    private static final String ONESIGNAL_APP_ID = "1689f579-388e-4fed-9c34-e3422a599de4";
    private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          //packages.add(new RNSharedPreferencesPackage());
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    // Verbose Logging set to help debug issues, remove before releasing your app.
      OneSignal.getDebug().setLogLevel(LogLevel.VERBOSE);

      // OneSignal Initialization
      OneSignal.initWithContext(this, ONESIGNAL_APP_ID);
      // requestPermission will show the native Android notification permission prompt.
      // NOTE: It's recommended to use a OneSignal In-App Message to prompt instead.
      OneSignal.getNotifications().requestPermission(true, Continue.with(r -> {
          if (r.isSuccess()) {
              if (r.getData()) {
                  console.log('successful notifications')
                  // `requestPermission` completed successfully and the user has accepted permission
              }
              else {
                  console.log('rejected notifications')
                  // `requestPermission` completed successfully but the user has rejected permission
              }
          }
          else {
              console.log('failed notifications');
              // `requestPermission` completed unsuccessfully, check `r.getThrowable()` for more info on the failure reason
          }
      }));
  }
}
