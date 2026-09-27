# Internal blink timing

Both rigs now separate `Idle` (existing breathing) from `Blink` (one shot,
9 frames at 60 fps, 150 ms). Eyes stay open until a blink is requested;
closure takes 50 ms, holds for one frame, then reopens over 83 ms.

RiveCharacter schedules each instance independently every 8–12 seconds,
averaging 10 seconds. It does not restart the interval for action, wardrobe,
posture or appearance changes. Timers are cleared on teardown. Hidden pages
skip scheduled blinks rather than accumulating a backlog.

Raw Rive consumers should play `Blink` on their own timer alongside State
Machine 1. The state machine's idle no longer contains an automatic blink.
Production uses the shared React wrapper, so all characters get this behavior.
