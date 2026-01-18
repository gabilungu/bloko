<script>
    /**
     * @typedef {Object} ModalProps
     * @property {boolean} open - Whether the modal is open
     * @property {string} title - Title displayed in the modal header
     * @property {string} [width='600px'] - Width of the modal
     * @property {Function} [onClose] - Callback when modal is closed
     * @property {import('svelte').Snippet} [children] - Content to display in the modal body
     * @property {import('svelte').Snippet} [footer] - Footer content snippet
     */

    /** @type {ModalProps} */
    let {
        open = $bindable(false),
        title,
        width = '600px',
        onClose = null,
        children,
        footer
    } = $props();

    function handleClose() {
        open = false;
        if (onClose) onClose();
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleClose();
        }
    }

    $effect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeydown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';
        };
    });
</script>

{#if open}
    <div class="modal-backdrop" onclick={handleBackdropClick} role="presentation">
        <div class="modal" style:width role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="modal-header">
                <h2 id="modal-title" class="modal-title">{title}</h2>
                <button
                        class="modal-close"
                        onclick={handleClose}
                        type="button"
                        aria-label="Close modal"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                {#if children}
                    {@render children()}
                {/if}
            </div>

            {#if footer}
                <div class="modal-footer">
                    {@render footer()}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
        padding: 32px;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .modal {
        background: var(--base0);
        border-radius: 8px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 64px);
        animation: slideUp 0.3s ease-out;
        overflow: hidden;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid var(--base200);
        flex-shrink: 0;
    }

    .modal-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--base900);
    }

    .modal-close {
        background: transparent;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--base500);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .modal-close:hover {
        background: var(--base100);
        color: var(--base700);
    }

    .modal-close:focus-visible {
        outline: 2px solid var(--focus500);
        outline-offset: 2px;
    }

    .modal-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        color: var(--base800);
    }

    .modal-footer {
        padding: 16px;
        border-top: 1px solid var(--base200);
        flex-shrink: 0;
    }

    /* Scrollbar styling */
    .modal-body::-webkit-scrollbar {
        width: 8px;
    }

    .modal-body::-webkit-scrollbar-track {
        background: var(--base100);
        border-radius: 4px;
    }

    .modal-body::-webkit-scrollbar-thumb {
        background: var(--base400);
        border-radius: 4px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
        background: var(--base500);
    }
</style>