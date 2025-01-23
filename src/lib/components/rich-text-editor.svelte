<script lang="ts">
	import { Color } from '@tiptap/extension-color';
	import ListItem from '@tiptap/extension-list-item';
	import TextStyle from '@tiptap/extension-text-style';
	import StarterKit from '@tiptap/starter-kit';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';

	let element = $state();
	let editor = $state();
	let count = $state(0);

	function getContent() {
		console.log(editor.getJSON());
	}

	let jsonContent = $derived(editor.getJSON());
	let htmlContent = $derived(editor.getHTML());

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Color.configure({ types: [TextStyle.name, ListItem.name] }),
				TextStyle.configure({ types: [ListItem.name] }),
				StarterKit
			],
			content: `
		  <h2>
			Hi there,
		  </h2>
		  <p>
			this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
		  </p>
		  <ul>
			<li>
			  That’s a bullet list with one …
			</li>
			<li>
			  … or two list items.
			</li>
		  </ul>
		  <p>
			Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
		  </p>
		  <pre><code class="language-css">body {
display: none;
}</code></pre>
		  <p>
			I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
		  </p>
		  <blockquote>
			Wow, that’s amazing. Good work, boy! 👏
			<br />
			— Mom
		  </blockquote>
		`,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});
</script>

{#if editor}
	<div class="control-group">
		<div class="button-group">
			<button
				onclick={() => console.log && editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				class={editor.isActive('bold') ? 'is-active' : ''}
			>
				Bold
			</button>
			<button
				onclick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				class={editor.isActive('italic') ? 'is-active' : ''}
			>
				Italic
			</button>
			<button
				onclick={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
				class={editor.isActive('strike') ? 'is-active' : ''}
			>
				Strike
			</button>
			<button
				onclick={() => editor.chain().focus().toggleCode().run()}
				disabled={!editor.can().chain().focus().toggleCode().run()}
				class={editor.isActive('code') ? 'is-active' : ''}
			>
				Code
			</button>
			<button onclick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>
			<button onclick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</button>
			<button
				onclick={() => editor.chain().focus().setParagraph().run()}
				class={editor.isActive('paragraph') ? 'is-active' : ''}
			>
				Paragraph
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
			>
				H1
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
			>
				H2
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				class={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
			>
				H3
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				class={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
			>
				H4
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
				class={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
			>
				H5
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
				class={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
			>
				H6
			</button>
			<button
				onclick={() => editor.chain().focus().toggleBulletList().run()}
				class={editor.isActive('bulletList') ? 'is-active' : ''}
			>
				Bullet list
			</button>
			<button
				onclick={() => editor.chain().focus().toggleOrderedList().run()}
				class={editor.isActive('orderedList') ? 'is-active' : ''}
			>
				Ordered list
			</button>
			<button
				onclick={() => editor.chain().focus().toggleCodeBlock().run()}
				class={editor.isActive('codeBlock') ? 'is-active' : ''}
			>
				Code block
			</button>
			<button
				onclick={() => editor.chain().focus().toggleBlockquote().run()}
				class={editor.isActive('blockquote') ? 'is-active' : ''}
			>
				Blockquote
			</button>
			<button onclick={() => editor.chain().focus().setHorizontalRule().run()}>
				Horizontal rule
			</button>
			<button onclick={() => editor.chain().focus().setHardBreak().run()}>Hard break</button>
			<button
				onclick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
			>
				Undo
			</button>
			<button
				onclick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
			>
				Redo
			</button>
			<button
				onclick={() => editor.chain().focus().setColor('#958DF1').run()}
				class={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
			>
				Purple
			</button>
		</div>
	</div>
{/if}
<div bind:this={element}></div>
<pre>{JSON.stringify(element, null, 2)}</pre>

<!-- <pre>{JSON.stringify(jsonContent, null, 2)}</pre> -->
<button onclick={() => getContent()}>Get Content</button>

<!-- <pre>{JSON.stringify(htmlContent, null, 2)}</pre> -->

<style>
	/* Basic editor styles */
	:global {
		.tiptap {
			--white: #fff;
			--black: #2e2b29;
			--black-contrast: #110f0e;
			--gray-1: rgba(61, 37, 20, 0.05);
			--gray-2: rgba(61, 37, 20, 0.08);
			--gray-3: rgba(61, 37, 20, 0.12);
			--gray-4: rgba(53, 38, 28, 0.3);
			--gray-5: rgba(28, 25, 23, 0.6);
			--green: #22c55e;
			--purple: #6a00f5;
			--purple-contrast: #5800cc;
			--purple-light: rgba(88, 5, 255, 0.05);
			--yellow-contrast: #facc15;
			--yellow: rgba(250, 204, 21, 0.4);
			--yellow-light: #fffae5;
			--red: #ff5c33;
			--red-light: #ffebe5;
			--shadow: 0px 12px 33px 0px rgba(0, 0, 0, 0.06), 0px 3.618px 9.949px 0px rgba(0, 0, 0, 0.04);
			& :first-child {
				margin-top: 0;
			}
			/* List styles */
			& ul,
			ol {
				padding: 0 1rem;
				margin: 1.25rem 1rem 1.25rem 0.4rem;
				& li p {
					margin-top: 0.25em;
					margin-bottom: 0.25em;
				}
			}
			/* Heading styles */
			& h1,
			h2,
			h3,
			h4,
			h5,
			h6 {
				line-height: 1.1;
				margin-top: 2.5rem;
				text-wrap: pretty;
			}
			& h1,
			h2 {
				margin-top: 3.5rem;
				margin-bottom: 1.5rem;
			}
			& h1 {
				font-size: 1.4rem;
			}
			& h2 {
				font-size: 1.2rem;
			}
			& h3 {
				font-size: 1.1rem;
			}
			& h4,
			h5,
			h6 {
				font-size: 1rem;
			}
			/* Code and preformatted text styles */
			& code {
				background-color: var(--purple-light);
				border-radius: 0.4rem;
				color: var(--black-contrast);
				font-size: 0.85rem;
				padding: 0.25em 0.3em;
			}
			& pre {
				background: var(--black);
				border-radius: 0.5rem;
				color: var(--white);
				font-family: 'JetBrainsMono', monospace;
				margin: 1.5rem 0;
				padding: 0.75rem 1rem;
				& code {
					background: none;
					color: inherit;
					font-size: 0.8rem;
					padding: 0;
				}
			}
			& blockquote {
				border-left: 3px solid var(--gray-3);
				margin: 1.5rem 0;
				padding-left: 1rem;
			}
			& hr {
				border: none;
				border-top: 1px solid var(--gray-2);
				margin: 2rem 0;
			}
		}
	}
</style>
