let eventBus = new Vue();

Vue.component('container', {
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            column4: [],
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
        <column1 class="column column1" :column="column1" v-if="!isEdit && !isReason"></column1>
        <column2 class="column column2" :column="column2" v-if="!isEdit && !isReason"></column2>
        <column3 class="column column3" :column="column3" v-if="!isEdit && !isReason"></column3>     
        <column4 class="column column4" :column="column4" v-if="!isEdit && !isReason"></column4>            
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
        eventBus.$on('edit-card', (index, id) => {
            this.isEdit = true;
            eventBus.$on('edit-submitted', editCard => {
                if (id === 1) {
                    if (editCard.title) this.column1[index].title = editCard.title;
                    if (editCard.description) this.column1[index].description = editCard.description;
                    if (editCard.deadlineTime) this.column1[index].deadlineTime = editCard.deadlineTime;
                    if (editCard.deadlineDate) this.column1[index].deadlineDate = editCard.deadlineDate;
                    if (editCard.editTime) this.column1[index].editTime = editCard.editTime;
                    if (editCard.editDate) this.column1[index].editDate = editCard.editDate;
                } else if (id === 2) {
                    if (editCard.title) this.column2[index].title = editCard.title;
                    if (editCard.description) this.column2[index].description = editCard.description;
                    if (editCard.deadlineTime) this.column2[index].deadlineTime = editCard.deadlineTime;
                    if (editCard.deadlineDate) this.column2[index].deadlineDate = editCard.deadlineDate;
                    if (editCard.editTime) this.column2[index].editTime = editCard.editTime;
                    if (editCard.editDate) this.column2[index].editDate = editCard.editDate;
                } else {
                    if (editCard.title) this.column3[index].title = editCard.title;
                    if (editCard.description) this.column3[index].description = editCard.description;
                    if (editCard.deadlineTime) this.column3[index].deadlineTime = editCard.deadlineTime;
                    if (editCard.deadlineDate) this.column3[index].deadlineDate = editCard.deadlineDate;
                    if (editCard.editTime) this.column3[index].editTime = editCard.editTime;
                    if (editCard.editDate) this.column3[index].editDate = editCard.editDate;
                }
                this.isEdit = false;
                this.save();
            })
        })
        eventBus.$on('next-column', (index, id) => {
            if (id === 1) {
                this.column2.push(this.column1[index]);
                this.column1.splice(index, 1)
            } else if (id === 2) {
                this.column3.push(this.column2[index]);
                this.column2.splice(index, 1)
            }
            this.save();
        })
        eventBus.$on('previous-column', (index, id) => {
                this.isReason = true;
                eventBus.$on('reason-submitted', reason => {
                    this.column3[index].reason = reason.reason;
                    this.column2.unshift(this.column3[index]);
                    this.column3.splice(index, 1);
                    this.isReason = false;
                    this.save();
                });
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
                    editDate: Data.getFullYear() + '-' + Data.getMonth() + '-' + Data.getDate(),
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
        column: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            id: 1
        }
    },
    methods: {
        delCard(index) {
            eventBus.$emit('del-card', index);
        },
        editCard(index, id) {
            eventBus.$emit('edit-card', index, id)
        },
        nextColumn(index, id) {
            eventBus.$emit('next-column', index, id)
        }
    },
    template: `
<div>
    <div v-for="(card, index) in column" :key="index" class="card">
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
        <div v-if="card.reason" class="card_reason">
            <p>reason:</p>
            <div class="card_reason">{{card.reason}}</div>
        </div>
        <div class="move">
            <button @click="nextColumn(index, id)">&#5125</button>
        </div>

    </div>
</div>
    `
})


Vue.component('column2', {
    props: {
        column: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            id: 2
        }
    },
    methods: {
        editCard(index, id) {
            eventBus.$emit('edit-card', index, id)
        },
        nextColumn(index, id) {
            eventBus.$emit('next-column', index, id)
        }
    },
    template: `
<div>
    <div v-for="(card, index) in column" :key="index" class="card">
        <div class="card_title_block">
            <h2 class="card_title">{{card.title}}</h2>
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
        <div v-if="card.reason" class="card_reason">
            <p>reason:</p>
            <div class="card_reason">{{card.reason}}</div>
        </div>
        <div class="move">
            <button @click="nextColumn(index, id)">&#5125</button>
        </div>

    </div>
</div>
    `
})

Vue.component('column3', {
    props: {
        column: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            id: 3,
        }
    },
    methods: {
        editCard(index, id) {
            eventBus.$emit('edit-card', index, id)
        },
        previousColumn(index, id) {
            eventBus.$emit('previous-column', index, id)
        }
    },
    template: `
<div>
    <div v-for="(card, index) in column" :key="index" class="card">
        <div class="card_title_block">
            <h2 class="card_title">{{card.title}}</h2>
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
        <div v-if="card.reason" class="card_reason">
            <p>reason:</p>
            <div class="card_reason">{{card.reason}}</div>
        </div>
        <div class="move">
            <button @click="previousColumn(index, id)">&#5130</button>
            <button @click="nextColumn(index, id)">&#5125</button>
        </div>
    </div>
</div>
    `
})


Vue.component('column4', {
    props: {
        column: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            id: 4
        }
    },
    methods: {},
    template: `
<div>
    <div v-for="(card, index) in column" :key="index" class="card">
        <div class="card_title_block">
            <h2 class="card_title">{{card.title}}</h2>
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
        <div v-if="card.reason" class="card_reason">
            <p>reason:</p>
            <div class="card_reason">{{card.reason}}</div>
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

Vue.component('note', {})

let app = new Vue({
    el: '#app',
    data: {},
    computed: {},

    methods: {},
})