module.exports = {
    address: {
        type: 'string',
        primary: true
    },
    transfer: {
        type: 'relationship',
        relationship: 'TRANSFER',
        direction: 'out',
        target: 'Account',
        cascade: 'delete',
        properties: {
            amount: "number",
            blockheight: "integer",
            date: "datetime"
        },
        eager: true
    }
}