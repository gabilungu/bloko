<script>
    /**
     * @typedef {Object} SliderProps
     * @property {number} [value=0] - Current value of the slider
     * @property {number} [min=0] - Minimum value
     * @property {number} [max=100] - Maximum value
     * @property {number} [step=1] - Step increment
     * @property {'20' | '24' | '28' | '32' | '40'} [size='32'] - Size variant
     * @property {boolean} [disabled=false] - Disabled state
     * @property {string} [name=''] - Form name attribute
     * @property {string} [id=''] - Element ID
     * @property {(event: Event) => void} [oninput] - Input event handler
     * @property {(event: Event) => void} [onchange] - Change event handler
     */

    /** @type {SliderProps} */
    let {
        value = $bindable(0),
        min = 0,
        max = 100,
        step = 1,
        size = '32',
        disabled = false,
        name = '',
        id = '',
        oninput,
        onchange,
    } = $props();

    // Calculate percentage for styling
    let percentage = $derived(((value - min) / (max - min)) * 100);
    // Calculate fill width to match thumb center position
    // Account for the inset of the fill bar
    let fillWidth = $derived(() => {
        // The fill bar is inset more now, so adjust the calculation
        // to make it reach the thumb center
        const rangePercent = percentage * 0.01; // convert to 0-1
        // Calculate fill width to match thumb center position
        // The thumb center position = margin + (percentage * available width)
        // Available width = 100% - (2 * margin)
        if (size === '20') {
            // 4px margin, 12px thumb, 8px fill offset
            return `calc(2px + ${rangePercent} * (100% - 16px))`;
        }
        if (size === '24') {
            // 5px margin, 14px thumb, 9px fill offset
            return `calc(3px + ${rangePercent} * (100% - 19px))`;
        }
        if (size === '28') {
            // 5.5px margin, 16px thumb, 10px fill offset  
            return `calc(3px + ${rangePercent} * (100% - 21px))`;
        }
        if (size === '40') {
            // 8px margin, 24px thumb, 15px fill offset
            return `calc(5px + ${rangePercent} * (100% - 31px))`;
        }
        // Default size 32: 6px margin, 20px thumb, 12px fill offset
        return `calc(4px + ${rangePercent} * (100% - 24px))`;
    });
</script>

<div class="slider-container size-{size}">
    <div class="slider-track">
        <div class="slider-fill" style="width: {fillWidth()}"></div>
    </div>
    <input
        type="range"
        class="slider-input"
        {min}
        {max}
        {step}
        bind:value
        {disabled}
        {name}
        {id}
        {oninput}
        {onchange}
    />
</div>

<style>
    .slider-container {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
    }

    /* Size variants - container heights */
    .slider-container.size-20 {
        height: 20px;
    }

    .slider-container.size-24 {
        height: 24px;
    }

    .slider-container.size-28 {
        height: 28px;
    }

    .slider-container.size-32 {
        height: 32px;
    }

    .slider-container.size-40 {
        height: 40px;
    }

    .slider-track {
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--base0);
        border: 1px solid var(--base200);
        overflow: hidden;
        pointer-events: none;
        box-sizing: border-box;
    }

    /* Track border radius - fully rounded */
    .slider-track {
        border-radius: 9999px;
    }

    .slider-fill {
        position: absolute;
        background: var(--base100);
        transition: width 0.1s ease;
        min-width: 10px; /* Minimum width for visibility */
    }

    /* Fill border radius - fully rounded on left */
    .slider-fill {
        border-radius: 9999px 0 0 9999px;
    }

    /* Fill positioning - vertically centered with specified heights */
    .size-20 .slider-fill {
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        height: 4px;
    }

    .size-24 .slider-fill {
        left: 9px;
        top: 50%;
        transform: translateY(-50%);
        height: 6px;
    }

    .size-28 .slider-fill {
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        height: 7px; /* Interpolated between 24 and 32 */
    }

    .size-32 .slider-fill {
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        height: 8px;
    }

    .size-40 .slider-fill {
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        height: 10px;
    }

    .slider-input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 100%;
        background: transparent;
        cursor: pointer;
        outline: none;
        position: relative;
        z-index: 2;
    }

    /* Adjust input width per size with specific margins */
    .size-20 .slider-input {
        width: calc(100% - 8px); /* 4px margin each side */
        margin: 0 4px;
    }

    .size-24 .slider-input {
        width: calc(100% - 10px); /* 5px margin each side */
        margin: 0 5px;
    }

    .size-28 .slider-input {
        width: calc(100% - 11px); /* Interpolated between 24 and 32 */
        margin: 0 5.5px;
    }

    .size-32 .slider-input {
        width: calc(100% - 12px); /* 6px margin each side */
        margin: 0 6px;
    }

    .size-40 .slider-input {
        width: calc(100% - 16px); /* 8px margin each side */
        margin: 0 8px;
    }


    /* Track styles - hidden since we use custom track */
    .slider-input::-webkit-slider-track {
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: transparent;
    }

    .slider-input::-moz-range-track {
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: transparent;
    }

    /* Thumb styles - sizes based on Figma specs */
    .size-20 .slider-input::-webkit-slider-thumb,
    .size-20 .slider-input::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid var(--thumb-border-color);
        background: var(--thumb-bg-color);
        transition: all 0.2s ease;
        box-sizing: border-box;
    }

    .size-24 .slider-input::-webkit-slider-thumb,
    .size-24 .slider-input::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid var(--thumb-border-color);
        background: var(--thumb-bg-color);
        transition: all 0.2s ease;
        box-sizing: border-box;
    }

    .size-28 .slider-input::-webkit-slider-thumb,
    .size-28 .slider-input::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid var(--thumb-border-color);
        background: var(--thumb-bg-color);
        transition: all 0.2s ease;
        box-sizing: border-box;
    }

    .size-32 .slider-input::-webkit-slider-thumb,
    .size-32 .slider-input::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid var(--thumb-border-color);
        background: var(--thumb-bg-color);
        transition: all 0.2s ease;
        box-sizing: border-box;
    }

    .size-40 .slider-input::-webkit-slider-thumb,
    .size-40 .slider-input::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid var(--thumb-border-color);
        background: var(--thumb-bg-color);
        transition: all 0.2s ease;
        box-sizing: border-box;
    }


    /* Thumb colors */
    .slider-container {
        --thumb-bg-color: var(--action500);
        --thumb-border-color: var(--action600);
    }

    /* Hover states */
    .slider-input:not(:disabled):hover::-webkit-slider-thumb {
        transform: scale(1.1);
    }

    .slider-input:not(:disabled):hover::-moz-range-thumb {
        transform: scale(1.1);
    }

    /* Focus states */
    .slider-input:focus::-webkit-slider-thumb {
        outline: none;
        box-shadow: 0 0 0 2px var(--focus400);
    }

    .slider-input:focus::-moz-range-thumb {
        outline: none;
        box-shadow: 0 0 0 2px var(--focus400);
    }


    /* Disabled state */
    .slider-container:has(.slider-input:disabled) {
        opacity: 0.5;
    }

    .slider-input:disabled {
        cursor: not-allowed;
    }

    .slider-input:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
    }

    .slider-input:disabled::-moz-range-thumb {
        cursor: not-allowed;
    }
</style>