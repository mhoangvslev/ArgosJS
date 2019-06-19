const ethers = require("ethers");

async function formatValue (result, contractFuncs) {
    return ethers.utils.formatUnits(result, await contractFuncs.decimals());
}


module.exports = {
    DataExtractionStrategy: {
        0: {
            propName: "amount",
            fromData: {
                attrName: "value",
                process: formatValue
            }
        },
        1: {
            propName: "sender",
            fromData: { attrName: "from" }
        },
        2: {
            propName: "receiver",
            fromData: { attrName: "to" }
        }
    },
    PersistenceStrategy: {
        NodeStrategy: {
            0: {
                nodeType: "Account",
                nodeAlias: "sender",
                mergeStrategy: {
                    address: "sender"
                }
            },
            1: {
                nodeType: "Account",
                nodeAlias: "receiver",
                mergeStrategy: {
                    address: "receiver"
                }
            }
        },
        RelationshipStrategy: {
            0: {
                relType: "TRANSFER",
                relAlias: "transfer",
                direction: "out",
                source: "sender",
                target: "receiver",
                createStrategy: {
                    amount: "amount",
                    blockheight: "blockheight",
                    date: "eventTime"
                }
            }
        }
    }
}