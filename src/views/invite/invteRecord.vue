<template>
    <section class="acceptCoin">
        <Header :title="$t('inviteTitle') + $t(`wallet.jilu`)"></Header>
<!--        <div class="acceptCoin_type">
            <div    :class="0 == activeIdx ? 'divactive' : '' "  @click="changetype(0)">{{$t(`lang78`)}}</div>
            <div   :class="1 == activeIdx ? 'divactive' : '' "  @click="changetype(1)">{{$t(`lang79`)}}</div>
        </div>-->
        <!-- 收款 -->
        <div class="zhuaninfo">
            <load v-if="loadState"></load>
            <empty v-if="loadState == false && (0 == activeIdx && listX.length <=0 ? true : 1 == activeIdx && listY.length <=0 ? true : false)"></empty>
            <div class="zhuan" v-for="item in (activeIdx == 0 ? listX : listY)" :key="item.id">
                <div class="top">
                    <img src="../../assets/images/night_record_time@2x.png" alt srcset />
                    {{item.create_time}}
                </div>
                <div class="center">
                    <div>
                        {{$t('lang101')}}：{{item.total_wk_achnum}}
                    </div>
                </div>
                <div class="last">{{$t('lang102')}}：{{item.uid}}</div>
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
                loadState : true,
                routerNum : 0,

            };
        },
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
                    url : "/service/children",
                    params : {
                        address : this.account.getAddress()
                    }
                }).then(data => {
                    console.log(data);
                    this.listX = data.data.children.x_children || [];
                    this.listY = data.data.children.y_children || [];
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
