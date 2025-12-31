# BitMap Visualizer

An interactive bit field calculator and analyzer designed to help developers visualize, manipulate, and define custom bit fields within a data structure.

![BitMap Visualizer](https://bitmap-visualizer.pages.dev/)

## Features

- **Interactive Bit Grid**: Double-click bits to toggle them and see real-time updates.
- **Custom Field Configuration**: Define named bit fields with start and end positions.
- **Real-time Value Sync**: Supports Hex, Decimal, and Binary input/output.
- **64-bit Support**: Handles up to 64-bit unsigned integers.
- **Shareable Configurations**: Easily share your bit field setups via URL parameters.
- **Responsive Design**: Built with React and Tailwind CSS for a modern, dark-themed UI.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) or `npm`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bitmap-visualizer
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Building for Production

To build the project for production, run:

```bash
pnpm build
# or
npm run build
```

The output will be in the `dist` directory, ready to be deployed to any static site hosting service.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Wrangler (Cloudflare Pages)