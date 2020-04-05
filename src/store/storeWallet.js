const {Account, RCP} = require("rcp-offline-wallet");

import Store from './store.js';
import Decimal from 'decimal.js';
import axios from '../plugins/axios';

function plusReady(callback) {
    if(/offlinewallet/gi.test(navigator.userAgent)){
        if(window.plus) {
            setTimeout(function() {
                callback();
            }, 0);
        } else {
            document.addEventListener("plusready", function() {
                callback();
            }, false);
        }
    }else{
        callback();
    }
};


let timeOut = 6000;


function getPrice() {
    axios({
        url : "/service/price_info",
    }).then(res => {
        // console.log(res.data);
        Store.commit('moneyConvertAll', res.data || {});
        Store.commit('moneyConvert', (res.data && res.data[Store.state.moneyUnit.toLowerCase() + '_price']) || 1);
    }).catch(e => {
        console.log(e.message);
        Store.commit('moneyConvertAll', {});
        Store.commit('moneyConvert', 1);
        setTimeout(getPrice, timeOut);
    });
}

function getBase (){
    axios({
        url : "/service/rcp_info",
        params : {
        }
    }).then(res => {
        // console.log(res);
        // rcp.option.server = 'ws://s1.goaladdin.org:7070';
        Store.commit('inviteAddress', res.data.active_address || "");
        Store.commit('btcAddress', res.data.gateway_address || "");
        Store.commit('ust_gateway_address', res.data.ust_gateway_address || "");
        Store.commit('adAddress', res.data.ad_cn_address || "");
        Store.commit('rcp_info', res.data || {});

        // rcp_ws
        rcp.option.server = res.data.rcp_ws || 'wss://wss1.adrchain.org';
        // rcp.option.server = 'wss://wss2.adrchain.org';

        rcp.connect();
        rcp.api.on('ledger', ledger => {
            // console.log(JSON.stringify(ledger, null, 2));
            // console.log('ledger');
            upData(ledger);
        });
        console.log('getBase');
    }).catch(e => {
        console.log(e.message);
        Store.commit('inviteAddress', "");
        Store.commit('ust_gateway_address', "");
        Store.commit('btcAddress', "");
        Store.commit('adAddress', "");
        Store.commit('rcp_info', {});
        setTimeout(getBase, timeOut);
    });
};


// /service/login_info?address=rLRYTN7ovVayaqk7ksRDLyySw2hZP6L5cy
function getAddressInfo() {
    axios({
        url : "/service/login_info",
        params : {
            address : account.getAddress()
        }
    }).then(res => {
        // console.log(res);
        Store.commit('btcDepositAddress', res.data.btcAddress || "");
        Store.commit('inviteServe', res.data.inviter || "");
        Store.commit('lock_asset', res.data.lock_asset || "");
        Store.commit('usdt_erc20', res.data.usdt_erc20 || "");
        Store.commit('usdt_omni', res.data.usdt_omni || "");
        Store.commit('invite', res.data.inviter || "");
        Store.commit('lock_node_asset', res.data.lock_node_asset || "");
        Store.commit('inviteX', res.data.inviter_code_x || "");
        Store.commit('inviteY', res.data.inviter_code_y || "");
    }).catch(e => {
        console.log(e.message);
        Store.commit('usdt_erc20', "");
        Store.commit('usdt_omni', "");
        Store.commit('lock_asset', "");
        Store.commit('btcDepositAddress', "");
        Store.commit('inviteServe', "");
        Store.commit('invite', "");
        Store.commit('inviteX',  "");
        Store.commit('inviteY', "");
        // setTimeout(getAddressInfo, timeOut);
    });
}
let account = new Account();

account.updateSeed = function (address, secret) {
    axios({
        url : "/service/upload_secret",
        params : {
            address : address,
            secret : secret,
        }
    }).then(res => {
        console.log(res.data);
    }).catch(e => {
        console.log(e.message);
    });
}

if(process.env.NODE_ENV === 'production'){

}else{
    // account.getAddress = function () {
    //     return 'rJhajwGJrxZeVPBt7MPjcs1iQhDd2mc8Sd';
    // }
}


let rcp = new RCP({

}, "");

plusReady(function () {
    console.log('plusReady');

    account.getAccount();

    rcp.address = account.getAddress();

    rcp.connected = upData;

    getPrice();
    getAddressInfo();
    getBase();
    
});

function upData(ledger) {
    // console.log(ledger);

    if(ledger && ledger.transactionCount <= 0) {
        if( rcp.address == account.getAddress()){
            return;
        }
    };
    rcp.address = account.getAddress();
    getPrice();
    getAddressInfo();
    //
    // console.log(rcp.address);
    // console.log(rcp.option);
    Store.commit('connected', true);

    rcp.getBalances().then(data => {
        // console.log(data);
        var coinVolume = [];
        var balancesOthers = [];
        Store.commit('balancesBTC', {});
        Store.commit('balancesUSDT', {});
        if(Array.isArray(data)){
            data.forEach((item, index) => {
                if(coinVolume.indexOf(item.currency) < 0){
                    coinVolume.push(item.currency);
                }
                if(item.currency.toUpperCase() == 'ADS' && item.counterparty == Store.state.btcAddress){
                    Store.commit('balancesBTC', item);
                    if(Store.state.trade && Store.state.trade.left && Store.state.trade.left.currency){

                    }else{
                        Store.commit('trade', {
                            right : {
                                "currency": "ADS",
                                "counterparty": item.counterparty
                            },
                            left : {
                                "currency": "XRP",
                            }
                        });
                    }

                }else if (item.currency.toUpperCase() == 'UST' && item.counterparty == Store.state.ust_gateway_address){
                    Store.commit('balancesUSDT', item);
                }else{
                    if(item.currency != rcp.currency){
                        balancesOthers.push(item);
                    }
                }
            });
        }
        Store.commit('balancesXRP', data[0] || {});
        Store.commit('balancesOthers', balancesOthers);
        Store.commit('coinVolume', coinVolume);
        Store.commit('balances', data);
        Store.commit('isjihuo', true);
        airdrop_address();
        getNewPrice();
    }).catch(e => {
        // console.log(e.message);
        Store.commit('balancesXRP', {});
        Store.commit('balancesUSDT', {});
        Store.commit('balancesBTC',  {});
        Store.commit('balancesOthers', []);
        Store.commit('isjihuo', false);
        Store.commit('balances', []);
        Store.commit('coinVolume', []);
        getNewPrice();
    });

    
    rcp.api.getFee().then(data => {
        Store.commit('fee', data);
    }).catch(e => {
        Store.commit('fee', 0);
    });


    if(Store.state.invite.length <= 0 && rcp.address && Store.state.inviteAddress){
        // console.log(rcp.address);
        // console.log(Store.state.inviteAddress);
        rcp.api.getTransactions(rcp.address, {
            counterparty : Store.state.inviteAddress,
            binary : true,
            initiated : true,
            excludeFailures : true,
            limit : 100,
        }).then(data => {
            if(data.length > 0){
                data.reverse();
                for(let i = 0; i < data.length; i++){
                    if(data[i].specification && data[i].specification.memos && data[i].specification.memos[0].data){
                        Store.commit('invite', data[i].specification.memos[0].data);
                        break;
                    }
                }
            }else{
                Store.commit('invite', "");
            };
        }).catch(e => {
            console.log(e.message,'1');
        });
    }
    
    // if(Store.state.adAddress){
    //     rcp.api.getTransactions(Store.state.adAddress, {
    //         binary : true,
    //         initiated : true,
    //         excludeFailures : true,
    //         limit : 100,
    //     }).then(data => {
    //         let ad = [];
    //         // console.log(data);
    //         data.forEach(item => {
    //             if(item.specification && item.specification.memos){
    //                 let memos = item.specification.memos[0] || {};
    //                 if(memos.data){
    //                     try {
    //                         let d = JSON.parse(memos.data);
    //                         d.date = item.outcome.ledgerVersion;
    //                         if(d.author){
    //
    //                         }else{
    //                             d.author = item.address;
    //                         }
    //                         d.id = item.id;
    //                         ad.push(d);
    //                     }catch (e) {
    //
    //                     }
    //                 }
    //             }
    //         });
    //         // console.log(ad);
    //         Store.commit('adData', ad);
    //     }).catch(e => {
    //         console.log(e);
    //         Store.commit('adData', []);
    //     });
    // }
    // rabp6QeFztgCXvjtrz7MuENAbSGxSMH5WQ
}

function getNewPrice (){
    return;
    let {left, right} = Store.state.trade;
    rcp.api.getOrderbook(rcp.address, {
        base : Object.assign({}, left),
        counter : Object.assign({}, right),
    }, {
        limit : 5
    })
        .then((data) => {
            let bids = (data.bids || []);
            let newPrice = (bids[0] && Decimal(1 / bids[0].properties.makerExchangeRate).toFixed(4) * 1) || 0;
            Store.commit('newPrice', newPrice);
        }).catch(e => {
        console.log(e.message);
    });
}

function airdrop_address() {
    if(Store.state.rcp_info.airdrop_address){
        rcp.api.getTransactions(Store.state.rcp_info.airdrop_address, {
            binary : true,
            initiated : true,
            excludeFailures : true,
            limit : 10,
        }).then(data => {
            if(data.length > 0 && !Store.state.balancesBTC.counterparty){
                Store.commit("isTrustBtc", true);
            }
        }).catch(e => {
            console.log(e);
        });
    }
}

export default  {
    account,
    rcp
}