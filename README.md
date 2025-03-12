# AI-Powered Scholarship Finder

## Project Overview
The AI-Powered Scholarship Finder is a full-stack web application designed to assist students in discovering, filtering, and tracking scholarships tailored to their personal, academic, and financial profiles. By leveraging an AI-based recommendation engine, the platform provides personalized scholarship suggestions, enhancing students' chances of securing financial aid for their educational pursuits.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Deployed Application](#deployed-application)

## Features
- **User Authentication:** Secure user registration and login system.
- **Profile Management:** Users can input and update their academic and personal information.
- **Scholarship Database:** Comprehensive collection of scholarships with detailed information.
- **AI-Based Recommendations:** Personalized scholarship suggestions based on user profiles.
- **Search & Filter:** Advanced search and filtering options to find relevant scholarships.
- **Favorites & Tracking:** Save scholarships and monitor application statuses.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Tech Stack
- **Frontend:**
  - [React.js](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Vite](https://vitejs.dev/)
- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [Supabase](https://supabase.io/) (as the database and authentication provider)
- **AI Recommendation Engine:**
  - Custom-built algorithm or integration with external AI services.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ai-scholarship-finder.git
   cd ai-scholarship-finder
   ```

2. **Install Dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Replace `your_supabase_url` and `your_supabase_anon_key` with your Supabase project's credentials.

### Running the Application

1. **Start the Development Server:**
   Using npm:
   ```bash
   npm run dev
   ```
   Or using yarn:
   ```bash
   yarn dev
   ```
   The application will be accessible at `http://localhost:5173`.

2. **Build for Production:**
   Using npm:
   ```bash
   npm run build
   ```
   Or using yarn:
   ```bash
   yarn build
   ```
   The production-ready files will be in the `dist` directory.

## Project Structure
```plaintext
public
  placeholder.svg
src
  components
  context
  data
  hooks
  lib
  pages
  types
  utils
  App.css
  App.tsx
  index.css
  main.tsx
.gitignore
components.json
eslint.config.js
index.html
package.json
postcss.config.js
README.md
tailwind.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements
- [Supabase](https://supabase.io/) for backend services.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Vite](https://vitejs.dev/) for the build tool.

## Deployed Application
- **Live URL:** [Scholarship Buddy Finder](https://scholarship-buddy-finder.lovable.app)
