# NeuroBloom MVP - Interactive Learning Platform

A comprehensive Next.js full-stack application designed to support neurodiverse individuals through engaging, interactive learning activities with personalized insights and analytics.

## 🌟 Features

### 🎨 Interactive Learning Modules
- **Art Pad**: Digital drawing with multiple tools and colors
- **Puzzle Play**: Sliding puzzle game with multiple difficulty levels
- **Music Maker**: Virtual piano with recording and playback
- **Math Explorer**: Visual math problems with hints and feedback
- **Builder Zone**: Drag-and-drop 3D building with templates

### 📊 Analytics & Insights
- **Real-time tracking** of user interactions and engagement
- **AI-powered insights** based on learning patterns
- **Comprehensive dashboard** for caregivers and educators
- **Session analytics** with detailed metrics

### 🔐 Secure Access
- **PIN-based authentication** for caregiver access
- **Session management** with secure cookies
- **Protected dashboard** with role-based access

## 🏗️ Architecture

### Full-Stack Next.js
- **Frontend**: React components with TypeScript
- **Backend**: API routes for data handling
- **Storage**: JSON file-based persistence
- **Styling**: Tailwind CSS with custom animations

### Data Flow
```
User Interaction → Tracking System → API Routes → JSON Storage → Analytics Engine → Dashboard
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd neurobloom-mvp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

### Default Access
- **Activities**: Open to all users
- **Caregiver Dashboard**: PIN `1234`

## 📁 Project Structure

```
neurobloom-mvp/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage (Activity Launcher)
│   ├── modules/                 # Dynamic module pages
│   │   └── [name]/page.tsx      # Individual module pages
│   ├── caregiver/               # Protected caregiver area
│   │   └── page.tsx             # Dashboard with auth
│   └── api/                     # Backend API routes
│       ├── tracking/route.ts    # Session data collection
│       ├── dashboard/route.ts   # Analytics and insights
│       ├── auth/route.ts        # Authentication
│       └── feedback/route.ts    # AI insights generation
├── components/                  # React components
│   ├── ActivityLauncher.tsx     # Main activity grid
│   ├── CaregiverDashboard.tsx   # Analytics dashboard
│   ├── PINEntry.tsx             # Authentication form
│   └── modules/                 # Individual activity modules
│       ├── ArtPad.tsx           # Drawing application
│       ├── PuzzlePlay.tsx       # Sliding puzzle game
│       ├── MusicMaker.tsx       # Virtual piano
│       ├── MathExplorer.tsx     # Math problems
│       └── BuilderZone.tsx      # 3D building interface
├── lib/                         # Utility libraries
│   ├── types.ts                 # TypeScript definitions
│   ├── storage.ts               # Data persistence
│   ├── tracking.ts              # User interaction tracking
│   └── feedback-engine.ts       # AI insights generation
├── data/                        # JSON data storage
│   ├── sessions.json            # Session records
│   └── profiles.json            # User profiles
└── package.json                 # Dependencies and scripts
```

## 🎯 Learning Modules

### Art Pad
- **Canvas drawing** with brush and eraser tools
- **Color palette** with 10 different colors
- **Brush size control** (1-20px)
- **Download artwork** as PNG files
- **Real-time tracking** of drawing interactions

### Puzzle Play
- **Sliding puzzle** with 3x3, 4x4, and 5x5 grids
- **Move counter** and timer
- **Best time tracking**
- **Visual feedback** for valid moves
- **Auto-shuffle** for new games

### Music Maker
- **Virtual piano** with 12 notes
- **Octave control** (2-6)
- **Recording and playback** functionality
- **Keyboard shortcuts** for easy access
- **Volume control** and visual feedback

### Math Explorer
- **Visual math problems** with interactive elements
- **Multiple difficulty levels** (easy, medium, hard)
- **Hint system** for learning support
- **Streak tracking** and accuracy metrics
- **Real-time feedback** on answers

### Builder Zone
- **Drag-and-drop** 3D building interface
- **Multiple block types** (cube, sphere, cylinder, pyramid)
- **Color customization** with 10 colors
- **Size control** (20-100px)
- **Template system** with pre-built structures

## 📊 Analytics Dashboard

### Overview Metrics
- **Total sessions** and time spent
- **Average session duration**
- **Top activity preferences**
- **Engagement patterns**

### Module Analytics
- **Session counts** per module
- **Time spent** in each activity
- **Interaction rates** and patterns
- **Difficulty progression**

### AI Insights
- **Engagement analysis** based on session data
- **Learning preferences** identification
- **Development tracking** over time
- **Personalized recommendations**

### Recent Activity
- **Session history** with timestamps
- **Activity tags** and metadata
- **Interaction counts** and patterns
- **Completion status**

## 🔧 Technical Implementation

### Data Tracking
```typescript
// Automatic session tracking
const tracker = startTracking('module-name');

// Manual event tracking
trackClick('button', { action: 'click' });
trackDrag('canvas', { position: { x, y } });
trackComplete({ score: 100 });
```

### Storage System
```typescript
// JSON file-based storage
const storage = new JSONStorage();
await storage.saveSession(sessionData);
const sessions = await storage.getSessions();
```

### API Routes
```typescript
// POST /api/tracking - Save session data
// GET /api/dashboard - Retrieve analytics
// POST /api/auth - Authenticate caregiver
// GET /api/feedback - Generate insights
```

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first** approach
- **Tablet and desktop** optimization
- **Touch-friendly** interactions
- **Accessible** design patterns

### Visual Design
- **Gradient backgrounds** for visual appeal
- **Smooth animations** and transitions
- **Consistent color scheme** across modules
- **Modern card-based** layouts

### User Experience
- **Intuitive navigation** between activities
- **Clear instructions** and help text
- **Progress indicators** and feedback
- **Error handling** and recovery

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Self-Hosted
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
```env
CAREGIVER_PIN=1234          # Default caregiver PIN
NODE_ENV=production         # Environment mode
```

## 🔒 Security Features

### Authentication
- **PIN-based access** for caregivers
- **Session cookies** with secure flags
- **HTTP-only cookies** for security
- **Automatic logout** after 24 hours

### Data Protection
- **Local storage** only (no external databases)
- **No personal data** collection
- **Anonymous session** tracking
- **Secure API endpoints**

## 📈 Performance

### Optimization
- **Code splitting** by module
- **Lazy loading** of components
- **Optimized images** and assets
- **Minimal bundle size**

### Monitoring
- **Session tracking** performance
- **API response times**
- **User interaction metrics**
- **Error tracking** and logging

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Component-based** architecture

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first styling
- **Lucide React** for the beautiful icons
- **Neurodiverse community** for inspiration and feedback

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**NeuroBloom MVP** - Empowering learning through interactive technology 🌟