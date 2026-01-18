<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Navigation from './Navigation.svelte';

    const {Story} = defineMeta({
        title: 'Layout/Navigation',
        component: Navigation,
        tags: ['autodocs']
    });

    const sampleItems = [
        { id: 'home', label: 'Home', href: '#home' },
        { id: 'products', label: 'Products', href: '#products' },
        { id: 'services', label: 'Services', href: '#services' },
        { id: 'about', label: 'About', href: '#about' },
        { id: 'contact', label: 'Contact', href: '#contact' }
    ];

    const rightItems = [
        { id: 'profile', label: 'Profile', href: '#profile' },
        { id: 'settings', label: 'Settings', href: '#settings' },
        { id: 'logout', label: 'Logout', href: '#logout' }
    ];
</script>

<Story name="Default Horizontal" args={{
    brandName: "My App",
    items: sampleItems,
    activeId: 'home'
}}/>

<Story name="With Logo" args={{
    brandName: "My App",
    brandLogo: "https://via.placeholder.com/32",
    items: sampleItems,
    activeId: 'products'
}}>
    {#snippet template(args)}
        <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                Navigation with brand logo
            </p>
            <Navigation {...args}/>
        </div>
    {/snippet}
</Story>

<Story name="With Right Items" args={{
    brandName: "My App",
    items: sampleItems,
    rightItems: rightItems,
    activeId: 'services'
}}>
    {#snippet template(args)}
        <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                Navigation with right-aligned items (Profile, Settings, Logout)
            </p>
            <Navigation {...args}/>
        </div>
    {/snippet}
</Story>

<Story name="Sticky Navigation" args={{
    brandName: "My App",
    items: sampleItems,
    sticky: true,
    activeId: 'about'
}}>
    {#snippet template(args)}
        <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                Sticky navigation that stays at top when scrolling
            </p>
            <Navigation {...args}/>
            <div style="height: 800px; padding: 20px; background: linear-gradient(to bottom, #f0f0f0, #ffffff);">
                <p>Scroll down to see sticky behavior...</p>
            </div>
        </div>
    {/snippet}
</Story>

<Story name="Vertical Navigation" args={{
    brandName: "Dashboard",
    items: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'reports', label: 'Reports' },
        { id: 'users', label: 'Users' },
        { id: 'settings', label: 'Settings' }
    ],
    rightItems: [
        { id: 'help', label: 'Help' },
        { id: 'logout', label: 'Logout' }
    ],
    orientation: 'vertical',
    activeId: 'dashboard'
}}>
    {#snippet template(args)}
        <div style="display: flex;">
            <Navigation {...args}/>
            <div style="padding: 20px; flex: 1;">
                <h2>Content Area</h2>
                <p>This demonstrates vertical navigation layout</p>
            </div>
        </div>
    {/snippet}
</Story>

<Story name="Interactive Navigation" args={{
    brandName: "Interactive App",
    items: sampleItems,
    onNavClick: (id) => console.log('Navigation clicked:', id)
}}>
    {#snippet template(args)}
        <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                Click navigation items to see console logs. Navigation state is managed internally.
            </p>
            <Navigation {...args}/>
        </div>
    {/snippet}
</Story>

<Story name="Minimal Navigation" args={{
    brandName: "Simple",
    items: [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' }
    ]
}}>
    {#snippet template(args)}
        <div>
            <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                Minimal navigation with just brand name and two items
            </p>
            <Navigation {...args}/>
        </div>
    {/snippet}
</Story>