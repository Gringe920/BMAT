<template>
    <div class="container">
        <Header :title="$t('my')"/>
        <div class="userinfo">
            <div class="avatar">
                <!--<img src="../../assets/images/my_head@2x.png" alt="">-->
                <img src="../../assets/images/logo_user.png" alt="">
            </div>
            <div class="info">
                <div class="name">{{account.accounts.name[account.accounts.addressIndex] || $t('title')}}</div>
                <div class="uid"> <r-copy :copyText="account.getAddress()">{{account.getAddress()}} <p>({{$t('wallet.shoukuan2')}})</p></r-copy></div>
            </div>
        </div>
        <div class="user-navigation">
            <!--<div class="user-nav-item" @click="clickInvite">
                <i class="icon my_activation"></i>
                <p>{{$t('adr20')}}</p>
                <div class="turn-right">
                    <span>{{invite.length ? $t(`home.home13`) : isjihuo ? $t(`home.home12`) : $t(`home.home6`)}}</span>
                    <i></i>
                </div>
            </div>-->
            <!--<div class="divider"></div>
            <div class="user-nav-item" v-if="Number(lock_asset) > 0">
                <i class="icon my_lock"></i>
                <p>{{$t('lang100')}}</p>
                <div class="turn-right">
                    <span>{{lock_asset || 0}}</span>
                    <i></i>
                </div>
            </div>-->
            <div class="divider"></div>
            <div class="user-nav-item">
                <p>{{$t('bmat6')}}</p>
                <div class="turn-right">
                    <span style="color: #1A63A4">{{wallet_count || '-'}}</span>
                </div>
            </div>
            <div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/cbsl/total_profit_rank'})">
                <p>{{$t('total_profit_rank')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/cbsl/y_rank'})">
                <p>{{$t('y_rank')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>

            <div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/cbsl/y_profit_rank'})">
                <p>{{$t('y_profit_rank')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/cbsl/x_rank'})">
                <p>{{$t('x_rank')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/cbsl/x_profit_rank'})">
                <p>{{$t('x_profit_rank')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/invteRecord'})">
                <i class="icon my_account"></i>
                <p>{{$t('inviteTitle')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <div class="divider"></div>
            <!--<div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/download'})">
                <i class="icon my_share"></i>
                <p>{{$t('shareAPP')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <div class="divider"></div>-->
            <div class="user-nav-item" @click="$router.push({path: '/password'})">
                <i class="icon my_language"></i>
                <p>{{$t('adr27')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <!--<div class="divider"></div>-->
            <!--<div class="user-nav-item" @click="$router.push({path: '/lang'})">
                <i class="icon my_language"></i>
                <p>{{$t('langSet')}}</p>
                <div class="turn-right">
                    <span>{{
                        $i18n.locale == 'en' ? 'English' : $i18n.locale == 'ru' ? 'русский язык' : $i18n.locale == 'zhCN' ? '中文繁体' : '中文简体'
                        }}</span>
                    <i></i>
                </div>
            </div>-->

            <div class="divider"></div>
            <div class="user-nav-item" @click="$router.push({path: '/accountManage'})">
                <i class="icon my_account"></i>
                <p>{{$t('accountManagement')}}</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>
            <div class="divider"></div>
<!--            <div class="user-nav-item" @click="$router.push({path: '/changeSecurePsw'})">
                <i class="icon my_lock"></i>
                <p>登录密码</p>
                <div class="turn-right">
                    <i></i>
                </div>
            </div>-->
            <!--<div class="user-nav-item" @click="clickGit('http://www.adrads.net')">-->
                <!--<i class="icon my_website"></i>-->
                <!--<p>{{$t('adr12')}}</p>-->
                <!--<div class="turn-right">-->
                    <!--<span>http://www.adrads.net</span>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="divider"></div>-->

            <div class="user-nav-item" @click="$router.push({path: '/explorer'})">
                <i class="icon my_block_chain"></i>
                <p>{{$t('lang140')}}</p>
                <div class="turn-right">
                    <span>https://explorer.bmatoken.org</span>
                </div>
            </div>
            <div class="divider"></div>
            <!--<div class="user-nav-item">
                <i class="icon my_account"></i>
                <p>{{$t('lang141')}}</p>
                <div class="turn-right">
                    <span><r-copy copyText="support@rcproto.org">support@rcproto.org</r-copy></span>
                </div>
            </div>
            <div class="divider"></div>-->
            <div class="user-nav-item" @click="clickGit('https://github.com/bmat-official/bmat')">
                <i class="icon my_code"></i>
                <p>{{$t('lang142')}}</p>
                <div class="turn-right">
                    <span>https://github.com/bmat-official/bmat</span>
                </div>
            </div>

            <div class="divider"></div>
            <!--<div class="user-nav-item">-->
                <!--<i class="icon my_l"></i>-->
                <!--<p>{{$t('versions')}}</p>-->
                <!--<div class="turn-right">-->
                    <!--<span>{{version}}</span>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="divider"></div>-->
        </div>
<!--        <r-modal title="激活地址"
             @on-ok="submit"
             btnText="激活"
             :show="isShowModal"
             @on-cancel="isShowModal = false">
            <div class="inp-password">
            <input type="text" placeholder="输入激活地址">
            </div>
        </r-modal>-->
    </div>
</template>
<script>
export default {
    data(){
        return{
            isShowModal: false,
            version: '',
            wallet_count: '',
        }
    },
    created (){
        if(typeof plus == 'object'){
            this.version = plus.runtime.version;
        }else{
            this.version = '1.0.0'
        }
        this.getChildren();
    },
    methods: {
        getChildren (){
            this.axios({
                url : "/service/rankboard",
                params : {
                    // address : this.account.getAddress()
                }
            }).then(data => {
                // console.log(data);
                this.wallet_count = data.data.wallet_count || '-';
            }).catch(e => {
            })
        },
        clickInvite (){
            if(this.invite.length){
                this.$router.push('/acceptCoin3');
            }else{
                this.clickBinding()
            }
        },
        clickGit (url){
            if((/file/gi.test(location.href))){
                plus.runtime.openURL(url);
            }else{
                location.href = url;
            }
        },
        activeAddr(){
            this.isShowModal = true;
        },
        submit(){
            console.log('----')
        }
    }
}
</script>
<style lang="scss" scoped>
.container{
    min-height: 100vh;
    .copy-container{
        color: #fff;
    }
    .userinfo{
        display: flex;
        align-items: center;
        padding: 90px 15px 40px;
        background: linear-gradient(135deg, #67C0D8 0%, #1A63A4 100%);
        .avatar{
            width: 17.3%;
            margin-right: 20px;
            img{
                width: 100%;
                border-radius: 100%;
            }

        }
        .info{
            .name{
                font-size: 20px;
                color: $white;
                margin-bottom: 10px;
            }
            .uid{
                font-size: 12px;
                color: #b2d1ff;
            }
        }
    }
    .user-navigation{
        margin: 0 15px;
        background-color: $border2;
        border-radius: 10px;
        padding-bottom: 120px;
        .user-nav-item{
            display: flex;
            align-items: center;
            padding: 15px 0;
            position: relative;

            i.icon{
                display: inline-block;
                width: 22px;
                height: 22px;
                background-size: 100% 100%;
                margin-right: 7px;
            }
            .my_activation{
                background-image: url('../../assets/images/my_activation@2x.png');
            }
            .my_share{
                background-image: url('../../assets/images/my_share@2x.png');
            }
            .my_valuation{
                 background-image: url('../../assets/images/my_valuation@2x.png');
            }
            .my_language{
                background-image: url('../../assets/images/my_language@2x.png');
            }
            .my_lock{
                background-image: url('../../assets/images/my_lock@2x.png');
            }
            .my_l{
                background-image: url('../../assets/images/my_l@2x.png');
            }
            .my_account{
                background-image: url('../../assets/images/my_account@2x.png');
            }
            .my_website{
                background-image: url('../../assets/images/my_website@2x.png');
            }
            .my_block_chain{
                background-image: url('../../assets/images/my_block_chain@2x.png');
            }
            .my_code{
                background-image: url('../../assets/images/my_code@2x.png');
            }
            p{
                font-size: 14px;
                color: $active;
            }
            .turn-right{
                position: absolute;
                right: 0;
                span{
                    font-size: 12px;
                    color: $color1
                }
                i{
                    display: inline-block;
                    width: 7px;
                    background-size: 100% 100%;
                    background-image: url('../../assets/images/triangle@2x.png');
                    height: 7px;
                    margin-left: 7px;
                }
            }
        }
        .divider {
            background: $inpBg;
            height: 1px;
        }
    }
}
</style>