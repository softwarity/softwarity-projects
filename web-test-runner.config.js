import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import fs from 'fs';
import path from 'path';

const isCI = process.env.CI === 'true';

/**
 * Plugin to handle CSS ?inline imports from Vite
 */
function inlineCssPlugin() {
  return {
    name: 'inline-css',
    resolveMimeType(context) {
      if (context.path.includes('.css')) {
        return 'js';
      }
    },
    async serve(context) {
      if (context.path.includes('.css')) {
        const cleanPath = context.path.split('?')[0];
        const filePath = path.join(process.cwd(),
          cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath);
        try {
          const cssContent = fs.readFileSync(filePath, 'utf-8');
          const escaped = cssContent
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$');
          return { body: `export default \`${escaped}\`;`, type: 'js' };
        } catch (e) {
          console.error('Failed to load CSS:', filePath, e.message);
        }
      }
    },
  };
}

/**
 * Plugin to handle virtual:menu-data module
 */
function virtualMenuDataPlugin() {
  return {
    name: 'virtual-menu-data',
    resolveMimeType(context) {
      if (context.path.includes('virtual:menu-data')) {
        return 'js';
      }
    },
    async serve(context) {
      if (context.path.includes('virtual:menu-data')) {
        // Provide mock data for tests
        const mockData = {
          title: 'Test Menu',
          sections: [
            {
              title: 'Section 1',
              items: [
                { type: 'link', text: 'Link 1', url: 'https://example.com/1' },
                { type: 'link', text: 'Link 2', url: 'https://example.com/2' }
              ],
              subSections: []
            },
            { type: 'separator' },
            {
              title: 'Section 2',
              items: [],
              subSections: [
                {
                  title: 'SubSection 1',
                  items: [
                    { type: 'link', text: 'SubLink 1', url: 'https://example.com/sub1' }
                  ]
                }
              ]
            }
          ]
        };
        return {
          body: `export const menuData = ${JSON.stringify(mockData)};`,
          type: 'js'
        };
      }
    },
    resolveImport({ source }) {
      if (source === 'virtual:menu-data') {
        return '/virtual:menu-data';
      }
    }
  };
}

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  plugins: [
    virtualMenuDataPlugin(),
    inlineCssPlugin(),
    esbuildPlugin({
      ts: true,
      target: 'es2020',
      define: {
        __VERSION__: '"1.0.0-test"'
      }
    }),
  ],
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
  ],
  testFramework: {
    config: {
      timeout: 5000,
    },
  },
  coverage: isCI,
  coverageConfig: {
    reportDir: 'coverage',
    reporters: ['html', 'lcov', 'text-summary'],
    include: ['src/**/*.ts'],
    threshold: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
  },
};
