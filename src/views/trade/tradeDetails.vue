<template>
    <section class="tradeDetails">
        <Header :title="(`${unitCoin(trade.left.currency)}/${unitCoin(trade.right.currency)}`).toUpperCase()"></Header>
        <div class="toubox">
            <div class="toubox_l">
                <div class="text1 down">{{newTradeQuote.price}}</div>
                <div class="text2">
                    <span>≈ {{getCurrencyPrice(newTradeQuote)}} {{moneyUnit}}</span>&nbsp;
                    <span :class="newTradeQuote.ttm > 0 ? 'up' : 'down'">{{newTradeQuote.ttm || '-'}}%</span>
                </div>
            </div>
            <div class="toubox_r">
                <div><span>{{newTradeQuote.h}}</span> <span>{{$t(`Trade.height`)}}</span> </div>
                <div><span>{{newTradeQuote.l}}</span> <span>{{$t(`Trade.low`)}}</span></div>
                <div><span>{{newTradeQuote.v}}</span> <span>{{$t(`Trade.tiemup`)}}</span></div>
            </div>
        </div>
        <k></k>
        <depth-more></depth-more>
        <!--<div class="type">
            <div @click="shizhi = !shizhi" :class="shizhi != true? 'coloractive':''">深度</div>
            <div @click="shizhi = !shizhi" :class="shizhi == true? 'coloractive':''">市值</div>
        </div>
        <div class="shizhibox" v-if="shizhi">
            <div class="box">
                <span>比特币{{$t(`Trade.marketmoney`)}}</span>
                <span>5434.3亿</span>
            </div>
            <div class="box">
                <span>比特币{{$t(`Trade.gudannum`)}}</span>
                <span>24755.34</span>
            </div>
            <div class="box">
                <span>比特币{{$t(`Trade.volume`)}}</span>
                <span>24755.34</span>
            </div>
            <div class="box">
                <span> {{$t(`Trade.allusernum`)}}</span>
                <span>12,334,12</span>
            </div>

        </div>
        <div class="busell">
            <div class="buy"> {{$t(`Trade.canbuy`)}}</div>
            <div class="sell"> {{$t(`Trade.cansell`)}}</div>
        </div>-->
    </section>
</template>
<script>
    import k from "./K";
    import DepthMore from "./depth-more"; //深度
    export default {
        name: "tradeDetails",
        data(){
            return{
                shizhi:false
            }
        },

        components: {
            DepthMore,
            k
        },
    };
</script>
<style lang="scss" scoped>
    .tradeDetails {
        padding-top: 50px;
        .toubox {
            padding: 0 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid $border;
            justify-content: space-between;
            display: flex;
            border-top: solid 1px rgba($border, 0.05);
            align-items: center;
            height: 80px;
            .down{
                color: $down;
            }
            .up{
                color: $up;
            }
            .toubox_l {
                .text1 {
                    font-size: 30px;
                    margin-top: 10px;
                    margin-bottom: 15px;
                }
                .text2 {
                    color: $color1;
                    font-size: 16px;
                }
            }
            .toubox_r {
                div {
                    font-size: 12px;
                    color: $active;
                    text-align: right;
                    span:nth-child(1) {
                        padding-right: 20px;
                        color: $color1;
                    }
                }
            }
        }
        .type {
            display: flex;
            justify-content: space-between;

            div {
                width: 50%;
                height: 50px;
                line-height: 45px;
                font-size: 14px;
                color: $color1;
                text-align: center;
            }
        }
        .shizhibox {
            padding: 0 15px;
            .box {
                padding: 15px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                span:nth-child(1) {
                    color: $color1;
                }
                span:nth-child(2) {
                    color: $active;
                }
            }
        }
        .busell {
            // width: 100vw;
            // position: fixed;
            // border: 1px solid red;
            // bottom: 0px;
            border-top: 1px solid $border;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            div {
                width: 48%;
                border-radius: 6px;
                color: $white;
                height: 44px;
                line-height: 44px;
                text-align: center;
            }
            .buy {
                background: $down;
            }
            .sell {
                background: $up;
            }
        }
    }
</style>

