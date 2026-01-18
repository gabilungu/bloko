import { browser } from '$app/environment';

/**
 * DetailedModeStore - Controls whether detailed information (sort, timestamps) is shown
 */
class DetailedModeStore {
	#value = $state(browser ? localStorage.getItem('detailedMode') === 'true' : false);

	get value() {
		return this.#value;
	}

	toggle() {
		this.#value = !this.#value;
		if (browser) localStorage.setItem('detailedMode', String(this.#value));
	}

	set(val) {
		this.#value = val;
		if (browser) localStorage.setItem('detailedMode', String(val));
	}
}

export const detailedMode = new DetailedModeStore();
