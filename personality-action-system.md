# Personality + Action System Design

This document describes how player actions interact with NPC personality traits and moral foundations, and how that influences relationship meters and story gating.

This section intentionally excludes scene scheduling, drift systems, and rendering details. It focuses only on:

- Action representation
- NPC trait representation
- Reaction calculation
- Relationship meter updates
- How relationship state unlocks future content

---

## 1. Trait Representation

Each NPC has two centered trait vectors:

### Moral Foundations (5D, centered -1 to 1)

- Care
- Fairness
- Loyalty
- Authority
- Purity

Interpretation:
- `0` = neutral / balanced
- `+1` = strongly aligned with that moral value
- `-1` = strongly opposed

These represent normative evaluation — what the NPC considers morally correct.

---

### Big Five Personality Traits (5D, centered -1 to 1)

- Openness
- Conscientiousness
- Extraversion
- Agreeableness
- Neuroticism

Interpretation:
- `0` = average
- `+1` = strong expression of the trait
- `-1` = opposite extreme

These represent style and temperament — how the NPC reacts and behaves.

---

## 2. Action Representation

Each player choice emits:

### Moral Impact Vector (5D)
How the action aligns with moral foundations.

Example:
- Authority: -0.7
- Purity: -0.8
- Loyalty: -0.3

### Style Impact Vector (5D)
How the action expresses personality traits.

Example:
- Extraversion: +0.8
- Conscientiousness: -0.6
- Openness: +0.4

Guidelines:
- Keep action vectors sparse and interpretable.
- Not every action should touch every dimension.
- Avoid overfitting or micro-tuning every axis.

---

## 3. Reaction Calculation

When the player takes an action and NPCs are present:

### Step 1: Moral evaluation

moralScore = dot(moralImpact, npcMoralWeights)

This determines whether the NPC morally approves or disapproves.

---

### Step 2: Style resonance

styleScore = dot(styleImpact, npcPersonalityWeights)

This determines whether the NPC appreciates the behavioral style of the action.

---

### Step 3: Context modifiers

Before applying to relationship meters, adjust for context:

- Public vs private setting
- Recorded vs informal channel
- Presence of supervisors
- Training scene vs phone scene

Context may amplify or dampen moralScore before meter updates.

---

## 4. Relationship Model

Per NPC, maintain:

- affinity ∈ [-1, 1]  (warmth / liking)
- standing ∈ [-1, 1]  (trust/respect vs suspicion)
- attraction ∈ [0, 1] (optional; only relevant NPCs)

---

## 5. Mapping Reaction to Relationship

Separate evaluation from meter updates.

### Standing (trust / respect)

Primarily influenced by moralScore + context.

standingSignal = moralScore * standingSensitivity

---

### Affinity (warmth)

Primarily influenced by styleScore and tone.

affinitySignal = styleScore * affinitySensitivity

---

### Attraction (for romance-relevant NPCs)

Influenced by:
- Extraversion match
- Openness match
- Select moral/style components
- Optional genre bias

---

## 6. Damped Updates (Geometric / EMA)

Relationship meters should update using exponential smoothing to avoid instant flips.

For a meter x and new signal s:

x = (1 - alpha) * x + alpha * s

Where:
- alpha is small (0.05–0.2 for routine interactions)
- Larger alpha may be used for major or irreversible events

Additional refinements:

- Asymmetric stickiness:
  - Smaller alpha when crossing through 0 (friend → enemy)
  - Larger alpha when reinforcing current direction
- Clamp values to allowed range

This ensures:
- Several negative interactions are required to flip a friend into an enemy.
- Gradual reinforcement feels believable.
- Major betrayals can still override with higher alpha.

---

## 7. Derived Stance

Rather than writing content directly against raw meters, derive a narrative stance:

Examples:
- Ally
- Neutral
- Threat
- Crush
- Enemy

Stance is computed from combinations of:
- affinity
- standing
- attraction
- optional flags

Story gating should primarily reference stance rather than raw numbers.

---

## 8. Unlocking Content

Relationship state influences content in three ways:

### 1. Choice Gating (Hard Locks)

Example conditions:
- standing >= 0.5
- attraction >= 0.7
- stance == Ally

---

### 2. Outcome Variation (Soft Locks)

Same choice, different results depending on relationship state.

Example:
- Persuasion succeeds if standing high.
- Flirt succeeds if attraction high.
- Rule-breaking covered up if affinity high.

---

### 3. Event Triggering

Crossing thresholds may enqueue events:

- High attraction → romance opportunity
- Low standing → HR escalation
- High affinity + rule-breaking → cover-up event

These are triggered via threshold crossing + cooldowns to prevent repetition.

---

## 9. Design Constraints

- Use sparse NPC weight vectors for interpretability.
- Avoid per-action if/else trees.
- Do not allow personality engine to directly choose full plot routing.
- Keep the relationship system influencing availability, tone, and interrupts — not the entire story spine.

---

## Summary Pipeline

1. Player selects choice.
2. Action emits moral + style vectors.
3. For each present NPC:
   - Compute moralScore and styleScore.
   - Apply context modifiers.
   - Convert to relationship signals.
   - Update meters using EMA.
4. Update derived stance.
5. Check for threshold-based unlocks or events.

This provides scalable, interpretable, and dampened NPC behavior without large conditional trees.
