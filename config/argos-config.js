module.exports = {
    providers: {
        timeout: 0,
        infura: {
            network: "mainnet",
            projectId: "3c18b936079c4eeb9c3a618389e15f62"
        },
        etherscan: {
            network: 'homestead',
            api: '6YJCSZM2GPG91Y5VHQ2EACNWSIAMIBNFDR'
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
        }
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
            bolt: 'bolt://localhost:7687',
            http: 'http://localhost:7474',
            https: 'https://localhost:7473',
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
        //export: '/app/database/import/' 
        export: '/home/minhhoangdang/.config/Neo4j Desktop/Application/neo4jDatabases/database-c4715127-a54f-40e9-9ec2-9c349d349e32/installation-3.5.6/import/'
    }
}