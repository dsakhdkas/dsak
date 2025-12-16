// 商品数据（静态站点本地数据）
// 你可以继续往下添加更多商品；id 需要唯一
window.PRODUCTS = [
  {
    id: "starlight-waltz",
    name: "Starlight Waltz JSK",
    brand: "Baby, The Stars Shine Bright",
    style: "Classic",
    status: "deposit", // deposit | ended | coming
    price: 899,
    deposit: "2025/10/20 - 2025/10/25",
    finalPay: "2025/11/05",
    image: "images/sample-dress.jpg",
    desc: "以星光与华尔兹为主题的梦幻系列，使用银丝织纹与细腻蕾丝，体现典雅气质。",
    tips: [
      "衬衫：奶白/象牙白蕾丝领口更显古典。",
      "鞋子：棕色玛丽珍或黑色圆头鞋都很稳。",
      "头饰：同色系小头花/发带可以增强整体感。"
    ],
    recommend: ["classic-melody", "rose-ballet"]
  },
  {
    id: "dreamy-dessert",
    name: "Dreamy Dessert JSK",
    brand: "Angelic Pretty",
    style: "Sweet",
    status: "ended",
    price: 1099,
    deposit: "2025/03/01 - 2025/03/05",
    finalPay: "2025/03/18",
    image: "images/outfit3.jpg",
    desc: "甜品主题印花与糖果色系，适合搭配蓬蓬衬裙与彩色袜，甜度拉满。",
    tips: [
      "衬衫：泡泡袖+小立领会更甜。",
      "鞋子：粉/白色圆头鞋或蝴蝶结高跟都可。",
      "配件：糖果色发饰、草莓耳饰点题。"
    ],
    recommend: ["starlight-waltz", "rose-ballet"]
  },
  {
    id: "classic-melody",
    name: "Classic Melody OP",
    brand: "示例品牌",
    style: "Classic",
    status: "coming",
    price: 799,
    deposit: "2026/01/10 - 2026/01/15",
    finalPay: "2026/01/28",
    image: "images/outfit2.jpg",
    desc: "古典旋律主题 OP，线条利落，适合日常优雅通勤。",
    tips: [
      "外套：短斗篷或小披肩很搭。",
      "鞋子：深色玛丽珍更稳重。",
      "头饰：贝雷帽/小礼帽会更有氛围。"
    ],
    recommend: ["starlight-waltz", "dreamy-dessert"]
  },
  {
    id: "rose-ballet",
    name: "Rose Ballet SK",
    brand: "示例品牌",
    style: "Classic",
    status: "ended",
    price: 699,
    deposit: "2025/08/02 - 2025/08/06",
    finalPay: "2025/08/20",
    image: "images/outfit1.jpg",
    desc: "玫瑰芭蕾半裙，适合搭配纯色上衣与玫瑰系配件。",
    tips: [
      "上衣：白色方领或小高领都不错。",
      "鞋子：黑色/酒红色鞋子更显成熟。",
      "配饰：玫瑰胸针或丝带腰封更统一。"
    ],
    recommend: ["starlight-waltz", "dreamy-dessert"]
  }
];

window.getProductById = function(id){
  return window.PRODUCTS.find(p => p.id === id);
};

window.getStatusLabel = function(status){
  if(status === "deposit") return { text: "定金中", cls: "status--deposit" };
  if(status === "ended") return { text: "已结束", cls: "status--ended" };
  return { text: "预告", cls: "status--coming" };
};
