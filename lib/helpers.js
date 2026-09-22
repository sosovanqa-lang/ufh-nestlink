const {one,run}=require('./db');
const STAFF_EMAIL='202249895@ufh.ac.za';
const normalizeEmail=(v)=>String(v||'').trim().toLowerCase();
function roleForEmail(email){ email=normalizeEmail(email); if(!email.endsWith('@ufh.ac.za')) return null; return email===STAFF_EMAIL?'residence_staff':'student'; }
function requireAuth(req,res,next){if(!req.session?.user)return res.status(401).json({error:'Please sign in first.'});next();}
function requireRole(...roles){return(req,res,next)=>{if(!req.session?.user)return res.status(401).json({error:'Please sign in first.'});if(!roles.includes(req.session.user.role))return res.status(403).json({error:'You are not authorised for this action.'});next();};}
function requireResidenceAccess(req,res,next){const u=req.session?.user;if(!u)return res.status(401).json({error:'Please sign in first.'});if(u.role!=='residence_staff')return res.status(403).json({error:'Residence staff access required.'});if(!u.residenceId)return res.status(403).json({error:'Your staff account is not assigned to a residence.'});const ids=[req.params?.residenceId,req.query?.residenceId,req.body?.residenceId].filter(v=>v!==undefined&&v!==null&&v!=='');if(ids.some(v=>Number(v)!==Number(u.residenceId)))return res.status(403).json({error:'You may only access your assigned residence.'});next();}
const allowedSort=(value,map,fallback)=>map[value]||map[fallback];
const allowedValue=(value,values,fallback=null)=>values.includes(value)?value:fallback;
function ref(prefix){return `${prefix}-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;}
function notify(userId,title,message,type='general',linkId=null){run('INSERT INTO Notifications(user_id,title,message,type,link_id) VALUES(?,?,?,?,?)',[userId,title,message,type,linkId]);}
function roomForStudent(userId){return one(`SELECT ra.allocation_id,r.room_id,r.room_number,r.floor_no,r.residence_id,rs.res_name FROM RoomAllocations ra JOIN Rooms r ON r.room_id=ra.room_id JOIN Residences rs ON rs.residence_id=r.residence_id WHERE ra.student_user_id=? AND ra.status='active' ORDER BY ra.allocated_on DESC LIMIT 1`,[userId]);}
module.exports={STAFF_EMAIL,normalizeEmail,roleForEmail,requireAuth,requireRole,requireResidenceAccess,allowedSort,allowedValue,ref,notify,roomForStudent};
