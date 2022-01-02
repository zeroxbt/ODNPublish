const util = require('util');
const exec = util.promisify(require('child_process').exec);
const randomWords = require('random-words');
const DKGClient = require('dkg-client');

const OT_NODE_HOSTNAME = '0.0.0.0';
const OT_NODE_PORT = '8900';

async function publish(){
  try{
    (async () => {
      // initialize connection to your DKG Node
      let options = { endpoint: OT_NODE_HOSTNAME, port: OT_NODE_PORT, useSSL: false, loglevel: 'info' };
      const dkg = new DKGClient(options);

      // get info about endpoint that you are connected to
      await dkg.nodeInfo().then((result) => {
        console.log('\x1b[35mDisable SSL as self signed certs cannot be used with V6 Beta.')
        console.log('\x1b[35mCurrently running OT Node version: \x1b[32m'+result.version)
        console.log(' ')
      });
	  
	  keywords = await randomWords({ min: 3, max: 10 })
	  
      publish_options = {
          filepath: '/root/ODNPublish/Product.json',
          assets: ['0x123456789123456789123456789'],
          keywords: keywords,
          visibility: true
      };

      console.log('\x1b[35mPublishing Product.json found in this directory...')
	  console.log('\x1b[35mPublishing data with random keywords: \x1b[32m'+keywords)
      await dkg.publish(publish_options).then((result) => {
          if(result.status == 'FAILED'){
            console.log('\x1b[31mPublish Failed!')
            console.log('\x1b[35m',result.error)
            return;
          }

          assertion_id = result.data.id
          console.log('\x1b[32mPublish Completed!')
          console.log(' ')
          console.log('\x1b[35mThe assertion id used for this publish is: \x1b[32m'+assertion_id)

          assertion_options = {
              ids: [
                  assertion_id
              ]
          };

          console.log('\x1b[35mWaiting for Assertion to complete...')
          dkg.resolve(assertion_options).then((result) => {
            if(result.status == 'FAILED'){
              console.log('\x1b[31mAssertion Failed!')
              console.log('\x1b[35m',result.error)
              return;
            }

            data = result.data
            console.log('\x1b[32mAssertion Completed!')
            console.log(' ')

            console.log('\x1b[35mHeres a string of the data!')
            console.log('\x1b[32m',JSON.stringify(data));
            console.log(' ')
            console.log('\x1b[35mCheck out your node logs to see your node working!')
          });
      });

    })();
    }catch(e){
        console.log('\x1b[31m',e);
    }
  }
publish();
