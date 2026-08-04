const DEFAULT_UPDATE_API_URL =
  "https://api.github.com/repos/SatomiJin/cinema-/releases/latest";

export const UPDATE_API_URL =
  process.env.REACT_APP_UPDATE_API_URL || DEFAULT_UPDATE_API_URL;

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
  fetchImpl = window.fetch.bind(window),
  updateApiUrl = UPDATE_API_URL,
}) {
  const response = await fetchImpl(updateApiUrl, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    const error = new Error(response.status === 404 ? "NO_RELEASE" : "UPDATE_CHECK_FAILED");
    error.status = response.status;
    throw error;
  }

  const release = await response.json();
  const latestVersion = release.tag_name;
  const apk = findReleaseApk(release.assets);

  if (!latestVersion || !release.html_url) {
    throw new Error("INVALID_RELEASE");
  }

  return {
    available: isVersionNewer(latestVersion, currentVersion),
    downloadUrl: apk?.browser_download_url || release.html_url,
    hasDirectApk: Boolean(apk?.browser_download_url),
    latestVersion,
    releaseUrl: release.html_url,
  };
}
