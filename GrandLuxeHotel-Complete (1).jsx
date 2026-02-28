import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════
const HOTEL = { name: "Grand Luxe Hotel", tagline: "Nairobi's Premier Hospitality", email: "info@grandluxehotel.com", tel: "+254 700 000 000", address: "Nairobi, Kenya" };

const ROLES = {
  manager:   { label:"Manager",   color:"#e2b96f", access:["dashboard","orders","kitchen","menu","inventory","rooms","pool","shifts","billing","notifications","analytics","guest"] },
  waiter:    { label:"Waiter",    color:"#60a5fa", access:["orders","kitchen","billing"] },
  chef:      { label:"Chef",      color:"#f97316", access:["kitchen","inventory"] },
  bartender: { label:"Bartender", color:"#a78bfa", access:["kitchen","inventory"] },
};

const STAFF_ACCOUNTS = [
  { id:1, name:"Alice Njeri",   role:"manager",   pin:"1111", avatar:"👩‍💼" },
  { id:2, name:"Brian Otieno",  role:"waiter",    pin:"2222", avatar:"🧑‍🍳" },
  { id:3, name:"Carol Wambui",  role:"chef",      pin:"3333", avatar:"👩‍🍳" },
  { id:4, name:"David Kamau",   role:"bartender", pin:"4444", avatar:"🧑‍🍹" },
  { id:5, name:"Eve Akinyi",    role:"waiter",    pin:"5555", avatar:"👩‍💼" },
  { id:6, name:"Frank Maina",   role:"chef",      pin:"6666", avatar:"🧑‍🍳" },
];

const INIT_MENU = {
  Breakfast: [
    {id:1,name:"Full English Breakfast",price:1800,cat:"Breakfast",avail:true,emoji:"🍳",desc:"Eggs, bacon, sausages, beans, grilled tomato & toast"},
    {id:2,name:"Continental Basket",price:1200,cat:"Breakfast",avail:true,emoji:"🥐",desc:"Assorted pastries, butter, jam, fresh juice & coffee"},
    {id:3,name:"Avocado Toast",price:900,cat:"Breakfast",avail:true,emoji:"🥑",desc:"Sourdough, smashed avocado, poached egg, chilli flakes",tag:"Healthy"},
    {id:4,name:"Pancake Stack",price:800,cat:"Breakfast",avail:true,emoji:"🥞",desc:"Fluffy pancakes with maple syrup and mixed berries"},
  ],
  "Main Course": [
    {id:5,name:"Grilled Tilapia",price:2400,cat:"Main Course",avail:true,emoji:"🐟",desc:"Fresh tilapia, lemon butter sauce, seasonal vegetables & rice",tag:"Chef's Pick"},
    {id:6,name:"Beef Tenderloin",price:3200,cat:"Main Course",avail:true,emoji:"🥩",desc:"200g tenderloin, red wine jus, roasted potatoes",tag:"Premium"},
    {id:7,name:"Vegetable Curry",price:1600,cat:"Main Course",avail:true,emoji:"🍛",desc:"Seasonal vegetables in rich coconut curry, basmati rice",tag:"Vegan"},
    {id:8,name:"Chicken Tikka",price:2200,cat:"Main Course",avail:true,emoji:"🍗",desc:"Marinated chicken, tikka masala sauce, garlic naan",tag:"Spicy"},
  ],
  Appetizers: [
    {id:9,name:"Prawn Cocktail",price:1100,cat:"Appetizers",avail:true,emoji:"🍤",desc:"Tiger prawns, Marie Rose sauce, avocado, lettuce"},
    {id:10,name:"Soup of the Day",price:700,cat:"Appetizers",avail:true,emoji:"🍜",desc:"Ask your waiter for today's selection, served with bread",tag:"Daily Special"},
    {id:11,name:"Bruschetta",price:850,cat:"Appetizers",avail:true,emoji:"🍞",desc:"Toasted ciabatta, tomato, basil, extra virgin olive oil",tag:"Vegetarian"},
  ],
  Desserts: [
    {id:12,name:"Chocolate Lava Cake",price:950,cat:"Desserts",avail:true,emoji:"🍫",desc:"Warm chocolate cake, vanilla ice cream, berry coulis",tag:"Must Try!"},
    {id:13,name:"Mango Panna Cotta",price:800,cat:"Desserts",avail:true,emoji:"🥭",desc:"Creamy Italian dessert with fresh mango coulis"},
    {id:14,name:"Cheese Platter",price:1200,cat:"Desserts",avail:true,emoji:"🧀",desc:"Selection of local & imported cheeses with crackers"},
  ],
  Bar: [
    {id:15,name:"Tusker Beer",price:450,cat:"Bar",avail:true,emoji:"🍺",desc:"Kenya's premium lager, served ice cold"},
    {id:16,name:"House Wine",price:700,cat:"Bar",avail:true,emoji:"🍷",desc:"Glass of carefully selected house red or white"},
    {id:17,name:"Mojito",price:900,cat:"Bar",avail:true,emoji:"🍸",desc:"White rum, fresh mint, lime, sugar, sparkling water",tag:"Signature"},
    {id:18,name:"Fresh Juice",price:400,cat:"Bar",avail:true,emoji:"🥤",desc:"Freshly squeezed mango, passion, orange or pineapple",tag:"Healthy"},
    {id:19,name:"Soft Drink",price:200,cat:"Bar",avail:true,emoji:"🥤",desc:"Coca-Cola, Fanta, Sprite or Stoney"},
    {id:20,name:"Mineral Water",price:150,cat:"Bar",avail:true,emoji:"💧",desc:"500ml still or sparkling"},
  ],
};

const INIT_INVENTORY = [
  {id:1,name:"Beef",qty:25,unit:"kg",reorder:5,cat:"Meat"},
  {id:2,name:"Chicken",qty:30,unit:"kg",reorder:8,cat:"Meat"},
  {id:3,name:"Tilapia",qty:18,unit:"kg",reorder:6,cat:"Seafood"},
  {id:4,name:"Eggs",qty:12,unit:"tray",reorder:3,cat:"Dairy"},
  {id:5,name:"Milk",qty:40,unit:"L",reorder:10,cat:"Dairy"},
  {id:6,name:"Flour",qty:50,unit:"kg",reorder:10,cat:"Dry Goods"},
  {id:7,name:"Rice",qty:60,unit:"kg",reorder:15,cat:"Dry Goods"},
  {id:8,name:"Tusker Beer",qty:8,unit:"crate",reorder:2,cat:"Bar"},
  {id:9,name:"Wine",qty:24,unit:"bottle",reorder:6,cat:"Bar"},
  {id:10,name:"Soft Drinks",qty:10,unit:"crate",reorder:3,cat:"Bar"},
];

const INIT_ROOMS = [
  {id:"101",type:"Standard",status:"available",price:8500,floor:1},
  {id:"102",type:"Standard",status:"occupied",guest:"James Mwangi",checkIn:"2026-02-24",checkOut:"2026-02-28",price:8500,floor:1},
  {id:"103",type:"Deluxe",status:"available",price:12000,floor:1},
  {id:"201",type:"Deluxe",status:"occupied",guest:"Sarah Kamau",checkIn:"2026-02-25",checkOut:"2026-02-27",price:12000,floor:2},
  {id:"202",type:"Suite",status:"available",price:22000,floor:2},
  {id:"203",type:"Suite",status:"maintenance",price:22000,floor:2},
  {id:"301",type:"Presidential",status:"available",price:45000,floor:3},
  {id:"302",type:"Standard",status:"occupied",guest:"Tom Otieno",checkIn:"2026-02-26",checkOut:"2026-03-01",price:8500,floor:3},
];

const POOL_SLOTS = [
  {id:1,time:"06:00–07:00",cap:10},{id:2,time:"07:00–08:00",cap:10},
  {id:3,time:"08:00–09:00",cap:12},{id:4,time:"09:00–10:00",cap:12},
  {id:5,time:"10:00–11:00",cap:15},{id:6,time:"11:00–12:00",cap:15},
  {id:7,time:"14:00–15:00",cap:15},{id:8,time:"15:00–16:00",cap:15},
  {id:9,time:"16:00–17:00",cap:12},{id:10,time:"17:00–18:00",cap:10},
];

const SHIFT_TYPES = [
  {id:"morning",   label:"Morning",   time:"06:00–14:00", color:"#f59e0b", bg:"#78350f", icon:"🌅"},
  {id:"afternoon", label:"Afternoon", time:"14:00–22:00", color:"#34d399", bg:"#065f46", icon:"🌤️"},
  {id:"night",     label:"Night",     time:"22:00–06:00", color:"#818cf8", bg:"#1e1b4b", icon:"🌙"},
  {id:"off",       label:"Day Off",   time:"",            color:"#64748b", bg:"#1e293b", icon:"🏖️"},
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const NOTIF_TEMPLATES = {
  booking:     { label:"Booking Confirmation", icon:"🛏️", wa:(g)=>`🏨 *${HOTEL.name}*\n\nDear ${g.name||"Guest"},\n\n✅ Your booking is confirmed!\n\n• Room: ${g.room||"—"}\n• Check-in: ${g.checkIn||"—"}\n• Check-out: ${g.checkOut||"—"}\n• Rate: KES ${g.rate||"—"}/night\n\nWe look forward to welcoming you!\n📞 ${HOTEL.tel}`, sms:(g)=>`${HOTEL.name}: Booking confirmed for ${g.name}. Room ${g.room}, ${g.checkIn}–${g.checkOut}. KES ${g.rate}/night. ${HOTEL.tel}` },
  welcome:     { label:"Welcome Message",      icon:"👋", wa:(g)=>`🏨 *${HOTEL.name}*\n\nWelcome, ${g.name||"Guest"}! 🎉\n\nWe're thrilled to have you in Room ${g.room||"—"}.\n\n🍽️ Restaurant: 06:00–22:00\n🏊 Pool: 06:00–18:00\n🍹 Bar: 11:00–23:00\n📞 Room Service: 24hr (ext. 0)\n\nEnjoy your stay!`, sms:(g)=>`Welcome to ${HOTEL.name}, ${g.name}! Room ${g.room}. Restaurant 06-22h, Pool 06-18h, Bar 11-23h, Room Service 24hr.` },
  order_ready: { label:"Order Ready",          icon:"🍽️", wa:(g)=>`🏨 *${HOTEL.name}*\n\nHi ${g.name||"Guest"}! 🍽️\n\nOrder *#${g.orderId||"—"}* is ready and heading to Table ${g.table||"—"}!\n\n${g.items||""}\n\nTotal: KES ${g.total||"—"}\n\nBon appétit! 😋`, sms:(g)=>`${HOTEL.name}: Your order #${g.orderId} is ready! Heading to Table ${g.table}. Total: KES ${g.total}.` },
  checkout:    { label:"Checkout Invoice",     icon:"🚪", wa:(g)=>`🏨 *${HOTEL.name}*\n\nDear ${g.name||"Guest"},\n\nThank you for staying with us! 🙏\n\n📄 Invoice:\n• Room ${g.room||"—"} (${g.nights||"—"} nights): KES ${g.roomTotal||"—"}\n• F&B: KES ${g.fb||"—"}\n• *Total: KES ${g.total||"—"}*\n\nWe hope to see you again!`, sms:(g)=>`${HOTEL.name}: Thank you ${g.name}! Total: KES ${g.total}. Safe travels & hope to see you again!` },
  pool:        { label:"Pool Booking",         icon:"🏊", wa:(g)=>`🏨 *${HOTEL.name}*\n\n🏊 Pool Slot Confirmed\n\nHi ${g.name||"Guest"}!\n• Date: ${g.date||"—"}\n• Time: ${g.time||"—"}\n• Guests: ${g.guests||"—"}\n\nShow this message at the pool desk.`, sms:(g)=>`${HOTEL.name}: Pool confirmed for ${g.name} on ${g.date} at ${g.time} (${g.guests} guests).` },
};

const TAG_COLORS = {
  "Popular":      {bg:"#7c2d12",c:"#fb923c"},
  "Chef's Pick":  {bg:"#064e3b",c:"#34d399"},
  "Premium":      {bg:"#1e3a5f",c:"#93c5fd"},
  "Must Try!":    {bg:"#7f1d1d",c:"#fca5a5"},
  "Vegan":        {bg:"#14532d",c:"#86efac"},
  "Healthy":      {bg:"#14532d",c:"#86efac"},
  "Signature":    {bg:"#4c1d95",c:"#c4b5fd"},
  "Daily Special":{bg:"#78350f",c:"#fcd34d"},
  "Spicy":        {bg:"#7c2d12",c:"#fb923c"},
  "Vegetarian":   {bg:"#14532d",c:"#86efac"},
};

// ═══════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem("glh_"+k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem("glh_"+k, JSON.stringify(v)); } catch {} },
};

// ═══════════════════════════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════════════════════════
const S = {
  input:  {width:"100%",padding:"10px 14px",background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#e2e8f0",fontSize:13,boxSizing:"border-box",outline:"none"},
  label:  {display:"block",color:"#94a3b8",fontSize:11,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600},
  btnGold:{background:"linear-gradient(135deg,#b8860b,#e2b96f)",color:"#0a0f1a",border:"none",padding:"10px 20px",borderRadius:8,cursor:"pointer",fontWeight:800,fontSize:13},
  btnBlue:{background:"#1e3a5f",color:"#60a5fa",border:"1px solid #1e3a5f",padding:"10px 20px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13},
};

// ═══════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════
const Badge = ({c="#e2b96f",bg="#1e293b",children}) => (
  <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:bg,color:c,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>
);

function Modal({title,onClose,children,wide=false}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#0f172a",border:"1px solid #1e3a5f",borderRadius:16,width:"100%",maxWidth:wide?740:520,maxHeight:"92vh",overflow:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:"1px solid #1e293b",position:"sticky",top:0,background:"#0f172a",zIndex:1}}>
          <h2 style={{color:"#e2b96f",margin:0,fontSize:17,fontFamily:"'Playfair Display',serif"}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:22,lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:24}}>{children}</div>
      </div>
    </div>
  );
}

function Toast({toasts,rm}) {
  return (
    <div style={{position:"fixed",bottom:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} onClick={()=>rm(t.id)} style={{
          background:t.type==="success"?"#064e3b":t.type==="error"?"#7f1d1d":"#1e3a5f",
          color:"#fff",padding:"12px 18px",borderRadius:10,cursor:"pointer",fontSize:13,
          boxShadow:"0 4px 24px rgba(0,0,0,0.5)",maxWidth:300,pointerEvents:"all",
          borderLeft:`4px solid ${t.type==="success"?"#34d399":t.type==="error"?"#f87171":"#60a5fa"}`
        }}>{t.message}</div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts,setToasts] = useState([]);
  const add = (message, type="success") => {
    const id = Date.now()+Math.random();
    setToasts(p=>[...p,{id,message,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),4000);
  };
  const rm = id => setToasts(p=>p.filter(t=>t.id!==id));
  return {toasts, toast:add, rmToast:rm};
}

function useOrderTimer(orderTime) {
  const [elapsed,setElapsed] = useState(0);
  useEffect(()=>{
    const start = new Date(orderTime).getTime()||Date.now();
    const t = setInterval(()=>setElapsed(Math.floor((Date.now()-start)/1000)),1000);
    return ()=>clearInterval(t);
  },[orderTime]);
  const m=Math.floor(elapsed/60), s=elapsed%60;
  return {label:`${m}:${s.toString().padStart(2,"0")}`,urgent:elapsed>900,warning:elapsed>600};
}

function printReceipt(order) {
  const rows = order.items.map(i=>`<tr><td>${i.emoji||""} ${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">KES ${(i.price*i.qty).toLocaleString()}</td></tr>`).join("");
  const html = `<!DOCTYPE html><html><head><title>Receipt</title><style>
    body{font-family:Georgia,serif;max-width:360px;margin:40px auto;font-size:13px;color:#111}
    h1{text-align:center;font-size:20px;margin:0;letter-spacing:1px}
    .sub{text-align:center;color:#555;font-size:11px;margin:4px 0 18px}
    hr{border:none;border-top:1px dashed #aaa;margin:12px 0}
    table{width:100%;border-collapse:collapse}
    th{font-size:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #111;text-align:left}
    td{padding:5px 0;border-bottom:1px solid #eee}
    .total{font-size:15px;font-weight:bold;text-align:right;margin-top:12px}
    .footer{text-align:center;color:#777;font-size:11px;margin-top:20px}
  </style></head><body>
  <h1>${HOTEL.name}</h1>
  <div class="sub">${HOTEL.address} · ${HOTEL.tel}</div>
  <hr>
  <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
    <span><b>Order:</b> ${order.id}</span><span><b>Time:</b> ${order.displayTime}</span>
  </div>
  <div style="font-size:12px;margin-bottom:12px"><b>Table/Room:</b> ${order.table}${order.guest?` &nbsp;·&nbsp; ${order.guest}`:""}</div>
  <table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
  <hr>
  <div class="total">TOTAL: KES ${order.total.toLocaleString()}</div>
  <div class="footer">Thank you for dining with us!<br>${HOTEL.email}</div>
  </body></html>`;
  const w=window.open("","_blank","width=440,height=680");
  w.document.write(html); w.document.close();
  setTimeout(()=>w.print(),500);
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({onLogin}) {
  const [sel,setSel] = useState(null);
  const [pin,setPin] = useState("");
  const [err,setErr] = useState("");

  const tryLogin = (p=pin) => {
    if(!sel) return;
    if(sel.pin===p){setErr("");onLogin(sel);}
    else{setErr("Incorrect PIN");setPin("");}
  };
  const press = d => {
    if(pin.length>=4) return;
    const np=pin+d;
    setPin(np);
    if(np.length===4) setTimeout(()=>tryLogin(np),100);
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#070d1a 0%,#0f1f44 50%,#0a1a12 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Lato',sans-serif",padding:24}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{fontSize:52,marginBottom:12}}>🏨</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",fontSize:30,margin:"0 0 6px"}}>{HOTEL.name}</h1>
        <p style={{color:"#64748b",margin:0,fontSize:14}}>{HOTEL.tagline}</p>
      </div>

      {!sel ? (
        <div>
          <p style={{color:"#475569",textAlign:"center",fontSize:13,marginBottom:16}}>Select your profile to continue</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:480,width:"100%"}}>
            {STAFF_ACCOUNTS.map(s=>{
              const role=ROLES[s.role];
              return(
                <button key={s.id} onClick={()=>setSel(s)}
                  style={{background:"#0f172a",border:"2px solid #1e293b",borderRadius:14,padding:"20px 12px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=role.color;e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e293b";e.currentTarget.style.transform="none"}}>
                  <div style={{fontSize:30,marginBottom:8}}>{s.avatar}</div>
                  <div style={{color:"#e2e8f0",fontWeight:700,fontSize:13,marginBottom:5}}>{s.name.split(" ")[0]}</div>
                  <Badge c={role.color} bg="#1e293b">{role.label}</Badge>
                </button>
              );
            })}
          </div>
        </div>
      ):(
        <div style={{background:"#0f172a",border:"1px solid #1e3a5f",borderRadius:16,padding:32,maxWidth:300,width:"100%",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:8}}>{sel.avatar}</div>
          <div style={{color:"#e2b96f",fontWeight:700,fontSize:16,marginBottom:3}}>{sel.name}</div>
          <Badge c={ROLES[sel.role].color}>{ROLES[sel.role].label}</Badge>
          <p style={{color:"#94a3b8",fontSize:13,margin:"20px 0 14px"}}>Enter your 4-digit PIN</p>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{width:13,height:13,borderRadius:"50%",background:pin.length>i?"#e2b96f":"#1e293b",border:"2px solid",borderColor:pin.length>i?"#e2b96f":"#334155",transition:"all 0.15s"}}/>
            ))}
          </div>
          {err&&<p style={{color:"#f87171",fontSize:12,margin:"0 0 10px"}}>{err}</p>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>(
              <button key={i} onClick={()=>k==="⌫"?setPin(p=>p.slice(0,-1)):k!==""?press(String(k)):null}
                style={{padding:"13px 0",background:k==="⌫"?"#1e293b":"#1a2744",border:"1px solid #1e3a5f",borderRadius:10,color:k==="⌫"?"#ef4444":"#e2e8f0",fontSize:16,fontWeight:700,cursor:k===""?"default":"pointer",opacity:k===""?0:1}}>
                {k}
              </button>
            ))}
          </div>
          <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13}}>← Back</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function GrandLuxeApp() {
  const [user,setUser]           = useState(null);
  const [tab,setTab]             = useState("dashboard");
  const [menu,setMenu]           = useState(()=>LS.get("menu",INIT_MENU));
  const [inventory,setInventory] = useState(()=>LS.get("inventory",INIT_INVENTORY));
  const [rooms,setRooms]         = useState(()=>LS.get("rooms",INIT_ROOMS));
  const [orders,setOrders]       = useState(()=>LS.get("orders",[]));
  const [poolBookings,setPool]   = useState(()=>LS.get("pool",[]));
  const [schedule,setSchedule]   = useState(()=>LS.get("schedule",{}));
  const [sentNotifs,setSentNotifs]= useState(()=>LS.get("notifs",[]));
  const [cart,setCart]           = useState([]);
  const [cartInfo,setCartInfo]   = useState({table:"",guest:"",note:"",priority:false});
  const {toasts,toast,rmToast}   = useToast();
  const [guestMode,setGuestMode] = useState(false);
  const [guestTable,setGuestTable] = useState("T1");

  // Persist
  useEffect(()=>LS.set("menu",menu),[menu]);
  useEffect(()=>LS.set("inventory",inventory),[inventory]);
  useEffect(()=>LS.set("rooms",rooms),[rooms]);
  useEffect(()=>LS.set("orders",orders),[orders]);
  useEffect(()=>LS.set("pool",poolBookings),[poolBookings]);
  useEffect(()=>LS.set("schedule",schedule),[schedule]);
  useEffect(()=>LS.set("notifs",sentNotifs),[sentNotifs]);

  const canAccess = p => user && ROLES[user.role]?.access.includes(p);
  const role = user ? ROLES[user.role] : null;

  const addToCart = item => setCart(p=>{ const e=p.find(c=>c.id===item.id); return e?p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1}]; });
  const rmFromCart = id => setCart(p=>p.filter(c=>c.id!==id));
  const updQty = (id,qty) => qty<1?rmFromCart(id):setCart(p=>p.map(c=>c.id===id?{...c,qty}:c));
  const cartTotal = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const cartCount = cart.reduce((s,c)=>s+c.qty,0);

  const sendOrder = (dest) => {
    if(!cart.length){toast("Cart is empty!","error");return;}
    const src = guestMode?"Guest (QR)":cartInfo.table;
    if(!src){toast("Enter table/room!","error");return;}
    const o={id:`ORD-${String(orders.length+1).padStart(4,"0")}`,items:[...cart],
      table:guestMode?guestTable:cartInfo.table, guest:guestMode?"Guest":cartInfo.guest,
      note:cartInfo.note, priority:cartInfo.priority, destination:dest,
      status:"pending", time:new Date().toISOString(), displayTime:new Date().toLocaleTimeString(),
      total:cartTotal, staffId:user?.id||0, staffName:user?.name||"Guest (QR)", source:guestMode?"qr":"staff"};
    setOrders(p=>[o,...p]);
    toast(`Order ${o.id} sent to ${dest}!`);
    setCart([]); setCartInfo({table:"",guest:"",note:"",priority:false});
    if(guestMode) return o;
  };

  const updOrder = (id,status) => setOrders(p=>p.map(o=>o.id===id?{...o,status}:o));

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o=>new Date(o.time).toDateString()===today);
  const stats = {
    todayOrders:todayOrders.length,
    pendingOrders:orders.filter(o=>["pending","preparing"].includes(o.status)).length,
    todayRevenue:todayOrders.filter(o=>o.status==="served").reduce((s,o)=>s+o.total,0),
    totalRevenue:orders.filter(o=>o.status==="served").reduce((s,o)=>s+o.total,0),
    availRooms:rooms.filter(r=>r.status==="available").length,
    occupiedRooms:rooms.filter(r=>r.status==="occupied").length,
    lowStock:inventory.filter(i=>i.qty<=i.reorder).length,
    poolToday:poolBookings.filter(b=>b.date===new Date().toISOString().split("T")[0]).length,
  };

  if(!user && !guestMode) return (
    <div>
      <LoginScreen onLogin={u=>{setUser(u);setTab(ROLES[u.role].access[0]);}}/>
      <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)"}}>
        <button onClick={()=>setGuestMode(true)} style={{...S.btnBlue,fontSize:12,padding:"8px 16px"}}>🍽️ Guest Menu (QR)</button>
      </div>
    </div>
  );

  // ── GUEST MODE ────────────────────────────────────────────────
  if(guestMode) return <GuestMenuView menu={menu} cart={cart} cartTotal={cartTotal} cartCount={cartCount}
    addToCart={addToCart} rmFromCart={rmFromCart} updQty={updQty} guestTable={guestTable} setGuestTable={setGuestTable}
    sendOrder={(dest)=>{const o=sendOrder(dest); return o;}} onExit={()=>setGuestMode(false)} />;

  const navItems=[
    {id:"dashboard",label:"Dashboard",icon:"🏠"},
    {id:"orders",label:"Orders",icon:"📋"},
    {id:"kitchen",label:"Kitchen/Bar",icon:"🍽️"},
    {id:"menu",label:"Menu",icon:"🍴"},
    {id:"inventory",label:"Inventory",icon:"📦"},
    {id:"rooms",label:"Rooms",icon:"🛏️"},
    {id:"pool",label:"Pool",icon:"🏊"},
    {id:"shifts",label:"Shifts",icon:"📅"},
    {id:"billing",label:"Billing",icon:"💳"},
    {id:"notifications",label:"Notifications",icon:"💬"},
    {id:"analytics",label:"Analytics",icon:"📊"},
    {id:"guest",label:"Guest Menu",icon:"📱"},
  ].filter(n=>canAccess(n.id));

  return(
    <div style={{minHeight:"100vh",background:"#070d1a",color:"#e2e8f0",fontFamily:"'Lato',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <header style={{background:"#0a0f1a",borderBottom:"1px solid #1e293b",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:200}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🏨</span>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#e2b96f"}}>{HOTEL.name}</div>
            <div style={{fontSize:10,color:"#475569"}}>Staff Portal</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {cartCount>0&&(
            <button onClick={()=>setTab("orders")} style={{background:"#1e293b",border:"none",borderRadius:8,color:"#e2b96f",cursor:"pointer",padding:"6px 12px",fontSize:12,fontWeight:700}}>
              🛒 {cartCount} · KES {cartTotal.toLocaleString()}
            </button>
          )}
          {stats.pendingOrders>0&&(
            <button onClick={()=>setTab("kitchen")} style={{background:"#7f1d1d",border:"none",borderRadius:8,color:"#fca5a5",cursor:"pointer",padding:"6px 12px",fontSize:12,fontWeight:700}}>
              🔴 {stats.pendingOrders} pending
            </button>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#1e293b",borderRadius:10,padding:"5px 10px"}}>
            <span style={{fontSize:16}}>{user.avatar}</span>
            <div>
              <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{user.name.split(" ")[0]}</div>
              <div style={{fontSize:9,color:role.color}}>{role.label}</div>
            </div>
          </div>
          <button onClick={()=>setUser(null)} style={{background:"#1e293b",border:"none",borderRadius:8,color:"#64748b",cursor:"pointer",padding:"6px 10px",fontSize:11}}>Sign Out</button>
        </div>
      </header>

      <div style={{display:"flex",minHeight:"calc(100vh - 58px)"}}>
        {/* SIDEBAR */}
        <nav style={{width:180,background:"#0a0f1a",borderRight:"1px solid #1e293b",padding:"10px 0",flexShrink:0,position:"sticky",top:58,height:"calc(100vh - 58px)",overflowY:"auto"}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{
              display:"flex",alignItems:"center",gap:9,width:"100%",padding:"10px 16px",
              background:tab===n.id?"#1e3a5f":"none",
              borderLeft:`3px solid ${tab===n.id?role.color:"transparent"}`,
              border:"none",borderRight:"none",borderTop:"none",borderBottom:"none",
              borderLeftStyle:"solid",borderLeftWidth:3,borderLeftColor:tab===n.id?role.color:"transparent",
              color:tab===n.id?"#e2e8f0":"#64748b",cursor:"pointer",fontSize:12,
              fontWeight:tab===n.id?700:400,textAlign:"left"
            }}>
              <span style={{fontSize:14}}>{n.icon}</span>{n.label}
              {n.id==="kitchen"&&stats.pendingOrders>0&&<span style={{marginLeft:"auto",background:"#ef4444",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{stats.pendingOrders}</span>}
            </button>
          ))}
        </nav>

        {/* MAIN */}
        <main style={{flex:1,padding:22,overflowY:"auto",maxHeight:"calc(100vh - 58px)"}}>
          {tab==="dashboard"    && <DashboardTab stats={stats} orders={orders} rooms={rooms} user={user}/>}
          {tab==="orders"       && <OrdersTab cart={cart} cartInfo={cartInfo} setCartInfo={setCartInfo} cartTotal={cartTotal} menu={menu} addToCart={addToCart} rmFromCart={rmFromCart} updQty={updQty} sendOrder={sendOrder} orders={orders} updOrder={updOrder} toast={toast} user={user}/>}
          {tab==="kitchen"      && <KitchenTab orders={orders} updOrder={updOrder} user={user} toast={toast}/>}
          {tab==="menu"         && <MenuTab menu={menu} setMenu={setMenu} toast={toast}/>}
          {tab==="inventory"    && <InventoryTab inventory={inventory} setInventory={setInventory} toast={toast}/>}
          {tab==="rooms"        && <RoomsTab rooms={rooms} setRooms={setRooms} toast={toast}/>}
          {tab==="pool"         && <PoolTab poolBookings={poolBookings} setPool={setPool} toast={toast}/>}
          {tab==="shifts"       && <ShiftsTab schedule={schedule} setSchedule={setSchedule} toast={toast}/>}
          {tab==="billing"      && <BillingTab orders={orders} updOrder={updOrder} toast={toast}/>}
          {tab==="notifications"&& <NotificationsTab sentNotifs={sentNotifs} setSentNotifs={setSentNotifs} orders={orders} toast={toast}/>}
          {tab==="analytics"    && <AnalyticsTab orders={orders} rooms={rooms} inventory={inventory}/>}
          {tab==="guest"        && <GuestQRTab setGuestMode={setGuestMode}/>}
        </main>
      </div>
      <Toast toasts={toasts} rm={rmToast}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GUEST MENU VIEW (Mobile-first QR experience)
// ═══════════════════════════════════════════════════════════════
function GuestMenuView({menu,cart,cartTotal,cartCount,addToCart,rmFromCart,updQty,guestTable,setGuestTable,sendOrder,onExit}) {
  const [activecat,setActiveCat] = useState(Object.keys(menu)[0]);
  const [showCart,setShowCart] = useState(false);
  const [guestName,setGuestName] = useState("");
  const [note,setNote] = useState("");
  const [ordered,setOrdered] = useState(false);
  const [orderId,setOrderId] = useState("");

  const allItems = Object.values(menu).flat().filter(i=>i.avail);

  const place = () => {
    const o = sendOrder("Kitchen");
    setOrderId(o?.id||`ORD-${Date.now().toString(36).toUpperCase()}`);
    setOrdered(true);
    setShowCart(false);
  };

  if(ordered) return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#070d1a,#0f2444)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,fontFamily:"'Lato',sans-serif",textAlign:"center"}}>
      <div style={{fontSize:72,marginBottom:16}}>✅</div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",fontSize:26,margin:"0 0 8px"}}>Order Received!</h1>
      <p style={{color:"#94a3b8",margin:"0 0 6px",fontSize:14}}>Sent to our kitchen — we'll bring it to you shortly.</p>
      <p style={{color:"#60a5fa",fontSize:12,fontFamily:"monospace",background:"#1e293b",padding:"5px 14px",borderRadius:8}}>#{orderId}</p>
      <p style={{color:"#475569",fontSize:12,marginTop:12}}>Table <strong style={{color:"#e2e8f0"}}>{guestTable}</strong></p>
      <div style={{display:"flex",gap:10,marginTop:24}}>
        <button onClick={()=>setOrdered(false)} style={{...S.btnGold,fontSize:14}}>Order More</button>
        <button onClick={onExit} style={{...S.btnBlue,fontSize:14}}>← Staff Portal</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#070d1a",fontFamily:"'Lato',sans-serif",paddingBottom:cartCount>0?88:0}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
      {/* Header */}
      <div style={{background:"linear-gradient(160deg,#0a0f1a,#0f2444)",padding:"24px 16px 20px",textAlign:"center",borderBottom:"1px solid #1e293b"}}>
        <div style={{fontSize:32,marginBottom:4}}>🏨</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",fontSize:20,margin:"0 0 4px"}}>{HOTEL.name}</h1>
        <p style={{color:"#475569",fontSize:11,margin:"0 0 12px"}}>Fine Dining & Bar</p>
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
          <span style={{color:"#94a3b8",fontSize:12}}>Table:</span>
          <select value={guestTable} onChange={e=>setGuestTable(e.target.value)}
            style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#e2b96f",padding:"5px 10px",fontSize:13,fontWeight:700,outline:"none"}}>
            {["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10"].concat(["Room 101","Room 102","Room 201","Room 202","Pool Area"]).map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{display:"flex",overflowX:"auto",borderBottom:"1px solid #1e293b",scrollbarWidth:"none"}}>
        {Object.keys(menu).map(cat=>(
          <button key={cat} onClick={()=>setActiveCat(cat)} style={{flexShrink:0,padding:"12px 14px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:activecat===cat?"#e2b96f":"#64748b",borderBottom:`2px solid ${activecat===cat?"#e2b96f":"transparent"}`,whiteSpace:"nowrap"}}>
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{padding:"14px 12px"}}>
        {(menu[activecat]||[]).filter(i=>i.avail).map(item=>{
          const inCart=cart.find(c=>c.id===item.id);
          const tag=TAG_COLORS[item.tag];
          return(
            <div key={item.id} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:48,height:48,background:"#1e293b",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji||"🍴"}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:3}}>
                  <span style={{fontWeight:700,color:"#e2e8f0",fontSize:14}}>{item.name}</span>
                  {item.tag&&tag&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:tag.bg,color:tag.c,fontWeight:700}}>{item.tag}</span>}
                </div>
                {item.desc&&<p style={{color:"#64748b",fontSize:11,margin:"0 0 8px",lineHeight:1.5}}>{item.desc}</p>}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{color:"#e2b96f",fontWeight:800,fontSize:15}}>KES {item.price.toLocaleString()}</span>
                  {!inCart
                    ?<button onClick={()=>addToCart(item)} style={{...S.btnGold,padding:"6px 16px",fontSize:12}}>Add</button>
                    :<div style={{display:"flex",alignItems:"center",gap:8,background:"#1e293b",borderRadius:8,padding:"4px 10px"}}>
                      <button onClick={()=>updQty(item.id,inCart.qty-1)} style={{background:"none",border:"none",color:"#e2b96f",cursor:"pointer",fontSize:17,fontWeight:700,lineHeight:1}}>−</button>
                      <span style={{fontWeight:800,color:"#e2e8f0",minWidth:18,textAlign:"center"}}>{inCart.qty}</span>
                      <button onClick={()=>updQty(item.id,inCart.qty+1)} style={{background:"none",border:"none",color:"#e2b96f",cursor:"pointer",fontSize:17,fontWeight:700,lineHeight:1}}>+</button>
                    </div>
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Float cart */}
      {cartCount>0&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"10px 14px 14px",background:"linear-gradient(transparent,#070d1a 28%)"}}>
          <button onClick={()=>setShowCart(true)} style={{width:"100%",background:"linear-gradient(135deg,#b8860b,#e2b96f)",color:"#0a0f1a",border:"none",borderRadius:12,padding:14,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 8px 32px rgba(226,185,111,0.3)"}}>
            <span style={{background:"#0a0f1a",color:"#e2b96f",borderRadius:6,padding:"2px 8px",fontSize:12}}>{cartCount} items</span>
            <span>View Order</span>
            <span>KES {cartTotal.toLocaleString()}</span>
          </button>
        </div>
      )}

      {/* Cart sheet */}
      {showCart&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000}} onClick={()=>setShowCart(false)}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#0f172a",borderRadius:"18px 18px 0 0",padding:22,maxHeight:"82vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:34,height:4,background:"#334155",borderRadius:2,margin:"0 auto 18px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 14px",fontSize:18}}>Your Order</h2>
            <div style={{marginBottom:12}}>
              <label style={S.label}>Your Name (optional)</label>
              <input value={guestName} onChange={e=>setGuestName(e.target.value)} placeholder="e.g. James" style={S.input}/>
            </div>
            {cart.map(item=>(
              <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #1e293b"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{item.emoji} {item.name}</div>
                  <div style={{fontSize:12,color:"#e2b96f"}}>KES {(item.price*item.qty).toLocaleString()}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,background:"#1e293b",borderRadius:8,padding:"4px 10px"}}>
                  <button onClick={()=>updQty(item.id,item.qty-1)} style={{background:"none",border:"none",color:"#e2b96f",cursor:"pointer",fontSize:16,fontWeight:700}}>−</button>
                  <span style={{fontWeight:800,color:"#e2e8f0",minWidth:18,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={()=>updQty(item.id,item.qty+1)} style={{background:"none",border:"none",color:"#e2b96f",cursor:"pointer",fontSize:16,fontWeight:700}}>+</button>
                </div>
              </div>
            ))}
            <div style={{marginTop:12}}>
              <label style={S.label}>Special Requests</label>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Allergies, preferences..." style={{...S.input,minHeight:60,resize:"none"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0",fontWeight:800,color:"#e2b96f",fontSize:16,borderTop:"1px solid #334155",marginTop:8}}>
              <span>Total</span><span>KES {cartTotal.toLocaleString()}</span>
            </div>
            <button onClick={place} style={{width:"100%",...S.btnGold,padding:15,fontSize:15,borderRadius:12}}>Place Order →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function DashboardTab({stats,orders,rooms,user}) {
  const role=ROLES[user.role];
  const cards=[
    {l:"Today's Orders",v:stats.todayOrders,c:"#e2b96f",icon:"📋"},
    {l:"Active Orders",v:stats.pendingOrders,c:"#f87171",icon:"🔥"},
    {l:"Today Revenue",v:`KES ${stats.todayRevenue.toLocaleString()}`,c:"#34d399",icon:"💰"},
    {l:"Available Rooms",v:stats.availRooms,c:"#60a5fa",icon:"🛏️"},
    {l:"Occupied Rooms",v:stats.occupiedRooms,c:"#a78bfa",icon:"👥"},
    {l:"Pool Bookings",v:stats.poolToday,c:"#22d3ee",icon:"🏊"},
    {l:"Low Stock",v:stats.lowStock,c:"#f87171",icon:"⚠️"},
    {l:"Total Revenue",v:`KES ${stats.totalRevenue.toLocaleString()}`,c:"#34d399",icon:"📊"},
  ];
  const active=orders.filter(o=>["pending","preparing"].includes(o.status));
  const roomsByFloor=rooms.reduce((a,r)=>{(a[r.floor]=a[r.floor]||[]).push(r);return a;},{});
  return(
    <div>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 3px",fontSize:24}}>Good {new Date().getHours()<12?"Morning":"Afternoon"}, {user.name.split(" ")[0]} 👋</h1>
        <p style={{color:"#64748b",margin:0,fontSize:12}}>{new Date().toLocaleDateString("en-KE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:22}}>
        {cards.map(c=>(
          <div key={c.l} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
            <div style={{fontSize:20,marginBottom:6}}>{c.icon}</div>
            <div style={{fontSize:20,fontWeight:800,color:c.c}}>{c.v}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:3}}>{c.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
          <h3 style={{color:"#e2b96f",margin:"0 0 12px",fontFamily:"'Playfair Display',serif",fontSize:14}}>🔥 Live Orders</h3>
          {active.length===0?<p style={{color:"#475569",fontSize:13}}>No active orders.</p>:active.map(o=>(
            <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #1e293b"}}>
              <div>
                <div style={{fontSize:12,color:"#e2b96f",fontWeight:700}}>{o.id}</div>
                <div style={{fontSize:11,color:"#64748b"}}>Table {o.table} · {o.destination}</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                {o.priority&&<Badge c="#fca5a5" bg="#7f1d1d">URGENT</Badge>}
                <Badge c={o.status==="pending"?"#fca5a5":"#fcd34d"} bg={o.status==="pending"?"#7f1d1d":"#78350f"}>{o.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
          <h3 style={{color:"#e2b96f",margin:"0 0 12px",fontFamily:"'Playfair Display',serif",fontSize:14}}>🛏️ Room Map</h3>
          {Object.entries(roomsByFloor).map(([floor,frooms])=>(
            <div key={floor} style={{marginBottom:10}}>
              <div style={{fontSize:10,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em"}}>Floor {floor}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {frooms.map(r=>(
                  <div key={r.id} title={r.guest||r.type} style={{width:42,padding:"5px 2px",background:r.status==="available"?"#064e3b":r.status==="occupied"?"#1e3a5f":"#78350f",borderRadius:6,textAlign:"center",cursor:"default"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#e2e8f0"}}>{r.id}</div>
                    <div style={{fontSize:8,color:"#94a3b8",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.status==="occupied"?r.guest?.split(" ")[0]:r.type.slice(0,3)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ORDERS TAB
// ═══════════════════════════════════════════════════════════════
function OrdersTab({cart,cartInfo,setCartInfo,cartTotal,menu,addToCart,rmFromCart,updQty,sendOrder,orders,updOrder,toast,user}) {
  const [subTab,setSubTab] = useState("new");
  const [activecat,setActiveCat] = useState(Object.keys(menu)[0]);
  const [search,setSearch] = useState("");
  const displayItems = search ? Object.values(menu).flat().filter(i=>i.name.toLowerCase().includes(search.toLowerCase())&&i.avail) : (menu[activecat]||[]).filter(i=>i.avail);
  const cartCount = cart.reduce((s,c)=>s+c.qty,0);

  return(
    <div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 16px",fontSize:24}}>Orders</h1>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {["new","history"].map(t=>(
          <button key={t} onClick={()=>setSubTab(t)} style={subTab===t?S.btnGold:S.btnBlue}>{t==="new"?"+ New Order":"History"}</button>
        ))}
      </div>

      {subTab==="new"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16}}>
          <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search menu..." style={{...S.input,marginBottom:12}}/>
            {!search&&(
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                {Object.keys(menu).map(c=>(
                  <button key={c} onClick={()=>setActiveCat(c)} style={{padding:"4px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:activecat===c?"linear-gradient(135deg,#b8860b,#e2b96f)":"#1e293b",color:activecat===c?"#0a0f1a":"#94a3b8"}}>{c}</button>
                ))}
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
              {displayItems.map(item=>{
                const inCart=cart.find(c=>c.id===item.id);
                return(
                  <div key={item.id}
                    style={{background:"#0a0f1a",border:`1px solid ${inCart?"#e2b96f":"#1e293b"}`,borderRadius:10,padding:12,cursor:"pointer",transition:"all 0.15s"}}
                    onClick={()=>addToCart(item)}>
                    <div style={{fontSize:20,marginBottom:5}}>{item.emoji||"🍴"}</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",marginBottom:3,lineHeight:1.3}}>{item.name}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12,color:"#e2b96f",fontWeight:700}}>KES {item.price.toLocaleString()}</span>
                      {inCart&&<span style={{fontSize:11,background:"#e2b96f",color:"#0a0f1a",borderRadius:20,padding:"1px 7px",fontWeight:800}}>×{inCart.qty}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
              <h3 style={{color:"#e2b96f",margin:"0 0 12px",fontSize:14,fontFamily:"'Playfair Display',serif"}}>Order Info</h3>
              <div style={{marginBottom:10}}><label style={S.label}>Table / Room *</label><input style={S.input} value={cartInfo.table} onChange={e=>setCartInfo(f=>({...f,table:e.target.value}))} placeholder="e.g. T5 or Room 201"/></div>
              <div style={{marginBottom:10}}><label style={S.label}>Guest Name</label><input style={S.input} value={cartInfo.guest} onChange={e=>setCartInfo(f=>({...f,guest:e.target.value}))} placeholder="Optional"/></div>
              <div style={{marginBottom:10}}><label style={S.label}>Note for Kitchen</label><textarea style={{...S.input,minHeight:50,resize:"vertical"}} value={cartInfo.note} onChange={e=>setCartInfo(f=>({...f,note:e.target.value}))} placeholder="Allergies, preferences..."/></div>
              <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}>
                <input type="checkbox" checked={cartInfo.priority} onChange={e=>setCartInfo(f=>({...f,priority:e.target.checked}))} style={{width:14,height:14,accentColor:"#ef4444"}}/>
                <span style={{color:"#fca5a5",fontSize:12,fontWeight:700}}>🔴 Priority / Urgent</span>
              </label>
            </div>

            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
              <h3 style={{color:"#e2b96f",margin:"0 0 10px",fontSize:14,fontFamily:"'Playfair Display',serif"}}>Cart ({cartCount})</h3>
              {cart.length===0?<p style={{color:"#475569",fontSize:12,textAlign:"center",padding:12}}>Tap items to add</p>:(
                <>
                  {cart.map(item=>(
                    <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #1e293b"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:"#e2e8f0",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                        <div style={{fontSize:11,color:"#e2b96f"}}>KES {(item.price*item.qty).toLocaleString()}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginLeft:6}}>
                        <button onClick={()=>updQty(item.id,item.qty-1)} style={{width:20,height:20,background:"#1e293b",border:"none",borderRadius:4,color:"#e2e8f0",cursor:"pointer",fontSize:13}}>−</button>
                        <span style={{fontSize:12,minWidth:16,textAlign:"center"}}>{item.qty}</span>
                        <button onClick={()=>updQty(item.id,item.qty+1)} style={{width:20,height:20,background:"#1e293b",border:"none",borderRadius:4,color:"#e2e8f0",cursor:"pointer",fontSize:13}}>+</button>
                        <button onClick={()=>rmFromCart(item.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>✕</button>
                      </div>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontWeight:800,color:"#e2b96f",fontSize:14,borderTop:"1px solid #334155"}}>
                    <span>Total</span><span>KES {cartTotal.toLocaleString()}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>sendOrder("Kitchen")} style={{...S.btnGold,flex:1,fontSize:11,padding:"8px 4px"}}>🍽️ Kitchen</button>
                    <button onClick={()=>sendOrder("Bar")} style={{...S.btnBlue,flex:1,fontSize:11,padding:"8px 4px"}}>🍹 Bar</button>
                  </div>
                  <button onClick={()=>sendOrder("Both")} style={{...S.btnBlue,width:"100%",marginTop:6,fontSize:11}}>Send to Both</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {subTab==="history"&&(
        <div>
          {orders.length===0?<p style={{color:"#64748b"}}>No orders yet.</p>:orders.map(o=>{
            const sc={pending:{c:"#fca5a5",bg:"#7f1d1d"},preparing:{c:"#fcd34d",bg:"#78350f"},ready:{c:"#93c5fd",bg:"#1e3a5f"},served:{c:"#6ee7b7",bg:"#065f46"},cancelled:{c:"#94a3b8",bg:"#1e293b"}};
            const s=sc[o.status]||sc.cancelled;
            return(
              <div key={o.id} style={{background:"#0f172a",border:`1px solid ${o.priority?"#7f1d1d":"#1e293b"}`,borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:6}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,color:"#e2b96f",fontSize:14}}>{o.id}</span>
                    {o.priority&&<Badge c="#fca5a5" bg="#7f1d1d">🔴 PRIORITY</Badge>}
                    {o.source==="qr"&&<Badge c="#a78bfa" bg="#1e1b4b">📱 QR</Badge>}
                    <span style={{color:"#64748b",fontSize:12}}>Table {o.table}{o.guest?` · ${o.guest}`:""}</span>
                  </div>
                  <Badge c={s.c} bg={s.bg}>{o.status}</Badge>
                </div>
                <div style={{fontSize:11,color:"#64748b",marginBottom:6}}>{o.destination} · {o.displayTime} · KES {o.total.toLocaleString()} · {o.staffName}</div>
                {o.note&&<div style={{fontSize:11,color:"#fcd34d",marginBottom:6}}>📝 {o.note}</div>}
                <div style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>{o.items.map(i=>`${i.name} ×${i.qty}`).join(" · ")}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                  {["pending","preparing","ready","served","cancelled"].map(st=>(
                    <button key={st} onClick={()=>updOrder(o.id,st)} style={{fontSize:10,padding:"3px 9px",border:"none",borderRadius:5,cursor:"pointer",background:o.status===st?"#1e3a5f":"#1e293b",color:o.status===st?"#60a5fa":"#64748b"}}>{st}</button>
                  ))}
                  {o.status==="served"&&<button onClick={()=>printReceipt(o)} style={{marginLeft:"auto",background:"#1e293b",border:"1px solid #334155",borderRadius:7,color:"#e2b96f",cursor:"pointer",padding:"3px 10px",fontSize:10,fontWeight:700}}>🖨️ Receipt</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// KITCHEN / BAR TAB
// ═══════════════════════════════════════════════════════════════
function KitchenTab({orders,updOrder,user,toast}) {
  const [view,setView] = useState(user.role==="bartender"?"Bar":"Kitchen");
  const [filter,setFilter] = useState("active");
  const active = orders.filter(o=>{
    const dm=o.destination===view||o.destination==="Both";
    if(filter==="active") return dm&&["pending","preparing"].includes(o.status);
    if(filter==="ready") return dm&&o.status==="ready";
    return dm&&o.status!=="cancelled";
  });
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:18}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:0,fontSize:24}}>{view} Display</h1>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:3,background:"#0f172a",borderRadius:8,padding:3}}>
            {["Kitchen","Bar"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"6px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:view===v?"linear-gradient(135deg,#b8860b,#e2b96f)":"none",color:view===v?"#0a0f1a":"#64748b"}}>{v==="Kitchen"?"🍽️":"🍹"} {v}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:3,background:"#0f172a",borderRadius:8,padding:3}}>
            {[["active","Active"],["ready","Ready"],["all","All"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)} style={{padding:"6px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filter===k?"#1e3a5f":"none",color:filter===k?"#60a5fa":"#64748b"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      {active.length===0?(
        <div style={{textAlign:"center",padding:70,color:"#475569"}}>
          <div style={{fontSize:52,marginBottom:10}}>{view==="Kitchen"?"🍽️":"🍹"}</div>
          <p style={{fontSize:15}}>No orders in queue</p>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {active.map(o=><KitchenCard key={o.id} o={o} updOrder={updOrder} toast={toast}/>)}
        </div>
      )}
    </div>
  );
}

function KitchenCard({o,updOrder,toast}) {
  const timer=useOrderTimer(o.time);
  const bc=o.priority?"#ef4444":timer.urgent?"#f97316":timer.warning?"#f59e0b":o.status==="pending"?"#334155":"#1e3a5f";
  return(
    <div style={{background:"#0f172a",border:`2px solid ${bc}`,borderRadius:14,padding:18,position:"relative",transition:"border-color 0.3s"}}>
      <div style={{position:"absolute",top:12,right:12,background:timer.urgent?"#7f1d1d":timer.warning?"#78350f":"#1e293b",color:timer.urgent?"#fca5a5":timer.warning?"#fcd34d":"#94a3b8",borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:700,fontFamily:"monospace"}}>⏱ {timer.label}</div>
      <div style={{marginBottom:8}}>
        {o.priority&&<div style={{fontSize:10,background:"#7f1d1d",color:"#fca5a5",borderRadius:4,padding:"2px 8px",display:"inline-block",marginBottom:5,fontWeight:700}}>🔴 PRIORITY</div>}
        <div style={{fontWeight:800,color:"#e2b96f",fontSize:17}}>Table {o.table}</div>
        <div style={{fontSize:11,color:"#64748b"}}>{o.id} · {o.displayTime}{o.guest?` · ${o.guest}`:""}</div>
        {o.source==="qr"&&<Badge c="#a78bfa" bg="#1e1b4b">📱 Guest QR</Badge>}
      </div>
      {o.note&&<div style={{background:"#1e293b",border:"1px solid #f59e0b",borderRadius:7,padding:"7px 10px",marginBottom:10,fontSize:11,color:"#fcd34d"}}>📝 {o.note}</div>}
      <div style={{marginBottom:12}}>
        {o.items.map((item,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"1px solid #1e293b"}}>
            <span style={{color:"#e2e8f0",fontWeight:600}}>{item.emoji||""} {item.name}</span>
            <span style={{color:"#e2b96f",fontWeight:800,fontSize:15}}>×{item.qty}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:7}}>
        {o.status==="pending"&&<button onClick={()=>{updOrder(o.id,"preparing");toast(`Started ${o.id}`)}} style={{...S.btnGold,flex:1,fontSize:12,padding:"8px"}}>🔥 Start</button>}
        {o.status==="preparing"&&<button onClick={()=>{updOrder(o.id,"ready");toast(`${o.id} ready!`)}} style={{background:"linear-gradient(135deg,#065f46,#34d399)",color:"#fff",border:"none",flex:1,borderRadius:8,cursor:"pointer",fontSize:12,padding:"8px",fontWeight:700}}>✅ Ready</button>}
        {o.status==="ready"&&<button onClick={()=>{updOrder(o.id,"served");toast(`${o.id} served`)}} style={{...S.btnBlue,flex:1,fontSize:12,padding:"8px"}}>🍽️ Served</button>}
        <button onClick={()=>{updOrder(o.id,"cancelled");toast(`${o.id} cancelled`,"error")}} style={{background:"#1e293b",border:"none",borderRadius:8,color:"#ef4444",cursor:"pointer",padding:"8px 10px",fontSize:12}}>✕</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENU TAB
// ═══════════════════════════════════════════════════════════════
function MenuTab({menu,setMenu,toast}) {
  const [modal,setModal]=useState(false);
  const [edit,setEdit]=useState(null);
  const [form,setForm]=useState({name:"",price:"",cat:Object.keys(menu)[0],avail:true,emoji:"🍴",desc:"",tag:""});
  const open=(item=null)=>{setEdit(item);setForm(item?{name:item.name,price:item.price,cat:item.cat,avail:item.avail,emoji:item.emoji||"🍴",desc:item.desc||"",tag:item.tag||""}:{name:"",price:"",cat:Object.keys(menu)[0],avail:true,emoji:"🍴",desc:"",tag:""});setModal(true);};
  const save=()=>{
    if(!form.name||!form.price){toast("Fill required fields!","error");return;}
    if(edit){
      const upd={...edit,...form,price:Number(form.price)};
      setMenu(prev=>{const n={...prev};if(edit.cat!==form.cat){n[edit.cat]=n[edit.cat].filter(i=>i.id!==edit.id);n[form.cat]=[...(n[form.cat]||[]),upd];}else{n[form.cat]=n[form.cat].map(i=>i.id===edit.id?upd:i);}return n;});
      toast("Updated!");
    }else{
      const ni={id:Date.now(),...form,price:Number(form.price)};
      setMenu(prev=>({...prev,[form.cat]:[...(prev[form.cat]||[]),ni]}));
      toast("Item added!");
    }
    setModal(false);
  };
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:0,fontSize:24}}>Menu Management</h1>
        <button onClick={()=>open()} style={S.btnGold}>+ Add Item</button>
      </div>
      {Object.entries(menu).map(([cat,items])=>(
        <div key={cat} style={{marginBottom:22}}>
          <h3 style={{color:"#60a5fa",margin:"0 0 10px",fontSize:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>{cat} ({items.length})</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
            {items.map(item=>(
              <div key={item.id} style={{background:"#0f172a",border:`1px solid ${item.avail?"#1e293b":"#7f1d1d"}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:18,marginBottom:5}}>{item.emoji||"🍴"}</div>
                <div style={{fontWeight:700,color:"#e2e8f0",marginBottom:3,fontSize:13}}>{item.name}</div>
                <div style={{color:"#e2b96f",fontWeight:800,marginBottom:10,fontSize:14}}>KES {item.price.toLocaleString()}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  <button onClick={()=>setMenu(p=>({...p,[cat]:p[cat].map(i=>i.id===item.id?{...i,avail:!i.avail}:i)}))} style={{fontSize:10,padding:"3px 9px",border:"none",borderRadius:5,cursor:"pointer",background:item.avail?"#065f46":"#7f1d1d",color:item.avail?"#6ee7b7":"#fca5a5"}}>
                    {item.avail?"✓ Available":"✗ Unavail"}
                  </button>
                  <button onClick={()=>open(item)} style={{background:"#1e293b",border:"none",borderRadius:5,color:"#94a3b8",cursor:"pointer",padding:"3px 7px",fontSize:11}}>✏️</button>
                  <button onClick={()=>{setMenu(p=>({...p,[cat]:p[cat].filter(i=>i.id!==item.id)}));toast("Removed","error")}} style={{background:"#1e293b",border:"none",borderRadius:5,color:"#ef4444",cursor:"pointer",padding:"3px 7px",fontSize:11}}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {modal&&(
        <Modal title={edit?"Edit Item":"Add Menu Item"} onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"60px 1fr",gap:10,alignItems:"end"}}>
              <div><label style={S.label}>Emoji</label><input style={S.input} value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))} maxLength={2}/></div>
              <div><label style={S.label}>Item Name *</label><input style={S.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={S.label}>Price (KES) *</label><input type="number" style={S.input} value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/></div>
              <div><label style={S.label}>Category</label>
                <select style={S.input} value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
                  {Object.keys(menu).map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div><label style={S.label}>Description</label><input style={S.input} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Optional short description"/></div>
            <div><label style={S.label}>Tag</label><input style={S.input} value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))} placeholder="e.g. Popular, Vegan, Spicy"/></div>
            <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}>
              <input type="checkbox" checked={form.avail} onChange={e=>setForm(f=>({...f,avail:e.target.checked}))} style={{width:14,height:14}}/>
              <span style={{color:"#94a3b8",fontSize:12}}>Available</span>
            </label>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal(false)} style={S.btnBlue}>Cancel</button>
              <button onClick={save} style={S.btnGold}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INVENTORY TAB
// ═══════════════════════════════════════════════════════════════
function InventoryTab({inventory,setInventory,toast}) {
  const [modal,setModal]=useState(false);
  const [edit,setEdit]=useState(null);
  const [form,setForm]=useState({name:"",qty:"",unit:"",reorder:"",cat:""});
  const open=(item=null)=>{setEdit(item);setForm(item?{...item}:{name:"",qty:"",unit:"",reorder:"",cat:""});setModal(true);};
  const save=()=>{
    if(!form.name){toast("Enter name!","error");return;}
    if(edit) setInventory(p=>p.map(i=>i.id===edit.id?{...i,...form,qty:Number(form.qty),reorder:Number(form.reorder)}:i));
    else setInventory(p=>[...p,{id:Date.now(),...form,qty:Number(form.qty),reorder:Number(form.reorder)}]);
    toast(edit?"Updated!":"Added!");setModal(false);
  };
  const adj=(id,d)=>setInventory(p=>p.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i));
  const low=inventory.filter(i=>i.qty<=i.reorder);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:low.length?12:20}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:0,fontSize:24}}>Inventory</h1>
        <button onClick={()=>open()} style={S.btnGold}>+ Add Item</button>
      </div>
      {low.length>0&&<div style={{background:"#78350f",border:"1px solid #f59e0b",borderRadius:10,padding:"10px 14px",marginBottom:18,fontSize:12,color:"#fcd34d"}}>⚠️ Low stock: {low.map(i=>i.name).join(", ")}</div>}
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
          <thead><tr style={{background:"#1e293b"}}>
            {["Item","Category","Quantity","Status","Actions"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {inventory.map((item,i)=>{
              const isLow=item.qty<=item.reorder;
              return(
                <tr key={item.id} style={{borderBottom:"1px solid #1e293b",background:i%2?"#0a0f1a":"transparent"}}>
                  <td style={{padding:"9px 14px",color:"#e2e8f0",fontSize:13,fontWeight:600}}>{item.name}</td>
                  <td style={{padding:"9px 14px",color:"#94a3b8",fontSize:12}}>{item.cat}</td>
                  <td style={{padding:"9px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <button onClick={()=>adj(item.id,-1)} style={{width:20,height:20,background:"#1e293b",border:"none",borderRadius:4,color:"#e2e8f0",cursor:"pointer",fontSize:13}}>−</button>
                      <span style={{color:isLow?"#ef4444":"#e2e8f0",fontWeight:700,minWidth:50,textAlign:"center",fontSize:13}}>{item.qty} {item.unit}</span>
                      <button onClick={()=>adj(item.id,1)} style={{width:20,height:20,background:"#1e293b",border:"none",borderRadius:4,color:"#e2e8f0",cursor:"pointer",fontSize:13}}>+</button>
                    </div>
                  </td>
                  <td style={{padding:"9px 14px"}}><Badge c={isLow?"#fca5a5":"#6ee7b7"} bg={isLow?"#7f1d1d":"#065f46"}>{isLow?"Low Stock":"OK"}</Badge></td>
                  <td style={{padding:"9px 14px"}}>
                    <button onClick={()=>open(item)} style={{background:"#1e293b",border:"none",borderRadius:6,color:"#94a3b8",cursor:"pointer",padding:"4px 9px",fontSize:11}}>✏️ Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modal&&(
        <Modal title={edit?"Edit Item":"Add Item"} onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={S.label}>Name *</label><input style={S.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={S.label}>Qty</label><input type="number" style={S.input} value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
              <div><label style={S.label}>Unit</label><input style={S.input} value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} placeholder="kg, L, bottle..."/></div>
              <div><label style={S.label}>Reorder Level</label><input type="number" style={S.input} value={form.reorder} onChange={e=>setForm(f=>({...f,reorder:e.target.value}))}/></div>
              <div><label style={S.label}>Category</label><input style={S.input} value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}/></div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal(false)} style={S.btnBlue}>Cancel</button>
              <button onClick={save} style={S.btnGold}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOMS TAB
// ═══════════════════════════════════════════════════════════════
function RoomsTab({rooms,setRooms,toast}) {
  const [modal,setModal]=useState(false);
  const [sel,setSel]=useState(null);
  const [action,setAction]=useState("checkin");
  const [form,setForm]=useState({guest:"",checkIn:"",checkOut:""});
  const open=r=>{setSel(r);setAction(r.status==="occupied"?"checkout":"checkin");setForm({guest:r.guest||"",checkIn:r.checkIn||"",checkOut:r.checkOut||""});setModal(true);};
  const confirm=()=>{
    if(action==="checkin"){
      if(!form.guest||!form.checkIn||!form.checkOut){toast("Fill all fields!","error");return;}
      setRooms(p=>p.map(r=>r.id===sel.id?{...r,status:"occupied",guest:form.guest,checkIn:form.checkIn,checkOut:form.checkOut}:r));
      toast(`Room ${sel.id} booked!`);
    }else if(action==="checkout"){
      setRooms(p=>p.map(r=>r.id===sel.id?{...r,status:"available",guest:undefined,checkIn:undefined,checkOut:undefined}:r));
      toast(`Room ${sel.id} checked out`);
    }else{
      setRooms(p=>p.map(r=>r.id===sel.id?{...r,status:"maintenance",guest:undefined}:r));
      toast(`Room ${sel.id} → maintenance`);
    }
    setModal(false);
  };
  const byFloor=rooms.reduce((a,r)=>{(a[r.floor]=a[r.floor]||[]).push(r);return a;},{});
  return(
    <div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 16px",fontSize:24}}>Room Management</h1>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
        {[["Available",rooms.filter(r=>r.status==="available").length,"#6ee7b7"],["Occupied",rooms.filter(r=>r.status==="occupied").length,"#93c5fd"],["Maintenance",rooms.filter(r=>r.status==="maintenance").length,"#fcd34d"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:"10px 18px",display:"flex",gap:9,alignItems:"center"}}>
            <span style={{fontSize:18,fontWeight:800,color:c}}>{v}</span><span style={{color:"#64748b",fontSize:12}}>{l}</span>
          </div>
        ))}
      </div>
      {Object.entries(byFloor).map(([floor,frooms])=>(
        <div key={floor} style={{marginBottom:20}}>
          <h3 style={{color:"#60a5fa",margin:"0 0 10px",fontSize:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Floor {floor}</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
            {frooms.map(r=>{
              const sc={available:{border:"#1e3a5f"},occupied:{border:"#334155"},maintenance:{border:"#78350f"}};
              const bc=sc[r.status]?.border||"#1e293b";
              return(
                <div key={r.id} style={{background:"#0f172a",border:`1px solid ${bc}`,borderRadius:12,padding:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:16,fontWeight:800,color:"#e2b96f"}}>Room {r.id}</span>
                    <Badge c={r.status==="available"?"#6ee7b7":r.status==="occupied"?"#93c5fd":"#fcd34d"} bg={r.status==="available"?"#064e3b":r.status==="occupied"?"#1e3a5f":"#78350f"}>{r.status}</Badge>
                  </div>
                  <div style={{fontSize:11,color:"#94a3b8",marginBottom:2}}>{r.type}</div>
                  <div style={{fontSize:12,color:"#e2b96f",fontWeight:700,marginBottom:6}}>KES {r.price.toLocaleString()}/night</div>
                  {r.status==="occupied"&&<div style={{fontSize:11,color:"#94a3b8",marginBottom:8}}><div>👤 {r.guest}</div><div>📅 {r.checkIn} → {r.checkOut}</div></div>}
                  <button onClick={()=>open(r)} style={{...S.btnBlue,width:"100%",fontSize:11,padding:"7px"}}>{r.status==="available"?"Check In":r.status==="occupied"?"Manage":"Update"}</button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {modal&&sel&&(
        <Modal title={`Room ${sel.id} — ${sel.type}`} onClose={()=>setModal(false)}>
          <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap"}}>
            {["checkin","checkout","maintenance"].map(a=>(
              <button key={a} onClick={()=>setAction(a)} style={{...(action===a?S.btnGold:S.btnBlue),fontSize:12}}>{a==="checkin"?"✅ Check In":a==="checkout"?"🚪 Check Out":"🔧 Maintenance"}</button>
            ))}
          </div>
          {action==="checkin"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><label style={S.label}>Guest Name *</label><input style={S.input} value={form.guest} onChange={e=>setForm(f=>({...f,guest:e.target.value}))}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={S.label}>Check In *</label><input type="date" style={S.input} value={form.checkIn} onChange={e=>setForm(f=>({...f,checkIn:e.target.value}))}/></div>
                <div><label style={S.label}>Check Out *</label><input type="date" style={S.input} value={form.checkOut} onChange={e=>setForm(f=>({...f,checkOut:e.target.value}))}/></div>
              </div>
            </div>
          )}
          {action==="checkout"&&<p style={{color:"#94a3b8",fontSize:14}}>Check out <strong style={{color:"#e2e8f0"}}>{sel.guest}</strong> from Room {sel.id}?</p>}
          {action==="maintenance"&&<p style={{color:"#94a3b8",fontSize:14}}>Set Room {sel.id} to maintenance mode?</p>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
            <button onClick={()=>setModal(false)} style={S.btnBlue}>Cancel</button>
            <button onClick={confirm} style={S.btnGold}>Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// POOL TAB
// ═══════════════════════════════════════════════════════════════
function PoolTab({poolBookings,setPool,toast}) {
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);
  const [modal,setModal]=useState(false);
  const [selSlot,setSelSlot]=useState(null);
  const [form,setForm]=useState({guest:"",room:"",n:1});
  const slotBk=id=>poolBookings.filter(b=>b.slotId===id&&b.date===date);
  const book=()=>{
    if(!form.guest){toast("Enter guest name!","error");return;}
    const booked=slotBk(selSlot.id).reduce((s,b)=>s+b.n,0);
    if(booked+Number(form.n)>selSlot.cap){toast("Slot full!","error");return;}
    setPool(p=>[...p,{id:Date.now(),slotId:selSlot.id,time:selSlot.time,date,...form,n:Number(form.n)}]);
    toast(`Pool booked for ${form.guest}!`);setModal(false);setForm({guest:"",room:"",n:1});
  };
  return(
    <div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 18px",fontSize:24}}>🏊 Pool Bookings</h1>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <label style={{color:"#94a3b8",fontSize:12}}>Date:</label>
        <input type="date" style={{...S.input,width:170}} value={date} onChange={e=>setDate(e.target.value)}/>
        <span style={{color:"#64748b",fontSize:11}}>{poolBookings.filter(b=>b.date===date).reduce((s,b)=>s+b.n,0)} guests today</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
        {POOL_SLOTS.map(slot=>{
          const bk=slotBk(slot.id);const total=bk.reduce((s,b)=>s+b.n,0);const pct=total/slot.cap*100;const full=total>=slot.cap;
          return(
            <div key={slot.id} style={{background:"#0f172a",border:`1px solid ${full?"#7f1d1d":"#1e293b"}`,borderRadius:12,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <span style={{fontWeight:700,color:"#e2b96f",fontSize:13}}>⏰ {slot.time}</span>
                <Badge c={full?"#fca5a5":"#6ee7b7"} bg={full?"#7f1d1d":"#065f46"}>{full?"Full":"Open"}</Badge>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b",marginBottom:4}}><span>{total}/{slot.cap} guests</span><span>{Math.round(pct)}%</span></div>
              <div style={{background:"#1e293b",borderRadius:4,height:5,overflow:"hidden",marginBottom:10}}>
                <div style={{width:`${pct}%`,height:"100%",background:pct>80?"#ef4444":"#e2b96f",borderRadius:4,transition:"width 0.3s"}}/>
              </div>
              {bk.map(b=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderBottom:"1px solid #1e293b"}}>
                  <span style={{color:"#e2e8f0"}}>{b.guest} ({b.n})</span>
                  <button onClick={()=>{setPool(p=>p.filter(x=>x.id!==b.id));toast("Cancelled")}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:12}}>✕</button>
                </div>
              ))}
              {!full&&<button onClick={()=>{setSelSlot(slot);setModal(true)}} style={{...S.btnBlue,width:"100%",marginTop:8,fontSize:11,padding:"7px"}}>+ Book</button>}
            </div>
          );
        })}
      </div>
      {modal&&selSlot&&(
        <Modal title={`Book Pool — ${selSlot.time}`} onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={S.label}>Guest Name *</label><input style={S.input} value={form.guest} onChange={e=>setForm(f=>({...f,guest:e.target.value}))}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={S.label}>Room No.</label><input style={S.input} value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))} placeholder="e.g. 201"/></div>
              <div><label style={S.label}>No. of Guests</label><input type="number" min={1} style={S.input} value={form.n} onChange={e=>setForm(f=>({...f,n:e.target.value}))}/></div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={()=>setModal(false)} style={S.btnBlue}>Cancel</button><button onClick={book} style={S.btnGold}>Book</button></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHIFTS TAB
// ═══════════════════════════════════════════════════════════════
function getWeekDates(offset=0) {
  const d=new Date(); d.setDate(d.getDate()-d.getDay()+1+offset*7);
  return DAYS.map((_,i)=>{const day=new Date(d);day.setDate(d.getDate()+i);return day;});
}
function ShiftsTab({schedule,setSchedule,toast}) {
  const [weekOff,setWeekOff]=useState(0);
  const [modal,setModal]=useState(null);
  const weekDates=getWeekDates(weekOff);
  const wk=weekDates[0].toISOString().split("T")[0];
  const getShift=(sid,di)=>schedule[wk]?.[sid]?.[di]||null;
  const setShift=(sid,di,shid)=>{setSchedule(p=>({...p,[wk]:{...(p[wk]||{}),[sid]:{...(p[wk]?.[sid]||{}),[di]:shid}}}));setModal(null);toast("Shift updated!");};
  const clearShift=(sid,di)=>{setSchedule(p=>{const n={...p};if(n[wk]?.[sid]){const s={...n[wk][sid]};delete s[di];n[wk]={...n[wk],[sid]:s;};}return n;});toast("Cleared");};
  const hrs=sid=>DAYS.reduce((h,_,i)=>{const sh=getShift(sid,i);return h+(sh&&sh!=="off"?8:0);},0);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 3px",fontSize:24}}>Shift Scheduling</h1>
          <p style={{color:"#64748b",margin:0,fontSize:11}}>Week of {weekDates[0].toLocaleDateString("en-KE",{month:"short",day:"numeric"})} – {weekDates[6].toLocaleDateString("en-KE",{month:"short",day:"numeric",year:"numeric"})}</p>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setWeekOff(p=>p-1)} style={{...S.btnBlue,padding:"7px 12px",fontSize:12}}>← Prev</button>
          <button onClick={()=>setWeekOff(0)} style={{...S.btnGold,padding:"7px 12px",fontSize:12}}>Today</button>
          <button onClick={()=>setWeekOff(p=>p+1)} style={{...S.btnBlue,padding:"7px 12px",fontSize:12}}>Next →</button>
        </div>
      </div>
      {/* Shift legend */}
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
        {SHIFT_TYPES.map(sh=>(
          <div key={sh.id} style={{display:"flex",alignItems:"center",gap:5,background:sh.bg,borderRadius:6,padding:"3px 9px"}}>
            <span style={{fontSize:12}}>{sh.icon}</span><span style={{fontSize:11,color:sh.color,fontWeight:600}}>{sh.label}{sh.time?` (${sh.time})`:""}</span>
          </div>
        ))}
      </div>
      {/* Grid */}
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:680}}>
          <thead>
            <tr style={{background:"#1e293b"}}>
              <th style={{padding:"10px 14px",textAlign:"left",fontSize:12,color:"#64748b",fontWeight:600,minWidth:140}}>Staff</th>
              {weekDates.map((d,i)=>{
                const isT=d.toDateString()===new Date().toDateString();
                return(
                  <th key={i} style={{padding:"10px 8px",textAlign:"center",fontSize:10,fontWeight:600,color:isT?"#e2b96f":"#64748b",background:isT?"#1a2744":"transparent",minWidth:80}}>
                    <div>{DAYS[i]}</div>
                    <div style={{opacity:0.7}}>{d.toLocaleDateString("en-KE",{month:"short",day:"numeric"})}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {STAFF_ACCOUNTS.map((s,si)=>(
              <tr key={s.id} style={{borderBottom:"1px solid #1e293b",background:si%2?"#0a0f1a":"transparent"}}>
                <td style={{padding:"9px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontSize:18}}>{s.avatar}</span>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{s.name.split(" ")[0]}</div>
                      <div style={{fontSize:10,color:ROLES[s.role].color}}>{hrs(s.id)}h</div>
                    </div>
                  </div>
                </td>
                {DAYS.map((_,di)=>{
                  const shId=getShift(s.id,di);
                  const sh=SHIFT_TYPES.find(x=>x.id===shId);
                  const isT=weekDates[di].toDateString()===new Date().toDateString();
                  return(
                    <td key={di} style={{padding:"7px",textAlign:"center",background:isT?"rgba(30,58,95,0.2)":"transparent"}}>
                      {sh?(
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                          <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:sh.bg,color:sh.color,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}} onClick={()=>setModal({sid:s.id,di})}>{sh.icon} {sh.label}</span>
                        </div>
                      ):(
                        <button onClick={()=>setModal({sid:s.id,di})} style={{background:"none",border:"1px dashed #334155",borderRadius:6,color:"#475569",cursor:"pointer",padding:"5px 8px",fontSize:10}}
                          onMouseEnter={e=>{e.target.style.borderColor="#e2b96f";e.target.style.color="#e2b96f"}}
                          onMouseLeave={e=>{e.target.style.borderColor="#334155";e.target.style.color="#475569"}}>
                          + Assign
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <Modal title="Assign Shift" onClose={()=>setModal(null)}>
          {(()=>{const s=STAFF_ACCOUNTS.find(x=>x.id===modal.sid);const d=weekDates[modal.di];return(
            <>
              <p style={{color:"#64748b",fontSize:13,margin:"0 0 18px"}}>{s.avatar} {s.name} · {DAYS[modal.di]} {d.toLocaleDateString("en-KE",{month:"short",day:"numeric"})}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {SHIFT_TYPES.map(sh=>(
                  <button key={sh.id} onClick={()=>setShift(modal.sid,modal.di,sh.id)} style={{background:sh.bg,border:`1px solid ${sh.color}40`,borderRadius:10,padding:"13px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{color:sh.color,fontWeight:700,fontSize:13}}>{sh.icon} {sh.label}</div>{sh.time&&<div style={{color:sh.color,fontSize:11,opacity:0.7}}>{sh.time}</div>}</div>
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:8,marginTop:14}}>
                {getShift(modal.sid,modal.di)&&<button onClick={()=>{clearShift(modal.sid,modal.di);setModal(null);}} style={{flex:1,background:"#7f1d1d",border:"none",borderRadius:8,color:"#fca5a5",cursor:"pointer",padding:"9px",fontSize:12}}>Clear Shift</button>}
                <button onClick={()=>setModal(null)} style={{flex:1,...S.btnBlue,padding:"9px"}}>Cancel</button>
              </div>
            </>
          );})()}
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BILLING TAB
// ═══════════════════════════════════════════════════════════════
function BillingTab({orders,updOrder,toast}) {
  const [sel,setSel]=useState(null);
  const [step,setStep]=useState("list"); // list|bill|method|mpesa|card|cash|success
  const [discount,setDiscount]=useState(0);
  const [discType,setDiscType]=useState("percent");
  const [mpesaPhone,setMpesaPhone]=useState("");
  const [mpesaStage,setMpesaStage]=useState("input");
  const [mpesaCD,setMpesaCD]=useState(30);
  const [cardForm,setCardForm]=useState({number:"",name:"",expiry:"",cvv:""});
  const [processing,setProcessing]=useState(false);
  const [payRef,setPayRef]=useState(null);

  const unpaid=orders.filter(o=>o.status==="served"&&!o.paid);
  const selOrder=orders.find(o=>o.id===sel);
  const subtotal=selOrder?.total||0;
  const discAmt=discType==="percent"?Math.round(subtotal*discount/100):discount;
  const net=Math.max(0,subtotal-discAmt);
  const tax=Math.round(net*0.16);
  const grand=net+tax;

  const onSuccess=(ref)=>{
    setPayRef(ref);setStep("success");
    updOrder(sel,"paid");
    toast(`KES ${grand.toLocaleString()} received via ${ref.method}!`);
  };

  const formatCard=v=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry=v=>{const n=v.replace(/\D/g,"").slice(0,4);return n.length>2?n.slice(0,2)+"/"+n.slice(2):n;};

  useEffect(()=>{
    if(mpesaStage!=="confirm") return;
    const t=setInterval(()=>setMpesaCD(c=>{if(c<=1){clearInterval(t);setMpesaStage("failed");return 0;}return c-1;}),1000);
    return()=>clearInterval(t);
  },[mpesaStage]);

  const printBill=()=>{
    if(!selOrder) return;
    const html=`<!DOCTYPE html><html><head><title>Bill</title><style>body{font-family:Georgia,serif;max-width:380px;margin:40px auto;font-size:13px;color:#111}h1{text-align:center;font-size:20px;margin:0}hr{border:none;border-top:1px dashed #aaa;margin:12px 0}table{width:100%;border-collapse:collapse}th{font-size:10px;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #111;text-align:left}td{padding:5px 0;border-bottom:1px solid #eee}.r{text-align:right}</style></head><body>
    <h1>${HOTEL.name}</h1><div style="text-align:center;color:#555;font-size:11px;margin:4px 0 18px">${HOTEL.tel}</div><hr>
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span><b>Table:</b> ${selOrder.table}</span><span><b>Date:</b> ${new Date().toLocaleString("en-KE")}</span></div>
    ${selOrder.guest?`<div style="font-size:12px;margin-bottom:10px"><b>Guest:</b> ${selOrder.guest}</div>`:""}
    <hr><table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Total</th></tr></thead><tbody>
    ${selOrder.items.map(i=>`<tr><td>${i.name}</td><td class="r">${i.qty}</td><td class="r">KES ${(i.price*i.qty).toLocaleString()}</td></tr>`).join("")}
    </tbody></table><hr>
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span>Subtotal</span><span>KES ${subtotal.toLocaleString()}</span></div>
    ${discAmt>0?`<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px;color:green"><span>Discount</span><span>− KES ${discAmt.toLocaleString()}</span></div>`:""}
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px"><span>VAT 16%</span><span>KES ${tax.toLocaleString()}</span></div><hr>
    <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:bold"><span>TOTAL</span><span>KES ${grand.toLocaleString()}</span></div>
    ${payRef?`<hr><div style="text-align:center;font-size:11px;color:#555">Paid via ${payRef.method.toUpperCase()} · Ref: ${payRef.ref}</div>`:""}
    <div style="text-align:center;color:#777;font-size:11px;margin-top:18px">Thank you for choosing ${HOTEL.name}!</div></body></html>`;
    const w=window.open("","_blank","width=460,height:720");w.document.write(html);w.document.close();setTimeout(()=>w.print(),500);
  };

  if(step==="list") return(
    <div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 18px",fontSize:24}}>💳 Billing & Payment</h1>
      {unpaid.length===0?<div style={{textAlign:"center",padding:60,color:"#475569"}}>
        <div style={{fontSize:48,marginBottom:10}}>✅</div><p>No pending bills</p>
      </div>:unpaid.map(o=>(
        <div key={o.id} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:700,color:"#e2b96f",fontSize:14}}>{o.id} — Table {o.table}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{o.guest||"Walk-in"} · {o.items.length} items · {o.displayTime}</div>
            <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{o.items.map(i=>`${i.name} ×${i.qty}`).join(", ")}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:16,fontWeight:800,color:"#34d399"}}>KES {o.total.toLocaleString()}</span>
            <button onClick={()=>{setSel(o.id);setStep("bill");setDiscount(0);setPayRef(null);}} style={{...S.btnGold,fontSize:12,padding:"8px 14px"}}>Collect Payment</button>
          </div>
        </div>
      ))}
    </div>
  );

  if(step==="bill"&&selOrder) return(
    <div style={{maxWidth:500}}>
      <button onClick={()=>setStep("list")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12,marginBottom:16}}>← Back to Bills</button>
      <h2 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 16px",fontSize:20}}>Bill — {selOrder.id}</h2>
      <div style={{background:"#1e293b",borderRadius:10,padding:16,marginBottom:14}}>
        {selOrder.items.map((item,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #334155",fontSize:13}}><span style={{color:"#e2e8f0"}}>{item.name} ×{item.qty}</span><span style={{color:"#94a3b8"}}>KES {(item.price*item.qty).toLocaleString()}</span></div>)}
        <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #334155"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span style={{color:"#94a3b8"}}>Subtotal</span><span style={{color:"#e2e8f0"}}>KES {subtotal.toLocaleString()}</span></div>
          {discAmt>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span style={{color:"#34d399"}}>Discount</span><span style={{color:"#34d399"}}>− KES {discAmt.toLocaleString()}</span></div>}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:8}}><span style={{color:"#94a3b8"}}>VAT (16%)</span><span style={{color:"#e2e8f0"}}>KES {tax.toLocaleString()}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800}}><span style={{color:"#e2b96f"}}>Grand Total</span><span style={{color:"#e2b96f"}}>KES {grand.toLocaleString()}</span></div>
        </div>
      </div>
      <div style={{background:"#1e293b",borderRadius:10,padding:14,marginBottom:14}}>
        <div style={{color:"#94a3b8",fontSize:11,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Discount</div>
        <div style={{display:"flex",gap:8}}>
          <input type="number" value={discount} onChange={e=>setDiscount(Math.max(0,Number(e.target.value)))} style={{flex:1,padding:"8px 10px",background:"#0f172a",border:"1px solid #334155",borderRadius:8,color:"#e2e8f0",fontSize:14,outline:"none"}}/>
          <div style={{display:"flex",background:"#0f172a",borderRadius:8,overflow:"hidden",border:"1px solid #334155"}}>
            {[["percent","%"],["fixed","KES"]].map(([v,l])=>(
              <button key={v} onClick={()=>setDiscType(v)} style={{padding:"8px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:discType===v?"#1e3a5f":"none",color:discType===v?"#60a5fa":"#64748b"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={printBill} style={{flex:1,...S.btnBlue,fontSize:12}}>🖨️ Print Bill</button>
        <button onClick={()=>setStep("method")} style={{flex:2,...S.btnGold,fontSize:14}}>Collect Payment →</button>
      </div>
    </div>
  );

  if(step==="method") return(
    <div style={{maxWidth:400}}>
      <button onClick={()=>setStep("bill")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12,marginBottom:16}}>← Back</button>
      <h2 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 6px",fontSize:20}}>Payment Method</h2>
      <p style={{color:"#64748b",fontSize:13,margin:"0 0 20px"}}>Total: <strong style={{color:"#e2b96f"}}>KES {grand.toLocaleString()}</strong></p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[{id:"mpesa",l:"M-Pesa",sub:"Lipa Na M-Pesa STK Push",icon:"📱",c:"#4caf50"},
          {id:"card",l:"Credit / Debit Card",sub:"Visa, Mastercard, Amex",icon:"💳",c:"#60a5fa"},
          {id:"cash",l:"Cash",sub:"Pay at counter",icon:"💵",c:"#e2b96f"}].map(m=>(
          <button key={m.id} onClick={()=>{setStep(m.id);setMpesaStage("input");setMpesaCD(30);setProcessing(false);}}
            style={{background:"#0f172a",border:`1px solid ${m.c}30`,borderRadius:12,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=m.c}
            onMouseLeave={e=>e.currentTarget.style.borderColor=`${m.c}30`}>
            <span style={{fontSize:26}}>{m.icon}</span>
            <div style={{textAlign:"left"}}><div style={{fontWeight:700,color:"#e2e8f0",fontSize:13}}>{m.l}</div><div style={{fontSize:11,color:"#64748b"}}>{m.sub}</div></div>
            <span style={{marginLeft:"auto",color:"#334155"}}>›</span>
          </button>
        ))}
      </div>
    </div>
  );

  if(step==="mpesa") return(
    <div style={{maxWidth:380}}>
      <button onClick={()=>setStep("method")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12,marginBottom:16}}>← Back</button>
      {mpesaStage==="input"&&(
        <div>
          <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:48}}>📱</div><h3 style={{color:"#4caf50",margin:"8px 0 4px",fontWeight:800}}>M-Pesa STK Push</h3><p style={{color:"#64748b",fontSize:13,margin:0}}>KES <strong style={{color:"#4caf50",fontSize:18}}>{grand.toLocaleString()}</strong></p></div>
          <div style={{marginBottom:14}}>
            <label style={S.label}>Safaricom Number *</label>
            <div style={{display:"flex",background:"#1e293b",border:"1px solid #334155",borderRadius:8,overflow:"hidden"}}>
              <span style={{padding:"10px 12px",color:"#64748b",fontSize:13,borderRight:"1px solid #334155"}}>+254</span>
              <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="7XX XXX XXX" style={{flex:1,padding:"10px 12px",background:"none",border:"none",color:"#e2e8f0",fontSize:13,outline:"none"}}/>
            </div>
          </div>
          <button onClick={()=>{if(!mpesaPhone){toast("Enter phone!","error");return;}setMpesaStage("pushing");setTimeout(()=>setMpesaStage("confirm"),1800);}} style={{width:"100%",background:"#4caf50",color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:14,fontWeight:800,cursor:"pointer"}}>Send STK Push →</button>
        </div>
      )}
      {mpesaStage==="pushing"&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:48,marginBottom:12}}>⏳</div><h3 style={{color:"#4caf50",margin:"0 0 8px"}}>Connecting to Safaricom...</h3></div>}
      {mpesaStage==="confirm"&&(
        <div style={{textAlign:"center",padding:"10px 0"}}>
          <div style={{fontSize:48,marginBottom:10}}>📲</div>
          <h3 style={{color:"#e2b96f",margin:"0 0 6px"}}>Check Your Phone</h3>
          <p style={{color:"#94a3b8",fontSize:13,margin:"0 0 4px"}}>STK Push sent to +254 {mpesaPhone}</p>
          <p style={{color:"#4caf50",fontWeight:700,fontSize:16,margin:"0 0 14px"}}>KES {grand.toLocaleString()}</p>
          <div style={{background:"#1e293b",borderRadius:20,height:10,width:160,margin:"0 auto 6px",overflow:"hidden",position:"relative"}}>
            <div style={{height:"100%",background:"#4caf50",borderRadius:20,width:`${(mpesaCD/30)*100}%`,transition:"width 0.9s linear"}}/>
          </div>
          <p style={{color:"#e2b96f",fontSize:13,margin:"0 0 16px"}}>{mpesaCD}s</p>
          <p style={{color:"#64748b",fontSize:11,margin:"0 0 16px"}}>Enter your M-Pesa PIN on your phone</p>
          <div style={{background:"#1e293b",borderRadius:10,padding:10,marginBottom:10}}>
            <p style={{color:"#475569",fontSize:10,margin:"0 0 6px"}}>DEMO — Simulate:</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>onSuccess({method:"mpesa",ref:`MP${Date.now()}`})} style={{flex:1,background:"#065f46",border:"none",borderRadius:7,color:"#6ee7b7",cursor:"pointer",padding:"7px",fontSize:11,fontWeight:700}}>✓ Approve</button>
              <button onClick={()=>setMpesaStage("failed")} style={{flex:1,background:"#7f1d1d",border:"none",borderRadius:7,color:"#fca5a5",cursor:"pointer",padding:"7px",fontSize:11,fontWeight:700}}>✗ Decline</button>
            </div>
          </div>
          <button onClick={()=>setStep("method")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12}}>Cancel</button>
        </div>
      )}
      {mpesaStage==="failed"&&<div style={{textAlign:"center",padding:30}}><div style={{fontSize:48,marginBottom:10}}>❌</div><h3 style={{color:"#ef4444",margin:"0 0 8px"}}>Payment Failed</h3><p style={{color:"#94a3b8",fontSize:13,margin:"0 0 18px"}}>Transaction declined or timed out.</p><button onClick={()=>setMpesaStage("input")} style={{background:"#4caf50",color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Try Again</button></div>}
    </div>
  );

  if(step==="card") return(
    <div style={{maxWidth:400}}>
      <button onClick={()=>setStep("method")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12,marginBottom:16}}>← Back</button>
      {processing?<div style={{textAlign:"center",padding:40}}><div style={{fontSize:48,marginBottom:12}}>💳</div><h3 style={{color:"#e2b96f",margin:"0 0 8px"}}>Processing...</h3></div>:(
        <div>
          <div style={{background:"linear-gradient(135deg,#1e3a5f,#0f2444)",borderRadius:14,padding:20,marginBottom:18,position:"relative",overflow:"hidden"}}>
            <div style={{fontSize:11,color:"#60a5fa",marginBottom:14,letterSpacing:"0.1em"}}>{cardForm.number.replace(/\s/g,"").startsWith("4")?"VISA":cardForm.number.replace(/\s/g,"").startsWith("5")?"MASTERCARD":"CARD"}</div>
            <div style={{fontFamily:"monospace",color:"#e2e8f0",fontSize:18,letterSpacing:"0.12em",marginBottom:18}}>{cardForm.number||"•••• •••• •••• ••••"}</div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontSize:9,color:"#64748b",marginBottom:2}}>CARDHOLDER</div><div style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{cardForm.name||"YOUR NAME"}</div></div>
              <div><div style={{fontSize:9,color:"#64748b",marginBottom:2}}>EXPIRES</div><div style={{fontSize:13,color:"#e2e8f0",fontFamily:"monospace"}}>{cardForm.expiry||"MM/YY"}</div></div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            <div><label style={S.label}>Card Number</label><input value={cardForm.number} onChange={e=>setCardForm(f=>({...f,number:formatCard(e.target.value)}))} placeholder="1234 5678 9012 3456" style={S.input}/></div>
            <div><label style={S.label}>Cardholder Name</label><input value={cardForm.name} onChange={e=>setCardForm(f=>({...f,name:e.target.value.toUpperCase()}))} placeholder="AS ON CARD" style={S.input}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={S.label}>Expiry</label><input value={cardForm.expiry} onChange={e=>setCardForm(f=>({...f,expiry:fmtExpiry(e.target.value)}))} placeholder="MM/YY" style={S.input}/></div>
              <div><label style={S.label}>CVV</label><input value={cardForm.cvv} onChange={e=>setCardForm(f=>({...f,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}))} type="password" placeholder="•••" style={S.input}/></div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#1e293b",borderRadius:7,padding:"8px 12px",marginBottom:12}}>
            <span>🔒</span><span style={{color:"#64748b",fontSize:11}}>256-bit SSL encrypted</span>
          </div>
          <button onClick={()=>{if(!cardForm.number||!cardForm.name||!cardForm.expiry||!cardForm.cvv){toast("Fill all fields!","error");return;}setProcessing(true);setTimeout(()=>{setProcessing(false);onSuccess({method:"card",ref:`CD${Date.now()}`,last4:cardForm.number.replace(/\s/g,"").slice(-4)});},2000);}} style={{width:"100%",background:"linear-gradient(135deg,#1e3a5f,#1e5f9f)",color:"#93c5fd",border:"none",borderRadius:10,padding:14,fontSize:15,fontWeight:800,cursor:"pointer"}}>
            Pay KES {grand.toLocaleString()}
          </button>
        </div>
      )}
    </div>
  );

  if(step==="cash") return(
    <div style={{maxWidth:380,textAlign:"center"}}>
      <button onClick={()=>setStep("method")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12,marginBottom:16,display:"block"}}>← Back</button>
      <div style={{fontSize:56,marginBottom:12}}>💵</div>
      <h3 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 6px",fontSize:20}}>Cash Payment</h3>
      <div style={{background:"#1e293b",borderRadius:12,padding:24,margin:"16px 0"}}>
        <div style={{color:"#64748b",fontSize:13,marginBottom:4}}>Amount Due</div>
        <div style={{color:"#e2b96f",fontSize:30,fontWeight:800,fontFamily:"monospace"}}>KES {grand.toLocaleString()}</div>
      </div>
      <button onClick={()=>onSuccess({method:"cash",ref:`CSH${Date.now()}`})} style={{width:"100%",...S.btnGold,padding:15,fontSize:16,borderRadius:12}}>✓ Cash Received</button>
    </div>
  );

  if(step==="success") return(
    <div style={{maxWidth:380,textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:64,marginBottom:12}}>✅</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",color:"#34d399",margin:"0 0 8px",fontSize:22}}>Payment Successful!</h2>
      <p style={{color:"#94a3b8",fontSize:14,margin:"0 0 4px"}}>KES {grand.toLocaleString()} via <strong style={{color:"#e2e8f0",textTransform:"capitalize"}}>{payRef?.method}</strong></p>
      <p style={{color:"#475569",fontSize:12,fontFamily:"monospace"}}>Ref: {payRef?.ref}</p>
      <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"center"}}>
        <button onClick={printBill} style={{...S.btnBlue,fontSize:13}}>🖨️ Print Receipt</button>
        <button onClick={()=>{setSel(null);setStep("list");}} style={{...S.btnGold,fontSize:14}}>Done</button>
      </div>
    </div>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS TAB
// ═══════════════════════════════════════════════════════════════
function NotificationsTab({sentNotifs,setSentNotifs,orders,toast}) {
  const [compose,setCompose]=useState(null);
  const [form,setForm]=useState({});
  const [channel,setChannel]=useState("whatsapp");
  const [phone,setPhone]=useState("");
  const [sending,setSending]=useState(false);

  const DEFS={booking:{name:"",room:"",checkIn:"",checkOut:"",rate:""},welcome:{name:"",room:""},order_ready:{name:"",orderId:"",table:"",items:"",total:""},checkout:{name:"",room:"",nights:"",roomTotal:"",fb:"",total:""},pool:{name:"",date:"",time:"",guests:""}};

  const preview=()=>{if(!compose)return"";try{return NOTIF_TEMPLATES[compose][channel==="whatsapp"?"wa":"sms"](form);}catch{return"";}};
  const send=()=>{
    if(!phone){toast("Enter phone!","error");return;}
    setSending(true);
    setTimeout(()=>{
      setSending(false);
      setSentNotifs(p=>[{id:Date.now(),label:NOTIF_TEMPLATES[compose].label,icon:NOTIF_TEMPLATES[compose].icon,channel,phone,to:form.name||"Guest",time:new Date().toLocaleString()},...p]);
      toast(`${channel==="whatsapp"?"WhatsApp":"SMS"} sent to ${phone}!`);
      setCompose(null);setPhone("");
    },1500);
  };

  return(
    <div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 6px",fontSize:24}}>💬 Notifications</h1>
      <p style={{color:"#64748b",fontSize:12,margin:"0 0 20px"}}>Send WhatsApp & SMS messages to guests</p>
      <div style={{background:"#1e3a5f",border:"1px solid #1e5f9f",borderRadius:10,padding:12,marginBottom:20,fontSize:12,color:"#93c5fd"}}>
        ℹ️ Connect WhatsApp Business API (Meta) or Africa's Talking SMS for live sending. Currently opens WhatsApp Web as fallback.
      </div>

      {/* Quick notify for ready orders */}
      {orders.filter(o=>o.status==="ready"&&o.guest).length>0&&(
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:20}}>
          <h3 style={{color:"#34d399",margin:"0 0 12px",fontSize:13}}>⚡ Quick Notify — Ready Orders</h3>
          {orders.filter(o=>o.status==="ready"&&o.guest).slice(0,4).map(o=>(
            <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #1e293b"}}>
              <div style={{fontSize:12,color:"#e2e8f0"}}>{o.guest} — {o.id} Table {o.table}</div>
              <button onClick={()=>{setCompose("order_ready");setForm({name:o.guest,orderId:o.id,table:o.table,items:o.items.map(i=>`• ${i.name} ×${i.qty}`).join("\n"),total:o.total.toLocaleString()});setPhone("");}} style={{background:"#065f46",border:"none",borderRadius:7,color:"#6ee7b7",cursor:"pointer",padding:"5px 12px",fontSize:11,fontWeight:700}}>📱 Notify</button>
            </div>
          ))}
        </div>
      )}

      {/* Templates */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:24}}>
        {Object.entries(NOTIF_TEMPLATES).map(([key,t])=>(
          <button key={key} onClick={()=>{setCompose(key);setForm({...DEFS[key]});setPhone("");}}
            style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18,cursor:"pointer",textAlign:"left"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#e2b96f"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#1e293b"}>
            <div style={{fontSize:26,marginBottom:7}}>{t.icon}</div>
            <div style={{fontWeight:700,color:"#e2e8f0",fontSize:12}}>{t.label}</div>
            <div style={{fontSize:10,color:"#475569",marginTop:3}}>Tap to compose</div>
          </button>
        ))}
      </div>

      {/* Sent log */}
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <h3 style={{color:"#e2b96f",margin:0,fontFamily:"'Playfair Display',serif",fontSize:14}}>Sent ({sentNotifs.length})</h3>
          {sentNotifs.length>0&&<button onClick={()=>setSentNotifs([])} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11}}>Clear All</button>}
        </div>
        {sentNotifs.length===0?<p style={{color:"#475569",fontSize:12,textAlign:"center",padding:16}}>No notifications sent yet.</p>:sentNotifs.map(n=>(
          <div key={n.id} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #1e293b"}}>
            <span style={{fontSize:18,flexShrink:0}}>{n.channel==="whatsapp"?"💬":"📩"}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{n.icon} {n.label}</span>
                <Badge c="#6ee7b7" bg="#065f46">Sent</Badge>
              </div>
              <div style={{fontSize:11,color:"#64748b"}}>To: {n.to} · +254{n.phone} · {n.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Modal */}
      {compose&&(
        <Modal title={`${NOTIF_TEMPLATES[compose].icon} ${NOTIF_TEMPLATES[compose].label}`} onClose={()=>setCompose(null)} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div>
              <div style={{display:"flex",gap:3,background:"#1e293b",borderRadius:8,padding:3,marginBottom:14}}>
                {[["whatsapp","💬 WhatsApp"],["sms","📩 SMS"]].map(([c,l])=>(
                  <button key={c} onClick={()=>setChannel(c)} style={{flex:1,padding:"7px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:channel===c?"#25d366":"none",color:channel===c?"#fff":"#64748b"}}>{l}</button>
                ))}
              </div>
              <div style={{marginBottom:12}}>
                <label style={S.label}>Phone Number *</label>
                <div style={{display:"flex",background:"#1e293b",border:"1px solid #334155",borderRadius:8,overflow:"hidden"}}>
                  <span style={{padding:"9px 11px",color:"#64748b",fontSize:12,borderRight:"1px solid #334155"}}>+254</span>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="7XX XXX XXX" style={{flex:1,padding:"9px 11px",background:"none",border:"none",color:"#e2e8f0",fontSize:12,outline:"none"}}/>
                </div>
              </div>
              {Object.keys(form).map(k=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={S.label}>{k.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase())}</label>
                  {k==="items"
                    ?<textarea style={{...S.input,minHeight:60,resize:"none"}} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
                    :<input style={S.input} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
                  }
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:6}}>
                <button onClick={()=>{const msg=encodeURIComponent(preview());const num="254"+phone.replace(/\D/g,"").replace(/^0/,"");window.open(`https://wa.me/${num}?text=${msg}`,"_blank");}} style={{flex:1,...S.btnBlue,fontSize:11}}>Open WhatsApp</button>
                <button onClick={send} disabled={sending} style={{flex:2,...S.btnGold,fontSize:13,opacity:sending?0.5:1}}>{sending?"Sending...":"📤 Send"}</button>
              </div>
            </div>
            <div>
              <label style={S.label}>Preview</label>
              <div style={{background:channel==="whatsapp"?"#075e54":"#1e293b",borderRadius:12,padding:14,minHeight:200}}>
                <div style={{background:channel==="whatsapp"?"#dcf8c6":"#2d3748",borderRadius:"10px 10px 10px 2px",padding:"10px 12px",maxWidth:"100%",wordBreak:"break-word"}}>
                  <pre style={{color:channel==="whatsapp"?"#111":"#e2e8f0",fontSize:12,margin:0,whiteSpace:"pre-wrap",fontFamily:"'Lato',sans-serif",lineHeight:1.6}}>{preview()}</pre>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS TAB
// ═══════════════════════════════════════════════════════════════
function AnalyticsTab({orders,rooms,inventory}) {
  const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return d;});
  const dayData=days.map(d=>({
    day:d.toLocaleDateString("en-KE",{weekday:"short"}),
    orders:orders.filter(o=>new Date(o.time).toDateString()===d.toDateString()).length,
    revenue:orders.filter(o=>new Date(o.time).toDateString()===d.toDateString()&&o.status==="served").reduce((s,o)=>s+o.total,0),
  }));
  const totalRev=orders.filter(o=>o.status==="served").reduce((s,o)=>s+o.total,0);
  const served=orders.filter(o=>o.status==="served").length;
  const avg=served>0?Math.round(totalRev/served):0;
  const catRev=orders.filter(o=>o.status==="served").reduce((acc,o)=>{o.items.forEach(i=>{acc[i.cat]=(acc[i.cat]||0)+i.price*i.qty;});return acc;},{});
  const pieData=Object.entries(catRev).map(([name,value])=>({name,value}));
  const COLORS=["#e2b96f","#60a5fa","#34d399","#f97316","#a78bfa","#22d3ee"];
  const staffPerf=orders.filter(o=>o.staffName).reduce((acc,o)=>{if(!acc[o.staffName])acc[o.staffName]={name:o.staffName,orders:0,revenue:0};acc[o.staffName].orders++;if(o.status==="served")acc[o.staffName].revenue+=o.total;return acc;},{});
  return(
    <div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 20px",fontSize:24}}>📊 Analytics</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:12,marginBottom:22}}>
        {[{l:"Total Revenue",v:`KES ${totalRev.toLocaleString()}`,c:"#34d399",icon:"💰"},
          {l:"Orders Served",v:served,c:"#60a5fa",icon:"✅"},
          {l:"Avg Order",v:`KES ${avg.toLocaleString()}`,c:"#e2b96f",icon:"📊"},
          {l:"Room Occupancy",v:`${Math.round(rooms.filter(r=>r.status==="occupied").length/rooms.length*100)}%`,c:"#a78bfa",icon:"🛏️"},
          {l:"Low Stock",v:inventory.filter(i=>i.qty<=i.reorder).length,c:"#f87171",icon:"⚠️"},
        ].map(c=>(
          <div key={c.l} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
            <div style={{fontSize:20,marginBottom:6}}>{c.icon}</div>
            <div style={{fontSize:18,fontWeight:800,color:c.c}}>{c.v}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:3}}>{c.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
          <h3 style={{color:"#e2b96f",margin:"0 0 14px",fontFamily:"'Playfair Display',serif",fontSize:14}}>Orders — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dayData}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis dataKey="day" tick={{fill:"#64748b",fontSize:10}}/><YAxis tick={{fill:"#64748b",fontSize:10}}/>
              <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e3a5f",borderRadius:7,color:"#e2e8f0",fontSize:11}}/>
              <Bar dataKey="orders" fill="#60a5fa" radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
          <h3 style={{color:"#e2b96f",margin:"0 0 14px",fontFamily:"'Playfair Display',serif",fontSize:14}}>Revenue — Last 7 Days (KES)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dayData}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis dataKey="day" tick={{fill:"#64748b",fontSize:10}}/><YAxis tick={{fill:"#64748b",fontSize:10}}/>
              <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e3a5f",borderRadius:7,color:"#e2e8f0",fontSize:11}} formatter={v=>`KES ${v.toLocaleString()}`}/>
              <Line type="monotone" dataKey="revenue" stroke="#e2b96f" strokeWidth={2} dot={{fill:"#e2b96f",r:3}}/></LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
          <h3 style={{color:"#e2b96f",margin:"0 0 14px",fontFamily:"'Playfair Display',serif",fontSize:14}}>Revenue by Category</h3>
          {pieData.length===0?<p style={{color:"#475569",fontSize:12}}>No revenue data yet.</p>:(
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                  {pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie><Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e3a5f",borderRadius:7,color:"#e2e8f0",fontSize:11}} formatter={v=>`KES ${v.toLocaleString()}`}/></PieChart>
              </ResponsiveContainer>
              <div style={{flex:1}}>{pieData.map((d,i)=>(
                <div key={d.name} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/><span style={{color:"#94a3b8"}}>{d.name}</span></div>
                  <span style={{color:"#e2e8f0",fontWeight:600}}>KES {d.value.toLocaleString()}</span>
                </div>
              ))}</div>
            </div>
          )}
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
          <h3 style={{color:"#e2b96f",margin:"0 0 14px",fontFamily:"'Playfair Display',serif",fontSize:14}}>Staff Performance</h3>
          {Object.values(staffPerf).length===0?<p style={{color:"#475569",fontSize:12}}>No data yet.</p>:Object.values(staffPerf).sort((a,b)=>b.revenue-a.revenue).map(s=>(
            <div key={s.name} style={{padding:"8px 0",borderBottom:"1px solid #1e293b"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:12,color:"#e2e8f0",fontWeight:600}}>{s.name}</span><span style={{fontSize:12,color:"#e2b96f",fontWeight:700}}>KES {s.revenue.toLocaleString()}</span></div>
              <div style={{fontSize:11,color:"#64748b"}}>{s.orders} orders</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GUEST QR TAB (Manager view)
// ═══════════════════════════════════════════════════════════════
function GuestQRTab({setGuestMode}) {
  const tables=["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","Pool Area","Room 101","Room 201","Room 301"];
  return(
    <div>
      <h1 style={{fontFamily:"'Playfair Display',serif",color:"#e2b96f",margin:"0 0 6px",fontSize:24}}>📱 Guest Menu</h1>
      <p style={{color:"#64748b",fontSize:13,margin:"0 0 20px"}}>Guests scan a QR code to browse the menu and place orders directly.</p>
      <div style={{background:"#1e3a5f",border:"1px solid #1e5f9f",borderRadius:12,padding:20,marginBottom:22,display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{fontSize:40}}>🔗</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,color:"#93c5fd",fontSize:14,marginBottom:6}}>Guest Menu URL</div>
          <code style={{background:"#0f172a",color:"#e2b96f",padding:"7px 12px",borderRadius:7,fontSize:13,display:"block",marginBottom:10}}>https://yourhotel.netlify.app/menu?table=T5</code>
          <p style={{color:"#64748b",fontSize:12,margin:0}}>The <code style={{background:"#1e293b",color:"#e2b96f",padding:"1px 6px",borderRadius:4,fontSize:11}}>?table=T5</code> parameter auto-fills the table number. Generate a unique QR code for each table using any free QR generator at qr-code-generator.com</p>
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <button onClick={()=>setGuestMode(true)} style={{...S.btnGold,fontSize:14,padding:"12px 24px"}}>👁️ Preview Guest Menu</button>
      </div>
      <h3 style={{color:"#60a5fa",margin:"0 0 12px",fontSize:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Generate QR Codes for Tables</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
        {tables.map(t=>(
          <div key={t} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:14,textAlign:"center"}}>
            <div style={{width:60,height:60,background:"#1e293b",borderRadius:8,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#475569",lineHeight:1.3}}>QR<br/>Code</div>
            <div style={{fontWeight:700,color:"#e2e8f0",fontSize:12,marginBottom:6}}>{t}</div>
            <a href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://yourhotel.netlify.app/menu?table=${t}`)}`} target="_blank" rel="noreferrer"
              style={{background:"#1e293b",border:"none",borderRadius:6,color:"#60a5fa",cursor:"pointer",padding:"4px 10px",fontSize:10,display:"inline-block",textDecoration:"none"}}>⬇️ Download</a>
          </div>
        ))}
      </div>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18,marginTop:22}}>
        <h3 style={{color:"#e2b96f",margin:"0 0 12px",fontFamily:"'Playfair Display',serif",fontSize:14}}>How It Works</h3>
        {[["1","Guest scans QR code at their table","The table number is automatically set in the menu URL"],["2","Guest browses the digital menu","Beautiful mobile-first menu with photos, descriptions & prices"],["3","Guest places order","Order goes directly to the kitchen display — no waiter needed"],["4","Kitchen receives the order","Marked as 'Guest (QR)' with a purple badge in the kitchen display"]].map(([n,title,sub])=>(
          <div key={n} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1e293b"}}>
            <div style={{width:24,height:24,background:"linear-gradient(135deg,#b8860b,#e2b96f)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#0a0f1a",fontWeight:800,fontSize:12,flexShrink:0}}>{n}</div>
            <div><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0",marginBottom:2}}>{title}</div><div style={{fontSize:11,color:"#64748b"}}>{sub}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
