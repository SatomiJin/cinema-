package com.cinemamovie.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.IOException;

/**
 * Hands a downloaded APK to the system installer.
 *
 * <p>Android never lets an app install a package silently: the user has to grant
 * "install unknown apps" once, and then confirm each install. This plugin only removes the
 * detour through the browser — it reports whether the permission is held, opens the settings
 * screen to grant it, and launches the system installer for a file we already downloaded.
 */
@CapacitorPlugin(name = "ApkInstaller")
public class ApkInstallerPlugin extends Plugin {

    private static final String APK_MIME_TYPE = "application/vnd.android.package-archive";

    @PluginMethod
    public void canInstall(PluginCall call) {
        JSObject result = new JSObject();
        result.put("granted", hasInstallPermission());
        call.resolve(result);
    }

    /**
     * Opens the per-app "install unknown apps" screen. The result is not delivered back here;
     * the caller re-checks {@link #canInstall} when the app resumes.
     */
    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (hasInstallPermission()) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.reject("UNSUPPORTED", "Manage unknown app sources is only available on Android 8+.");
            return;
        }

        try {
            Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES)
                    .setData(Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(intent);
        } catch (Exception error) {
            call.reject("SETTINGS_UNAVAILABLE", "Could not open the install-permission screen.", error);
            return;
        }

        JSObject result = new JSObject();
        result.put("granted", false);
        call.resolve(result);
    }

    @PluginMethod
    public void installApk(PluginCall call) {
        String path = call.getString("path");

        if (path == null || path.trim().isEmpty()) {
            call.reject("INVALID_PATH", "No APK path was provided.");
            return;
        }

        if (!hasInstallPermission()) {
            call.reject("PERMISSION_DENIED", "Install permission has not been granted.");
            return;
        }

        File apk = new File(Uri.parse(path).getPath() == null ? path : Uri.parse(path).getPath());

        // Keep the installer pointed strictly at files this app downloaded into its own cache,
        // so a malformed path cannot be used to hand an arbitrary file to the package installer.
        File cacheRoot = getContext().getCacheDir();
        try {
            if (!apk.getCanonicalPath().startsWith(cacheRoot.getCanonicalPath() + File.separator)) {
                call.reject("INVALID_PATH", "The APK must live in the app cache directory.");
                return;
            }
        } catch (IOException error) {
            call.reject("INVALID_PATH", "Could not resolve the APK path.", error);
            return;
        }

        if (!apk.exists() || apk.length() == 0) {
            call.reject("FILE_NOT_FOUND", "The downloaded APK is missing or empty.");
            return;
        }

        try {
            Uri contentUri = FileProvider.getUriForFile(
                    getContext(),
                    getContext().getPackageName() + ".fileprovider",
                    apk
            );

            Intent intent = new Intent(Intent.ACTION_VIEW)
                    .setDataAndType(contentUri, APK_MIME_TYPE)
                    .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception error) {
            call.reject("INSTALL_FAILED", "Could not launch the system installer.", error);
        }
    }

    private boolean hasInstallPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return true;
        }

        return getContext().getPackageManager().canRequestPackageInstalls();
    }
}
