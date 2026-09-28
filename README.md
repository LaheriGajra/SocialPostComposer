# PostPilot — Detailed Implementation, Troubleshooting & Future Handling

## 1. Project Overview

PostPilot is a React Native mobile post-composition application created for the assignment.

The core requirement is:

```text
Owner has:
    Image
    +
    Caption

        ↓

Owner places text on the image

        ↓

Finished flattened image

        ↓

Instagram / native sharing step
```

The application is designed for a small shop/business owner who is not expected to be a professional designer.

The implementation focuses on keeping the editing flow simple:

- Select an image.
- Add text.
- Move the text.
- Change text size.
- Enter an Instagram caption.
- Preview the result.
- Export the image.
- Share it through the native mobile sharing flow.

---

# 2. Technology Used

The application uses:

- React Native
- React Native Community CLI
- TypeScript
- React Hooks

Native packages used for the workflow:

```text
react-native-image-picker
react-native-view-shot
react-native-share
```

### Why React Native Community CLI?

The project requires native functionality such as:

- Gallery/image selection.
- Image handling.
- View capture.
- Native sharing.
- Android/iOS native integration.

React Native Community CLI gives direct access to the native Android and iOS projects.

---

# 3. Application Structure

The implementation was organized into separate components, hooks, services, utilities and types.

```text
PostPilot/
│
├── App.tsx
│
├── src/
│   │
│   ├── components/
│   │   ├── PostEditor.tsx
│   │   ├── EditorHeader.tsx
│   │   ├── EditorCanvas.tsx
│   │   ├── OverlayTextEditor.tsx
│   │   ├── CaptionEditor.tsx
│   │   ├── TextControls.tsx
│   │   └── ActionBar.tsx
│   │
│   ├── hooks/
│   │   ├── usePostEditor.ts
│   │   └── useImageExport.ts
│   │
│   ├── services/
│   │   ├── imagePicker.ts
│   │   └── shareService.ts
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   │
│   ├── types/
│   │   └── editor.ts
│   │
│   └── utils/
│       └── editor.ts
│
├── android/
├── ios/
├── package.json
└── README.md
```

The purpose of the separation is:

```text
UI
 ↓
Editor state
 ↓
Image processing/export
 ↓
Native sharing
```

This keeps the editor logic independent from the sharing logic.

---

# 4. Image Selection

## What we implemented

The owner can select an image from the device gallery.

The selected image is stored as the current `imageUri` and displayed inside the editor canvas.

The editor supports the assignment's requirement of using a sufficiently high-resolution image and targets a square social-post output.

## Flow

```text
User taps Add Image
        ↓
Image Picker
        ↓
User selects image
        ↓
imageUri stored
        ↓
Image displayed in EditorCanvas
```

## State

The main editor state contains:

```text
imageUri
```

When the user selects another image, the editor updates the current image and resets the text position.

---

# 5. Editor Canvas

The `EditorCanvas` represents the actual creative.

It contains:

```text
Image
+
Image Text
```

The important architectural decision is that editor controls are kept outside this canvas.

The canvas is the part that can be captured for export.

## Exported creative does not contain

- Change button
- POST button
- Username
- Like icon
- Comment icon
- Share icon
- Editor instructions
- Drag indicator
- Fake Instagram chrome
- Shop Now button

This prevents UI controls from accidentally becoming part of the final image.

---

# 6. Image Text / Overlay

The assignment requires the owner to lay text onto the image.

We implemented a dedicated `OverlayTextEditor`.

The text is rendered directly over the selected image.

Example:

```text
आपका कारोबार आपकी पहचान ✨❤️
```

The text supports:

- Hindi / Devanagari.
- English.
- Emoji.
- Multiple words.
- Line wrapping.

The text is visually styled so that it remains readable over the image.

The overlay uses:

- White text.
- Text shadow.
- Semi-transparent dark background.
- Rounded corners.
- Controlled font size.

---

# 7. Hindi and Emoji Support

The assignment specifically requires:

- At least one Hindi caption.
- At least one emoji example.
- Characters must render correctly.

We therefore tested the editor with:

```text
आपका कारोबार आपकी पहचान ✨❤️
```

The application keeps the text as Unicode text rather than replacing or manually converting the characters.

The same approach is used for the post caption.

---

# 8. Dragging Text

The text can be directly dragged on the image.

The implementation uses React Native's `PanResponder`.

## Interaction

```text
Touch text
    ↓
Drag
    ↓
Calculate dx / dy
    ↓
Update position
    ↓
Clamp position
    ↓
Render text at new position
```

The editor tracks:

```text
x
y
```

for the text position.

---

# 9. Text Position Clamping

One problem during development was that text could be moved beyond the desired usable area of the image.

To handle this, a clamp function was added.

Conceptually:

```text
Requested position
        ↓
Check boundaries
        ↓
Adjust x/y if necessary
        ↓
Safe position
```

The position is restricted using:

- Horizontal margin.
- Top margin.
- Bottom margin.
- Estimated text width.
- Estimated text height.

This prevents the text from being dragged completely outside the creative.

---

# 10. Fixing Text Position Near the Bottom

During development, the text initially could not be moved low enough toward the bottom of the image.

The reason was the estimated text height used in the clamping calculation.

The position calculation was adjusted so that the estimated text height was smaller and the bottom margin was reduced.

The result allows the owner to move the text much closer to the bottom of the creative while still keeping it inside the canvas.

---

# 11. Text Size

The editor includes controls for changing the overlay text size.

The font size is intentionally bounded.

Conceptually:

```text
Minimum font size
        ↓
Current font size
        ↓
Maximum font size
```

This prevents the owner from making the text too small to read or excessively large for the composition.

The implementation uses:

```text
MIN_FONT_SIZE
MAX_FONT_SIZE
FONT_STEP
```

---

# 12. Long-Press to Remove Text

The owner can long-press the image text.

The interaction is:

```text
Long press
    ↓
Confirmation dialog
    ↓
"Remove"
    ↓
Delete text
```

A timer is used to detect the long press.

A drag is distinguished from a long press by checking movement.

If the user moves beyond the movement threshold, the long-press timer is cleared and the gesture becomes a drag.

---

# 13. Problem: Empty Textbox After Removal

This was one of the issues we specifically fixed.

Initially, hiding the overlay was not enough because the actual `overlayText` value could still contain the previous text.

That could lead to an empty editor state or inconsistent rendering.

## Fix

When the user confirms removal:

```text
setOverlayText('')
setShowOverlayText(false)
```

Two pieces of state are therefore cleared:

```text
overlayText
showOverlayText
```

The render condition also checks the actual text:

```text
overlayText.trim().length > 0
```

Therefore an empty text overlay is never rendered.

## Result

```text
Before:

Image
+ Text
+ Textbox

       ↓ Long Press → Remove

After:

Image only
```

If the user types new text later:

```text
New text
    ↓
overlayText has value
    ↓
showOverlayText = true
    ↓
Textbox appears again
```

---

# 14. Problem: Blue Dot on Text

During development, a small white circle containing a blue dot was displayed on the text.

It was originally being used as a visual editor indicator.

The requirement did not need this control and it made the creative look less clean.

It was removed from `OverlayTextEditor`.

The text now contains only the actual editable text container.

This also prevents an editor indicator from accidentally being captured into the final creative.

---

# 15. Instagram Caption

The application has a separate Instagram caption field.

This is intentionally different from the text that is placed on the image.

Example:

### Image text

```text
आपका कारोबार आपकी पहचान ✨❤️
```

### Instagram caption

```text
आज की खास पेशकश ✨❤️

Introducing our latest product.
Designed to make your everyday experience better.

#NewProduct #ShopNow
```

This separation is important because:

```text
Image text
=
Part of flattened image

Instagram caption
=
Post metadata/text intended for Instagram
```

---

# 16. Caption Length Handling

The caption input is limited by a maximum length.

The image overlay also has its own maximum length.

The purpose is to prevent uncontrolled text from creating an unusable layout.

The implementation rejects additional characters after the configured limit.

This gives predictable behavior for the owner.

---

# 17. Long Image Text

The assignment asks us to show what happens when a caption/text becomes too long.

The current implementation handles this through:

- Maximum overlay text length.
- Text wrapping.
- Maximum available width.
- Controlled font size.
- Position constraints.

This prevents unlimited text from overflowing the editor.

A future improvement would be automatic font scaling based on the remaining canvas area.

---

# 18. Exporting the Creative

The important requirement is that the output must be one flattened image.

The editor therefore separates:

```text
Editor UI
```

from:

```text
Creative Canvas
```

Only the creative canvas is captured.

Conceptually:

```text
Image
   +
Overlay Text
   ↓
ViewShot
   ↓
Flattened image
```

The intended output is:

```text
1080 × 1080
```

The final image is therefore a single image rather than separate image/text layers.

---

# 19. Why the Editor Preview and Export Are Different

The editor can contain controls needed by the owner.

For example:

```text
Change
Text controls
Caption input
Share button
Instructions
```

These should not become part of the actual social creative.

Therefore:

```text
Editor Screen
 ├── Controls
 ├── Caption editor
 └── Creative Canvas
       ├── Image
       └── Text
```

Only:

```text
Creative Canvas
```

is captured.

This was an important implementation decision.

---

# 20. Native Sharing

After creating the flattened image, the app uses the native mobile sharing mechanism.

The flow is:

```text
PostPilot
    ↓
Flattened Image
    ↓
Native Share
    ↓
Compatible Applications
    ↓
User selects Instagram if available
```

The app does not require the user to log into Instagram inside PostPilot.

---

# 21. Instagram Caption Problem

We investigated an important limitation.

The generic Android share mechanism can transfer the image and can provide text as share data.

However, the receiving application decides how it handles that shared text.

Therefore, sending:

```text
Image
+
Caption
```

does not guarantee that Instagram will automatically put the caption into the Instagram caption field.

## Current behavior

```text
PostPilot
   ↓
Image + caption data
   ↓
Android Share
   ↓
Instagram
```

Image sharing can work through the supported share flow.

Caption pre-population is not guaranteed.

We therefore do not claim that the current implementation automatically inserts the Instagram caption.

This is a platform/application limitation rather than a React Native text-input problem.

---

# 22. What We Would Do in the Future for Instagram

If the product needs direct publishing rather than user-driven sharing, we would investigate the official Meta/Instagram publishing integration.

The future architecture would be closer to:

```text
PostPilot
    ↓
Instagram account authorization
    ↓
Backend / Meta integration
    ↓
Media publishing workflow
    ↓
Image + caption
    ↓
Instagram
```

This is not part of the current afternoon implementation.

It would require investigation of:

- Account eligibility.
- Required permissions.
- Authorization.
- Token management.
- Backend integration.
- Media publishing requirements.
- Publishing status.
- Error handling.

The important point is that this is a different integration from generic Android sharing.

---

# 23. TypeScript Troubleshooting

Several TypeScript issues were encountered because of the React Native version and type definitions.

## StyleSheet typing issue

`StyleSheet.create` produced typing issues with some literal style values.

The implementation used plain style objects and literal casts where necessary, for example:

```text
fontWeight: '700' as const
```

This kept the styles compatible with the installed React Native types.

---

# 24. ViewShot Ref Typing Issue

The `ViewShot` ref produced a TypeScript incompatibility.

The practical solution used was:

```text
const canvasRef = useRef<any>(null)
```

This avoids an incompatible ref type between the installed `react-native-view-shot` types and the React Native component typing.

---

# 25. ScrollView Ref Typing Issue

The `ScrollView` ref generated an incompatible type error.

The same practical approach was used:

```text
const scrollViewRef = useRef<any>(null)
```

This resolved the mismatch for the installed React Native type definitions.

---

# 26. StatusBar Type Issue

The installed React Native version did not accept the previously used `backgroundColor` prop in the `StatusBar` type.

Instead of forcing an unsupported property, the implementation used:

```text
<StatusBar barStyle="dark-content" />
```

and controlled the surrounding view background separately.

---

# 27. CaptionEditor `onFocus` Type Issue

The `CaptionEditor` component was receiving an `onFocus` callback that was not included in its props interface.

The interface was updated to make it explicit:

```text
onFocus?: () => void
```

This aligned the component's TypeScript contract with how it was actually being used.

---

# 28. TextPosition Import Issue

`TextPosition` was used inside `utils/editor.ts` but was not imported.

The issue was resolved by importing:

```text
TextPosition
```

from:

```text
../types/editor
```

This restored the correct shared type definition.

---

# 29. Android / Java / Gradle Troubleshooting

During the project work, the Android build environment also required troubleshooting.

The Android build had an issue where Gradle could use the wrong Java runtime.

The project requires Java 17.

The environment was corrected using:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

Verification:

```bash
java -version
```

and:

```bash
cd android
./gradlew --version
```

The Gradle JVM was checked to ensure it was running with Java 17.

---

# 30. Android Device / ADB Troubleshooting

The Android device was detected using:

```bash
adb devices -l
```

There was also an Android installation issue where the package service was temporarily unavailable.

The emulator/device state was restarted and the installation was retried.

The final workflow was:

```text
ADB device available
       ↓
Build APK
       ↓
Install APK
       ↓
Launch application
```

For development with a physical Android device, Metro connectivity can be enabled using:

```bash
adb reverse tcp:8081 tcp:8081
```

---

# 31. Current Technical State

The implemented application now has the main assignment workflow:

```text
Select image
      ↓
Display image
      ↓
Add Hindi / English / emoji text
      ↓
Drag text
      ↓
Resize text
      ↓
Remove text with long press
      ↓
Enter Instagram caption
      ↓
Capture creative
      ↓
1080 × 1080 target
      ↓
Native share
      ↓
Instagram / compatible app
```

The main platform limitation is:

```text
Generic native sharing
        ↓
Does not guarantee
automatic Instagram caption insertion
```

This limitation is documented rather than hidden.

---

# 32. Future Troubleshooting / Handling Plan

Only the problems relevant to this project should be addressed in future development.

## A. Instagram caption not populated

### Current situation

Generic share does not guarantee caption population.

### Future handling

Investigate the official Meta/Instagram publishing route.

Do not attempt to depend on undocumented Instagram behavior.

---

## B. Long text covers important image content

### Current situation

Text length is limited and constrained.

### Future handling

Add automatic layout logic:

```text
Text length increases
        ↓
Measure available space
        ↓
Reduce font size
        ↓
Wrap text
        ↓
Keep safe margins
```

---

## C. Large images cause memory pressure

### Current situation

High-resolution images are required by the assignment.

### Future handling

Test with large camera images and optimize:

- Image copies.
- Export memory.
- Temporary files.
- Capture size.
- Device memory usage.

---

## D. Hindi/Emoji differences between devices

### Current situation

Hindi and emoji are supported through Unicode text.

### Future handling

Test on multiple Android and iOS devices because actual font/glyph availability can differ between operating systems and device fonts.

---

## E. Export/share failure

### Future handling

Add explicit handling for:

```text
Export failed
      ↓
Show error
      ↓
Allow retry
```

and:

```text
Share cancelled
      ↓
Return to editor
```

The editor data should remain intact after a failed/cancelled share.

---

## F. Different screen sizes

### Current situation

The editor uses a device-sized preview while targeting a fixed square output.

### Future handling

Test:

- Small Android phones.
- Large Android phones.
- Tablets if supported.
- Different iPhone sizes.

The important requirement is that the preview coordinates and final export coordinates remain consistent.

---

# 33. What Is Implemented vs Future

| Area | Current | Future |
|---|---|---|
| Image picker | ✅ | — |
| Image preview | ✅ | — |
| Text on image | ✅ | Better text tools |
| Hindi | ✅ | More device testing |
| Emoji | ✅ | More device testing |
| Drag text | ✅ | Snap/guides |
| Text size | ✅ | Automatic scaling |
| Long-press delete | ✅ | — |
| Empty textbox fix | ✅ | — |
| Caption field | ✅ | Better validation |
| Caption length | ✅ | — |
| Flattened image | ✅ | More export testing |
| 1080 × 1080 target | ✅ | More device testing |
| Native share | ✅ | — |
| Instagram image sharing | ✅ Via supported share flow | More platform testing |
| Automatic Instagram caption | ❌ Not guaranteed | Official Meta integration |
| Direct Instagram publishing | ❌ | Future integration |
| Large-image optimization | Basic | More optimization |
| Error handling | Basic | More complete retry handling |
| Cross-device testing | Basic | Full device matrix |

---

# 34. Important Product Decision

The application does not pretend that a generic Android share intent can fully control Instagram.

The current implementation does what the mobile platform reliably allows:

```text
Create the creative
        ↓
Flatten it
        ↓
Share it
        ↓
Let the user continue in Instagram
```

If direct caption insertion and publishing become mandatory, that should be treated as a separate official Instagram/Meta integration rather than an undocumented workaround.

---

# 35. Final Assignment Result

The implemented solution addresses the main creative workflow:

```text
Image
 +
Text
 +
Caption
 ↓
On-device composition
 ↓
Flattened social image
 ↓
Native sharing
```

The major limitation discovered during implementation is the Instagram caption handoff.

That limitation is explicitly documented and separated from the functionality that the application controls.

The future work is therefore focused on solving the actual remaining technical problems rather than adding unrelated product features.