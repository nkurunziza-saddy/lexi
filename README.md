# Lexi

A simple, minimal yet supercharged rich text editor built with React and Lexical.

## Features

- 🎨 **Rich Text Editing**: Bold, italic, underline, strikethrough, code, and more
- 📝 **Multiple Block Types**: Paragraphs, headings (H1-H3), lists (bulleted, numbered, checklists), quotes, and code blocks
- 🔗 **Links & Media**: Insert links with URL validation and images
- 📊 **Tables**: Create and edit tables with hover actions
- ✨ **Slash Commands**: Type "/" for quick formatting options
- 🌓 **Dark Mode**: Built-in theme switching
- 📤 **Export Options**: Export as HTML, Markdown, or JSON
- 📥 **Import**: Import Markdown files
- ⌨️ **Keyboard Shortcuts**: Full keyboard navigation support
- ♿ **Accessible**: WCAG compliant with ARIA labels
- 🚀 **Performant**: Optimized with lazy loading and memoization

## Getting Started

### Prerequisites

- Node.js 18+ or later
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/nkurunziza-saddy/lexi.git
cd lexi

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Usage

### Basic Example

```tsx
import { Editor } from "@/components/editor";

function App() {
  const [content, setContent] = useState("");

  return (
    <Editor
      showToolbar
      showFloatingToolbar
      minHeight="400px"
      placeholder='Start writing or use "/" for quick commands'
      onChange={setContent}
    />
  );
}
```

### Configuration Options

| Prop                  | Type                      | Default              | Description                                  |
| --------------------- | ------------------------- | -------------------- | -------------------------------------------- |
| `initialValue`        | `string`                  | `""`                 | Initial editor content (Lexical JSON format) |
| `placeholder`         | `string`                  | `"Start writing..."` | Placeholder text                             |
| `minHeight`           | `string`                  | `"400px"`            | Minimum editor height                        |
| `maxHeight`           | `string`                  | `undefined`          | Maximum editor height                        |
| `showToolbar`         | `boolean`                 | `false`              | Show top toolbar                             |
| `showFloatingToolbar` | `boolean`                 | `true`               | Show floating toolbar on text selection      |
| `readOnly`            | `boolean`                 | `false`              | Enable read-only mode                        |
| `onChange`            | `(value: string) => void` | `undefined`          | Callback when content changes                |
| `onBlur`              | `() => void`              | `undefined`          | Callback when editor loses focus             |
| `onFocus`             | `() => void`              | `undefined`          | Callback when editor gains focus             |

## Editor Features

### Formatting

- **Text Formats**: Bold (`Ctrl+B`), Italic (`Ctrl+I`), Underline (`Ctrl+U`), Strikethrough (`Ctrl+Shift+X`), Code (`Ctrl+E`)
- **Subscript/Superscript**: Script formatting support
- **Colors**: Text color and highlight color pickers
- **Alignment**: Left, center, right, justify

### Block Types

- **Headings**: H1, H2, H3
- **Lists**: Bulleted, numbered, and checklists with nested support
- **Quote Blocks**: Styled blockquotes
- **Code Blocks**: Syntax-highlighted code blocks
- **Horizontal Rules**: Insert dividers

### Advanced Features

- **Slash Commands**: Type "/" followed by a keyword to quickly insert block types
- **Markdown Shortcuts**: Use markdown syntax for quick formatting
- **Table Management**: Insert, edit, merge cells, and resize tables
- **Link Management**: Insert and edit links with URL validation
- **Image Support**: Insert images by URL
- **History**: Undo/redo with history size limits (max 100 states)

### Export/Import

- **Export to HTML**: Get clean HTML output
- **Export to Markdown**: Convert to markdown format
- **Export to JSON**: Save editor state in Lexical's native format
- **Import Markdown**: Load markdown files into the editor

## Keyboard Shortcuts

| Action         | Shortcut                       |
| -------------- | ------------------------------ |
| Bold           | `Ctrl+B` / `Cmd+B`             |
| Italic         | `Ctrl+I` / `Cmd+I`             |
| Underline      | `Ctrl+U` / `Cmd+U`             |
| Strikethrough  | `Ctrl+Shift+X`                 |
| Code           | `Ctrl+E` / `Cmd+E`             |
| Undo           | `Ctrl+Z` / `Cmd+Z`             |
| Redo           | `Ctrl+Shift+Z` / `Cmd+Shift+Z` |
| Insert Link    | `Ctrl+K` / `Cmd+K`             |
| Slash Commands | Type `/`                       |

## Project Structure

```
src/
├── app.tsx                    # Main app component
├── components/
│   ├── editor/               # Editor implementation
│   │   ├── components/       # Editor components (dialogs, etc.)
│   │   ├── lib/             # Editor utilities and config
│   │   │   ├── nodes/       # Custom nodes (e.g., images)
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── utils/       # Export/import utilities
│   │   │   └── colors.ts    # Color definitions
│   │   └── plugins/         # Editor plugins
│   │       ├── toolbar/     # Top toolbar
│   │       ├── floating-toolbar/  # Floating selection toolbar
│   │       └── slash-command/     # Slash commands
│   └── ui/                  # Reusable UI components
```

## Tech Stack

- **React 19**: UI library
- **Lexical**: Text editor framework by Meta
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS v4**: Styling
- **shadcn/ui**: UI components
- **Radix UI**: Accessible primitives
- **next-themes**: Theme management
- **lucide-react**: Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © 2025 Nkurunziza Saddy

## Acknowledgments

- Built with [Lexical](https://lexical.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
