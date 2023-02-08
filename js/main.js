let eventBus = new Vue();

Vue.component('container', {
    data() {
        return {
            columns: [
                [],
                [],
                [],
                [],

            ],
            isEdit: false,
            isReason: false,
        }
    },
    template: `
<div>
    <create-card v-if="!isEdit && !isReason"></create-card>
    <edit v-if="isEdit"></edit>
    <reason v-if="isReason"></reason>
    <div class="container">
        <planned class="column column1" :column="columns[0]" :idColumn="0" :isEdit="isEdit" v-if="!isEdit && !isReason"></planned>
        <working class="column column2" :column="columns[1]" :idColumn="1" v-if="!isEdit && !isReason"></working>
        <testing class="column column3" :column="columns[2]" :idColumn="2" v-if="!isEdit && !isReason"></testing>     
        <completed class="column column4" :column="columns[3]" :idColumn="3" v-if="!isEdit && !isReason"></completed>            
    </div>
</div>
    `,
    mounted() {
        if (localStorage.planned) {
            this.columns[0] = JSON.parse(localStorage.planned);
        }
        if (localStorage.working) {
            this.columns[1] = JSON.parse(localStorage.working);
        }
        if (localStorage.testing) {
            this.columns[2] = JSON.parse(localStorage.testing);
        }
        if (localStorage.completed) {
            this.columns[3] = JSON.parse(localStorage.completed);
        }
        eventBus.$on('card-submitted', createdCard => {
            this.columns[0].push(createdCard);
            this.save();
        })
        // eventBus.$on('del-card', index => {
        //     this.columns[0].splice(index, 1);
        //     this.save();
        // })
        eventBus.$on('edit-card', (index, idColumn) => {
            this.isEdit = true;
            eventBus.$on('edit-submitted', editCard => {
                if (editCard.title) this.columns[idColumn][index].title = editCard.title;
                if (editCard.description) this.columns[idColumn][index].description = editCard.description;
                if (editCard.deadlineTime) this.columns[idColumn][index].deadlineTime = editCard.deadlineTime;
                if (editCard.deadlineDate) this.columns[idColumn][index].deadlineDate = editCard.deadlineDate;
                if (editCard.editTime) this.columns[idColumn][index].editTime = editCard.editTime;
                if (editCard.editDate) this.columns[idColumn][index].editDate = editCard.editDate;
                this.isEdit = false;
                this.save();
            })
        })
        eventBus.$on('next-column', (index, id) => {
            if (id === 2) {
                this.columns[id][index].completed = this.completed(index, id);
                this.columns[id + 1].push(this.columns[id][index]);
                this.columns[id].splice(index, 1);
            } else {
                this.columns[id + 1].push(this.columns[id][index]);
                this.columns[id].splice(index, 1);
            }
            this.save();
        })
        // eventBus.$on('previous-column', (index, id) => {
        //     this.isReason = true;
        //     eventBus.$on('reason-submitted', reason => {
        //         this.columns[id][index].reason = reason.reason;
        //         this.columns[id - 1].unshift(this.columns[id][index]);
        //         this.columns[id].splice(index, 1);
        //         this.isReason = false;
        //         this.save();
        //     });
        // })
    },
    methods: {
        save() {
            localStorage.planned = JSON.stringify(this.columns[0]);
            localStorage.working = JSON.stringify(this.columns[1]);
            localStorage.testing = JSON.stringify(this.columns[2]);
            localStorage.completed = JSON.stringify(this.columns[3]);
        },
        completed(index, id) {
            let Data = new Date();
            let date = this.columns[id][index].deadlineDate.split('-');
            let time = this.columns[id][index].deadlineTime.split(':');

            if (Data.getFullYear() > Number(date[0])) return false;
            else if (Data.getFullYear() < Number(date[0])) return true;
            else {
                if (Number(Data.getMonth() + 1) > Number(date[1])) return false;
                else if (Number(Data.getMonth() + 1) < Number(date[1])) return true;
                else {
                    if (Number(Data.getDate()) > Number(date[2])) return false;
                    else if (Number(Data.getDate()) < Number(date[2])) return true;
                    else {
                        if (Number(Data.getHours()) > Number(time[0])) return false;
                        else if (Number(Data.getHours()) < Number(time[0])) return true;
                        else {
                            if (Number(Data.getMinutes()) > Number(time[1])) return false;
                            else if (Number(Data.getMinutes()) <= Number(time[1])) return true;
                        }
                    }
                }
            }
        }
    }
})

Vue.component('planned', {
    props: {
        column: {
            type: Array,
            required: true
        },
        idColumn:{
            type: Number,
            required: true
        },
    },
    mounted() {
        if (localStorage.planned) {
            this.column = JSON.parse(localStorage.planned);
        }
    },
    methods: {
    },
    template: `
<div>
    <card v-for="(card, index) in column" :key="index" :index="index" :card="card" :idColumn="idColumn" class="card" >
</card>
</div>
    `
})


Vue.component('working', {
    props: {
        column: {
            type: Array,
            required: true
        },
        idColumn:{
            type: Number,
            required: true
        },
    },
    mounted() {
        if (localStorage.working) {
            this.column = JSON.parse(localStorage.working);
        }
    },
    methods: {
    },
    template: `
<div>
    <card v-for="(card, index) in column" :key="index" :index="index" :card="card" :idColumn="idColumn" class="card" >
</card>
</div>
    `
})

Vue.component('testing', {
    props: {
        column: {
            type: Array,
            required: true
        },
        idColumn:{
            type: Number,
            required: true
        },
    },
    mounted() {
        if (localStorage.testing) {
            this.column = JSON.parse(localStorage.testing);
        }
    },
    methods: {
    },
    template: `
<div>
    <card v-for="(card, index) in column" :key="index" :index="index" :card="card" :idColumn="idColumn" class="card" >
</card>
</div>
    `
})

Vue.component('completed', {
    props: {
        column: {
            type: Array,
            required: true
        },
        idColumn:{
            type: Number,
            required: true
        },
    },
    mounted() {
        if (localStorage.completed) {
            this.column = JSON.parse(localStorage.completed);
        }
    },
    methods: {
    },
    template: `
<div>
    <card v-for="(card, index) in column" :key="index" :index="index" :card="card" :idColumn="idColumn" class="card" >
</card>
</div>
    `
})

Vue.component('card', {
    props: {
        card: {
            type: Object,
            required: true
        },
        idColumn: {
            type: Number,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    methods: {
        delCard(index) {
            eventBus.$emit('del-card', index);
        },
        editCard(index, idColumn) {
            eventBus.$emit('edit-card', index, idColumn)
        },
        previousColumn(index, idColumn) {
            eventBus.$emit('previous-column', index, idColumn)
        },
        nextColumn(index, idColumn) {
            eventBus.$emit('next-column', index, idColumn)
        }
    },
    template: `
<div :class="{completed: card.completed, nocompleted: card.completed == false}">
        <div class="card_title_block">
            <h2 class="card_title">{{card.title}}</h2>
            <button v-if="idColumn === 0" @click="delCard(index)">delete</button>
            <button v-if="idColumn !== 3" @click="editCard(index, idColumn)">edit</button>
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
        <div v-if="card.editTime" class="card_data_edit">
            <p>edit:</p>
            <div class="card_edit_time">{{card.editTime}}</div>
            <div class="card_edit_data">{{card.editDate}}</div>
        </div>
        <div v-if="card.reason" class="card_reason">
            <p>reason:</p>
            <div class="card_reason">{{card.reason}}</div>
        </div>
        <div class="card_deadline">
            <p>deadline:</p>
            <div class="card_deadline_time">{{card.deadlineTime}}</div>
            <div class="card_deadline_data">{{card.deadlineDate}}</div>
        </div>
        <div v-if="idColumn !==3" class="move">
            <div v-if="idColumn ===2" class="left_arrow">
                <button @click="previousColumn(index, idColumn)">&#5130</button>
            </div>
            <div class="right_arrow">
                <button @click="nextColumn(index, idColumn)">&#5125</button>
            </div>
        </div>
</div>
    `
})

Vue.component('reason', {
    data() {
        return {
            reason: null
        }
    },
    methods: {
        onSubmit() {
            if (this.reason) {
                let reason = {
                    reason: this.reason
                }
                eventBus.$emit('reason-submitted', reason);
            }
            this.reason = null
        }
    },
    template: `
<form class="reason-form" @submit.prevent="onSubmit">
    <h2>Reason</h2>
    <p>
        <label for="reason">Reason:</label>
        <input id="reason" v-model="reason" placeholder="reason">
    </p>
    <p>
        <input type="submit" value="Save"> 
    </p>
</form>
    `
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
            if (this.title || this.description || this.deadlineTime || this.deadlineDate) {
                let Data = new Date()
                let editCard = {
                    title: this.title,
                    description: this.description,
                    deadlineTime: this.deadlineTime,
                    deadlineDate: this.deadlineDate,
                    editTime: Data.getHours() + ':' + Data.getMinutes(),
                    editDate: Data.getFullYear() + '-' + Number(Data.getMonth() + 1) + '-' + Data.getDate(),
                }
                eventBus.$emit('edit-submitted', editCard);
            } else {
                let editCard = {}
                eventBus.$emit('edit-submitted', editCard);
            }
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
                    date: Data.getFullYear() + '-' + Number(Data.getMonth() + 1) + '-' + Data.getDate(),
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

Vue.component('note', {})

let app = new Vue({
    el: '#app',
    data: {},
    computed: {},

    methods: {},
})
