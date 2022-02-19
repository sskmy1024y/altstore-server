<script>
  export let label;
  export let link;
</script>

<button type="button">
  <a href={link}>{label}</a>
</button>

<style>
  a {
      color: white;
      text-decoration: none;
  }

  button {
      border: none;
      border-radius: 18px;
      background-color: rgba(255, 253, 249, 0.15);
      width: 100%;
      height: 60px;
      font-size: 24px;
      font-weight: normal;
      color: #ffffff;
      line-height: 1.6;
      text-align: center;
  }
</style>
