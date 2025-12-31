# BitMap Visualizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg)](https://vitejs.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020.svg)](https://bitmap-visualizer.pages.dev/)

**BitMap Visualizer** is a powerful, interactive **bit field calculator** and **binary data analyzer**. It is specifically designed for embedded engineers, systems programmers, and developers to visualize, manipulate, and define custom bit fields within 64-bit data structures.

🔗 **Official Site**: [https://bitmap-visualizer.pages.dev/](https://bitmap-visualizer.pages.dev/)

## Key Features

- 🖱️ **Interactive Bit Manipulation**: Toggle individual bits with a click and see immediate results in Hex, Decimal, and Binary.
- 🛠️ **Custom Bit Field Definition**: Define named fields with specific bit ranges (e.g., `Control Register [0:3]`, `Status [4:7]`).
- 🔄 **Real-time Multi-format Sync**: Bidirectional synchronization between binary grid, hex input, and decimal values.
- 🚀 **64-bit Architecture Support**: Full support for 64-bit unsigned integers (unsigned long long), essential for modern hardware registers.
- 🔗 **Shareable States**: Encode your field configurations directly into the URL for easy sharing and documentation.
- 🎨 **Modern Developer UI**: A clean, responsive, dark-mode interface built with React 19 and Tailwind CSS.

## Use Cases

- **Embedded Systems**: Mapping CPU registers and peripheral control bits.
- **Network Protocols**: Visualizing packet headers and flag structures.
- **Data Serialization**: Debugging custom binary formats and bit-packed structures.
- **Education**: Learning binary arithmetic and bitwise operations.

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