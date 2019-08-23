const users = require('./data/users.json')
const tickets = require('./data/tickets.json')
const organizations = require('./data/organizations.json')

const standard_input = process.stdin;

standard_input.setEncoding('utf-8');
let step = 0
let type = 0
let term = ''
let value = ''

const resource = [{
    key:'users',
    data: users
},{
    key:'tickets',
    data: tickets
},{
    key:'organizations',
    data: organizations
}]
const init = () => {
    step = 0
    type = 0
    term = ''
    value = ''
    console.log('select search options: \n * Press 0 to reset \n * Press 1 to search \n * Press 2 to view a list of searchable fields \n * Type \'exit\' to exit \n');
}
init()

standard_input.on('data', (data) => {

    // User input exit.
    if(data === 'exit\n'){
        // Program exit.
        console.log("User input complete, program exit.");
        process.exit();
    }else
    {
        if(step == 0) {
            switch (data.replace(/\n/g, '')) {

                case '0' :
                    init()
                    break;
                case '1' :
                    console.log('Select\n 1) User \n 2) Tickets \n 3) Organizations')
                    step++
                    break;
                case '2' :
                    getSearchableFields()
                    break;
                default :
                    console.log('Entered', data)


            }
        } else if (step == 1){
            type = data.replace(/\n/g, '')
            console.log('Enter search term \n')
            step++
        } else if (step == 2){
            term = data.replace(/\n/g, '')
            console.log('Enter search value \n')
            step++
        } else if (step == 3){
            value = data.replace(/\n/g, '')
            search()
        }
    }
});

const search = () => {
    const results = resource[type-1].data.filter(x => x[term] == value)

    if(results.length > 0) {
        results.map(result => {
            if(type == 1) {
                result.assignee_ticket_subject = resource[1].data.filter(x => x.assignee_id == result._id).map(d => d.subject)
                result.submitted_ticket_subject = resource[1].data.filter(x => x.submitter_id == result._id).map(d => d.subject)
                result.organization_name = resource[2].data.filter(x => x._id == result.organization_id).map(d => d.name)

            } else if(type == 2) {
                result.assignee_name = resource[0].data.filter(x => x._id == result.assignee_id).map(d => d.name)
                result.submitter_name = resource[0].data.filter(x => x._id == result.submitter_id).map(d => d.name)
                result.organization_name = resource[2].data.filter(x => x._id == result.organization_id).map(d => d.name)

            } else if(type == 3) {
                result.ticket_subject = resource[1].data.filter(x => x.organization_id == result._id).map(d => d.subject)
                result.user_name = resource[0].data.filter(x => x.organization_id == result._id).map(d => d.name)

            }
            printData(result, 1)
        })

    }
    else console.log('Search ' + resource[type-1].key + ' for ' + term + ' with a value of ' + value + '\n No results found')
    init()
}
const getSearchableFields = () => {
    resource.map(r => {
        console.log('--------------------------------------------\n Search ' + r.key + ' with')
        printData(r.data[0])
    })
    init()
}
const printData = (obj, isValue = null) => {
    const keys = Object.keys(obj)

    if(isValue) console.table(obj)
    else console.table(keys)
}