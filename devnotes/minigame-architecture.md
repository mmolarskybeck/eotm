# Minigame Architecture - Development Patterns & Standards

*Component structure and behavioral integration patterns for building minigames*

## Core Design Philosophy

Every minigame serves dual purposes: appearing as legitimate workplace training while secretly profiling player behavior. 

**Fundamental Principle**: What players *do* matters more than what they *choose*. Track interaction patterns, hesitation timing, and behavioral sequences rather than just final selections.

## Standard Component Architecture

### Multi-View Structure
All minigames follow the same Vue component pattern established by Quiz.vue:

- **Intro View**: Corporate-style instructions 
- **Gameplay View**: Core interaction with embedded behavioral tracking
- **Completion View**: Results with CoSy commentary
- **Edge Case Views**: Timeout, error, or system failure states

### Required Integration Points
- **Page Headers**: Use `usePageHeader()` for consistent CRT styling
- **State Persistence**: Connect to `useGameStore()` for behavioral data
- **Debug System**: Register controls via `addDebugButton()` injection in development
- **Cleanup**: Handle timers and event listeners in `onBeforeUnmount()`

## Behavioral Tracking Integration

### Data Collection Strategy
- **Event Batching**: Buffer rapid interactions to prevent localStorage performance issues
- **Contextual Metadata**: Include session state, timing context, decision circumstances
- **Cross-Minigame Correlation**: Structure data for five-profile classification analysis

### Key Behavioral Indicators
- **Timing Patterns**: Response speed, hesitation duration, decision rhythm
- **Interaction Sequences**: Order of actions, exploration vs. direct completion
- **Stress Responses**: Behavior under time pressure or ambiguous instructions
- **Compliance Indicators**: Rule-following vs. boundary-testing tendencies
- **Risk Assessment**: Conservative vs. aggressive strategy choices

### Profile System Contribution
Each minigame contributes data toward psychological classification:
- **Model Adjacent**: Optimal performance, minimal deviation
- **Observation Type B**: Safe choices, passive engagement
- **Unresolved Integrator**: Strategic exploration, adaptive learning
- **Low Reliability**: Inconsistent performance, stress indicators
- **Unassigned**: System-resistant behavior, boundary testing

## CoSy Commentary Integration

### Implementation Patterns
- **Static Commentary (Current)**: Hard-coded responses triggered by behavioral flags
- **Dynamic Commentary (Future)**: GPT API integration with fallback to static responses
- **Contextual Awareness**: References specific behavioral patterns and timing metrics

### Triggering Events
- **Completion analysis**: Overall performance and behavioral pattern summary
- **Behavioral anomalies**: Unusual patterns or edge case responses
- **Profile indicators**: Strong signals toward specific psychological classifications
- **System boundaries**: Player attempts to test or circumvent intended mechanics

## Self-Containment Architecture

### Minigame Independence
- Each minigame functions completely in isolation
- No direct dependencies between minigames except through shared store
- Complex minigames use sub-component architecture (see TabDiscipline implementation)

### Sub-Component Strategy
For complex minigames requiring multiple interface elements:
- Break functionality into focused Vue components
- Enable granular behavioral tracking at component level
- Maintain consistent styling and interaction patterns

### Shared Logic Abstraction
- **Timing utilities**: Standardized timeout and warning systems
- **Behavioral tracking**: Common event structure and batching logic
- **CoSy integration**: Unified commentary triggering and display
- **Debug tools**: Consistent development aid patterns

## Development Standards

### Corporate Training Illusion
- **Language authenticity**: Use real corporate terminology and phrasing patterns
- **Interface legitimacy**: Design feels like actual workplace software
- **Subtle wrongness**: Maintain uncanny atmosphere without breaking believability

### Debug Integration Requirements
- **Development shortcuts**: Skip to completion, trigger edge cases, manipulate state
- **Behavioral inspection**: View collected data and profile contributions
- **Profile simulation**: Test different behavioral patterns and system responses

## Testing Priorities

### Behavioral Validation
- **Tracking accuracy**: Verify events capture intended behavioral patterns
- **Profile impact**: Confirm different play styles yield expected classifications
- **Cross-session persistence**: Behavioral data survives browser sessions

### System Integration
- **Store performance**: No lag during intensive behavioral data collection
- **CoSy triggering**: Commentary appears at appropriate behavioral moments
- **Error handling**: Graceful degradation when systems fail

### Corporate Illusion Maintenance
- **Behavioral invisibility**: Players remain unaware of profiling systems
- **System transparency**: CoSy observations feel like normal software feedback

Remember: Every interaction is data. Every hesitation reveals psychology. The system observes silently, categorizes efficiently, and never explains what it's truly measuring.