<script>
import Button from "./component/Button.svelte";
import Title from "./component/Title.svelte";

export let name;

const sourceLink = `altstore://source?url=${HOST}`
</script>

<main>
	<div class="center header">
		<Title name={name} />
		<h4>A home for apps that push the boundaries of iOS.
			<br/>No jailbreak required.</h4>
	</div>
	<div>
		<Button label={"Add to AltStore"} link={sourceLink} />
	</div>
	<div>
		<footer>
			<p>AltStore is a property of AltStore LLC and in no way is associated with @sskmy1024y.</p>
		</footer>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	.center {
		margin: auto;
    text-align: center;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.header {
		width: 90%;
		max-width: 960px;
		padding-top: 40px;
	}

	@media only screen and (max-width: 768px) {
		.header {
				padding: 10% 0;
		}
	}
</style>
