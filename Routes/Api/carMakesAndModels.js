const express = require("express");
const router = express.Router();
const CarMakesAndModels = require("../../models/CarMakesAndModels");
const config = require("config");

// @route   POST /api/carMakesAndModels/createLists
// @desc    Get all the carMakesAndModels
// @access  ADMIN
router.post("/createLists", (req, res) => {
  const { valid } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  CarMakesAndModels.find({})
    .then((documents) => {
      if (documents.length) {
        console.log("Make exists");
        return res
          .status(400)
          .json({ success: false, msg: "Makes already exists." });
      }

      // Function call
      CarMakesAndModels.insertMany([
        {
          make: "Ashok-Leyland",
          key: "0",
          models: [
            { model: "Dost FSD", bodyType: "Pickup Truck", id: "1" },
            { model: "Dost HSD", bodyType: "Pickup Truck", id: "2" },
            { model: "Dost container", bodyType: "Pickup Truck", id: "3" },
          ],
        },
        {
          make: "Baw",
          key: "1",
          models: [{ model: "Warrior", bodyType: "SUV", id: "1" }],
        },
        {
          make: "BYD",
          key: "2",
          models: [
            { model: "E6", bodyType: "SUV", id: "1" },
            { model: "M3", bodyType: "Van", id: "2" },
            { model: "T3", bodyType: "Van", id: "3" },
            { model: "Song Max", bodyType: "SUV", id: "4" },
          ],
        },
        {
          make: "Chery",
          key: "3",
          models: [
            { model: "A1", bodyType: "Hatchback", id: "1" },
            { model: "Tiggo", bodyType: "SUV", id: "2" },
            { model: "Sweet", bodyType: "Hatchback", id: "3" },
          ],
        },
        {
          make: "Chevrolet",
          key: "4",
          models: [
            { model: "Optra", bodyType: "Sedan", id: "1" },
            { model: "Beat", bodyType: "Hatchback", id: "2" },
            { model: "Spark", bodyType: "Hatchback", id: "3" },
            { model: "Aveo", bodyType: "Hatchback", id: "4" },
            { model: "Captiva", bodyType: "Hatchback", id: "5" },
          ],
        },
        {
          make: "Daihatsu",
          key: "5",
          models: [
            { model: "Charmant", bodyType: "Sedan", id: "1" },
            { model: "Terios", bodyType: "SUV", id: "2" },
            { model: "Sirion", bodyType: "Hatchback", id: "3" },
            { model: "Cuore", bodyType: "Hatchback", id: "4" },
          ],
        },
        {
          make: "Datsun",
          key: "6",
          models: [
            { model: "Go", bodyType: "Hatchback", id: "1" },
            { model: "Redi-Go", bodyType: "Hatchback", id: "2" },
          ],
        },
        {
          make: "Daewoo",
          key: "7",
          models: [{ model: "Matiz", bodyType: "Hatchback", id: "1" }],
        },
        {
          make: "Dahe",
          key: "8",
          models: [
            { model: "DH350", bodyType: "Hatchback", id: "1" },
            { model: "DH350L", bodyType: "Hatchback", id: "2" },
          ],
        },
        {
          make: "Eicher",
          key: "9",
          models: [
            { model: "Pro 1049", bodyType: "Sedan", id: "1" },
            { model: "Polaris", bodyType: "Hatchback", id: "2" },
          ],
        },
        {
          make: "Fiat",
          key: "10",
          models: [
            { model: "Punto", bodyType: "Hatchback", id: "1" },
            { model: "Linea", bodyType: "Sedan", id: "2" },
            { model: "Avventura", bodyType: "SUV", id: "3" },
            { model: "Palio", bodyType: "Hatchback", id: "4" },
            { model: "Seina", bodyType: "Sedan", id: "5" },
          ],
        },
        {
          make: "Ford",
          key: "11",
          models: [
            { model: "Figo", bodyType: "Hatchback", id: "1" },
            { model: "Aspire", bodyType: "Sedan", id: "2" },
            { model: "Freestyle", bodyType: "SUV", id: "3" },
            { model: "Ecosports", bodyType: "SUV", id: "4" },
            { model: "Endeavour", bodyType: "SUV", id: "5" },
            { model: "Ranger", bodyType: "Pickup Truck", id: "6" },
            { model: "Ikon", bodyType: "Sedan", id: "7" },
            { model: "Fiesta", bodyType: "Hatchback", id: "8" },
            { model: "Classic", bodyType: "Sedan", id: "9" },
          ],
        },
        {
          make: "Force",
          key: "12",
          models: [
            { model: "Trax", bodyType: "SUV", id: "1" },
            { model: "Traveller", bodyType: "Van", id: "2" },
            { model: "Kargo", bodyType: "Pickup Truck", id: "3" },
            { model: "Gurkha", bodyType: "SUV", id: "4" },
          ],
        },
        {
          make: "Foton",
          key: "13",
          models: [
            { model: "Tunland", bodyType: "Pickup truck", id: "1" },
            { model: "Faw", bodyType: "Pickup truck", id: "2" },
            { model: "View", bodyType: "Van", id: "3" },
          ],
        },
        {
          make: "Geely",
          key: "14",
          models: [
            { model: "CK", bodyType: "Sedan", id: "1" },
            { model: "MK", bodyType: "Hatchback", id: "2" },
            { model: "Panda", bodyType: "Hatchback", id: "3" },
          ],
        },
        {
          make: "Honda",
          key: "15",
          models: [
            { model: "Amaze", bodyType: "Sedan", id: "1" },
            { model: "City", bodyType: "Sedan", id: "2" },
            { model: "WR-V", bodyType: "SUV", id: "3" },
            { model: "CR-V", bodyType: "SUV", id: "4" },
            { model: "BR-V", bodyType: "SUV", id: "5" },
            { model: "Brio", bodyType: "Hatchback", id: "6" },
            { model: "Jazz", bodyType: "Hatchback", id: "7" },
            { model: "Civic", bodyType: "Sedan", id: "8" },
            { model: "Stream", bodyType: "Wagon", id: "9" },
            { model: "HR-V", bodyType: "SUV", id: "10" },
            { model: "Mobilio", bodyType: "Wagon", id: "11" },
          ],
        },
        {
          make: "Hyundai",
          key: "16",
          models: [
            { model: "Santro", bodyType: "Hatchback", id: "1" },
            { model: "Grand i10", bodyType: "Hatchback", id: "2" },
            { model: "Elite i20", bodyType: "Hatchback", id: "3" },
            { model: "i20 Active", bodyType: "SUV", id: "4" },
            { model: "Xcent", bodyType: "Sedan", id: "5" },
            { model: "Verna", bodyType: "Sedan", id: "6" },
            { model: "Venue", bodyType: "SUV", id: "7" },
            { model: "Creta", bodyType: "SUV", id: "8" },
            { model: "Tucson", bodyType: "SUV", id: "9" },
            { model: "Santa Fe", bodyType: "SUV", id: "10" },
            { model: "Ioniq", bodyType: "Sedan", id: "11" },
            { model: "Kona", bodyType: "SUV", id: "12" },
            { model: "Eon", bodyType: "Hatchback", id: "13" },
            { model: "Matrix", bodyType: "Hatchback", id: "14" },
            { model: "i10", bodyType: "Hatchback", id: "15" },
            { model: "i20", bodyType: "Hatchback", id: "16" },
            { model: "Getz", bodyType: "Hatchback", id: "17" },
            { model: "Sonata", bodyType: "Sedan", id: "18" },
          ],
        },
        {
          make: "Isuzu",
          key: "17",
          models: [
            { model: "V-Cross", bodyType: "Pickup Truck", id: "1" },
            { model: "MU-X", bodyType: "SUV", id: "2" },
            { model: "S-CAB", bodyType: "Pickup Truck", id: "3" },
            { model: "Bighorn", bodyType: "SUV", id: "4" },
            { model: "Trooper", bodyType: "SUV", id: "5" },
          ],
        },
        {
          make: "Jeep",
          key: "18",
          models: [{ model: "Compass", bodyType: "SUV", id: "1" }],
        },
        {
          make: "Kia",
          key: "19",
          models: [
            { model: "Sportage", bodyType: "SUV", id: "1" },
            { model: "Soul", bodyType: "SUV", id: "2" },
            { model: "Rio", bodyType: "Hatchback", id: "3" },
            { model: "Picanto", bodyType: "Hatchback", id: "4" },
            { model: "Cerato", bodyType: "Sedan", id: "5" },
            { model: "Niro", bodyType: "SUV", id: "6" },
            { model: "Pregio", bodyType: "Van", id: "7" },
            { model: "Pride", bodyType: "Hatchback", id: "8" },
            { model: "Carnival", bodyType: "Wagon", id: "9" },
            { model: "Sorento", bodyType: "SUV", id: "10" },
          ],
        },
        {
          make: "Land Rover",
          key: "20",
          models: [
            { model: "Freelander", bodyType: "SUV", id: "1" },
            { model: "Defender", bodyType: "SUV", id: "2" },
            { model: "Discovery", bodyType: "SUV", id: "3" },
          ],
        },
        {
          make: "Mahindra",
          key: "21",
          models: [
            { model: "Bolero", bodyType: "SUV", id: "1" },
            { model: "Scorpio", bodyType: "SUV", id: "2" },
            { model: "Thar", bodyType: "SUV", id: "3" },
            { model: "KUV100", bodyType: "SUV", id: "4" },
            { model: "KUV300", bodyType: "SUV", id: "5" },
            { model: "XUV500", bodyType: "SUV", id: "6" },
            { model: "XUV300", bodyType: "SUV", id: "7" },
            { model: "Marazoo", bodyType: "Wagon", id: "8" },
            { model: "TUV300", bodyType: "SUV", id: "9" },
            { model: "Scorpio Pickup", bodyType: "SUV", id: "9" },
            { model: "Bolero Pickup", bodyType: "SUV", id: "10" },
            { model: "E20", bodyType: "Hatchback", id: "11" },
            { model: "E20 Plus", bodyType: "Hatchback", id: "12" },
            { model: "Verito", bodyType: "Hatchback", id: "13" },
            { model: "E-Verito", bodyType: "Hatchback", id: "14" },
            { model: "Alturas G4", bodyType: "SUV", id: "15" },
          ],
        },
        {
          make: "Mitsubishi",
          key: "22",
          models: [
            { model: "Pajero", bodyType: "SUV", id: "1" },
            { model: "Outlander", bodyType: "SUV", id: "2" },
            { model: "Asx", bodyType: "SUV", id: "3" },
            { model: "LC-200", bodyType: "Pickup Truck", id: "4" },
            { model: "Eclipse Cross", bodyType: "Pickup Truck", id: "5" },
            { model: "Mirage", bodyType: "Hatchback", id: "6" },
          ],
        },
        {
          make: "MG",
          key: "23",
          models: [
            { model: "MG 3", bodyType: "Hatchback", id: "1" },
            { model: "MG 6", bodyType: "Sedan", id: "2" },
            { model: "MG GS", bodyType: "SUV", id: "3" },
            { model: "MG ZS", bodyType: "SUV", id: "4" },
            { model: "MG ZS EV", bodyType: "SUV", id: "4" },
          ],
        },
        {
          make: "Mazda",
          key: "24",
          models: [
            { model: "CX-5", bodyType: "SUV", id: "1" },
            { model: "CX-9", bodyType: "SUV", id: "2" },
            { model: "Mazda 6", bodyType: "Sedan", id: "3" },
            { model: "Mazda 3", bodyType: "Hatchback", id: "4" },
            { model: "Mazda 2", bodyType: "Hatchback", id: "5" },
            { model: "Mazda BT-50", bodyType: "Pickup Truck", id: "6" },
            { model: "CX-7", bodyType: "SUV", id: "7" },
            { model: "CX-3", bodyType: "SUV", id: "8" },
          ],
        },
        {
          make: "Mercedes-Benz",
          key: "25",
          models: [
            { model: "C- Class", bodyType: "Sedan", id: "1" },
            { model: "E- Class", bodyType: "Sedan", id: "2" },
            { model: "S- Class", bodyType: "Sedan", id: "3" },
            { model: "GLC", bodyType: "SUV", id: "4" },
            { model: "GLE", bodyType: "SUV", id: "5" },
            { model: "GLS", bodyType: "SUV", id: "6" },
          ],
        },
        {
          make: "Nissan",
          key: "26",
          models: [
            { model: "Sunny", bodyType: "Sedan", id: "1" },
            { model: "Micra Active", bodyType: "Hatchback", id: "2" },
            { model: "Navara", bodyType: "Pickup Truck", id: "3" },
            { model: "X-Trail", bodyType: "SUV", id: "4" },
            { model: "Urvan", bodyType: "Van", id: "5" },
            { model: "Terano", bodyType: "SUV", id: "6" },
            { model: "Super Saloon", bodyType: "Sedan", id: "7" },
            { model: "Tiida", bodyType: "Hatchback", id: "8" },
            { model: "Kicks", bodyType: "SUV", id: "9" },
            { model: "March", bodyType: "Hatchback", id: "10" },
            { model: "Patrol", bodyType: "SUV", id: "11" },
            { model: "Frontier", bodyType: "Pickup Truck", id: "11" },
          ],
        },
        {
          make: "Oppel",
          key: "27",
          models: [
            { model: "Corsa", bodyType: "Hatchback", id: "1" },
            { model: "Swing", bodyType: "SUV", id: "2" },
            { model: "Astra", bodyType: "Sedan", id: "3" },
          ],
        },
        {
          make: "Peugeot",
          key: "28",
          models: [
            { model: "3008", bodyType: "SUV", id: "1" },
            { model: "Partner Tepee EV", bodyType: "Wagon", id: "2" },
            { model: "5008", bodyType: "SUV", id: "3" },
            { model: "2008", bodyType: "SUV", id: "4" },
            { model: "206", bodyType: "Hatchback", id: "5" },
          ],
        },
        {
          make: "Premier",
          key: "29",
          models: [{ model: "Rio", bodyType: "SUV", id: "1" }],
        },
        {
          make: "Perodoa",
          key: "30",
          models: [
            { model: "Viva", bodyType: "Hatchback", id: "1" },
            { model: "Myvi", bodyType: "Hatchback", id: "2" },
            { model: "Kenari", bodyType: "Wagon", id: "3" },
            { model: "Kelisa", bodyType: "Hatchback", id: "4" },
          ],
        },
        {
          make: "Proton",
          key: "31",
          models: [
            { model: "Savvy", bodyType: "Hatchback", id: "1" },
            { model: "Gen 2", bodyType: "Sedan", id: "2" },
            { model: "Persona", bodyType: "Sedan", id: "3" },
            { model: "Waza", bodyType: "Sedan", id: "4" },
            { model: "Wira", bodyType: "Sedan", id: "5" },
          ],
        },
        {
          make: "Renault",
          key: "32",
          models: [
            { model: "Duster", bodyType: "SUV", id: "1" },
            { model: "Captur", bodyType: "SUV", id: "2" },
            { model: "Kwid", bodyType: "Hatchback", id: "3" },
            { model: "Lodgy", bodyType: "Wagon", id: "4" },
            { model: "Triber", bodyType: "SUV", id: "5" },
          ],
        },
        {
          make: "Skoda",
          key: "33",
          models: [
            { model: "Karoq", bodyType: "SUV", id: "1" },
            { model: "Kodaiq", bodyType: "SUV", id: "2" },
            { model: "Octavia", bodyType: "Sedan", id: "3" },
            { model: "Rapid", bodyType: "Sedan", id: "4" },
            { model: "Superb", bodyType: "Sedan", id: "5" },
            { model: "Laura", bodyType: "Sedan", id: "6" },
            { model: "Fabia", bodyType: "Hatchback", id: "7" },
            { model: "Yeti", bodyType: "SUV", id: "8" },
          ],
        },
        {
          make: "Ssangyong",
          key: "34",
          models: [
            { model: "XLV", bodyType: "SUV", id: "1" },
            { model: "Tivoli", bodyType: "SUV", id: "2" },
            { model: "Actyon Sports", bodyType: "SUV", id: "3" },
            { model: "Rexton", bodyType: "SUV", id: "4" },
            { model: "Korando", bodyType: "SUV", id: "5" },
            { model: "Musso Grand", bodyType: "Pickup Truck", id: "6" },
          ],
        },
        {
          make: "Subaru",
          key: "35",
          models: [
            { model: "XV", bodyType: "SUV", id: "1" },
            { model: "Forester", bodyType: "SUV", id: "2" },
            { model: "Outback", bodyType: "SUV", id: "3" },
          ],
        },
        {
          make: "Suzuki",
          key: "36",
          models: [
            { model: "S-Presso", bodyType: "SUV", id: "1" },
            { model: "S-Cross", bodyType: "SUV", id: "2" },
            { model: "Ertiga", bodyType: "SUV", id: "3" },
            { model: "Ciaz", bodyType: "Sedan", id: "4" },
            { model: "Alto 800", bodyType: "Hatchback", id: "5" },
            { model: "Alto K10", bodyType: "Hatchback", id: "6" },
            { model: "Wagon R", bodyType: "Hatchback", id: "7" },
            { model: "Celerio", bodyType: "Hatchback", id: "8" },
            { model: "Celerio X", bodyType: "Hatchback", id: "9" },
            { model: "Ignis", bodyType: "Hatchback", id: "10" },
            { model: "Baleno", bodyType: "Hatchback", id: "11" },
            { model: "Dzire", bodyType: "Sedan", id: "12" },
            { model: "Vitara Brezza", bodyType: "SUV", id: "13" },
            { model: "Swift", bodyType: "Hatchback", id: "14" },
            { model: "800", bodyType: "Hatchback", id: "15" },
            { model: "Zen Estillo", bodyType: "Hatchback", id: "16" },
            { model: "Gypsy", bodyType: "SUV", id: "17" },
            { model: "Omini Cargo", bodyType: "Van", id: "18" },
            { model: "Eeco", bodyType: "Van", id: "19" },
          ],
        },
        {
          make: "Tata",
          key: "37",
          models: [
            { model: "Tigor", bodyType: "Hatchback", id: "1" },
            { model: "Tiago", bodyType: "Hatchback", id: "2" },
            { model: "NRG", bodyType: "Hatchback", id: "3" },
            { model: "H5", bodyType: "SUV", id: "4" },
            { model: "Nexon", bodyType: "SUV", id: "5" },
            { model: "Hexa", bodyType: "SUV", id: "6" },
            { model: "Xenon", bodyType: "Pickup Truck", id: "7" },
            { model: "207 DI", bodyType: "Pickup Truck", id: "8" },
            { model: "Yodha", bodyType: "Pickup Truck", id: "9" },
            { model: "Ace Zip", bodyType: "Pickup Truck", id: "10" },
            { model: "Ace", bodyType: "Pickup Truck", id: "11" },
            { model: "Super Ace", bodyType: "Pickup Truck", id: "12" },
            { model: "Ace Mega XL", bodyType: "Pickup Truck", id: "13" },
            { model: "Magic Iris", bodyType: "Van", id: "14" },
            { model: "Magic", bodyType: "Van", id: "15" },
            { model: "Winger", bodyType: "Van", id: "16" },
            { model: "Safari", bodyType: "SUV", id: "17" },
            { model: "Indica", bodyType: "Hatchback", id: "18" },
            { model: "Vista", bodyType: "Hatchback", id: "19" },
            { model: "Sumo", bodyType: "SUV", id: "20" },
            { model: "Manza", bodyType: "Sedan", id: "21" },
            { model: "Nano", bodyType: "Hatchback", id: "22" },
            { model: "Bolt", bodyType: "Hatchback", id: "23" },
            { model: "Zest", bodyType: "Sedan", id: "24" },
            { model: "Aria", bodyType: "SUV", id: "25" },
            { model: "Telcoline", bodyType: "Pickup Truck", id: "26" },
          ],
        },
        {
          make: "Toyota",
          key: "38",
          models: [
            { model: "Etios", bodyType: "Sedan", id: "1" },
            { model: "Etios Liva", bodyType: "Hatchback", id: "2" },
            { model: "Etios Cross", bodyType: "SUV", id: "3" },
            { model: "Rush", bodyType: "SUV", id: "4" },
            { model: "LC Prado", bodyType: "SUV", id: "5" },
            { model: "Land Cruiser", bodyType: "SUV", id: "6" },
            { model: "Rav 4", bodyType: "SUV", id: "7" },
            { model: "Fortuner", bodyType: "SUV", id: "8" },
            { model: "Innova Crysta", bodyType: "Wagon", id: "9" },
            { model: "Hilux", bodyType: "Pickup Truck", id: "10" },
            { model: "Hiace", bodyType: "Van", id: "11" },
            { model: "Yaris", bodyType: "Sedan", id: "12" },
            { model: "Corolla", bodyType: "Sedan", id: "13" },
            { model: "Qualis", bodyType: "SUV", id: "14" },
            { model: "Carina", bodyType: "Sedan", id: "15" },
            { model: "Avanza", bodyType: "Wagon", id: "16" },
          ],
        },
        {
          make: "Volkswagen",
          key: "39",
          models: [
            { model: "Polo", bodyType: "Hatchback", id: "1" },
            { model: "Polo GT", bodyType: "Hatchback", id: "2" },
            { model: "Vento", bodyType: "Sedan", id: "3" },
            { model: "Tiguan", bodyType: "SUV", id: "4" },
            { model: "Cross Polo", bodyType: "SUV", id: "5" },
            { model: "Passat", bodyType: "Sedan", id: "6" },
            { model: "Amarok", bodyType: "Pickup Truck", id: "7" },
            { model: "Jetta", bodyType: "Sedan", id: "8" },
          ],
        },
        { make: "Other", key: "40" },
      ])
        .then(function () {
          return res.json({ success: true, msg: "List Created" });
        })
        .catch(function (error) {
          return res.status(500).json({ success: false });
        });
    })
    .catch((err) => {
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/carMakesAndModels/
// @desc    Get all the carMakesAndModels
// @access  PUBLIC
router.get("/", (req, res) => {
  switch (req.header("authorization")) {
    case config.API_KEY:
    case config.ADMIN_KEY:
      break;

    default:
      return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter, range, sort } = req.query;

  let filterDetail = {};
  if (typeof filter !== "undefined") {
    filterDetail = JSON.parse(filter);
  }

  //   Search function in the react-admin
  // If id in filter is not valid send empty list back
  if (typeof filterDetail._id !== "undefined") {
    const isValid = mongoose.Types.ObjectId.isValid(filterDetail._id);

    if (!isValid) {
      return res.json({ data: [], success: true, total: 0 });
    }
  }

  let firstIndex = null;
  let lastIndex = null;

  if (typeof range !== "undefined") {
    const ranges = JSON.parse(range);
    firstIndex = ranges[0];
    lastIndex = ranges[1];
  }

  // If no sort is given we should pass empty string
  let sortAccordingTo = "";
  let sortDirection = "";

  if (typeof sort !== "undefined") {
    const sortDetail = JSON.parse(sort);
    switch (sortDetail[0]) {
      // If id or profile is used we use _id as id is placed as _id by mongoose
      case "id":
        sortAccordingTo = "_id";
        break;
      default:
        sortAccordingTo = sortDetail[0];
        break;
    }
    sortDirection = sortDetail[1] === "ASC" ? "" : "-";
  }

  const getData = (documents) => {
    let data = [];

    const pushToData = (document) => {
      data.push({
        make: document.make,
        id: document.id,
        models: document.models,
      });
    };

    documents.forEach((document) => {
      pushToData(document);
    });

    return data;
  };

  // When admin needs multiple users then we send filters to the api
  CarMakesAndModels.find(filterDetail)
    .sort(`${sortDirection}${sortAccordingTo}`)
    .exec((err, documents) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          err: "serverError",
          msg: "Error finding the document.",
        });
      }

      if (!documents.length) {
        return res.json({ data: [], success: true, total: documents.length });
      }

      let data = [];
      let total = null;

      // The indexes will only be given the list view
      // In reference view indexes will not be given so it will be null
      // So we dont splice the document
      if (firstIndex !== null && lastIndex !== null) {
        data = getData(documents);
        total = data.length;
        let splicedDocuments = data.slice(firstIndex, lastIndex + 1);
        data = splicedDocuments;
      } else {
        data = getData(documents);
        total = data.length;
      }

      return res.json({ data, success: true, total });
    });
});

// @route   GET /api/carMakesAndModels/:id
// @desc    Get a carMakeAndModels wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  if (id === "undefined") {
    return res.json({
      data: {},
      success: true,
    });
  }

  CarMakesAndModels.findById(id)
    .then((document) => {
      if (!document) {
        return res.json({
          data: {},
          success: false,
          msg: "Could not find such id.",
        });
      }
      return res.json({
        data: {
          make: document.make,
          id: document.id,
          models: document.models,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/carMakesAndModels/:id
// @desc    Delete carMakesAndModels with given id
// @access  ADMIN
router.delete("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const id = req.params.id;

  //   Check the type and secret key
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      msg: "Please provide valid informations.",
    });
  }

  CarMakesAndModels.findOne({ _id: id }).then((document) => {
    if (!document) {
      return res.status(400).json({
        success: false,
        err: "noEmailError",
        msg: "No such email exists.",
      });
    }

    document
      .remove()
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          err: "serverError",
          msg: "Server eroor while deleting the quiz.",
        });
      });
  });
});

// @route   DELETE /api/carMakesAndModels?query
// @desc    Delete carMakesAndModels in query
// @access  ADMIN
router.delete("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  // When admin needs multiple users then we send filters to the body
  if (typeof req.query.filter !== "undefined") {
    const { filter } = req.query;
    const filterJSON = JSON.parse(filter);
    const { id } = filterJSON;

    // Delete all the confirm email with id in id list.
    CarMakesAndModels.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the user.",
          });
        }

        let promises = [];

        // Adding all the promise to delete
        documents.forEach((document) => {
          promises.push(document.remove());
        });

        // Deleting the users
        Promise.all(promises)
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              err: "serverError",
              msg: "Error deleting the users.",
            });
          });
      });
  }
});

// @route   PUT /api/carMakesAndModels/:id
// @desc    Update a carMakesAndModels with given id
// @access  ADMIN
router.put("/:id", (req, res) => {
  const { data } = req.body;
  const { id } = req.params;
  const { make, valid, models } = data;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  CarMakesAndModels.findOne({ _id: id }, (err, document) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    document.make = make;
    document.models = models;

    document
      .save()
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ success: false });
      });
  });
});

// @route   POST /api/carMakesAndModels/
// @desc    create car make and models
// @access  ADMIN
router.post("/", (req, res) => {
  const { valid, data } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  const { make, models } = data;

  const newCarMakeAndModels = new CarMakesAndModels({
    make,
    models,
  });

  newCarMakeAndModels
    .save()
    .then(() => {
      return res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ success: false });
    });
});

module.exports = router;
