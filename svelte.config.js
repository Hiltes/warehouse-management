/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
	  alias: {
		$db: 'src/db',
		$stores: 'src/stores' // Dodaj alias dla stores
	  }
	}
  };
  
  export default config;
  