<template>
    <div class="home">
        <Header :title="$t(`home.home`)"
                :leftEv="clickMy"
                :leftIcon="require('../assets/images/user.png')"
                 ></Header>

        <section class="banner">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide"><img src="../assets/images/banner.jpg" alt=""></div>
                    <div class="swiper-slide"><img src="../assets/images/bmat_banner2.png" alt=""></div>
                    <div class="swiper-slide">
                        <img src="../assets/images/bmat_banner1.png" alt="">
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </section>
        <div class="advert">
            <div class="advert_l" @click="adData[0] ? $router.push('/advertDetails/0') : ''">
                <img src="../assets/images/home_horn@2x.png" alt="" srcset="">
                <div>{{adData[0] && adData[0].title || '-'}}</div>
            </div>
            <div class="advert_r" @click="toRoute('advert')">{{$t(`home.home5`)}}</div>
        </div>
        <div class="fenlei">
            <router-link tag="a" to="/digMine" >
                <div class="thenav">
                    <img src="../assets/images/mining@2x.png" alt="" srcset=""  >
                    <span class="nav-title" >{{$t('adr5')}}</span>
                </div>
            </router-link>
            <router-link tag="a" to="/zhuanqian">
                <div class="thenav">
                    <img src="../assets/images/transfer@2x.png" alt="" srcset="" >
                    <span class="nav-title">{{$t('adr3')}}</span>
                </div>
            </router-link>
            <router-link tag="a"   to="/acceptCoin">
                <div class="thenav">
                    <img src="../assets/images/transfer_record@2x.png" alt="" srcset=""  >
                    <span class="nav-title">{{$t('lang182')}}</span>
                </div>
            </router-link>
            <router-link tag="a"   to="/shoukuan">
                <div class="thenav">
                    <img src="../assets/images/receivables_qr@2x.png" alt="" srcset=""  >
                    <span class="nav-title">{{$t('wallet.shoukuan1')}}</span>
                </div>
            </router-link>
        </div>
        <div class='earningstitle'>{{$t('home.home1')}}</div>
        <section class="earnings">
            <h4> </h4>
            <div>
                <span>{{toFixedNumber(balancesXRP.value, 4) || '-'}}</span> {{$t('title')}}
                <p>≈ {{toFixedNumber(decimal.mul((balancesXRP.value || 0), moneyConvert), 2)}} {{moneyUnit}}</p>
            </div>
        </section>

        <div class='earningstitle'>{{labels[labels.length - 1] || '-'}} 挖矿收益</div>
        <section class="earnings earnings2">
            <h4> </h4>
            <div>
                <span>{{toFixedNumber(data[data.length - 1] || 0, 4) || '-'}}</span> {{$t('title')}}
                <p>≈ {{toFixedNumber(decimal.mul((data[data.length - 1] || 0 || 0), moneyConvert), 2)}} {{moneyUnit}}</p>
            </div>
        </section>
        <div class="last-week-profit calc-power-group">
            <div class="icon-subtitle">
                <i class="icon"></i>
                <span class="subtitle">{{$t('lang116')}}</span>
            </div>
            <div class="divider"></div>
            <canvas class="chart-7Day"></canvas>
        </div>
        <load v-if="gmex_uid == '' || loginState"></load>
        <!--<div class="load">-->
            <!--系统维护中-->
        <!--</div>-->
    </div>
</template>

<script>
    import Swiper from "swiper";
    import SwiperCss from "swiper/css/swiper.css";
    import Chart from 'chart.js';
    // @ is an alias to /src
    export default {
        name: "home",
        data() {
            return {
                loginState: false,
                hidden: false,
                isShowPswModal: false,
                swiper: null,
                marketMenuActive: 0,
                mainMarket : [],
                coinList : [],
                marketList : [],
                market : {},
                quoteCoin : '',
                myBarChart : null,
                item : [],
                labels : [],
                data : [],
            };
        },
        watch : {
            quote (){
                this.coinListChange();
                this.marketMenuChange();
            },
            marketMenuActive (){
                this.marketMenuChange();
            }
        },
        mounted() {
            this.getAd();
            this.banner();
            if(this.quote.main){
                this.coinListChange();
                this.marketMenuChange();
            }
            this.getData();
            setTimeout(() => {
                this.getAddressInfo();
            }, 500);
        },
        destroyed() {
            if(this.swiper){
                this.swiper.destroy();
            }
            if(this.myBarChart){
                this.myBarChart.destroy();
            }
        },
        methods: {
            getAddressInfo (){
                if(this.gmex_uid) return;
                this.loginState = true;
                let params = new URLSearchParams(document.location.search.substring(1));
                let access_token = params.get("access_token") || ''; // is th
                let refresh_token = params.get("refresh_token") || ''; // is th
                this.axios({
                    url : "/service/login_info",
                    params : {
                        access_token : access_token,
                        refresh_token : refresh_token
                    }
                }).then(res => {
                    this.loginState = false;
                    console.log(res);
                    this.$store.commit('btcDepositAddress', res.data.btcAddress || "");
                    this.$store.commit('inviteServe', res.data.inviter || "");
                    this.$store.commit('lock_asset', res.data.lock_asset || "");
                    this.$store.commit('usdt_erc20', res.data.usdt_erc20 || "");
                    this.$store.commit('usdt_omni', res.data.usdt_omni || "");
                    this.$store.commit('invite', res.data.inviter || "");
                    this.$store.commit('lock_node_asset', res.data.lock_node_asset || "");
                    this.$store.commit('inviteX', res.data.inviter_code_x || "");
                    this.$store.commit('inviteY', res.data.inviter_code_y || "");
                    this.$store.commit('gmex_uid', res.data.gmex_uid || "");
                    this.$store.commit('gmex_pwd', res.data.gmex_phrase_pwd || "");
                    this.$store.commit('wallet_tag', res.data.wallet_tag || []);
                    this.$store.commit('gmex_privatekey', res.data.gmex_privatekey || []);
                    this.$store.commit('gmex_phrase', res.data.gmex_phrase || []);
                }).catch(e => {
                    console.log(e.message);
                    this.loginState = false;
                    this.$store.commit('usdt_erc20', "");
                    this.$store.commit('usdt_omni', "");
                    this.$store.commit('lock_asset', "");
                    this.$store.commit('btcDepositAddress', "");
                    this.$store.commit('inviteServe', "");
                    this.$store.commit('invite', "");
                    this.$store.commit('inviteX',  "");
                    this.$store.commit('inviteY', "");
                    this.$store.commit('gmex_uid', "");
                    this.$store.commit('gmex_privatekey', []);
                    this.$store.commit('gmex_phrase', []);
                    this.$store.commit('gmex_pwd', "");
                    // setTimeout(getAddressInfo, timeOut);
                });
            },
            getData (){
                if(this.account.getAddress() == ''){
                    setTimeout(() => {
                        this.getData();
                    }, 3000);
                }
                this.axios({
                    url : "/service/wk_info",
                    params : {
                        address : this.account.getAddress()
                        // address : 'rx08'
                    }
                }).then(data => {
                    console.log(data);
                    this.item = data.data || [];
                    this.labels = [];
                    this.data = [];
                    if(this.item._7day_total_profit){
                        let _7day_total_profit = this.item._7day_total_profit || [];
                        _7day_total_profit.forEach(item => {
                            let t = (new Date(item.time));
                            this.labels.push((t.getMonth() + 1) + '/' + t.getDate());
                            this.data.push(item.profit);
                        })
                    }
                    this.chart();
                }).catch(e => {
                    console.log(e.message);
                    // this.chart();
                })
            },
            chart (){
                if(document.querySelector(".chart-7Day")){
                    var ctx = document.querySelector(".chart-7Day").getContext('2d');
                    this.myBarChart = new Chart(ctx, {
                        type: 'line',
                        data:  {
                            labels: this.labels,
                            datasets: [
                                {
                                    borderColor : "#1A63A4",
                                    backgroundColor : "#1A63A4",
                                    data: this.data,
                                    fill: false,
                                    borderWidth: 1,
                                }
                            ],
                        },
                        options: {
                            legend : false,
                        }
                    });
                }
            },
            coinListChange (){
                if(this.quote.main){
                    this.coinList = Object.keys(this.quote.main);
                    if(this.coinList.length){
                        this.mainMarket = this.quote.main[this.coinList[0]] || [];
                    }else{
                        this.mainMarket = [];
                    }

                }else{
                    this.mainMarket = [];
                }
            },
            clickQuoteCoin (coin){
                this.quoteCoin = coin;
                if(this.market[coin]){
                    this.marketList = this.market[coin];
                }else{
                    this.marketList = [];
                }
            },
            quoteKey (param){
                if(param){
                    this.coinList = Object.keys(param);
                    if(this.coinList.length){
                        this.market = param;
                        this.marketList = param[this.coinList[0]];
                        this.quoteCoin = this.coinList[0];
                    }else{
                        this.marketList = [];
                        this.market = {};
                        this.quoteCoin = '';
                    }
                }else{
                    this.coinList = [];
                    this.marketList = [];
                    this.market = {};
                    this.quoteCoin = '';
                }
            },
            marketMenuChange (){
                if(this.marketMenuActive == 0){
                    this.quoteKey(this.quote.main);
                }else if(this.marketMenuActive == 1){
                    this.quoteKey(this.quote.gem);
                }else{
                    this.quoteKey(this.quote.pink);
                }
            },

            clickMy (){
                this.$router.push("/user");
                return true;
            },
            toacceptCoin (){
                this.$router.push("/scanning");
            },
            dispark (){
                this.$toast.show(this.$t('dispark'));
            },
            handleKeyup() {
                console.log(1);
            },
            handleScroll() {
                console.log(2);
            },
            clickMarketMenu(index) {
                this.marketMenuActive = index;
            },
            banner() {
                this.swiper = new Swiper(".swiper-container", {
                    pagination: {
                        el: ".swiper-pagination",
                        dynamicBullets: true
                    },
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        stopOnLastSlide: false,
                        disableOnInteraction: true
                    }
                });
            },
            getAd() {
                this.axios({
                    url: "/service/ad",
                    params: {
                        lan : this.$i18n.locale
                    }
                })
                    .then(res => {
                        // console.log(res);
                        this.$store.commit("adData", res.data || []);
                    })
                    .catch(e => {
                        console.log(e.message);
                        this.$store.commit("adData", []);
                        setTimeout(() => {
                            this.getAd();
                        }, 3000);
                    });
            },
            clickActivate() {},
            toHidden() {
                this.hidden = !this.hidden;
            }
        },
        components: {}
    };
</script>
<style lang="scss">
    .swiper-pagination-bullet-active {
        background: $white;
    }
    .swiper-pagination-bullet {
        opacity: 0.6;
    }
    .swiper-container-horizontal > .swiper-pagination-bullets {
        bottom: 0px;
    }
</style>
<style lang="scss" scoped>
    .chart-7Day{
        height: 200px;
        margin-top: 15px;
        width: 100%;
    }
    .load{
        position: fixed;
        height: 100%;
        width: 100%;
        z-index: 99999;
        left: 0;
        top: 0;
        background: rgba(0,0,0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }
    // xm start
    .market-menu{
        display: flex;
        height: 50px;
        padding: 0 30px;
        justify-content: space-between;
        &.market-coin{
            padding: 0;
            height: 40px;
            li{
                font-size: 14px;
                &.active{
                    color: rgba($active, 0.8);
                    span{
                        &:before{
                            border-bottom: solid 2px rgba($active, 0.5);
                        }
                    }
                }
            }
        }
        li{
            display: flex;
            font-size: 16px;
            align-items: center;
            color: $color1;
            cursor: pointer;
            &.active{
                color: $active;
                span{
                    &:before{
                        border-bottom: solid 2px $active;
                    }
                }
            }
            span{
                display: inline-block;
                position: relative;
                padding: 0 8px;
                text-align: center;
                height: 35px;
                line-height: 35px;
                &:before{
                    display: block;
                    content: '';
                    width: 100%;
                    border-bottom: solid 2px transparent;
                    position: absolute;
                    bottom: 0;
                    left: 0px;
                }
            }
        }
    }
    .home {
        padding-top: 50px;
        padding-bottom: 50px;
        .banner {
            background: $border2;
            padding: 0 15px;
            .swiper-container {
                width: 100%;
                height: 100%;
                border-radius: 5px;
            }
            .swiper-slide {
                height: 150px;
                color: $border3;
                text-align: center;
                font-size: 18px;
                background: $white;

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .advert {
            border-bottom: 1px solid $bg3;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px 15px;
            background: $border2;
            height: 50px;
            color: $active;
            .advert_l {
                display: flex;
                align-items: center;
                width: 84%;
                height: 50px;
                font-size: 14px;
                white-space: nowrap;
                line-height: 50px;
                div::-webkit-scrollbar {
                    display: none;
                }
                div {
                    overflow-x: scroll;
                }
                img {
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                }
            }
            .advert_r {
                font-size: 14px;
            }
            .advert_r:hover {
                color: $blue;
            }
        }
        .fenlei {
            background: $bg;
            display: flex;
            align-items: center;
            padding-bottom: 15px;
            justify-content: space-around;
            border-bottom: 10px solid #F7F9FC;
            .thenav {
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1.4;
                img {
                    width: 33px;
                    height: 33px;
                }
                span {
                    font-size: 10px;
                    font-weight: 400;
                    margin-top: 7px;
                    color: $color2;
                }
            }
        }
        .coininfosbox::-webkit-scrollbar {
            display: none;
        }
        .coininfosbox {
            background: $bg;
            width: 100%;
            border-top: 10px solid $bg7;
            border-bottom: 10px solid $bg7;
            overflow-y: scroll;
            height: 120px;
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: space-around;
            .itembox {
                flex-shrink: 0;
                text-transform: uppercase;
                display: inline-block;
                text-align: center;
                width: 33vw !important;
                .text1 {
                    font-size: 12px;
                    color: $active;
                }
                .text2 {
                    font-size: 18px;
                }
                .text4 {
                    font-size: 14px;
                    color: $primary;
                }
            }
        }
        .earningstitle {
            color: $active;
            font-size: 18px;
            padding: 15px;
        }
        .earnings {
            
            display: block;
            margin: 0 15px;
            padding: 15px;
            color: $white;
            font-size: 18px;
            background: url("../assets/images/home_assets_bj@2x.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            border-radius: 5px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            &.earnings2:before{
                content: '';
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background: url("../assets/images/home_assets_bj@2x.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                transform: rotateY(180deg);
                z-index: 1;
            }
            &.earnings2{
                h4, div{
                    text-align: right;
                }
            }
            h4 {
                font-weight: normal;
                font-size: 14px;
                margin-bottom: 10px;
                position: relative;
                z-index: 10;
            }
            div {
                position: relative;
                z-index: 10;
                span {
                    font-size: 32px;
                    color: $white;
                }
            }
        }
        .markets {
            margin: 10px 15px;
            .title {
                font-size: 18px;
                color: $active;
                border-bottom: 1px solid $bg3;
                padding: 15px 0;
            }
            .markebox {
                border-bottom: 1px solid $bg3;
                padding: 15px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: $active;
                .le {
                    .top {
                        color: $active;
                        font-size: 16px;
                        span {
                            font-size: 12px;
                            color: $primary;
                        }
                    }
                    .last {
                        font-size: 12px;
                        color: $primary;
                    }
                }
                .cen {
                    text-align: center;
                    .top {
                        font-size: 16px;
                        color: $active;
                    }
                    .last {
                        font-size: 12px;
                        color: $primary;
                    }
                }
                .rig {
                    .bt {
                        font-size: 14px;
                        color: $white;
                        width: 75px;
                        height: 35px;
                        line-height: 35px;
                        text-align: center;
                    }
                }
            }
        }
    }
    .last-week-profit {
        position: relative;
        padding: 0 15px;
        .icon {
            background-image: url("../assets/images/mining_profit@2x.png");
        }
        .subtitle{
            font-size: 18px;
        }
        .profit-chart {
            padding: 15px 0;

            .pillar-group {
                display: flex;
                align-items: baseline;
                justify-content: space-between;

                .pillar {
                    height: 50px;
                    width: 16px;
                    border-radius: 100px 100px 0 0;
                    background:linear-gradient(180deg,rgba(1,101,237,1) 0%,rgba(1,101,237,0) 100%);
                }
            }

            .no-data {
                padding: 47px 0;
                text-align: center;
                i.no-data-logo {
                    margin: 0 auto;
                    background-image: url("../assets/images/blank_page@2x.png");
                    background-size: 100% 100%;
                    display: inline-block;
                    border: 1px dashed $color1;
                    width: 80px;
                    height: 80px;
                }

                .no-data-note {
                    color: $color1;
                    font-size: 12px;
                }
            }

            .inside-chart {
                margin: 0;
            }

            .date-group {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                .date {
                    color: $color1;
                    font-size: 10px;
                    line-height: 10px;
                    margin-top: 8px;
                }
            }
        }
    }
</style>

