const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const Identities = require('orbit-db-identity-provider')

// optional settings for the ipfs instance
const ipfsOptions = {
    EXPERIMENTAL: {
      pubsub: true
    },
  }


const options = { id: 'test1' }

async function main() {
    const ipfs = await IPFS.create(ipfsOptions)
    const identity = await Identities.createIdentity(options)
    const orbitdb = await OrbitDB.createInstance(ipfs,  { identity: identity })
    const optionsToWrite = {
        accessController: {
            type: 'orbitdb', //OrbitDBAccessController
            write: [orbitdb.identity.id, '04ad4d2a7812cac1f0e6331edf22cec1a74b9694de6ad222b7cead06f79ec44a95e14b002ee7a0f6f03921fcf2ff646724175d1d31de4876c99dcc582cde835b4c'],
          },
      }
    const db = await orbitdb.docs('peer1-db', optionsToWrite)
    await db.put({ _id: 'test', name: 'test-doc-db', category: 'distributed' })
    const address = db.address.toString()



    await db.access.grant('write', '04ad4d2a7812cac1f0e6331edf22cec1a74b9694de6ad222b7cead06f79ec44a95e14b002ee7a0f6f03921fcf2ff646724175d1d31de4876c99dcc582cde835b4c') // grant access to identity2

    const db2 = await orbitdb.docs(address)

    await db2.load()

    const address2 = db2.address.toString()

    const identitydb2 = db2.identity
    console.log(identitydb2.toJSON(), 'identity for database 2')

    console.log(address2, 'peer2 database address')

    await db2.put({ _id: 'test2', name: 'test-doc-db2', category: 'nil' })


    console.log(identity.toJSON(), 'peer1 database identity')

    console.log(identity.publicKey, 'public key')

    console.log(address, 'peer1 database address')

    // const value = db.get('')
    // console.log(value, 'value from peer 1')

    const value2 = db2.get('')
    console.log(value2, 'value from peer 1')
  }
  
  main()