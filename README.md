# Focus Now - Chrome Extension (React + TypeScript + Vite)

A Chrome extension that helps you stay focused by blocking distracting websites during scheduled time periods. Built with React, TypeScript, and Vite.

## Ideas

## Features

- 🚫 Block access to specific websites
- 📅 Schedule blocking with a calendar date picker
- ⏰ Choose all-day blocking or specific time ranges
- 📋 Manage multiple schedules
- ⚛️ Modern React UI with TypeScript
- ⚡ Fast development with Vite
- 🎨 Clean, modern interface

## Project Structure

```
focus-now-extension/
├── src/
│   ├── background/
│   │   └── background.ts          # Service worker (blocking logic)
│   ├── popup/
│   │   ├── components/
│   │   │   ├── WebsiteList.tsx    # Website management component
│   │   │   ├── ScheduleForm.tsx   # Schedule creation form
│   │   │   └── ScheduleList.tsx   # Active schedules display
│   │   ├── App.tsx                # Main popup component
│   │   ├── App.css                # Popup styles
│   │   ├── index.html             # Popup HTML entry
│   │   └── main.tsx               # React entry point
│   ├── blocked/
│   │   └── blocked.html           # Blocked page display
│   └── types.ts                   # TypeScript type definitions
├── public/
│   ├── manifest.json              # Chrome extension manifest
│   └── icons/                     # Extension icons
├── dist/                          # Build output (gitignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Setup & Development

### Install Dependencies

```powershell
npm install
```

### Build the Extension

**Development build (with watch mode):**

```powershell
npm run dev
```

**Production build:**

```powershell
npm run build
```

The extension will be built to the `dist/` folder.

### Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder
5. The extension should now appear in your toolbar

### Development Workflow

1. Run `npm run dev` to start the build watcher
2. Make changes to the source files
3. Vite will automatically rebuild
4. Go to `chrome://extensions/` and click the refresh icon on your extension
5. Test your changes

## How to Use

### Add Websites to Block

1. Click the extension icon
2. Enter a website domain (e.g., `youtube.com`, `twitter.com`)
3. Click "Add"

### Create a Schedule

1. Select a date from the calendar
2. Toggle "Block All Day" for 24-hour blocking, or
3. Set specific start and end times
4. Click "Save Schedule"

### Manage Schedules

- View all active schedules in the "Active Schedules" section
- Delete schedules when you no longer need them
- Past schedules are automatically cleaned up daily

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chrome Extension APIs** - Extension functionality
  - `declarativeNetRequest` - Website blocking
  - `storage.sync` - Data persistence
  - `alarms` - Schedule checking

## Type Safety

The project uses TypeScript throughout:

- `@types/chrome` for Chrome API types
- Custom interfaces for schedules and storage
- Type-safe storage utilities in `types.ts`

## Building for Production

```powershell
npm run build
```

The `dist/` folder contains:

- `manifest.json` - Extension manifest
- `popup.html` - Popup UI
- `blocked.html` - Blocked page
- `background.js` - Service worker
- `icons/` - Extension icons
- `assets/` - Compiled React app

## License

Free to use and modify for personal use.
