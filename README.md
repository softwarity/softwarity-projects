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
- Material Symbols icons, drawn inline as SVG (no font to load)
- Menu data embedded at build time (no runtime fetch)

## Icons

The component draws five [Material Symbols](https://fonts.google.com/icons)
(Outlined, weight 400) as inline SVG:

- `expand_more` - Button dropdown indicator
- `chevron_right` - Submenu indicator (turned over when the menu opens left)
- `open_in_new` - External link indicator
- `favorite` - Sponsor link

It loads no font and adds nothing to the page. Versions up to 1.0.33 added a
Google Fonts stylesheet for these icons: the whole variable font, 4 MB, which
also replaced the page's own Material Symbols font when it had one.

## License

MIT
