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
    mounted(){
        if (localStorage.todo) {
            this.column1 = JSON.parse(localStorage.todo)
        }
        if (localStorage.todo2) {
            this.column2 = JSON.parse(localStorage.todo2)
        }
        if (localStorage.todo3) {
            this.column3 = JSON.parse(localStorage.todo3)
        }
        eventBus.$on('card-submitted', createdCard => {
            this.column1.push(createdCard)
            this.save();
        })
        eventBus.$on('del-card', index => {
            this.column1.splice(index, 1)
            this.save();
        })
    },
    methods:{
        save() {
            localStorage.todo = JSON.stringify(this.column1);
            localStorage.todo2 = JSON.stringify(this.column2);
            localStorage.todo3 = JSON.stringify(this.column3);
        }
    }
})

Vue.component('create-card', {

    data() {
        return {
            time: null,
            date: null,
            title: null,
            description: null,
            deadlineTime: null,
            deadlineDate: null,



        }
    },
    methods: {
        onSubmit() {
            if (this.title && this.description && this.deadlineTime && this.deadlineDate) {
                let Data = new Date()
                let createdCard = {
                    time: Data.getHours() + ':' + Data.getMinutes(),
                    date: Data.getFullYear() + '-' + Data.getMonth() + '-' + Data.getDate(),
                    title: this.title,
                    description: this.description,
                    deadlineTime: this.deadlineTime,
                    deadlineDate: this.deadlineDate,
                }
                eventBus.$emit('card-submitted', createdCard);
                this.time = null
                this.date = null
                this.title = null
                this.description = null
                this.deadlineTime = null
                this.deadlineDate = null
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
        <input id="time" type="time" v-model="deadlineTime" placeholder="time">
    </p>
    <p>
        <label for="date">Date:</label>
        <input id="date" type="date" v-model="deadlineDate" placeholder="date">
    </p>
    <p>
        <input type="submit" value="Submit"> 
    </p>
</form>
    `
})


Vue.component('column1', {
    props: {
        column1: {
            type: Array,
            required: true
        }
    },
    methods:{
      delCard(index){
          eventBus.$emit('del-card', index);
      }
    },
    template: `
<div>
    <div v-for="(card, index) in column1" :key="index">
        <div class="card_title_block">
            <h2 class="card_title">{{card.title}}</h2>
            <button @click="delCard(index)">X</button>
        </div>
        <div class="card_data_create">
            <div class="card_time">{{card.time}}</div>
            <div class="card_data">{{card.data}}</div>
        </div>
        <div class="card_description">{{card.description}}</div>
        <div class="card_deadline">
            <div class="card_deadline_time">{{card.deadlineTime}}</div>
            <div class="card_deadline_data">{{card.deadlineDate}}</div>
        </div>

    </div>
</div>
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