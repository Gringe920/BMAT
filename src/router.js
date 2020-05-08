import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import nav3D from './views/nav3D.vue'

const Wallet = () => import(/* webpackChunkName: "wallet" */ './views/wallet/index.vue');
const AcceptCoin = () => import(/* webpackChunkName: "wallet" */ './views/wallet/acceptCoin.vue');
const shoukuan = () => import(/* webpackChunkName: "wallet" */ './views/wallet/shoukuan.vue');
const zhuanqian = () => import(/* webpackChunkName: "wallet" */ './views/wallet/zhuanqian.vue');
const gateway = () => import(/* webpackChunkName: "wallet" */ './views/wallet/gateway.vue');
const detais = () => import(/* webpackChunkName: "wallet" */ './views/wallet/detais.vue');
const scanning = () => import(/* webpackChunkName: "wallet" */ './views/wallet/scanning.vue');

// import Trade from './views/trade/index.vue' //交易中心
const Trade = () => import(/* webpackChunkName: "trade" */ './views/trade/index.vue');
// import lastOrder from './views/trade/lastOrder' //交易中心历史记录
const lastOrder = () => import(/* webpackChunkName: "trade" */ './views/trade/lastOrder.vue');
// import tradeDetails from './views/trade/tradeDetails' //交易中心对应k线深度图页面
const tradeDetails = () => import(/* webpackChunkName: "trade" */ './views/trade/tradeDetails.vue');

import Download from './views/download' //下载界面
import Invite from "./views/invite" //邀请
import binding from "./views/wallet/binding" //邀请

// import Advert from './views/user/advert.vue' //公告
const Advert = () => import(/* webpackChunkName: "user" */ './views/user/advert.vue');

// import AdvertDetails from './views/user/advertDetails.vue' //公告详情
const AdvertDetails = () => import(/* webpackChunkName: "user" */ './views/user/advertDetails.vue');
// import User from "./views/user" //我的首页
const User = () => import(/* webpackChunkName: "user" */ './views/user/index.vue');
// import Lang from "./views/user/lang" //语言设置
const Lang = () => import(/* webpackChunkName: "user" */ './views/user/lang.vue');
// import AccountManage from './views/user/accountManage' //账号管理
const AccountManage = () => import(/* webpackChunkName: "user" */ './views/user/accountManage.vue');
// import ExportAddr from './views/user/exportAddr' //导出地址
const ExportAddr = () => import(/* webpackChunkName: "user" */ './views/user/exportAddr.vue');
// import MnemonicWord from './views/user/mnemonicWord' //备份助记词
const MnemonicWord = () => import(/* webpackChunkName: "user" */ './views/user/mnemonicWord.vue');
// import ChangeSecurePsw from './views/user/changeSecurePsw' //修改安全密码
const ChangeSecurePsw = () => import(/* webpackChunkName: "user" */ './views/user/changeSecurePsw.vue');
// import AddrDetail from './views/user/addrDetail' //地址详情
const AddrDetail = () => import(/* webpackChunkName: "user" */ './views/user/addrDetail.vue');
// import RemoveAddr from './views/user/removeAddr' //移除地址
const RemoveAddr = () => import(/* webpackChunkName: "user" */ './views/user/removeAddr.vue');
// import ExportSecretKey from './views/user/exportSecretKey' //导出私钥
const ExportSecretKey = () => import(/* webpackChunkName: "user" */ './views/user/exportSecretKey.vue');

import Login from './views/login' //登陆
import SetupAddr from './views/login/setupAddr' //创建地址
import importWallet from './views/login/importWallet' //导入钱包

// import Dapp from './views/dapp/index.vue' //DAPP首页
const Dapp = () => import(/* webpackChunkName: "dapp" */ './views/dapp/index.vue');
// import Convolution from './views/dapp/convolution' //卷积
const Convolution = () => import(/* webpackChunkName: "dapp" */ './views/dapp/convolution.vue');
// import Exchange from './views/dapp/exchange' //兑换
const Exchange = () => import(/* webpackChunkName: "dapp" */ './views/dapp/exchange.vue');
// import DigMine from './views/dapp/digMine' //挖矿
const DigMine = () => import(/* webpackChunkName: "dapp" */ './views/dapp/digMine.vue');
// import HashGuess from './views/dapp/hashGuess' //竞猜
const HashGuess = () => import(/* webpackChunkName: "dapp" */ './views/dapp/hashGuess.vue');
// import Sequence from './views/dapp/sequence' //接龙
const Sequence = () => import(/* webpackChunkName: "dapp" */ './views/dapp/sequence.vue');
// import TradeCompaign from './views/dapp/tradeCompaign' //交易大赛
const TradeCompaign = () => import(/* webpackChunkName: "dapp" */ './views/dapp/tradeCompaign.vue');
// import NewbieReward from './views/dapp/newbieReward' //新人奖
const NewbieReward = () => import(/* webpackChunkName: "dapp" */ './views/dapp/newbieReward.vue');
// import XPowerCompaign from './views/dapp/xPowerCompaign' //X算力争霸
const XPowerCompaign = () => import(/* webpackChunkName: "dapp" */ './views/dapp/xPowerCompaign.vue');
// import YPowerCompaign from './views/dapp/yPowerCompaign' //Y算力竞赛
const YPowerCompaign = () => import(/* webpackChunkName: "dapp" */ './views/dapp/yPowerCompaign.vue');
// import AlphaPowerDetail from './views/dapp/alphaPowerDetail' //α算力明细
const AlphaPowerDetail = () => import(/* webpackChunkName: "dapp" */ './views/dapp/alphaPowerDetail.vue');
// import BetaPowerDetail from './views/dapp/betaPowerDetail' //β算力明细
const BetaPowerDetail = () => import(/* webpackChunkName: "dapp" */ './views/dapp/betaPowerDetail.vue');
const market = () => import(/* webpackChunkName: "dapp" */ './views/market/index.vue');

import currency from "./views/user/currency"
import explorer from "./views/user/explorer"
import password from "./views/user/password"
import acceptCoin2 from "./views/dapp/acceptCoin2"
import acceptCoin3 from "./views/dapp/acceptCoin3"
import acceptCoin4 from "./views/dapp/acceptCoin4"
import detais2 from "./views/dapp/detais2"
import Issued from "./views/dapp/issued"
import invteRecord from "./views/invite/invteRecord"
import cbsl from "./views/invite/cbsl"
import xtwh from "./views/error"
const demo = () => import(/* webpackChunkName: "wallet" */ './views/wallet/demo.vue');
const convertAds = () => import(/* webpackChunkName: "wallet" */ './views/wallet/convertAds');
const convertUsdt = () => import(/* webpackChunkName: "wallet" */ './views/wallet/convertUsdt');
Vue.use(Router)

let router = new Router({
    // mode: 'history',
    // base: process.env.BASE_URL,
    mode: (/file/gi.test(location.href)) ? 'hash' : process.env.NODE_ENV === 'production' ? 'hash' : 'history' ,
    // base: process.env.BASE_URL,
    base: process.env.NODE_ENV === 'production' ? '/dist/' : '/',
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    routes: [
        // {
        //     path: '/',
        //     name: 'nav3D',
        //     component : nav3D,
        // },
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/acceptCoin3',
            name: 'acceptCoin3',
            component: acceptCoin3
        },
        {
            path: '/cbsl/:type',
            name: 'cbsl',
            component: cbsl,
            props : true,
        },
        {
            path: '/password',
            name: 'password',
            component: password
        },
        {
            path: '/acceptCoin4',
            name: 'acceptCoin4',
            component: acceptCoin4
        },
        {
            path: '/convertAds',
            name: 'convertAds',
            component: convertAds
        },
        {
            path: '/convertUsdt',
            name: 'convertUsdt',
            component: convertUsdt
        },
        {
            path: '/invteRecord',
            name: 'invteRecord',
            component: invteRecord
        },
        {
            path: '/explorer',
            name: 'explorer',
            component: explorer
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        // {
        //     path: '/home2',
        //     name: 'home2',
        //     component: Home
        // },
        {
            path: '/demo',
            name: 'demo',
            component: demo
        },
        {
            path: '/currency',
            name: 'currency',
            component: currency
        },
        {
            path: '/acceptCoin2',
            name: 'acceptCoin2',
            component: acceptCoin2
        },
        {
            path: '/detais2',
            name: 'detais2',
            component: detais2
        },
        {
            path: '/binding/:invite?',
            name: 'binding',
            component: binding
        },
        {
            path: '/gateway/:address?/:coin?',
            name: 'gateway',
            component: gateway
        },
        {
            path: '/scanning',
            name: 'scanning',
            component:scanning
        },
        {
            path: '/importWallet',
            name: 'importWallet',
            component:importWallet
        },
        {
            path: '/trade',
            name: 'trade',
            component: Trade
        },
        {
            path: '/tradeDetails',
            name: 'tradeDetails',
            component: tradeDetails
        },
        {
            path: '/lastOrder',
            name: 'lastOrder',
            component: lastOrder
        },
        {
            path: '/wallet',
            name: 'wallet',
            component: Wallet
        },
        {
            path: '/dapp',
            name: 'dapp',
            component: Dapp
        },
        {
            path: '/shoukuan',
            redirect: '/shoukuan/XRP'
        },
        {
            path: '/shoukuan/:coin',
            name: 'shoukuan',
            component: shoukuan,
            props : true
        },
        {
            path: '/zhuanqian',
            redirect: '/zhuanqian/XRP'
        },
        {
            path: '/zhuanqian/:coin/:toAddress?/:gateway?',
            name: 'zhuanqian',
            component: zhuanqian,
        },
        {
            path: '/detais/:id',
            name: 'detais',
            component:detais,
            props: true
        },
        {
            path: '/advert',
            name: 'advert',
            component: Advert
        },
        {
            path: '/advertDetails/:index',
            name: 'advertDetails',
            component: AdvertDetails,
            props : true
        },
        {
            path: '/acceptCoin',
            redirect: '/acceptCoin/0'
        },
        {
            path: '/acceptCoin/:activeIdx',
            name: 'acceptCoin',
            component:AcceptCoin,
            props: true
        },
        {
            path: '/download',
            name: 'download',
            component: Download
        },
        {
            path: '/invite',
            name: 'invite',
            component: Invite
        },
        {
            path: '/user',
            name: 'user',
            component: User
        },
        {
            path: '/lang',
            name: 'lang',
            component: Lang
        },
        {
            path: '/changeSecurePsw',
            name: 'changeSecurePsw',
            component: ChangeSecurePsw
        },
        {
            path: '/accountManage',
            name: 'accountManage',
            component: AccountManage
        },
        {
            path: '/exportAddr',
            name: 'exportAddr',
            component: ExportAddr
        },
        {
            path: '/mnemonicWord/:mnemonic/:stepType',
            name: 'mnemonicWord',
            component: MnemonicWord,
            props: true
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/convolution',
            name: 'convolution',
            component: Convolution
        },
        {
            path: '/exchange',
            name: 'exchange',
            component: Exchange
        },
        {
            path: '/digMine',
            name: 'digMine',
            component: DigMine
        },
        {
            path: '/hashGuess',
            name: 'hashGuess',
            component: HashGuess
        },
        {
            path: '/sequence',
            name: 'sequence',
            component: Sequence
        },
        {
            path: '/tradeCompaign',
            name: 'tradeCompaign',
            component: TradeCompaign
        },{
            path: '/newbieReward',
            name: 'newbieReward',
            component: NewbieReward
        },{
            path: '/xPowerCompaign',
            name: 'xPowerCompaign',
            component: XPowerCompaign
        },{
            path: '/yPowerCompaign',
            name: 'yPowerCompaign',
            component: YPowerCompaign
        },
        {
            path: '/alphaPowerDetail',
            name: 'alphaPowerDetail',
            component: AlphaPowerDetail
        },
        {
            path: '/betaPowerDetail',
            name: 'betaPowerDetail',
            component: BetaPowerDetail
        },
        {
            path: '/addrDetail/:address',
            name: 'addrDetail',
            component: AddrDetail,
            props : true,
        },
        {
            path: '/removeAddr',
            name: 'removeAddr',
            component: RemoveAddr
        },
        {
            path: '/exportSecretKey/:address/:seed',
            name: 'exportSecretKey',
            component: ExportSecretKey,
            props : true
        },
        {
            path: '/setupAddr',
            name: 'setupAddr',
            component: SetupAddr
        },
        {
            path: '/issued',
            name: 'issued',
            component: Issued
        },
        {
            path: '/market',
            name: 'market',
            component: market
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
});

// router.beforeResolve((to, from, next) => {
//     // ...
//     console.log(to.query);
//     console.log(from.query);
//     if(from.query.access_token){
//         if(to.query.access_token){
//
//         }else{
//             to.query.access_token = from.query.access_token;
//             to.query.refresh_token = from.query.refresh_token;
//         }
//     }
//     console.log(to);
//     next();
// })
export default router;