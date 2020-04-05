<template>
    <section class="walletall">
        <Header :title="$t(`wallet.name`)" :rightEv='toacceptCoin' :leftShow='false' :rightIcon="require('../../assets/images/record_black@2x.png')" ></Header>
        <div class="walletbanner">
            <div class="w-t">
                <span>{{$t(`wallet.zichan`)}} </span>
                <router-link class="gateway" to="/gateway">{{$t('Trust the gateway')}}</router-link>
            </div>
            <div class="w-t2">
                <span>{{getTotalM()}}</span>&nbsp;{{moneyUnit}}
            </div>
        </div>

        <div class="hiddenmoney">
            <div class="h_l" @click="hiddenmoney">
                <img src="../../assets/images/night_asset_unchecked@2x.png" alt="" srcset="" v-if="!hidden">
                <img src="../../assets/images/asset_selection@2x.png" alt="" srcset="" v-else>
                <span>{{$t(`wallet.hide`)}}</span>
            </div>
        </div>

        <div class="money">
            <div class="coin">
                <img src="../../assets/images/ADR.png" alt="">
                {{unitCoin(balancesXRP.currency || rcp.currency)}}
                <small v-if="Number(lock_asset) > 0">{{$t('lang100')}} : {{lock_asset || 0}}</small>
            </div>
            <p class="adr25"  v-if="Number(lock_node_asset) > 0">{{$t('adr25')}}：{{lock_node_asset || 0}}</p>
            <div class="coin2">
                {{decimal(balancesXRP.value || 0).toFixed(8)}}
                <span>
                    ≈ {{decimal.mul((balancesXRP.value || 0), moneyConvert).toFixed(2)}}
                    <small>{{moneyUnit}}</small>
                </span>
            </div>
            <div class="coin4">
                <div class="shou"  @click="$router.push('/shoukuan/XRP')" >{{$t(`wallet.shou`)}}</div>
                <div class="zhuan" @click="tozhuanzang(rcp.currency)">{{$t(`wallet.fu`)}}</div>
            </div>
        </div>

        <div class="money">
            <div class="coin">
                <img src="../../assets/images/ADS.png" alt="">
                ADS
                <small style="float: right;" @click="$router.push('/convertUsdt')">{{$t('lang80')}} USDT</small>
            </div>
            <div class="coin2">
                {{decimal(balancesBTC.value || 0).toFixed(8)}}
                <span>
                    ≈ {{decimal.mul(balancesBTC.value || 0, getCurrencyItemPrice(balancesBTC) || 0).toFixed(2)}}
                    <small>{{moneyUnit}}</small>
                </span>
            </div>
            <!--<div class="coin3" v-if="balancesBTC.counterparty">
                <div>{{$t(`gateway`)}}: {{balancesBTC.counterparty || ''}}</div>
            </div>-->
            <div class="coin4">
                <div class="shou"  @click="$router.push('/shoukuan/ADS')" >{{$t(`wallet.shou`)}}</div>
                <div class="zhuan" @click="tozhuanzang('ADS')">{{$t(`wallet.fu`)}}</div>
            </div>
        </div>

        <div class="money">
            <div class="coin">
                <img src="../../assets/images/usdt.webp" alt="">
                USDT
                <small style="float: right;" @click="convertAds">{{$t('lang80')}} ADS</small>
            </div>
            <div class="coin2">
                {{decimal(balancesUSDT.value || 0).toFixed(8)}}
                <span>
                    ≈ {{(decimal.mul(balancesUSDT.value || 0, getCurrencyItemPrice(balancesUSDT) || 0)).toFixed(2)}}
                    <small>{{moneyUnit}}</small>
                </span>
            </div>
            <!--<div class="coin3" v-if="balancesBTC.counterparty">
                <div>{{$t(`gateway`)}}: {{balancesBTC.counterparty || ''}}</div>
            </div>-->
            <div class="coin4">
                <div class="shou"  @click="$router.push('/shoukuan/UST')" >{{$t(`wallet.shou`)}}</div>
                <div class="zhuan" @click="tozhuanzang('UST')">{{$t(`wallet.fu`)}}</div>
            </div>
        </div>


        <div class="money" v-for="(item,index) in balancesOthers" :key="item.currency" v-if="!(hidden && item.value < 0.1)">
            <div class="coin">
                <img src="../../assets/images/my_head@2x.png" alt="">
                {{item.currency}}
                <!--<small style="float: right;" @click="closeGateway(item)">取消信任网关</small>-->
            </div>
            <div class="coin2">
                {{decimal(item.value || 0).toFixed(8) * 1}}
                <span> ≈ {{(decimal.mul(item.value || 0, getCurrencyItemPrice(item) || 0)).toFixed(2)}} <small>{{moneyUnit}}</small></span>
            </div>
            <div class="coin3">
                <div>{{$t(`gateway`)}}: {{item.counterparty || ''}}</div>
                <!--<div class="c_l">{{$t(`wallet.nocan`)}}：&nbsp;  {{hidden?'******':item.nocan}} </div>-->
            </div>
            <div class="coin4">
                <div class="shou"  @click="$router.push('/shoukuan/' + item.currency)" >{{$t(`wallet.shou`)}}</div>
                <div class="zhuan" @click="$router.push(`/zhuanqian/${item.currency}`)">{{$t(`wallet.fu`)}}</div>
            </div>
        </div>
    </section>
</template>
<script>
    export default {
        name: "wallet",
        mounted (){
        },
        data() {
            return {
                searchmsg: "",
                serchnow: false,
                hidden:false,
                isWalletShow: true,
                coins: [

                ]
            };
        },
        watch: {
            searchmsg() {
                console.log(this.searchmsg);
                console.log(new RegExp(this.searchmsg).test('xxm'));
                if(this.searchmsg != "") {
                    this.serchnow = true;
                } else {
                    this.serchnow = false;
                }
            }
        },
        methods:{
            closeGateway (item){
                let password = '1';
                this.account.verifyPassword(password).then(async () => {
                    this.isShowPswModal = false;
                    this.submitState = true;
                    let seed = await this.account.exportPrivate(password);
                    let {address, coin} = this;
                    this.rcp.prepareTrustline({
                        "currency": item.currency,
                        "counterparty": item.counterparty,
                        "limit": "0",
                        "ripplingDisabled": false,
                        "frozen": false,
                        "authorized": false,
                    }, seed).then(data => {
                        if(data.engine_result_code == 0){
                            this.$toast.show(this.$t('trust') + this.$t('success'));
                        }else{
                            this.$toast.show(data.engine_result_message);
                        }
                    }).catch(e => {
                        this.$toast.show(e.message);
                    });
                }).catch(e => {
                    this.$toast.show(this.$t('passwordError'));
                });
            },
            getTotalM (){
                let moneyConvert = this.moneyConvert;
                let adr = this.decimal.mul((this.balancesXRP.value || 0), moneyConvert);
                // let ads = this.decimal.mul((this.balancesBTC.value || 0), moneyConvert).mul(this.newPrice);
                let ads = this.decimal.mul(this.balancesBTC.value || 0, this.getCurrencyItemPrice(this.balancesBTC) || 0);
                let ust = this.decimal.mul(this.balancesUSDT.value || 0, this.getCurrencyItemPrice(this.balancesUSDT) || 0);
                let total = adr.add(ads).add(ust);
                this.balancesOthers.forEach(item => {
                    let p = this.decimal.mul(item.value || 0, this.getCurrencyItemPrice(item) || 0);
                    total = total.add(p);
                });
                return total.toFixed(2);
            },
            convertAds (){
                this.$router.push('/convertAds');
            },
            confirm(){

            },
            tozhuanzang(item){
                if(this.isjihuo == false){
                    this.$toast.show(this.$t('home.home8'));
                    return;
                }
                if(item.toUpperCase() == 'UST' && !this.balancesUSDT.counterparty){
                    this.$store.commit("isTrustBtc", true);
                    return;
                }
                if(item.toUpperCase() == 'ADS' && !this.balancesBTC.counterparty){
                    this.$store.commit("isTrustBtc", true);
                    return;
                }
                this.$router.push(`/zhuanqian/${item}`);
            },
            hiddenmoney(){
                this.hidden = !this.hidden

            },
            toacceptCoin(){
                this.$router.push({
                    path: "/acceptCoin",
                    query: {
                        type: 0
                    }
                });
            }
        }


    };
</script>
<style lang="scss" scoped>
    .adr25{
        color: $blue;
        padding-right: 15px;
        text-align: right;
        font-size: 15px;
    }
    .gateway{
        color: $white;
    }
    .walletall {
        padding: 0 15px 80px;
        min-height: 90vh;
        margin-bottom: 50px;
        .walletbanner {
            margin-top: 60px;
            height: 137px;
            background: url(../../assets/images/wallet__card_bj@2x.png);
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 5px;
            overflow: hidden;
            padding: 0 20px;
             color: $white;
            .w-t {
                display: flex;
                justify-content: space-between;
                padding: 20px 0 20px 0;
                align-items: center;
                img {
                    width: 22px;
                    height: 22px;
                }
            }
            .w-t2 {
                font-size: 22px;
                text-align: left;
                span {
                    font-size: 40px;
                }
            }
        }
        .hiddenmoney {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
            color: $color3;
            .h_l {
                display: flex;
                align-items: center;
                font-size: 12px;
                img {
                    margin-right: 5px;
                    width: 12px;
                    height: 12px;
                }
            }
            .h_r {
                height: 24px;
                width: 100px;
                display: flex;
                align-items: center;
                border-radius: 2px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                img {
                    width: 20px;
                    padding: 0 5px;
                    height: 12px;
                }
                input {
                    width: 70px;
                    height: 20px;
                    background: $bg;
                    border: none;
                    color: $white;
                }
            }
            .searchwid {
                width: 150px;
                input {
                    width: 120px;
                }
            }
        }
        .money {
            height: 100%;
            background:$border2;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow:0px 0px 15px 0px rgba(0,0,0,0.1);
            .coin {
                padding: 10px 15px 0 15px;
                font-size: 18px;
                font-weight: 500;
                color: $blue;
                display: flex;
                align-items: center;
                position: relative;
                img{
                    display: inline-block;
                    height: 30px;
                    margin-right: 10px;
                }
                small{
                    position: absolute;
                    right: 15px;
                    top: 10px;
                    display: block;
                }
            }
            .coin2 {
                padding: 0 15px;
                font-size: 24px;
                color: $active;
                margin: 15px 0;
                span {
                    font-size: 18px;
                }
            }
            .coin3 {
                padding: 0 15px 10px 15px;
                font-size: 13px;
                font-weight: 600;
                color: $active;

                display: flex;
                .c_l {
                    width: 50%;
                }
            }
            .coin4 {
                border-top: 1px solid $bg4;
                height: 40px;
                color:$active;
                font-size: 14px;
                div {
                    line-height: 40px;
                    width: 49%;
                    display: inline-block;
                    text-align: center;
                }
                div:hover {
                    background: $blue;
                    color: $white;
                }
                .shou { 
                    border-right: 1px solid $bg4;
                }
            }
        }
    }
    .cn-text{
        color: $color1;
        font-size: 14px;
        padding: 0 15px;
    }
</style>
