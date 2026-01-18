# dermatology

Medical dermatology glossary with conditions and treatments.

```bash
npx bloko seed dermatology
```

## Languages

- English (`en`)
- Romanian (`ro`)

## Node Types

| Code | Description |
|------|-------------|
| `category` | Grouping for conditions/treatments |
| `condition` | Medical condition |
| `treatment` | Treatment method |

## Templates

### category
- `description` - Text block

### condition
- `definition` - Text block
- `symptoms` - Text list
- `causes` - Text block

### treatment
- `description` - Text block
- `indications` - Text list

## Sample Content

```
Dermatology Glossary
├── Inflammatory Conditions (category)
│   ├── Eczema (condition)
│   │   └── symptoms, causes
│   └── Psoriasis (condition)
│       └── symptoms
└── Treatments (category)
    └── Topical Corticosteroids (treatment)
        └── description, indications
```

## Use Case

Ideal for medical/healthcare glossaries with structured content including symptoms, causes, and treatment information.
