<script>
    /**
     * @typedef {Object} NavItem
     * @property {string} id - Unique identifier for the nav item
     * @property {string} label - Display text for the nav item
     * @property {string} [href] - URL for the navigation link
     * @property {boolean} [active] - Whether this item is currently active
     * @property {NavItem[]} [items] - Nested navigation items for dropdowns
     */

    /**
     * @typedef {Object} NavigationProps
     * @property {string} [brandName='Brand'] - Brand/company name to display
     * @property {string} [brandLogo=''] - URL or path to brand logo image
     * @property {NavItem[]} [items=[]] - Navigation items to display
     * @property {NavItem[]} [rightItems=[]] - Navigation items to display on the right side
     * @property {'horizontal' | 'vertical'} [orientation='horizontal'] - Navigation orientation
     * @property {string} [activeId=null] - ID of the currently active nav item
     * @property {((id: string) => void)|null} [onNavClick=null] - Callback when nav item is clicked
     * @property {boolean} [sticky=false] - Whether navigation should stick to top when scrolling
     * @property {import('svelte').Snippet} [rightContent] - Custom content for right side
     */

    /** @type {NavigationProps} */
    let {
        brandName = 'Brand',
        brandLogo = '',
        items = [],
        rightItems = [],
        orientation = 'horizontal',
        activeId = null,
        onNavClick = null,
        sticky = false,
        rightContent
    } = $props();

    // Internal active state for uncontrolled mode
    let internalActiveId = $state(null);
    
    // Use provided activeId or fall back to internal state
    let currentActiveId = $derived(activeId ?? internalActiveId);

    function handleNavClick(item) {
        if (onNavClick) {
            onNavClick(item.id);
        } else {
            internalActiveId = item.id;
        }
        
        // Navigate if href is provided
        if (item.href) {
            window.location.href = item.href;
        }
    }

    function isActive(itemId) {
        return currentActiveId === itemId;
    }
</script>

<nav 
    class="navigation {orientation}"
    class:sticky
    aria-label="Main navigation"
>
    <div class="nav-container">
        <!-- Branding Section -->
        <a href="/" class="brand">
            {#if brandLogo}
                <img src={brandLogo} alt="{brandName} logo" class="brand-logo" />
            {/if}
            <span class="brand-name">{brandName}</span>
        </a>

        <!-- Main Navigation Items -->
        <ul class="nav-items" role="menubar">
            {#each items as item}
                <li role="none">
                    <button
                        class="nav-link"
                        class:active={isActive(item.id)}
                        role="menuitem"
                        onclick={() => handleNavClick(item)}
                        aria-current={isActive(item.id) ? 'page' : undefined}
                    >
                        {item.label}
                    </button>
                </li>
            {/each}
        </ul>

        <!-- Right Navigation Items or Custom Content -->
        {#if rightContent}
            <div class="nav-right">
                {@render rightContent()}
            </div>
        {:else if rightItems.length > 0}
            <ul class="nav-items nav-right" role="menubar">
                {#each rightItems as item}
                    <li role="none">
                        <button
                            class="nav-link"
                            class:active={isActive(item.id)}
                            role="menuitem"
                            onclick={() => handleNavClick(item)}
                            aria-current={isActive(item.id) ? 'page' : undefined}
                        >
                            {item.label}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</nav>

<style>
    .navigation {
        background: var(--base0);
        border-bottom: 1px solid var(--base200);
        font-family: inherit;
    }

    .navigation.sticky {
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Horizontal Navigation */
    .navigation.horizontal .nav-container {
        display: flex;
        align-items: center;
        padding: 0 16px;
        height: 40px;
        gap: 32px;
    }

    .navigation.horizontal .nav-items {
        display: flex;
        gap: 4px;
        margin: 0;
        padding: 0;
        list-style: none;
        align-items: center;
    }

    .navigation.horizontal .nav-items.nav-right,
    .navigation.horizontal .nav-right {
        margin-left: auto;
    }

    /* Vertical Navigation */
    .navigation.vertical {
        width: 240px;
        min-height: 100vh;
        border-right: 1px solid var(--base200);
        border-bottom: none;
    }

    .navigation.vertical .nav-container {
        padding: 16px;
    }

    .navigation.vertical .brand {
        margin-bottom: 24px;
    }

    .navigation.vertical .nav-items {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .navigation.vertical .nav-items.nav-right {
        margin-top: auto;
        padding-top: 24px;
        border-top: 1px solid var(--base200);
    }

    /* Brand Section */
    .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        font-size: 16px;
        color: var(--base900);
        text-decoration: none;
        transition: opacity 0.2s ease;
    }

    .brand:hover {
        opacity: 0.7;
    }

    .brand-logo {
        height: 24px;
        width: auto;
    }

    .brand-name {
        white-space: nowrap;
    }

    /* Navigation Links */
    .nav-link {
        background: transparent;
        border: none;
        padding: 6px 10px;
        font-size: 13px;
        font-weight: 500;
        color: var(--base700);
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
        white-space: nowrap;
        display: flex;
        align-items: center;
        width: 100%;
        text-align: left;
    }

    .nav-link:hover {
        background: var(--base100);
        color: var(--base900);
    }

    .nav-link.active {
        background: var(--action100);
        color: var(--action600);
    }

    .nav-link:focus-visible {
        outline: 2px solid var(--action500);
        outline-offset: 2px;
    }

    /* Vertical specific link styles */
    .navigation.vertical .nav-link {
        width: 100%;
        justify-content: flex-start;
    }
</style>