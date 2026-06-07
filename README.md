# SlopeSense - Land Analysis Mobile App

A modern, colorful React Native mobile application for real-time slope analysis and land terrain measurement. Built with beautiful gradients, intuitive UI/UX design, and comprehensive analysis tools.

## 🎨 Design System

### Color Palette

#### Primary Colors
- **Red**: `#FF6B6B` - Alert & Critical
- **Orange**: `#FF8E72` - Warning & Secondary
- **Yellow**: `#FFE66D` - Caution & Accent
- **Green**: `#44A08D` - Safe & Success
- **Cyan**: `#4ECDC4` - Info & Secondary
- **Blue**: `#5A7CFA` - Primary Action
- **Purple**: `#C084FC` - Premium Features
- **Pink**: `#FF6B9D` - Highlight

#### Gradient Sets
- **Primary**: Red → Orange (Actions)
- **Secondary**: Cyan → Green (Dashboard)
- **Accent**: Yellow → Orange (Highlights)
- **Ocean**: Cyan → Blue (Map)
- **Sunset**: Yellow → Red (Warmth)
- **Forest**: Green Tones (Nature)

### Typography
- **H1**: 32px, Bold (700)
- **H2**: 28px, Bold (700)
- **H3**: 24px, Semi-bold (600)
- **Body**: 16px, Medium (500)
- **Body Small**: 14px, Regular (400)
- **Caption**: 12px, Regular (400)

### Spacing
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Border Radius
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `full`: 9999px (rounded buttons)

## 📱 Features & Screens

### 1. **Home Screen** 🏠
- Welcome greeting with emoji icons
- Quick access cards with gradients
- At-a-glance statistics
- Links to all main features

**Key Elements:**
- Colorful stat cards with icons
- Quick access tiles for Dashboard, Map, and Analysis
- Overall metrics dashboard

### 2. **Dashboard** 📊
- Comprehensive analysis overview
- Site filtering (Critical, Warning, Safe)
- Risk assessment visualization
- Slope distribution chart

**Key Elements:**
- Statistics boxes (Critical, Warning, Safe)
- Interactive filter buttons
- Site cards with risk indicators
- Bar chart visualization with gradients

### 3. **Map Screen** 🗺️
- Interactive terrain map
- Location pins with slope values
- Satellite/Terrain view toggle
- Nearby locations list

**Key Elements:**
- Gradient map background
- Colored location pins
- Map controls (zoom, type, search)
- Location detail cards

### 4. **Analysis Screen** 🔍
- Detailed slope measurement
- Tool selector (Measure, Analyze, Compare, Export)
- Risk assessment
- Recommendations
- Data export options

**Key Elements:**
- Visualization area with triangle slope display
- Measurement results grid
- Stability progress bar
- Risk badges
- Recommendation cards

### 5. **Settings Screen** ⚙️
- User profile management
- Notification preferences
- Display settings
- Privacy & data controls
- Support links

**Key Elements:**
- Profile avatar with gradient
- Toggle switches for settings
- Info rows for app details
- Support and documentation links
- Logout button

## 🎯 UI/UX Components

### Reusable Components

#### 1. **GradientButton**
```javascript
<GradientButton
  title="Save Analysis"
  onPress={() => {}}
  gradient={colors.primary}
  size="md"
/>
```

#### 2. **Card**
```javascript
<Card gradient={colors.secondary}>
  <Text>Content</Text>
</Card>
```

#### 3. **StatCard**
```javascript
<StatCard
  icon="📊"
  title="Total Sites"
  value="12"
  subtitle="Active surveys"
  color={colors.blue}
/>
```

#### 4. **Header**
```javascript
<Header
  title="Dashboard"
  subtitle="Analysis Overview"
  gradient={colors.secondary}
/>
```

#### 5. **TabButton**
```javascript
<TabButton
  icon="🏠"
  label="Home"
  active={true}
  onPress={() => {}}
  color={colors.blue}
/>
```

#### 6. **InfoBadge**
```javascript
<InfoBadge
  label="Rock Type"
  value="Granite"
  color={colors.blue}
/>
```

## 🏗️ Project Structure

```
slopesense/
├── App.js                          # Main app entry
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
├── src/
│   ├── theme/
│   │   └── colors.js              # Design tokens & colors
│   ├── components/
│   │   └── UIComponents.js        # Reusable UI components
│   ├── screens/
│   │   ├── HomeScreen.js          # Home screen
│   │   ├── DashboardScreen.js     # Dashboard screen
│   │   ├── MapScreen.js           # Map screen
│   │   ├── AnalysisScreen.js      # Analysis screen
│   │   └── SettingsScreen.js      # Settings screen
│   └── navigation/
│       └── AppNavigator.js        # Navigation setup
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Running the App

#### iOS
```bash
npm run ios
# or
yarn ios
```

#### Android
```bash
npm run android
# or
yarn android
```

#### Development Server
```bash
npm start
# or
yarn start
```

## 📦 Dependencies

### Core
- `react@^18.2.0` - React library
- `react-native@^0.72.0` - Mobile framework
- `@react-native-async-storage/async-storage` - Local storage

### Navigation
- `@react-navigation/native` - Navigation framework
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/stack` - Stack navigation
- `react-native-screens` - Navigation optimization
- `react-native-safe-area-context` - Safe area handling
- `react-native-gesture-handler` - Gesture support

### UI & Styling
- `react-native-linear-gradient` - Gradient backgrounds
- `react-native-svg` - SVG support
- `react-native-maps` - Map support

### Data & Charts
- `chart.js@^4.4.0` - Charts library
- `react-native-chart-kit` - Chart components
- `axios@^1.6.0` - HTTP client

## 🎨 Design Highlights

### Colorful & Modern
- **Gradient backgrounds** on buttons, cards, and headers
- **Emoji icons** for visual appeal and quick recognition
- **Smooth animations** with React Native Animated API
- **Responsive layout** that works on all device sizes

### Intuitive Navigation
- **Bottom tab bar** with 4 main sections
- **Easy-to-understand** screen hierarchy
- **Quick access** to common actions
- **Context-aware** back navigation

### Data Visualization
- **Colorful charts** with gradient fills
- **Risk indicators** with color coding
- **Status badges** for quick scanning
- **Progress bars** for measurements

## 🔧 Customization

### Change Theme Colors
Edit `src/theme/colors.js` to modify:
- Gradient colors
- Primary/secondary colors
- Spacing and border radius
- Typography sizes

### Add New Screens
1. Create screen component in `src/screens/`
2. Add to navigation in `src/navigation/AppNavigator.js`
3. Use existing components and theme

### Extend Components
All components are in `src/components/UIComponents.js` - easily extend or create new ones.

## 📝 Development Guidelines

### Code Style
- Use functional components with hooks
- Keep components small and focused
- Use theme variables for consistency
- Add PropTypes for type safety

### Performance
- Use React.memo for expensive components
- Lazy load screens when possible
- Optimize list rendering with FlatList
- Minimize re-renders with useCallback

## 🐛 Troubleshooting

### App Won't Start
1. Clear cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Reset metro bundler: `npm start -- --reset-cache`

### Gradient Not Showing
- Ensure `react-native-linear-gradient` is installed
- Verify gradient prop format: `{ start: '#FF6B6B', end: '#FF8E72' }`

### Navigation Not Working
- Check screen names match in navigator
- Verify navigation params are passed correctly
- Check SafeAreaProvider is at top of app

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📞 Support

For support and questions:
- 📧 Email: support@slopesense.com
- 📚 Documentation: [Full Docs]
- 🐛 Issues: GitHub Issues

---

**SlopeSense** - Making Land Analysis Simple & Beautiful ✨
