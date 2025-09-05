
# birdlogyc - Sales Visit Manager

## 🚀 Quick Start

### Prerequisites
- **Node.js 18.x** (specified in `.nvmrc`)
- Yarn package manager

### Development Setup
```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

### Deployment

#### For Netlify:
1. Set `NODE_VERSION=18` in build environment settings
2. Use build command: `yarn build:netlify`
3. Publish directory: `out`

#### For Vercel:
1. Build command: `yarn build`
2. Node.js version will be automatically detected from `.nvmrc`

#### For Other Platforms:
- Ensure Node.js 18.x is used
- The `.nvmrc` file specifies the required version
- Build command: `yarn build`

### Environment Variables
- `NEXT_PUBLIC_APP_MODE=demo` - Enables demo mode with mock data
- `DISABLE_DATABASE=true` - Disables database connections
- `NEXTAUTH_SECRET` - Required for authentication

### Demo Users
- **Pierre Martin** - pierre@birdlogyc.com (Manager)
- **Sarah Johnson** - manager@birdlogyc.com (Manager)  
- **Marie Dubois** - marie@birdlogyc.com (Sales Rep)

### Architecture
- Next.js 14.2.28
- TypeScript
- Tailwind CSS
- Mock data system (no database required)
- Client-side authentication for demo mode
