# AI Party Game

A fun, web-based party game for up to 8 players featuring AI-generated images. Players receive prompts and respond by entering creative text prompts for an AI image generator to create funny cartoon-style scenes. Other players vote on their favorites, with points awarded based on votes.

## Features

- **Real-time Multiplayer**: Play with up to 8 players simultaneously
- **AI Image Generation**: Create funny cartoon-style scenes using AI
- **Voting System**: Vote on your favorite images and earn points
- **Multiple Rounds**: Play through 3 rounds with 4 prompts per round
- **Responsive Design**: Works on desktop and mobile devices
- **User Authentication**: Simple login system using Clerk

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes, Socket.IO for real-time communication
- **Authentication**: Clerk
- **State Management**: Zustand
- **Database**: Cloudflare D1 (via Next.js Cloudflare integration)
- **AI Image Generation**: Replicate API (with fallback to preset GIFs)

## Getting Started

### Prerequisites

- Node.js 16+ and npm/pnpm
- Clerk account for authentication
- Replicate API key for image generation

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-party-game.git
cd ai-party-game
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

4. Run the development server
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## How to Play

1. **Create or Join a Game**
   - The host creates a new game and receives a unique join code
   - Other players use this code to join the game
   - The game supports 2-8 players

2. **Game Flow**
   - Each round, players receive 1 of 4 prompts (2 players per prompt)
   - Players respond by entering a creative text prompt for the AI image generator
   - Each prompt is shown with both generated images, and other players vote on their favorite
   - Votes award 100 points (or 1000 if unanimous)
   - After all 4 prompts, scores are shown
   - The game runs for 3 rounds total

3. **Winning the Game**
   - The player with the highest score after 3 rounds wins
   - Final scores are displayed at the end of the game

## Project Structure

```
ai-party-game/
├── migrations/           # Database migration files
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── game/         # Game-related pages
│   │   ├── profile/      # User profile page
│   │   ├── sign-in/      # Authentication pages
│   │   └── sign-up/      # Authentication pages
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions and state management
│       ├── gameStore.ts  # Game state management
│       ├── schema.ts     # Database schema
│       └── socketClient.ts # Socket.IO client
└── .env.local            # Environment variables
```

## Deployment

The application is currently deployed and accessible at:
[https://3000-i3wj3mcw9ghrmeudz9xxr-af56deff.manus.computer](https://3000-i3wj3mcw9ghrmeudz9xxr-af56deff.manus.computer)

For production deployment, you would need to:

1. Set up proper environment variables with real API keys
2. Deploy to a platform like Vercel, Netlify, or Cloudflare Pages
3. Set up a production database if needed

## Customization Options

- **Prompts**: Edit the sample prompts in `src/lib/gameStore.ts`
- **Styling**: Modify Tailwind CSS classes or update the theme in `tailwind.config.js`
- **Game Rules**: Adjust round counts, prompt counts, or scoring in `src/lib/gameStore.ts`
- **AI Model**: Change the AI image generation model in `src/app/api/generate-image/route.ts`

## Future Enhancements

- Add spectator mode for non-players to watch games
- Implement custom prompt creation for game hosts
- Add more animation and sound effects
- Create a gallery of past games and best images
- Implement additional game modes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Socket.IO](https://socket.io/) for real-time communication
- [Clerk](https://clerk.dev/) for authentication
- [Replicate](https://replicate.com/) for AI image generation
