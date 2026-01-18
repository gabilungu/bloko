<script>
    /**
     * @typedef {Object} ButtonProps
     * @property {string} [label='Label']
     * @property {'24' | '28' | '32' | '40'} [size='32']
     * @property {'primary' | 'secondary' | 'danger'} [intent='primary']
     * @property {'button' | 'submit' | 'reset'} [type='button']
     * @property {boolean} [disabled=false]
     * @property {(event: MouseEvent) => void} [onclick]
     */

    /** @type {ButtonProps} */
    let {
        label = 'Label',
        size = '32',
        intent = 'primary',
        type = 'button',
        disabled = false,
        onclick,
    } = $props();
</script>

<button
        class="{intent} size-{size}"
        {type}
        {disabled}
        {onclick}
>
    {label}
</button>

<style>
    button {
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        box-sizing: border-box;
    }

    /* Size variants */
    .size-24 {
        height: 24px;
        padding: 0 8px;
        font-size: 12px;
        border-radius: 4px;
    }

    .size-28 {
        height: 28px;
        padding: 0 10px;
        font-size: 13px;
        border-radius: 5px;
    }

    .size-32 {
        height: 32px;
        padding: 0 12px;
        font-size: 14px;
        border-radius: 6px;
    }

    .size-40 {
        height: 40px;
        padding: 0 16px;
        font-size: 16px;
        border-radius: 8px;
    }

    /* Intent colors */
    .primary {
        background: var(--action500);
        color: var(--base0);
        border: none;
    }

    .secondary {
        background: var(--action50);
        color: var(--action600);
        border: none;
    }

    .danger {
        background: var(--danger500);
        color: var(--base0);
        border: none;
    }


    /* Hover states */
    .primary:hover:not(:disabled) {
        background: var(--action600);
    }

    .secondary:hover:not(:disabled) {
        background: var(--action100);
    }

    .danger:hover:not(:disabled) {
        background: var(--danger600);
    }


    /* Focus state - visible when tabbing */
    button:focus-visible {
        outline: 2px solid var(--focus400);
        outline-offset: 0;
    }

    /* Disabled state - higher specificity to override variant styles */
    button:disabled {
        background: var(--base200) !important;
        color: var(--base100) !important;
        border: 1px solid var(--base300) !important;
        cursor: not-allowed;
        opacity: 1;
    }

    button:disabled {
        border: none !important;
    }
</style>