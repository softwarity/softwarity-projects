import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { minifyHTMLLiterals } from 'minify-literals';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const banner = `/**
 * @license MIT
 * @name ${pkg.name}
 * @version ${pkg.version}
 * @author Softwarity (https://www.softwarity.io/)
 * @copyright ${new Date().getFullYear()} Softwarity
 * @see https://github.com/softwarity/projects
 */`;

/**
 * Parse PROJECTS.md and generate menu data
 */
function parseProjectsMarkdown() {
  const mdPath = resolve(__dirname, 'PROJECTS.md');
  let content;
  try {
    content = readFileSync(mdPath, 'utf-8');
  } catch {
    // Default content if file doesn't exist
    content = `# Projects\n\n## Links\n- [GitHub](https://github.com/softwarity)`;
  }

  const lines = content.split('\n');
  let title = 'Menu';
  const sections = [];
  let currentSection = null;
  let currentSubSection = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Title H1
    if (trimmed.startsWith('# ')) {
      title = trimmed.slice(2).trim();
      continue;
    }

    // Section H2
    if (trimmed.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmed.slice(3).trim(),
        items: [],
        subSections: []
      };
      currentSubSection = null;
      continue;
    }

    // SubSection H3
    if (trimmed.startsWith('### ')) {
      if (currentSection) {
        currentSubSection = {
          title: trimmed.slice(4).trim(),
          items: []
        };
        currentSection.subSections.push(currentSubSection);
      }
      continue;
    }

    // Separator
    if (trimmed === '---') {
      if (currentSubSection) {
        // Inside a subsection: add separator to subsection items
        currentSubSection.items.push({ type: 'separator' });
      } else if (currentSection) {
        // Inside a section but not subsection: close section and add root separator
        sections.push(currentSection);
        currentSection = null;
        sections.push({ type: 'separator' });
      }
      // Separators at root level (no current section) are ignored
      continue;
    }

    // Link: - [text](url) or * [text](url)
    const linkMatch = trimmed.match(/^[-*]\s*\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const item = {
        type: 'link',
        text: linkMatch[1],
        url: linkMatch[2]
      };
      if (currentSubSection) {
        currentSubSection.items.push(item);
      } else if (currentSection) {
        currentSection.items.push(item);
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { title, sections };
}

/**
 * Plugin to inject parsed markdown data at build time
 */
function markdownMenuPlugin() {
  const virtualModuleId = 'virtual:menu-data';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'markdown-menu',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const data = parseProjectsMarkdown();
        return `export const menuData = ${JSON.stringify(data)};`;
      }
    }
  };
}

/**
 * Plugin to minify template literals
 */
function minifyLiteralsPlugin() {
  return {
    name: 'minify-literals',
    async transform(code, id) {
      if ((id.endsWith('.js') || id.endsWith('.ts')) && code.includes('`')) {
        try {
          const result = await minifyHTMLLiterals(code, { fileName: id });
          return result ? { code: result.code, map: result.map } : null;
        } catch {
          return null;
        }
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [markdownMenuPlugin(), minifyLiteralsPlugin()],
  define: {
    __VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/softwarity-projects.ts'),
      name: 'SoftwarityProjects',
      fileName: 'softwarity-projects',
      formats: ['es']
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 3
      },
      mangle: {
        toplevel: true
      },
      format: {
        comments: false,
        preamble: banner
      }
    },
    rollupOptions: {
      output: {
        assetFileNames: 'softwarity-projects.[ext]'
      }
    }
  },
  server: {
    open: '/demo/index.html'
  }
});
