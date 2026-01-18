<script>
	let { code, title, hint, contentForm, contentType, contentId, children } = $props();
</script>

<div class="blockPreview">
	<div class="header">
		<span class="code">{code}</span>
		{#if contentType}
			<span class="contentType">
				<span class="type">{contentType}</span>
				{#if contentId}
					<span class="separator">|</span>
					<span class="label">content id:</span>
					<span class="sid">{contentId}</span>
				{/if}
			</span>
		{/if}
	</div>
	<div class="content">
		{#if title}
			<div class="title">{title}</div>
		{/if}
		{#if contentForm}
			<div class="contentForm">
				{@render contentForm()}
			</div>
		{/if}
		{#if children}
			<div class="childrenSlot">
				{@render children()}
			</div>
		{/if}
		{#if hint}
			<div class="hint">{hint}</div>
		{/if}
	</div>
</div>

<style>
	.blockPreview {
		border: 1px solid var(--accent100);
		background-color: var(--base0);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 4px;
	}

	.header {
		background-color: var(--accent50);
		padding: 4px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}

	.code {
		font-size: 12px;
		font-weight: 500;
		color: var(--accent500);
		white-space: nowrap;
	}

	.contentType {
		font-size: 12px;
		font-weight: 400;
		color: var(--accent300);
		white-space: nowrap;
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.contentType .type {
		font-weight: 600;
		font-size: 12px;
	}

	.contentType .separator {
		color: var(--accent200);
		font-size: 12px;
	}

	.contentType .label {
		color: var(--accent300);
		font-size: 12px;
	}

	.contentType .sid {
		color: var(--accent400);
		font-weight: 400;
		font-size: 12px;
	}

	.content {
		background-color: var(--base0);
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: flex-start;
		justify-content: center;
	}

	.title {
		font-size: 14px;
		font-weight: 600;
		color: var(--base1000);
		white-space: nowrap;
	}

	.contentForm {
		width: 100%;
	}

	.childrenSlot {
		width: 100%;
	}

	.hint {
		font-size: 12px;
		font-weight: 400;
		color: var(--base400);
		white-space: nowrap;
	}
</style>
