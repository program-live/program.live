# program.live

A Next.js application with Convex backend for real-time functionality.

## Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)
- A Convex account (sign up at [convex.dev](https://convex.dev))

## Local Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Convex Setup

This project uses Convex for the backend database and real-time functionality. Follow these steps to set up Convex locally:

#### Install Convex CLI (if not already installed globally)

```bash
npm install -g convex
```

#### Login to Convex

```bash
npx convex login
```

This will open your browser to authenticate with Convex.

#### Initialize Convex Project

If this is your first time setting up the project, you'll need to create a new Convex deployment:

```bash
npx convex init
```

Follow the prompts to:
- Create a new project or select an existing one
- Choose a deployment name (e.g., `program-dev` for development)

#### Set Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the CONVEX_URL from your Convex dashboard
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud
```

You can find your Convex URL in:
1. Your Convex dashboard at [dashboard.convex.dev](https://dashboard.convex.dev)
2. After running `npx convex init`, it will be displayed in the terminal
3. In the `convex.json` file that gets created

### 3. Deploy Schema and Functions

Deploy your schema and functions to Convex:

```bash
npx convex deploy
```

This will:
- Deploy the database schema (from `convex/schema.ts`)
- Deploy all functions (from `convex/*.ts`)
- Set up the database tables

### 4. Start Development Server

Run both Next.js and Convex in development mode:

```bash
pnpm dev
```

This command runs both servers in parallel:
- Next.js development server on `http://localhost:3000`
- Convex development server for hot-reloading functions

**Note**: If you encounter issues with the combined command, you can run them separately:

```bash
# Run frontend only
pnpm dev:frontend

# Run backend only  
pnpm dev:backend

# Or in separate terminals
npx convex dev    # Terminal 1
next dev          # Terminal 2
```

### 5. Verify Setup

Once you see "Convex functions are ready" in your terminal, verify your setup by visiting the [Convex Dashboard](https://dashboard.convex.dev/t/program). You should see your development deployment listed and be able to explore your database schema and functions.

## Project Structure

### Convex Backend

- `convex/schema.ts` - Database schema definitions
- `convex/streamStatus.ts` - Functions for managing stream status
- `convex/_generated/` - Auto-generated Convex files (do not edit)

### Frontend Integration

- `app/ConvexClientProvider.tsx` - Convex React client provider
- Components use Convex hooks like `useQuery` and `useMutation`

## Available Convex Functions

The project includes these Convex functions:

- `getCurrentStatus` - Query to get the current stream status
- `getStatusHistory` - Query to get stream status history  
- `updateStatus` - Mutation to update stream status (live/offline)

## Development Workflow

1. **Making Schema Changes**: Edit `convex/schema.ts` and run `npx convex deploy`
2. **Adding Functions**: Create new `.ts` files in `convex/` directory
3. **Using Functions**: Import and use with Convex React hooks in your components
4. **Viewing Data**: Use the Convex dashboard to inspect your data

## Troubleshooting

### Common Issues

**"ConvexError: Unauthenticated"**
- Run `npx convex login` to authenticate
- Check that your `NEXT_PUBLIC_CONVEX_URL` is correct

**Functions not updating**
- Ensure `npx convex dev` is running
- Check the terminal for any deployment errors

**Database changes not applied**
- Run `npx convex deploy` to apply schema changes
- Check that your schema syntax is correct

### Useful Commands

```bash
# Deploy functions and schema
npx convex deploy

# Start Convex development server
npx convex dev  

# View Convex dashboard
npx convex dashboard

# Reset development deployment (⚠️ deletes all data)
npx convex init --reset
```

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex Next.js Guide](https://docs.convex.dev/quickstart/nextjs)
- [Project Dashboard](https://dashboard.convex.dev/t/program) - Your specific Convex project dashboard
- [Convex Dashboard](https://dashboard.convex.dev) - General Convex dashboard
