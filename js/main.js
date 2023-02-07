let eventBus = new Vue();

Vue.component('container', {
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            column4: [],
            isEdit: false,

        }
    },
    template: `
<div>
    <create-card v-if="!isEdit"></create-card>
    <edit v-if="isEdit"></edit>
    <div class="container">
        <column1 class="column column1" :column1="column1" v-if="!isEdit"></column1>
        <column2 class="column column2" :column2="column2" v-if="!isEdit"></column2>
        <column3 class="column column3" :column3="column3" v-if="!isEdit"></column3>     
        <column4 class="column column4" :column4="column4" v-if="!isEdit"></column4>            
    </div>
</div>
    `,
    mounted() {
        if (localStorage.todo) {
            this.column1 = JSON.parse(localStorage.todo);
        }
        if (localStorage.todo2) {
            this.column2 = JSON.parse(localStorage.todo2);
        }
        if (localStorage.todo3) {
            this.column3 = JSON.parse(localStorage.todo3);
        }
        eventBus.$on('card-submitted', createdCard => {
            this.column1.push(createdCard);
            this.save();
        })
        eventBus.$on('del-card', index => {
            this.column1.splice(index, 1);
            this.save();
        })
        eventBus.$on('edit-card', (index, id) =>{
            this.isEdit = true;
            eventBus.$on('edit-submitted', editCard =>{
                if(id === 1){
                    if (editCard.title) this.column1[index].title = editCard.title;
                    if (editCard.description) this.column1[index].description = editCard.description;
                    if (editCard.deadlineTime) this.column1[index].deadlineTime = editCard.deadlineTime;
                    if (editCard.deadlineDate) this.column1[index].deadlineDate = editCard.deadlineDate;
                    if (editCard.editTime) this.column1[index].editTime = editCard.editTime;
                    if (editCard.editDate) this.column1[index].editDate = editCard.editDate;
                }
                this.isEdit = false;
                this.save();
            })

        })
    },
    methods: {
        save() {
            localStorage.todo = JSON.stringify(this.column1);
            localStorage.todo2 = JSON.stringify(this.column2);
            localStorage.todo3 = JSON.stringify(this.column3);
        },
    }
})

Vue.component('edit', {
    data() {
        return {
            title: null,
            description: null,
            deadlineTime: null,
            deadlineDate: null,
            editTime: null,
            editDate: null,
        }
    },
    methods: {
        onSubmit() {
            if(this.title || this.description || this.deadlineTime || this.deadlineDate){
                let Data = new Date()
                let editCard = {
                    title: this.title,
                    description: this.description,
                    deadlineTime: this.deadlineTime,
                    deadlineDate: this.deadlineDate,
                    editTime: Data.getHours() + ':' + Data.getMinutes(),
                    editDate: Data.getFullYear() + '-' + Data.getMonth() + '-' + Data.getDate(),
                }
                eventBus.$emit('edit-submitted', editCard);
            } else {
                let editCard = {

                }
                eventBus.$emit('edit-submitted', editCard);
            }
            // let editCard = {
            //     title: this.title,
            //     description: this.description,
            //     deadlineTime: this.deadlineTime,
            //     deadlineDate: this.deadlineDate,
            // }
            // eventBus.$emit('edit-submitted', editCard);
            this.title = null;
            this.description = null;
            this.deadlineTime = null;
            this.deadlineDate = null;
            this.editTime = null;
            this.editDate = null;

        }
    },
    template: `
<form class="edit-form" @submit.prevent="onSubmit">
    <h2>Edit</h2>
    <p>
        <label for="title-edit">Title edit:</label>
        <input id="title-edit" v-model="title" placeholder="title-edit">
    </p>
    <p>
        <label for="description-edit">Description edit:</label>
        <input id="description-edit" v-model="description" placeholder="description-edit">
    </p>
    <p>
        <label for="time-edit">Time edit:</label>
        <input id="time-edit" type="time" v-model="deadlineTime" placeholder="time-edit">
    </p>
    <p>
        <label for="date-edit">Date edit:</label>
        <input id="date-edit" type="date" v-model="deadlineDate" placeholder="date-edit">
    </p>
    <p>
        <input type="submit" value="Save"> 
    </p>
</form>
    `
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
    data(){
        return{
            id: 1
        }
    },
    methods: {
        delCard(index) {
            eventBus.$emit('del-card', index);
        },
        editCard(index, id) {
            eventBus.$emit('edit-card', index, id)
        }
    },
    template: `
<div>
    <div v-for="(card, index) in column1" :key="index" class="card">
        <div class="card_title_block">
            <h2 class="card_title">{{card.title}}</h2>
            <button @click="delCard(index)">delete</button>
            <button @click="editCard(index, id)">edit</button>
        </div>
        <div class="card_description"> 
            <p>description:</p>
            {{card.description}}
        </div>
        <div class="card_data_create">
            <p>created:</p>
            <div class="card_time">{{card.time}}</div>
            <div class="card_date">{{card.date}}</div>
        </div>
        <div class="card_deadline">
            <p>deadline:</p>
            <div class="card_deadline_time">{{card.deadlineTime}}</div>
            <div class="card_deadline_data">{{card.deadlineDate}}</div>
        </div>
        <div v-if="card.editTime" class="card_data_edit">
            <p>edit:</p>
            <div class="card_edit_time">{{card.editTime}}</div>
            <div class="card_edit_data">{{card.editDate}}</div>
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

Vue.component('column4', {
    props: {
        column4: {
            type: Array,
            default() {
                return {}
            }
        }
    },
    template: `
<div>
    <div v-for="card in column4">
    
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