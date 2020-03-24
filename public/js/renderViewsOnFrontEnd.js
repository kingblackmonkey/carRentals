export const renderMaplocationView = ({foundCarLoc},carUserIsllokingfor )=>{
  let carContainer =  document.querySelector('.car-container');

 let htmlString =    foundCarLoc.map((loc,i)=>{
            return `
                
            <div> 
                <h3>Store ${i+1}</h3>
                <h6> Car Name: <small>${carUserIsllokingfor.name}</small></h6>
                <h6> Car Brand: <small>${carUserIsllokingfor.brand}</small></h6>
                <br>
                <img src="${carUserIsllokingfor.imageCover}"   width=200 height=200          >
                <br><br>
                <h6>Store Address: <small>${loc.address} ${loc.city} ${loc.state} ${loc.country} ${loc.zipcode}</small>    </h6>
                <br>
                <h6> Store Phone Number: <small>${loc.storePhoneNumber}</small>  </h6>
                <br>
                <h6> Store Manager: <small>${loc.managers.name} </small></h6>
                <br>
                <h6> Manager Email Address: <small>${loc.managers.email} </small></h6>
                <br>
                <h6> Driving Distance From Your Location: <small>${loc.drivingDistance}</small></h6>
                <br>
                <h6> Driving Time: <small>${loc.drivingTime}</small></h6>
            </div>
            
            `
        })

  carContainer.innerHTML = 
  `
  <div class='row'> 
    <div class="col-sm-4" id="contact2">
        
        ${htmlString}


    </div>
    <div class="col-sm-8">
        <div id='myMap' style="height:320px "></div>
    </div>
  </div>
  
  
  
  
  
  
  
  
  
  
  
  
  
  `
}