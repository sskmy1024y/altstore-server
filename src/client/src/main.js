import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: STORE_NAME,
  },
});

export default app;
