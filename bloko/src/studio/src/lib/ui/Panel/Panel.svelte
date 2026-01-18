<script>
    /**
     * @typedef {Object} PanelProps
     * @property {string} [title=''] - Title text for the header
     * @property {string} [subtitle=''] - Subtitle text for the header
     * @property {'0' | '1' | '2' | '3'} [level='0'] - Nesting level (0=main, 1=nested, 2=deeply nested, 3=very deeply nested)
     * @property {boolean} [scrollable=false] - Enable vertical scrolling for content
     * @property {import('svelte').Snippet} [topRightSlot] - Slot for top right header content
     * @property {import('svelte').Snippet} [bottomLeftSlot] - Slot for bottom left footer content
     * @property {import('svelte').Snippet} [bottomSlot] - Slot for bottom center footer content
     * @property {import('svelte').Snippet} [bottomRightSlot] - Slot for bottom right footer content
     * @property {import('svelte').Snippet} [children] - Main content slot
     */

    /** @type {PanelProps} */
    let {
        title = '',
        subtitle = '',
        level = '0',
        scrollable = false,
        topRightSlot,
        bottomLeftSlot,
        bottomSlot,
        bottomRightSlot,
        children,
    } = $props();
</script>

<div class="panel level-{level}">
    <!-- Header -->
    {#if title || subtitle || topRightSlot}
        <div class="panel-header">
            <div class="panel-header-left">
                {#if title}
                    <h2 class="panel-title">{title}</h2>
                {/if}
                {#if subtitle}
                    <p class="panel-subtitle">{subtitle}</p>
                {/if}
            </div>
            {#if topRightSlot}
                <div class="panel-header-right">
                    {@render topRightSlot()}
                </div>
            {/if}
        </div>
    {/if}

    <!-- Content -->
    <div class="panel-content" class:scrollable>
        {#if children}
            {@render children()}
        {/if}
    </div>

    <!-- Footer -->
    {#if bottomLeftSlot || bottomSlot || bottomRightSlot}
        <div class="panel-footer">
            <div class="panel-footer-left">
                {#if bottomLeftSlot}
                    {@render bottomLeftSlot()}
                {/if}
            </div>
            <div class="panel-footer-center">
                {#if bottomSlot}
                    {@render bottomSlot()}
                {/if}
            </div>
            <div class="panel-footer-right">
                {#if bottomRightSlot}
                    {@render bottomRightSlot()}
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: var(--base0);
        border: 1px solid var(--base200);
        overflow: hidden;
    }

    /* Level-based border radius */
    .level-0 {
        border-radius: 16px;
    }

    .level-1 {
        border-radius: 12px;
    }

    .level-2 {
        border-radius: 8px;
    }

    .level-3 {
        border-radius: 6px;
    }

    /* Header */
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--base200);
        background: var(--base0);
        flex-shrink: 0;
    }

    /* Level-based header padding */
    .level-0 .panel-header {
        padding: 32px;
    }

    .level-1 .panel-header {
        padding: 24px;
    }

    .level-2 .panel-header {
        padding: 16px;
    }

    .level-3 .panel-header {
        padding: 8px;
    }

    .panel-header-left {
        display: flex;
        flex-direction: column;
        gap: 0;
        flex: 1;
    }

    .panel-title {
        margin: 0;
        font-weight: 600;
        color: var(--accent500);
        line-height: 1.2;
    }

    /* Level-based title sizes */
    .level-0 .panel-title {
        font-size: 18px;
    }

    .level-1 .panel-title {
        font-size: 16px;
    }

    .level-2 .panel-title {
        font-size: 15px;
    }

    .level-3 .panel-title {
        font-size: 14px;
    }

    .panel-subtitle {
        margin: 0;
        font-weight: 400;
        color: var(--base600);
        line-height: 1.4;
    }

    /* Level-based subtitle sizes */
    .level-0 .panel-subtitle {
        font-size: 14px;
    }

    .level-1 .panel-subtitle {
        font-size: 13px;
    }

    .level-2 .panel-subtitle {
        font-size: 12px;
    }

    .level-3 .panel-subtitle {
        font-size: 12px;
    }

    .panel-header-right {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    /* Content */
    .panel-content {
        flex: 1;
        overflow: hidden;
    }

    /* Level-based content padding */
    .level-0 .panel-content {
        padding: 32px;
    }

    .level-1 .panel-content {
        padding: 24px;
    }

    .level-2 .panel-content {
        padding: 16px;
    }

    .level-3 .panel-content {
        padding: 8px;
    }

    .panel-content.scrollable {
        overflow-y: auto;
    }

    /* Custom scrollbar for scrollable content */
    .panel-content.scrollable::-webkit-scrollbar {
        width: 8px;
    }

    .panel-content.scrollable::-webkit-scrollbar-track {
        background: var(--base100);
        border-radius: 4px;
    }

    .panel-content.scrollable::-webkit-scrollbar-thumb {
        background: var(--base400);
        border-radius: 4px;
    }

    .panel-content.scrollable::-webkit-scrollbar-thumb:hover {
        background: var(--base500);
    }

    /* Footer */
    .panel-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--base200);
        background: var(--base0);
        flex-shrink: 0;
    }

    /* Level-based footer padding */
    .level-0 .panel-footer {
        padding: 32px;
    }

    .level-1 .panel-footer {
        padding: 24px;
    }

    .level-2 .panel-footer {
        padding: 16px;
    }

    .level-3 .panel-footer {
        padding: 8px;
    }

    .panel-footer-left,
    .panel-footer-center,
    .panel-footer-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .panel-footer-left {
        justify-content: flex-start;
        flex: 1;
    }

    .panel-footer-center {
        justify-content: center;
    }

    .panel-footer-right {
        justify-content: flex-end;
        flex: 1;
    }
</style>