<script>
    /**
     * @typedef {Object} RadioProps
     * @property {boolean} [checked=false]
     * @property {'16' | '20' | '24'} [size='20']
     * @property {'default' | 'base' | 'success' | 'danger'} [intent='default']
     * @property {boolean} [disabled=false]
     * @property {boolean} [required=false]
     * @property {string} [name='']
     * @property {string} [id='']
     * @property {string} [value='']
     * @property {(event: Event) => void} [onchange]
     */

    /** @type {RadioProps} */
    let {
        checked = false,
        size = '20',
        intent = 'default',
        disabled = false,
        required = false,
        name = '',
        id = '',
        value = '',
        onchange,
    } = $props();
</script>

<input
    type="radio"
    class="radio size-{size} {intent}"
    {checked}
    {disabled}
    {required}
    {name}
    {id}
    {value}
    {onchange}
/>

<style>
    .radio {
        appearance: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        outline: none;
        flex-shrink: 0;
    }

    /* Size variants */
    .size-16 {
        width: 16px;
        height: 16px;
    }

    .size-20 {
        width: 20px;
        height: 20px;
    }

    .size-24 {
        width: 24px;
        height: 24px;
    }

    /* Intent colors - unchecked state */
    .default {
        background: var(--base0);
        border: 2px solid var(--base300);
    }

    .success {
        background: var(--base0);
        border: 2px solid var(--success300);
    }

    .danger {
        background: var(--base0);
        border: 2px solid var(--danger300);
    }

    .base {
        background: var(--base0);
        border: 2px solid var(--base300);
    }

    /* Checked state */
    .default:checked {
        background: var(--action500);
        border-color: var(--action500);
    }

    .base:checked {
        background: var(--base800);
        border-color: var(--base800);
    }

    .success:checked {
        background: var(--success500);
        border-color: var(--success500);
    }

    .danger:checked {
        background: var(--danger500);
        border-color: var(--danger500);
    }

    /* Inner dot for checked state */
    .radio:checked::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 40%;
        height: 40%;
        background: white;
        border-radius: 50%;
    }

    /* Focus states */
    .default:focus {
        box-shadow: 0 0 0 2px var(--base200);
    }

    .success:focus {
        box-shadow: 0 0 0 2px var(--success200);
    }

    .danger:focus {
        box-shadow: 0 0 0 2px var(--danger200);
    }

    .base:focus {
        box-shadow: 0 0 0 2px var(--base200);
    }

    /* Hover states */
    .default:hover:not(:disabled) {
        border-color: var(--base400);
    }

    .base:hover:not(:disabled) {
        border-color: var(--base400);
    }

    .success:hover:not(:disabled) {
        border-color: var(--success400);
    }

    .danger:hover:not(:disabled) {
        border-color: var(--danger400);
    }

    /* Disabled state */
    .radio:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>