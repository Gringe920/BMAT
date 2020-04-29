<template>
    <section class="xtwh">
        <img src="../assets/images/logo.png"/>
        <div>系统维护</div>
    </section>
</template>

<script>
    export default {
        name: "error",
        data() {
            return {}
        },
    }
</script>

<style scoped lang="scss">
    .xtwh{
        position: fixed;
        width: 100%;
        height: 100%;
        background: #ffffff;
        font-size: 18px;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        div{
            width: 100%;
            text-align: center;
            padding-top: 50px;
        }
    }
</style>