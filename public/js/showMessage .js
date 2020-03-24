// $(function(){

// let wishlistMessage =document.querySelector('.nav-wishlist').dataset.wishlist
//  if(wishlistMessage){

//      $.notify(`${wishlistMessage}`,'success');
//  }

     
// });


export const showWishlistMessage = (wishlistMessage)=>{
    if(wishlistMessage){

     $.notify(`${wishlistMessage}`,'success');
 }
}

export const showMessage = (type, Message)=>{
    if(type && Message){

     $.notify(`${Message}`,{  className: `${type}`, globalPosition:'top left'});
 }
}


export const showSuccessfultMessage = (successfulLoginMessage)=>{
  

     $.notify(`${successfulLoginMessage}`,'success');
 
}