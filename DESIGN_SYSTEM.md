# SlopeSense UI/UX Design Documentation

## Design Principles

### 1. **Colorful & Vibrant**
- Utilize bright, engaging colors from the palette
- Use gradients to create depth and visual interest
- Color-code information for quick scanning (red=danger, green=safe, etc.)

### 2. **Intuitive & Clear**
- Use emoji icons for instant visual recognition
- Clear hierarchy with typography sizes
- Obvious call-to-action buttons with high contrast

### 3. **Responsive & Consistent**
- Maintain consistent spacing and alignment
- Responsive design works on all screen sizes
- Consistent use of components throughout app

### 4. **Accessible**
- Sufficient color contrast for readability
- Touch targets at least 44x44 points
- Clear labels for all interactive elements

## Screen Design Specifications

### Home Screen
**Purpose:** Entry point with quick access to main features

**Layout:**
- Header with gradient background
- Welcome section with greeting
- 2x2 grid of stat cards
- 3 large action cards

**Color Scheme:** Primary gradient header, mixed color stat cards, colorful action cards

**Key Interactions:**
- Tap stat cards to view details
- Tap action cards to navigate to features

---

### Dashboard Screen
**Purpose:** Central hub for data and analysis overview

**Layout:**
- Gradient header
- 3-column stats row (Critical/Warning/Safe)
- Filter buttons
- List of site cards
- Bar chart

**Color Scheme:** Secondary gradient header, red/yellow/green for risk levels, blue for primary actions

**Key Interactions:**
- Toggle filters to update list
- Tap site cards to view details
- Swipe chart left/right

---

### Map Screen
**Purpose:** Spatial visualization of analysis locations

**Layout:**
- Full-height gradient map area
- Location pins with slope values
- Map control buttons
- Location list below map

**Color Scheme:** Terrain/satellite gradient background, colored pins matching risk levels

**Key Interactions:**
- Tap pins to view location info
- Toggle map type (terrain/satellite)
- Tap location cards to view details

---

### Analysis Screen
**Purpose:** Detailed measurement and risk analysis

**Layout:**
- Gradient header
- Tool selector (4 buttons)
- Visualization area with slope triangle
- 4-column results grid
- Risk assessment section
- Recommendations list
- Action buttons

**Color Scheme:** Accent gradient header, mixed colors for visualization, multi-color grid items

**Key Interactions:**
- Swipe tool selector to change mode
- Tap recommendations for more info
- Tap buttons to save/share

---

### Settings Screen
**Purpose:** User preferences and app configuration

**Layout:**
- Gradient header
- Profile section with avatar
- Multiple settings sections
- Toggle switches
- Info rows
- Support/help links
- Logout button

**Color Scheme:** Blue gradient header, colorful avatar gradient, green for enabled toggles

**Key Interactions:**
- Toggle switches to change settings
- Tap links to open help pages
- Long-press avatar to edit profile

---

## Component Guidelines

### Gradients
- Always use 2-color gradients with `start={{ x: 0, y: 0 }}` and `end={{ x: 1, y: 1 }}`
- Use predefined gradient sets from `colors.js`
- Apply to backgrounds, buttons, headers, and cards for visual impact

### Cards
- Use white background with subtle shadow
- Add 4px left border for stat cards using risk color
- Rounded corners (16px) for modern appearance
- Consistent padding (16px)

### Buttons
- Always gradient buttons (never solid)
- Minimum height of 44px for touch target
- Icons with labels for clarity
- Disabled state should reduce opacity to 0.5

### Typography
- Use color from textPrimary/textSecondary/textLight
- Maintain hierarchy with size differences
- Bold weight (700) for titles
- Regular weight (400) for body text

### Icons
- Use emoji for visual appeal and instant recognition
- Place icons above or left of labels
- Consistent icon sizing within sections

---

## Color Usage Guide

### Risk Levels
- **Critical**: Red (#FF6B6B) - Requires immediate action
- **Warning**: Yellow (#FFE66D) - Monitor closely
- **Safe**: Green (#44A08D) - No action needed
- **Info**: Cyan (#4ECDC4) - General information

### Functional Areas
- **Primary Actions**: Blue (#5A7CFA)
- **Secondary Actions**: Green (#44A08D)
- **Destructive Actions**: Red (#FF6B6B)
- **Highlights**: Purple (#C084FC)

### Data Visualization
- **Positive**: Green gradient (safe data)
- **Neutral**: Blue gradient (informational)
- **Warning**: Yellow/Orange gradient (caution)
- **Negative**: Red gradient (danger)

---

## Spacing Rules

### Margins
- Between sections: `spacing.lg` (24px)
- Between cards: `spacing.md` (16px)
- Between elements: `spacing.sm` (8px)

### Padding
- Card padding: `spacing.md` (16px)
- Button padding: `spacing.md` horizontal, `spacing.sm` vertical
- Header padding: `spacing.lg` (24px)

### Gaps
- Between items in row: `spacing.md` (16px)
- Between grid items: `spacing.md` (16px)

---

## Typography Hierarchy

### Page Titles
- Size: 28px
- Weight: 700 (Bold)
- Color: Primary text color
- Margin bottom: 16px

### Section Titles
- Size: 18px
- Weight: 700 (Bold)
- Color: Primary text color
- Margin vertical: 24px

### Card Titles
- Size: 16px
- Weight: 600 (Semi-bold)
- Color: Primary text color

### Body Text
- Size: 14-16px
- Weight: 400-500
- Color: Secondary text color
- Line height: 24px

### Small Text
- Size: 11-12px
- Weight: 400
- Color: Light text color

---

## Animation Guidelines

### Transitions
- Button press: 200ms opacity change
- Screen transitions: 300ms default
- Card interactions: 200ms scale

### Gestures
- Swipe: Enable horizontal scroll for lists
- Long press: Show context menus
- Tap: Navigate or toggle

---

## Accessibility Checklist

- [ ] All text has sufficient contrast (minimum 4.5:1 for normal text)
- [ ] Touch targets are at least 44x44 points
- [ ] Interactive elements are clearly labeled
- [ ] Color is not the only way to convey information
- [ ] Text sizes are at least 12pt
- [ ] Consistent navigation patterns
- [ ] Alternative text for icons/images

---

## Mobile Screen Size Considerations

### Small Devices (320px)
- Reduce padding and margins by 20%
- Stack items vertically instead of horizontally
- Use single column layout for lists

### Medium Devices (375px)
- Use 2-column grid for stats
- Full-width cards with margins
- Horizontal scrolling for large charts

### Large Devices (414px+)
- Use 3-4 column grids where appropriate
- Multiple columns for lists
- Larger touch targets

---

## Dark Mode Preparation

Colors for future dark mode support:
- Background: #1A1A1A
- Surface: #2D2D2D
- Text Primary: #FFFFFF
- Text Secondary: #B0B0B0

---

## Best Practices

1. **Consistency**: Use the same components across screens
2. **Feedback**: Provide visual feedback for all interactions
3. **Performance**: Use `React.memo` for expensive components
4. **Testing**: Test on real devices of various sizes
5. **Updates**: Keep dependencies updated and test compatibility

---

## Resources

- Colors: `src/theme/colors.js`
- Components: `src/components/UIComponents.js`
- Screens: `src/screens/`
- Navigation: `src/navigation/AppNavigator.js`

---

**Last Updated:** June 2024
**Design Version:** 1.0
