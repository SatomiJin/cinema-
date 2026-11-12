describe("APK installer service", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("does not block a completed download while removing its progress listener", async () => {
    const remove = jest.fn(() => new Promise(() => {}));
    const onProgress = jest.fn();
    const plugin = {
      addListener: jest.fn().mockResolvedValue({ remove }),
      downloadApk: jest.fn().mockResolvedValue({
        uri: "file:///cache/cinema-update.apk",
      }),
    };

    jest.doMock("@capacitor/core", () => ({
      registerPlugin: jest.fn(() => plugin),
    }));
    jest.doMock("@capacitor/filesystem", () => ({
      Directory: { Cache: "CACHE" },
      Filesystem: {},
    }));

    const { downloadApk } = require("./apkInstaller");

    await expect(
      downloadApk("https://example.com/app-release.apk", { onProgress }),
    ).resolves.toBe("file:///cache/cinema-update.apk");

    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(remove).toHaveBeenCalled();
  });
});
