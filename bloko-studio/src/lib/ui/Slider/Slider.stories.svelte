<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Slider from './Slider.svelte';

    const {Story} = defineMeta({
        title: 'Upcoming/Slider',
        component: Slider,
        tags: ['autodocs']
    });
</script>

<script>
    let defaultValue = $state(50);
    let sizeValues = $state({ s20: 30, s24: 40, s28: 50, s32: 60, s40: 70 });
    let rangeValues = $state({ volume: 7, price: 150, opacity: 85, temp: 22 });
    let interactiveValue = $state(50);
    let disabledValue = $state(60);
</script>

<Story name="Default" args={{ 
    value: 50,
    size: '32',
    min: 0,
    max: 100,
    step: 1,
    disabled: false
}}>
    {#snippet template(args)}
        <Slider 
            bind:value={args.value} 
            size={args.size}
            min={args.min}
            max={args.max}
            step={args.step}
            disabled={args.disabled}
        />
        <p style="margin-top: 8px; font-size: 12px; color: var(--base600);">Value: {args.value}</p>
    {/snippet}
</Story>

<Story name="Sizes">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 11px; color: var(--base700);">Size 20</label>
                <Slider bind:value={sizeValues.s20} size="20"/>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 12px; color: var(--base700);">Size 24</label>
                <Slider bind:value={sizeValues.s24} size="24"/>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: var(--base700);">Size 28</label>
                <Slider bind:value={sizeValues.s28} size="28"/>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: var(--base700);">Size 32</label>
                <Slider bind:value={sizeValues.s32} size="32"/>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 16px; color: var(--base700);">Size 40</label>
                <Slider bind:value={sizeValues.s40} size="40"/>
            </div>
        </div>
    {/snippet}
</Story>

<Story name="Range Examples">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: var(--base700);">Volume (0-10)</label>
                <Slider bind:value={rangeValues.volume} min={0} max={10} step={1}/>
                <span style="font-size: 12px; color: var(--base600);">Value: {rangeValues.volume}</span>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: var(--base700);">Price ($0-$500)</label>
                <Slider bind:value={rangeValues.price} min={0} max={500} step={10}/>
                <span style="font-size: 12px; color: var(--base600);">Value: ${rangeValues.price}</span>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: var(--base700);">Opacity (0%-100%)</label>
                <Slider bind:value={rangeValues.opacity} min={0} max={100} step={5}/>
                <span style="font-size: 12px; color: var(--base600);">Value: {rangeValues.opacity}%</span>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: var(--base700);">Temperature (-20°C to 40°C)</label>
                <Slider bind:value={rangeValues.temp} min={-20} max={40} step={2}/>
                <span style="font-size: 12px; color: var(--base600);">Value: {rangeValues.temp}°C</span>
            </div>
        </div>
    {/snippet}
</Story>

<Story name="Interactive">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: var(--base700);">Interactive Slider</label>
                <Slider 
                    bind:value={interactiveValue} 
                    min={0} 
                    max={100} 
                    step={1} 
                    oninput={(e) => console.log('Input:', e.target.value)}
                    onchange={(e) => console.log('Change:', e.target.value)}
                />
                <div style="margin-top: 8px; font-size: 12px; color: var(--base600);">
                    Value: {interactiveValue} - Check console for input/change events
                </div>
            </div>
        </div>
    {/snippet}
</Story>

<Story name="Disabled">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: var(--base700);">Disabled Slider</label>
                <Slider bind:value={disabledValue} disabled={true}/>
            </div>
        </div>
    {/snippet}
</Story>