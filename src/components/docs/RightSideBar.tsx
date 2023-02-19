/** @jsxImportSource solid-js */
import { createSignal, createEffect } from 'solid-js';
import { locationSignal } from '../IslandLink';

function update() {
	function h2Finder() {
		const headings = document.querySelectorAll('h2');
		const h2Array: HTMLHeadingElement[] = [];
		headings.forEach((heading) => {
			h2Array.push(heading);
		});
		return h2Array;
	}

	// The markdown automatically converts each heading to an h2 with a linkable id
	// So, we can just grab all the h2s and use them as the ToC for the page

	const h2Array = h2Finder();

	// Create an array of li elements with links to each h2

	const ToC = h2Array.map((h2) => {
		if (!h2.id) return; // Skip if there is no id (e.g. it's a code block)
		const h2Id = h2.id;
		const h2Text = h2.innerText;
		return `<li><a href="#${h2Id}">${h2Text}</a></li>`;
	});

	// Grab the container and add the ToC to it

	const TOCContainer = document.querySelectorAll('.right-TOC');
	TOCContainer.forEach((container) => {
		if (!ToC.length) return;
		container.innerHTML =
			`<h2 class="text-2xl font-bold text-center">On This Page</h2> 
			<ul class="flex flex-col items-center">` +
			ToC.join('') +
			'</ul>';
	});
}
// Note that we do not return anything if there are no h2s on the page

export default function RightSideBar() {
	const [initialPath, setInitialPath] = createSignal();
	createEffect(() => {
		const location = locationSignal[0]();
		if (!initialPath()) {
			setInitialPath(location?.pathname);
		}
		update();
	});
	return (
		<aside
			class="right-TOC flex flex-col items-center"
			classList={{
				hidden: initialPath() !== locationSignal[0]()?.pathname,
			}}
		></aside>
	);
}
