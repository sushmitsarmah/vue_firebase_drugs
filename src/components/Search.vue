<template>
    <section class="search">
        <div class="hero-body">
               
            <div class="container has-text-centered">
                
                <div class="column is-6 is-offset-3">
                    <div class="box">
                        
                        <div class="field is-grouped">
                            <p class="control is-expanded">
                                <b-autocomplete
                                    rounded
                                    v-model="name"
                                    :data="filteredDataArray"
                                    placeholder="enter drug or mechanism name"
                                    icon="magnify"
                                    @select="option => selected = option">
                                    <template slot="empty">No results found</template>
                                </b-autocomplete>
                            </p>
                            <p class="control">
                                <a class="button is-info" v-on:click="search">
                                    Search
                                </a>
                            </p>
                        </div>
                            
                    </div>
                </div>

                <section class="section">
                    <div class="container">
                        <div class="columns is-desktop is-mobile">
                            <div class="column is-half-desktop is-half-mobile">
                                <p>Drugs:</p>
                                <div class="box has-background-success is-shadowless">
                                    <p class="suggestion-name" v-for="(drugname, index) in sg_drugnames" :key="index" v-on:click="name = drugname">
                                        {{drugname}}
                                    </p>
                                </div>
                            </div>
                            <div class="column is-half-desktop is-half-mobile">
                                <p>Mechanisms:</p>
                                <div class="box has-background-success is-shadowless ">
                                    <p class="suggestion-name" v-for="(mechanism, index) in sg_mechanisms" :key="index" v-on:click="name = mechanism">
                                        {{mechanism}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="section">
                    <div class="container">
                        <div class="columns is-desktop is-mobile">
                            <div class="column is-desktop is-mobile">
                                <p>Result</p>
                                <div class="box has-background-success is-shadowless">
                                    <div v-if="selected_type === 'mechanism'">
                                        <p v-for="(drugname, index) in result_mechanism" :key="index">
                                            {{drugname}}
                                        </p>
                                    </div>
                                    <div v-else-if="selected_type === 'drug'">
                                        <p>
                                            {{result_drugs}}
                                        </p>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </section>                

            </div>
        </div>
    </section>
</template>

<script>

const API = 'https://us-central1-john1987-fd8fe.cloudfunctions.net/api';
// const API = 'http://localhost:3000';

export default {
    name: 'Search',
    props: {
        msg: String
    },
    data() {
        return {
            data: [],
            name: '',
            selected: null,
            drugnames: [],
            mechanisms: [],
            sg_drugnames: [],
            sg_mechanisms: [],
            selected_type: null,
            result_mechanism: [],
            result_drugs: ''
        }
    },
    mounted () {
        this.axios
        .get(`${API}/suggestions`)
        .then(response => {
            this.drugnames = response.data.mainnames;
            this.mechanisms = response.data.mechanisms;
            this.data = this.drugnames.concat(this.mechanisms);
        });
    },    
    methods: {
        search: function (event) {
            if( this.drugnames.indexOf(this.name) !== -1 ) {
                this.selected_type = 'drug'
            }

            if( this.mechanisms.indexOf(this.name) !== -1 ) {
                this.selected_type = 'mechanism'
            }

            this.axios
            .get(`${API}/search/${this.selected_type}/${this.name}`)
            .then(response => {
                const result = response.data.result;
                if(this.selected_type === 'drug') {
                    this.result_mechanism = [];
                    this.result_drugs = JSON.stringify(result, null, 4);
                } else {
                    this.result_drugs = '';
                    this.result_mechanism = result;
                }
            });
        }
    },
    computed: {
        filteredDataArray() {
            this.result_mechanism = [];
            this.result_drugs = '';

            this.sg_drugnames = this.drugnames.filter( option => {
                return this.name && option
                    .toString()
                    .toLowerCase()
                    .indexOf(this.name.toLowerCase()) >= 0
            });

            this.sg_mechanisms = this.mechanisms.filter( option => {
                return this.name && option
                    .toString()
                    .toLowerCase()
                    .indexOf(this.name.toLowerCase()) >= 0
            });

            return this.data.filter((option) => {
                return option
                    .toString()
                    .toLowerCase()
                    .indexOf(this.name.toLowerCase()) >= 0
            })
        }
    }    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.suggestion-name {
    cursor: pointer;
}
</style>
