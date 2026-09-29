# SocialPostComposer

A React Native social post composer that lets a shop owner select an image, add and position text directly on the image, and export a flattened Instagram-ready creative.

## 1. Instagram Posting — What I Found

A React Native app can use the native Android/iOS share sheet to hand an exported image to Instagram. This is the approach implemented here because it requires no Instagram login inside the app and keeps the workflow simple for the user.

However, generic native sharing does not guarantee that the Instagram caption field will be automatically populated. The app can provide the image, but Instagram controls the final posting UI.

For fully programmatic Instagram publishing, the official Instagram/Meta publishing APIs would be required. That involves Instagram/Meta account requirements, authentication, permissions/access tokens, and an API-based publishing flow. It is a different integration from simply sharing an image from the device.

**What I built:** on-device composition → full-resolution flattened image → native share flow → Instagram/user completes the final post.

## 2. Flattened Full-Resolution Image

The editor preview is rendered at a convenient screen size, but the final creative is exported at **1080 × 1080**.

I use `react-native-view-shot` to capture the composed canvas containing:

- Selected image
- User-entered overlay text
- Hindi/Devanagari text
- Emoji
- User-defined text position

The result is one flattened image rather than separate image/text layers, making it directly usable as a social post.

Composition happens entirely on the device, so the image is never sent to a server for rendering.

**Trade-off:** because the final output is flattened, the text cannot be edited after export. A future production version could retain an editable composition model and regenerate the final image when needed.

## 3. What I Would Do With Two Weeks

With more time, I would:

- Add a proper design system and reusable editing controls.
- Support multiple text layers with better typography, alignment, and positioning.
- Add font selection, text color, opacity, background, and alignment controls.
- Improve handling of very long captions with automatic wrapping and layout constraints.
- Preserve the original image resolution/aspect ratio while generating platform-specific outputs.
- Add undo/redo and draft persistence.
- Improve accessibility and localization.
- Test across a wider range of Android/iOS devices and image sizes.
- Investigate and implement the official Meta/Instagram publishing flow where account/API requirements allow it.
- Add automated tests for composition, text positioning, export, and sharing edge cases.

## Tech Stack

React Native, TypeScript, React Native Community CLI, `react-native-image-picker`, `react-native-view-shot`, and `react-native-share`.

## Run

```bash
npm install
npx react-native run-android