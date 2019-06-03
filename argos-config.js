module.exports = {
    providers: {
        infura: {
            network: "mainnet",
            projectId: "3c18b936079c4eeb9c3a618389e15f62"
        },
        etherscan: {
            network: 'homestead',
            api: '6YJCSZM2GPG91Y5VHQ2EACNWSIAMIBNFDR'
        },
        jsonrpc: {
            url: "https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=0a1e890ccfbf414ba96e4ded54fed48a",
            username: "minhhoangdang@hotmail.com",
            password: "ebusanta1122101",
            allowInsecure: false
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
                sizeProp: "size",
                communityProp: "community"
            },
            relationship: {
                thicknessProp: "amount",
                captionProp: false
            },
            layout: {
                hierarchical: false
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
        address: '0xf73b1F84E0C16cD56B0FAD03295213A3098De0DE',
        abi: '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]',
        export: '/home/minhhoangdang/.config/Neo4j Desktop/Application/neo4jDatabases/database-c4715127-a54f-40e9-9ec2-9c349d349e32/installation-3.5.6/import/' 
    },
}