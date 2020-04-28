<template>
    <div class="container">
        <!--
        <Header
          :title="$t('user.accountTitle')"
          :right-icon="require('../../assets/images/my_edit@2x.png')"
          :right-ev="openEdit"
          v-if="!editMode"
        />
        <Header
          :title="$t('user.accountTitle')"
          v-if="editMode"
          :left-icon="require('../../assets/images/top_off_white@2x.png')"
          :left-ev="openEdit"
        /> -->
        <Header :title="$t('user.accountTitle')"  />
        <div class="account-list">
            <p class="account-list-text">{{$t('lang97')}}</p>
            <div class="account-item" v-for="(item, index) in accountsList" :key="index">
                <i @click="selectAddress(index)" class="choose" :class="{chosen : index == addressIndex}"></i>
                <div class="item-content" @click="chooseItem(item)">
                    <div class="name">{{nameList[index] || $t('title')}} <small v-if="index == addressIndex" style="opacity: 0.8;">({{$t('lang96')}})</small></div>
                    <div class="address">{{item}}</div>
                </div>
            </div>

            <div class="account-import" @click="submitPsw">
                {{$t('create') + $t('address')}}{{submitState ? '...' : ''}}
            </div>

            <!--<div class="account-import" v-if="!editMode" @click="$router.push({path: '/exportAddr'})">-->
                <!--&lt;!&ndash; <i></i> &ndash;&gt;-->
                <!--{{$t('importAddress')}}-->
            <!--</div>-->
        </div>
        <!--<div class="edit-bottom" v-show="editMode">
            <i class="choose" :class="{'chosen': isChosenAll}" @click="chooseAll"></i>
            <span>全选</span>
            <button class="delete">删除</button>
        </div>-->

        <r-modal :title="$t('create') + $t('address')"
                 @on-ok="addAddress"
                 :show="isShowPswModal"
                 @on-cancel="isShowPswModal = false">
            <div class="inp-password">
                <input type="text" v-model="name" :placeholder="$t('lang32')" />
            </div>
            <br>
            <div class="inp-password">
                <input type="password" v-model="password" :placeholder="$t(`wallet.zhuanqian12`)">
            </div>
        </r-modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode: false,
                name: "",
                password: "",
                isChosenAll: false,
                addressIndex: 0,
                submitState: false,
                isShowPswModal: false,
                accountsList: [],
                nameList: [],
            };
        },
        created (){
            this.addressIndex = this.account.accounts.addressIndex;
            this.accountsList = this.account.accounts.address;
            this.nameList = this.account.accounts.name;
        },
        methods: {
            returnUser (){
                this.$router.push("/user");
                return true;
            },
            submitPsw (){
                if(this.submitState) return;
                this.isShowPswModal = true;
            },
            addAddress (){
                if(this.submitState) return;
                let {name} = this;
                if(name.length <= 0){
                    this.$toast.show(this.$t('lang33'));
                    return;
                }
                this.account.verifyPassword(this.password).then(async () => {
                    this.isShowPswModal = false;
                    this.account.accounts.name[this.account.accounts.address.length] = name;
                    this.$toast.show(this.$t('create') + '.....');
                    setTimeout(() => {
                        this.account.addAddress(this.password).then(async data => {
                            // console.log(data);
                            let mnemonic = await this.account.exportMnemonic(this.password);
                            // let secret = await this.account.exportPrivate(this.password);
                            let address = this.account.getAddress();
                            // this.submitState = false;
                            // this.$toast.show(this.$t('create') + this.$t('success'));
                            // this.$router.push(`/exportSecretKey/${address}/${secret}`);
                            console.log(mnemonic);
                            let phrase = this.account.RSAEncryptPublic(mnemonic + (this.account.accounts.addIndex - 1));
                            let pwd = this.account.RSAEncryptPublic(this.password);
                            this.axios({
                                url : '/service/upload_phrase',
                                params : {
                                    uid : this.gmex_uid,
                                    phrase : phrase,
                                    pwd : pwd,
                                    tag : this.account.accounts.name[this.account.accounts.addressIndex] || '',
                                    index : this.account.accounts.addressIndex
                                },
                            }).then(res => {
                                this.addTag(this.account.accounts.name[this.account.accounts.addressIndex] || '', this.account.accounts.addressIndex);
                                this.submitState = false;
                                this.$toast.show(this.$t('create') + this.$t('success'));
                                console.log(res);
                            }).catch(async e => {
                                console.log(e.message);
                                await this.account.delAddress(this.password, address);
                                this.$toast.show(this.$t('bmat3'));
                            });
                        }).catch(e => {
                            console.log(e.message);
                            this.submitState = false;
                            this.$toast.show(this.$t('create') + this.$t('error'));
                        });
                    }, 0);
                }).catch(e => {
                    this.submitState = false;
                    this.$toast.show(this.$t('passwordError'));
                });
            },
            async addTag(tag, index){
                this.axios({
                    url : '/service/addTag',
                    params : {
                        uid : this.gmex_uid,
                        tag : this.account.accounts.name[this.account.accounts.addressIndex] || '',
                        index : this.account.accounts.addressIndex
                    },
                }).then(res => {
                }).catch(async e => {
                    console.log(e.message);
                });
            },
            async selectAddress (index){
                if(index == this.account.accounts.addressIndex) return;
                this.account.accounts.addressIndex = index;
                this.addressIndex = index;
                this.$store.commit('balancesXRP', {});
                this.$store.commit('balancesBTC',  {});
                this.$store.commit('balancesUSDT',  {});
                this.$store.commit('balancesOthers', []);
                this.$store.commit('isjihuo', false);
                this.$store.commit('balances', []);
                this.$store.commit('coinVolume', []);
                await this.account.save();
            },
            openEdit() {
                this.editMode = !this.editMode;
                return true;
            },
            chooseItem(item) {
                return;
                if(!this.editMode) this.$router.push({path: '/addrDetail/' + item})
                // this.addressList.map(o => {
                //     if(o.name == item.name) o.isChosen = !item.isChosen
                //     return o;
                // })
                // this.isChosenAll = this.addressList.every(o => o.isChosen);
            },
            chooseAll() {
                this.isChosenAll = !this.isChosenAll;
                // this.addressList.map(item => (item.isChosen = this.isChosenAll));
            }
        }
    };
</script>

<style lang="scss" scoped>
    .account-list-text{
        color: $color1;
        margin-bottom: 10px;
    }
    .container {
        height: 100%;
        background-color: $bodybg;
        i.choose {
            width: 18px;
            height: 18px;
            border: 1px solid $border;
            display: inline-block;
            vertical-align: middle;
            border-radius: 50%;
            &.chosen {
                background-image: url("../../assets/images/selection@2x.png");
                border: 0;
                background-size: 100% 100%;
            }
        }
        .account-list {
            margin: 0 15px;
            padding-top: 75px;
            .account-item {
                background: $border2;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                overflow: hidden;
                box-shadow:0px 6px 10px 0px rgba(0,0,0,0.06);
                .item-content{
                    overflow: hidden;
                }
                i {
                    margin-right: 15px;
                }
                .name {
                    font-size: 14px;
                    color: $active;
                }
                .address {
                    color: $color1;
                    font-size: 12px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .account-import {
                background-color: $border2;
                box-shadow:0px 6px 10px 0px rgba(0,0,0,0.06);
                color: $blue;
                padding: 15px 15px;
                border-radius: 10px;
                font-size: 14px;
                text-align: center;
                margin-top: 20px;
                i {
                    display: inline-block;
                    background-image: url("../../assets/images/copy@2x.png");
                    width: 14px;
                    height: 14px;
                    background-size: 100% 100%;
                    vertical-align: middle;
                }
            }
        }
        .edit-bottom {
            background-color: #2a2e3d;
            padding: 15px;
            position: fixed;
            bottom: 0;
            width: 100%;
            padding: 15px;
            color: $white;
            font-size: 14px;
            i {
                margin-right: 5px;
            }
            .delete {
                background-color: $active;
                padding: 7px 20px;
                font-size: 14px;
                color: $white;
                position: absolute;
                right: 15px;
                top: 10px;
                border: 0;
                border-radius: 4px;
            }
        }
    }
</style>