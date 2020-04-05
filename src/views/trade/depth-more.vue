<template>
    <section class="depth-more">
        <div id="container"></div>
        <div class="depth-more-title">
            <span>{{$t('lang157')}}</span>
            <span>{{$t('lang158')}}({{unitCoin(trade.left.currency)}})</span>
            <span>{{$t('lang159')}}({{unitCoin(trade.right.currency)}})</span>
            <span>{{$t('lang158')}}({{unitCoin(trade.left.currency)}})</span>
            <span>{{$t('lang160')}}</span>
        </div>
        <section class="depth-type-box">
            <ul class="depth-type depth-type-buy">
                <li v-for="(item, i) in bids" :key="item.data.index">
                    <span>{{i + 1}}</span>
                    <span>{{toFixedNumber(item.specification.quantity.value, 4)}}</span>
                    <span>{{toFixedNumber(1 / (item.properties.makerExchangeRate || 0), 4)}}</span>
                    <i :style="{width : toFixedNumber(item.specification.quantity.value / bidsNum * 100, 2) + '%'}"></i>
                </li>
            </ul>
            <ul class="depth-type depth-type-sell">
                <li v-for="(item, i) in asks" :key="item.data.index">
                    <span>{{toFixedNumber((item.properties.makerExchangeRate || 0), 4)}}</span>
                    <span>{{toFixedNumber(item.specification.quantity.value, 4)}}</span>
                    <span>{{i + 1}}</span>
                    <i :style="{width : toFixedNumber(item.specification.quantity.value / asksNum * 100, 2) + '%'}"></i>
                </li>
            </ul>
        </section>
    </section>
</template>

<script>
    import Highcharts from 'highcharts/highstock';
    export default {
        name: "depth-more",
        data() {
            return {
                type : 1,
                bids : [], // 买 buy
                asks : [], // 卖 sell
                bidsNum : 0,
                asksNum : 0,
                Highcharts : null,
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
        },
        mounted (){
            this.HighchartsInit();
            if(this.connected){
                this.getOrderbook();
            }
        },
        methods : {
            HighchartsInit (){
                this.Highcharts = Highcharts.chart('container', {
                    chart: {
                        type: 'area',
                        zoomType: 'xy'
                    },
                    title: false,
                    credits: false,
                    xAxis: {
                        minPadding: 0,
                        maxPadding: 0,
                        plotLines: [{
                            color: '#888',
                            value: 0.1523,
                            width: 1,
                            label: {
                                text: this.newTradeQuote.price,
                                rotation: 90
                            }
                        }],
                        title: false
                    },
                    yAxis: [{
                        lineWidth: 1,
                        gridLineWidth: 1,
                        title: null,
                        tickWidth: 1,
                        tickLength: 5,
                        tickPosition: 'inside',
                        labels: {
                            align: 'left',
                            x: 8
                        }
                    }, {
                        opposite: true,
                        linkedTo: 0,
                        lineWidth: 1,
                        gridLineWidth: 0,
                        title: null,
                        tickWidth: 1,
                        tickLength: 5,
                        tickPosition: 'inside',
                        labels: {
                            align: 'right',
                            x: -8
                        }
                    }],
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillOpacity: 0.2,
                            lineWidth: 1,
                            step: 'center'
                        }
                    },
                    tooltip: {
                        headerFormat: `<span style="font-size=10px;">${this.$t('Trade.price')}: {point.key}</span><br/>`,
                        valueDecimals: 2
                    },
                    series: [{
                        name: this.$t('lang156'),
                        data: [],
                        color: '#3FAE90'
                    }, {
                        name: this.$t('lang155'),
                        data: [],
                        color: '#D04F5F'
                    }]
                });
            },
            getOrderbook (){
                let {left, right} = this.trade;
                this.rcp.api.getOrderbook(this.account.getAddress(), {
                    base : Object.assign({}, left),
                    counter : Object.assign({}, right),
                }, {
                    limit : 100
                })
                    .then((data) => {
                        // console.log(JSON.stringify(data, null, 2));
                        this.asks = (data.asks || []);
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
                            if(bidsData.length <= 0 || bidsData[bidsData.length - 1].properties.makerExchangeRate != item.properties.makerExchangeRate){
                                bidsData.push(item);
                            }else{
                                // console.log(asksData[asksData.length - 1].specification.quantity.value, item.specification.quantity.value);
                                bidsData[bidsData.length - 1].specification.quantity.value = bidsData[bidsData.length - 1].specification.quantity.value * 1 + item.specification.quantity.value * 1;
                                bidsData[bidsData.length - 1].specification.totalPrice.value += bidsData[bidsData.length - 1].specification.totalPrice.value * 1 + item.specification.totalPrice.value * 1;
                            }
                        });
                        this.bids = bidsData;
                        if(this.bids.length > this.asks.length){
                            this.bids.splice(this.asks.length - 1, this.bids.length - this.asks.length);
                        }
                        if(this.asks.length > this.bids.length){
                            this.asks.splice(this.bids.length - 1, this.asks.length - this.bids.length);
                        }
                        this.asksNum = 0;
                        let asksChart = [];
                        let bidsChart = [];
                        this.asks.forEach(item => {
                            this.asksNum += item.specification.quantity.value * 1;
                            asksChart.push([this.toFixedNumber((item.properties.makerExchangeRate || 0), 8), this.toFixedNumber(item.specification.quantity.value, 4)]);
                        });
                        this.bidsNum = 0;
                        this.bids.forEach(item => {
                            this.bidsNum += item.specification.quantity.value * 1;
                            bidsChart.push([this.toFixedNumber(1 / (item.properties.makerExchangeRate || 0), 8), this.toFixedNumber(item.specification.quantity.value, 4)]);
                        });
                        this.Highcharts.update({
                            xAxis : {
                                plotLines: [{
                                    label: {
                                        text: this.newTradeQuote.price,
                                    }
                                }],
                            },
                            series: [{
                                data: asksChart,
                            }, {
                                data: bidsChart,
                            }]
                        });
                        // console.log(bidsChart, asksChart);
                    }).catch(e => {
                    // this.getOrderbook();
                    console.log(e.message);
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    #container{
        height: 200px;
    }
    .depth-more{
        display: block;
        color: $color3;
        .depth-more-title{
            display: flex;
            font-size: 12px;
            text-align: center;
            padding: 10px 0 5px;
            span{
                &:nth-child(1){
                    flex: 12%;
                }
                &:nth-child(2){
                    flex: 15%;
                    text-align: left;
                }
                &:nth-child(3){
                    flex: 46%;
                }
                &:nth-child(4){
                    flex: 15%;
                    text-align: right;
                }
                &:nth-child(5){
                    flex: 12%;
                }
            }
        }
        .depth-type-box{
            display: block;
            overflow: hidden;
            ul{
                display: block;
                width: 50%;
                float: left;
                &.depth-type-sell{
                    li{
                        i{
                            right: auto;
                            left: 0;
                            background: rgba($down, 0.2);
                        }
                        span{
                            &:nth-child(1){
                                width: 46%;
                                justify-content: start;
                                color: $down;
                                padding-left: 5px;
                            }
                            &:nth-child(2){
                                width: 30%;
                                justify-content: flex-end;
                                color: $black;
                            }
                            &:nth-child(3){
                                width: 24%;
                                justify-content: center;
                                color: $color1;
                            }
                        }
                    }
                }
                li{
                    display: flex;
                    position: relative;
                    height: 25px;
                    line-height: 25px;
                    i{
                        display: block;
                        position: absolute;
                        height: 100%;
                        width: 80%;
                        z-index: 1;
                        background: rgba($up, 0.2);
                        right: 0;
                        top: 0;
                    }
                    span{
                        display: flex;
                        position: relative;
                        z-index: 10;
                        &:nth-child(1){
                            width: 24%;
                            justify-content: center;
                            color: $color3;
                        }
                        &:nth-child(2){
                            width: 30%;
                            justify-content: start;
                            color: $black;
                        }
                        &:nth-child(3){
                            width: 46%;
                            justify-content: flex-end;
                            color: $up;
                            padding-right: 5px;
                        }
                    }
                }
            }
        }
    }
</style>