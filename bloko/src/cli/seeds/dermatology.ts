import type { Preset } from './types.js';

const preset: Preset = {
  name: 'Dermatology',
  description: 'Medical dermatology glossary with conditions and treatments',
  languages: [
    { id: 'en', title: 'English', sort: 1 },
    { id: 'ro', title: 'Romanian', sort: 2 },
  ],
  nodeTypes: [
    { code: 'category', title: { en: 'Category', ro: 'Categorie' }, sort: 1, notes: null },
    { code: 'condition', title: { en: 'Condition', ro: 'Afecțiune' }, sort: 2, notes: null },
    { code: 'treatment', title: { en: 'Treatment', ro: 'Tratament' }, sort: 3, notes: null },
  ],
  collections: [
    {
      collection: { code: 'dermatology', sort: null, notes: 'Dermatology medical glossary' },
      templates: [
        {
          template: {
            code: 'category',
            title: { en: 'Category', ro: 'Categorie' },
            sort: 1,
            notes: null,
          },
          blocks: [
            {
              block: {
                code: 'description',
                title: { en: 'Description', ro: 'Descriere' },
                content_type: 'text',
                sort: 1,
                notes: null,
              },
            },
          ],
        },
        {
          template: {
            code: 'condition',
            title: { en: 'Condition', ro: 'Afecțiune' },
            sort: 2,
            notes: null,
          },
          blocks: [
            {
              block: {
                code: 'definition',
                title: { en: 'Definition', ro: 'Definiție' },
                content_type: 'text',
                sort: 1,
                notes: null,
              },
            },
            {
              block: {
                code: 'symptoms',
                title: { en: 'Symptoms', ro: 'Simptome' },
                content_type: 'text_list',
                sort: 2,
                notes: null,
              },
            },
            {
              block: {
                code: 'causes',
                title: { en: 'Causes', ro: 'Cauze' },
                content_type: 'text',
                sort: 3,
                notes: null,
              },
            },
          ],
        },
        {
          template: {
            code: 'treatment',
            title: { en: 'Treatment', ro: 'Tratament' },
            sort: 3,
            notes: null,
          },
          blocks: [
            {
              block: {
                code: 'description',
                title: { en: 'Description', ro: 'Descriere' },
                content_type: 'text',
                sort: 1,
                notes: null,
              },
            },
            {
              block: {
                code: 'indications',
                title: { en: 'Indications', ro: 'Indicații' },
                content_type: 'text_list',
                sort: 2,
                notes: null,
              },
            },
          ],
        },
      ],
      nodes: [
        {
          node: {
            code: 'inflammatory',
            title: { en: 'Inflammatory Conditions', ro: 'Afecțiuni Inflamatorii' },
            subtitle: null,
            slug: { en: 'inflammatory', ro: 'inflamatorii' },
            sort: 1,
            sort_children_by: 'title',
            _cover_image: null,
            _images: null,
            notes: null,
            templateCode: 'category',
            nodeTypeCode: 'category',
          },
          contents: [
            {
              blockCode: 'description',
              value: {
                en: 'Skin conditions characterized by inflammation, redness, and swelling.',
                ro: 'Afecțiuni ale pielii caracterizate prin inflamație, roșeață și umflături.',
              },
            },
          ],
          children: [
            {
              node: {
                code: 'eczema',
                title: { en: 'Eczema', ro: 'Eczema' },
                subtitle: { en: 'Atopic Dermatitis', ro: 'Dermatită Atopică' },
                slug: { en: 'eczema', ro: 'eczema' },
                sort: 1,
                sort_children_by: null,
                _cover_image: null,
                _images: null,
                notes: null,
                templateCode: 'condition',
                nodeTypeCode: 'condition',
              },
              contents: [
                {
                  blockCode: 'definition',
                  value: {
                    en: 'A chronic skin condition causing dry, itchy, and inflamed skin.',
                    ro: 'O afecțiune cronică a pielii care cauzează piele uscată, cu mâncărime și inflamată.',
                  },
                },
                {
                  blockCode: 'symptoms',
                  value: [
                    { en: 'Dry, scaly skin', ro: 'Piele uscată, solzoasă' },
                    { en: 'Intense itching', ro: 'Mâncărime intensă' },
                    { en: 'Red or brownish patches', ro: 'Pete roșii sau maronii' },
                  ],
                },
                {
                  blockCode: 'causes',
                  value: {
                    en: 'Caused by a combination of genetic and environmental factors.',
                    ro: 'Cauzată de o combinație de factori genetici și de mediu.',
                  },
                },
              ],
            },
            {
              node: {
                code: 'psoriasis',
                title: { en: 'Psoriasis', ro: 'Psoriazis' },
                subtitle: null,
                slug: { en: 'psoriasis', ro: 'psoriazis' },
                sort: 2,
                sort_children_by: null,
                _cover_image: null,
                _images: null,
                notes: null,
                templateCode: 'condition',
                nodeTypeCode: 'condition',
              },
              contents: [
                {
                  blockCode: 'definition',
                  value: {
                    en: 'An autoimmune condition causing rapid skin cell buildup.',
                    ro: 'O afecțiune autoimună care cauzează acumularea rapidă a celulelor pielii.',
                  },
                },
                {
                  blockCode: 'symptoms',
                  value: [
                    { en: 'Thick, red patches with silvery scales', ro: 'Pete groase, roșii cu solzi argintii' },
                    { en: 'Dry, cracked skin', ro: 'Piele uscată, crăpată' },
                    { en: 'Itching or burning', ro: 'Mâncărime sau arsură' },
                  ],
                },
              ],
            },
          ],
        },
        {
          node: {
            code: 'treatments',
            title: { en: 'Treatments', ro: 'Tratamente' },
            subtitle: null,
            slug: { en: 'treatments', ro: 'tratamente' },
            sort: 2,
            sort_children_by: 'title',
            _cover_image: null,
            _images: null,
            notes: null,
            templateCode: 'category',
            nodeTypeCode: 'category',
          },
          contents: [
            {
              blockCode: 'description',
              value: {
                en: 'Common treatments for dermatological conditions.',
                ro: 'Tratamente comune pentru afecțiunile dermatologice.',
              },
            },
          ],
          children: [
            {
              node: {
                code: 'topical-corticosteroids',
                title: { en: 'Topical Corticosteroids', ro: 'Corticosteroizi Topici' },
                subtitle: null,
                slug: { en: 'topical-corticosteroids', ro: 'corticosteroizi-topici' },
                sort: 1,
                sort_children_by: null,
                _cover_image: null,
                _images: null,
                notes: null,
                templateCode: 'treatment',
                nodeTypeCode: 'treatment',
              },
              contents: [
                {
                  blockCode: 'description',
                  value: {
                    en: 'Anti-inflammatory medications applied directly to the skin.',
                    ro: 'Medicamente antiinflamatoare aplicate direct pe piele.',
                  },
                },
                {
                  blockCode: 'indications',
                  value: [
                    { en: 'Eczema', ro: 'Eczema' },
                    { en: 'Psoriasis', ro: 'Psoriazis' },
                    { en: 'Contact dermatitis', ro: 'Dermatită de contact' },
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
