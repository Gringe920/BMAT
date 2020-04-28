<template>
    <div class="container">
        <Header :title="$t('adr27')" />
        <div class="content">
            <div class="inp-password" style="margin-bottom: 50px">
                <input type="text" v-model="password" :placeholder="$t('adr26')" />
            </div>
            <!-- 提交按钮 -->
            <r-button width="87.3%" bgColor="$active" :text="$t('confirm') + (submitState ? '...' : '')" class="submit" @comfirm="refreshPwd" />
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                submitState: false,
                isShowPswModal: false,    // 0助记词，1私钥
                activeIndex: 0,    // 0助记词，1私钥
                text : "",
                name : "",
                password : "",
            };
        },
        methods: {
            refreshPwd (){
                if(this.submitState) return;
                this.submitState = true;
                let accounts = JSON.parse(JSON.stringify(this.account.accounts));
                accounts.privateKey.forEach((item, index) => {
                    let p = this.account.AESDecrypt(item, this.passwordWallet);
                    accounts.privateKey[index] = this.account.AESEncrypt(p, this.password);
                });
                let m = this.account.AESDecrypt(accounts.mnemonic, this.passwordWallet);
                accounts.mnemonic = this.account.AESEncrypt(m, this.password);
                console.log(accounts);
                let ps = this.account.RSAEncryptPublic(this.password);
                this.axios({
                    url : "/service/refreshPwd",
                    params : {
                        uid : this.gmex_uid,
                        newpwd : ps
                    }
                }).then(res => {
                    console.log(res);
                    this.submitState = false;
                    this.account.accounts = accounts;
                    this.account.save();
                    this.$toast.show(this.$t('adr28'));
                    this.reply();
                }).catch(e => {
                    console.log(e.message);
                    this.submitState = false;
                    this.$toast.show(this.$t('adr29'));
                    // setTimeout(getAddressInfo, timeOut);
                });
            },
            reply() {

                if (typeof plus == "object") {
                    let webview = plus.webview.getTopWebview();
                    webview.back();
                } else {
                    this.$router.go(-1);
                }
            },
            async submitPsw (){
                if(this.submitState) return;
                this.submitState = true;
                let {name} = this;
                if(name.length <= 0){
                    this.$toast.show(this.$t('lang33'));
                    return;
                }
                this.account.verifyPassword(this.password).then(async () => {
                    this.isShowPswModal = false;
                    this.account.accounts.name[this.account.accounts.address.length] = name;
                    setTimeout(() => {
                        if(this.activeIndex == 0){
                            this.account.importMnemonic(this.text, this.password).then(data => {
                                this.submitState = false;
                                this.$router.push("/accountManage");
                                this.$toast.show(this.$t('importAddress') + this.$t('success'));
                            }).catch(e => {
                                this.submitState = false;
                                this.$toast.show(this.$t('mnemonic') + this.$t('error'));
                            });
                        }else{
                            this.account.importPrivate(this.text, this.password).then(data => {
                                // console.log(data);
                                this.submitState = false;
                                this.$router.push("/accountManage");
                                this.$toast.show(this.$t('importAddress') + this.$t('success'));
                            }).catch(e => {
                                this.submitState = false;
                                this.$toast.show(this.$t('privateKey') + this.$t('error'));
                            });
                        }
                    }, 0);
                }).catch(e => {
                    this.submitState = false;
                    this.$toast.show(this.$t('passwordError'));
                });
            },
            submit (){
                if(this.text.length <= 0){
                    if(this.activeIndex == 0){
                        this.$toast.show(this.$t('mnemonic') + this.$t('error'));
                    }else{
                        this.$toast.show(this.$t('privateKey') + this.$t('error'));
                    }
                    return;
                }
                if(this.activeIndex == 1 && !this.rcp.api.isValidSecret(this.text)){
                    this.$toast.show(this.$t('privateKey') + this.$t('error'));
                    return;
                }
                this.isShowPswModal = true;
            },
            selectTab(index) {
                this.activeIndex = index;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container {
        height: 100%;
        .content {
            margin-top: 60px;
            .psw-step-one{
                font-size: 14px;
                color: $color1;
                margin: 20px 15px 12px;
            }
            .inp-password{
                background-color: $bg9;
                border-radius:4px;
                padding: 12px 15px;
                font-size: 14px;
                margin: 0 10px;
                input{
                    appearance: none;
                    border: 0;
                    outline: none;
                    width: 100%;
                    background-color: transparent;
                    color: $active;
                    &::placeholder{
                        color: $color1;
                    }
                }
            }
            .tabs {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 0;
                .tab {
                    font-size: 14px;
                    color: $color1;
                    position: relative;
                    width: 50%;
                    text-align: center;
                    &.active {
                        color: $active;
                    }
                    .active-line {
                        display: inline-block;
                        width: 22px;
                        height: 2px;
                        background-color: $active;
                        position: absolute;
                        bottom: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
            }
        }
        .inputFwk {
            padding: 17px;
            .input-title {
                font-size: 14px;
                color: $color1;
            }
            .input-area {
                font-family: "PingFang SC", "Microsoft Yahei", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                background-color: $bg9;
                border: none;
                margin-top: 20px;
                min-height: 240px;
                outline: none;
                width: 100%;
                padding: 20px;
                font-size: 14px;
                color: $active;
                overflow: hidden;
            }
            &.active {
                display: inline-block;
                width: 100%;
            }
            .error-msg{
                font-size: 12px;
                color: $up;
                margin-top: 12px;
            }
        }
        .submit{
            margin: 0 auto;
        }
    }
</style>