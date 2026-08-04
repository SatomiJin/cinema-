import { checkForAppUpdate, isVersionNewer } from "./appUpdate";

describe("app update service", () => {
  test.each([
    ["v1.2.0", "1.1.9", true],
    ["1.2", "1.2.0", false],
    ["v2.0.0", "v10.0.0", false],
  ])("compares %s with %s", (candidate, current, expected) => {
    expect(isVersionNewer(candidate, current)).toBe(expected);
  });

  test("returns the signed release APK when a newer release exists", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        assets: [
          { name: "app-debug.apk", browser_download_url: "https://example.com/debug.apk" },
          { name: "app-release.apk", browser_download_url: "https://example.com/release.apk" },
        ],
        html_url: "https://example.com/release",
        tag_name: "v1.3.0",
      }),
    });

    await expect(checkForAppUpdate({ currentVersion: "1.2.0", fetchImpl })).resolves.toEqual({
      available: true,
      downloadUrl: "https://example.com/release.apk",
      hasDirectApk: true,
      latestVersion: "v1.3.0",
      releaseUrl: "https://example.com/release",
    });
  });

  test("falls back to the release page when no APK is attached", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        assets: [],
        html_url: "https://example.com/release",
        tag_name: "v1.3.0",
      }),
    });

    const result = await checkForAppUpdate({ currentVersion: "1.3.0", fetchImpl });
    expect(result.available).toBe(false);
    expect(result.downloadUrl).toBe("https://example.com/release");
    expect(result.hasDirectApk).toBe(false);
  });

  test("surfaces a missing GitHub release", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(checkForAppUpdate({ currentVersion: "1.0.0", fetchImpl })).rejects.toThrow("NO_RELEASE");
  });
});
