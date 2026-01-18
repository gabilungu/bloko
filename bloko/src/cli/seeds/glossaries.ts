import type { Preset } from './types.js';

const preset: Preset = {
  name: 'Glossaries',
  description: 'Multi-language glossary template with terms and definitions',
  languages: [
    { id: 'en', title: 'English', sort: 1 },
    { id: 'es', title: 'Spanish', sort: 2 },
    { id: 'fr', title: 'French', sort: 3 },
  ],
  nodeTypes: [
    { code: 'glossary', title: { en: 'Glossary', es: 'Glosario', fr: 'Glossaire' }, sort: 1, notes: null },
    { code: 'section', title: { en: 'Section', es: 'Sección', fr: 'Section' }, sort: 2, notes: null },
    { code: 'term', title: { en: 'Term', es: 'Término', fr: 'Terme' }, sort: 3, notes: null },
  ],
  collections: [
    {
      collection: { code: 'glossaries', sort: null, notes: 'Multi-language glossary collection' },
      templates: [
        {
          template: {
            code: 'glossary',
            title: { en: 'Glossary', es: 'Glosario', fr: 'Glossaire' },
            sort: 1,
            notes: null,
          },
          blocks: [
            {
              block: {
                code: 'introduction',
                title: { en: 'Introduction', es: 'Introducción', fr: 'Introduction' },
                content_type: 'text',
                sort: 1,
                notes: null,
              },
            },
          ],
        },
        {
          template: {
            code: 'section',
            title: { en: 'Section', es: 'Sección', fr: 'Section' },
            sort: 2,
            notes: null,
          },
          blocks: [
            {
              block: {
                code: 'description',
                title: { en: 'Description', es: 'Descripción', fr: 'Description' },
                content_type: 'text',
                sort: 1,
                notes: null,
              },
            },
          ],
        },
        {
          template: {
            code: 'term',
            title: { en: 'Term', es: 'Término', fr: 'Terme' },
            sort: 3,
            notes: null,
          },
          blocks: [
            {
              block: {
                code: 'definition',
                title: { en: 'Definition', es: 'Definición', fr: 'Définition' },
                content_type: 'text',
                sort: 1,
                notes: null,
              },
            },
            {
              block: {
                code: 'examples',
                title: { en: 'Examples', es: 'Ejemplos', fr: 'Exemples' },
                content_type: 'text_list',
                sort: 2,
                notes: null,
              },
            },
            {
              block: {
                code: 'notes',
                title: { en: 'Notes', es: 'Notas', fr: 'Notes' },
                content_type: 'text',
                sort: 3,
                notes: null,
              },
            },
          ],
        },
      ],
      nodes: [
        {
          node: {
            code: 'tech-glossary',
            title: { en: 'Technology Glossary', es: 'Glosario Tecnológico', fr: 'Glossaire Technologique' },
            subtitle: { en: 'Common tech terms explained', es: 'Términos tecnológicos comunes explicados', fr: 'Termes technologiques courants expliqués' },
            slug: { en: 'tech-glossary', es: 'glosario-tecnologico', fr: 'glossaire-technologique' },
            sort: 1,
            sort_children_by: 'title',
            _cover_image: null,
            _images: null,
            notes: null,
            templateCode: 'glossary',
            nodeTypeCode: 'glossary',
          },
          contents: [
            {
              blockCode: 'introduction',
              value: {
                en: 'A comprehensive glossary of technology terms for beginners and professionals.',
                es: 'Un glosario completo de términos tecnológicos para principiantes y profesionales.',
                fr: 'Un glossaire complet des termes technologiques pour débutants et professionnels.',
              },
            },
          ],
          children: [
            {
              node: {
                code: 'programming',
                title: { en: 'Programming', es: 'Programación', fr: 'Programmation' },
                subtitle: null,
                slug: { en: 'programming', es: 'programacion', fr: 'programmation' },
                sort: 1,
                sort_children_by: 'title',
                _cover_image: null,
                _images: null,
                notes: null,
                templateCode: 'section',
                nodeTypeCode: 'section',
              },
              contents: [
                {
                  blockCode: 'description',
                  value: {
                    en: 'Terms related to software development and programming languages.',
                    es: 'Términos relacionados con el desarrollo de software y lenguajes de programación.',
                    fr: 'Termes liés au développement logiciel et aux langages de programmation.',
                  },
                },
              ],
              children: [
                {
                  node: {
                    code: 'api',
                    title: { en: 'API', es: 'API', fr: 'API' },
                    subtitle: { en: 'Application Programming Interface', es: 'Interfaz de Programación de Aplicaciones', fr: 'Interface de Programmation Applicative' },
                    slug: { en: 'api', es: 'api', fr: 'api' },
                    sort: 1,
                    sort_children_by: null,
                    _cover_image: null,
                    _images: null,
                    notes: null,
                    templateCode: 'term',
                    nodeTypeCode: 'term',
                  },
                  contents: [
                    {
                      blockCode: 'definition',
                      value: {
                        en: 'A set of protocols and tools that allows different software applications to communicate with each other.',
                        es: 'Un conjunto de protocolos y herramientas que permite que diferentes aplicaciones de software se comuniquen entre sí.',
                        fr: 'Un ensemble de protocoles et d\'outils permettant à différentes applications logicielles de communiquer entre elles.',
                      },
                    },
                    {
                      blockCode: 'examples',
                      value: [
                        { en: 'REST API', es: 'API REST', fr: 'API REST' },
                        { en: 'GraphQL API', es: 'API GraphQL', fr: 'API GraphQL' },
                      ],
                    },
                  ],
                },
                {
                  node: {
                    code: 'crud',
                    title: { en: 'CRUD', es: 'CRUD', fr: 'CRUD' },
                    subtitle: { en: 'Create, Read, Update, Delete', es: 'Crear, Leer, Actualizar, Eliminar', fr: 'Créer, Lire, Mettre à jour, Supprimer' },
                    slug: { en: 'crud', es: 'crud', fr: 'crud' },
                    sort: 2,
                    sort_children_by: null,
                    _cover_image: null,
                    _images: null,
                    notes: null,
                    templateCode: 'term',
                    nodeTypeCode: 'term',
                  },
                  contents: [
                    {
                      blockCode: 'definition',
                      value: {
                        en: 'The four basic operations for managing data in a database or storage system.',
                        es: 'Las cuatro operaciones básicas para gestionar datos en una base de datos o sistema de almacenamiento.',
                        fr: 'Les quatre opérations de base pour gérer les données dans une base de données ou un système de stockage.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              node: {
                code: 'databases',
                title: { en: 'Databases', es: 'Bases de Datos', fr: 'Bases de Données' },
                subtitle: null,
                slug: { en: 'databases', es: 'bases-de-datos', fr: 'bases-de-donnees' },
                sort: 2,
                sort_children_by: 'title',
                _cover_image: null,
                _images: null,
                notes: null,
                templateCode: 'section',
                nodeTypeCode: 'section',
              },
              contents: [
                {
                  blockCode: 'description',
                  value: {
                    en: 'Terms related to data storage and database management.',
                    es: 'Términos relacionados con almacenamiento de datos y gestión de bases de datos.',
                    fr: 'Termes liés au stockage de données et à la gestion des bases de données.',
                  },
                },
              ],
              children: [
                {
                  node: {
                    code: 'sql',
                    title: { en: 'SQL', es: 'SQL', fr: 'SQL' },
                    subtitle: { en: 'Structured Query Language', es: 'Lenguaje de Consulta Estructurado', fr: 'Langage de Requête Structuré' },
                    slug: { en: 'sql', es: 'sql', fr: 'sql' },
                    sort: 1,
                    sort_children_by: null,
                    _cover_image: null,
                    _images: null,
                    notes: null,
                    templateCode: 'term',
                    nodeTypeCode: 'term',
                  },
                  contents: [
                    {
                      blockCode: 'definition',
                      value: {
                        en: 'A programming language designed for managing and querying relational databases.',
                        es: 'Un lenguaje de programación diseñado para gestionar y consultar bases de datos relacionales.',
                        fr: 'Un langage de programmation conçu pour gérer et interroger des bases de données relationnelles.',
                      },
                    },
                    {
                      blockCode: 'examples',
                      value: [
                        { en: 'SELECT * FROM users', es: 'SELECT * FROM usuarios', fr: 'SELECT * FROM utilisateurs' },
                        { en: 'INSERT INTO products', es: 'INSERT INTO productos', fr: 'INSERT INTO produits' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default preset;
