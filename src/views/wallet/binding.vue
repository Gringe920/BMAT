<template>
    <section class="zhuanqian">
        <Header :title="$t(`home.home15`)"></Header>

        <div class="box2">
            <div class="text1"> {{$t(`wallet.zhuanqian10`)}}</div>
            <div class="text2">
                <input type="password" v-model="password" :placeholder="$t(`wallet.zhuanqian12`)" class="in2">
            </div>
        </div>

        <div class="box2">
            <div class="text1">
                {{activeSuper ? $t('adr21') : $t(`adr24`)}}
                <span class="active-super" @click="activeSuper = !activeSuper">{{activeSuper == false ? $t('adr21') : $t('adr24')}}</span>
                <!--<span class="active-super" @click="$toast.show($t('dispark'))">{{activeSuper == false ? $t('adr13') : $t('adr14')}}</span>-->
            </div>
            <div class="text2" v-if="activeSuper == false">
                <input type="text" v-model="code" :placeholder="$t(`home.home16`)">
                <img @click="$router.push('/scanning')" src="../../assets/images/add_scan_white@2x(2).png" alt="" srcset="">
            </div>
            <div class="text2" v-if="activeSuper">
                <input class="input-old" type="text" v-model="user" :placeholder="$t(`adr22`)">
            </div>
            <div class="text2" v-if="activeSuper">
                <input class="input-old" type="password" v-model="passwordOld" :placeholder="$t(`adr23`)">
            </div>

            <div class="l">* {{`${$t(`wallet.can`)}：${coinBalances} ${$t('title')}； ${$t(`lang31`)}： ${rcp.activeNum} ${$t('title')}`}}</div>
        </div>

        <div class="btn" @click="codeVerify" > {{$t(`wallet.zhuanqian6`)}}{{submitState ? '...' : ''}}</div>

    </section>
</template>
<script>
    // const CryptoJs = require("crypto-js");
    import CryptoJs from 'crypto-js'
    export default {
        name: "binding",
        data() {
            return {
                close: false,
                gatewayState: false,
                isShowPswModal: false,
                gatewayData : [],
                coin: '',
                code: '',
                user: '',
                passwordOld: '',
                coinBalances : 0,
                address : "",
                gateway : "",
                num : "",
                password : "",
                submitState : false,
                activeSuper : false,
            };
        },
        created (){
            if(this.$route.params.invite){
                this.code = this.$route.params.invite;
            }
            this.updateBalances();
            console.log(CryptoJs.MD5("123456").toString());
        },
        watch : {
            activeSuper (){
                // if(this.activeSuper){
                //     this.code = this.rcp_info.default_baba || "";
                // }else{
                //     this.code = '';
                // }

            },
            balancesXRP (n, o){
                this.updateBalances();
            },
        },
        methods: {
            updateBalances (){
                this.coinBalances = this.balancesXRP.value || 0;
            },
            codeVerify (){
                if(this.submitState) return;
                if(sessionStorage.getItem(this.rcp.address + 'Binding')){
                    this.$toast.show(this.$t('lang181'));
                    return;
                }
                let {password, code, user, passwordOld} = this;
                if(this.balancesXRP.value < this.rcp.activeNum){
                    this.$toast.show(this.$t('home.home17', {num : this.rcp.activeNum}));
                    return;
                }

                if(this.activeSuper){
                    if(user.length <= 0){
                        this.$toast.show(this.$t('adr22') + this.$t('error'));
                        return;
                    }
                    if(passwordOld.length <= 0){
                        this.$toast.show(this.$t('adr23') + this.$t('error'));
                        return;
                    }
                    this.submitState = true;
                    let md5Pas = CryptoJs.MD5(passwordOld).toString();
                    this.axios({
                        url : '/service/old_user_valid',
                        params : {
                            secret : md5Pas,
                            account : user,
                        }
                    }).then(data => {
                        console.log(data);
                        this.submitPsw();
                    }).catch(e => {
                        this.submitState = false;
                        if(e.code == 16001){
                            this.$toast.show(this.$t('lang153'));
                        }else{
                            this.$toast.show(this.$t('adr22') + '/' + this.$t('adr23') + ' ' + this.$t('error'));
                        }
                    })
                }else{
                    if(code.length <= 0){
                        this.$toast.show(this.$t('home.home16') + this.$t('error'));
                        return;
                    }
                    this.submitState = true;
                    this.axios({
                        url : '/service/invite_code_valid',
                        params : {
                            invite_code : this.code
                        }
                    }).then(data => {
                        console.log(data);
                        this.submitPsw();
                    }).catch(e => {
                        this.submitState = false;
                        this.$toast.show(this.$t('home.home16') + this.$t('error'));
                    })
                }
            },
            submitPsw (){
                let {password, code} = this;
                this.submitState = true;
                var num = this.balancesXRP.value * 1 > (this.rcp.activeNum * 1 + this.fee * 1) ? this.rcp.activeNum :  this.decimal.sub(this.balancesXRP.value, this.fee);
                this.account.verifyPassword(password).then(async () => {
                    let seed = await this.account.exportPrivate(this.password);
                    let memos = {
                        "type": "binding",
                        "format": "text/plain",
                        "data": code
                    };

                    if(this.activeSuper){
                        let md5Pas = CryptoJs.MD5(this.passwordOld).toString();
                        memos.type = 'binding_old';
                        memos.data = this.user + ',' + md5Pas;
                    }
                    console.log(memos);
                    this.rcp.preparePayments({
                        address : this.inviteAddress,
                        seed,
                        value : num.toString(),
                        memos : [
                            memos
                        ],
                    }).then(data => {
                        console.log(data);
                        this.submitState = false;
                        if(data.engine_result_code == 0){
                            this.$toast.show(this.$t('home.home15') + this.$t('lang151'));
                            sessionStorage.setItem(this.rcp.address + 'Binding', '1');
                            this.$router.push('/home');
                        }else{
                            this.$toast.show(data.engine_result_message);
                        }
                    }).catch(e => {
                        this.submitState = false;
                        this.$toast.show(e.message);
                    });
                }).catch(e => {
                    this.submitState = false;
                    this.$toast.show(this.$t('passwordError'));
                });

            },
        }
    };
</script>
<style lang="scss" scoped>
    .zhuanqian {
        background: $bodybg;
        text-transform: uppercase;
        padding: 0 15px;
        padding-top: 65px;
        min-height: 100vh;

        .active-super{
            color: $blue;
            float: right;
        }
        .cointype {
            margin-bottom: 15px;
            border-radius: 4px;
            display: flex;
            color: $active;
            justify-content: space-between;
            padding: 15px;
            align-items: center;
            background: $border2;
            box-shadow:0px 6px 10px 0px rgba(0,0,0,0.06);
            .r {
                color: $color1;
                font-size: 13px;
            }
            img {
                width: 8px;
                height: 8px;
            }
        }
        .box2 {
            margin-bottom: 15px;
            color: $active;
            font-size: 14px;
            background: $border2;
            padding: 15px;
            border-radius: 4px;
            box-shadow:0px 6px 10px 0px rgba(0,0,0,0.06);
            .l {
                color: $color1;
                padding-top: 15px;
                margin-top: 10px;
                border-top: 1px solid $bg;
            }
            .text2 {
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: 35px;
                .r {
                    small {
                        color: $color1;
                    }
                }
                img {
                    width: 20px;
                    height: 20px;
                }
                input {
                    height: 100%;
                    border: none;
                    min-width: 90%;
                    background: none;
                    &.input-old{
                        display: block;
                        width: 100%;
                        height: 45px;
                        margin-top: 5px;
                        border-bottom: solid 1px $border;
                    }
                }
                .in2 {
                    min-width: 70%;
                }
                .r {
                }
            }
        }
        .coinchange {
            width: 100%;
            height: 100vh;
            z-index: 100;
            position: absolute;
            top: 0;
            left: 0;
            background: $bg4;
            box-shadow:0px 6px 10px 0px rgba(0,0,0,0.06);
            .coinbox {
                position: absolute;
                bottom: 0;
                background:$border2;
                width: 100%;
                .cg {
                    color: $active !important;
                    border-top: 10px solid $nav-bg;
                }
                .coin {
                    width: 100%;
                    text-align: center;
                    color: $color1;
                    height: 48px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 1px solid $black;
                    &.active {
                        color: $active;
                    }
                    img {
                        width: 20px;
                        height: 20px;
                    }
                    div {
                        margin-left: 6px;
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>