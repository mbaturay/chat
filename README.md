# OpenAI Chat Application

A modern chat application built with React, Vite, and Tailwind CSS that integrates with the OpenAI API. This app features a ChatGPT-like interface with real-time streaming responses.

![Chat Application](/public/app-screenshot.png)

## Features

- 🎨 Modern UI inspired by ChatGPT 4o interface
- ⚡ Streaming responses with real-time typing effect
- 📱 Responsive design for all devices
- 🧩 Multiple model support (GPT-3.5, GPT-4)
- 📝 Markdown and code formatting support
- 🔄 Auto-expanding input field
- 🔍 Suggested prompts for new chats

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Select your preferred model from the sidebar
2. Type your message in the input field at the bottom
3. Press the send button or hit Enter to send your message
4. For new lines in your message, use Shift+Enter
5. Click "New chat" to start a fresh conversation

## Advanced Features

- **Streaming Responses**: See the AI's response as it's being generated
- **Markdown Support**: AI responses render markdown formatting
- **Code Highlighting**: Code blocks are displayed with syntax highlighting
- **Auto-height Input**: The message input field expands as you type
- **Mobile Responsive**: Works on all screen sizes with optimized UI for each

## Technologies Used

- **React 18** - Modern UI library
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI API** - State-of-the-art AI models
- **React Icons** - Popular icon library
- **React Markdown** - Markdown rendering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
