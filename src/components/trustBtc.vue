<template>
    <r-modal :title="$t(`trust`) + 'ADS' + $t(`gateway`)" @on-ok="submitPsw" :show="true" @on-cancel="cancel">
        <div class="inp-password">
            <input type="password" v-model="password" :placeholder="$t(`wallet.zhuanqian12`)">
        </div>
    </r-modal>
</template>

<script>
    export default {
        name: "trustBtc",
        data() {
            return {
                password : "",
                submitState : false,
            }
        },
        mounted (){
        },
        methods : {
            cancel (){
                this.$store.commit("isTrustBtc", false);
            },
            ust (seed){
                this.rcp.prepareTrustline({
                    "currency": 'UST',
                    "counterparty": this.ust_gateway_address,
                    "limit": "100000000000",
                }, seed).then(data => {
                    this.submitState = false;
                    this.$store.commit("isTrustBtc", false);
                    if(data.engine_result_code == 0){
                    }else{
                        console.log(data.engine_result_message);
                        this.$toast.show(data.engine_result_message);
                    }
                }).catch(e => {
                    console.log(e);
                    this.submitState = false;
                    this.$toast.show(e.message);
                });
            },
            submitPsw (){
                let {password} = this;
                if(this.submitState) return;
                this.account.verifyPassword(password).then(async () => {
                    let seed = await this.account.exportPrivate(this.password);
                    this.rcp.prepareTrustline({
                        "currency": 'ADS',
                        "counterparty": this.btcAddress,
                        "limit": "100000000000",
                    }, seed).then(data => {
                        this.submitState = false;
                        this.$store.commit("isTrustBtc", false);
                        if(data.engine_result_code == 0){
                            this.$toast.show(this.$t('trust') + this.$t('success'));
                        }else{
                            this.$toast.show(data.engine_result_message);
                        }
                        this.ust(seed);
                    }).catch(e => {
                        this.submitState = false;
                        this.$toast.show(e.message);
                    });

                }).catch(e => {
                    this.$toast.show(this.$t('passwordError'));
                });

            },
        }
    }
</script>

<style scoped lang="scss">
</style>