# @softwarity/projects

A menu button Web Component with cascading submenus, built from Markdown at build time.

## Installation

```bash
npm install @softwarity/projects
```

## Usage

```html
<script type="module">
  import '@softwarity/projects';
</script>

<softwarity-projects></softwarity-projects>
```

Or via CDN:

```html
<script type="module" src="https://unpkg.com/@softwarity/projects"></script>

<softwarity-projects></softwarity-projects>
```

## Configuration

Create a `PROJECTS.md` file at the root of your project:

```markdown
# Menu Title

## Section 1
- [Link 1](https://example.com/1)
- [Link 2](https://example.com/2)

---

## Section 2
- [Link 3](https://example.com/3)

### Subsection
- [Link 4](https://example.com/4)
```

### Markdown syntax

| Syntax | Description |
|--------|-------------|
| `# Title` | Button label |
| `## Section` | Submenu with cascading content |
| `### Subsection` | Nested submenu inside a section |
| `- [text](url)` | Link item |
| `---` | Separator (between sections or inside subsections) |

## Features

- Cascading submenus on hover
- Auto-detects position and opens left/right accordingly
- Supports `color-scheme: light dark`
- Material Symbols icons (loaded automatically)
- Menu data embedded at build time (no runtime fetch)

## Material Symbols

The component uses these icons from [Material Symbols](https://fonts.google.com/icons):

- `expand_more` - Button dropdown indicator
- `chevron_right` - Submenu indicator
- `open_in_new` - External link indicator

## License

MIT
