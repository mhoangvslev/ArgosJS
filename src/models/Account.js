module.exports = {
    address: {
        type: 'string',
        primary: true
    },
    send: {
        type: 'relationship',
        relationship: 'SEND',
        direction: 'out',
        target: 'Account',
        cascade: 'delete',
        properties: {
            amount: "number"
        },
        eager: true
    },

    receive: {
        type: 'relationship',
        relationship: 'RECEIVE',
        direction: 'in',
        target: 'Account',
        cascade: 'delete',
        properties: {
            amount: "number"
        },
        eager: true
    }
}