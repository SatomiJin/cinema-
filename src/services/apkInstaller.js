import { registerPlugin } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

const ApkInstaller = registerPlugin("ApkInstaller");

const APK_DIRECTORY = Directory.Cache;
const APK_FILENAME = "cinema-update.apk";
const DOWNLOAD_TIMEOUT_MS = 180000;

export class ApkInstallError extends Error {
  constructor(code, options = {}) {
    super(code);
    this.name = "ApkInstallError";
    this.code = code;
    this.cause = options.cause;
  }
}

export async function canInstallApk() {
  try {
    const { granted } = await ApkInstaller.canInstall();
    return Boolean(granted);
  } catch {
    return false;
  }
}

export async function requestInstallPermission() {
  try {
    const { granted } = await ApkInstaller.requestPermission();
    return Boolean(granted);
  } catch (error) {
    throw new ApkInstallError("INSTALL_PERMISSION_FAILED", { cause: error });
  }
}

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  // Chunked so a large APK does not blow the argument limit of String.fromCharCode.
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

/**
 * Streams the APK into the app cache, reporting progress when the server sends a length.
 * Returns the on-device path the native installer should open.
 */
export async function downloadApk(url, { onProgress, fetchImpl = (...args) => window.fetch(...args) } = {}) {
  const abortController = typeof AbortController === "undefined" ? null : new AbortController();
  const timeoutId = abortController
    ? setTimeout(() => abortController.abort(), DOWNLOAD_TIMEOUT_MS)
    : null;

  let response;

  try {
    response = await fetchImpl(url, { cache: "no-store", signal: abortController?.signal });
  } catch (error) {
    clearTimeout(timeoutId);
    throw new ApkInstallError(
      abortController?.signal.aborted ? "DOWNLOAD_TIMEOUT" : "DOWNLOAD_NETWORK_ERROR",
      { cause: error },
    );
  }

  try {
    if (!response?.ok) {
      throw new ApkInstallError("DOWNLOAD_FAILED");
    }

    const totalBytes = Number(response.headers?.get?.("content-length")) || 0;
    let buffer;

    if (response.body?.getReader && totalBytes > 0) {
      const reader = response.body.getReader();
      const chunks = [];
      let receivedBytes = 0;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.length;
        onProgress?.(Math.min(99, Math.round((receivedBytes / totalBytes) * 100)));
      }

      buffer = new Blob(chunks);
    } else {
      buffer = await response.blob();
    }

    const arrayBuffer = await buffer.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      throw new ApkInstallError("DOWNLOAD_EMPTY");
    }

    await Filesystem.writeFile({
      path: APK_FILENAME,
      data: toBase64(arrayBuffer),
      directory: APK_DIRECTORY,
    });

    onProgress?.(100);

    const { uri } = await Filesystem.getUri({ path: APK_FILENAME, directory: APK_DIRECTORY });
    return uri;
  } catch (error) {
    if (error instanceof ApkInstallError) throw error;
    throw new ApkInstallError("DOWNLOAD_FAILED", { cause: error });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function installApk(path) {
  try {
    await ApkInstaller.installApk({ path });
  } catch (error) {
    const code = error?.code;
    throw new ApkInstallError(
      code === "PERMISSION_DENIED" ? "INSTALL_PERMISSION_DENIED" : "INSTALL_FAILED",
      { cause: error },
    );
  }
}

export async function clearDownloadedApk() {
  try {
    await Filesystem.deleteFile({ path: APK_FILENAME, directory: APK_DIRECTORY });
  } catch {
    // A missing file is the desired end state anyway.
  }
}
