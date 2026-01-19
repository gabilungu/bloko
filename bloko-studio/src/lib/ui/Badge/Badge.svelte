<script>
    /**
     * @typedef {Object} BadgeProps
     * @property {string} text - The text content to display in the badge
     * @property {string} [background="var(--base900)"] - CSS color value for the badge background
     * @property {string} [foreground="var(--base0)"] - CSS color value for the badge text
     * @property {16 | 20 | 24 | 28} [size=20] - Badge height in pixels
     */

    /** @type {BadgeProps} */
    let {
        text,
        background = "var(--base900)",
        foreground = "var(--base0)",
        size = 20
    } = $props();
</script>

<span
        class="badge size-{size}"
        style:background-color={background}
        style:color={foreground}
>
    {text}
</span>

<style>
    .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        vertical-align: middle;
    }

    .badge.size-16 {
        height: 16px;
        font-size: 10px;
        padding: 0 6px;
        border-radius: 8px;
    }

    .badge.size-20 {
        height: 20px;
        font-size: 12px;
        padding: 0 8px;
        border-radius: 10px;
    }

    .badge.size-24 {
        height: 24px;
        font-size: 13px;
        padding: 0 10px;
        border-radius: 12px;
    }

    .badge.size-28 {
        height: 28px;
        font-size: 14px;
        padding: 0 12px;
        border-radius: 14px;
    }
</style>