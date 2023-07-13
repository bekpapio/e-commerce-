const { json } = require("body-parser");

class ApiFeatures{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }

    search(){
        const keyword=this.querystr.keyword ? {
            name:{
                $regex:this.querystr.keyword,
                // $option:'i'
            }
        }:{}

        this.query=this.query.find({...keyword});
        return this
    }

    filter(){
        const queryCopy={...this.querystr}

        const removeFields=['keyword','limit','page']
        removeFields.forEach(f=> delete queryCopy[f])

        let queryStr=JSON.stringify(queryCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
        this.query=this.query.find(JSON.parse(queryStr))
        return this

    }

    pagination(resultNum){
        const currentPage=Number(this.querystr.page) || 1;
        const skipNum=resultNum * (currentPage-1);

        this.query=this.query.limit(resultNum).skip(skipNum);
        return this
    }
}

module.exports= ApiFeatures