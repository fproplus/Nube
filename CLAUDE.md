# Nube — Claude Code Instructions

## Project Overview
Nube is a bilingual (DE/EN) whole food nutrition 
tracking web app built with React + Vite.
Live at nubetracker.com, deployed via Vercel.
Single-file architecture: all app code is in Code/src/App.jsx

## Tech Stack
- React + Vite
- Supabase (authentication + user data sync)
- localStorage (guest user fallback)
- Vercel (hosting, auto-deploy on git push)
- No Tailwind — inline styles only throughout

## File Structure
- Code/src/App.jsx — entire app (single file, very long)
- Code/public/ — static assets (logopng.png, favicon.png)
- Code/public/coming-soon.html — coming soon page
- Code/index.html — HTML entry point
- Code/src/main.jsx — React entry point
- Code/src/index.css — global styles

## Code Style Rules
- ALWAYS use inline styles (style={{...}}) never Tailwind
- All interactive elements minimum 44px height
- Always maintain full DE/EN bilingual support in T object
- Never break existing functionality
- Always test both guest and logged-in user flows
- Use existing color variables, never introduce new ones

## Design System
Background: #030712 (main), #0f172a (cards), #111827 (elevated)
Borders: #1f2937 (subtle), #374151 (visible)
Text: #f9fafb (primary), #d1d5db (secondary), #6b7280 (muted)
Green: #22c55e (primary action, success)
Amber: #f59e0b (synergies, warnings)
Blue: #3b82f6 (minerals, info)
Purple: #8b5cf6 (benefits, premium)
Red: #ef4444 (danger, remove)

## UX Principles
- Mobile-first, max-width 520px centered container
- Dark theme always — never introduce light elements
- Border-radius: 99px (pills), 16px (cards), 24px (large cards)
- Consistent 16px horizontal padding
- Smooth animations: fadeSlideIn, scale pops on food tags
- Safe-area insets for iPhone: env(safe-area-inset-bottom)
- Hover states on all clickable elements
- Loading states for all async operations

## Architecture Rules
- App has two modes: guest (localStorage) and user (Supabase)
- isPremium flag controls feature access
- lang state controls DE/EN throughout
- All modals use bottom-sheet pattern with swipe-to-close
- Storage keys: wft-hist4, wft-today4, wft-ms2, nube-preferences

## Supabase Database
Table: user_data
Columns: user_id, foods_today, history, milestones, 
         date, preferences
Always use Row Level Security (RLS)
Never expose service_role key in frontend code
Use VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars

## UX Improvement Guidelines
When making any UI changes apply these automatically:
- Cards should have subtle border + background contrast
- Empty states: friendly emoji + helpful text
- Error states: clear red styling with actionable message
- Success states: green confirmation with auto-dismiss
- All modals: drag handle at top, swipe down to close
- Buttons: clear hover + active states
- Font weights: 900 headlines, 700 buttons, 600 labels

## Deployment
- Push to GitHub main branch → Vercel auto-deploys
- Always run: git add . && git commit -m "description" && git push
- Never commit sensitive keys or passwords
- Vercel environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Important Rules — Never Break These
1. NEVER remove existing features or translations
2. ALWAYS keep both DE and EN in T object
3. ALWAYS ensure guest mode works without login
4. NEVER expose API keys in code
5. ALWAYS maintain the isPremium gating logic
6. NEVER change storage key names (breaks existing user data)
7. ALWAYS test that Supabase sync still works after changes
