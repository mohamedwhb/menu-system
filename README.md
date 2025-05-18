# Menu System

A modern, interactive menu management system built with Next.js 15, React 19, and TypeScript. This application provides a comprehensive solution for managing restaurant menus, floor plans, and table layouts.

## Features

- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design for all devices
- 🏗️ Interactive floor plan editor
- 🪑 Table management system
- 📊 Real-time status updates
- 🔄 Dynamic menu updates
- 🎯 Type-safe development with TypeScript

## Tech Stack

- **Framework:** Next.js 15.2.4
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Type Safety:** TypeScript
- **State Management:** React Hooks
- **UI Components:** Custom components with Radix UI
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Form Handling:** React Hook Form
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone [your-repository-url]
   cd menu-system
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
menu-system/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   └── ...               # Other app routes
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/              # Reusable UI components
├── data/                 # Mock data and types
├── lib/                  # Utility functions
└── public/              # Static assets
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Follow the component structure guidelines

## Deployment

The application is configured for deployment on Netlify. The build process is automated through Netlify's CI/CD pipeline.

### Build Configuration

- Build Command: `pnpm run build`
- Publish Directory: `.next`
- Node Version: Latest LTS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
