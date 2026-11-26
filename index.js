const {onCall,HttpsError}=require("firebase-functions/v2/https");
const {initializeApp}=require("firebase-admin/app");
const {getDatabase}=require("firebase-admin/database");
initializeApp();
exports.approvePointRequest=onCall(async(request)=>{
  if(!request.auth || request.auth.token.admin!==true) throw new HttpsError("permission-denied","Khusus admin.");
  const {uid,requestId}=request.data||{};
  if(typeof uid!=="string"||typeof requestId!=="string") throw new HttpsError("invalid-argument","Data permintaan tidak valid.");
  const db=getDatabase();
  const reqRef=db.ref(`pointRequests/${uid}/${requestId}`);
  const snap=await reqRef.get();
  if(!snap.exists()||snap.val().status!=="pending") throw new HttpsError("failed-precondition","Permintaan sudah diproses atau tidak ditemukan.");
  const amount=snap.val().amount;
  if(!Number.isInteger(amount)||amount<1||amount>100) throw new HttpsError("invalid-argument","Jumlah poin tidak valid.");
  const lock=await reqRef.transaction(v=>v&&v.status==="pending"?{...v,status:"processing"}:undefined);
  if(!lock.committed) throw new HttpsError("already-exists","Permintaan sedang diproses.");
  try {
    await db.ref(`users/${uid}/points`).transaction(v=>(Number(v)||0)+amount);
    await reqRef.update({status:"approved",approvedAt:Date.now(),approvedBy:request.auth.uid});
    return {success:true,amount};
  } catch(e) {
    await reqRef.update({status:"pending"});
    throw new HttpsError("internal","Gagal memperbarui poin.");
  }
});