// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const serverBaseUrl="http://localhost:2208/api/";
export const environment = {
  production: false,
  imageserverBaseUrl:"http://localhost:2208/",
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

//Vehicle
  addVehicle:serverBaseUrl+'vehicle/addVehicle',
  getVehicle:serverBaseUrl+'vehicle/getVehicles',
  updateVehicle: serverBaseUrl +'vehicle/updateVehicle/{id}',
  deleteVehicle:serverBaseUrl+'vehicle/deleteVehicle/{id}',


  //Hotel
  addHotel:serverBaseUrl+'hotel/addHotel',
  getHotel:serverBaseUrl+'hotel/getHotels',
  updateHotel:serverBaseUrl+'hotel/updateHotel/{id}',
  deleteHotel:serverBaseUrl+'hotel/deleteHotel/{id}',
  getHotelsByArea:serverBaseUrl+'hotel/getHotelsByArea',
  uploadHotel:serverBaseUrl+'hotel/uploadHotel',

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
  uploadUser:serverBaseUrl+'auth/uploadUser',

   //Partiipant
  addParticipant:serverBaseUrl+'participant/addParticipant',
  getParticipant:serverBaseUrl+'participant/getParticipants',
  updateParticipant:serverBaseUrl+'participant/updateParticipant/{id}',
  deleteParticipant:serverBaseUrl+'participant/deleteParticipant/{id}',

  //Reports
  getAllocation:serverBaseUrl+'reports/detailedAllocationReport',
  getOccupancy:serverBaseUrl+'reports/detailedOccupancyReport',



};





/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
