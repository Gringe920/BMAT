<template>
    <section class="depth">
        <div class="top">
            <div>{{$t(`Trade.price`)}}</div>
            <div>{{$t(`wallet.zhuanqian2`)}}</div>
        </div>
        <div class="box" v-if="type != 3" :class="type !=1 ? 'addbox':''">
            <div  v-for="(item, i) in asks" v-if="type == 1 ? i >= (asks.length - 5) : i >= (asks.length - 10)" :key="item.data.index" class="boxtext" @click="clickPrice(decimal(item.properties.makerExchangeRate).toFixed(8) * 1)">
                <!--<div class="price up">{{decimal(1 / item.properties.makerExchangeRate).toFixed(6) * 1}}</div>-->
                <div class="price up">{{decimal(item.properties.makerExchangeRate).toFixed(8) * 1}}</div>
                <!--<div class="price up">{{item.specification.quantity.value}}</div>-->
                <div  class="t2">{{decimal(item.specification.quantity.value).toFixed(4) * 1}}</div>
            </div>
        </div>

        <div class="all" :class="type ==2 ? 'down':'up'">{{newTradeQuote.price}}</div>
        <div class="yue">≈ {{getCurrencyPrice(newTradeQuote)}} {{moneyUnit}}</div>

        <div class="box boxBuy" v-if="type != 2"  :class="type !=1 ? 'addbox':''">
            <div v-for="(item, i) in bids" v-if="type == 1 ? i < 5 : i < 10" :key="item.data.index" class="boxtext" @click="clickPrice(decimal(1 / item.properties.makerExchangeRate).toFixed(8) * 1)">
                <div class="price down" >{{decimal(1 / item.properties.makerExchangeRate).toFixed(8) * 1}}</div>
                <!--<div class="price down">{{item.properties.makerExchangeRate}}</div>-->
                <!--<div class="price down" >{{item.specification.totalPrice.value}}</div>-->
                <div class="t2">{{decimal(item.specification.quantity.value).toFixed(4) * 1}}</div>
            </div>
        </div>
        <div class="check">
            <div v-if="type!=1" @click="totype(1)"> <img src="../../assets/images/business@2x.png" alt="" srcset=""></div>
            <div v-if="type==1"  class="noborer"> <img src="../../assets/images/business_press@2x.png" alt="" srcset=""></div>
            <div v-if="type!=3" @click="totype(3)" ><img src="../../assets/images/night_sell@2x.png" alt="" srcset=""></div>
            <div v-if="type==3" class="noborer"><img src="../../assets/images/night_sell_press@2x.png" alt="" srcset=""></div>
            <div v-if="type==2" class="noborer"><img src="../../assets/images/night_buy_press@2x.png" alt="" srcset=""></div>
            <div v-if="type!=2" @click="totype(2)"><img src="../../assets/images/night_buy@2x.png" alt="" srcset=""></div>
        </div>
    </section>
</template>
<script>
    export default {
        name: "depth",
        data(){
            return{
                type : 1,
                bids : [], // 买 buy
                asks : [], // 买 sell
            }
        },
        watch : {
            trade (){
                this.getOrderbook();
            },
            balances (n, o){
                this.getOrderbook();
            },
        },
        created (){
            if(this.connected){
                this.getOrderbook();
            }
        },
        methods:{
            getNewPrice (){
                return (this.bids[0] && this.decimal(1 / this.bids[0].properties.makerExchangeRate).toFixed(8) * 1) || 0;
            },
            clickPrice (price){
                this.$store.commit("tradePrice", price)
            },
            totype(index){
                this.type = index;
            },
            getOrderbook (){
                let {left, right} = this.trade;
                this.rcp.api.getOrderbook(this.account.getAddress(), {
                    base : Object.assign({}, left),
                    // base : {
                    //     "currency": "ADS",
                    //     "counterparty": "rUv87XRK3nnpfHizwC9eRD1b7xHydXGPkU"
                    // },
                    counter : Object.assign({}, right),
                    // counter : {
                    //     "currency": "UST",
                    //     "counterparty": "rGtFmRDpJdqaYBwuSZPxZqmW4Licb3fCDe"
                    // },
                }, {
                    limit : 80
                })
                    .then((data) => {
                        // console.log(JSON.stringify(data, null, 2));
                        // return;
                        this.asks = (data.asks || []).reverse();
                        this.asks.forEach(item => {
                            item.properties.makerExchangeRate = this.decimal(item.properties.makerExchangeRate).toFixed(8) * 1;
                        });
                        let asksData = [];
                        this.asks.forEach(item => {
                            if(asksData.length <= 0 || asksData[asksData.length - 1].properties.makerExchangeRate != item.properties.makerExchangeRate){
                                asksData.push(item);
                            }else{
                                // console.log(asksData[asksData.length - 1].specification.quantity.value, item.specification.quantity.value);
                                asksData[asksData.length - 1].specification.quantity.value = asksData[asksData.length - 1].specification.quantity.value * 1 + item.specification.quantity.value * 1;
                                asksData[asksData.length - 1].specification.totalPrice.value += asksData[asksData.length - 1].specification.totalPrice.value * 1 + item.specification.totalPrice.value * 1;
                            }
                        });
                        this.asks = asksData;

                        let bidsData = [];
                        this.bids = (data.bids || []);
                        this.bids.forEach(item => {
                            item.properties.makerExchangeRate = this.decimal(item.properties.makerExchangeRate).toFixed(8) * 1;
                        });
                        this.bids.forEach(item => {
                            if(bidsData.length <= 0 || bidsData[bidsData.length - 1].properties.makerExchangeRate != item.properties.makerExchangeRate){
                                bidsData.push(item);
                            }else{
                                // console.log(asksData[asksData.length - 1].specification.quantity.value, item.specification.quantity.value);
                                bidsData[bidsData.length - 1].specification.quantity.value = bidsData[bidsData.length - 1].specification.quantity.value * 1 + item.specification.quantity.value * 1;
                                bidsData[bidsData.length - 1].specification.totalPrice.value += bidsData[bidsData.length - 1].specification.totalPrice.value * 1 + item.specification.totalPrice.value * 1;
                            }
                        });
                        this.bids = bidsData;
                        // console.log(asksData, bidsData);
                    }).catch(e => {
                        // this.getOrderbook();
                        console.log(e.message);
                });
            },
        }
    };
</script>
<style lang="scss" scoped>
    .depth {
        vertical-align: text-top;
        width: 50%;
        color: $white;
        display: inline-block;
        padding: 0 15px;
        font-size: 12px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: $color3;
            margin-bottom: 10px;
        }
        .all {
            padding-top: 10px;
            font-size: 14px;
            /*background: rgba($border2, 0.5);*/
            padding-left: 0px;
            box-sizing: border-box;
            height: 30px;
        }
        .yue {
            padding: 0px 0px 14px 0px;
            color: $color1;
            font-size: 10px;
            /*background: rgba($border2, 0.5);*/
        }
        .addbox{
            height: 240px !important;
        }
        .box {
            height: 120px;
            overflow-y: scroll;
            display: flex;
            align-items: flex-end;
            align-content: flex-end;
            flex-wrap: wrap;
            &.boxBuy{
                align-items: flex-start;
                align-content: flex-start;
            }
            .boxtext {
                width: 100%;
                height: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                //  padding: 6px 0;
                .t2 {
                    color: $color1;
                }
            }
        }
        .check{
            display: flex;
            justify-content: flex-end;
            padding-top: 10px;
            .noborer{
                border:none;
            }
            div{
                width: 15px;
                height: 15px;
                margin-left: 15px;
                img{
                    width: 100%;
                    height: 100%;;
                }
            }
        }
    }
</style>

