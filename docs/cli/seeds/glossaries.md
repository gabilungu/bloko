# glossaries

Multi-language glossary template with terms and definitions.

```bash
npx bloko seed glossaries
```

## Languages

- English (`en`)
- Spanish (`es`)
- French (`fr`)

## Node Types

| Code | Description |
|------|-------------|
| `glossary` | Top-level glossary |
| `section` | Section grouping |
| `term` | Individual term |

## Templates

### glossary
- `introduction` - Text block

### section
- `description` - Text block

### term
- `definition` - Text block
- `examples` - Text list
- `notes` - Text block

## Sample Content

```
Technology Glossary
├── Programming (section)
│   ├── API (term)
│   │   └── definition, examples
│   └── CRUD (term)
│       └── definition, examples
└── Databases (section)
    └── SQL (term)
        └── definition, examples
```

## Use Case

Ideal for technical glossaries, dictionaries, or any hierarchical term-based content with multi-language support.
