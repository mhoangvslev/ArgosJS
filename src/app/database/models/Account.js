module.exports = {
    address: {
        type: 'string',
        primary: true
    },
    senders: {
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

    receivers: {
        type: 'relationship',
        relationship: 'SEND',
        direction: 'in',
        target: 'Account',
        cascade: 'delete',
        properties: {
            amount: "number"
        },
        eager: true
    }
}