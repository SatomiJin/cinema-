const DEFAULT_UPDATE_API_URL =
  "https://api.github.com/repos/SatomiJin/cinema-/releases/latest";

const DEFAULT_REQUEST_TIMEOUT_MS = 10000;

export const UPDATE_API_URL =
  process.env.REACT_APP_UPDATE_API_URL || DEFAULT_UPDATE_API_URL;

export class AppUpdateError extends Error {
  constructor(code, options = {}) {
    super(code);
    this.name = "AppUpdateError";
    this.code = code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

function createUpdateError(code, options) {
  return new AppUpdateError(code, options);
}

function parseVersion(value) {
  const match = String(value || "")
    .trim()
    .match(/^v?(\d+(?:\.\d+)*)(?:[-+].*)?$/i);

  return match ? match[1].split(".").map(Number) : null;
}

export function isVersionNewer(candidateVersion, currentVersion) {
  const candidate = parseVersion(candidateVersion);
  const current = parseVersion(currentVersion);

  if (!candidate || !current) {
    throw new Error("INVALID_VERSION");
  }

  const partCount = Math.max(candidate.length, current.length);

  for (let index = 0; index < partCount; index += 1) {
    const candidatePart = candidate[index] || 0;
    const currentPart = current[index] || 0;

    if (candidatePart !== currentPart) {
      return candidatePart > currentPart;
    }
  }

  return false;
}

function findReleaseApk(assets = []) {
  const apkAssets = assets.filter((asset) => /\.apk$/i.test(asset.name || ""));

  return (
    apkAssets.find((asset) => /release/i.test(asset.name) && !/debug/i.test(asset.name)) ||
    apkAssets.find((asset) => !/debug/i.test(asset.name)) ||
    apkAssets[0]
  );
}

export async function checkForAppUpdate({
  currentVersion,
  fetchImpl = (...args) => window.fetch(...args),
  updateApiUrl = UPDATE_API_URL,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
}) {
  const abortController = typeof AbortController === "undefined" ? null : new AbortController();
  const timeoutId = abortController
    ? setTimeout(() => abortController.abort(), timeoutMs)
    : null;

  let response;

  try {
    response = await fetchImpl(updateApiUrl, {
      cache: "no-store",
      headers: { Accept: "application/vnd.github+json" },
      signal: abortController?.signal,
    });
  } catch (error) {
    throw createUpdateError(
      abortController?.signal.aborted ? "UPDATE_CHECK_TIMEOUT" : "UPDATE_NETWORK_ERROR",
      { cause: error },
    );
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  if (!response || typeof response.ok !== "boolean") {
    throw createUpdateError("UPDATE_SERVICE_ERROR");
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw createUpdateError("UPDATE_SOURCE_UNAVAILABLE", { status: response.status });
    }

    if (response.status === 403 || response.status === 429) {
      throw createUpdateError("UPDATE_RATE_LIMITED", { status: response.status });
    }

    throw createUpdateError("UPDATE_SERVICE_ERROR", { status: response.status });
  }

  let release;

  try {
    release = await response.json();
  } catch (error) {
    throw createUpdateError("INVALID_RELEASE", { cause: error });
  }

  if (!release || typeof release !== "object") {
    throw createUpdateError("INVALID_RELEASE");
  }

  const latestVersion = release.tag_name;
  const apk = findReleaseApk(release.assets);

  if (!latestVersion || !release.html_url) {
    throw createUpdateError("INVALID_RELEASE");
  }

  try {
    return {
      available: isVersionNewer(latestVersion, currentVersion),
      downloadUrl: apk?.browser_download_url || release.html_url,
      hasDirectApk: Boolean(apk?.browser_download_url),
      latestVersion,
      releaseUrl: release.html_url,
    };
  } catch (error) {
    if (error.message === "INVALID_VERSION") {
      throw createUpdateError("INVALID_RELEASE", { cause: error });
    }

    throw error;
  }
}
