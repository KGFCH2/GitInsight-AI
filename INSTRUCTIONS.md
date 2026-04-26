# 📝 Setup Instructions - GitInsight AI

Follow these steps to get the project up and running on your local machine.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (installed with Node.js)

## 🚀 Getting Started

### 1. Clone the Project

```bash
# Navigate to the project directory
cd gitinsight-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your API keys. You can use `.env.example` as a template.

```env
APP_GITHUB_TOKEN=your_github_token
APP_GEMINI_API_KEY=your_gemini_key
APP_GROQ_API_KEY=your_groq_key
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

## 🏗️ Production Build

To create an optimized production bundle:

```bash
npm run build
```

The output will be generated in the `dist/` folder.

## ⚖️ License

This project is licensed under the [MIT License](LICENSE.md).
