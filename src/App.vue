<template>
  <div id="app">
        <Navbar></Navbar>
        <section class="hero is-info is-fullheight">
            <Search></Search>
        </section>       
  </div>
</template>


<script>
import Search from './components/Search.vue'
import Navbar from './components/Navbar.vue'

export default {
    name: 'app',
    components: {
        Search,
        Navbar
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
