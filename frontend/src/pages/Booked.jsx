import React, { useMemo, useState } from "react";
import {
  Stethoscope,
  Search,
  ShieldCheck,
  Video,
  Clock3,
  Send,
  MapPin,
  Star,
  Phone,
  ExternalLink,
  CalendarCheck,
} from "lucide-react";


const doctors = [
  {
    name: "Anand Animal Helpline (Veterinary Hospital)",
    area: "Anand Town, Anand, Gujarat",
    rating: "5.0",
    reviews: "3634",
    address:
      "Anand-Sojitra Road, Temple, opp. Valasan, Anand, Gujarat 388325, India",
    phone: "09537778000",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJrZSQhPVRXjkR1cE-eD8ep0c",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "MedRec Hospital Jehanabad",
    area: "Kurtha-side, Jehanabad, Bihar",
    rating: "5.0",
    reviews: "1727",
    address:
      "Gaya - Patna Main Rd, near DM Residence, next to Nutan Honda Showroom, Jehanabad, Bihar 804408, India",
    phone: "09801879584",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ7QXqsCy18jkRLrjjfaOE32s",
    site: "https://medrechospital.com/",
    videoPrice: 399,
    clinicPrice: 549,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Poojan hospital",
    area: "Kheda, Kheda, Gujarat",
    rating: "5.0",
    reviews: "940",
    address:
      "Chitrakoot society, Mahudha road Mahemdawad, Dist, Kheda, Mahemdavad, Gujarat 387130, India",
    phone: "09408693181",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJbQW2-GJhXjkRNtmOG_gyBq4",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Pruthhviraj Pet shop Gulbarga, Puppy sale, Bird food, Cat food, Fish food, Aquarium, Aquatic plants.",
    area: "State Bank Colony, Kalaburagi, Karnataka",
    rating: "5.0",
    reviews: "916",
    address:
      "Dharshan Plaza, PNT Auto stand, Old Jewargi Rd, beside New Reliance Digital, State Bank Colony, Kalaburagi, Karnataka 585102, India",
    phone: "09663418565",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ_yCZcGy_yDsR4Nv7colbkeY",
    site: "https://youtube.com/user/pruthviraj9",
    videoPrice: 299,
    clinicPrice: 499,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Chinsu Pet Shop",
    area: "State Bank Colony, Kalaburagi, Karnataka",
    rating: "5.0",
    reviews: "811",
    address:
      "Opposite ZUDIO, Old Jewargi Rd, State Bank Colony, Kalaburagi, Karnataka 585102, India",
    phone: "09663418565",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJMXXZzse_yDsRk-94954JIzs",
    site: "https://youtu.be/EBYRHVcUbgk",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Shree Durga Medicals & Pet Shop",
    area: "P.J. Extension, Davanagere, Karnataka",
    rating: "5.0",
    reviews: "777",
    address:
      "Veterinary Hospital Complex, Hondada Cir Rd, near Fish Market, Davangere, Karnataka 577002, India",
    phone: "07019094691",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJV5aezX0lujsRGlI1m4W8N3I",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Sri Santhoshi vet and pet agencies",
    area: "Boyapally, Mahbubnagar, Telangana",
    rating: "5.0",
    reviews: "729",
    address:
      "D. No. 23, Prem Raj, Bus Stand, 121/1, Hospital Road, near RTC Complex, Madhura Nagar, Shamshabad, Hyderabad, Telangana 501218, India",
    phone: "09849814732",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJq7rh_yC8yzsR0wqmP9lVXAk",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "The Pet Specialist",
    area: "Wakad, Pune, Maharashtra",
    rating: "5.0",
    reviews: "637",
    address:
      "Shop No 5, The Avenue, Hinjawadi Phase II, Rajiv Gandhi Infotech Park, Pune, Maharashtra 411057, India",
    phone: "09665371396",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJq1evqTG7wjsRTA7v9GCgirA",
    site: "https://zenve.in/N/a",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Sahil The Pet King",
    area: "Danta Ramgarh-side, Neem Ka Thana, Rajasthan",
    rating: "5.0",
    reviews: "623",
    address:
      "Unnamed Road, Shivsinghpura, Sikar, Rajasthan 332001, India",
    phone: "09521210800",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJj3ENHh27bDkRr3QEmElhGbg",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Pet Clinic / Pet Doctor / Pet Shop / Veterinarian / Vet Doctor / Dog Hostel",
    area: "Sikar City, Sikar, Rajasthan",
    rating: "5.0",
    reviews: "614",
    address:
      "Garhwal Bhawan, Vishwanath Mandir Marg, Anand Nagar, Sikar, Rajasthan 332001, India",
    phone: "09549663866",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJWcshBsekbDkRDqiJGMndI84",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Petmax Pet Clinic",
    area: "Hosakote, Bengaluru Rural, Karnataka",
    rating: "5.0",
    reviews: "558",
    address:
      "Maruthi Vet Pharma, Mayura Arts, College Rd, opposite to Ayyappa Swamy Temple, M V Extension, Hoskote, Karnataka 562114, India",
    phone: "09019942422",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJBfy1lMwFrjsRbN1W8dj5NgQ",
    site: "https://petmax-pet-clinic.grexa.site/",
    videoPrice: 299,
    clinicPrice: 499,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "DOG & CAT CARE HOSPITAL, Dr.MITHUN KHATARIYA",
    area: "Moti Baug, Junagadh, Gujarat",
    rating: "5.0",
    reviews: "556",
    address:
      "Oppo. 2nd Gate of Agriculture University, Motibag, Gunatit Nagar, Moti Baug, Kalva Chok, Junagadh, Gujarat 362001, India",
    phone: "09327538035",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJF19L9IwBWDkRsZDBZ_TPBzs",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "JP Pet Clinic",
    area: "Golf Course Road, Gurugram, Haryana",
    rating: "5.0",
    reviews: "543",
    address:
      "Opp DPS-84 Rao, Atar Singh Chowk, Sikanderpur Sector 85 Rd, Gurugram, Haryana 122012, India",
    phone: "08788898211",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJA7Lhs7c9DTkRLXeg_LqVV6k",
    site: "http://jppetclinic.info/",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "MOKSHITHA PET CLINIC | Dr Balu Naik",
    area: "Markapur, Prakasam, Andhra Pradesh",
    rating: "5.0",
    reviews: "541",
    address:
      "Madhavi grand street opposite New Sita Rama Sastry Hospital, Markapur, Andhra Pradesh 523316, India",
    phone: "06304029486",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJrTLZLOoxtTsRcrRTuhs_4SM",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Dr. Navi's Veterinary Clinic",
    area: "Palayam, Kozhikode, Kerala",
    rating: "5.0",
    reviews: "513",
    address:
      "13/5, post, Indira Nagar, Periyar Nagar, Nehru Nagar West, Kalapatti, Coimbatore, Tamil Nadu 641048, India",
    phone: "06381414845",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJb50rnb1XqDsRvFUogwphHf4",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Max Pet Hospital",
    area: "Ayodhya Bypass, Bhopal, Madhya Pradesh",
    rating: "5.0",
    reviews: "483",
    address:
      "Bargaon Police chauki, near Kamal Motor, Avas Vikas Colony, Khaira, Gonda, Uttar Pradesh 271002, India",
    phone: "09182346713",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJQVn4AjjvmTkRpUuWwakK86s",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Panacea Pet Clinic",
    area: "Ateli-side, Mahendragarh, Rajasthan",
    rating: "5.0",
    reviews: "477",
    address:
      "G-83, Shri Ram Plaza, Neemrana, Rajasthan 301705, India",
    phone: "08000852900",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJUcc3S49VbTkRxu_-3YqQhhk",
    site: "",
    videoPrice: 299,
    clinicPrice: 499,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Super Vetz Multispeciality Veterinary Hospital & Doorstep Expert Veterinary Care",
    area: "Karyavattom, Thiruvananthapuram, Kerala",
    rating: "5.0",
    reviews: "477",
    address:
      "SK das tower, Menalloor, Karyavattom, Thiruvananthapuram, Kerala 695581, India",
    phone: "08139870187",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJT7RLp9u9BTsRVwizknCJrts",
    site: "https://supervetz.in/",
    videoPrice: 399,
    clinicPrice: 699,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Vet Meds - Vet Pharmacy & Pet Zone",
    area: "Gaddavaram, Gannavaram, Andhra Pradesh",
    rating: "5.0",
    reviews: "467",
    address:
      "Opp Veterinary Hospital Old Buddavaram Road, Gannavaram, Andhra Pradesh 521101, India",
    phone: "08500849789",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJl3vNcXrjNToRTqB-gY3AkCg",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Kitmeer Pet Clinic & Diagnostic Centre Best pet clinic in baroda",
    area: "Alkapuri, Vadodara, Gujarat",
    rating: "5.0",
    reviews: "466",
    address:
      "Siddhartha Excellence, Shop no.17-18, C-Wing, D mart Mall, opp. Vasna Road, Tandalja, Vadodara, Gujarat 390007, India",
    phone: "08536853685",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJPRpHqjDHXzkRKQfdCTgUWB0",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Sharma's petcare hospital Pratapnagar",
    area: "Jagatpura, Jaipur, Rajasthan",
    rating: "5.0",
    reviews: "437",
    address:
      "NRI Cir, Sector 17, Pratap Nagar, Jaipur, Rajasthan 302033, India",
    phone: "09257484906",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ66h4hSfJbTkR_7qfz0lezgs",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Sneh Pet Store & Spa",
    area: "Prahlad Nagar, Ahmedabad, Gujarat",
    rating: "5.0",
    reviews: "437",
    address:
      "103, Trinity Complex, Hebatpur Rd, Thaltej, Ahmedabad, Gujarat 380059, India",
    phone: "09227261188",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJu7IHGfSdXjkRQnQ3yEd3e84",
    site: "",
    videoPrice: 299,
    clinicPrice: 499,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Sanjeevni Dog Health Care Narsinghpur",
    area: "Narsinghpur, Madhya Pradesh",
    rating: "5.0",
    reviews: "435",
    address:
      "Street No. 1, Main Rd, Dhanare Colony, Narsinghpur, Madhya Pradesh 487001, India",
    phone: "07999084183",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJO3ec-hidfzkRzQqZoU65EDg",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Bhanwar Pet Hospital",
    area: "Vidyadhar Nagar, Jaipur, Rajasthan",
    rating: "5.0",
    reviews: "434",
    address:
      "S-31, Niwaru Rd, near Chohan Hospital, Jhotwara, Jaipur, Rajasthan 302012, India",
    phone: "09460113674",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJLzqkosuzbTkRnpNUvBflYJk",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Samast Mahajan",
    area: "Prahlad Nagar, Ahmedabad, Gujarat",
    rating: "5.0",
    reviews: "429",
    address:
      "B/108, Sun West Bank, Nr. Vallabh Sadan, Ashram Rd, Ahmedabad, Gujarat 380009, India",
    phone: "09930380976",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJef_Z51-EXjkR9MJb6GOlvCU",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Pet & Vet Care Clinic.",
    area: "Model Town, Bhiwani, Haryana",
    rating: "5.0",
    reviews: "412",
    address:
      "Shop No 1 Jhadu Singh Phogat Chowk, Charkhi Dadri, Haryana 127306, India",
    phone: "09034498433",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJhfo11uqFEjkRd89b36JryZE",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Vetvantage pet clinic",
    area: "Dehradun Road, Saharanpur, Uttar Pradesh",
    rating: "5.0",
    reviews: "384",
    address:
      "No. 3, 151/6 Lane, Rajpur Rd, Doon Vihar, Jakhan, Dehradun, Uttarakhand 248003, India",
    phone: "08476095548",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJDQAFIdLXCDkR5Ipf3j_RtiM",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Vet Buddy- Your Pet's Trusted Care Partner",
    area: "Kankarbagh, Patna, Bihar",
    rating: "5.0",
    reviews: "362",
    address:
      "R3, Jagat Vihar Colony, Rukanpura, Patna, Bihar 800025, India",
    phone: "08873004339",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJqfAhcMlX7TkRX3sqhmSbDLI",
    site: "https://vetbuddyindia.com/",
    videoPrice: 299,
    clinicPrice: 499,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Atozpetgrooming, DOG Hostel, Dog Training",
    area: "Dargamitta, Nellore, Andhra Pradesh",
    rating: "5.0",
    reviews: "348",
    address:
      "Bujabuja Nellore, Samata Nagar, Nellore Rural, Andhra Pradesh 524004, India",
    phone: "08639647945",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJPfIh4THzTDoReceKTi2eiHI",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Balotra pet clinic (animal hospital)",
    area: "Jaisalmer Road, Barmer, Rajasthan",
    rating: "5.0",
    reviews: "339",
    address: "Nehru Colony, Balotra, Rajasthan 344022, India",
    phone: "08387091288",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJV0lYKwDpQzkR9_cAESt8WAM",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "KUMAR PET CARE",
    area: "Shuklaganj, Unnao, Uttar Pradesh",
    rating: "5.0",
    reviews: "332",
    address:
      "Dayalkheda, Magarwara Industrial Area, Magarwara, Uttar Pradesh 209862, India",
    phone: "08299455589",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJm9cnoMI_nDkRrzK_hBBq-PE",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Vinshi Elite Pet Clinic Guntur",
    area: "Arundelpet, Guntur, Andhra Pradesh",
    rating: "5.0",
    reviews: "325",
    address:
      "Opp. Sri Vidhya High School, NGO Colony, Nallapadu Rural, Andhra Pradesh 522004, India",
    phone: "08501815182",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJVbpCXwB1SjoRAAmX4p8IiVE",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Royal Cure & Care Pet Clinic, gorakhpur",
    area: "Golghar, Gorakhpur, Uttar Pradesh",
    rating: "5.0",
    reviews: "324",
    address:
      "Rajendra Nagar near Chandra petrol pump, Gorakhpur, Uttar Pradesh 273015, India",
    phone: "09695723799",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJNY2iR_9FkTkRsgiLi_Vq6pg",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Blue Coat Vet – Pet Clinic in Sushant Lok",
    area: "DLF Phase 1-5, Gurugram, Haryana",
    rating: "5.0",
    reviews: "281",
    address:
      "C-1532, Vyapar Kendra Rd, Block C, Sushant Lok Phase I, Gurugram, Haryana 122002, India",
    phone: "07389891754",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJd74slVgZDTkRcOu7-OS6Pss",
    site: "https://bluecoatvet.com/",
    videoPrice: 399,
    clinicPrice: 699,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Snake Catcher Team Durg Bhilai",
    area: "Civic Centre, Bhilai, Chhattisgarh",
    rating: "5.0",
    reviews: "280",
    address:
      "Post Office, State Bank Colony, Sector 6, Durg, Bhilai, Chhattisgarh 490006, India",
    phone: "07389386534",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJXz5BdsIjKToRpn0nFY066Xc",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Pet's Paradise Clinic",
    area: "Sikar City, Sikar, Rajasthan",
    rating: "5.0",
    reviews: "276",
    address: "Tilak Nagar, Sikar, Rajasthan 332001, India",
    phone: "09610838824",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJJZ1BHQClbDkR706yioCcU0E",
    site: "",
    videoPrice: 299,
    clinicPrice: 499,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Phoenix Pet Hospital",
    area: "Gachibowli, Hyderabad, Telangana",
    rating: "5.0",
    reviews: "272",
    address:
      "My Home Mangala Rd, Kondapur, KMR Estates, Hafeezpet, Hyderabad, Telangana 500084, India",
    phone: "08885149333",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ2zSjByaTyzsR_r-aemvLIU4",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Sharma's petcare hospital, Bajaj nagar",
    area: "C-Scheme, Jaipur, Rajasthan",
    rating: "5.0",
    reviews: "257",
    address:
      "Kendriya Vidyalaya No.1, Bajaj Nagar, Jaipur, Rajasthan 302015, India",
    phone: "07737484906",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJy1w7TWK1bTkRFJfRO5dQ4Is",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Vet. B. R. Boss Veterinarian",
    area: "Sardarpura, Jodhpur, Rajasthan",
    rating: "5.0",
    reviews: "254",
    address:
      "18/710, Sector 18, Chopasni Housing Board, Jodhpur, Rajasthan 342008, India",
    phone: "09588241864",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJz0cjYdiPQTkRtmn3dKr48Zo",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "B2Vet Pet Hospital",
    area: "Gajuwaka, Visakhapatnam, Andhra Pradesh",
    rating: "5.0",
    reviews: "250",
    address:
      "10-9-51/1, opposite Simhagiri Hospital, New Gajuwaka, Visakhapatnam, Andhra Pradesh 530026, India",
    phone: "09398317032",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJJQ95uwtpOToROwbjeDlRogY",
    site: "https://b2vetpetclinic.netlify.app/",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Haycho pet shop & clinic",
    area: "Vinoba Nagar, Shivamogga, Karnataka",
    rating: "5.0",
    reviews: "246",
    address:
      "Kariyanna Building, Bus Stop, 100 Feet Rd, Adarsh Layout, Vinoba Nagara, Shivamogga, Karnataka 577204, India",
    phone: "06362592023",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJtaCxQ9WvuzsRcKmLQUurypU",
    site: "",
    videoPrice: 299,
    clinicPrice: 499,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Tommy Pet Clinic",
    area: "Namakkal Town, Namakkal, Tamil Nadu",
    rating: "5.0",
    reviews: "242",
    address:
      "278 MA1 Savadi Street, St 2, opposite to playground, Anbu Nagar, Namakkal, Tamil Nadu 637405, India",
    phone: "09047012200",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ4UgwEEjPqzsRPDKZSjQxV8c",
    site: "",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "The Vet Buddy",
    area: "Telipara, Bilaspur, Chhattisgarh",
    rating: "5.0",
    reviews: "237",
    address:
      "Pet's Hub, Brij Vihar Nagar, Shakti Chowk, Rajkishore Nagar, Bilaspur, Chhattisgarh 495006, India",
    phone: "08770391314",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJDwvKxY4LKDoRxAej2f4CO5g",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "Little Paws Pet Clinic (Dr.Sona P.S)",
    area: "Chala, Kannur, Kerala",
    rating: "5.0",
    reviews: "237",
    address: "Koyyode Road, Chala, Kerala 670621, India",
    phone: "09400033113",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ2bjn4duu8CkRs-CHXJrfdzY",
    site: "https://www.littlepawspetclinic.com/",
    videoPrice: 349,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },

  {
    name: "TANVIKA PETS & MEDICAL",
    area: "Ramanathapuram, Ramanathapuram, Tamil Nadu",
    rating: "5.0",
    reviews: "234",
    address:
      "OM SHATHI NAGAR, VINAYAGAR KOVIL, NO.6/761_9, Ramanathapuram, Tamil Nadu 623504, India",
    phone: "09894905622",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ3Qb_4zSXATsRZaEEtQMS_bs",
    site: "",
    videoPrice: 399,
    clinicPrice: 599,
    verified: true,
    videoAvailable: true,
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Booked = () => {
  const [search, setSearch] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [videoOnly, setVideoOnly] = useState(false);

  /* =======================================================
     GET STATE & CITY
  ======================================================= */

  const getLocationParts = (area = "") => {
    const parts = area
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    return {
      city: parts.length >= 2 ? parts[parts.length - 2] : "",
      state: parts.length >= 1 ? parts[parts.length - 1] : "",
    };
  };

  /* =======================================================
     STATES
  ======================================================= */

  const states = useMemo(() => {
    return [
      ...new Set(
        doctors
          .map((doctor) => getLocationParts(doctor.area).state)
          .filter(Boolean)
      ),
    ].sort();
  }, []);

  /* =======================================================
     CITIES
  ======================================================= */

  const cities = useMemo(() => {
    return [
      ...new Set(
        doctors
          .filter((doctor) => {
            if (!selectedState) return true;

            return (
              getLocationParts(doctor.area).state === selectedState
            );
          })
          .map((doctor) => getLocationParts(doctor.area).city)
          .filter(Boolean)
      ),
    ].sort();
  }, [selectedState]);

  /* =======================================================
     FILTER DOCTORS
  ======================================================= */

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const location = getLocationParts(doctor.area);

      const doctorText = `
        ${doctor.name}
        ${doctor.area}
        ${doctor.address}
      `.toLowerCase();

      /* SEARCH */

      const matchesSearch = doctorText.includes(
        search.trim().toLowerCase()
      );

      /* STATE */

      const matchesState =
        !selectedState || location.state === selectedState;

      /* CITY */

      const matchesCity =
        !selectedCity || location.city === selectedCity;

      /* PRICE */

      const videoPrice = Number(doctor.videoPrice ?? 349);
      const clinicPrice = Number(doctor.clinicPrice ?? 599);

      const minPrice = Math.min(videoPrice, clinicPrice);
      const maxPrice = Math.max(videoPrice, clinicPrice);

      let matchesPrice = true;

      if (selectedPrice === "under400") {
        matchesPrice = minPrice < 400;
      }

      if (selectedPrice === "400-600") {
        matchesPrice = minPrice <= 600 && maxPrice >= 400;
      }

      if (selectedPrice === "above600") {
        matchesPrice = maxPrice > 600;
      }

      /* RATING */

      const rating = Number(doctor.rating);

      let matchesRating = true;

      if (selectedRating === "4") {
        matchesRating = rating >= 4;
      }

      if (selectedRating === "4.5") {
        matchesRating = rating >= 4.5;
      }

      if (selectedRating === "4.8") {
        matchesRating = rating >= 4.8;
      }

      /* VERIFIED */

      const matchesVerified =
        !verifiedOnly || doctor.verified === true;

      /* VIDEO */

      const matchesVideo =
        !videoOnly || doctor.videoAvailable === true;

      return (
        matchesSearch &&
        matchesState &&
        matchesCity &&
        matchesPrice &&
        matchesRating &&
        matchesVerified &&
        matchesVideo
      );
    });
  }, [
    search,
    selectedState,
    selectedCity,
    selectedPrice,
    selectedRating,
    verifiedOnly,
    videoOnly,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedPrice("");
    setSelectedRating("");
    setVerifiedOnly(false);
    setVideoOnly(false);
  };

  return (
    <div className="booked-page">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="booked-hero">

        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="booked-container">

          <div className="vet-badge">
            <Stethoscope size={15} />
            ZENVE VET CARE
          </div>

          <h1>
            Book nearby doctors for your pet
            <br />
            — video call or clinic visit
          </h1>

          <p className="hero-description">
            20,000+ verified pet clinics across every Indian state.
            Online consultation from ₹299, in-clinic visits from ₹499,
            real ratings, phone numbers and maps directions.
            More clinics added regularly as our network grows.
          </p>

          <div className="feature-list">

            <Feature
              icon={<ShieldCheck />}
              text="Verified doctors"
            />

            <Feature
              icon={<Video />}
              text="Video consult available"
            />

            <Feature
              icon={<Clock3 />}
              text="Same-day slots"
            />

            <Feature
              icon={<Send />}
              text="Maps directions"
            />

          </div>

        </div>
      </section>

      {/* ===================================================
          SEARCH
      =================================================== */}

      <section className="search-section">

        <div className="booked-container">

          {/* SEARCH BOX */}

          <div className="search-box">

            <Search size={20} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clinic, doctor, area or city..."
            />

            <button type="button">
              Find
            </button>

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="filter-list">

            {/* STATE */}

            <select
              className="filter-pill dropdown"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
            >
              <option value="">All states</option>

              {states.map((state) => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))}
            </select>

            {/* CITY */}

            <select
              className="filter-pill dropdown"
              value={selectedCity}
              onChange={(e) =>
                setSelectedCity(e.target.value)
              }
            >
              <option value="">All cities</option>

              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))}
            </select>

            {/* PRICE */}

            <select
              className="filter-pill dropdown"
              value={selectedPrice}
              onChange={(e) =>
                setSelectedPrice(e.target.value)
              }
            >
              <option value="">Any price</option>
              <option value="under400">
                Under ₹400
              </option>
              <option value="400-600">
                ₹400 - ₹600
              </option>
              <option value="above600">
                Above ₹600
              </option>
            </select>

            {/* RATING */}

            <select
              className="filter-pill dropdown"
              value={selectedRating}
              onChange={(e) =>
                setSelectedRating(e.target.value)
              }
            >
              <option value="">Any rating</option>
              <option value="4">
                4.0+
              </option>
              <option value="4.5">
                4.5+
              </option>
              <option value="5">
                5.0+
              </option>
            </select>

            {/* VIDEO */}

            <button
              type="button"
              className={`filter-pill ${videoOnly ? "active-purple" : ""
                }`}
              onClick={() =>
                setVideoOnly((prev) => !prev)
              }
            >
              <Video size={15} />
              Video consult
            </button>

            {/* VERIFIED */}

            <button
              type="button"
              className={`filter-pill verified ${verifiedOnly ? "active-red" : ""
                }`}
              onClick={() =>
                setVerifiedOnly((prev) => !prev)
              }
            >
              <ShieldCheck size={15} />
              Verified only
            </button>

            {/* CLEAR */}

            {(search ||
              selectedState ||
              selectedCity ||
              selectedPrice ||
              selectedRating ||
              verifiedOnly ||
              videoOnly) && (
                <button
                  type="button"
                  className="filter-pill clear-filter"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}

          </div>

        </div>

      </section>

      {/* ===================================================
          DOCTORS
      =================================================== */}

      <main className="doctors-section">

        <div className="booked-container">

          <div className="results-heading">

            <h2>
              Showing {filteredDoctors.length} doctors near you
            </h2>

            <span>
              {filteredDoctors.length} results
            </span>

          </div>

          {filteredDoctors.length > 0 ? (

            <div className="doctor-grid">

              {filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={`${doctor.name}-${index}`}
                  doctor={doctor}
                />
              ))}

            </div>

          ) : (

            <div className="no-results">

              <Stethoscope size={42} />

              <h3>
                No doctors found
              </h3>

              <p>
                Try changing your state, city, price or rating filter.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear all filters
              </button>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

/* =========================================================
   FEATURE COMPONENT
========================================================= */

const Feature = ({ icon, text }) => (
  <div className="feature-pill">

    {React.cloneElement(icon, {
      size: 15,
    })}

    <span>
      {text}
    </span>

  </div>
);

/* =========================================================
   DOCTOR CARD
========================================================= */

const DoctorCard = ({ doctor }) => {

  const videoPrice = doctor.videoPrice ?? 349;
  const clinicPrice = doctor.clinicPrice ?? 599;

  return (
    <article className="doctor-card">

      {/* ICON */}

      <div className="doctor-icon">
        <Stethoscope size={24} />
      </div>

      {/* NAME */}

      <h3>
        {doctor.name}
      </h3>

      {/* LOCATION */}

      <div className="doctor-location">

        <MapPin size={15} />

        {doctor.area}

      </div>

      {/* RATING */}

      <div className="doctor-rating">

        <Star
          size={15}
          fill="currentColor"
        />

        <strong>
          {doctor.rating}
        </strong>

        <span>
          ({doctor.reviews})
        </span>

        {/* VERIFIED */}

        {doctor.verified && (
          <span className="verified">

            <ShieldCheck size={13} />

            Verified

          </span>
        )}

        {/* VIDEO */}

        {doctor.videoAvailable && (
          <span className="video-tag">

            <Video size={13} />

            Video call

          </span>
        )}

      </div>

      {/* ADDRESS */}

      <p className="doctor-address">
        {doctor.address}
      </p>

      {/* PRICE */}

      <div className="price-row">

        <div>

          <span>
            Video
          </span>

          <strong>
            ₹{videoPrice}
          </strong>

        </div>

        <div>

          <span>
            Clinic visit
          </span>

          <strong>
            ₹{clinicPrice}
          </strong>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="card-actions">

        {doctor.videoAvailable && (
          <button
            type="button"
            className="video-button"
          >
            <Video size={15} />
            Video consult
          </button>
        )}

        <button
          type="button"
          className="book-button"
        >
          <CalendarCheck size={15} />
          Book visit
        </button>

      </div>

      {/* CONTACT */}

      <div className="contact-row">

        <a href={`tel:${doctor.phone}`}>

          <Phone size={14} />

          Call

        </a>

        <a
          href={doctor.map}
          target="_blank"
          rel="noreferrer"
        >

          <MapPin size={14} />

          Maps

        </a>

        {doctor.site && (
          <a
            href={doctor.site}
            target="_blank"
            rel="noreferrer"
          >

            <ExternalLink size={14} />

            Site

          </a>
        )}

      </div>

    </article>
  );
};

export default Booked;