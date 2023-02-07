let eventBus = new Vue();

Vue.component('container', {
    data() {
        return {
            column1: [],
            column2: [],
            column3: []

        }
    },
    template: `
<div>
    <create-card></create-card>
    <div class="container">
        <column1 class="column column1" :column1="column1"></column1>
        <column2 class="column column2" :column2="column2"></column2>
        <column3 class="column column2" :column3="column3"></column3>            
    </div>
</div>
    `,
    mounted() {
        eventBus.$on('card-submitted', createdCard => {
            this.column1.push(createdCard)
        })
    }
})



Vue.component('column1', {
    props: {
        column1: {
            type: Array,
            required: true
        }
    },
    template: `
<div>
    <div v-for="card in column1">
        <div class="card_title_block">
            <h2 class="card_title">{{card.title}}</h2>
            <button>X</button>
        </div>
        <div class="card_data_create">
            <div class="card_time">{{card.time}}</div>
            <div class="card_data">{{card.data}}</div>
        </div>
        <div class="card_description">{{card.description}}</div>
        <div class="card_deadline">
            <div class="card_deadline_time">{{card.deadline.time}}</div>
            <div class="card_deadline_data">{{card.deadline.data}}</div>
        </div>

    </div>
</div>
    `
})

Vue.component('create-card', {

    data() {
        return {
            time: null,
            date: null,
            title: null,
            description: null,
            deadline: {
                time: null,
                date: null
            },

        }
    },
    methods: {
        onSubmit() {
            if (this.title && this.description && this.deadline.time && this.deadline.date) {
                let Data = new Date()
                let createdCard = {
                    time: Data.getHours() + ':' + Data.getMinutes(),
                    date: Data.getDate() + ':' + Data.getMonth() + ':' + Data.getFullYear(),
                    title: this.title,
                    description: this.description,
                    deadline: {
                        time: this.time,
                        date: this.date
                    }
                }
                eventBus.$emit('card-submitted', createdCard);
                this.time = null
                this.date = null
                this.title = null
                this.description = null
                this.deadline.time = null
                this.deadline.date = null
            }
        }
    },
    template: `
<form class="created-form" @submit.prevent="onSubmit">
    <p>
        <label for="title">Title:</label>
        <input id="title" v-model="title" placeholder="title">
    </p>
    <p>
        <label for="description">Description:</label>
        <input id="description" v-model="description" placeholder="description">
    </p>
    <p>
        <label for="time">Time:</label>
        <input id="time" type="time" v-model="deadline.time" placeholder="time">
    </p>
    <p>
        <label for="date">Date:</label>
        <input id="date" type="date" v-model="deadline.date" placeholder="date">
    </p>
    <p>
        <input type="submit" value="Submit"> 
    </p>
</form>
    `
})

Vue.component('column2', {
    props: {
        column2: {
            type: Array,
            default() {
                return {}
            }
        }
    },
    template: `
<div>
    <div v-for="card in column2"></div>
</div>
    `
})

Vue.component('column3', {
    props: {
        column3: {
            type: Array,
            default() {
                return {}
            }
        }
    },
    template: `
<div>
    <div v-for="card in column3">
    
    </div>
</div>
    `
})

Vue.component('note', {})

let app = new Vue({
    el: '#app',
    data: {},
    computed: {},

    methods: {},
})