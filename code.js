// This plugin creates local variable collections from sports data fetched from ESPN API

// All data will be fetched live from APIs.

// Define fallback data (minimal structure to prevent errors)
let SPORTS_DATA = {
  NBA: [
    {
      full_team_name: "Los Angeles Lakers",
      logo: "Los Angeles Lakers",
      city: "Los Angeles",
      short_name: "Lakers",
      tricode: "LAL",
      primary_color: { r: 0.09, g: 0.11, b: 0.49 },
      secondary_color: { r: 0.98, g: 0.85, b: 0.37 }
    },
    {
      full_team_name: "Boston Celtics",
      logo: "Boston Celtics",
      city: "Boston",
      short_name: "Celtics",
      tricode: "BOS",
      primary_color: { r: 0.00, g: 0.51, b: 0.28 },
      secondary_color: { r: 0.95, g: 0.83, b: 0.18 }
    }
  ],
  NFL: [
    {
      full_team_name: "Arizona Cardinals",
      logo: "Arizona Cardinals",
      city: "Arizona",
      short_name: "Cardinals",
      tricode: "ARI",
      primary_color: { r: 0.64, g: 0.01, b: 0.15 }, // #A40227
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 }, // #FFFFFF
      early_record: "4-4",
      mid_record: "5-4",
      late_record: "8-9"
    },
    {
      full_team_name: "Atlanta Falcons",
      logo: "Atlanta Falcons",
      city: "Atlanta",
      short_name: "Falcons",
      tricode: "ATL",
      primary_color: { r: 0.65, g: 0.10, b: 0.19 }, // #A71930
      secondary_color: { r: 0.0, g: 0.0, b: 0.0 }, // #000000
      early_record: "5-3",
      mid_record: "6-3",
      late_record: "8-9"
    },
    {
      full_team_name: "Baltimore Ravens",
      logo: "Baltimore Ravens",
      city: "Baltimore",
      short_name: "Ravens",
      tricode: "BAL",
      primary_color: { r: 0.16, g: 0.07, b: 0.44 }, // #29126F
      secondary_color: { r: 0.0, g: 0.0, b: 0.0 }, // #000000
      early_record: "5-3",
      mid_record: "6-3",
      late_record: "12-5"
    }
  ],
  MLB: [
    {
      full_team_name: "New York Yankees",
      logo: "New York Yankees",
      city: "New York",
      short_name: "Yankees",
      tricode: "NYY",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 }   // #FFFFFF
    },
    {
      full_team_name: "Boston Red Sox",
      logo: "Boston Red Sox",
      city: "Boston",
      short_name: "Red Sox",
      tricode: "BOS",
      primary_color: { r: 0.67, g: 0.0, b: 0.0 },   // #AB0003
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 }   // #FFD700
    }
  ],
  NHL: [
    {
      full_team_name: "Boston Bruins",
      logo: "Boston Bruins",
      city: "Boston",
      short_name: "Bruins",
      tricode: "BOS",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 0.84, b: 0.0 }  // #FFB81C
    },
    {
      full_team_name: "Chicago Blackhawks",
      logo: "Chicago Blackhawks",
      city: "Chicago",
      short_name: "Blackhawks",
      tricode: "CHI",
      primary_color: { r: 0.78, g: 0.0, b: 0.0 },   // #C8102E
      secondary_color: { r: 0.0, g: 0.0, b: 0.0 }   // #000000
    }
  ],
  WNBA: [
    {
      full_team_name: "Las Vegas Aces",
      logo: "Las Vegas Aces",
      city: "Las Vegas",
      short_name: "Aces",
      tricode: "LV",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 0.0, g: 0.5, b: 1.0 }   // #0080FF
    },
    {
      full_team_name: "New York Liberty",
      logo: "New York Liberty",
      city: "New York",
      short_name: "Liberty",
      tricode: "NY",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 0.0, g: 0.5, b: 1.0 }   // #0080FF
    }
  ],
  "NCAA Football": [
    {
      full_team_name: "Alabama Crimson Tide",
      logo: "Alabama Crimson Tide",
      city: "Alabama",
      short_name: "Crimson Tide",
      tricode: "ALA",
      primary_color: { r: 0.65, g: 0.0, b: 0.0 },   // #A50000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 }   // #FFFFFF
    },
    {
      full_team_name: "Georgia Bulldogs",
      logo: "Georgia Bulldogs",
      city: "Georgia",
      short_name: "Bulldogs",
      tricode: "UGA",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 0.0, g: 0.5, b: 0.0 }   // #008000
    }
  ],
  "Men's Tennis": [
    {
      full_team_name: "Carlos Alcaraz",
      headshot: "Carlos Alcaraz",
      country: "Spain",
      short_name: "C. Alcaraz",
      tricode: "ESP",
      primary_color: { r: 0.8, g: 0.0, b: 0.0 },    // #CC0000
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFCC00
      rank: "1",
      points: "11540",
      age: "22"
    },
    {
      full_team_name: "Jannik Sinner",
      headshot: "Jannik Sinner",
      country: "Italy",
      short_name: "J. Sinner",
      tricode: "ITA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "2",
      points: "10950",
      age: "24"
    },
    {
      full_team_name: "Alexander Zverev",
      headshot: "Alexander Zverev",
      country: "Germany",
      short_name: "A. Zverev",
      tricode: "GER",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFD700
      rank: "3",
      points: "5980",
      age: "28"
    },
    {
      full_team_name: "Taylor Fritz",
      headshot: "Taylor Fritz",
      country: "United States",
      short_name: "T. Fritz",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "4",
      points: "4995",
      age: "27"
    },
    {
      full_team_name: "Novak Djokovic",
      headshot: "Novak Djokovic",
      country: "Serbia",
      short_name: "N. Djokovic",
      tricode: "SRB",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "5",
      points: "4830",
      age: "38"
    },
    {
      full_team_name: "Ben Shelton",
      headshot: "Ben Shelton",
      country: "United States",
      short_name: "B. Shelton",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "6",
      points: "4190",
      age: "22"
    },
    {
      full_team_name: "Alex De Minaur",
      headshot: "Alex De Minaur",
      country: "Australia",
      short_name: "A. De Minaur",
      tricode: "AUS",
      primary_color: { r: 1.0, g: 0.0, b: 0.0 },    // #FF0000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "7",
      points: "3735",
      age: "26"
    },
    {
      full_team_name: "Jack Draper",
      headshot: "Jack Draper",
      country: "United Kingdom",
      short_name: "J. Draper",
      tricode: "GBR",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "8",
      points: "3590",
      age: "23"
    },
    {
      full_team_name: "Lorenzo Musetti",
      headshot: "Lorenzo Musetti",
      country: "Italy",
      short_name: "L. Musetti",
      tricode: "ITA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "9",
      points: "3555",
      age: "23"
    },
    {
      full_team_name: "Karen Khachanov",
      headshot: "Karen Khachanov",
      country: "Russia",
      short_name: "K. Khachanov",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "10",
      points: "3190",
      age: "29"
    },
    {
      full_team_name: "Holger Rune",
      headshot: "Holger Rune",
      country: "Denmark",
      short_name: "H. Rune",
      tricode: "DEN",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "11",
      points: "2990",
      age: "22"
    },
    {
      full_team_name: "Casper Ruud",
      headshot: "Casper Ruud",
      country: "Norway",
      short_name: "C. Ruud",
      tricode: "NOR",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 0.0, g: 0.5, b: 0.0 },  // #008000
      rank: "12",
      points: "2945",
      age: "26"
    },
    {
      full_team_name: "Felix Auger-Aliassime",
      headshot: "Felix Auger-Aliassime",
      country: "Canada",
      short_name: "F. Auger-Aliassime",
      tricode: "CAN",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "13",
      points: "2755",
      age: "25"
    },
    {
      full_team_name: "Ugo Humbert",
      headshot: "Ugo Humbert",
      country: "France",
      short_name: "U. Humbert",
      tricode: "FRA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "14",
      points: "2730",
      age: "26"
    },
    {
      full_team_name: "Sebastian Baez",
      headshot: "Sebastian Baez",
      country: "Argentina",
      short_name: "S. Baez",
      tricode: "ARG",
      primary_color: { r: 0.5, g: 0.8, b: 1.0 },    // #80CCFF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "15",
      points: "2720",
      age: "23"
    },
    {
      full_team_name: "Grigor Dimitrov",
      headshot: "Grigor Dimitrov",
      country: "Bulgaria",
      short_name: "G. Dimitrov",
      tricode: "BUL",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "16",
      points: "2690",
      age: "33"
    },
    {
      full_team_name: "Tommy Paul",
      headshot: "Tommy Paul",
      country: "United States",
      short_name: "T. Paul",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "17",
      points: "2650",
      age: "27"
    },
    {
      full_team_name: "Nicolas Jarry",
      headshot: "Nicolas Jarry",
      country: "Chile",
      short_name: "N. Jarry",
      tricode: "CHI",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "18",
      points: "2630",
      age: "28"
    },
    {
      full_team_name: "Tallon Griekspoor",
      headshot: "Tallon Griekspoor",
      country: "Netherlands",
      short_name: "T. Griekspoor",
      tricode: "NED",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.5, b: 0.0 },  // #FF8000
      rank: "19",
      points: "2590",
      age: "27"
    },
    {
      full_team_name: "Sebastian Korda",
      headshot: "Sebastian Korda",
      country: "United States",
      short_name: "S. Korda",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "20",
      points: "2570",
      age: "24"
    },
    {
      full_team_name: "Adrian Mannarino",
      headshot: "Adrian Mannarino",
      country: "France",
      short_name: "A. Mannarino",
      tricode: "FRA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "21",
      points: "2520",
      age: "35"
    },
    {
      full_team_name: "Francisco Cerundolo",
      headshot: "Francisco Cerundolo",
      country: "Argentina",
      short_name: "F. Cerundolo",
      tricode: "ARG",
      primary_color: { r: 0.5, g: 0.8, b: 1.0 },    // #80CCFF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "22",
      points: "2500",
      age: "26"
    },
    {
      full_team_name: "Matteo Berrettini",
      headshot: "Matteo Berrettini",
      country: "Italy",
      short_name: "M. Berrettini",
      tricode: "ITA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "23",
      points: "2480",
      age: "28"
    },
    {
      full_team_name: "Alejandro Tabilo",
      headshot: "Alejandro Tabilo",
      country: "Chile",
      short_name: "A. Tabilo",
      tricode: "CHI",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "24",
      points: "2460",
      age: "27"
    },
    {
      full_team_name: "Jordan Thompson",
      headshot: "Jordan Thompson",
      country: "Australia",
      short_name: "J. Thompson",
      tricode: "AUS",
      primary_color: { r: 1.0, g: 0.0, b: 0.0 },    // #FF0000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "25",
      points: "2440",
      age: "30"
    },
    {
      full_team_name: "Jiri Lehecka",
      headshot: "Jiri Lehecka",
      country: "Czech Republic",
      short_name: "J. Lehecka",
      tricode: "CZE",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "26",
      points: "2420",
      age: "23"
    },
    {
      full_team_name: "Christopher Eubanks",
      headshot: "Christopher Eubanks",
      country: "United States",
      short_name: "C. Eubanks",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "27",
      points: "2400",
      age: "28"
    },
    {
      full_team_name: "Luciano Darderi",
      headshot: "Luciano Darderi",
      country: "Argentina",
      short_name: "L. Darderi",
      tricode: "ARG",
      primary_color: { r: 0.5, g: 0.8, b: 1.0 },    // #80CCFF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "28",
      points: "2380",
      age: "22"
    },
    {
      full_team_name: "Arthur Fils",
      headshot: "Arthur Fils",
      country: "France",
      short_name: "A. Fils",
      tricode: "FRA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "29",
      points: "2360",
      age: "20"
    },
    {
      full_team_name: "Roman Safiullin",
      headshot: "Roman Safiullin",
      country: "Russia",
      short_name: "R. Safiullin",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "30",
      points: "2340",
      age: "27"
    },
    {
      full_team_name: "Fabian Marozsan",
      headshot: "Fabian Marozsan",
      country: "Hungary",
      short_name: "F. Marozsan",
      tricode: "HUN",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "31",
      points: "2320",
      age: "25"
    },
    {
      full_team_name: "Cameron Norrie",
      headshot: "Cameron Norrie",
      country: "United Kingdom",
      short_name: "C. Norrie",
      tricode: "GBR",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "32",
      points: "2300",
      age: "29"
    },
    {
      full_team_name: "Yannick Hanfmann",
      headshot: "Yannick Hanfmann",
      country: "Germany",
      short_name: "Y. Hanfmann",
      tricode: "GER",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFD700
      rank: "33",
      points: "2280",
      age: "32"
    },
    {
      full_team_name: "Mariano Navone",
      headshot: "Mariano Navone",
      country: "Argentina",
      short_name: "M. Navone",
      tricode: "ARG",
      primary_color: { r: 0.5, g: 0.8, b: 1.0 },    // #80CCFF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "34",
      points: "2260",
      age: "23"
    },
    {
      full_team_name: "Flavio Cobolli",
      headshot: "Flavio Cobolli",
      country: "Italy",
      short_name: "F. Cobolli",
      tricode: "ITA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "35",
      points: "2240",
      age: "22"
    },
    {
      full_team_name: "Max Purcell",
      headshot: "Max Purcell",
      country: "Australia",
      short_name: "M. Purcell",
      tricode: "AUS",
      primary_color: { r: 1.0, g: 0.0, b: 0.0 },    // #FF0000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "36",
      points: "2220",
      age: "26"
    },
    {
      full_team_name: "Zhizhen Zhang",
      headshot: "Zhizhen Zhang",
      country: "China",
      short_name: "Z. Zhang",
      tricode: "CHN",
      primary_color: { r: 1.0, g: 0.0, b: 0.0 },    // #FF0000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "37",
      points: "2200",
      age: "27"
    },
    {
      full_team_name: "Pedro Martinez",
      headshot: "Pedro Martinez",
      country: "Spain",
      short_name: "P. Martinez",
      tricode: "ESP",
      primary_color: { r: 0.8, g: 0.0, b: 0.0 },    // #CC0000
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFCC00
      rank: "38",
      points: "2180",
      age: "27"
    },
    {
      full_team_name: "Daniel Altmaier",
      headshot: "Daniel Altmaier",
      country: "Germany",
      short_name: "D. Altmaier",
      tricode: "GER",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFD700
      rank: "39",
      points: "2160",
      age: "26"
    },
    {
      full_team_name: "Thiago Seyboth Wild",
      headshot: "Thiago Seyboth Wild",
      country: "Brazil",
      short_name: "T. Seyboth Wild",
      tricode: "BRA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "40",
      points: "2140",
      age: "24"
    }
  ],
  "Women's Tennis": [
    {
      full_team_name: "Iga Swiatek",
      headshot: "Iga Swiatek",
      country: "Poland",
      short_name: "I. Swiatek",
      tricode: "POL",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "1",
      points: "11540",
      age: "23"
    },
    {
      full_team_name: "Aryna Sabalenka",
      headshot: "Aryna Sabalenka",
      country: "Belarus",
      short_name: "A. Sabalenka",
      tricode: "BLR",
      primary_color: { r: 1.0, g: 0.8, b: 0.0 },    // #FFCC00
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "2",
      points: "10950",
      age: "26"
    },
    {
      full_team_name: "Coco Gauff",
      headshot: "Coco Gauff",
      country: "United States",
      short_name: "C. Gauff",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "3",
      points: "5980",
      age: "20"
    },
    {
      full_team_name: "Elena Rybakina",
      headshot: "Elena Rybakina",
      country: "Kazakhstan",
      short_name: "E. Rybakina",
      tricode: "KAZ",
      primary_color: { r: 0.0, g: 0.8, b: 1.0 },    // #00CCFF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "4",
      points: "4995",
      age: "25"
    },
    {
      full_team_name: "Jessica Pegula",
      headshot: "Jessica Pegula",
      country: "United States",
      short_name: "J. Pegula",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "5",
      points: "4830",
      age: "30"
    },
    {
      full_team_name: "Ons Jabeur",
      headshot: "Ons Jabeur",
      country: "Tunisia",
      short_name: "O. Jabeur",
      tricode: "TUN",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFCC00
      rank: "6",
      points: "4190",
      age: "30"
    },
    {
      full_team_name: "Marketa Vondrousova",
      headshot: "Marketa Vondrousova",
      country: "Czech Republic",
      short_name: "M. Vondrousova",
      tricode: "CZE",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "7",
      points: "3735",
      age: "25"
    },
    {
      full_team_name: "Qinwen Zheng",
      headshot: "Qinwen Zheng",
      country: "China",
      short_name: "Q. Zheng",
      tricode: "CHN",
      primary_color: { r: 1.0, g: 0.0, b: 0.0 },    // #FF0000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "8",
      points: "3590",
      age: "21"
    },
    {
      full_team_name: "Maria Sakkari",
      headshot: "Maria Sakkari",
      country: "Greece",
      short_name: "M. Sakkari",
      tricode: "GRE",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 0.0, g: 0.5, b: 1.0 },  // #0080FF
      rank: "9",
      points: "3555",
      age: "29"
    },
    {
      full_team_name: "Barbora Krejcikova",
      headshot: "Barbora Krejcikova",
      country: "Czech Republic",
      short_name: "B. Krejcikova",
      tricode: "CZE",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "10",
      points: "3190",
      age: "28"
    },
    {
      full_team_name: "Jelena Ostapenko",
      headshot: "Jelena Ostapenko",
      country: "Latvia",
      short_name: "J. Ostapenko",
      tricode: "LAT",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 0.8, g: 0.0, b: 0.0 },  // #CC0000
      rank: "11",
      points: "2990",
      age: "27"
    },
    {
      full_team_name: "Beatriz Haddad Maia",
      headshot: "Beatriz Haddad Maia",
      country: "Brazil",
      short_name: "B. Haddad Maia",
      tricode: "BRA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "12",
      points: "2945",
      age: "28"
    },
    {
      full_team_name: "Karolina Pliskova",
      headshot: "Karolina Pliskova",
      country: "Czech Republic",
      short_name: "K. Pliskova",
      tricode: "CZE",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "13",
      points: "2755",
      age: "32"
    },
    {
      full_team_name: "Liudmila Samsonova",
      headshot: "Liudmila Samsonova",
      country: "Russia",
      short_name: "L. Samsonova",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "14",
      points: "2730",
      age: "25"
    },
    {
      full_team_name: "Veronika Kudermetova",
      headshot: "Veronika Kudermetova",
      country: "Russia",
      short_name: "V. Kudermetova",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "15",
      points: "2720",
      age: "27"
    },
    {
      full_team_name: "Elina Svitolina",
      headshot: "Elina Svitolina",
      country: "Ukraine",
      short_name: "E. Svitolina",
      tricode: "UKR",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFCC00
      rank: "16",
      points: "2690",
      age: "29"
    },
    {
      full_team_name: "Petra Martic",
      headshot: "Petra Martic",
      country: "Croatia",
      short_name: "P. Martic",
      tricode: "CRO",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "17",
      points: "2650",
      age: "33"
    },
    {
      full_team_name: "Anastasia Potapova",
      headshot: "Anastasia Potapova",
      country: "Russia",
      short_name: "A. Potapova",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "18",
      points: "2630",
      age: "23"
    },
    {
      full_team_name: "Emma Navarro",
      headshot: "Emma Navarro",
      country: "United States",
      short_name: "E. Navarro",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "19",
      points: "2590",
      age: "23"
    },
    {
      full_team_name: "Caroline Garcia",
      headshot: "Caroline Garcia",
      country: "France",
      short_name: "C. Garcia",
      tricode: "FRA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "20",
      points: "2570",
      age: "30"
    },
    {
      full_team_name: "Marta Kostyuk",
      headshot: "Marta Kostyuk",
      country: "Ukraine",
      short_name: "M. Kostyuk",
      tricode: "UKR",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFCC00
      rank: "21",
      points: "2520",
      age: "22"
    },
    {
      full_team_name: "Anna Kalinskaya",
      headshot: "Anna Kalinskaya",
      country: "Russia",
      short_name: "A. Kalinskaya",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "22",
      points: "2500",
      age: "25"
    },
    {
      full_team_name: "Donna Vekic",
      headshot: "Donna Vekic",
      country: "Croatia",
      short_name: "D. Vekic",
      tricode: "CRO",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "23",
      points: "2480",
      age: "28"
    },
    {
      full_team_name: "Sorana Cirstea",
      headshot: "Sorana Cirstea",
      country: "Romania",
      short_name: "S. Cirstea",
      tricode: "ROU",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 0.0, g: 0.5, b: 0.0 },  // #008000
      rank: "24",
      points: "2460",
      age: "34"
    },
    {
      full_team_name: "Ekaterina Alexandrova",
      headshot: "Ekaterina Alexandrova",
      country: "Russia",
      short_name: "E. Alexandrova",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "25",
      points: "2440",
      age: "29"
    },
    {
      full_team_name: "Daria Kasatkina",
      headshot: "Daria Kasatkina",
      country: "Russia",
      short_name: "D. Kasatkina",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "26",
      points: "2420",
      age: "27"
    },
    {
      full_team_name: "Viktorija Golubic",
      headshot: "Viktorija Golubic",
      country: "Switzerland",
      short_name: "V. Golubic",
      tricode: "SUI",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "27",
      points: "2400",
      age: "31"
    },
    {
      full_team_name: "Paula Badosa",
      headshot: "Paula Badosa",
      country: "Spain",
      short_name: "P. Badosa",
      tricode: "ESP",
      primary_color: { r: 0.8, g: 0.0, b: 0.0 },    // #CC0000
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 },  // #FFCC00
      rank: "28",
      points: "2380",
      age: "26"
    },
    {
      full_team_name: "Sloane Stephens",
      headshot: "Sloane Stephens",
      country: "United States",
      short_name: "S. Stephens",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "29",
      points: "2360",
      age: "31"
    },
    {
      full_team_name: "Magda Linette",
      headshot: "Magda Linette",
      country: "Poland",
      short_name: "M. Linette",
      tricode: "POL",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "30",
      points: "2340",
      age: "32"
    },
    {
      full_team_name: "Marie Bouzkova",
      headshot: "Marie Bouzkova",
      country: "Czech Republic",
      short_name: "M. Bouzkova",
      tricode: "CZE",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "31",
      points: "2320",
      age: "26"
    },
    {
      full_team_name: "Yulia Putintseva",
      headshot: "Yulia Putintseva",
      country: "Kazakhstan",
      short_name: "Y. Putintseva",
      tricode: "KAZ",
      primary_color: { r: 0.0, g: 0.8, b: 1.0 },    // #00CCFF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "32",
      points: "2300",
      age: "29"
    },
    {
      full_team_name: "Anastasia Pavlyuchenkova",
      headshot: "Anastasia Pavlyuchenkova",
      country: "Russia",
      short_name: "A. Pavlyuchenkova",
      tricode: "RUS",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "33",
      points: "2280",
      age: "33"
    },
    {
      full_team_name: "Madison Keys",
      headshot: "Madison Keys",
      country: "United States",
      short_name: "M. Keys",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "34",
      points: "2260",
      age: "29"
    },
    {
      full_team_name: "Camila Giorgi",
      headshot: "Camila Giorgi",
      country: "Italy",
      short_name: "C. Giorgi",
      tricode: "ITA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "35",
      points: "2240",
      age: "33"
    },
    {
      full_team_name: "Sofia Kenin",
      headshot: "Sofia Kenin",
      country: "United States",
      short_name: "S. Kenin",
      tricode: "USA",
      primary_color: { r: 0.0, g: 0.0, b: 1.0 },    // #0000FF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "36",
      points: "2220",
      age: "25"
    },
    {
      full_team_name: "Elisabetta Cocciaretto",
      headshot: "Elisabetta Cocciaretto",
      country: "Italy",
      short_name: "E. Cocciaretto",
      tricode: "ITA",
      primary_color: { r: 0.0, g: 0.5, b: 0.0 },    // #008000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "37",
      points: "2200",
      age: "23"
    },
    {
      full_team_name: "Nadia Podoroska",
      headshot: "Nadia Podoroska",
      country: "Argentina",
      short_name: "N. Podoroska",
      tricode: "ARG",
      primary_color: { r: 0.5, g: 0.8, b: 1.0 },    // #80CCFF
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 },  // #FFFFFF
      rank: "38",
      points: "2180",
      age: "27"
    },
    {
      full_team_name: "Katerina Siniakova",
      headshot: "Katerina Siniakova",
      country: "Czech Republic",
      short_name: "K. Siniakova",
      tricode: "CZE",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "39",
      points: "2160",
      age: "28"
    },
    {
      full_team_name: "Magdalena Frech",
      headshot: "Magdalena Frech",
      country: "Poland",
      short_name: "M. Frech",
      tricode: "POL",
      primary_color: { r: 1.0, g: 1.0, b: 1.0 },    // #FFFFFF
      secondary_color: { r: 1.0, g: 0.0, b: 0.0 },  // #FF0000
      rank: "40",
      points: "2140",
      age: "26"
    }
  ]
};

// NBA Records data (Early/Mid/Late)
const NBA_RECORDS = {
    '76ers': { early_record: '2-2', mid_record: '15-23', late_record: '38-44' },
    'Bucks': { early_record: '3-1', mid_record: '21-17', late_record: '49-33' },
    'Bulls': { early_record: '1-3', mid_record: '18-22', late_record: '39-43' },
    'Cavaliers': { early_record: '4-0', mid_record: '34-5', late_record: '57-25' },
    'Celtics': { early_record: '4-0', mid_record: '28-11', late_record: '58-24' },
    'Clippers': { early_record: '2-1', mid_record: '21-17', late_record: '47-35' },
    'Grizzlies': { early_record: '2-1', mid_record: '25-15', late_record: '47-35' },
    'Hawks': { early_record: '2-2', mid_record: '20-19', late_record: '41-41' },
    'Heat': { early_record: '1-3', mid_record: '20-18', late_record: '44-38' },
    'Hornets': { early_record: '1-3', mid_record: '8-28', late_record: '25-57' },
    'Jazz': { early_record: '1-2', mid_record: '15-26', late_record: '36-46' },
    'Kings': { early_record: '2-1', mid_record: '22-17', late_record: '48-34' },
    'Knicks': { early_record: '2-2', mid_record: '26-15', late_record: '50-32' },
    'Lakers': { early_record: '3-1', mid_record: '20-17', late_record: '49-33' },
    'Magic': { early_record: '3-1', mid_record: '23-18', late_record: '47-35' },
    'Mavericks': { early_record: '2-1', mid_record: '22-18', late_record: '50-32' },
    'Nets': { early_record: '1-3', mid_record: '14-26', late_record: '35-47' },
    'Nuggets': { early_record: '2-1', mid_record: '24-15', late_record: '54-28' },
    'Pacers': { early_record: '2-2', mid_record: '22-19', late_record: '46-36' },
    'Pelicans': { early_record: '1-2', mid_record: '9-32', late_record: '34-48' },
    'Pistons': { early_record: '2-2', mid_record: '21-19', late_record: '42-40' },
    'Raptors': { early_record: '1-3', mid_record: '9-31', late_record: '30-52' },
    'Rockets': { early_record: '2-1', mid_record: '26-12', late_record: '48-34' },
    'Spurs': { early_record: '1-2', mid_record: '19-19', late_record: '39-43' },
    'Suns': { early_record: '3-1', mid_record: '21-18', late_record: '46-36' },
    'Thunder': { early_record: '3-0', mid_record: '33-6', late_record: '59-23' },
    'Timberwolves': { early_record: '2-1', mid_record: '22-17', late_record: '50-32' },
    'Trail Blazers': { early_record: '1-2', mid_record: '12-28', late_record: '32-50' },
    'Warriors': { early_record: '2-1', mid_record: '19-21', late_record: '45-37' },
    'Wizards': { early_record: '0-4', mid_record: '6-32', late_record: '21-61' }
};

// Core async function to fetch NBA data from ESPN API
async function fetchNBAData() {
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const teams = data.sports[0].leagues[0].teams.map(team => {
            const nameKey = team.team.name; // e.g., "Lakers", "Celtics"
            const rec = NBA_RECORDS[nameKey] || {};
            return {
                full_team_name: team.team.displayName,
                logo: team.team.displayName,
                city: team.team.location,
                short_name: team.team.name,
                tricode: team.team.abbreviation,
                primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                early_record: rec.early_record || null,
                mid_record: rec.mid_record || null,
                late_record: rec.late_record || null
            };
        });
        
        return teams;
    } catch (error) {
        console.error('Error fetching NBA data:', error);
        return SPORTS_DATA.NBA; // Return fallback data
    }
}

// NFL Records data from CSV
const NFL_RECORDS = {
    '49ers': { early_record: '4-0', mid_record: '4-4', late_record: '6-11' },
    'Bears': { early_record: '1-3', mid_record: '4-4', late_record: '5-12' },
    'Bengals': { early_record: '1-3', mid_record: '4-5', late_record: '9-8' },
    'Bills': { early_record: '3-1', mid_record: '7-2', late_record: '13-4' },
    'Broncos': { early_record: '1-3', mid_record: '5-4', late_record: '10-7' },
    'Browns': { early_record: '2-2', mid_record: '2-7', late_record: '3-14' },
    'Buccaneers': { early_record: '3-1', mid_record: '4-5', late_record: '10-7' },
    'Cardinals': { early_record: '2-2', mid_record: '5-4', late_record: '8-9' },
    'Chargers': { early_record: '2-2', mid_record: '5-3', late_record: '11-6' },
    'Chiefs': { early_record: '3-1', mid_record: '8-0', late_record: '15-2' },
    'Colts': { early_record: '2-2', mid_record: '4-5', late_record: '8-9' },
    'Commanders': { early_record: '2-2', mid_record: '7-2', late_record: '12-5' },
    'Cowboys': { early_record: '3-1', mid_record: '3-5', late_record: '7-10' },
    'Dolphins': { early_record: '3-1', mid_record: '2-6', late_record: '8-9' },
    'Eagles': { early_record: '4-0', mid_record: '6-2', late_record: '14-3' },
    'Falcons': { early_record: '3-1', mid_record: '6-3', late_record: '8-9' },
    'Giants': { early_record: '1-3', mid_record: '2-7', late_record: '3-14' },
    'Jaguars': { early_record: '2-2', mid_record: '2-7', late_record: '4-13' },
    'Jets': { early_record: '1-3', mid_record: '3-6', late_record: '5-12' },
    'Lions': { early_record: '3-1', mid_record: '7-1', late_record: '15-2' },
    'Packers': { early_record: '2-2', mid_record: '6-3', late_record: '11-6' },
    'Panthers': { early_record: '0-4', mid_record: '2-7', late_record: '5-12' },
    'Patriots': { early_record: '1-3', mid_record: '2-7', late_record: '4-13' },
    'Raiders': { early_record: '1-3', mid_record: '2-7', late_record: '4-13' },
    'Rams': { early_record: '2-2', mid_record: '4-4', late_record: '10-7' },
    'Ravens': { early_record: '3-1', mid_record: '6-3', late_record: '12-5' },
    'Saints': { early_record: '2-2', mid_record: '2-7', late_record: '5-12' },
    'Seahawks': { early_record: '3-1', mid_record: '4-5', late_record: '10-7' },
    'Steelers': { early_record: '3-1', mid_record: '6-2', late_record: '10-7' },
    'Texans': { early_record: '2-2', mid_record: '6-3', late_record: '10-7' },
    'Titans': { early_record: '2-2', mid_record: '2-6', late_record: '3-14' },
    'Vikings': { early_record: '1-3', mid_record: '6-2', late_record: '14-3' }
};

// Core async function to fetch NFL data from ESPN API
async function fetchNFLData() {
    try {
        console.log('Starting NFL data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams');
        console.log('NFL API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('NFL API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('NFL API response structure unexpected:', data);
            return [];
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => {
            // Get records for this team
            const teamRecords = NFL_RECORDS[team.team.name] || {};
            
            return {
                full_team_name: team.team.displayName,
                logo: team.team.displayName, // Using team name as logo text
                city: team.team.location,
                short_name: team.team.name,
                tricode: team.team.abbreviation,
                primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                early_record: teamRecords.early_record || null,
                mid_record: teamRecords.mid_record || null,
                late_record: teamRecords.late_record || null
            };
        });
        
        console.log('Processed NFL teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching NFL data:', error);
        console.log('Using fallback NFL data');
        return SPORTS_DATA.NFL; // Return fallback data
    }
}

// MLB Records data (Early/Mid/Late)
const MLB_RECORDS = {
    'Angels': { early_record: '22-29', mid_record: '41-55', late_record: '72-90' },
    'Astros': { early_record: '26-26', mid_record: '50-46', late_record: '92-70' },
    'Athletics': { early_record: '20-33', mid_record: '37-61', late_record: '67-95' },
    'Blue Jays': { early_record: '24-29', mid_record: '45-52', late_record: '80-82' },
    'Braves': { early_record: '30-21', mid_record: '53-42', late_record: '97-65' },
    'Brewers': { early_record: '31-22', mid_record: '55-42', late_record: '94-68' },
    'Cardinals': { early_record: '25-27', mid_record: '50-46', late_record: '86-76' },
    'Cubs': { early_record: '27-26', mid_record: '47-51', late_record: '83-79' },
    'Diamondbacks': { early_record: '25-27', mid_record: '49-48', late_record: '84-78' },
    'Dodgers': { early_record: '34-21', mid_record: '56-41', late_record: '98-64' },
    'Giants': { early_record: '26-28', mid_record: '47-50', late_record: '81-81' },
    'Guardians': { early_record: '35-19', mid_record: '58-37', late_record: '95-67' },
    'Mariners': { early_record: '29-25', mid_record: '52-46', late_record: '90-72' },
    'Marlins': { early_record: '21-31', mid_record: '33-63', late_record: '68-94' },
    'Mets': { early_record: '27-26', mid_record: '49-46', late_record: '82-80' },
    'Nationals': { early_record: '23-30', mid_record: '44-53', late_record: '75-87' },
    'Orioles': { early_record: '34-20', mid_record: '58-38', late_record: '101-61' },
    'Padres': { early_record: '27-27', mid_record: '50-49', late_record: '83-79' },
    'Phillies': { early_record: '38-17', mid_record: '62-34', late_record: '102-60' },
    'Pirates': { early_record: '26-27', mid_record: '48-48', late_record: '78-84' },
    'Rangers': { early_record: '25-28', mid_record: '46-50', late_record: '85-77' },
    'Rays': { early_record: '27-27', mid_record: '48-48', late_record: '82-80' },
    'Red Sox': { early_record: '28-25', mid_record: '53-43', late_record: '84-78' },
    'Reds': { early_record: '25-28', mid_record: '47-50', late_record: '81-81' },
    'Rockies': { early_record: '20-32', mid_record: '34-63', late_record: '66-96' },
    'Royals': { early_record: '30-23', mid_record: '52-45', late_record: '87-75' },
    'Tigers': { early_record: '25-27', mid_record: '47-50', late_record: '79-83' },
    'Twins': { early_record: '29-24', mid_record: '54-42', late_record: '89-73' },
    'White Sox': { early_record: '15-36', mid_record: '27-71', late_record: '54-108' },
    'Yankees': { early_record: '34-20', mid_record: '58-40', late_record: '99-63' }
};

// Core async function to fetch MLB data from ESPN API
async function fetchMLBData() {
    try {
        console.log('Starting MLB data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams');
        console.log('MLB API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('MLB API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('MLB API response structure unexpected:', data);
            return SPORTS_DATA.MLB;
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => {
            // Get records for this team
            const teamRecords = MLB_RECORDS[team.team.name] || {};
            
            return {
                full_team_name: team.team.displayName,
                logo: team.team.displayName,
                city: team.team.location,
                short_name: team.team.name,
                tricode: team.team.abbreviation,
                primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                early_record: teamRecords.early_record || null,
                mid_record: teamRecords.mid_record || null,
                late_record: teamRecords.late_record || null
            };
        });
        
        console.log('Processed MLB teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching MLB data:', error);
        console.log('Using fallback MLB data');
        return SPORTS_DATA.MLB;
    }
}

// NHL Records data (Early/Mid/Late)
const NHL_RECORDS = {
    'Avalanche': { early_record: '7-2', mid_record: '26-13', late_record: '53-29' },
    'Blackhawks': { early_record: '2-8', mid_record: '11-28', late_record: '28-54' },
    'Blue Jackets': { early_record: '3-7', mid_record: '13-26', late_record: '32-50' },
    'Blues': { early_record: '5-4', mid_record: '20-19', late_record: '42-40' },
    'Bruins': { early_record: '8-1', mid_record: '30-10', late_record: '55-27' },
    'Canadiens': { early_record: '3-7', mid_record: '16-23', late_record: '33-49' },
    'Canucks': { early_record: '6-3', mid_record: '24-15', late_record: '48-34' },
    'Capitals': { early_record: '4-6', mid_record: '18-21', late_record: '37-45' },
    'Coyotes': { early_record: '4-5', mid_record: '16-23', late_record: '37-45' },
    'Devils': { early_record: '5-4', mid_record: '19-20', late_record: '42-40' },
    'Ducks': { early_record: '3-6', mid_record: '15-24', late_record: '35-47' },
    'Flames': { early_record: '3-7', mid_record: '15-24', late_record: '36-46' },
    'Flyers': { early_record: '4-6', mid_record: '18-21', late_record: '39-43' },
    'Golden Knights': { early_record: '5-4', mid_record: '22-17', late_record: '44-38' },
    'Hurricanes': { early_record: '6-3', mid_record: '26-12', late_record: '52-30' },
    'Islanders': { early_record: '4-5', mid_record: '19-20', late_record: '40-42' },
    'Jets': { early_record: '6-3', mid_record: '25-14', late_record: '50-32' },
    'Kings': { early_record: '6-3', mid_record: '23-16', late_record: '46-36' },
    'Kraken': { early_record: '3-7', mid_record: '16-23', late_record: '37-45' },
    'Lightning': { early_record: '6-3', mid_record: '24-15', late_record: '47-35' },
    'Maple Leafs': { early_record: '6-3', mid_record: '25-14', late_record: '51-31' },
    'Oilers': { early_record: '5-4', mid_record: '21-18', late_record: '45-37' },
    'Panthers': { early_record: '6-3', mid_record: '25-13', late_record: '53-29' },
    'Penguins': { early_record: '3-7', mid_record: '14-25', late_record: '36-46' },
    'Predators': { early_record: '5-4', mid_record: '22-17', late_record: '43-39' },
    'Rangers': { early_record: '7-2', mid_record: '28-11', late_record: '56-26' },
    'Red Wings': { early_record: '6-3', mid_record: '21-18', late_record: '44-38' },
    'Sabres': { early_record: '4-6', mid_record: '17-22', late_record: '39-43' },
    'Senators': { early_record: '3-7', mid_record: '18-21', late_record: '37-45' },
    'Sharks': { early_record: '2-8', mid_record: '12-27', late_record: '25-57' },
    'Stars': { early_record: '7-2', mid_record: '27-12', late_record: '54-28' },
    'Wild': { early_record: '5-4', mid_record: '20-19', late_record: '41-41' }
};

// Core async function to fetch NHL data from ESPN API
async function fetchNHLData() {
    try {
        console.log('Starting NHL data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams');
        console.log('NHL API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('NHL API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('NHL API response structure unexpected:', data);
            return SPORTS_DATA.NHL;
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => {
            // Get records for this team
            const teamRecords = NHL_RECORDS[team.team.name] || {};
            
            return {
                full_team_name: team.team.displayName,
                logo: team.team.displayName,
                city: team.team.location,
                short_name: team.team.name,
                tricode: team.team.abbreviation,
                primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                early_record: teamRecords.early_record || null,
                mid_record: teamRecords.mid_record || null,
                late_record: teamRecords.late_record || null
            };
        });
        
        console.log('Processed NHL teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching NHL data:', error);
        console.log('Using fallback NHL data');
        return SPORTS_DATA.NHL;
    }
}

// WNBA Records data (Early/Mid/Late)
const WNBA_RECORDS = {
    'Aces': { early_record: '6-3', mid_record: '17-4', late_record: '25-15' },
    'Dream': { early_record: '4-5', mid_record: '10-11', late_record: '18-22' },
    'Fever': { early_record: '3-6', mid_record: '12-9', late_record: '21-19' },
    'Liberty': { early_record: '7-2', mid_record: '18-3', late_record: '32-8' },
    'Lynx': { early_record: '6-3', mid_record: '14-7', late_record: '22-18' },
    'Mercury': { early_record: '3-6', mid_record: '6-15', late_record: '16-24' },
    'Mystics': { early_record: '2-7', mid_record: '5-16', late_record: '14-26' },
    'Sky': { early_record: '5-4', mid_record: '9-12', late_record: '18-22' },
    'Sparks': { early_record: '2-7', mid_record: '7-14', late_record: '15-25' },
    'Storm': { early_record: '6-3', mid_record: '13-8', late_record: '23-17' },
    'Sun': { early_record: '7-2', mid_record: '16-5', late_record: '27-13' },
    'Wings': { early_record: '4-5', mid_record: '8-13', late_record: '17-23' }
};

// Core async function to fetch WNBA data from ESPN API
async function fetchWNBAData() {
    try {
        console.log('Starting WNBA data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams');
        console.log('WNBA API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('WNBA API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('WNBA API response structure unexpected:', data);
            return SPORTS_DATA.WNBA;
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => {
            // Get records for this team
            const teamRecords = WNBA_RECORDS[team.team.name] || {};
            
            return {
                full_team_name: team.team.displayName,
                logo: team.team.displayName,
                city: team.team.location,
                short_name: team.team.name,
                tricode: team.team.abbreviation,
                primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                early_record: teamRecords.early_record || null,
                mid_record: teamRecords.mid_record || null,
                late_record: teamRecords.late_record || null
            };
        });
        
        console.log('Processed WNBA teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching WNBA data:', error);
        console.log('Using fallback WNBA data');
        return SPORTS_DATA.WNBA;
    }
}

// Core async function to fetch Men's Tennis data from ESPN API (Top 40 players only)
async function fetchMensTennisData() {
    try {
        console.log('Starting Men\'s Tennis data fetch...');
        
        // Try multiple potential ESPN API endpoints for tennis
        const potentialEndpoints = [
            'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/rankings',
            'https://site.api.espn.com/apis/site/v2/sports/tennis/rankings',
            'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/players',
            'https://site.api.espn.com/apis/site/v2/sports/tennis/players'
        ];
        
        let response = null;
        let data = null;
        let successfulEndpoint = null;
        
        // Try each endpoint until one works
        for (const endpoint of potentialEndpoints) {
            try {
                console.log(`Trying endpoint: ${endpoint}`);
                response = await fetch(endpoint);
                console.log(`Response status: ${response.status}`);
                
                if (response.ok) {
                    data = await response.json();
                    successfulEndpoint = endpoint;
                    console.log(`Success with endpoint: ${endpoint}`);
                    break;
                }
            } catch (endpointError) {
                console.log(`Endpoint ${endpoint} failed:`, endpointError);
                continue;
            }
        }
        
        // If no endpoint worked, use fallback data
        if (!response || !response.ok || !data) {
            console.log('No working ESPN tennis API endpoint found, using fallback data');
            return SPORTS_DATA["Men's Tennis"];
        }
        
        console.log('Tennis API response data:', data);
        
        // Process the data based on the successful endpoint
        let players = [];
        
        if (successfulEndpoint.includes('rankings')) {
            // Handle rankings endpoint
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
                const rankings = data.sports[0].leagues[0].rankings || data.sports[0].leagues[0].athletes || [];
                players = rankings.slice(0, 40).map((player, index) => {
                    const fullName = player.displayName || player.name || `Player ${index + 1}`;
                    const nameParts = fullName.split(' ');
                    const shortName = nameParts.length >= 2 ? 
                        `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : 
                        fullName;
                    
                    return {
                        full_team_name: fullName,
                        headshot: fullName,
                        country: player.nationality || player.country || 'Unknown',
                        short_name: shortName,
                        tricode: player.nationalityCode || player.countryCode || 'UNK',
                        primary_color: player.color ? hexToRgb(player.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: player.alternateColor ? hexToRgb(player.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: player.rank || player.position || (index + 1).toString(),
                        points: player.points || '0',
                        age: player.age || 'Unknown'
                    };
                });
            }
        } else if (successfulEndpoint.includes('players')) {
            // Handle players endpoint
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
                const playersList = data.sports[0].leagues[0].athletes || data.sports[0].leagues[0].players || [];
                players = playersList.slice(0, 40).map((player, index) => {
                    const fullName = player.displayName || player.name || `Player ${index + 1}`;
                    const nameParts = fullName.split(' ');
                    const shortName = nameParts.length >= 2 ? 
                        `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : 
                        fullName;
                    
                    return {
                        full_team_name: fullName,
                        headshot: fullName,
                        country: player.nationality || player.country || 'Unknown',
                        short_name: shortName,
                        tricode: player.nationalityCode || player.countryCode || 'UNK',
                        primary_color: player.color ? hexToRgb(player.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: player.alternateColor ? hexToRgb(player.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: player.rank || player.position || (index + 1).toString(),
                        points: player.points || '0',
                        age: player.age || 'Unknown'
                    };
                });
            }
        }
        
        // If we couldn't parse the data structure, use fallback
        if (players.length === 0) {
            console.log('Could not parse tennis data structure, using fallback data');
            return SPORTS_DATA["Men's Tennis"];
        }
        
        console.log(`Processed ${players.length} tennis players:`, players);
        return players;
        
    } catch (error) {
        console.error('Error fetching Men\'s Tennis data:', error);
        console.log('Using fallback Men\'s Tennis data');
        return SPORTS_DATA["Men's Tennis"];
    }
}

// Core async function to fetch Women's Tennis data from ESPN API (Top 40 players only)
async function fetchWomensTennisData() {
    try {
        console.log('Starting Women\'s Tennis data fetch...');
        
        // Try multiple potential ESPN API endpoints for women's tennis
        const potentialEndpoints = [
            'https://site.api.espn.com/apis/site/v2/sports/tennis/wta/rankings',
            'https://site.api.espn.com/apis/site/v2/sports/tennis/wta/players',
            'https://site.api.espn.com/apis/site/v2/sports/tennis/rankings/wta'
        ];
        
        let response = null;
        let data = null;
        let successfulEndpoint = null;
        
        // Try each endpoint until one works
        for (const endpoint of potentialEndpoints) {
            try {
                console.log(`Trying endpoint: ${endpoint}`);
                response = await fetch(endpoint);
                console.log(`Response status: ${response.status}`);
                
                if (response.ok) {
                    data = await response.json();
                    successfulEndpoint = endpoint;
                    console.log(`Success with endpoint: ${endpoint}`);
                    break;
                }
            } catch (endpointError) {
                console.log(`Endpoint ${endpoint} failed:`, endpointError);
                continue;
            }
        }
        
        // If no endpoint worked, use fallback data
        if (!response || !response.ok || !data) {
            console.log('No working ESPN women\'s tennis API endpoint found, using fallback data');
            return SPORTS_DATA["Women's Tennis"];
        }
        
        console.log('Women\'s Tennis API response data:', data);
        
        // Process the data based on the successful endpoint
        let players = [];
        
        if (successfulEndpoint.includes('rankings')) {
            // Handle rankings endpoint
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
                const rankings = data.sports[0].leagues[0].rankings || data.sports[0].leagues[0].athletes || [];
                players = rankings.slice(0, 40).map((player, index) => {
                    const fullName = player.displayName || player.name || `Player ${index + 1}`;
                    const nameParts = fullName.split(' ');
                    const shortName = nameParts.length >= 2 ? 
                        `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : 
                        fullName;
                    
                    return {
                        full_team_name: fullName,
                        headshot: fullName,
                        country: player.nationality || player.country || 'Unknown',
                        short_name: shortName,
                        tricode: player.nationalityCode || player.countryCode || 'UNK',
                        primary_color: player.color ? hexToRgb(player.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: player.alternateColor ? hexToRgb(player.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: player.rank || player.position || (index + 1).toString(),
                        points: player.points || '0',
                        age: player.age || 'Unknown'
                    };
                });
            }
        } else if (successfulEndpoint.includes('players')) {
            // Handle players endpoint
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
                const playersList = data.sports[0].leagues[0].athletes || data.sports[0].leagues[0].players || [];
                players = playersList.slice(0, 40).map((player, index) => {
                    const fullName = player.displayName || player.name || `Player ${index + 1}`;
                    const nameParts = fullName.split(' ');
                    const shortName = nameParts.length >= 2 ? 
                        `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : 
                        fullName;
                    
                    return {
                        full_team_name: fullName,
                        headshot: fullName,
                        country: player.nationality || player.country || 'Unknown',
                        short_name: shortName,
                        tricode: player.nationalityCode || player.countryCode || 'UNK',
                        primary_color: player.color ? hexToRgb(player.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: player.alternateColor ? hexToRgb(player.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: player.rank || player.position || (index + 1).toString(),
                        points: player.points || '0',
                        age: player.age || 'Unknown'
                    };
                });
            }
        }
        
        // If we couldn't parse the data structure, use fallback
        if (players.length === 0) {
            console.log('Could not parse women\'s tennis data structure, using fallback data');
            return SPORTS_DATA["Women's Tennis"];
        }
        
        console.log(`Processed ${players.length} women\'s tennis players:`, players);
        return players;
        
    } catch (error) {
        console.error('Error fetching Women\'s Tennis data:', error);
        console.log('Using fallback Women\'s Tennis data');
        return SPORTS_DATA["Women's Tennis"];
    }
}

// Core async function to fetch Men's Golf data from ESPN API (Top 40 players only)
async function fetchMensGolfData() {
    try {
        console.log('Starting Men\'s Golf data fetch...');
        const allowHtmlFallback = false;

        // 1) Prefer Masters leaderboard (event-specific rankings)
        try {
            const mastersEventId = '401703504';
            const leaderboardUrlCandidates = [
                `https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=${mastersEventId}`,
                `https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard?event=${mastersEventId}`,
                `https://site.web.api.espn.com/apis/v2/sports/golf/pga/leaderboard?event=${mastersEventId}`
            ];
            let lbData = null;
            for (const url of leaderboardUrlCandidates) {
                try {
                    const resp = await fetch(url);
                    if (resp.ok) { lbData = await resp.json(); break; }
                } catch (e) { /* try next */ }
            }
            if (lbData && lbData.events && lbData.events[0] && lbData.events[0].competitions && lbData.events[0].competitions[0] && lbData.events[0].competitions[0].competitors) {
                const competitors = lbData.events[0].competitions[0].competitors;
                // country helpers
                const countryNameToCode = {
                    'United States': 'USA',
                    'Northern Ireland': 'NIR',
                    'Ireland': 'IRL',
                    'Spain': 'ESP',
                    'England': 'ENG',
                    'Scotland': 'SCO',
                    'Wales': 'WAL',
                    'Sweden': 'SWE',
                    'Norway': 'NOR',
                    'Denmark': 'DEN',
                    'Germany': 'GER',
                    'France': 'FRA',
                    'Italy': 'ITA',
                    'Australia': 'AUS',
                    'Japan': 'JPN',
                    'South Korea': 'KOR',
                    'Canada': 'CAN',
                    'South Africa': 'RSA',
                    'New Zealand': 'NZL',
                    'Austria': 'AUT'
                };
                const countryColors = {
                    'USA': { primary: { r: 0.0, g: 0.2, b: 0.6 }, secondary: { r: 0.8, g: 0.0, b: 0.0 } },
                    'NIR': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                    'IRL': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 0.9, g: 0.4, b: 0.0 } },
                    'ESP': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 0.85, b: 0.0 } },
                    'ENG': { primary: { r: 1.0, g: 1.0, b: 1.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                    'SCO': { primary: { r: 0.0, g: 0.27, b: 0.53 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                    'WAL': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 0.0, g: 0.5, b: 0.0 } },
                    'SWE': { primary: { r: 0.0, g: 0.34, b: 0.67 }, secondary: { r: 1.0, g: 0.85, b: 0.0 } },
                    'NOR': { primary: { r: 0.0, g: 0.22, b: 0.53 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                    'DEN': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                    'GER': { primary: { r: 0.0, g: 0.0, b: 0.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                    'FRA': { primary: { r: 0.0, g: 0.2, b: 0.6 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                    'ITA': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                    'AUS': { primary: { r: 0.0, g: 0.27, b: 0.53 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                    'JPN': { primary: { r: 1.0, g: 1.0, b: 1.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                    'KOR': { primary: { r: 0.0, g: 0.2, b: 0.6 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                    'CAN': { primary: { r: 1.0, g: 1.0, b: 1.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                    'RSA': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 1.0, g: 0.85, b: 0.0 } },
                    'NZL': { primary: { r: 0.0, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                    'AUT': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } }
                };
        // sort by placement (position id ascending), then score to par
        const playersFromLb = competitors
                    .slice()
                    .sort(function(a,b){
                        const pa = (a.status && a.status.position && a.status.position.id) ? parseInt(a.status.position.id,10) : 9999;
                        const pb = (b.status && b.status.position && b.status.position.id) ? parseInt(b.status.position.id,10) : 9999;
                        if (pa !== pb) return pa - pb;
                        const sa = (a.score && typeof a.score.value === 'number') ? a.score.value : 9999;
                        const sb = (b.score && typeof b.score.value === 'number') ? b.score.value : 9999;
                        return sa - sb;
                    })
                    .map(function(c, i){
                        const a = c.athlete || {};
                        const flag = a.flag || {};
                        const bp = a.birthPlace || {};
                        let code = (bp.countryAbbreviation ? String(bp.countryAbbreviation).toUpperCase() : '');
                        if (!code && flag.alt && countryNameToCode[flag.alt]) code = countryNameToCode[flag.alt];
                        if (!code && flag.href) {
                            const m = flag.href.match(/\/countries\/\d+\/(\w+)\.png/i);
                            if (m && m[1]) code = m[1].toUpperCase();
                        }
                        if (!code) code = 'UNK';
                        const clr = countryColors[code] || { primary: { r: 0.5, g: 0.5, b: 0.5 }, secondary: { r: 0.8, g: 0.8, b: 0.8 } };
                        const stats = c.statistics || [];
                        const moneyStat = stats.find(function(s){ return s && s.name && s.name.toLowerCase().indexOf('officialamount') !== -1; });
                        let earnings = null;
                        if (moneyStat) {
                            earnings = moneyStat.displayValueShort || moneyStat.shortDisplayValue || moneyStat.abbrevDisplayValue || null;
                            if (!earnings && typeof moneyStat.value === 'number') earnings = formatCurrencyAbbrev(moneyStat.value);
                            if (!earnings && moneyStat.displayValue) {
                                // Convert long-form "$4,200,000" to abbreviated if short not provided
                                const numeric = parseFloat(String(moneyStat.displayValue).replace(/[^0-9.]/g, ''));
                                earnings = isNaN(numeric) ? moneyStat.displayValue : formatCurrencyAbbrev(numeric);
                            }
                        }
                        if (!earnings && c.earnings) earnings = formatCurrencyAbbrev(c.earnings);
                        const pos = c.status && c.status.position && c.status.position.displayName ? String(c.status.position.displayName).replace(/T/g, '') : '';
                        const score = c.score && c.score.displayValue ? String(c.score.displayValue) : (function(){
                            const st = stats.find(function(s){ return s && s.name && s.name.toLowerCase().indexOf('scoretopar') !== -1; });
                            return st && st.displayValue ? String(st.displayValue) : '';
                        })();
                        const displayName = a.displayName || (a.firstName ? `${a.firstName} ${a.lastName || ''}`.trim() : 'Unknown');
                        const shortName = a.shortName || (a.lastName ? `${(a.firstName||'')[0]}. ${a.lastName}` : displayName);
                        return {
                            athlete_id: a.id || a.uid || null,
                            full_team_name: displayName,
                            country: flag.alt || bp.country || 'Unknown',
                            short_name: shortName,
                            tricode: code,
                            primary_color: clr.primary,
                            secondary_color: clr.secondary,
                            rank: pos || String(i + 1),
                            score: score,
                            earnings: earnings,
                            age: a.age !== undefined ? String(a.age) : 'Unknown'
                        };
                    })
                    .filter(function(p){ return !!p.full_team_name; })
                    .slice(0, 40);
                if (playersFromLb.length > 0) {
                    console.log(`Processed ${playersFromLb.length} players from Masters leaderboard`);
                    return playersFromLb;
                }
            }
        } catch (lbErr) {
            console.log('Masters leaderboard fetch failed:', lbErr);
        }
        
        // Preferred endpoint: all-leagues world rankings (public web API)
        try {
            const allRankingsUrl = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/all/rankings?region=us&lang=en&polls=1';
            const allResp = await fetch(allRankingsUrl);
            if (allResp.ok) {
                const allData = await allResp.json();
                // rankings is an ARRAY per the endpoint (e.g., World Rankings). Find the one with ranks
                let ranksArray = [];
                if (allData && Array.isArray(allData.rankings)) {
                    const firstWithRanks = allData.rankings.find(x => x && Array.isArray(x.ranks));
                    if (firstWithRanks && Array.isArray(firstWithRanks.ranks)) ranksArray = firstWithRanks.ranks;
                } else if (allData && allData.rankings && Array.isArray(allData.rankings.ranks)) {
                    // fallback in case it's an object
                    ranksArray = allData.rankings.ranks;
                }
                if (Array.isArray(ranksArray) && ranksArray.length > 0) {
                    // Keep only entries with a valid athlete object (filter out headers/metadata)
                    const ranks = ranksArray.filter(r => r && r.athlete && (r.athlete.displayName || r.athlete.fullName || r.athlete.firstName));
                    // Country code and color helpers
                    const countryNameToCode = {
                        'United States': 'USA',
                        'Northern Ireland': 'NIR',
                        'Ireland': 'IRL',
                        'Spain': 'ESP',
                        'England': 'ENG',
                        'Scotland': 'SCO',
                        'Wales': 'WAL',
                        'Sweden': 'SWE',
                        'Norway': 'NOR',
                        'Denmark': 'DEN',
                        'Germany': 'GER',
                        'France': 'FRA',
                        'Italy': 'ITA',
                        'Australia': 'AUS',
                        'Japan': 'JPN',
                        'South Korea': 'KOR',
                        'Canada': 'CAN',
                        'South Africa': 'RSA',
                        'New Zealand': 'NZL',
                        'Austria': 'AUT'
                    };
                    const countryColors = {
                        'USA': { primary: { r: 0.0, g: 0.2, b: 0.6 }, secondary: { r: 0.8, g: 0.0, b: 0.0 } },
                        'NIR': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                        'IRL': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 0.9, g: 0.4, b: 0.0 } },
                        'ESP': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 0.85, b: 0.0 } },
                        'ENG': { primary: { r: 1.0, g: 1.0, b: 1.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                        'SCO': { primary: { r: 0.0, g: 0.27, b: 0.53 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                        'WAL': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 0.0, g: 0.5, b: 0.0 } },
                        'SWE': { primary: { r: 0.0, g: 0.34, b: 0.67 }, secondary: { r: 1.0, g: 0.85, b: 0.0 } },
                        'NOR': { primary: { r: 0.0, g: 0.22, b: 0.53 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                        'DEN': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                        'GER': { primary: { r: 0.0, g: 0.0, b: 0.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                        'FRA': { primary: { r: 0.0, g: 0.2, b: 0.6 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                        'ITA': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                        'AUS': { primary: { r: 0.0, g: 0.27, b: 0.53 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                        'JPN': { primary: { r: 1.0, g: 1.0, b: 1.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                        'KOR': { primary: { r: 0.0, g: 0.2, b: 0.6 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                        'CAN': { primary: { r: 1.0, g: 1.0, b: 1.0 }, secondary: { r: 0.87, g: 0.0, b: 0.0 } },
                        'RSA': { primary: { r: 0.0, g: 0.5, b: 0.0 }, secondary: { r: 1.0, g: 0.85, b: 0.0 } },
                        'NZL': { primary: { r: 0.0, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } },
                        'AUT': { primary: { r: 0.87, g: 0.0, b: 0.0 }, secondary: { r: 1.0, g: 1.0, b: 1.0 } }
                    };

                    const players = ranks.slice(0, 40).map((r, index) => {
                        const a = r.athlete || {};
                        const fullName = a.displayName || a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || `Player ${index + 1}`;
                        const nameParts = fullName.split(' ');
                        const shortName = a.shortName || (nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName);
                        const tpStat = (r.recordStats && r.recordStats.find(s => s.abbreviation === 'TP')) || null;
                        const apStat = (r.recordStats && r.recordStats.find(s => s.abbreviation === 'AP')) || null;
                        const gpStat = (r.recordStats && r.recordStats.find(s => s.abbreviation === 'GP')) || null;
                        const lpStat = (r.recordStats && r.recordStats.find(s => s.abbreviation === 'LP')) || null;
                        const teStat = (r.recordStats && r.recordStats.find(s => s.abbreviation === 'TE')) || null;
                        // Country tri-code
                        let code = (a.birthPlace && a.birthPlace.countryAbbreviation) ? String(a.birthPlace.countryAbbreviation).toUpperCase() : '';
                        if (!code && a.flag && a.flag.alt && countryNameToCode[a.flag.alt]) {
                            code = countryNameToCode[a.flag.alt];
                        }
                        // Try to parse from flag href like .../countries/500/usa.png
                        if (!code && a.flag && a.flag.href) {
                            const m = a.flag.href.match(/\/countries\/\d+\/(\w+)\.png/i);
                            if (m && m[1]) code = m[1].toUpperCase();
                        }
                        if (code.length > 3) code = code.slice(0, 3).toUpperCase();
                        if (!code) code = 'UNK';
                        // Colors by country if available
                        const colorSet = countryColors[code] || null;
                        const primary = colorSet ? colorSet.primary : { r: 0.5, g: 0.5, b: 0.5 };
                        const secondary = colorSet ? colorSet.secondary : { r: 0.8, g: 0.8, b: 0.8 };
                        return {
                            athlete_id: a.id || a.uid || null,
                            full_team_name: fullName,
                            headshot: fullName,
                            country: (a.birthPlace && a.birthPlace.country) || 'Unknown',
                            short_name: shortName,
                            tricode: code,
                            primary_color: primary,
                            secondary_color: secondary,
                            rank: (r.current || index + 1).toString(),
                            points: (tpStat && tpStat.displayValue) || (apStat && apStat.displayValue) || '0',
                            average_points: (apStat && apStat.displayValue) || null,
                            total_points: (tpStat && tpStat.displayValue) || null,
                            events: (teStat && (teStat.displayValue || teStat.value)) || null,
                            points_lost: (lpStat && lpStat.displayValue) || null,
                            points_gained: (gpStat && gpStat.displayValue) || null,
                            age: (a.age !== undefined && a.age !== null) ? String(a.age) : 'Unknown'
                        };
                    });
                    // Augment with money standings (earnings)
                    try {
                        const year = new Date().getFullYear();
                        const earningsCandidates = [
                            `https://site.web.api.espn.com/apis/v2/sports/golf/pga/standings?region=us&lang=en&group=money`,
                            `https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/rankings?region=us&lang=en&polls=money`,
                            `https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/seasons/${year}/standings?region=us&group=money`,
                            `https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/standings?region=us&group=money`
                        ];
                        let moneyData = null;
                        for (const url of earningsCandidates) {
                            try {
                                const resp = await fetch(url);
                                if (resp.ok) { moneyData = await resp.json(); break; }
                            } catch (e) { /* try next */ }
                        }
                        if (moneyData) {
                            // Extract athlete earnings into a map by athlete id
                            const idToEarnings = new Map();
                            const traverse = (obj) => {
                                if (!obj) return;
                                if (Array.isArray(obj)) { obj.forEach(traverse); return; }
                                if (obj.athlete && (obj.stats || obj.recordStats)) {
                                    const a = obj.athlete;
                                    const statsArr = obj.stats || obj.recordStats;
                                    let moneyStat = null;
                                    if (Array.isArray(statsArr)) {
                                        moneyStat = statsArr.find(s => 
                                            (s.abbreviation && s.abbreviation.toLowerCase().includes('money')) ||
                                            (s.name && s.name.toLowerCase().includes('earn')) ||
                                            (s.type && String(s.type).toLowerCase().includes('money'))
                                        );
                                    }
                                    if (moneyStat && (a.id || a.uid)) {
                                        const key = a.id || a.uid;
                                        const rawVal = moneyStat.displayValue || moneyStat.value || '';
                                        idToEarnings.set(String(key), String(rawVal));
                                    }
                                }
                                Object.keys(obj).forEach(k => {
                                    if (typeof obj[k] === 'object') traverse(obj[k]);
                                });
                            };
                            traverse(moneyData);
                            // Merge into players
                            players.forEach(p => {
                                if (!p.athlete_id) return;
                                const v = idToEarnings.get(String(p.athlete_id));
                                if (v) p.earnings = formatCurrencyAbbrev(v);
                            });
                        }
                    } catch (moneyErr) {
                        console.log('Money standings fetch failed:', moneyErr);
                    }
                    if (players.length > 0) {
                        console.log(`Processed ${players.length} golf players from all/rankings endpoint`);
                        return players;
                    }
                }
            }
        } catch (allErr) {
            console.log('all/rankings endpoint failed:', allErr);
        }

        // Try multiple potential ESPN API endpoints for golf
        const potentialEndpoints = [
            // site.api endpoints (may 500 intermittently)
            'https://site.api.espn.com/apis/site/v2/sports/golf/pga/rankings',
            'https://site.api.espn.com/apis/site/v2/sports/golf/rankings',
            // site.web.api variants
            'https://site.web.api.espn.com/apis/v2/sports/golf/pga/rankings?region=us',
            // sports.core.api entry list
            'https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/rankings?region=us',
            // direct OWGR on core api
            'https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/rankings/owgr?region=us'
        ];
        
        let response = null;
        let data = null;
        let successfulEndpoint = null;
        
        for (const endpoint of potentialEndpoints) {
            try {
                console.log(`Trying endpoint: ${endpoint}`);
                // Try plugin fetch first, then UI fetch fallback (some ESPN endpoints block UI CORS)
                try {
                    response = await fetch(endpoint);
                    console.log(`Response status: ${response.status}`);
                    if (response.ok) {
                        data = await response.json();
                    }
                } catch (pluginFetchError) {
                    console.log('Plugin fetch failed, trying UI fetch:', pluginFetchError);
                }
                if (!data && endpoint.includes('site.api.espn.com')) {
                    try {
                        data = await fetchFromUI(endpoint);
                    } catch (uiFetchError) {
                        console.log('UI fetch also failed:', uiFetchError);
                    }
                }
                if (data) {
                    successfulEndpoint = endpoint;
                    console.log(`Success with endpoint: ${endpoint}`);
                    break;
                }
            } catch (endpointError) {
                console.log(`Endpoint ${endpoint} failed:`, endpointError);
                continue;
            }
        }
        
        if (!data) {
            console.log('No working ESPN golf API endpoint found, attempting HTML scrape fallback');
            data = {};
        }
        
        console.log('Golf API response data:', data);
        
        let players = [];
        
        if (successfulEndpoint && successfulEndpoint.includes('rankings') && successfulEndpoint.includes('site.api.espn.com')) {
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
                const rankings = data.sports[0].leagues[0].rankings || data.sports[0].leagues[0].athletes || [];
                players = rankings.slice(0, 40).map((player, index) => {
                    const fullName = player.displayName || player.name || `Player ${index + 1}`;
                    const nameParts = fullName.split(' ');
                    const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                    return {
                        full_team_name: fullName,
                        headshot: fullName,
                        country: player.nationality || player.country || 'Unknown',
                        short_name: shortName,
                        tricode: player.nationalityCode || player.countryCode || 'UNK',
                        primary_color: player.color ? hexToRgb(player.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: player.alternateColor ? hexToRgb(player.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: player.rank || player.position || (index + 1).toString(),
                        points: player.points || '0',
                        age: player.age || 'Unknown'
                    };
                });
            }
        } else if (successfulEndpoint && successfulEndpoint.includes('athletes')) {
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
                const athletes = data.sports[0].leagues[0].athletes || data.sports[0].leagues[0].players || [];
                players = athletes.slice(0, 40).map((player, index) => {
                    const fullName = player.displayName || player.name || `Player ${index + 1}`;
                    const nameParts = fullName.split(' ');
                    const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                    return {
                        full_team_name: fullName,
                        headshot: fullName,
                        country: player.nationality || player.country || 'Unknown',
                        short_name: shortName,
                        tricode: player.nationalityCode || player.countryCode || 'UNK',
                        primary_color: player.color ? hexToRgb(player.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: player.alternateColor ? hexToRgb(player.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: player.rank || player.position || (index + 1).toString(),
                        points: player.points || '0',
                        age: player.age || 'Unknown'
                    };
                });
            }
        }
        
        // site.web.api: items with hrefs to specific ranking types
        if (players.length === 0 && data.items && Array.isArray(data.items)) {
            let target = data.items.find(it => (it.type && (it.type.toLowerCase().includes('owgr') || it.type.toLowerCase().includes('world'))) || (it.name && it.name.toLowerCase().includes('world')));
            if (!target) target = data.items[0];
            if (target && (target.$ref || target.href)) {
                try {
                    const url = target.$ref || target.href;
                    const detailResp = await fetch(url);
                    if (detailResp.ok) {
                        const detail = await detailResp.json();
                        if (detail.entries && Array.isArray(detail.entries)) {
                            players = detail.entries.slice(0, 40).map((entry, index) => {
                                const athlete = entry.athlete || {};
                                const fullName = athlete.displayName || athlete.fullName || entry.name || `Player ${index + 1}`;
                                const nameParts = fullName.split(' ');
                                const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                                return {
                                    full_team_name: fullName,
                                    headshot: fullName,
                                    country: athlete.nationality || athlete.country || 'Unknown',
                                    short_name: shortName,
                                    tricode: athlete.nationalityCode || athlete.countryCode || 'UNK',
                                    primary_color: { r: 0.5, g: 0.5, b: 0.5 },
                                    secondary_color: { r: 0.8, g: 0.8, b: 0.8 },
                                    rank: entry.rank || (index + 1).toString(),
                                    points: entry.points || entry.rating || '0',
                                    age: athlete.age || 'Unknown'
                                };
                            });
                        }
                    }
                } catch (rankErr) {
                    console.log('Error fetching detailed golf rankings:', rankErr);
                }
            }
        }
        
        // sports.core.api direct owgr structure
        if (players.length === 0 && data.entries && Array.isArray(data.entries)) {
            players = data.entries.slice(0, 40).map((entry, index) => {
                const athlete = entry.athlete || {};
                const fullName = athlete.displayName || athlete.fullName || entry.name || `Player ${index + 1}`;
                const nameParts = fullName.split(' ');
                const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                return {
                    full_team_name: fullName,
                    headshot: fullName,
                    country: athlete.nationality || athlete.country || 'Unknown',
                    short_name: shortName,
                    tricode: athlete.nationalityCode || athlete.countryCode || 'UNK',
                    primary_color: { r: 0.5, g: 0.5, b: 0.5 },
                    secondary_color: { r: 0.8, g: 0.8, b: 0.8 },
                    rank: entry.rank || (index + 1).toString(),
                    points: entry.points || entry.rating || '0',
                    age: athlete.age || 'Unknown'
                };
            });
        }
        // Additional shape: sometimes rankings are under data.rankings.items
        if (players.length === 0 && data.rankings && Array.isArray(data.rankings.items)) {
            players = data.rankings.items.slice(0, 40).map((item, index) => {
                const fullName = (item.athlete && (item.athlete.displayName || item.athlete.fullName)) || item.name || `Player ${index + 1}`;
                const nameParts = fullName.split(' ');
                const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                return {
                    full_team_name: fullName,
                    headshot: fullName,
                    country: (item.athlete && (item.athlete.nationality || item.athlete.country)) || 'Unknown',
                    short_name: shortName,
                    tricode: (item.athlete && (item.athlete.nationalityCode || item.athlete.countryCode)) || 'UNK',
                    primary_color: { r: 0.5, g: 0.5, b: 0.5 },
                    secondary_color: { r: 0.8, g: 0.8, b: 0.8 },
                    rank: item.rank || (index + 1).toString(),
                    points: item.points || '0',
                    age: (item.athlete && item.athlete.age) || 'Unknown'
                };
            });
        }
        
        // Try discovery via _showHttp helper: find JSON ranking endpoints embedded in the page
        if (allowHtmlFallback && players.length === 0) {
            try {
                let text = '';
                try {
                    const discoverResp = await fetch('https://www.espn.com/golf/rankings?_showHttp=true', { headers: { 'accept': 'text/html' } });
                    if (discoverResp.ok) text = await discoverResp.text();
                } catch (discoverErr) {
                    console.log('Discovery fetch (_showHttp) failed (plugin):', discoverErr);
                }
                if (!text) {
                    try {
                        const htmlData = await fetchFromUI('https://www.espn.com/golf/rankings?_showHttp=true');
                        if (htmlData && htmlData.__rawText) text = htmlData.__rawText;
                    } catch (uiDiscoverErr) {
                        console.log('Discovery fetch (_showHttp) failed (UI):', uiDiscoverErr);
                    }
                }
                if (text) {
                    const urlRegex = /(https:\/\/(?:site\.web\.api|site\.api|sports\.core\.api)\.espn\.com[^"'<>\s]+rankings[^"'<>\s]*)/gmi;
                    const discovered = new Set();
                    let um;
                    while ((um = urlRegex.exec(text))) {
                        const url = um[1];
                        if (url && url.toLowerCase().includes('/golf/')) discovered.add(url);
                    }
                    for (const url of discovered) {
                        try {
                            const r = await fetch(url);
                            if (!r.ok) continue;
                            const j = await r.json();
                            // Reuse the parsing branches
                            if (j.entries && Array.isArray(j.entries)) {
                                players = j.entries.slice(0, 40).map((entry, index) => {
                                    const athlete = entry.athlete || {};
                                    const fullName = athlete.displayName || athlete.fullName || entry.name || `Player ${index + 1}`;
                                    const nameParts = fullName.split(' ');
                                    const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                                    return {
                                        full_team_name: fullName,
                                        headshot: fullName,
                                        country: athlete.nationality || athlete.country || 'Unknown',
                                        short_name: shortName,
                                        tricode: athlete.nationalityCode || athlete.countryCode || 'UNK',
                                        primary_color: { r: 0.5, g: 0.5, b: 0.5 },
                                        secondary_color: { r: 0.8, g: 0.8, b: 0.8 },
                                        rank: entry.rank || (index + 1).toString(),
                                        points: entry.points || entry.rating || '0',
                                        age: athlete.age || 'Unknown'
                                    };
                                });
                                if (players.length > 0) break;
                            } else if (j.items && Array.isArray(j.items)) {
                                const first = j.items[0];
                                if (first && (first.$ref || first.href)) {
                                    try {
                                        const det = await fetch(first.$ref || first.href);
                                        if (det.ok) {
                                            const dj = await det.json();
                                            if (dj.entries && Array.isArray(dj.entries)) {
                                                players = dj.entries.slice(0, 40).map((entry, index) => {
                                                    const athlete = entry.athlete || {};
                                                    const fullName = athlete.displayName || athlete.fullName || entry.name || `Player ${index + 1}`;
                                                    const nameParts = fullName.split(' ');
                                                    const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                                                    return {
                                                        full_team_name: fullName,
                                                        headshot: fullName,
                                                        country: athlete.nationality || athlete.country || 'Unknown',
                                                        short_name: shortName,
                                                        tricode: athlete.nationalityCode || athlete.countryCode || 'UNK',
                                                        primary_color: { r: 0.5, g: 0.5, b: 0.5 },
                                                        secondary_color: { r: 0.8, g: 0.8, b: 0.8 },
                                                        rank: entry.rank || (index + 1).toString(),
                                                        points: entry.points || entry.rating || '0',
                                                        age: athlete.age || 'Unknown'
                                                    };
                                                });
                                                if (players.length > 0) break;
                                            }
                                        }
                                    } catch (ignored) {}
                                }
                            }
                        } catch (discErr) {
                            console.log('Error fetching discovered URL:', url, discErr);
                        }
                    }
                }
            } catch (e) {
                console.log('Discovery via _showHttp failed:', e);
            }
        }

        // HTML scrape fallback from public rankings page if JSON APIs fail
        if (allowHtmlFallback && players.length === 0) {
            try {
                let text = '';
                try {
                    // Use r.jina.ai to fetch rendered content as plain text to avoid heavy HTML parsing
                    const proxyResp = await fetch('https://r.jina.ai/http://www.espn.com/golf/rankings');
                    if (proxyResp.ok) {
                        text = await proxyResp.text();
                    }
                } catch (pluginHtmlErr) {
                    console.log('Proxy text fetch failed:', pluginHtmlErr);
                }
                if (text) {
                    // Log snippet for debugging
                    try { console.log('Golf rankings text snippet:', text.slice(0, 300)); } catch (e) {}
                    // Extract simple text rows like: 1. Player Name ... Points
                    const lineRegex = /^(\d{1,3})\.?\s+([A-Za-z\-'.\s]+)$/gmi;
                    let match;
                    const scraped = [];
                    while ((match = lineRegex.exec(text)) && scraped.length < 40) {
                        const rank = (match[1] || '').trim();
                        const fullName = (match[2] || '').trim();
                        const points = '';
                        if (fullName) {
                            const nameParts = fullName.split(' ');
                            const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                            scraped.push({
                                full_team_name: fullName,
                                headshot: fullName,
                                country: 'Unknown',
                                short_name: shortName,
                                tricode: 'UNK',
                                primary_color: { r: 0.5, g: 0.5, b: 0.5 },
                                secondary_color: { r: 0.8, g: 0.8, b: 0.8 },
                                rank: rank || (scraped.length + 1).toString(),
                                points: points || '0',
                                age: 'Unknown'
                            });
                        }
                    }
                    // If regex didn’t catch lines, try anchor-only parse on text
                    if (scraped.length === 0) {
                        const anchorRegex = /\b([A-Z][a-zA-Z'\.\-]+\s+[A-Z][a-zA-Z'\.\-]+)\b/gm;
                        let m;
                        while ((m = anchorRegex.exec(text)) && players.length < 40) {
                            const fullName = (m[1] || '').trim();
                            if (!fullName) continue;
                            const nameParts = fullName.split(' ');
                            const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : fullName;
                            players.push({
                                full_team_name: fullName,
                                headshot: fullName,
                                country: 'Unknown',
                                short_name: shortName,
                                tricode: 'UNK',
                                primary_color: { r: 0.5, g: 0.5, b: 0.5 },
                                secondary_color: { r: 0.8, g: 0.8, b: 0.8 },
                                rank: (players.length + 1).toString(),
                                points: '0',
                                age: 'Unknown'
                            });
                        }
                    } else {
                        players = scraped;
                    }
                }
            } catch (htmlErr) {
                console.log('HTML scrape fallback failed:', htmlErr);
            }
        }

        if (players.length === 0) {
            console.log('Could not parse golf data structure, returning empty list');
            return [];
        }
        
        console.log(`Processed ${players.length} golf players:`, players);
        return players;
    } catch (error) {
        console.error('Error fetching Men\'s Golf data:', error);
        return [];
    }
}

// Core async function to fetch NCAA Football data from ESPN API (Top 40 teams only)
async function fetchNCAAData() {
    try {
        console.log('Starting NCAA Football (Top 40) data fetch...');
        // Fetch rankings to get top 40 teams, then get their details
        const rankingsResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings');
        console.log('NCAA Football rankings API response status:', rankingsResponse.status);
        
        if (!rankingsResponse.ok) {
            throw new Error(`Rankings HTTP error! status: ${rankingsResponse.status}`);
        }
        const rankingsData = await rankingsResponse.json();
        
        // Get top 40 teams from AP poll (most common ranking)
        let topTeams = [];
        if (rankingsData.rankings && rankingsData.rankings.length > 0) {
            const apPoll = rankingsData.rankings.find(ranking => 
                ranking.name && ranking.name.toLowerCase().includes('ap')
            );
            
            if (apPoll && apPoll.ranks) {
                topTeams = apPoll.ranks.slice(0, 25).map(rank => ({
                    teamId: rank.team.id,
                    rank: rank.current,
                    teamName: rank.team.displayName
                }));
            }
        }
        
        console.log('Found top teams:', topTeams.length);
        
        // If no rankings available, get top teams from regular API and limit to 25
        if (topTeams.length === 0) {
            console.log('No rankings found, fetching teams from regular API...');
            const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=130');
            const data = await response.json();
            
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0] && data.sports[0].leagues[0].teams) {
                const teams = data.sports[0].leagues[0].teams.slice(0, 25).map(team => ({
                    full_team_name: team.team.displayName,
                    logo: team.team.location, // Use city name same as City field
                    city: team.team.location,
                    short_name: team.team.name,
                    tricode: team.team.abbreviation,
                    primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                    secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 }
                }));
                
                console.log('Processed top 25 NCAA Football teams:', teams.length, teams);
                return teams;
            }
        }
        
        // If we have rankings, fetch detailed team info for top 40
        const teams = [];
        for (const topTeam of topTeams) {
            try {
                const teamResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${topTeam.teamId}`);
                const teamData = await teamResponse.json();
                
                if (teamData.team) {
                    teams.push({
                        full_team_name: teamData.team.displayName,
                        logo: teamData.team.location, // Use city name same as City field
                        city: teamData.team.location,
                        short_name: teamData.team.name,
                        tricode: teamData.team.abbreviation,
                        primary_color: teamData.team.color ? hexToRgb(teamData.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: teamData.team.alternateColor ? hexToRgb(teamData.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: topTeam.rank
                    });
                }
            } catch (teamError) {
                console.log(`Error fetching team ${topTeam.teamName}:`, teamError);
            }
        }
        
        console.log('Processed top 25 ranked NCAA Football teams:', teams.length, teams);
        return teams;
        
    } catch (error) {
        console.error('Error fetching NCAA Football data:', error);
        console.log('Using fallback NCAA Football data');
        return SPORTS_DATA["NCAA Football"];
    }
}

// Helper function to convert hex colors to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 0.5, g: 0.5, b: 0.5 };
}

// Helper to format currency abbreviations (e.g., 1100000 -> $1.1M, 654000 -> $654K)
function formatCurrencyAbbrev(value) {
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return String(value);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${Math.round(num / 1000)}K`;
    return `$${Math.round(num)}`;
}

// Helper function to create collection with team modes
async function createTeamModesCollection(teams, leagueName) {
    let createdCount = 0;
    
    // Create or get collection
    let collection;
    const existingCollections = figma.variables.getLocalVariableCollections();
    const existingCollection = existingCollections.find(c => c.name === leagueName);
    
    if (existingCollection) {
        collection = existingCollection;
        console.log(`Using existing ${leagueName} collection`);
    } else {
        collection = figma.variables.createVariableCollection(leagueName);
        console.log(`Created new ${leagueName} collection`);
    }
    
    // First, create all team modes
    const teamModeIds = {};
    teams.forEach(team => {
        try {
            // Check if mode already exists
            const existingMode = collection.modes.find(mode => mode.name === team.full_team_name);
            let modeId = existingMode ? existingMode.modeId : null;
            
            if (!modeId) {
                // Create new mode for this team
                modeId = collection.addMode(team.full_team_name);
                console.log(`Created mode for ${team.full_team_name}`);
            }
            
            teamModeIds[team.full_team_name] = modeId;
        } catch (modeError) {
            console.log(`Error creating mode for ${team.full_team_name}:`, modeError);
        }
    });
    
    // Remove the default empty mode if it exists and we have team modes
    if (collection.modes.length > teams.length) {
        try {
            // Find and remove default modes (Mode 1, Default, etc.)
            const defaultModes = collection.modes.filter(mode => 
                mode.name === 'Mode 1' || 
                mode.name === 'Default' || 
                mode.name === 'Mode 2' ||
                mode.name === 'Mode 3' ||
                mode.name === 'Default Mode'
            );
            
            defaultModes.forEach(defaultMode => {
                try {
                    collection.removeMode(defaultMode.modeId);
                    console.log(`Removed default mode: ${defaultMode.name}`);
                } catch (modeError) {
                    console.log(`Could not remove default mode ${defaultMode.name}:`, modeError);
                }
            });
        } catch (removeError) {
            console.log('Could not remove default modes:', removeError);
        }
    }
    
    // Additional cleanup: Remove any default modes that might exist
    try {
        const defaultModes = collection.modes.filter(mode => 
            mode.name === 'Mode 1' || 
            mode.name === 'Default' || 
            mode.name === 'Mode 2' ||
            mode.name === 'Mode 3' ||
            mode.name === 'Default Mode'
        );
        
        defaultModes.forEach(defaultMode => {
            try {
                collection.removeMode(defaultMode.modeId);
                console.log(`Removed additional default mode: ${defaultMode.name}`);
            } catch (modeError) {
                console.log(`Could not remove additional default mode ${defaultMode.name}:`, modeError);
            }
        });
    } catch (cleanupError) {
        console.log('Could not perform additional default mode cleanup:', cleanupError);
    }
    
    // Create variables for each data type
    let variableNames = [
        'Full Team Name',
        'Logo', 
        'City',
        'Short Name',
        'TriCode',
        'Primary',
        'Secondary',
        'Early Record',
        'Mid Record',
        'Late Record'
    ];
    
    let variableTypes = ['STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'COLOR', 'COLOR', 'STRING', 'STRING', 'STRING'];
    
    // Add rank variable for NCAA Football
    if (leagueName === 'NCAA Football') {
        variableNames.push('Rank');
        variableTypes.push('STRING');
    }
    
    // Add additional variables for Tennis and Men's Golf
    if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
        variableNames.push('Rank');
        variableTypes.push('STRING');
        // tennis will use Points + Age; golf overrides below
        variableNames.push('Points');
        variableTypes.push('STRING');
        variableNames.push('Age');
        variableTypes.push('STRING');
    }

    // For Men's Golf, only create the relevant variables (remove logo/city/records/age from the schema)
    if (leagueName === 'Men\'s Golf') {
        variableNames = [
            'Full Team Name',
            'Country',
            'Short Name',
            'TriCode',
            'Primary',
            'Secondary',
            'Position',
            'Score',
            'Earnings'
        ];
        variableTypes = ['STRING', 'STRING', 'STRING', 'STRING', 'COLOR', 'COLOR', 'STRING', 'STRING', 'STRING'];
    }

    // For Tennis, limit to the fields shown in the screenshot
    if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis') {
        variableNames = [
            'Full Team Name',
            'Country',
            'Short Name',
            'TriCode',
            'Primary',
            'Secondary',
            'Rank',
            'Points',
            'Age'
        ];
        variableTypes = ['STRING', 'STRING', 'STRING', 'STRING', 'COLOR', 'COLOR', 'STRING', 'STRING', 'STRING'];
    }
    
    // Check if variables already exist in this specific collection
    const existingVariables = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === collection.id);
    const existingVariableNames = existingVariables.map(v => v.name);
    
    for (let i = 0; i < variableNames.length; i++) {
        if (!existingVariableNames.includes(variableNames[i])) {
            try {
                const var_ = figma.variables.createVariable(variableNames[i], collection.id, variableTypes[i]);
                
                // Set values for each team mode
                teams.forEach(team => {
                    try {
                        const modeId = teamModeIds[team.full_team_name];
                        if (modeId) {
                        // Set the appropriate value for this team
                        let value;
                        if (leagueName === 'Men\'s Golf') {
                            const field = variableNames[i];
                            if (field === 'Full Team Name') value = team.full_team_name;
                            else if (field === 'Country') value = team.country;
                            else if (field === 'Short Name') value = team.short_name;
                            else if (field === 'TriCode') value = team.tricode;
                            else if (field === 'Primary') value = team.primary_color;
                            else if (field === 'Secondary') value = team.secondary_color;
                            else if (field === 'Position') value = team.rank ? team.rank.toString() : 'NR';
                            else if (field === 'Score') value = team.score || '';
                            else if (field === 'Earnings') value = team.earnings || '0';
                        } else if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis') {
                            const field = variableNames[i];
                            if (field === 'Full Team Name') value = team.full_team_name;
                            else if (field === 'Country') value = team.country;
                            else if (field === 'Short Name') value = team.short_name;
                            else if (field === 'TriCode') value = team.tricode;
                            else if (field === 'Primary') value = team.primary_color;
                            else if (field === 'Secondary') value = team.secondary_color;
                            else if (field === 'Rank') value = team.rank ? team.rank.toString() : 'NR';
                            else if (field === 'Points') value = team.points ? String(team.points) : '0';
                            else if (field === 'Age') value = team.age ? String(team.age) : 'Unknown';
                        } else switch(i) {
                            case 0: value = team.full_team_name; break;
                            case 1: value = team.logo; break;
                            case 2: value = team.city; break;
                            case 3: value = team.short_name; break;
                            case 4: value = team.tricode; break;
                            case 5: value = team.primary_color; break;
                            case 6: value = team.secondary_color; break;
                            case 7: value = team.early_record || null; break;
                            case 8: value = team.mid_record || null; break;
                            case 9: value = team.late_record || null; break;
                            case 10: 
                                if (leagueName === 'NCAA Football') {
                                    value = team.rank ? team.rank.toString() : 'NR';
                                } else if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
                                    value = team.rank ? team.rank.toString() : 'NR';
                                } else {
                                    value = null;
                                }
                                break;
                            case 8:
                                if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
                                    value = team.average_points || null;
                                } else { value = null; }
                                break;
                            case 9:
                                if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
                                    value = team.total_points || null;
                                } else { value = null; }
                                break;
                            case 10:
                                if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
                                    value = team.events || null;
                                } else { value = null; }
                                break;
                            case 11:
                                if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
                                    value = team.points_lost || null;
                                } else { value = null; }
                                break;
                            case 12:
                                if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
                                    value = team.points_gained || null;
                                } else { value = null; }
                                break;
                            case 13:
                                if (leagueName === 'Men\'s Tennis' || leagueName === 'Women\'s Tennis' || leagueName === 'Men\'s Golf') {
                                    value = team.age ? team.age.toString() : 'Unknown';
                                } else { value = null; }
                                break;
                        }
                        
                        // Skip if value is null (for non-NCAA Football rank variable)
                        if (value === null) return;
                            
                            console.log(`Setting ${variableNames[i]} for ${team.full_team_name} to:`, value);
                            var_.setValueForMode(modeId, value);
                        }
                    } catch (valueError) {
                        console.log(`Error setting value for ${team.full_team_name}:`, valueError);
                    }
                });
                
                createdCount++;
            } catch (error) {
                console.log(`Variable ${variableNames[i]} already exists or error creating:`, error);
            }
        } else {
            console.log(`Variable ${variableNames[i]} already exists, skipping`);
        }
    }
    
    return createdCount;
}

// Process spreadsheet data into team objects
function processSpreadsheetData(data, columnMapping, ignoredColumns, ignoredRows) {
    const { headers, rows } = data;
    const processedData = [];
    
    // Filter out ignored columns
    const activeHeaders = headers.filter((_, index) => !ignoredColumns.has(index));
    const activeColumnMapping = {};
    
    // Update column mapping to only include active columns
    Object.keys(columnMapping).forEach(header => {
        const originalIndex = headers.indexOf(header);
        if (originalIndex !== -1 && !ignoredColumns.has(originalIndex)) {
            activeColumnMapping[header] = columnMapping[header];
        }
    });
    
    // Process each row
    rows.forEach((row, rowIndex) => {
        if (ignoredRows.has(rowIndex)) return;
        
        const team = {};
        let hasValidData = false;
        
        // Map each column to team properties
        Object.keys(activeColumnMapping).forEach(header => {
            const originalIndex = headers.indexOf(header);
            if (originalIndex !== -1 && row[originalIndex]) {
                const value = row[originalIndex].trim();
                if (value) {
                    const figmaField = activeColumnMapping[header];
                    team[figmaField] = value;
                    hasValidData = true;
                }
            }
        });
        
        // Only add if we have valid data
        if (hasValidData) {
            // Set default values for missing fields
            if (!team['Full Team Name']) team['Full Team Name'] = 'Unknown Team';
            if (!team['Headshot']) team['Headshot'] = team['Full Team Name'];
            if (!team['Country']) team['Country'] = 'Unknown';
            if (!team['Short Name']) {
                // Generate short name with first initial if not provided
                const nameParts = team['Full Team Name'].split(' ');
                team['Short Name'] = nameParts.length >= 2 ? 
                    `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : 
                    team['Full Team Name'];
            }
            if (!team['TriCode']) team['TriCode'] = 'UNK';
            
            // Process colors
            if (team['Primary Color']) {
                team['Primary Color'] = parseColor(team['Primary Color']);
            } else {
                team['Primary Color'] = { r: 0.5, g: 0.5, b: 0.5 };
            }
            
            if (team['Secondary Color']) {
                team['Secondary Color'] = parseColor(team['Secondary Color']);
            } else {
                team['Secondary Color'] = { r: 0.8, g: 0.8, b: 0.8 };
            }
            
            processedData.push(team);
        }
    });
    
    return processedData;
}

// Parse color string to RGB object
function parseColor(colorStr) {
    if (!colorStr) return { r: 0.5, g: 0.5, b: 0.5 };
    
    // Handle hex colors
    if (colorStr.startsWith('#')) {
        return hexToRgb(colorStr);
    }
    
    // Handle rgb() format
    const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]) / 255,
            g: parseInt(rgbMatch[2]) / 255,
            b: parseInt(rgbMatch[3]) / 255
        };
    }
    
    // Handle named colors (basic set)
    const namedColors = {
        'red': { r: 1, g: 0, b: 0 },
        'green': { r: 0, g: 1, b: 0 },
        'blue': { r: 0, g: 0, b: 1 },
        'white': { r: 1, g: 1, b: 1 },
        'black': { r: 0, g: 0, b: 0 },
        'yellow': { r: 1, g: 1, b: 0 },
        'orange': { r: 1, g: 0.5, b: 0 },
        'purple': { r: 0.5, g: 0, b: 0.5 }
    };
    
    const lowerColor = colorStr.toLowerCase();
    if (namedColors[lowerColor]) {
        return namedColors[lowerColor];
    }
    
    // Default fallback
    return { r: 0.5, g: 0.5, b: 0.5 };
}

// Create collection from spreadsheet data
async function createSpreadsheetCollection(teams, collectionName) {
    let createdCount = 0;
    
    // Create or get collection
    let collection;
    const existingCollections = figma.variables.getLocalVariableCollections();
    const existingCollection = existingCollections.find(c => c.name === collectionName);
    
    if (existingCollection) {
        collection = existingCollection;
        console.log(`Using existing ${collectionName} collection`);
    } else {
        collection = figma.variables.createVariableCollection(collectionName);
        console.log(`Created new ${collectionName} collection`);
    }
    
    // Create team modes
    const teamModeIds = {};
    teams.forEach(team => {
        try {
            const modeName = team['Full Team Name'] || `Team ${createdCount + 1}`;
            const existingMode = collection.modes.find(mode => mode.name === modeName);
            let modeId = existingMode ? existingMode.modeId : null;
            
            if (!modeId) {
                modeId = collection.addMode(modeName);
                console.log(`Created mode for ${modeName}`);
            }
            
            teamModeIds[modeName] = modeId;
        } catch (modeError) {
            console.log(`Error creating mode for team:`, modeError);
        }
    });
    
    // Remove default empty mode if it exists
    if (collection.modes.length > teams.length) {
        try {
            // Find and remove default modes (Mode 1, Default, etc.)
            const defaultModes = collection.modes.filter(mode => 
                mode.name === 'Mode 1' || 
                mode.name === 'Default' || 
                mode.name === 'Mode 2' ||
                mode.name === 'Mode 3' ||
                mode.name === 'Default Mode'
            );
            
            defaultModes.forEach(defaultMode => {
                try {
                    collection.removeMode(defaultMode.modeId);
                    console.log(`Removed default mode: ${defaultMode.name}`);
                } catch (modeError) {
                    console.log(`Could not remove default mode ${defaultMode.name}:`, modeError);
                }
            });
        } catch (removeError) {
            console.log('Could not remove default modes:', removeError);
        }
    }

    
    // Create variables for each field
    const fieldNames = [
        'Full Team Name',
        'Logo',
        'City',
        'Short Name',
        'TriCode',
        'Primary Color',
        'Secondary Color',
        'Early Record',
        'Mid Record',
        'Late Record',
        'Rank'
    ];
    
    const fieldTypes = ['STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'COLOR', 'COLOR', 'STRING', 'STRING', 'STRING', 'STRING'];
    
    // Check existing variables
    const existingVariables = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === collection.id);
    const existingVariableNames = existingVariables.map(v => v.name);
    
    for (let i = 0; i < fieldNames.length; i++) {
        if (!existingVariableNames.includes(fieldNames[i])) {
            try {
                const var_ = figma.variables.createVariable(fieldNames[i], collection.id, fieldTypes[i]);
                
                // Set values for each team mode
                teams.forEach(team => {
                    try {
                        const modeName = team['Full Team Name'] || `Team ${teams.indexOf(team) + 1}`;
                        const modeId = teamModeIds[modeName];
                        if (modeId) {
                            const value = team[fieldNames[i]];
                            if (value !== undefined) {
                                console.log(`Setting ${fieldNames[i]} for ${modeName} to:`, value);
                                var_.setValueForMode(modeId, value);
                            }
                        }
                    } catch (valueError) {
                        console.log(`Error setting value for team:`, valueError);
                    }
                });
                
                createdCount++;
            } catch (error) {
                console.log(`Variable ${fieldNames[i]} already exists or error creating:`, error);
            }
        } else {
            console.log(`Variable ${fieldNames[i]} already exists, skipping`);
        }
    }

    
    return createdCount;
}

// Show the UI
figma.showUI(__html__, { 
  width: 600, 
  height: 600,
  themeColors: true
});

// Pending UI fetch promises map
const pendingUIFetches = new Map();

// Helper: fetch via UI (browser context) to avoid CORS issues
function fetchFromUI(url) {
    return new Promise((resolve, reject) => {
        try {
            const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            pendingUIFetches.set(requestId, { resolve, reject });
            figma.ui.postMessage({ type: 'fetch-request', requestId, url });
            // Timeout fallback
            setTimeout(() => {
                if (pendingUIFetches.has(requestId)) {
                    pendingUIFetches.delete(requestId);
                    reject(new Error('UI fetch timeout'));
                }
            }, 15000);
        } catch (e) {
            reject(e);
        }
    });
}

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
    // Resolve UI fetches first
    if (msg.type === 'fetch-response' && msg.requestId) {
        const pending = pendingUIFetches.get(msg.requestId);
        if (pending) {
            pendingUIFetches.delete(msg.requestId);
            if (msg.error) pending.reject(new Error(msg.error));
            else pending.resolve(msg.data);
        }
        return;
    }
    if (msg.type === 'get-collections') {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        figma.ui.postMessage({ 
            type: 'collections-loaded', 
            collections: collections.map(c => ({ id: c.id, name: c.name }))
        });
    } else if (msg.type === 'fetch-sports-data') {
        try {
            console.log("Received fetch-sports-data message:", msg);
            
            const selectedSports = msg.selectedSports;
            let allTeams = [];
            
            let totalCreatedCount = 0;
            
            // Process NBA data
            if (selectedSports.includes('NBA')) {
                try {
                    console.log('Fetching NBA data...');
                    const nbaTeams = await fetchNBAData();
                    console.log(`Fetched ${nbaTeams.length} NBA teams`);
                    
                    if (nbaTeams.length === 0) {
                        console.error('No NBA teams returned from API');
                        figma.notify('No NBA teams found', { error: true });
                    }
                    
                    // Create or get NBA collection with team modes
                    const createdCount = await createTeamModesCollection(nbaTeams, 'NBA');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NBA variables with team modes`);
                } catch (nbaError) {
                    console.error('Error processing NBA data:', nbaError);
                    figma.notify('Error processing NBA data: ' + nbaError.message, { error: true });
                }
            }
            
            // Process NFL data
            if (selectedSports.includes('NFL')) {
                try {
                    console.log('Fetching NFL data...');
                    const nflTeams = await fetchNFLData();
                    console.log(`Fetched ${nflTeams.length} NFL teams`);
                    
                    if (nflTeams.length === 0) {
                        console.error('No NFL teams returned from API');
                        figma.notify('No NFL teams found', { error: true });
                    }
                    
                    // Create or get NFL collection with team modes
                    const createdCount = await createTeamModesCollection(nflTeams, 'NFL');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NFL variables with team modes`);
                } catch (nflError) {
                    console.error('Error processing NFL data:', nflError);
                    figma.notify('Error processing NFL data: ' + nflError.message, { error: true });
                }
            }
            
            // Process MLB data
            if (selectedSports.includes('MLB')) {
                try {
                    console.log('Fetching MLB data...');
                    const mlbTeams = await fetchMLBData();
                    console.log(`Fetched ${mlbTeams.length} MLB teams`);
                    
                    if (mlbTeams.length === 0) {
                        console.error('No MLB teams returned from API');
                        figma.notify('No MLB teams found', { error: true });
                    }
                    
                    // Create or get MLB collection with team modes
                    const createdCount = await createTeamModesCollection(mlbTeams, 'MLB');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} MLB variables with team modes`);
                } catch (mlbError) {
                    console.error('Error processing MLB data:', mlbError);
                    figma.notify('Error processing MLB data: ' + mlbError.message, { error: true });
                }
            }
            
            // Process NHL data
            if (selectedSports.includes('NHL')) {
                try {
                    console.log('Fetching NHL data...');
                    const nhlTeams = await fetchNHLData();
                    console.log(`Fetched ${nhlTeams.length} NHL teams`);
                    
                    if (nhlTeams.length === 0) {
                        console.error('No NHL teams returned from API');
                        figma.notify('No NHL teams found', { error: true });
                    }
                    
                    // Create or get NHL collection with team modes
                    const createdCount = await createTeamModesCollection(nhlTeams, 'NHL');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NHL variables with team modes`);
                } catch (nhlError) {
                    console.error('Error processing NHL data:', nhlError);
                    figma.notify('Error processing NHL data: ' + nhlError.message, { error: true });
                }
            }
            
            // Process WNBA data
            if (selectedSports.includes('WNBA')) {
                try {
                    console.log('Fetching WNBA data...');
                    const wnbaTeams = await fetchWNBAData();
                    console.log(`Fetched ${wnbaTeams.length} WNBA teams`);
                    
                    if (wnbaTeams.length === 0) {
                        console.error('No WNBA teams returned from API');
                        figma.notify('No WNBA teams found', { error: true });
                    }
                    
                    // Create or get WNBA collection with team modes
                    const createdCount = await createTeamModesCollection(wnbaTeams, 'WNBA');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} WNBA variables with team modes`);
                } catch (wnbaError) {
                    console.error('Error processing WNBA data:', wnbaError);
                    figma.notify('Error processing WNBA data: ' + wnbaError.message, { error: true });
                }
            }
            
            // Process NCAA Football data
            if (selectedSports.includes('NCAA Football')) {
                try {
                    console.log('Fetching NCAA Football data...');
                    const ncaaTeams = await fetchNCAAData();
                    console.log(`Fetched ${ncaaTeams.length} NCAA Football teams`);
                    
                    if (ncaaTeams.length === 0) {
                        console.error('No NCAA Football teams returned from API');
                        figma.notify('No NCAA Football teams found', { error: true });
                    }
                    
                    // Create or get NCAA Football collection with team modes
                    const createdCount = await createTeamModesCollection(ncaaTeams, 'NCAA Football');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NCAA Football variables with team modes`);
                } catch (ncaaError) {
                    console.error('Error processing NCAA Football data:', ncaaError);
                    figma.notify('Error processing NCAA Football data: ' + ncaaError.message, { error: true });
                }
            }
            
            // Process Men's Tennis data
            if (selectedSports.includes('Men\'s Tennis')) {
                try {
                    console.log('Fetching Men\'s Tennis data...');
                    const mensTennisPlayers = await fetchMensTennisData();
                    console.log(`Fetched ${mensTennisPlayers.length} Men\'s Tennis players`);
                    
                    if (mensTennisPlayers.length === 0) {
                        console.error('No Men\'s Tennis players returned from API');
                        figma.notify('No Men\'s Tennis players found', { error: true });
                    }
                    
                    // Create or get Men's Tennis collection with player modes
                    const createdCount = await createTeamModesCollection(mensTennisPlayers, 'Men\'s Tennis');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} Men\'s Tennis variables with player modes`);
                } catch (mensTennisError) {
                    console.error('Error processing Men\'s Tennis data:', mensTennisError);
                    figma.notify('Error processing Men\'s Tennis data: ' + mensTennisError.message, { error: true });
                }
            }
            
            // Process Men's Golf data
            if (selectedSports.includes('Men\'s Golf')) {
                try {
                    console.log('Fetching Men\'s Golf data...');
                    const mensGolfPlayers = await fetchMensGolfData();
                    console.log(`Fetched ${mensGolfPlayers.length} Men\'s Golf players`);
                    
                    if (mensGolfPlayers.length === 0) {
                        console.error('No Men\'s Golf players returned from API');
                        figma.notify('No Men\'s Golf players found', { error: true });
                    }
                    
                    const createdCount = await createTeamModesCollection(mensGolfPlayers, 'Men\'s Golf');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} Men\'s Golf variables with player modes`);
                } catch (mensGolfError) {
                    console.error('Error processing Men\'s Golf data:', mensGolfError);
                    figma.notify('Error processing Men\'s Golf data: ' + mensGolfError.message, { error: true });
                }
            }

            // Process Women's Tennis data
            if (selectedSports.includes('Women\'s Tennis')) {
                try {
                    console.log('Fetching Women\'s Tennis data...');
                    const womensTennisPlayers = await fetchWomensTennisData();
                    console.log(`Fetched ${womensTennisPlayers.length} Women\'s Tennis players`);
                    
                    if (womensTennisPlayers.length === 0) {
                        console.error('No Women\'s Tennis players returned from API');
                        figma.notify('No Women\'s Tennis players found', { error: true });
                    }
                    
                    // Create or get Women's Tennis collection with player modes
                    const createdCount = await createTeamModesCollection(womensTennisPlayers, 'Women\'s Tennis');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} Women\'s Tennis variables with player modes`);
                } catch (womensTennisError) {
                    console.error('Error processing Women\'s Tennis data:', womensTennisError);
                    figma.notify('Error processing Women\'s Tennis data: ' + womensTennisError.message, { error: true });
                }
            }
            figma.notify(`Successfully created ${totalCreatedCount} new variables!`);
            
            figma.ui.postMessage({ 
                type: 'sports-data-fetched', 
                results: [{ sport: 'NBA', success: true, teamCount: allTeams.length }]
            });
        } catch (e) {
            console.error("Error in fetch-sports-data handler:", e);
            figma.notify('Error processing sports data: ' + e.message, { error: true });
            figma.ui.postMessage({ 
                type: 'sports-data-error', 
                message: 'Error processing sports data: ' + e.message
            });
        }
    } else if (msg.type === 'duplicate-collection') {
        try {
            const collectionId = msg.collectionId;
            const newName = msg.newName;
            
            // Get the collection to duplicate
            const collections = figma.variables.getLocalVariableCollections();
            const sourceCollection = collections.find(c => c.id === collectionId);
            
            if (!sourceCollection) {
                figma.notify('Collection not found', { error: true });
                return;
            }
            
            // Create new collection name
            const finalName = newName || `${sourceCollection.name} (Copy)`;
            
            // Create new collection
            const newCollection = figma.variables.createVariableCollection(finalName);
            
            // Copy all modes from source collection
            const modeMap = {};
            sourceCollection.modes.forEach(mode => {
                if (mode.name !== 'Default' && mode.name !== 'Mode 1') {
                    const newModeId = newCollection.addMode(mode.name);
                    modeMap[mode.modeId] = newModeId;
                }
            });
            
            // Remove the default empty mode if it exists and we have team modes
            if (newCollection.modes.length > 1) {
                try {
                    // Find and remove default modes (Mode 1, Default, etc.)
                    const defaultModes = newCollection.modes.filter(mode => 
                        mode.name === 'Mode 1' || 
                        mode.name === 'Default' || 
                        mode.name === 'Mode 2' ||
                        mode.name === 'Mode 3' ||
                        mode.name === 'Default Mode'
                    );
                    
                    defaultModes.forEach(defaultMode => {
                        try {
                            newCollection.removeMode(defaultMode.modeId);
                            console.log(`Removed default mode from duplicated collection: ${defaultMode.name}`);
                        } catch (modeError) {
                            console.log(`Could not remove default mode ${defaultMode.name} from duplicated collection:`, modeError);
                        }
                    });
                } catch (removeError) {
                    console.log('Could not remove default modes from duplicated collection:', removeError);
                }
            }
            
            // Copy all variables from source collection
            const sourceVariables = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === sourceCollection.id);
            
            sourceVariables.forEach(sourceVar => {
                // Create new variable
                const newVar = figma.variables.createVariable(sourceVar.name, newCollection.id, sourceVar.resolvedType);
                
                // Copy values for each mode
                sourceCollection.modes.forEach(mode => {
                    if (modeMap[mode.modeId]) {
                        try {
                            const value = sourceVar.valuesByMode[mode.modeId];
                            if (value !== undefined) {
                                newVar.setValueForMode(modeMap[mode.modeId], value);
                            }
                        } catch (error) {
                            console.log(`Error copying value for ${sourceVar.name} in mode ${mode.name}:`, error);
                        }
                    }
                });
            });
            
            figma.notify(`Successfully duplicated collection "${sourceCollection.name}" as "${finalName}"`);
            
            // Refresh collections list
            figma.ui.postMessage({
                type: 'refresh-collections'
            });
            
        } catch (error) {
            console.error('Error duplicating collection:', error);
            figma.notify('Error duplicating collection: ' + error.message, { error: true });
        }
    } else if (msg.type === 'import-spreadsheet') {
        try {
            const { collectionName, data, columnMapping, ignoredColumns, ignoredRows } = msg;
            
            console.log('Importing spreadsheet:', { collectionName, data, columnMapping });
            
            // Process the spreadsheet data
            const processedData = processSpreadsheetData(data, columnMapping, ignoredColumns, ignoredRows);
            
            if (processedData.length === 0) {
                figma.notify('No valid data found to import', { error: true });
                return;
            }
            
            // Create collection with team modes
            const createdCount = await createSpreadsheetCollection(processedData, collectionName);
            
            figma.notify(`Successfully imported ${createdCount} variables from spreadsheet!`);
            
            figma.ui.postMessage({
                type: 'spreadsheet-import-success',
                created: createdCount
            });
            
        } catch (error) {
            console.error('Error importing spreadsheet:', error);
            figma.notify('Error importing spreadsheet: ' + error.message, { error: true });
            figma.ui.postMessage({
                type: 'spreadsheet-import-error',
                message: error.message
            });
        }
    } else if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
