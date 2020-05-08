<template>
    <section class="acceptCoin">
        <Header :title="$t(type)"></Header>
<!--        <div class="acceptCoin_type">
            <div    :class="0 == activeIdx ? 'divactive' : '' "  @click="changetype(0)">{{$t(`lang78`)}}</div>
            <div   :class="1 == activeIdx ? 'divactive' : '' "  @click="changetype(1)">{{$t(`lang79`)}}</div>
        </div>-->
        <!-- 收款 -->
        <div class="zhuaninfo">
            <load v-if="loadState"></load>
            <empty v-if="loadState == false && list.length <= 0"></empty>
            <div class="zhuan" v-for="item in list" :key="item.id">
                <div class="center">
                    <div>
                        {{$t(type + '_text')}}：
                        {{
                            type == 'y_profit_rank'
                        ? item.total_y_profit
                        : type == 'x_profit_rank'
                        ? item.total_x_profit
                        : type == 'x_rank'
                        ? item.x_power
                        : item.y_power
                        }}
                    </div>
                </div>
                <div class="last">{{$t('lang102')}}：{{item.uid.slice(0, 8)}} ******** {{item.uid.slice(-8)}}</div>
            </div>
        </div>
        <!-- 兑换 -->
    </section>
</template>
<script>
    export default {
        name: "invteRecord",
        data() {
            return {
                //0 收款 1 转账 2 兑换
                activeIdx: 0,
                listX : [],
                listY : [],
                list : [],
                loadState : true,
                routerNum : 0,
            };
        },
        props : ['type'],
        watch : {
        },
        created (){
            this.getChildren();
        },
        methods: {
            getChildren (){
                this.loadState = true;
                this.list = [];
                this.axios({
                    url : "/service/rankboard",
                    params : {
                        // address : this.account.getAddress()
                    }
                }).then(data => {
                    console.log(data);
                    this.list = data.data.total_profit_rank;
                    if(this.type == 'y_rank'){
                        this.list = data.data.y_rank;
                    }
                    if(this.type == 'x_profit_rank'){
                        this.list = data.data.x_profit_rank;
                    }
                    if(this.type == 'x_rank'){
                        this.list = data.data.x_rank;
                    }
                    if(this.type == 'y_profit_rank'){
                        this.list = data.data.y_profit_rank;
                    }
                    this.loadState = false;
                }).catch(e => {
                    this.list = [];
                    this.loadState = false;
                })
            },
            leftEv (){
                if(this.routerNum > 3){
                    this.$router.push('/wallet');
                    return true;
                }else{
                    return false;
                }
            },
            changetype(activeIdx) {
                if(activeIdx != this.activeIdx){
                    this.activeIdx = activeIdx;
                }
            },
        }
    };
</script>

<style lang="scss" scoped>
    // xm
    .acceptCoin {
        margin-bottom: 60px;
        .header{
            border-bottom: solid 1px $border;
        }
        .acceptCoin_type {
            display: flex;
            margin-top: 50px;
            justify-content: space-around;
            align-items: center;
            background: $nav-bg;
            height: 35px;
            color: $color1;
            font-size: 14px;
            .divactive {
                height: 100%;
                line-height: 35px;
                color: $active;
                border-bottom: 1px solid $active;
            }
            div:hover {
                color: $active;
                line-height: 35px;
                border-bottom: 1px solid $active;
            }
        }
        .zhuaninfo {
            /*margin-top :50px;*/
            border-top: solid 1px $border;
            padding-top: 50px;
            .zhuan {
                color: $color1;
                padding: 15px;
                font-size: 12px;
                border-bottom: 1px solid $border;
                .top {
                    margin-bottom: 10px;
                    img {
                        width: 12px;
                        height: 12px;
                        margin-right: 5px;
                    }
                }
                .center {
                    margin-bottom: 7px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 500;
                    color: $active;
                    small{
                        color: $active;
                    }
                    img {
                        width: 8px;
                        height: 8px;
                    }
                }
            }
        }
    }
</style>
