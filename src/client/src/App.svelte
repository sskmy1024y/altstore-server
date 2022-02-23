<script>
import Button from "./component/Button.svelte";
import Title from "./component/Title.svelte";

export let name;

const sourceLink = `altstore://source?url=${HOST}/apps.json`
</script>

<main>
	<div class="center header">
		<Title name={name} />
		<h4>A home for apps that push the boundaries of iOS.
			<br/>No jailbreak required.</h4>
	</div>
	<div class="center add-to-store">
		<Button label={"Add to AltStore"} link={sourceLink} />
		<h6>Requires AltStore 1.5</h6>
	</div>
	<div>
		<footer>
			<p>AltStore server is a property of AltStore LLC and in no way is associated with @sskmy1024y.</p>
		</footer>
	</div>
</main>

<style>
	.center {
		margin: auto;
    text-align: center;
	}

	.header {
		width: 90%;
		max-width: 960px;
		padding: 40px 0;
	}

	@media only screen and (max-width: 768px) {
		.header {
			padding: 10% 0;
		}
	}

	.add-to-store {
		max-width: 290px;
	}
</style>
