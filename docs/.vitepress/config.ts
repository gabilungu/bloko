import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Bloko',
  description: 'Multi-language CMS with MongoDB',
  base: '/bloko/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Driver', link: '/driver/' },
      { text: 'Database', link: '/database/' },
      { text: 'S3', link: '/s3/' },
      { text: 'Storybook', link: '/storybook/' },
    ],
    sidebar: {
      '/database/': [
        {
          text: 'Database',
          items: [
            { text: 'Overview', link: '/database/' },
            { text: 'Types', link: '/database/types' },
          ],
        },
        {
          text: 'Tables: Core',
          items: [
            { text: 'Collections', link: '/database/collections' },
            { text: 'Languages', link: '/database/languages' },
            { text: 'Node Types', link: '/database/node-types' },
          ],
        },
        {
          text: 'Tables: Templates',
          items: [
            { text: 'Templates', link: '/database/templates' },
            { text: 'Blocks', link: '/database/blocks' },
          ],
        },
        {
          text: 'Tables: Content',
          items: [
            { text: 'Nodes', link: '/database/nodes' },
            { text: 'Contents', link: '/database/contents' },
          ],
        },
        {
          text: 'Tables: Media',
          items: [
            { text: 'Images', link: '/database/images' },
            { text: 'Image Variants', link: '/database/image-variants' },
          ],
        },
        {
          text: 'Tables: Relations',
          items: [
            { text: 'Node Relation Types', link: '/database/node-relation-types' },
            { text: 'Node Relations', link: '/database/node-relations' },
          ],
        },
      ],
      '/driver/': [
        {
          text: 'Driver',
          items: [
            { text: 'Overview', link: '/driver/' },
            { text: 'Types', link: '/driver/types' },
          ],
        },
        {
          text: 'API',
          items: [
            { text: 'Overview', link: '/driver/api/' },
            { text: 'Collections', link: '/driver/api/collections' },
            { text: 'Nodes', link: '/driver/api/nodes' },
          ],
        },
        {
          text: 'CRUD API',
          items: [
            { text: 'Overview', link: '/driver/crud/' },
            { text: 'Collections', link: '/driver/crud/collections' },
            { text: 'Languages', link: '/driver/crud/languages' },
            { text: 'Node Types', link: '/driver/crud/node-types' },
            { text: 'Templates', link: '/driver/crud/templates' },
            { text: 'Blocks', link: '/driver/crud/blocks' },
            { text: 'Nodes', link: '/driver/crud/nodes' },
            { text: 'Contents', link: '/driver/crud/contents' },
            { text: 'Images', link: '/driver/crud/images' },
            { text: 'Image Variants', link: '/driver/crud/image-variants' },
            { text: 'Node Relation Types', link: '/driver/crud/node-relation-types' },
            { text: 'Node Relations', link: '/driver/crud/node-relations' },
          ],
        },
      ],
      '/cli/': [
        {
          text: 'CLI',
          items: [
            { text: 'Overview', link: '/cli/' },
          ],
        },
        {
          text: 'Commands',
          items: [
            { text: 'init', link: '/cli/commands/init' },
            { text: 'reinit', link: '/cli/commands/reinit' },
            { text: 'seed', link: '/cli/commands/seed' },
          ],
        },
        {
          text: 'Seeds',
          items: [
            { text: 'dermatology', link: '/cli/seeds/dermatology' },
            { text: 'glossaries', link: '/cli/seeds/glossaries' },
          ],
        },
      ],
      '/s3/': [
        {
          text: 'S3 Storage',
          items: [
            { text: 'Overview', link: '/s3/' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gabilungu/bloko' },
    ],
  },
});
