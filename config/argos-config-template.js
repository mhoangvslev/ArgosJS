module.exports = {
    providers: {
        timeout: 0,
        infura: {
            network: "mainnet",
            projectId: ""
        },
        etherscan: {
            network: 'homestead',
            api: ''
        },
        jsonrpc: {
            url: "http://localhost:8545",
            username: "",
            password: "",
            allowInsecure: true
        },
        web3: {
            host: ""
        },
        ipc: {
            path: "",
            network: ""
        },
        default: {
            network: "mainnet"
        },
        logSizePerOp: 500
    },

    datavis: {
        neovis: {
            node: {
                size: "size",
                community: "community"
            },
            relationship: {
                thickness: "amount",
                caption: false
            },
            layout: {
                improvedLayout: false,
                hierarchical: {
                    enabled: false,
                    sortMethod: "hubsize"
                }
            },
            arrows: true
        }
    },

    database: {
        neo4j: {
            bolt: 'bolt://localhost:17687',
            http: 'http://localhost:17474',
            https: 'https://localhost:17473',
            username: 'neo4j',
            password: 'argosjs',
            enterpriseMode: true,
            driverConf: {
                NEO4J_ENCRYPTED: 'ENCRYPTION_OFF',
                NEO4J_TRUST: 'TRUST_ALL_CERTIFICATES', // # TRUST_ALL_CERTIFICATES, TRUST_ON_FIRST_USE, TRUST_SIGNED_CERTIFICATES, TRUST_CUSTOM_CA_SIGNED_CERTIFICATES, TRUST_SYSTEM_CA_SIGNED_CERTIFICATES
                NEO4J_TRUSTED_CERTIFICATES: '',
                NEO4J_KNOWN_HOSTS: '127.0.0.1',

                NEO4J_MAX_CONNECTION_POOLSIZE: 1000,
                NEO4J_MAX_TRANSACTION_RETRY_TIME: 5000,
                NEO4J_LOAD_BALANCING_STRATEGY: 'least_connected', // least_connected or round_robin
                NEO4J_MAX_CONNECTION_LIFETIME: 36000,
                NEO4J_CONNECTION_TIMEOUT: 36000,
                NEO4J_DISABLE_LOSSLESS_INTEGERS: false,
                NEO4J_LOGGING_LEVEL: 'logging' // DEBUG, INFO, WARN and ERROR
            }
        }
    },
    contract: {
        export: '/app/database/import/',
        model: {
            Kitty: require("../database/models/Kitty.js"),
        },
        strategies: require("../database/strategies/KittyStrategies.js")
    }
}