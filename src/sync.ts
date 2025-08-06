import Elysia from "elysia";

const sync = new Elysia()
    .get("/sync",()=>{
        // 获取notion数据并同步
    })