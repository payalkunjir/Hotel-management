
const serverBaseUrl="http://167.99.234.75:2208/api/";
export const environment = {
  production: true,

 //Login
 login:serverBaseUrl+'auth/login',

 //Area
 addArea:serverBaseUrl+'area/addArea',
 getArea:serverBaseUrl+'area/getAreas',
 updateArea: serverBaseUrl +'area/updateArea/{id}',
 deleteArea:serverBaseUrl+'area/deleteArea/{id}',


 //Driver
 addDriver:serverBaseUrl+'driver/addDriver',
 getDriver:serverBaseUrl+'driver/getDrivers',
 updateDriver: serverBaseUrl +'driver/updateDriver/{id}',
 deleteDriver:serverBaseUrl+'driver/deleteDriver/{id}',


 //Designation
 addDesignation:serverBaseUrl+'designation/addDesignation',
 getDesignation:serverBaseUrl+'designation/getDesignations',
 updateDesignation:serverBaseUrl+'designation/updateDesignation/{id}',
 deleteDesignation:serverBaseUrl+'designation/deleteDesignation/{id}',

// Guest Category
 addGuestCategory:serverBaseUrl+'guestCategory/addGuestCategory',
 getGuestCategories:serverBaseUrl+'guestCategory/getGuestCategories',
 updateGuestCategory: serverBaseUrl +'guestCategory/updateGuestCategory/{id}',
 deleteGuestCategory:serverBaseUrl+'guestCategory/deleteGuestCategory/{id}',


 addVehicle:serverBaseUrl+'vehicle/addVehicle',
 getVehicle:serverBaseUrl+'vehicle/getVehicles',
 updateVehicle: serverBaseUrl +'vehicle/updateVehicle/{id}',
 deleteVehicle:serverBaseUrl+'vehicle/deleteVehicle/{id}',


 //Hotel
 addHotel:serverBaseUrl+'hotel/addHotel',
 getHotel:serverBaseUrl+'hotel/getHotels',
 updateHotel:serverBaseUrl+'hotel/updateHotel/{id}',
 deleteHotel:serverBaseUrl+'hotel/deleteHotel/{id}',

 //Venue
 addVenue:serverBaseUrl+'venue/addVenue',
 getVenue:serverBaseUrl+'venue/getVenues',
 updateVenue:serverBaseUrl+'venue/updateVenue/{id}',
 deleteVenue:serverBaseUrl+'venue/deleteVenue/{id}',

 // User
 addUser:serverBaseUrl+'auth/user',
 getUser:serverBaseUrl+'auth/user',
 updateUser:serverBaseUrl+'auth/user/{id}',
 deleteUser:serverBaseUrl+'auth/user/{id}',

 //Partiipant
 addParticipant:serverBaseUrl+'participant/addParticipant',
 getParticipant:serverBaseUrl+'participant/getParticipants',
 updateParticipant:serverBaseUrl+'participant/updateParticipant/{id}',
 deleteParticipant:serverBaseUrl+'participant/deleteParticipant/{id}',
};
