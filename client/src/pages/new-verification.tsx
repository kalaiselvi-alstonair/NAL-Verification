import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Home, User, Landmark, Users } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

// Nested data: state -> district -> taluks/mandals
const LOCATION_DATA = {
  karnataka: {
    label: "Karnataka",
    districts: {
      Bagalkote: ["Bagalkote", "Jamkhandi", "Mudhol", "Badami", "Bilagi", "Hunagunda", "Ilkal", "Rabkavi Banhatti", "Guledgudda"],
      Ballari: ["Ballari", "Hospet", "Sandur", "Siruguppa", "Kudligi", "Hagaribommanahalli", "Kampli", "Kurugodu"],
      Belagavi: ["Belagavi", "Athani", "Bailhongal", "Chikodi", "Gokak", "Hukkeri", "Khanapur", "Ramdurg", "Raibag", "Savadatti", "Nippani", "Sankeshwar"],
      BengaluruRural: ["Devanahalli", "Doddaballapura", "Hoskote", "Nelamangala"],
      BengaluruUrban: ["Bangalore North", "Bangalore South", "Bangalore East", "Anekal", "Yelahanka", "Dasarahalli", "Mahadevapura", "Bommanahalli", "Rajarajeshwari Nagar"],
      Bidar: ["Bidar", "Aurad", "Basavakalyan", "Bhalki", "Humnabad"],
      Chamarajanagar: ["Chamarajanagar", "Gundlupet", "Kollegal", "Yelandur"],
      Chikkaballapur: ["Chikkaballapur", "Chintamani", "Gauribidanur", "Gudibanda", "Bagepalli", "Sidlaghatta"],
      Chikkamagaluru: ["Chikkamagaluru", "Kadur", "Koppa", "Mudigere", "Narasimharajapura", "Sringeri", "Tarikere"],
      Chitradurga: ["Chitradurga", "Hosadurga", "Holalkere", "Hiriyur", "Molakalmuru", "Challakere"],
      DakshinaKannada: ["Mangaluru", "Bantwal", "Belthangady", "Puttur", "Sullia", "Moodabidri"],
      Davanagere: ["Davanagere", "Channagiri", "Harihara", "Honnali", "Jagalur", "Harapanahalli"],
      Dharwad: ["Dharwad", "Hubballi", "Kundgol", "Navalgund", "Kalghatgi"],
      Gadag: ["Gadag", "Ron", "Shirhatti", "Mundargi", "Nargund"],
      Hassan: ["Hassan", "Alur", "Arsikere", "Belur", "Channarayapatna", "Holenarasipura", "Sakleshpur"],
      Haveri: ["Haveri", "Byadgi", "Hanagal", "Hirekerur", "Ranebennur", "Savanur", "Shiggaon"],
      Kalaburagi: ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Chittapur", "Jevargi", "Sedam", "Shahabad"],
      Kodagu: ["Madikeri", "Somwarpet", "Virajpet"],
      Kolar: ["Kolar", "Bangarapet", "Malur", "Mulbagal", "Srinivaspur"],
      Koppal: ["Koppal", "Gangawati", "Kushtagi", "Yelburga"],
      Mandya: ["Mandya", "Krishnarajpet", "Maddur", "Malavalli", "Nagamangala", "Pandavapura", "Shrirangapattana"],
      Mysuru: ["Mysore North", "Mysore South", "Hunsur", "K.R. Nagar", "Nanjangud", "T. Narasipura", "Periyapatna", "H.D. Kote", "Saragur"],
      Raichur: ["Raichur", "Deodurg", "Lingasugur", "Manvi", "Sindhanur", "Lingsugur"],
      Ramanagara: ["Ramanagara", "Channapatna", "Kanakapura", "Magadi"],
      Shivamogga: ["Shivamogga", "Bhadravathi", "Hosanagara", "Sagar", "Shikaripura", "Soraba", "Thirthahalli"],
      Tumakuru: ["Tumakuru", "Chikkanayakanhalli", "Gubbi", "Koratagere", "Kunigal", "Madhugiri", "Pavagada", "Sira", "Tiptur", "Turuvekere"],
      Udupi: ["Udupi", "Brahmavara", "Karkala", "Kundapura"],
      UttaraKannada: ["Karwar", "Ankola", "Bhatkal", "Dandeli", "Haliyal", "Honnavar", "Joida", "Kumta", "Mundgod", "Siddapur", "Sirsi", "Yellapur"],
      Vijayapura: ["Vijayapura", "Basavana Bagewadi", "Indi", "Muddebihal", "Sindgi", "Babaleshwar"],
      Yadgir: ["Yadgir", "Gurmitkal", "Shahapur", "Surpur"],
    },
    subLabel: "Taluk"
  },
  tamilnadu: {
    label: "Tamil Nadu",
    districts: {
      Ariyalur: ["Ariyalur", "Udayarpalayam", "Sendurai"],
      Chengalpattu: ["Chengalpattu", "Madurantakam", "Tambaram", "Thiruporur", "Tirukalukundram", "Vandalur"],
      Chennai: ["Chennai Central", "Chennai North", "Chennai South", "Chennai East", "Chennai West"],
      Coimbatore: ["Coimbatore North", "Coimbatore South", "Mettupalayam", "Pollachi", "Sulur", "Annur", "Kinathukadavu"],
      Cuddalore: ["Cuddalore", "Chidambaram", "Kattumannarkoil", "Kurinjipadi", "Panruti", "Tittakudi", "Virudhachalam"],
      Dharmapuri: ["Dharmapuri", "Harur", "Palacode", "Pennagaram", "Pappireddipatti"],
      Dindigul: ["Dindigul", "Kodaikanal", "Natham", "Nilakottai", "Oddanchatram", "Palani", "Vedasandur"],
      Erode: ["Erode", "Bhavani", "Gobichettipalayam", "Perundurai", "Sathyamangalam", "Kodumudi", "Modakurichi"],
      Kallakurichi: ["Kallakurichi", "Chinnasalem", "Sankarapuram", "Ulundurpet", "Tirukoilur"],
      Kanchipuram: ["Kanchipuram", "Sriperumbudur", "Uthiramerur", "Walajabad"],
      Kanniyakumari: ["Nagercoil", "Kalkulam", "Vilavancode", "Thovalai", "Agastheeswaram"],
      Karur: ["Karur", "Aravakurichi", "Kadavur", "Krishnarayapuram", "Kulithalai", "Manmangalam"],
      Krishnagiri: ["Krishnagiri", "Hosur", "Pochampalli", "Uthangarai", "Denkanikottai", "Shoolagiri"],
      Madurai: ["Madurai North", "Madurai South", "Melur", "Peraiyur", "Thirumangalam", "Thiruparankundram", "Usilampatti", "Vadipatti"],
      Nagapattinam: ["Nagapattinam", "Kilvelur", "Vedaranyam", "Thirukkuvalai"],
      Namakkal: ["Namakkal", "Kolli Hills", "Rasipuram", "Tiruchengode", "Paramathi-Velur", "Senthamangalam"],
      Nilgiris: ["Udhagamandalam", "Coonoor", "Gudalur", "Kundah", "Kotagiri"],
      Perambalur: ["Perambalur", "Kunnam", "Veppanthattai"],
      Pudukkottai: ["Pudukkottai", "Alangudi", "Aranthangi", "Avudaiyarkoil", "Gandarvakottai", "Illuppur", "Karambakudi", "Kulathur", "Manamelkudi", "Ponnamaravathi", "Thirumayam"],
      Ramanathapuram: ["Ramanathapuram", "Kadaladi", "Kamuthi", "Mudukulathur", "Paramakudi", "Rameswaram", "Tiruvadanai"],
      Ranipet: ["Ranipet", "Arakkonam", "Nemili", "Sholinghur", "Walajah"],
      Salem: ["Salem", "Attur", "Edappadi", "Gangavalli", "Mettur", "Omalur", "Pethanaickenpalayam", "Sankari", "Valapady", "Yercaud"],
      Sivaganga: ["Sivaganga", "Devakottai", "Ilayangudi", "Karaikudi", "Manamadurai", "Singampunari", "Tirupathur"],
      Tenkasi: ["Tenkasi", "Alangulam", "Kadayanallur", "Sankarankovil", "Shencottai", "Thiruvengadam", "Veerakeralampudur"],
      Thanjavur: ["Thanjavur", "Kumbakonam", "Orathanadu", "Papanasam", "Pattukkottai", "Peravurani", "Thiruvaiyaru"],
      Theni: ["Theni", "Andipatti", "Bodinayakanur", "Periyakulam", "Uthamapalayam"],
      Thoothukudi: ["Thoothukudi", "Eral", "Ettayapuram", "Kovilpatti", "Ottapidaram", "Sathankulam", "Srivaikuntam", "Tiruchendur", "Vilathikulam"],
      Tiruchirappalli: ["Tiruchirappalli East", "Tiruchirappalli West", "Lalgudi", "Manapparai", "Marungapuri", "Musiri", "Srirangam", "Thiruverumbur", "Thottiyam", "Thuraiyur"],
      Tirunelveli: ["Tirunelveli", "Ambasamudram", "Cheranmahadevi", "Manur", "Nanguneri", "Palayamkottai", "Radhapuram", "Sankaran Kovil", "Shenkottai", "Thisayanvilai"],
      Tirupathur: ["Tirupathur", "Ambur", "Jolarpet", "Natrampalli", "Vaniyambadi"],
      Tiruppur: ["Tiruppur North", "Tiruppur South", "Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Udumalaipettai"],
      Tiruvallur: ["Tiruvallur", "Avadi", "Gummidipoondi", "Ponneri", "Poonamallee", "Tiruttani", "Uthukottai"],
      Tiruvannamalai: ["Tiruvannamalai", "Arani", "Chengam", "Chetpet", "Cheyyar", "Jamunamarathur", "Kalasapakkam", "Kilpennathur", "Polur", "Vandavasi"],
      Tiruvarur: ["Tiruvarur", "Kodavasal", "Koradacheri", "Mannargudi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Valangaiman"],
      Vellore: ["Vellore", "Anaicut", "Gudiyatham", "Katpadi", "Kaveripakkam", "Pernambut", "Vaniyambadi"],
      Viluppuram: ["Viluppuram", "Gingee", "Kandachipuram", "Marakkanam", "Melmalayanur", "Tindivanam", "Ulundurpet", "Vanur"],
      Virudhunagar: ["Virudhunagar", "Aruppukkottai", "Kariapatti", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli", "Vembakottai"],
    },
    subLabel: "Taluk"
  },
  telangana: {
    label: "Telangana",
    districts: {
      Adilabad: ["Adilabad", "Tamsi", "Talamadugu", "Bela", "Bazarhathnoor", "Boath", "Gudihatnur", "Ichoda", "Jainad", "Narnoor", "Sirpur (U)", "Utnoor"],
      BhadradriKothagudem: ["Kothagudem", "Aswaraopeta", "Bhadrachalam", "Burgampahad", "Chunchupalli", "Dummugudem", "Laxmidevipalli", "Manuguru", "Mulakalapally", "Paloncha", "Tekulapally"],
      Hyderabad: ["Hyderabad North", "Hyderabad South", "Hyderabad East", "Hyderabad West", "Secunderabad", "Charminar", "Malkajgiri", "LB Nagar", "Serilingampally", "Rajendranagar"],
      Jagtial: ["Jagtial", "Dharmapuri", "Gollapalli", "Ibrahimpatnam", "Kodimial", "Korutla", "Mallapur", "Medipalli", "Metpalli", "Pegadapalli", "Raikal", "Sarangapur", "Velgatoor"],
      Jangaon: ["Jangaon", "Bachannapet", "Devaruppula", "Ghanpur (Station)", "Lingala Ghanpur", "Narmetta", "Palakurthi", "Raghunathpalle", "Zaffergadh"],
      JayashankarBhupalapally: ["Bhupalpally", "Chityal", "Eturunagaram", "Ghanpur (Mulug)", "Kannaigudem", "Mahadevpur", "Mogullapalle", "Mulug", "Regonda", "Tekumatla", "Venkatapur"],
      JogulambaGadwal: ["Gadwal", "Alampur", "Itikyal", "Kaloor", "Maldakal", "Manopad", "Rajoli"],
      Kamareddy: ["Kamareddy", "Banswada", "Bhiknoor", "Domakonda", "Gandhari", "Lingampet", "Machareddy", "Nizamsagar", "Pitlam", "Rajampet", "Sadasivanagar", "Yellareddy"],
      Karimnagar: ["Karimnagar", "Chigurumamidi", "Ganneruvaram", "Huzurabad", "Jammikunta", "Kamalapur", "Manakondur", "Saidapur", "Shankarapatnam", "Thimmapur", "Veenavanka"],
      Khammam: ["Khammam", "Aswaraopeta", "Bonakal", "Chintakani", "Enkuru", "Kallur", "Konijerla", "Kusumanchi", "Madhira", "Mudigonda", "Nelakondapalli", "Penuballi", "Raghunathapalem", "Sathupalli", "Singareni", "Tirumalayapalem", "Vemsoor", "Wyra"],
      KomaramBheem: ["Asifabad", "Bejjur", "Chintalamanepally", "Dahegaon", "Jainoor", "Kagaznagar", "Kerameri", "Koutala", "Penchikalpet", "Rebbena", "Sirpur (T)", "Tiryani", "Wankidi"],
      Mahabubabad: ["Mahabubabad", "Bayyaram", "Chinnagudur", "Dornakal", "Garla", "Gudur", "Kothaguda", "Kuravi", "Maripeda", "Narsimhulapet", "Peddavangara", "Thorrur"],
      Mahabubnagar: ["Mahabubnagar", "Addakal", "Balanagar", "Boothpur", "Devarakadra", "Dhanwada", "Ghanpur", "Hanwada", "Jadcherla", "Koilkonda", "Makthal", "Maddur", "Midjil", "Narayanpet", "Nawabpet", "Pebbair", "Peddakothapally", "Rajapur", "Telkapally", "Utkoor", "Vangoor", "Veepangandla", "Weepangandla"],
      Mancherial: ["Mancherial", "Bellampalli", "Chennur", "Dandepally", "Hajipur", "Jainad", "Kasipet", "Luxettipet", "Mandamarri", "Naspur", "Thandur"],
      Medak: ["Medak", "Andole", "Chegunta", "Chilipched", "Doulthabad", "Havelighanpur", "Kulcharam", "Mirdoddi", "Narsapur", "Papannapet", "Ramayampet", "Shankarampet (A)", "Shankarampet (R)", "Tekmal", "Toopran"],
      MedchalMalkajgiri: ["Medchal", "Bachupally", "Balanagar", "Ghatkesar", "Keesara", "Kukatpally", "Malkajgiri", "Quthbullapur", "Shamirpet"],
      Mulugu: ["Mulugu", "Venkatapuram", "Govindaraopet", "Tadvai", "Eturnagaram", "Mangapet", "Wazeedu"],
      Nagarkurnool: ["Nagarkurnool", "Achampet", "Amrabad", "Balmoor", "Bijinapally", "Chinnachintakunta", "Kalwakurthy", "Kodair", "Kolhapur", "Lingal", "Mahanandi", "Midjil", "Nagarkurnool", "Pentlavelli", "Tadoor", "Telkapally", "Uppununthala"],
      Nalgonda: ["Nalgonda", "Adavidevulapally", "Anumula", "Chandampet", "Chityal", "Devarakonda", "Gundlapally", "Kangal", "Kanagal", "Kattangur", "Miryalguda", "Munugode", "Nampally", "Narketpally", "Nidamanoor", "Peddavoora", "Thipparthy", "Tripuraram", "Vemulapally"],
      Narayanpet: ["Narayanpet", "Damaragidda", "Kosgi", "Maddur", "Maganoor", "Makthal", "Narva", "Utkur"],
      Nirmal: ["Nirmal", "Basar", "Bhainsa", "Dilawarpur", "Kubeer", "Lokeswaram", "Mudhole", "Sarangapur", "Soan", "Tanur"],
      Nizamabad: ["Nizamabad", "Armur", "Balkonda", "Bheemgal", "Dichpally", "Jakranpally", "Kammarpally", "Makloor", "Morthad", "Nandipet", "Renjal", "Sirkonda", "Velpur"],
      Peddapalli: ["Peddapalli", "Dharmaram", "Eligaid", "Julapalli", "Kalva Srirampur", "Kamanpur", "Manthani", "Mutharam (Mahadevpur)", "Peddapalli", "Ramagundam", "Sultanabad"],
      RajannaSircilla: ["Sircilla", "Boinpalli", "Chandurthi", "Ellanthakunta", "Gambhiraopet", "Konaraopet", "Mustabad", "Thangallapalli", "Vemulawada", "Yellareddipet"],
      RangaReddy: ["Ibrahimpatnam", "Chevella", "Gandipet", "Hayathnagar", "Kandukur", "Maheswaram", "Manchal", "Moinabad", "Rajendranagar", "Serilingampally", "Shamshabad", "Shankarpally", "Shabad", "Yacharam"],
      Sangareddy: ["Sangareddy", "Ameenpur", "Andole", "Gummadidala", "Hathnoora", "Jinnaram", "Kandi", "Kondapur", "Munipally", "Narayankhed", "Patancheru", "Pulkal", "Raikode", "Sadasivpet", "Zaheerabad"],
      Siddipet: ["Siddipet", "Akkannapet", "Chinnakodur", "Cherial", "Dubbak", "Gajwel", "Husnabad", "Jagdevpur", "Koheda", "Komuravelli", "Kondapak", "Mirdoddi", "Mulug", "Nanganur", "Narayankhed", "Siddipet (Urban)", "Thoguta"],
      Suryapet: ["Suryapet", "Atmakur (S)", "Chilkur", "Chivemla", "Kodad", "Mothey", "Nadigudem", "Neredcherla", "Penpahad", "Thirumalagiri", "Tirumalagiri", "Yadagirigutta"],
      Vikarabad: ["Vikarabad", "Bantwaram", "Basheerabad", "Bomraspet", "Dharur", "Doulthabad", "Kodangal", "Kulakacherla", "Marpally", "Mominpet", "Nawabpet", "Pargi", "Peddemul", "Tandur"],
      Wanaparthy: ["Wanaparthy", "Amarchinta", "Atmakur", "Ghanpur", "Gopalpet", "Kothakota", "Madanapur", "Pangal", "Pebbair", "Revally", "Srirangapur", "Veepangandla"],
      WarangalRural: ["Warangal Rural", "Atmakur", "Chityal", "Duggondi", "Geesugonda", "Nallabelly", "Parvathagiri", "Raiparthy", "Sangem", "Wardhannapet"],
      WarangalUrban: ["Warangal Urban", "Elkathurthy", "Hanamkonda", "Kazipet", "Khila Warangal", "Velair"],
      YadadriBhuvanagiri: ["Bhuvanagiri", "Alair", "Atmakur (M)", "Bibinagar", "Bommalaramaram", "Choutuppal", "Mothkur", "Pochampally", "Rajapet", "Ramannapet", "Turkapally", "Valigonda", "Yadagirigutta"],
    },
    subLabel: "Mandal"
  },
  andhrapradesh: {
    label: "Andhra Pradesh",
    districts: {
      Anantapur: ["Anantapur", "Gooty", "Guntakal", "Hindupur", "Kadiri", "Kalyandurg", "Penukonda", "Puttaparthi", "Rayadurg", "Tadipatri", "Uravakonda"],
      Chittoor: ["Chittoor", "Kuppam", "Madanapalle", "Nagari", "Palamaner", "Piler", "Punganur", "Satyavedu", "Srikalahasti", "Tirupati", "Vayalpad"],
      EastGodavari: ["Kakinada", "Rajahmundry", "Amalapuram", "Peddapuram", "Pithapuram", "Rampachodavaram", "Tuni", "Yeleswaram"],
      Guntur: ["Guntur", "Bapatla", "Chilakaluripet", "Macherla", "Narasaraopet", "Ponnur", "Repalle", "Sattenapalle", "Tenali", "Vinukonda"],
      Krishna: ["Machilipatnam", "Gudivada", "Gannavaram", "Nandigama", "Nuzvid", "Vijayawada", "Vuyyuru"],
      Kurnool: ["Kurnool", "Adoni", "Allagadda", "Atmakur", "Banaganapalle", "Dhone", "Kodumur", "Nandyal", "Panyam", "Pattikonda", "Srisailam"],
      Prakasam: ["Ongole", "Chirala", "Giddalur", "Kanigiri", "Kandukur", "Markapur", "Podili", "Santhanuthalapadu", "Tirupati"],
      Srikakulam: ["Srikakulam", "Amadalavalasa", "Ichchapuram", "Palasa", "Pathapatnam", "Rajam", "Tekkali", "Vajrapukotturu"],
      Visakhapatnam: ["Visakhapatnam", "Anakapalle", "Bheemunipatnam", "Gajuwaka", "Narsipatnam", "Paderu", "Payakaraopeta", "Yelamanchili"],
      Vizianagaram: ["Vizianagaram", "Bobbili", "Cheepurupalli", "Gajapathinagaram", "Parvathipuram", "Salur", "Srungavarapukota"],
      WestGodavari: ["Eluru", "Bhimavaram", "Jangareddygudem", "Kovvur", "Narasapuram", "Nidadavole", "Palakollu", "Tadepalligudem", "Tanuku"],
      YSRKadapa: ["Kadapa", "Badvel", "Jammalamadugu", "Kamalapuram", "Mydukur", "Proddatur", "Pulivendula", "Rajampet", "Rayachoti", "Sidhout"],
    },
    subLabel: "Mandal"
  },
};

const AUTHORITIES = ["BBMP", "BDA", "BMRDA", "KHB", "GRAMP", "OTHERS"];
const OWNERSHIP_TYPES = ["Self-Acquired", "Inherited", "Company-Owned"];
const PROPERTY_TYPES = ["Land", "Apartment", "Plot", "House"];

// Document requirements by authority (from Excel screenshot)
const DOCUMENTS = [
  { key: "ec", label: "Encumbrance Certificate (EC)", authorities: ["BBMP", "BDA", "BMRDA", "KHB", "GRAMP"], remark: "Common" },
  { key: "tax", label: "Tax Paid Receipt", authorities: ["BBMP", "BDA", "BMRDA", "KHB", "GRAMP"], remark: "Common (BBMP or panchayat depending on area)" },
  { key: "oc", label: "Occupancy Certificate (OC)", authorities: ["BBMP", "BDA", "BMRDA", "KHB", "GRAMP"], remark: "Common (for constructed properties)" },
  { key: "sbp", label: "Sanctioned Building Plan", authorities: ["BBMP", "BDA", "BMRDA", "KHB", "GRAMP"], remark: "Common (for buildings)" },
  { key: "zoning", label: "Zoning Certificate (CDP/Green Zone)", authorities: ["BBMP", "BDA", "BMRDA", "KHB", "GRAMP"], remark: "Common" },
  { key: "khata", label: "Khata Certificate & Extract", authorities: ["BBMP", "BDA", "BMRDA", "KHB", "GRAMP"], remark: "Unique to BBMP jurisdiction / KHB dependent / if under BBMP (GRAMP)" },
  { key: "betterment", label: "Betterment Charges Receipt", authorities: ["BBMP"], remark: "Unique to BBMP" },
  { key: "allotment", label: "Allotment Letter", authorities: ["BDA", "KHB"], remark: "Unique to BDA/KHB" },
  { key: "possession", label: "Possession Certificate", authorities: ["BDA", "KHB"], remark: "Unique to BDA/KHB" },
  { key: "noc_bda", label: "NOC from BDA", authorities: ["BDA"], remark: "Unique to BDA" },
  { key: "bmrda_approval", label: "BMRDA Approval Letter", authorities: ["BMRDA"], remark: "Unique to BMRDA" },
  { key: "layout_plan", label: "Layout Plan Approval Certificate", authorities: ["BMRDA"], remark: "Unique to BMRDA" },
  { key: "noc_pollution", label: "NOC from Pollution Control Board", authorities: ["BMRDA", "GRAMP"], remark: "Unique to BMRDA (specific cases) / Unique if industrial/agri conversion (GRAMP)" },
];

const demoDocs = [
  { key: 'ec', label: 'Encumbrance Certificate (EC)', img: '/demo-docs/ec_sample.jpg', desc: 'A record of property encumbrances.' },
  { key: 'tax', label: 'Tax Paid Receipt', img: '/demo-docs/tax_sample.jpg', desc: 'Proof of property tax payment.' },
  { key: 'oc', label: 'Occupancy Certificate (OC)', img: '/demo-docs/oc_sample.jpg', desc: 'Certificate for completed construction.' },
  { key: 'sbp', label: 'Sanctioned Building Plan', img: '/demo-docs/sbp_sample.jpg', desc: 'Approved building plan.' },
  { key: 'zoning', label: 'Zoning Certificate', img: '/demo-docs/zoning_sample.jpg', desc: 'Land use/zoning certificate.' },
  { key: 'khata', label: 'Khata Certificate & Extract', img: '/demo-docs/khata_sample.jpg', desc: 'Digital property account document.' },
  { key: 'betterment', label: 'Betterment Charges Receipt', img: '/demo-docs/betterment_sample.jpg', desc: 'Receipt for betterment charges.' },
  { key: 'allotment', label: 'Allotment Letter', img: '/demo-docs/allotment_sample.jpg', desc: 'Letter of property allotment.' },
  { key: 'possession', label: 'Possession Certificate', img: '/demo-docs/possession_sample.jpg', desc: 'Certificate of property possession.' },
  { key: 'noc_bda', label: 'NOC from BDA', img: '/demo-docs/noc_bda_sample.jpg', desc: 'No Objection Certificate from BDA.' },
  { key: 'bmrda_approval', label: 'BMRDA Approval Letter', img: '/demo-docs/bmrda_approval_sample.jpg', desc: 'Approval letter from BMRDA.' },
  { key: 'layout_plan', label: 'Layout Plan Approval Certificate', img: '/demo-docs/layout_plan_sample.jpg', desc: 'Certificate for layout plan approval.' },
  { key: 'noc_pollution', label: 'NOC from Pollution Control Board', img: '/demo-docs/noc_pollution_sample.jpg', desc: 'NOC for pollution control.' },
];

export default function NewVerification({ minimal }: { minimal?: boolean }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    propertyType: "",
    ownerName: "",
    state: "",
    district: "",
    taluk: "",
    authority: "",
    ownershipType: "",
  });

  // Dynamic options
  const stateObj = form.state ? LOCATION_DATA[form.state as keyof typeof LOCATION_DATA] : undefined;
  const districts = stateObj ? Object.keys(stateObj.districts) : [];
  const taluks = stateObj && form.district ? stateObj.districts[form.district as keyof typeof stateObj.districts] : [];
  const talukLabel = stateObj ? stateObj.subLabel : "Taluk/Mandal";

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "state" ? { district: "", taluk: "" } : {}),
      ...(field === "district" ? { taluk: "" } : {}),
    }));
  };

  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: File | null }>({});
  const [extraDocs, setExtraDocs] = useState<Array<{ id: number; file: File | null }>>([]);
  const [notes, setNotes] = useState("");
  const [extraDocId, setExtraDocId] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add state for document names
  const [docNames, setDocNames] = useState<{ [key: string]: string }>({});
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});
  const [openImg, setOpenImg] = useState<string | null>(null);

  const selectedAuthority = form.authority;
  const docsToShow = DOCUMENTS.filter(doc =>
    selectedAuthority === "OTHERS" ? true : doc.authorities.includes(selectedAuthority)
  );

  const handleFileChange = (key: string, file: File | null) => {
    setUploadedDocs(prev => ({ ...prev, [key]: file }));
  };

  // Add handleSubmit for Step 2
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Submitting form data...");
    const formData = new FormData();
      
      // Add form fields
    formData.append("propertyType", form.propertyType);
    formData.append("ownerName", form.ownerName);
    formData.append("state", form.state);
    formData.append("district", form.district);
    formData.append("taluk", form.taluk);
    formData.append("authority", form.authority);
    formData.append("ownershipType", form.ownershipType);
    formData.append("notes", notes);

      // Add uploaded files
    Object.entries(uploadedDocs).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    // Add extra docs
    extraDocs.forEach((doc, idx) => {
      if (doc.file) {
        formData.append(`extra_doc_${idx + 1}`, doc.file);
          if (docNames[`extra_doc_${idx + 1}`]) {
            formData.append(`extra_doc_${idx + 1}_name`, docNames[`extra_doc_${idx + 1}`]);
          }
      }
    });

      const response = await fetch("http://localhost/ProfessionalWebPortal/server/php/cors.php", {
        method: "POST",
        body: formData
      });

      console.log("Response status:", response.status);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const text = await response.text();
      console.log("Response text:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Invalid JSON response from server");
      }

      console.log("Parsed response:", data);

      if (data.status === 'success') {
        alert(data.message);
        // Reset form
        setStep(1);
        setForm({
          propertyType: "",
          ownerName: "",
          state: "",
          district: "",
          taluk: "",
          authority: "",
          ownershipType: "",
        });
        setUploadedDocs({});
        setExtraDocs([]);
        setNotes("");
      } else {
        throw new Error(data.message || "Error submitting verification");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-2xl p-0 border border-gray-200 shadow-none rounded-2xl bg-white">
        {/* Modern Stepper */}
        <div className="px-8 pt-8 pb-2">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center w-full max-w-xs justify-between">
              {/* Step 1 Circle */}
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step === 1 ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>{step === 1 ? 1 : <span className="font-bold">&#10003;</span>}</div>
                <span className={`mt-2 text-xs font-medium ${step === 1 ? 'text-blue-600' : 'text-gray-400'}`}>Property Details</span>
              </div>
              {/* Connecting Line */}
              <div className={`flex-1 h-1 mx-2 ${step === 2 ? 'bg-blue-500' : 'bg-gray-200'} rounded`}></div>
              {/* Step 2 Circle */}
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step === 2 ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>{step === 2 ? 2 : ''}</div>
                <span className={`mt-2 text-xs font-medium ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>Upload Documents</span>
              </div>
          </div>
          </div>
        </div>
        {step === 1 && (
          <form className="px-8 pb-8 pt-2 space-y-8">
            {/* Property Type */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-gray-700">Property Type</span>
              </div>
              <Select value={form.propertyType} onValueChange={v => handleChange('propertyType', v)}>
                <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Select property type..." />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Owner Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-gray-700">Owner Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input value={form.ownerName} onChange={e => handleChange('ownerName', e.target.value)} placeholder="Full Name" className="bg-white border border-gray-200 rounded-lg" />
                <Select value={form.state} onValueChange={v => handleChange('state', v)}>
                  <SelectTrigger className="bg-white border border-gray-200 rounded-lg">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LOCATION_DATA).map(([key, state]) => (
                      <SelectItem key={key} value={key}>{state.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.district} onValueChange={v => handleChange('district', v)} disabled={!form.state}>
                  <SelectTrigger className="bg-white border border-gray-200 rounded-lg">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district: string) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.taluk} onValueChange={v => handleChange('taluk', v)} disabled={!form.district}>
                  <SelectTrigger className="bg-white border border-gray-200 rounded-lg">
                    <SelectValue placeholder={`Select ${talukLabel}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {taluks.map((taluk: string) => (
                      <SelectItem key={taluk} value={taluk}>{taluk}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* KMC Area (Authority) */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-gray-700">KMC Area</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {AUTHORITIES.map(auth => (
                  <Button
                    key={auth}
                    type="button"
                    variant={form.authority === auth ? 'default' : 'outline'}
                    className={cn(
                      'rounded-lg px-6 py-2 border border-gray-200 text-gray-700 font-medium bg-white',
                      form.authority === auth && 'bg-gray-100 border-gray-300 text-black shadow-sm'
                    )}
                    onClick={() => handleChange('authority', auth)}
                  >
                    {auth}
                  </Button>
                ))}
              </div>
            </div>
            {/* Ownership Type */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-gray-700">Ownership Type</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {OWNERSHIP_TYPES.map(type => (
                  <Button
                    key={type}
                    type="button"
                    variant={form.ownershipType === type ? 'default' : 'outline'}
                    className={cn(
                      'rounded-lg px-6 py-2 border border-gray-200 text-gray-700 font-medium bg-white',
                      form.ownershipType === type && 'bg-gray-100 border-gray-300 text-black shadow-sm'
                    )}
                    onClick={() => handleChange('ownershipType', type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="button" onClick={() => setStep(2)} disabled={Object.values(form).some(v => !v)}>
                Next
              </Button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form className="px-8 pb-8 pt-2 space-y-8" onSubmit={handleSubmit} aria-describedby="form-error">
            {error && (
              <div id="form-error" role="alert" className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            <div className="mb-6">
              <span className="text-lg font-bold text-gray-700">Upload Required Documents</span>
              <p className="text-sm text-gray-500 mt-1">Please upload the following documents for verification.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {docsToShow.map(doc => {
                const demo = demoDocs.find(d => d.key === doc.key);
                const file = uploadedDocs[doc.key];
                return (
                  <div key={doc.key} className="flex flex-col items-center bg-white rounded-lg shadow border p-4 mb-6 w-full">
                    {demo && (
                      <>
                        <Dialog open={openImg === demo.img} onOpenChange={open => setOpenImg(open ? demo.img : null)}>
                          <DialogTrigger asChild>
                            <img
                              src={demo.img}
                              alt={demo.label}
                              className="w-40 h-32 object-contain border rounded bg-gray-50 mb-2 cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setOpenImg(demo.img)}
                              onError={e => {
                                e.currentTarget.src = '/demo-docs/placeholder.jpg';
                                setImgErrors(prev => ({ ...prev, [doc.key]: true }));
                              }}
                              title="Click to view sample document"
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl flex flex-col items-center" aria-describedby="sample-document-description">
                            <img src={demo.img} alt={demo.label} className="max-w-full max-h-[80vh] object-contain rounded border bg-gray-50" />
                            <div id="sample-document-description" className="mt-2 text-sm text-gray-600 text-center">{demo.label}</div>
                          </DialogContent>
                        </Dialog>
                        {imgErrors[doc.key] && (
                          <div className="text-xs text-red-600 mb-2">Sample image not found: {demo.img}</div>
                        )}
                      </>
                    )}
                    <div className="font-semibold text-main mb-2 text-center">{doc.label}</div>
                    <div className="text-xs text-gray-500 text-center mb-2">{demo?.desc}</div>
                    {!file && (
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={e => handleFileChange(doc.key, e.target.files?.[0] || null)}
                        className="border border-gray-200 rounded px-3 py-2 text-sm w-full mb-2"
                      />
                    )}
                    {file && (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="flex items-center gap-2 w-full justify-center">
                          {file.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(file)} alt="Preview" className="h-16 w-auto border rounded" />
                          ) : (
                            <span className="inline-block h-16 w-16 bg-gray-100 border rounded flex items-center justify-center text-2xl">📄</span>
                          )}
                          <span className="text-sm text-gray-700 truncate max-w-[120px]">{file.name}</span>
                          <button
                            type="button"
                            className="ml-2 text-red-600 hover:text-red-800 text-lg font-bold px-2 py-1 rounded"
                            title="Remove"
                            onClick={() => handleFileChange(doc.key, null)}
                          >
                            ×
                          </button>
                  </div>
                  <span className="text-xs text-gray-400">{doc.remark}</span>
                </div>
                    )}
                  </div>
                );
              })}
            </div>
              {/* Extra Documents */}
              {extraDocs.map((extra, idx) => (
                <div key={extra.id} className="flex flex-col gap-1 relative">
                  <label className="font-medium text-gray-700">Additional Document {idx + 1}</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      setExtraDocs(prev => prev.map(d => d.id === extra.id ? { ...d, file } : d));
                    }}
                    className="border border-gray-200 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={docNames[`extra_doc_${idx + 1}`] || ''}
                    onChange={e => setDocNames(prev => ({ ...prev, [`extra_doc_${idx + 1}`]: e.target.value }))}
                    placeholder="Edit document name"
                    className="border border-gray-200 rounded px-3 py-2 text-sm mt-2"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 mt-1 mr-1 text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded"
                    onClick={() => setExtraDocs(prev => prev.filter(d => d.id !== extra.id))}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setExtraDocs(prev => [...prev, { id: extraDocId, file: null }]);
                  setExtraDocId(id => id + 1);
                }}
              >
                + Add More Documents
              </Button>
            {/* Notes Box */}
            <div>
              <label className="font-medium text-gray-700 mb-1 block">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm resize-none"
                placeholder="Add any notes or comments about your documents..."
              />
            </div>
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                Back
              </Button>
              <Button
                type="submit"
                className="bg-accent-blue text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Request Service'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
} 