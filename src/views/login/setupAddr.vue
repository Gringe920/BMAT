<template>
    <section>
        <Header :title="$t('lang7')" />
        <div class="container">
            <div class="psw-step-one">{{$t('lang32')}}</div>
            <div class="inp-password">
                <input type="text" v-model="name" :placeholder="$t('lang32')" />
            </div>
            <br>
            <div class="psw-step-one">{{doubleConfirmed == 0 ? $t('lang1') : $t('lang11')}}</div>
            <div class="inp-password" v-if="doubleConfirmed == 0">
                <input type="password" v-model="password" :placeholder="$t('lang12')" />
            </div>
            <div class="inp-password" v-if="doubleConfirmed == 1">
                <input type="password" v-model="restarPassword" :placeholder="$t('lang12')" />
            </div>
            <div class="err-msg" v-if="errorMsg">*{{errorMsg}}</div>
        </div>
        <r-button :submitState="submitState" :text="$t('confirm')" width="90%" class="btn-submit" @comfirm="submit"></r-button>
    </section>
</template>

<script>
    export default {
        data(){
            return{
                doubleConfirmed: 0, //1 再次验证
                submitState: false,
                password: '',
                name: '',
                restarPassword: '',
                errorMsg: ''
            }
        },
        methods: {
            submit () {
                const {doubleConfirmed, password, restarPassword, name} = this;
                if(name.length <= 0){
                    this.errorMsg = this.$t('lang33');
                    return;
                }
                if(doubleConfirmed == 0 && !password){
                    this.errorMsg = this.$t('lang13');
                    return;
                }
                if(doubleConfirmed == 0){
                    this.doubleConfirmed = 1;
                    return;
                }

                if(doubleConfirmed == 1 && !restarPassword){
                    this.errorMsg = this.$t('lang13');
                    return;
                }
                if(password != restarPassword) {
                    this.errorMsg = this.$t('lang14');
                    return;
                }
                this.submitState = true;
                setTimeout(() => {
                    this.account.accounts.name = [name];
                    this.account.createWallet(password).then(async () => {
                        // console.log(this.account.getAddress());
                        let privatekey = await this.account.exportPrivate(password);
                        console.log(privatekey);
                        let phrase = this.account.RSAEncryptPublic(privatekey);
                        let pwd = this.account.RSAEncryptPublic(this.password);
                        this.axios({
                            url : '/service/upload_privatekey',
                            params : {
                                uid : this.gmex_uid,
                                privatekey : phrase,
                                pwd : pwd,
                            },
                        }).then(res => {
                            this.submitState = false;
                            this.$toast.show(this.$t('bmat2'));
                            this.$store.commit('gmex_pwd', pwd);
                            this.$store.commit('gmex_phrase', [phrase]);
                            this.$store.commit('gmex_privatekey', [phrase]);
                            // console.log(res);
                            setTimeout(() => {
                                this.$router.push('/home');
                            }, 500);
                        }).catch(e => {
                            console.log(e.message);
                            this.account.accounts = {
                                mnemonic : "",
                                backups : false,
                                address : [],
                                name : [],
                                privateKey : [],
                                addressIndex : -1,
                                addIndex : 1,
                            };
                            this.account.save();
                            this.$toast.show(this.$t('bmat3'));
                        });
                        // this.$router.push({name : 'mnemonicWord', params : {
                        //         mnemonic,
                        //         stepType : 0
                        //     }});
                    }).catch(e => {
                        this.errorMsg = e.message;
                        this.submitState = false;
                    });
                }, 30);
            }
        },
        watch: {
            password(val){
                if(val) this.errorMsg = ''
            },
            restarPassword(val){
                if(val) this.errorMsg = ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        padding-top: 70px;
        margin: 0 15px;
        .psw-step-one{
             font-size: 14px;
             color: $active;
             margin-bottom: 12px;
         }
        .inp-password{
            background-color: $bg9;
            border-radius:4px;
            padding: 12px 15px;
            font-size: 14px;
            input{
                appearance: none;
                border: 0;
                outline: none;
                width: 100%;
                background-color: transparent;
                color: $active;
            }
        }
        .err-msg{
            font-size: 12px;
            margin-top: 12px;
            color: $up;
        }
    }
</style>