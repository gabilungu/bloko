<script>
	let { data } = $props();
	const { connectionInfo } = data;
</script>

<div class="info-page">
	<h1>Connection Info</h1>

	<section class="info-section">
		<h2>PostgreSQL</h2>
		{#if connectionInfo.pg}
			<div class="info-grid">
				<div class="info-row">
					<span class="label">Host</span>
					<span class="value">{connectionInfo.pg.host}</span>
				</div>
				<div class="info-row">
					<span class="label">Port</span>
					<span class="value">{connectionInfo.pg.port}</span>
				</div>
				<div class="info-row">
					<span class="label">Database</span>
					<span class="value">{connectionInfo.pg.database}</span>
				</div>
			</div>
		{:else}
			<p class="not-configured">Not configured</p>
		{/if}
	</section>

	<section class="info-section">
		<h2>S3 Storage</h2>
		{#if connectionInfo.s3}
			<div class="info-grid">
				<div class="info-row">
					<span class="label">Endpoint</span>
					<span class="value">{connectionInfo.s3.endpoint}</span>
				</div>
				<div class="info-row">
					<span class="label">Region</span>
					<span class="value">{connectionInfo.s3.region}</span>
				</div>
				<div class="info-row">
					<span class="label">Bucket</span>
					<span class="value">{connectionInfo.s3.bucket}</span>
				</div>
			</div>
		{:else}
			<p class="not-configured">Not configured</p>
		{/if}
	</section>
</div>

<style>
	.info-page {
		max-width: 600px;
		margin: 0 auto;
		padding: 32px 24px;
	}

	h1 {
		font-size: 24px;
		font-weight: 600;
		color: var(--base900);
		margin-bottom: 32px;
	}

	.info-section {
		background: white;
		border: 1px solid var(--base200);
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 24px;
	}

	h2 {
		font-size: 16px;
		font-weight: 600;
		color: var(--base700);
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--base100);
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.info-row {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.label {
		font-size: 13px;
		font-weight: 500;
		color: var(--base500);
		min-width: 80px;
	}

	.value {
		font-size: 14px;
		font-family: monospace;
		color: var(--base900);
		background: var(--base50);
		padding: 4px 8px;
		border-radius: 4px;
	}

	.not-configured {
		font-size: 14px;
		color: var(--base400);
		font-style: italic;
	}
</style>
