# Truth Engine App: Exhaustive Technical Specification (Living Document)

This is the central architectural blueprint for the Final Freedom / Truth Engine application. It documents every domain model, UI physics parameter, psychological feedback loop, routing path, state management node, and the complete 10-Phase implementation roadmap. This document is intended to be appended to as the complexity of the app scales.

---

## 1. Executive Summary & Design Philosophy

**The Purpose:** The application is a Cognitive Reset Tool designed to permanently dismantle porn addiction methodologies through the "Duolingo for Deconditioning" model. It strictly adheres to the EasyPeasy/Freedom Model framework:
- No tracking of "Days Clean" (which induces a deprivation complex).
- Complete reliance on clinical neutrality and logical deconstruction over willpower or moral shaming.
- Complete privacy through 100% offline functionality.

**The Medium:** The user interacts with 300 "Truth Cards" divided into 15 Decks. Swiping left or right forces them to commit to a belief, generating a psychological Reality Check when the card flips. The UX utilizes haptic shocks and color theory to re-align their perception of psychological illusions.

---

## 2. Core Technology Stack

- **Framework:** Flutter (Targeting iOS/Android minimal UI builds).
- **Architecture:** Feature-First (Domain-Driven Design).
- **State Management:** `flutter_riverpod` (v2.x with code generation `riverpod_generator`).
- **Local Database:** `isar` (Preferred over Hive due to strong-typed queries and extreme performance).
- **Routing:** `go_router` (For strict URL-based navigation and deep-linking the Intercept button).
- **Immutability:** `freezed` & `json_serializable` (For all domain objects).
- **Animations:** `flutter_animate` (For complex chained micro-interactions and the Card Flip).

---

## 3. Database Schema Design (Isar Collections)

Privacy is paramount. The app must never connect to a backend server to retrieve or save user progress. Everything is compiled locally or seeded upon first boot.

### 3.1 `Collection: TruthCard`
Represents an individual micro-lesson.

```dart
@collection
class TruthCard {
  Id id = Isar.autoIncrement;

  @Index()
  late int deckId; // Which deck does this belong to (1-15)

  late int orderIndex; // The sequential order within the deck

  late String illusionFront; // The trap sentence (e.g., "It reduces stress.")
  late String realityCheckBack; // The truth sentence (e.g., "Dopamine is excitatory.")

  late bool isValidationCard; // TRUE = The user should swipe RIGHT to align perception.
                              // FALSE = The user should swipe LEFT to detect an illusion.

  @enumerated
  late Difficulty difficulty; // EASY, MEDIUM, HARD. Used for Streak Protection.
}

enum Difficulty { EASY, MEDIUM, HARD }
```

### 3.2 `Collection: UserProgress`
Represents the overarching analytics profile of the user.

```dart
@collection
class UserProgress {
  Id id = 1; // Singleton class

  late int unlockedDecksCount; // Maximum decks accessible
  late int totalCardsSwiped; 
  late int totalIllusionsDetected; 
  late int totalPerceptionsAligned;

  late DateTime lastActiveSession; // Used strictly for analytics, not for a "Streak" counter
}
```

### 3.3 `Collection: DailySession`
Tracks the active 20-card deck state to persist progression if the app is killed mid-deck.

```dart
@collection
class DailySession {
  Id id = Isar.autoIncrement;

  late int activeDeckId;
  late int currentCardIndex; // 0 to 19

  late int consecutiveWrongSwipes; // The core metric for the Streak Protection UX
}
```

---

## 4. UI Design System & Theming Specifications

The application explicitly avoids "alarmist" (bright red) or "gamified" (neon green/gold) colors. It must feel like a premium, dark-mode meditation app.

### 4.1 Color Palette (Hex Codes)
- **Primary Background:** `#0D0F14` (Deep Charcoal - to minimize eye strain and screen brightness during late-night cravings).
- **Card Surface:** `#151821` (Slightly elevated gray-blue).
- **Primary Typography:** `#E6EAF2` (Soft off-white for high readability).
- **Secondary Typography:** `#8890A6` (Muted gray for subtitles and progress text).
- **The Align Glow (Correct):** `#10241A` (A very subtle, dark forest green tint for the background).
- **The Illusion Glow (Incorrect):** `#2A1115` (A very subtle, dark crimson tint for the background).

### 4.2 Typography Rules
- **Font Family:** `Inter`, `SF Pro`, or `Satoshi`.
- **The Front Card Text:** 24px - 28px, `FontWeight.w600` (SemiBold). It must fill the card space significantly to compel reading over skimming.
- **The Back Card Text:** 18px, `FontWeight.w400` (Regular), with a generous `lineHeight` of 1.6 for analytical reading.

### 4.3 Animation Physics (The Constants)
All animations must be mathematically chained to prevent "jank" and create a sense of deliberate resistance.
- **Swipe Snap-Back Duration:** `250ms` using `Curves.easeOutBack`.
- **Card Flip Duration:** `300ms` using `Curves.easeInOutCubic`.
- **Max Tilt Restriction:** The card must *never* tilt more than `4 degrees` (approx `0.07 radians`) regardless of horizontal drag distance. Extreme tilt makes the app look like a cheap dating app; restricted tilt makes it feel heavy and thoughtful.

---

## 5. Psychological Mechanics & The Feedback Loop

The core engine of this app is NOT the UI; it is the psychological rewiring loop triggered by user action.

### 5.1 The Haptic Signature Map
Haptic feedback bypasses the visual cortex and directly engages the physical nervous system.
- `onPanUpdate (Cross Threshold)` -> `HapticFeedback.selectionClick()`
  - *Triggered perfectly at `screenWidth * 0.35`. It tells the brain: "A decision is armed."*
- `onRelease (Illusion Detected / Wrong)` -> `HapticFeedback.heavyImpact()`
  - *Accompanied by the Card Flip and the `#2A1115` screen tint. The physical sting of realizing a belief was false.*
- `onRelease (Perception Aligned / Correct)` -> `HapticFeedback.mediumImpact()`
  - *Accompanied by the Card Flip and the `#10241A` screen tint. A clean, satisfying physical click of validation.*

### 5.2 The Streak Protection Algorithm (Crucial)
A major risk of the "Illusion Detection" model is user frustration. If a user gets 4 cards wrong in a row, they will close the app and suffer a dopamine crash. 
**The Riverpod Logic Sequence:**
1. The `CardSessionNotifier` tracks `consecutiveWrongSwipes`.
2. If `consecutiveWrongSwipes == 3`:
3. The Notifier intercepts the 4th card in the queue.
4. It dynamically searches the current Deck for an `isValidationCard == true` (an obvious truth card, e.g., "Addiction thrives on novelty.")
5. The 4th card injected is guaranteed to be easy. 
6. The user swipes Right, receives `PERCEPTION ALIGNED`, their confidence is recovered, and `consecutiveWrongSwipes` is reset to 0.

---

## 6. Comprehensive 10-Phase Development Roadmap

### PHASE 1: Scaffolding the Clean Architecture 
- Initialize Flutter project with `--empty` flag.
- Setup `pubspec.yaml`:
  - `flutter_riverpod`, `riverpod_annotation`, `riverpod_generator`
  - `isar`, `isar_flutter_libs`, `build_runner`
  - `go_router`, `freezed`
  - `flutter_animate`
- Create the core directory tree:
  ```
  lib/
    core/
      constants/, theme/, routing/, services/
    features/
      truth_cards/
      dashboard/
      onboarding/
  ```

### PHASE 2: Data Seeding & Isar Integration
- Write the `TruthCard` mapped models in Dart.
- Create `/assets/data/decks_1_to_15.json` based on the markdown files.
- Write the `DatabaseSeederService`. Upon first app launch, parse the JSON and write all 300 cards into the Isar local database.
- Build Riverpod providers to query cards by `deckId`.

### PHASE 3: The Custom Swipe Engine (Physics Layer)
- Discard bloated third-party Swipe packages. 
- Create `StatefulWidget TruthCardSwiper`.
- Implement `GestureDetector`:
  - Parse `details.delta.dx` into a local `ValueNotifier<double> dragOffset`.
  - Use `Transform.translate` and `Transform.rotate` tightly coupled to the `dragOffset`.
  - Mathematically lock the rotation clamping to `-0.07` to `0.07` radians.

### PHASE 4: The Flip Engine & Haptic Integration
- Integrate the `HapticFeedback` constants mapping to the `dragOffset` threshold.
- Implement the `AnimationController` for the Flip. 
- When `dragOffset` exceeds threshold and `onPanEnd` fires, trigger the Flip. 
- Build the `AnimatedSwitcher` that swaps the Front Widget for the Back Widget exactly halfway through the 300ms flip animation.

### PHASE 5: The Daily Deck UI Flow
- Create the `DeckSessionScreen`.
- Implement the top horizontal Progress Bar (`LinearProgressIndicator` or custom `Container` width).
- Integrate the Riverpod state to shift the array: `activeCard = remainingCards.first`.
- When card is swiped to completion, slide next card in from underneath with a subtle scale animation from `0.95` to `1.0`.

### PHASE 6: Streak Protection & Dynamic Queueing
- Build the logic layer inside `TruthCardNotifier`.
- Implement the intercept logic to swap the 4th card if `consecutiveWrongAnswers == 3`.
- Write robust unit tests for this specific state machine to ensure the user queue never throws an `IndexOutOfRange` exception when swapping cards on the fly.

### PHASE 7: The Clarity Dashboard
- Build the `HomeDashboardScreen`.
- Pull overall metrics from the `UserProgress` Isar collection.
- Render visually minimalist text metrics: "Decks Mastered", "Current Baseline Step".
- Include a strict GoRouter flow to jump into `DeckSessionScreen` with the correct `deckId`.

### PHASE 8: The Intercept (Panic Button)
- The app needs an emergency fallback outside of the Daily Decks.
- A single "I Need Clarity" button on the Dashboard.
- When pressed, immediately load an AVRT (Addictive Voice Recognition Technique) sequence of 3 highly aggressive cards analyzing physiological arousal.
- *Example logic:* "Is your anxiety high right now because you need it, or because your previous dopamine drop caused the anxiety?"

### PHASE 9: Subliminal Animations & Polish
- Use `flutter_animate` to introduce "breathing" animations. When the app is idle on a card, the card should gently elevate and depress on the Y-axis by 2 pixels over a 4-second loop.
- Polish the End of Deck screen. Fade out all elements. Fade in: *"Illusion Dismantled."* Delay 1.5 seconds. Fade in a single "Return to Base" text button.

### PHASE 10: Production & Release Preparation
- Complete rigorous offline testing (Airplane mode).
- Set up Android Fastlane & GitHub Actions CI/CD for automated AppBundle builds.
- Configure iOS app signing and provisioning profiles.
- Submit to Play Store and App Store as a Medical/Health or Lifestyle application, strictly outlining that the app contains NO user data tracking and relies purely on local-ML cognitive behavioral structuring.

---
*End of Blueprint. Future amendments regarding API structures or Phase expansions should be documented above this line.*
