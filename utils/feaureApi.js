class Features {
    constructor(collection, queryFromReq = {}){
        this.collection = collection;
        this.queryFromReq = queryFromReq;
    }

   filters(){
    const filters = {...this.queryFromReq}
    delete filters.sort
delete filters.fields
delete filters.page
delete filters.limit
let queryStr = JSON.stringify(filters)
// console.log(this.queryFromReq)
queryStr =  queryStr.replace(/\b(lt|gt|gte|lte)\b/g, match =>`$${match}` )
console.log(JSON.parse(queryStr))

//{price: {$lt:'300', $gt:'100'}} will work even number is a string; it is a string because it was on query object
//the dolar sign was added by the code above if there was any lt,gt,gte or lte
// the query url was like this http://127.0.0.1:3000/api/v1/cars?price[lt]=300&price[gt]=100



// {price:['215', '300']} also work ; it will return doc with price equal to 215 or doc with price equal to 300
// the query url was like this http://127.0.0.1:3000/api/v1/cars?price=215&price=300
this.collection =  this.collection.find(JSON.parse(queryStr))
return this
   } 

   sort(){
    this.queryFromReq.sort?  this.collection =  this.collection.sort(  this.queryFromReq.sort.split(',').join(' ')) : this.collection = this.collection.sort('requiredDeposit')
  return this
} 

selectedFields(){
    this.queryFromReq.fields?   this.collection =  this.collection.select(  this.queryFromReq.fields.split(',').join(' ')):  this.collection = this.collection.select('-__v')
return this
}
 pagination(){ 
    let page =  this.queryFromReq.page * 1 || 1;
let itemsPerpage    =   3;
let skip = (page - 1) * itemsPerpage
this.collection =  this.collection.skip(skip).limit(  this.queryFromReq.limit * 1|| 3)


return this
}
}

module.exports = Features 