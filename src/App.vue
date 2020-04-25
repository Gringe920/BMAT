<template>
    <div id="app">
        <router-view/>
        <div v-if="false" class="bg navall" >
            <router-link tag="a"   to="/home"   :class="($route.name=='empty'||$route.name=='home')?'nav-active':''">
                <div class="thenav">
                    <img src="./assets/images/home_press@2x.png" alt="" srcset="" v-if="$route.name=='home'" >
                    <img src="./assets/images/home@2x.png" alt="" srcset="" v-else >
                    <span class="nav-title">{{$t('home.home')}}</span>
                </div>
            </router-link>
            <router-link tag="a" to="/market" :class="$route.name=='market'?'nav-active':''" >
            <!--<a @click="dispark" :class="$route.name=='dapp'?'nav-active':''" >-->
                <div class="thenav">
                    <img src="./assets/images/dapp_press@2x.png" alt="" srcset="" v-if="$route.name=='market'" >
                    <img src="./assets/images/dapp@2x.png" alt="" srcset="" v-else >
                    <span class="nav-title" >行情</span>
                </div>
            <!--</a>-->
            </router-link>
            <router-link tag="a" to="/trade" :class="$route.name=='trade'?'nav-active':''" >
            <!--<a @click="dispark" :class="$route.name=='dapp'?'nav-active':''" >-->
                <div class="thenav">
                    <img src="./assets/images/home_deal_press.png" alt="" srcset="" v-if="$route.name=='trade'" >
                    <img src="./assets/images/home_deal.png" alt="" srcset="" v-else >
                    <span class="nav-title" >{{$t('lang44')}}</span>
                </div>
            <!--</a>-->
            </router-link>
            <router-link tag="a" to="/wallet" :class="$route.name=='wallet'?'nav-active':''" >
                <div class="thenav">
                    <img src="./assets/images/wallet_press@2x.png" alt="" srcset="" v-if="$route.name=='wallet'" >
                    <img src="./assets/images/wallet@2x.png" alt="" srcset="" v-else >
                    <span class="nav-title">{{$t('wallet.name')}}</span>
                </div>
            </router-link>
            <router-link tag="a" to="/user" :class="$route.name=='user'?'nav-active':''" >
                <div class="thenav">
                    <img src="./assets/images/my_press@2x.png" alt="" srcset="" v-if="$route.name=='user'" >
                    <img src="./assets/images/my@2x.png" alt="" srcset="" v-else >
                    <span class="nav-title">{{$t('my')}}</span>
                </div>
            </router-link>
            <!-- <a tag="a" to="/user" @click="dispark">
                <div class="thenav">
                    <img src="./assets/images/transaction_record@2x.png" alt="" srcset="">
                    <span class="nav-title">C2C</span>
                </div>
            </a> -->
        </div>
        <!--<trust-btc v-if="isTrustBtc"></trust-btc>-->
        <!--<nav3-d class="nav3D" v-if="nav3DState"></nav3-d>-->
        <!--<guide v-if="guide == 0"></guide>-->
        <!--<guide></guide>-->

    </div>
</template>
<script>
    import { mapState } from "vuex";
    import Binding from "./components/binding";
    import TrustBtc from "./components/trustBtc";
    // import Nav3D from "./views/nav3D";
    // import Guide from "./components/guide";
    export default {
        name: "app",
        components: {TrustBtc, Binding},
        data() {
            return {
                routeList: ['home', 'wallet', 'dapp', 'user', 'trade', 'market'],
                loginState : false,
            };
        },
        watch:{
            "$route"(n, o) {
                this.showBottomNav();
                this.loginPage();
            },
            connected (){
                this.loginPage();
            },
            gmex_phrase (n, o){
                this.loginPage();
                let p = this.account.RSADecryptPublic(this.gmex_pwd);
                // console.log(this.gmex_pwd, p);
                n.forEach(item =>{
                    // console.log(item);
                    let m = this.account.RSADecryptPublic(item);
                    this.account.importMnemonic(m, p);
                });
            },
        },
        methods: {
            dispark (){
                this.$toast.show(this.$t('dispark'));
            },
            backbutton (){
                let self = this;
                plus.key.addEventListener('backbutton', function (e) {
                    console.log("backbutton");
                    let webview = plus.webview.getLaunchWebview();
                    console.log("webview.id", webview.id);
                    webview.canBack(function (e) {
                        console.log(JSON.stringify(e));
                        if (e.canBack) {
                            webview.back();
                        } else {
                            plus.nativeUI.confirm(self.$t('exitAPP'), function (e) {
                                if (e.index == 0) {
                                    plus.runtime.quit();
                                }
                                ;
                            }, self.$t('title'));
                        };
                    });
                });
            },
            plusReady () {
                if(!/offlinewallet/gi.test(navigator.userAgent)){
                    return false;
                };
                let self = this;
                if (window.plus) {
                    setTimeout(function () {
                        // self.updateApp();
                        self.backbutton();
                    }, 0);
                } else {
                    document.addEventListener("plusready", function () {
                        // self.updateApp();
                        self.backbutton();
                    }, false);
                }
            },
            updateApp (){
                let self = this;
                this.axios({
                    url : "/service/app_info"
                })
                    .then(res => {
                        let data = res.data;
                        if(/android/gi.test(navigator.userAgent)){
                            if(plus.runtime.version != data.app_android_version){
                                if(/\.apk/gi.test(data.app_android_download)){

                                    plus.nativeUI.confirm(data.app_android_update_desc, function(e){
                                        var task = plus.downloader.createDownload(data.app_android_download, {}, function ( d, status ) {
                                            // console.log(d.filename);
                                            if( status == 200 ){
                                                plus.runtime.install(d.filename, {
                                                    force : true
                                                }, function (widgetInfo) {
                                                    console.log(widgetInfo);
                                                }, function (err) {
                                                    console.log(err.message);
                                                });
                                            } else {
                                                console.log( "Download failed: " + status );
                                            };
                                        });
                                        task.start();
                                    }, {
                                        "title": data.app_android_version,
                                        "buttons":[ self.$t('confirm')  ],
                                    });
                                }else{
                                    self.downloadFile(data.app_android_download);
                                }
                            }else{
                                setTimeout(function () {
                                    self.updateApp();
                                }, 8000);
                            };
                        }else{
                            if(plus.runtime.version != data.app_ios_version){
                                if(/\.plist/gi.test(data.app_ios_download)){
                                    plus.nativeUI.confirm(data.app_ios_update_desc, function(e){
                                        plus.runtime.openURL(data.app_ios_download, function (openURLerr) {
                                            console.log(openURLerr);
                                            plus.runtime.openWeb(data.app_ios_download, function (err) {
                                                console.log(err);
                                            });
                                        });
                                    }, {
                                        "title": data.app_ios_version,
                                        "buttons":[ self.$t('confirm') ],
                                    });
                                }else{
                                    self.downloadFile(data.app_ios_download);
                                };
                            }else{
                                setTimeout(function () {
                                    self.updateApp();
                                }, 8000);
                            };
                        };
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                        setTimeout(function () {
                            self.updateApp();
                        }, 8000);
                    });
            },
            downloadFile (wgtUrl) {
                let self = this;
                plus.nativeUI.showWaiting(self.$t('updateApp.lang1'));
                var task = plus.downloader.createDownload(wgtUrl, {filename: "_doc/update/"}, function (d, status) {
                    console.log("下载成功：" + d.filename);
                    if (status == 200) {
                        self.installWgt(d.filename); // 安装wgt包
                    } else {
                        console.log("下载wgt失败！");
                        plus.nativeUI.alert(self.$t('updateApp.lang2'));
                    }
                    ;
                    plus.nativeUI.closeWaiting();
                });

                task.start();
            },
            installWgt (path) {
                let self = this;
                plus.nativeUI.showWaiting(self.$t('updateApp.lang3'));
                plus.runtime.install(path, {}, function () {
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.alert(self.$t('updateApp.lang4'), function () {
                        plus.runtime.restart();
                    });
                }, function (e) {
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.alert(self.$t('updateApp.lang5') + "[" + e.code + "]：" + e.message);
                });
            },
            removeLoad() {
                let timeOut = 500;
                // if(/offlinewallet/gi.test(navigator.userAgent)){
                //     timeOut = 3000;
                // }
                setTimeout(() => {
                    if (document.querySelector("#app-load")) {
                        document.querySelector("#app-load").remove();
                    }
                }, timeOut);

            },
            showBottomNav(){
                this.$store.commit("showNav", this.shouldShowBottomNav());
            },
            shouldShowBottomNav(){
                return this.routeList.indexOf(this.$route.name) > -1
            },
            loginPage (){
                if(this.$route.name =='download'){
                    setTimeout(() => {
                        this.$store.commit('nav3DState', false);
                    }, 3000);
                }
                if((this.gmex_phrase.length <= 0) && (this.$route.name !='download'
                    && this.$route.name !='login'
                    && this.$route.name != 'setupAddr'
                    && this.$route.name != 'importWallet' )){
                    this.toRoute('/login');
                    setTimeout(() => {
                        this.$store.commit('nav3DState', false);
                    }, 3000);
                }
                // if((this.account.accounts.mnemonic == "" || this.account.accounts.address.length <= 0) && this.$route.name !='login'){
                //     this.toRoute('/login');
                // };
            }
        },
        created (){
            this.removeLoad();
            this.plusReady();
            // this.getMarket();
            // this.getAddressInfo();
        },
        mounted(){
            this.showBottomNav();
            // console.log(this.account.accounts);
            // this.account.createWallet('123456');
            // this.account.getAccount();
            // console.log(this.account.accounts.mnemonic);

        },
        computed: {
            ...mapState(['showNav'])
        },
    };
</script>

<style lang="scss">
    body,html{
        padding: 0;
        margin: 0;
        background: $bg;
    }
    #app {
        .nav3D{
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background:$bg;
        .navall {
            box-shadow:-2px 2px 14px 0px rgba(30,49,107,0.1);
            background:$white;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: fixed;
            width: 100vw;
            height: 48px;
            bottom: 0;
            left: 0;
            z-index: 10;
            .nav-active {
                color:  $blue;
                span {
                    color:$blue !important;
                }
            }
            .thenav {
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1.4;
                img {
                    width: 22px;
                    height: 22px;
                }
                span {
                    font-size: 10px;
                    font-weight: 400;
                    color: $primary;
                }
            }
        }
    }
    // xm 2019/11/19
</style>
