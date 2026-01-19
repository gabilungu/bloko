<script module>
    import { writable } from 'svelte/store';
    
    // Notification types
    export const NotificationType = {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    };
    
    // Create the notifications store
    function createNotificationStore() {
        const { subscribe, update } = writable([]);
        
        let nextId = 1;
        
        return {
            subscribe,
            
            /**
             * Add a notification
             * @param {string} message - The notification message
             * @param {string} type - The notification type (success, error, warning, info)
             * @param {number} duration - How long to show the notification in ms (0 = persistent)
             */
            add(message, type = NotificationType.INFO, duration = 3000) {
                const id = nextId++;
                const notification = {
                    id,
                    message,
                    type,
                    timestamp: Date.now()
                };
                
                update(notifications => [...notifications, notification]);
                
                // Auto-remove after duration if not persistent
                if (duration > 0) {
                    setTimeout(() => {
                        this.remove(id);
                    }, duration);
                }
                
                return id;
            },
            
            /**
             * Remove a notification by ID
             * @param {number} id - The notification ID to remove
             */
            remove(id) {
                update(notifications => notifications.filter(n => n.id !== id));
            },
            
            /**
             * Clear all notifications
             */
            clear() {
                update(() => []);
            },
            
            // Convenience methods
            success(message, duration = 3000) {
                return this.add(message, NotificationType.SUCCESS, duration);
            },
            
            error(message, duration = 5000) {
                return this.add(message, NotificationType.ERROR, duration);
            },
            
            warning(message, duration = 4000) {
                return this.add(message, NotificationType.WARNING, duration);
            },
            
            info(message, duration = 3000) {
                return this.add(message, NotificationType.INFO, duration);
            }
        };
    }
    
    // Export a singleton instance
    export const notifications = createNotificationStore();
</script>

<script>
    import { fade, fly } from 'svelte/transition';
    
    /**
     * @typedef {Object} NotificationProps
     * @property {'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'} [position='top-right'] - Position on screen
     */
    
    /** @type {NotificationProps} */
    let { position = 'top-right' } = $props();
    
    // Get icon for notification type
    function getIcon(type) {
        switch(type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            case 'info': 
            default: return 'ℹ';
        }
    }
    
    // Get position classes
    function getPositionClasses(pos) {
        switch(pos) {
            case 'top-left': return 'top left';
            case 'top-right': return 'top right';
            case 'bottom-left': return 'bottom left';
            case 'bottom-right': return 'bottom right';
            case 'top-center': return 'top center';
            case 'bottom-center': return 'bottom center';
            default: return 'top right';
        }
    }
    
    // Get animation direction based on position
    function getAnimationDirection(pos) {
        if (pos.includes('right')) return { x: 100 };
        if (pos.includes('left')) return { x: -100 };
        if (pos.includes('top')) return { y: -100 };
        return { y: 100 };
    }
    
    const positionClass = getPositionClasses(position);
    const animDirection = getAnimationDirection(position);
</script>

<div class="notification-container {positionClass}">
    {#each $notifications as notification (notification.id)}
        <div 
            class="notification notification-{notification.type}"
            in:fly={animDirection}
            out:fade={{ duration: 200 }}
            role="alert"
            aria-live="polite"
        >
            <span class="notification-icon" aria-hidden="true">
                {getIcon(notification.type)}
            </span>
            <span class="notification-message">
                {notification.message}
            </span>
            <button 
                class="notification-close"
                onclick={() => notifications.remove(notification.id)}
                aria-label="Close notification"
            >
                ✕
            </button>
        </div>
    {/each}
</div>

<style>
    .notification-container {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        max-width: 400px;
        width: 100%;
    }
    
    /* Position variations */
    .notification-container.top {
        top: 0;
    }
    
    .notification-container.bottom {
        bottom: 0;
    }
    
    .notification-container.left {
        left: 0;
        align-items: flex-start;
    }
    
    .notification-container.right {
        right: 0;
        align-items: flex-end;
    }
    
    .notification-container.center {
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
    }
    
    .notification {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        pointer-events: auto;
        min-width: 250px;
        max-width: 100%;
        font-size: 14px;
        line-height: 1.5;
        border-left: 4px solid;
    }
    
    .notification-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        flex-shrink: 0;
        font-weight: bold;
    }
    
    .notification-message {
        flex: 1;
        color: var(--base900);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--base500);
        cursor: pointer;
        padding: 4px;
        font-size: 16px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
    }
    
    .notification-close:hover {
        color: var(--base700);
    }
    
    /* Type variations */
    .notification-success {
        border-left-color: var(--success600);
    }
    
    .notification-success .notification-icon {
        background: var(--success100);
        color: var(--success600);
    }
    
    .notification-error {
        border-left-color: var(--danger600);
    }
    
    .notification-error .notification-icon {
        background: var(--danger100);
        color: var(--danger600);
    }
    
    .notification-warning {
        border-left-color: var(--warning600);
    }
    
    .notification-warning .notification-icon {
        background: var(--warning100);
        color: var(--warning600);
    }
    
    .notification-info {
        border-left-color: var(--action600);
    }
    
    .notification-info .notification-icon {
        background: var(--action100);
        color: var(--action600);
    }
    
    /* Mobile responsive */
    @media (max-width: 480px) {
        .notification-container {
            max-width: calc(100vw - 32px);
        }
    }
</style>