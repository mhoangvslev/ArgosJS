module.exports = {
    kittyId: {
        type: 'number',
        primary: true,
    },
    genes: {
        type: 'string',
    },
    generation: {
        type: 'number'
    },
    owner: {
        type: 'string'
    },
    avatar: {
        type: 'string',
        unique: true
    },
    child: {
        type: 'relationship',
        relationship: 'CHILD',
        direction: 'out',
        target: 'Kitty',
        cascade: 'delete',
        properties: {
            birthTime: "datetime",
            blockheight: "integer"
        },
        eager: true
    }
}