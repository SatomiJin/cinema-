# Releasing the Android APK

## How a release happens

Pushing a `vMAJOR.MINOR.PATCH` tag triggers the `release` job in
[`.github/workflows/android.yml`](../.github/workflows/android.yml), which builds a signed APK and
attaches it to a GitHub Release. Nothing else publishes a release; branch pushes and pull requests
only produce an unpublished debug APK.

The in-app updater reads
`https://api.github.com/repos/SatomiJin/cinema-/releases/latest` and compares the release's
`tag_name` with the installed `versionName`. **The tag must therefore be exactly `v` + the version
users see.** A tag like `v1.0.1-beta` or `release-1.0.1` will fail the build rather than ship an
update that can never be detected.

## One-time setup

### 1. Create the release keystore

Run this on your own machine, once, and never commit the result:

```bash
keytool -genkeypair -v \
  -keystore cinema-release.keystore \
  -alias cinema \
  -keyalg RSA -keysize 2048 -validity 10000
```

> **Back this file up somewhere durable, along with its passwords.**
> Every future update must be signed with this exact keystore. If it is lost, Android will refuse
> to install any new build over the existing app — the only ways out are changing the
> `applicationId` or asking every user to uninstall and reinstall, losing their local data.

`*.keystore` and `*.jks` are already git-ignored.

### 2. Upload the signing secrets

```bash
base64 -w0 cinema-release.keystore > keystore.b64   # macOS: base64 -i cinema-release.keystore -o keystore.b64

gh secret set ANDROID_KEYSTORE_BASE64 < keystore.b64
gh secret set ANDROID_KEYSTORE_PASSWORD    # keystore password
gh secret set ANDROID_KEY_ALIAS            # "cinema", per the command above
gh secret set ANDROID_KEY_PASSWORD         # key password (often the same as the keystore password)

rm keystore.b64
```

Verify with `gh secret list` — all four must be listed.

## Cutting a release

```bash
git tag v1.0.0
git push origin v1.0.0
```

Then watch it with `gh run watch`, and confirm the APK is attached with
`gh release view v1.0.0`.

## Versioning

`versionName` comes straight from the tag; `versionCode` is derived from it as
`MAJOR * 1000000 + MINOR * 1000 + PATCH`.

| Tag      | versionName | versionCode |
| -------- | ----------- | ----------- |
| `v1.0.0` | `1.0.0`     | `1000000`   |
| `v1.0.1` | `1.0.1`     | `1000001`   |
| `v1.1.0` | `1.1.0`     | `1001000`   |
| `v2.0.0` | `2.0.0`     | `2000000`   |

Android requires `versionCode` to increase on every update, and this scheme guarantees that as long
as tags increase — unlike a CI run counter, it does not change if the workflow is re-run or reset.
`MINOR` and `PATCH` are each capped at 999 to keep the arithmetic unambiguous.

## Installing the first release over a debug build

Android refuses to install an APK over an app signed with a different key, so the first signed
release **cannot** be installed on top of a debug build already on the phone:

1. Uninstall the debug app (this clears its local data).
2. Install the release APK from the GitHub Release.

From then on, updates install over the top normally, as long as the same keystore is used every
time.

## Safety checks in the pipeline

The build fails, rather than publishing something broken, if:

- the tag is not a plain `vMAJOR.MINOR.PATCH`;
- any of the four signing secrets is missing;
- a release build is attempted with no keystore configured — Gradle would otherwise silently fall
  back to the debug key (enforced in [`android/app/build.gradle`](../android/app/build.gradle));
- the finished APK turns out to carry the `CN=Android Debug` certificate;
- the test suite fails.
