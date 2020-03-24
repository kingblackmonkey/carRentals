export const makeBingMap = ({foundCarLoc})=>{
    var map = null, infobox, dataLayer;


let centerPoinsBasedOnfirstCarLoc = foundCarLoc[0].locationCoordinates.coordinates


    function GetMap() {
        // Initialize the map
        map = new Microsoft.Maps.Map(document.getElementById("myMap"),
                   { credentials: "Ao8E3Nx8O0JkzoD7wvQc4LwoA2OuMXACZXYv2SxR8xxmiohl_n3-YexqN9MmUv6_" 
                   
     ,
        mapTypeId:  Microsoft.Maps.MapTypeId.road,
        enableClickableLogo: false,
        enableSearchLogo: false,
        center: new  Microsoft.Maps.Location( centerPoinsBasedOnfirstCarLoc[1],  centerPoinsBasedOnfirstCarLoc[0]),
        zoom: 10,
        theme: new  Microsoft.Maps.Themes.BingTheme()              
                   });

        dataLayer = new Microsoft.Maps.EntityCollection();
        map.entities.push(dataLayer);

        var infoboxLayer = new Microsoft.Maps.EntityCollection();
        map.entities.push(infoboxLayer);

        infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, offset: new Microsoft.Maps.Point(0, 20) });
        infoboxLayer.push(infobox);

        AddData();
    }

    function AddData() {

        foundCarLoc.forEach((carLoc,i) => {
            var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(carLoc.locationCoordinates.coordinates[1], carLoc.locationCoordinates.coordinates[0]));
            pin.Title = `Store ${i+1}` ;
            pin.Description = `${carLoc.address} ${carLoc.city} ${carLoc.state} ${carLoc.country} ${carLoc.zipcode} `;
            Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
            dataLayer.push(pin);
    
        });

        // var pin1 = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(47.592, -122.323));
        // pin1.Title = "This is Pin 1";
        // pin1.Description = "Pin 1 description";
        // Microsoft.Maps.Events.addHandler(pin1, 'click', displayInfobox);
        // dataLayer.push(pin1);

        // var pin2 = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(47.592, -121.323));
        // pin2.Title = "This is Pin 2";
        // pin2.Description = "Pin 2 description";
        // Microsoft.Maps.Events.addHandler(pin2, 'click', displayInfobox);
        // dataLayer.push(pin2);
    }

    function displayInfobox(e) {
        if (e.targetType == 'pushpin') {
            infobox.setLocation(e.target.getLocation());
            infobox.setOptions({ visible: true, title: e.target.Title, description: e.target.Description });
        }
    }  

    GetMap()
}