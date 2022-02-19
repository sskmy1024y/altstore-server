<script>
	export let name;
</script>

<h1>Welcome to <b>{name}</b></h1>

<style>
	h1 {
    margin: 0 auto;
		color: rgb(255, 253, 249);
    font-weight: 200;
    text-align: center;
	}

	@media only screen and (max-width: 768px) {
    h1 {
        font-size: 300%;
    }
	}
</style>
