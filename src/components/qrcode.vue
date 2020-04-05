<template>
    <div>
        <canvas id="canvas"></canvas>
    </div>
</template>
<script>
import QRCode from 'qrcode'
export default {
    props: {
        qrcodeUrl: String
    },
    mounted(){
        this.setQrcode();
    },
    watch : {
        qrcodeUrl () {
            this.setQrcode();
        }
    },
    methods: {
        setQrcode(){
            const canvas = document.getElementById('canvas');
            const {qrcodeUrl} = this;
            QRCode.toCanvas(canvas, qrcodeUrl, err => {
                // if(err) console.log(err);
                // console.log('qrcode success')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
#canvas{
    width: 100% !important;
    height: 100% !important;
}
</style>