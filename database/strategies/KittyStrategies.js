const ethers = require("ethers");
const neo4j = require("neo4j-driver").v1;

async function des_formatID(kittyId, contractFuncs) {
    return ethers.utils.bigNumberify(kittyId.toHexString()).toNumber();
}

function vs_formatAvatar(kittyId) {
    return 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/' + kittyId + '.svg';
}

function vs_formatId(kittyId) {
    return 'https://www.cryptokitties.co/kitty/' + kittyId;
}

module.exports = {
    DataExtractionStrategy: {
        0: {
            propName: "kittyId",
            fromData: { attrName: "kittyId", process: des_formatID }
        },
        1: {
            propName: "matronId",
            fromData: { attrName: "matronId", process: des_formatID }
        },
        2: {
            propName: "sireId",
            fromData: { attrName: "sireId", process: des_formatID }
        },
        3: {
            propName: "genes",
            fromData: { attrName: "genes" }
        },
        4: {
            propName: "owner",
            fromData: { attrName: "owner" }
        },
        /*5: {
            propName: "generation",
            contractCall: {
                funcName: "getKitty",
                args: {
                    kittyId: (kittyId) => { return ethers.utils.bigNumberify(kittyId).toHexString() }
                },
                resAttr: "generation",
                process: des_formatID
            },
        }*/
    },
    PersistenceStrategy: {
        NodeStrategy: {
            0: {
                nodeType: "Kitty",
                nodeAlias: "kitty",
                mergeStrategy: {
                    kittyId: "kittyId",
                    matronId: "matronId",
                    sireId: "sireId",
                    genes: "genes",
                    owner: "owner",
                    //generation: "generation"
                }
            },
            1: {
                nodeType: "Kitty",
                nodeAlias: "matron",
                mergeStrategy: {
                    kittyId: "matronId"
                }
            },
            2: {
                nodeType: "Kitty",
                nodeAlias: "sire",
                mergeStrategy: {
                    kittyId: "sireId",
                }
            }
        },
        RelationshipStrategy: {
            0: {
                relType: "CHILD",
                relAlias: "maternity",
                direction: "out",
                source: "kitty",
                target: "matron",
                createStrategy: {
                    date: "eventTime",
                    blockheight: "blockheight",
                }
            },
            1: {
                relType: "CHILD",
                relAlias: "paternity",
                direction: "out",
                source: "kitty",
                target: "sire",
                createStrategy: {
                    date: "eventTime",
                    blockheight: "blockheight",
                }
            }
        }
    },
    VisualisationStrategy: {
        NodeStrategy: {
            kittyId: [
                {
                    infoName: "id",
                    htmlStyling: {
                        htmlTag: "a",
                        htmlAttr: {
                            src: vs_formatId,
                            target: "_blank"
                        }
                    }
                },
                {
                    infoName: "avatar",
                    htmlStyling: {
                        htmlTag: "img",
                        htmlAttr: {
                            src: vs_formatAvatar,
                            height: "200px",
                            width: "200px",
                        }
                    }
                }
            ],
            matronId: [{
                infoName: "dam",
                htmlStyling: {
                    htmlTag: "a",
                    htmlAttr: {
                        src: vs_formatId,
                        target: "_blank"
                    }
                },
            }],
            sireId: [{
                infoName: "sire",
                htmlStyling: {
                    htmlTag: "a",
                    htmlAttr: {
                        src: vs_formatId,
                        target: "_blank"
                    },
                }
            }],
            owner: [{
                infoName: "owner",
                htmlStyling: {
                    htmlTag: "a",
                    htmlAttr: {
                        src: (ownerAdress) => { return "https://www.cryptokitties.co/profile/" + ownerAdress; },
                        target: "_blank"
                    },
                }
            }]
        },
        EdgeStrategy: {
            date: [{
                infoName: "birthday"
            }],
            blockheight: [{
                infoName: "blockheight"
            }]
        }

    }
}